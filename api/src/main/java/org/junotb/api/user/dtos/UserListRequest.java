package org.junotb.api.user.dtos;

import org.junotb.api.user.enums.UserRole;
import org.junotb.api.user.enums.UserStatus;

public record UserListRequest(
    String firstName,
    String lastName,
    UserRole role,
    UserStatus status
) {}
