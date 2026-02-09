package org.junotb.api.lessonfeedback;

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
    private final LessonFeedbackRepository lessonFeedbackRepository;

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
    public void processFeedbackAsync(Long lessonFeedbackId) {
        if (!enabled) {
            log.warn("Video processor disabled. lessonFeedbackId={}", lessonFeedbackId);
            return;
        }
        try {
            LessonFeedback feedback = lessonFeedbackRepository.findById(lessonFeedbackId).orElse(null);
            if (feedback == null || feedback.getVttContent() == null || feedback.getVttContent().isBlank()) {
                log.warn("vttContent not found for lessonFeedbackId={}", lessonFeedbackId);
                markFailed(lessonFeedbackId);
                return;
            }
            String feedbackContent = videoProcessService.generateFeedback(feedback.getVttContent());
            feedback.setFeedbackContent(feedbackContent);
            feedback.setFeedbackStatus(LessonFeedbackStatus.COMPLETED);
            lessonFeedbackRepository.save(feedback);
            log.info("Feedback generated. lessonFeedbackId={}", lessonFeedbackId);
        } catch (Exception e) {
            log.error("Feedback generation failed. lessonFeedbackId={}", lessonFeedbackId, e);
            markFailed(lessonFeedbackId);
        }
    }

    private void markFailed(Long lessonFeedbackId) {
        try {
            lessonFeedbackRepository.findById(lessonFeedbackId).ifPresent(f -> {
                f.setFeedbackStatus(LessonFeedbackStatus.FAILED);
                lessonFeedbackRepository.save(f);
            });
        } catch (Exception ex) {
            log.warn("Failed to mark lessonFeedback as FAILED. id={}", lessonFeedbackId, ex);
        }
    }
}
