package org.junotb.api.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
    String code,
    String message,
    Map<String, String> validationErrors,
    LocalDateTime timestamp
) {
    public static ErrorResponse of(String code, String message) {
        return new ErrorResponse(code, message, null, LocalDateTime.now());
    }

    public static ErrorResponse of(String code, String message, Map<String, String> validationErrors) {
        return new ErrorResponse(code, message, validationErrors, LocalDateTime.now());
    }
}
