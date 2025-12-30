package org.junotb.api.user.web;

import org.junotb.api.user.User;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;

import java.time.OffsetDateTime;

public record UserResponse(
    String id,
    String name,
    String email,
    Boolean emailVerified,
    String image,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt,
    UserRole role,
    UserStatus status
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getEmailVerified(),
            user.getImage(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            user.getRole(),
            user.getStatus()
        );
    }
}
