package org.junotb.api.user;

import lombok.RequiredArgsConstructor;
import org.junotb.api.common.exception.DuplicateResourceException;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.user.dtos.UserCreateRequest;
import org.junotb.api.user.dtos.UserListRequest;
import org.junotb.api.user.dtos.UserUpdateRequest;
import org.junotb.api.user.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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

    public Page<User> findList(UserListRequest request, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (request.firstName() != null && !request.firstName().isBlank()) {
                predicates = cb.and(
                    predicates,
                    cb.like(root.get("firstName"), "%" + request.firstName() + "%")
                );
            }

            if (request.lastName() != null && !request.lastName().isBlank()) {
                predicates = cb.and(
                    predicates,
                    cb.like(root.get("lastName"), "%" + request.lastName() + "%")
                );
            }

            if (request.role() != null) {
                predicates = cb.and(
                    predicates,
                    cb.equal(root.get("role"), request.role())
                );
            }

            if (request.status() != null) {
                predicates = cb.and(
                    predicates,
                    cb.equal(root.get("status"), request.status())
                );
            }

            return predicates;
        };

        return userRepository.findAll(spec, pageable);
    }

    public List<Schedule> findScheduleById(Long userId) {
        return scheduleRepository.findByUserId(userId);
    }

    @Transactional
    public User create(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username", request.username());
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email", request.email());
        }

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
        return userRepository.findById(id).map(user -> {
            if (request.firstName() != null) user.setFirstName(request.firstName());
            if (request.lastName() != null) user.setLastName(request.lastName());
            if (request.email() != null) user.setEmail(request.email());
            if (request.description() != null) user.setDescription(request.description());
            if (request.role() != null) user.setRole(request.role());
            if (request.status() != null) user.setStatus(request.status());
            return user;
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
