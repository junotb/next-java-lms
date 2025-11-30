package org.junotb.api.user;

import lombok.RequiredArgsConstructor;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.user.dtos.UserCreateRequest;
import org.junotb.api.user.dtos.UserUpdateRequest;
import org.junotb.api.user.enums.UserRole;
import org.junotb.api.user.enums.UserStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> findByRole(UserRole role, Pageable pageable) { return userRepository.findByRole(role, pageable); }

    public List<Schedule> findSchedulesById(Long userId) {
        return scheduleRepository.findByUserId(userId);
    }

    @Transactional
    public User create(UserCreateRequest request) {
        User user = User.create(
            request.username(),
            request.password(),
            request.firstName(),
            request.lastName(),
            request.email(),
            request.description(),
            request.role(),
            request.status()
        );

        return userRepository.save(user);
    }

    @Transactional
    public Optional<User> update(Long id, UserUpdateRequest request) {
        return userRepository.findById(id).map(existingUser -> {
            if (
                request.firstName() != null &&
                request.lastName() != null &&
                request.email() != null &&
                request.description() != null
            ) {
                existingUser.setFirstName(request.firstName());
                existingUser.setLastName(request.lastName());
                existingUser.setEmail(request.email());
                existingUser.setDescription(request.description());
            }

            if (request.role() != null) existingUser.setRole(request.role());
            if (request.status() != null) existingUser.setStatus(request.status());

            return existingUser;
        });
    }

    @Transactional
    public boolean delete(Long id) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setStatus(UserStatus.INACTIVE);
            return true;
        }).orElse(false);
    }
}
