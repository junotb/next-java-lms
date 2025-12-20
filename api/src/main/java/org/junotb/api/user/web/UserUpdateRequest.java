package org.junotb.api.user.web;

import org.junotb.api.user.enums.UserRole;
import org.junotb.api.user.enums.UserStatus;

public record UserUpdateRequest(
    String firstName,
    String lastName,
    String email,
    String description,
    UserRole role,
    UserStatus status
) {}
