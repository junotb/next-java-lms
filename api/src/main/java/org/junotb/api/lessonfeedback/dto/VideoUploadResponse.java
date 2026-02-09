package org.junotb.api.lessonfeedback.dto;

/**
 * 비디오 업로드 수락 응답.
 */
public record VideoUploadResponse(
    Long lessonFeedbackId,
    String status
) {}
