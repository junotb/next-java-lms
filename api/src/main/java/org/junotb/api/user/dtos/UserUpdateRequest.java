package org.junotb.api.user.dtos;

import org.junotb.api.user.enums.UserRole;
import org.junotb.api.user.enums.UserStatus;

public record UserUpdateRequest(
    String username,
    String password,
    String firstName,
    String lastName,
    String email,
    String description,
    UserRole role,
    UserStatus status
) {
    public static UserUpdateRequest of(
        String username,
        String password,
        String firstName,
        String lastName,
        String email,
        String description,
        UserRole role,
        UserStatus status
    ) {
        return new UserUpdateRequest(
            username,
            password,
            firstName,
            lastName,
            email,
            description,
            role,
            status
        );
    }
}
