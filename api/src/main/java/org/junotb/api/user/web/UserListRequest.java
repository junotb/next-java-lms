package org.junotb.api.user.web;

import org.junotb.api.user.enums.UserRole;
import org.junotb.api.user.enums.UserStatus;

public record UserListRequest(
    String firstName,
    String lastName,
    UserRole role,
    UserStatus status
) {}
