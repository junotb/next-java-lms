package org.junotb.api.registration.web;

import org.junotb.api.registration.Registration;
import org.junotb.api.registration.RegistrationStatus;

import java.time.OffsetDateTime;

public record RegistrationResponse(
    Long id,
    Long scheduleId,
    String studentId,
    RegistrationStatus status,
    OffsetDateTime registeredAt
) {
    public static RegistrationResponse from(Registration registration) {
        return new RegistrationResponse(
            registration.getId(),
            registration.getSchedule().getId(),
            registration.getStudent().getId(),
            registration.getStatus(),
            registration.getRegisteredAt()
        );
    }
}
