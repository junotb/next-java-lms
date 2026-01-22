package org.junotb.api.registration.web;

import jakarta.validation.constraints.NotNull;

public record RegistrationRequest(
    @NotNull(message = "Schedule ID is required")
    Long scheduleId
) {}
