package org.junotb.api.common.exception;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException {
    private final String field;
    private final String value;

    public ResourceNotFoundException(String field, String value) {
        super("Resource not found with " + field + " '" + value + "'.");
        this.field = field;
        this.value = value;
    }
}