package org.junotb.api.user;

import jakarta.persistence.EntityExistsException;
import org.junotb.api.common.exception.DuplicateResourceException;
import org.junotb.api.user.web.UserCreateRequest;
import org.junotb.api.user.web.UserUpdateRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junotb.api.user.UserRole.*;
import static org.junotb.api.user.UserStatus.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @InjectMocks
    UserService userService;

    @Test
    @DisplayName("사용자 생성 시 이메일 중복이면 예외 발생")
    void create_fail_duplicate() {
        UserCreateRequest request = new UserCreateRequest("Alice", "alice@example.com", TEACHER, ACTIVE);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.create(request)).isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    @DisplayName("수정 시 사용자가 존재하지 않으면 예외 발생")
    void update_fail_notFound() {
        when(userRepository.findById("none")).thenReturn(Optional.empty());
        UserUpdateRequest request = new UserUpdateRequest("Name", "email@test.com", TEACHER, ACTIVE);

        assertThatThrownBy(() -> userService.update("none", request)).isInstanceOf(EntityExistsException.class);
    }
}