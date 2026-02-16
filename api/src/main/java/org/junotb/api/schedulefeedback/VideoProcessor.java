package org.junotb.api.schedulefeedback;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * 비디오 처리 트리거. VideoProcessService를 호출하여 VTT 추출 및 피드백 생성.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class VideoProcessor {

    private final VideoProcessService videoProcessService;
    private final ScheduleFeedbackRepository scheduleFeedbackRepository;

    @Value("${app.video-processor.enabled:true}")
    private boolean enabled;

    /**
     * VTT만 동기 추출. 성공 시 VTT 문자열 반환. 실패 시 예외.
     */
    public String extractVttSync(Long scheduleId, String videoFilePath) {
        if (!enabled) {
            throw new IllegalStateException("비디오 프로세서가 비활성화되어 있습니다.");
        }
        try {
            return videoProcessService.extractVtt(videoFilePath);
        } catch (Exception e) {
            log.warn("VTT extraction failed. scheduleId={}", scheduleId, e);
            throw new IllegalStateException("VTT 추출에 실패했습니다. 비디오 형식 및 음성을 확인해 주세요.");
        }
    }

    /**
     * 피드백 생성만 비동기 실행 (vttContent는 DB에 이미 존재해야 함).
     */
    @Async
    public void processFeedbackAsync(Long scheduleFeedbackId) {
        if (!enabled) {
            log.warn("Video processor disabled. scheduleFeedbackId={}", scheduleFeedbackId);
            return;
        }
        try {
            ScheduleFeedback feedback = scheduleFeedbackRepository.findById(scheduleFeedbackId).orElse(null);
            if (feedback == null || feedback.getVttContent() == null || feedback.getVttContent().isBlank()) {
                log.warn("vttContent not found for scheduleFeedbackId={}", scheduleFeedbackId);
                markFailed(scheduleFeedbackId);
                return;
            }
            String feedbackContent = videoProcessService.generateFeedback(feedback.getVttContent());
            feedback.setFeedbackContent(feedbackContent);
            feedback.setFeedbackStatus(ScheduleFeedbackStatus.COMPLETED);
            scheduleFeedbackRepository.save(feedback);
            log.info("Feedback generated. scheduleFeedbackId={}", scheduleFeedbackId);
        } catch (Exception e) {
            log.error("Feedback generation failed. scheduleFeedbackId={}", scheduleFeedbackId, e);
            markFailed(scheduleFeedbackId);
        }
    }

    private void markFailed(Long scheduleFeedbackId) {
        try {
            scheduleFeedbackRepository.findById(scheduleFeedbackId).ifPresent(f -> {
                f.setFeedbackStatus(ScheduleFeedbackStatus.FAILED);
                scheduleFeedbackRepository.save(f);
            });
        } catch (Exception ex) {
            log.warn("Failed to mark scheduleFeedback as FAILED. id={}", scheduleFeedbackId, ex);
        }
    }
}
