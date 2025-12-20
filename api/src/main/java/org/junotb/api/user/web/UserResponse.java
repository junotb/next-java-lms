package org.junotb.api.user.web;

import org.junotb.api.user.User;
import org.junotb.api.user.enums.UserRole;
import org.junotb.api.user.enums.UserStatus;

import java.time.OffsetDateTime;

public record UserResponse(
    Long id,
    String username,
    String password,
    String firstName,
    String lastName,
    String email,
    String description,
    UserRole role,
    UserStatus status,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getPassword(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getDescription(),
            user.getRole(),
            user.getStatus(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
