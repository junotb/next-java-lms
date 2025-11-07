package org.junotb.api.user.dtos;

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
) {
    public static UserCreateRequest of(
        String username,
        String password,
        String firstName,
        String lastName,
        String email,
        String description,
        UserRole role,
        UserStatus status
    ) {
        return new UserCreateRequest(
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
