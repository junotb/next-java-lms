package org.junotb.api.domain.teacherSchedule;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public record TeacherScheduleId(Long value) implements Serializable {
    public TeacherScheduleId {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException("TeacherScheduleId must be positive");
        }
    }
}
