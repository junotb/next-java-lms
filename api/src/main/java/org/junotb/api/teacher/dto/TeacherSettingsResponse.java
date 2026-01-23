package org.junotb.api.teacher.dto;

import java.util.List;

public record TeacherSettingsResponse(
    List<TeacherAvailabilityResponse> availabilities,
    List<TeacherTimeOffResponse> timeOffs
) {
}
