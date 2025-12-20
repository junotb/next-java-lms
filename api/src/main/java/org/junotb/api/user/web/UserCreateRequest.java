package org.junotb.api.user.web;

import org.junotb.api.user.enums.UserRole;
import org.junotb.api.user.enums.UserStatus;

public record UserCreateRequest(
    String username,
    String password,
    String firstName,
    String lastName,
    String email,
    String description,
    UserRole role,
    UserStatus status
) {}
