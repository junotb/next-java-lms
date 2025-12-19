package org.junotb.api.common.exception;

import lombok.Getter;

@Getter
public class DuplicateResourceException extends RuntimeException {
    private final String field;
    private final String value;

    public DuplicateResourceException(String field, String value) {
        super("Resource with " + field + " '" + value + "' already exists.");
        this.field = field;
        this.value = value;
    }
}