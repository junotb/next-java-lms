package org.junotb.api.user.web;

import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;

public record UserListRequest(
    String firstName,
    String lastName,
    UserRole role,
    UserStatus status
) {}
