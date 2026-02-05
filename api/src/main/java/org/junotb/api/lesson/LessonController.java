package org.junotb.api.lesson;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.junotb.api.lesson.dto.LessonAccessResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/lessons")
@RequiredArgsConstructor
@Tag(name = "Lesson", description = "수업방(레슨) API")
public class LessonController {

    private final LessonService lessonService;

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
}
