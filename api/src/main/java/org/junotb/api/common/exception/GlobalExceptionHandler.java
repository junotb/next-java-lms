package org.junotb.api.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<?> handleDuplicateResourceException(DuplicateResourceException ex) {
        return ResponseEntity
            .status(409)
            .body(Map.of(
                "error", "DUPLICATE_RESOURCE",
                "field", ex.getField(),
                "value", ex.getValue(),
                "message", ex.getMessage()
            ));
    }
}
