package org.junotb.api.lessonfeedback;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junotb.api.common.exception.ResourceNotFoundException;
import org.junotb.api.lessonfeedback.dto.LessonFeedbackResponse;
import org.junotb.api.lessonfeedback.dto.VideoUploadResponse;
import org.junotb.api.registration.RegistrationRepository;
import org.junotb.api.registration.RegistrationStatus;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.schedule.ScheduleStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LessonFeedbackService {

    private final LessonFeedbackRepository lessonFeedbackRepository;
    private final ScheduleRepository scheduleRepository;
    private final RegistrationRepository registrationRepository;
    private final VideoProcessor videoProcessor;

    /**
     * 비디오 업로드 수락. 강사 전용, ATTENDED 수업만.
     * VTT 추출 성공 시에만 LessonFeedback 저장. 실패 시 DB 미저장, 예외 발생.
     */
    @Transactional
    public VideoUploadResponse uploadVideo(Long scheduleId, String teacherId, MultipartFile file) throws IOException {
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new ResourceNotFoundException("Schedule", scheduleId.toString()));

        if (!schedule.getUser().getId().equals(teacherId)) {
            throw new IllegalStateException("수업 영상 업로드는 해당 수업의 강사만 가능합니다.");
        }
        if (schedule.getStatus() != ScheduleStatus.ATTENDED) {
            throw new IllegalStateException("수업 종료(출석) 처리된 수업만 영상을 업로드할 수 있습니다.");
        }
        if (lessonFeedbackRepository.findByScheduleId(scheduleId).isPresent()) {
            throw new IllegalStateException("이미 피드백이 등록된 수업입니다.");
        }
        if (file.isEmpty()) {
            throw new IllegalArgumentException("비디오 파일이 비어 있습니다.");
        }

        Path tempFile = Files.createTempFile("lesson-video-", "-" + UUID.randomUUID() + getExtension(file));
        try {
            file.transferTo(tempFile.toFile());

            String vttContent = videoProcessor.extractVttSync(scheduleId, tempFile.toString());

            LessonFeedback feedback = LessonFeedback.create(schedule, vttContent);
            feedback = lessonFeedbackRepository.save(feedback);

            videoProcessor.processFeedbackAsync(feedback.getId());

            return new VideoUploadResponse(feedback.getId(), LessonFeedbackStatus.PENDING.name());
        } finally {
            try {
                Files.deleteIfExists(tempFile);
            } catch (IOException e) {
                log.warn("Failed to delete temp file: {}", tempFile, e);
            }
        }
    }

    /**
     * 수업 피드백 조회. 해당 수업의 강사 또는 수강생만.
     */
    @Transactional(readOnly = true)
    public LessonFeedbackResponse getFeedback(Long scheduleId, String userId) {
        LessonFeedback feedback = lessonFeedbackRepository.findByScheduleId(scheduleId)
            .orElseThrow(() -> new ResourceNotFoundException("LessonFeedback", scheduleId.toString()));

        Schedule schedule = feedback.getSchedule();
        boolean isTeacher = schedule.getUser().getId().equals(userId);
        boolean isStudent = registrationRepository.findByScheduleIdAndStudentId(scheduleId, userId)
            .filter(r -> r.getStatus() == RegistrationStatus.REGISTERED)
            .isPresent();

        if (!isTeacher && !isStudent) {
            throw new IllegalStateException("해당 수업의 피드백을 조회할 권한이 없습니다.");
        }

        return LessonFeedbackResponse.from(feedback);
    }

    private static String getExtension(MultipartFile file) {
        String name = file.getOriginalFilename();
        if (name == null || !name.contains(".")) return "";
        return name.substring(name.lastIndexOf('.'));
    }
}
