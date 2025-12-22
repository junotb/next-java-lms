package org.junotb.api.user;

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
    @DisplayName("사용자 고유번호로 조회하면 Optional 반환")
    void findById() {
        User user = User.create(
            "alice",
            "password",
            "Alice",
            "Anderson",
            "alice@example.com",
            "Ace teacher",
            TEACHER,
            ACTIVE
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> result = userService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getUsername()).isEqualTo("alice");
    }

    @Test
    @DisplayName("사용자 정보를 생성하고 저장")
    void create() {
        UserCreateRequest request = new UserCreateRequest(
            "alice",
            "password",
            "Alice",
            "Anderson",
            "alice@example.com",
            "Ace teacher",
            TEACHER,
            ACTIVE
        );

        // 중복 체크
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);

        User saved = User.create(
            "alice",
            "password",
            "Alice",
            "Anderson",
            "alice@example.com",
            "Ace teacher",
            TEACHER,
            ACTIVE
        );
        when(userRepository.save(any(User.class))).thenReturn(saved);

        User created = userService.create(request);

        assertThat(created.getUsername()).isEqualTo("alice");
        assertThat(created.getStatus()).isEqualTo(ACTIVE);
    }

    @Test
    @DisplayName("사용자 정보를 수정하고 반환")
    void update() {
        User user = User.create(
            "alice",
            "password",
            "Alice",
            "Anderson",
            "alice@example.com",
            "Ace teacher",
            TEACHER,
            ACTIVE
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserUpdateRequest request = new UserUpdateRequest(
            "Beta",
            "Bartender",
            "beta@example.com",
            "Beta teacher",
            TEACHER,
            INACTIVE
        );

        User updated = userService.update(1L, request);

        assertThat(updated.getFirstName()).isEqualTo("Beta");
        assertThat(updated.getLastName()).isEqualTo("Bartender");
        assertThat(updated.getEmail()).isEqualTo("beta@example.com");
        assertThat(updated.getStatus()).isEqualTo(INACTIVE);
    }

    @Test
    @DisplayName("사용자 정보를 비활성화 상태로 변경")
    void delete() {
        User user = User.create(
            "alice",
            "password",
            "Alice",
            "Anderson",
            "alice@example.com",
            "Ace teacher",
            TEACHER,
            ACTIVE
        );
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        userService.delete(1L);

        assertThat(user.getStatus()).isEqualTo(INACTIVE);
    }
}