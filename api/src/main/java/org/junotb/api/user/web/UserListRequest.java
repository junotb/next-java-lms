package org.junotb.api.user.web;

import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;

public record UserListRequest(
    String name,
    UserRole role,
    UserStatus status
) {
    public static UserListRequest empty() {
        return new UserListRequest(
            null,
            null,
            null
        );
    }
}
