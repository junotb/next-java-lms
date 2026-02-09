package org.junotb.api.lesson;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junotb.api.common.exception.ResourceNotFoundException;
import org.junotb.api.common.security.AuthenticationFilter;
import org.junotb.api.lessonfeedback.LessonFeedbackService;
import org.junotb.api.lessonfeedback.LessonFeedbackStatus;
import org.junotb.api.lessonfeedback.dto.LessonFeedbackResponse;
import org.junotb.api.lessonfeedback.dto.VideoUploadResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * {@link LessonController} API 슬라이스 테스트.
 */
@WebMvcTest(LessonController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("LessonController Slice Test")
class LessonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LessonService lessonService;

    @MockBean
    private LessonFeedbackService lessonFeedbackService;

    @MockBean
    private AuthenticationFilter authenticationFilter;

    @Test
    @DisplayName("uploadVideo_whenValidRequest_thenReturn201")
    void uploadVideo_whenValidRequest_thenReturn201() throws Exception {
        Long scheduleId = 1L;
        String teacherId = "teacher-123";
        VideoUploadResponse response = new VideoUploadResponse(100L, "PENDING");

        given(lessonFeedbackService.uploadVideo(eq(scheduleId), eq(teacherId), any(MultipartFile.class)))
            .willReturn(response);

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(teacherId, null, null));
        SecurityContextHolder.setContext(securityContext);

        try {
            mockMvc.perform(multipart("/api/v1/lessons/{scheduleId}/video", scheduleId)
                    .file("file", "test-video.mp4".getBytes())
                    .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.lessonFeedbackId").value(100))
                .andExpect(jsonPath("$.status").value("PENDING"));
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("uploadVideo_whenUnauthorized_thenReturn400")
    void uploadVideo_whenUnauthorized_thenReturn400() throws Exception {
        Long scheduleId = 1L;
        String teacherId = "teacher-123";

        given(lessonFeedbackService.uploadVideo(eq(scheduleId), eq(teacherId), any(MultipartFile.class)))
            .willThrow(new IllegalStateException("수업 영상 업로드는 해당 수업의 강사만 가능합니다."));

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(teacherId, null, null));
        SecurityContextHolder.setContext(securityContext);

        try {
            mockMvc.perform(multipart("/api/v1/lessons/{scheduleId}/video", scheduleId)
                    .file("file", "test-video.mp4".getBytes())
                    .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest());
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("getFeedback_whenAuthorized_thenReturn200")
    void getFeedback_whenAuthorized_thenReturn200() throws Exception {
        Long scheduleId = 1L;
        String userId = "user-123";
        LessonFeedbackResponse response = new LessonFeedbackResponse(
            scheduleId,
            "Java Basics",
            OffsetDateTime.now().minusHours(1),
            OffsetDateTime.now(),
            "WEBVTT\n\n00:00:00.000 --> 00:00:01.000\n수업 내용",
            "AI 피드백 내용",
            LessonFeedbackStatus.COMPLETED,
            OffsetDateTime.now(),
            OffsetDateTime.now()
        );

        given(lessonFeedbackService.getFeedback(scheduleId, userId)).willReturn(response);

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(userId, null, null));
        SecurityContextHolder.setContext(securityContext);

        try {
            mockMvc.perform(get("/api/v1/lessons/{scheduleId}/feedback", scheduleId)
                    .header("Authorization", "Bearer test-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.scheduleId").value(scheduleId))
                .andExpect(jsonPath("$.courseTitle").value("Java Basics"))
                .andExpect(jsonPath("$.vttContent").exists())
                .andExpect(jsonPath("$.feedbackContent").value("AI 피드백 내용"))
                .andExpect(jsonPath("$.feedbackStatus").value("COMPLETED"));
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("getFeedback_whenUnauthorized_thenReturn400")
    void getFeedback_whenUnauthorized_thenReturn400() throws Exception {
        Long scheduleId = 1L;
        String userId = "unauthorized-user";

        given(lessonFeedbackService.getFeedback(scheduleId, userId))
            .willThrow(new IllegalStateException("해당 수업의 피드백을 조회할 권한이 없습니다."));

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(userId, null, null));
        SecurityContextHolder.setContext(securityContext);

        try {
            mockMvc.perform(get("/api/v1/lessons/{scheduleId}/feedback", scheduleId)
                    .header("Authorization", "Bearer test-token"))
                .andExpect(status().isBadRequest());
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("getFeedback_whenNotFound_thenReturn404")
    void getFeedback_whenNotFound_thenReturn404() throws Exception {
        Long scheduleId = 999L;
        String userId = "user-123";

        given(lessonFeedbackService.getFeedback(scheduleId, userId))
            .willThrow(new ResourceNotFoundException("LessonFeedback", scheduleId.toString()));

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(userId, null, null));
        SecurityContextHolder.setContext(securityContext);

        try {
            mockMvc.perform(get("/api/v1/lessons/{scheduleId}/feedback", scheduleId)
                    .header("Authorization", "Bearer test-token"))
                .andExpect(status().isNotFound());
        } finally {
            SecurityContextHolder.clearContext();
        }
    }
}
