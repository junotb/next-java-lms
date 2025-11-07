package org.junotb.api.user.dtos;

import org.junotb.api.user.User;

public record UserDto(Long id) {
    public static UserDto from(User user) {
        return new UserDto(user.getId());
    }
}
