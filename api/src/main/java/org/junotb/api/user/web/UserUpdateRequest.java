package org.junotb.api.user.web;

import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;

public record UserUpdateRequest(
    String name,
    String email,
    UserRole role,
    UserStatus status
) {}
