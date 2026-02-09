package org.junotb.api.lesson;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.junotb.api.lesson.dto.LessonAccessResponse;
import org.junotb.api.lessonfeedback.LessonFeedbackService;
import org.junotb.api.lessonfeedback.dto.LessonFeedbackResponse;
import org.junotb.api.lessonfeedback.dto.VideoUploadResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/lessons")
@RequiredArgsConstructor
@Tag(name = "Lesson", description = "수업방(레슨) API")
public class LessonController {

    private final LessonService lessonService;
    private final LessonFeedbackService lessonFeedbackService;

    @GetMapping("/{scheduleId}/access")
    @Operation(summary = "입장 권한 확인", description = "해당 스케줄(수업)에 대한 입장 가능 여부와 역할을 반환합니다.")
    public ResponseEntity<LessonAccessResponse> checkAccess(
        @PathVariable Long scheduleId,
        @AuthenticationPrincipal String userId
    ) {
        LessonAccessResponse response = lessonService.validateAccess(scheduleId, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{scheduleId}/finish")
    @Operation(summary = "수업 종료", description = "강사 전용. 수업을 종료하고 출석(ATTENDED) 처리합니다.")
    public ResponseEntity<Void> finishLesson(
        @PathVariable Long scheduleId,
        @AuthenticationPrincipal String teacherId
    ) {
        lessonService.finishLesson(scheduleId, teacherId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{scheduleId}/video")
    @Operation(summary = "수업 영상 업로드", description = "강사 전용. 수업 종료 후 비디오 업로드 → VTT 변환 → Gemini 피드백 생성.")
    public ResponseEntity<VideoUploadResponse> uploadVideo(
        @PathVariable Long scheduleId,
        @AuthenticationPrincipal String teacherId,
        @RequestParam("file") MultipartFile file
    ) throws IOException {
        VideoUploadResponse response = lessonFeedbackService.uploadVideo(scheduleId, teacherId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{scheduleId}/feedback")
    @Operation(summary = "수업 피드백 조회", description = "해당 수업의 강사 또는 수강생이 vttContent, feedbackContent 조회.")
    public ResponseEntity<LessonFeedbackResponse> getFeedback(
        @PathVariable Long scheduleId,
        @AuthenticationPrincipal String userId
    ) {
        LessonFeedbackResponse response = lessonFeedbackService.getFeedback(scheduleId, userId);
        return ResponseEntity.ok(response);
    }
}
