package org.junotb.api.user.dtos;

import org.junotb.api.user.User;
import org.junotb.api.user.enums.UserRole;
import org.junotb.api.user.enums.UserStatus;

import java.time.OffsetDateTime;

public record UserDto(
    Long id,
    String username,
    String firstName,
    String lastName,
    String email,
    String description,
    UserRole role,
    UserStatus status,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static UserDto from(User user) {
        return new UserDto(
            user.getId(),
            user.getUsername(),
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
