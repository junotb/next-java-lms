package org.junotb.api.user;

import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.user.dtos.UserCreateRequest;
import org.junotb.api.user.dtos.UserUpdateRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junotb.api.user.enums.UserRole.*;
import static org.junotb.api.user.enums.UserStatus.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    ScheduleRepository scheduleRepository;

    @InjectMocks
    UserService userService;

    @Test
    @DisplayName("should create a new user and save it to the repository")
    void createUser() {
        // given
        UserCreateRequest request = new UserCreateRequest(
            "alice.anderson@example.com",
            "password",
            "Anderson",
            "Alice",
            "alice.anderson@example.com",
            "Ace teacher",
            TEACHER,
            ACTIVE
        );

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        when(userRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        User created = userService.create(request);
        verify(userRepository).save(captor.capture());
        User savedUser = captor.getValue();

        assertThat(savedUser.getUsername()).isEqualTo("alice.anderson@example.com");
        assertThat(created.getStatus()).isEqualTo(ACTIVE);
    }

    @Test
    @DisplayName("특정 사용자 ID로 조회하면 Optional 반환")
    void findById() {
        // given
        User user = User.create(
            "alice.anderson@example.com",
            "password",
            "Anderson",
            "Alice",
            "alice.anderson@example.com",
            "Ace teacher",
            TEACHER,
            ACTIVE
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> result = userService.findById(1L);

        assertThat(result).isPresent();
    }

    @Test
    @DisplayName("역할(role)로 사용자 조회")
    void findByRole() {
        User user = User.create(
            "alice.anderson@example.com",
            "password",
            "Anderson",
            "Alice",
            "alice.anderson@example.com",
            "Ace teacher",
            TEACHER,
            ACTIVE
        );
        Pageable pageable = Pageable.ofSize(10).withPage(0);
        when(userRepository.findByRole(TEACHER, pageable)).thenReturn(List.of(user));

        List<User> result = userService.findByRole(TEACHER, pageable);

        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("should update an existing user's information")
    void updateUser() {
        User user = User.create(
            "alice.anderson@example.com",
            "password",
            "Anderson",
            "Alice",
            "alice.anderson@example.com",
            "Ace teacher",
            TEACHER,
            ACTIVE
        );
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserUpdateRequest request = new UserUpdateRequest(
            "beta.bartender@example.com",
            "password",
            "Beta",
            "Bartender",
            "beta.bartender@example.com",
            "Beta teacher",
            TEACHER,
            INACTIVE
        );

        Optional<User> updated = userService.update(1L, request);

        assertThat(updated).isPresent();
        assertThat(user.getFirstName()).isEqualTo("Beta");
        assertThat(user.getEmail()).isEqualTo("beta.bartender@example.com");
    }

    @Test
    @DisplayName("should deactivate a user instead of deleting them")
    void deleteUser() {
        // given
        User user = User.create(
            "alice.anderson@example.com",
            "password",
            "Anderson",
            "Alice",
            "alice.anderson@example.com",
            "Ace teacher",
            TEACHER,
            ACTIVE
        );
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        boolean result = userService.delete(1L);

        assertThat(result).isTrue();
        assertThat(user.getStatus()).isEqualTo(INACTIVE);
    }

    @Test
    @DisplayName("should find schedules by user ID")
    void findSchedules() {
        Schedule schedule = mock(Schedule.class);
        when(scheduleRepository.findByUserId(1L)).thenReturn(List.of(schedule));

        List<Schedule> result = userService.findSchedulesById(1L);

        assertThat(result).hasSize(1);
    }
}