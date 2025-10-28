package org.junotb.api.domain.teacher;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public record TeacherId(Long value) implements Serializable {
    public TeacherId {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException("TeacherId must be positive");
        }
    }
}
