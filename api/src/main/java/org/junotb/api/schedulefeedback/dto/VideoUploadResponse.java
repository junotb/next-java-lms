package org.junotb.api.schedulefeedback.dto;

/**
 * 비디오 업로드 수락 응답.
 */
public record VideoUploadResponse(
    Long scheduleFeedbackId,
    String status
) {}
