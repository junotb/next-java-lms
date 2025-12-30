package org.junotb.api.user;

import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.exception.DuplicateResourceException;
import org.junotb.api.user.web.UserCreateRequest;
import org.junotb.api.user.web.UserListRequest;
import org.junotb.api.user.web.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    // 사용자 조회
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    // 사용자 목록 조회
    public Page<User> findList(UserListRequest request, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (request.name() != null && !request.name().isBlank()) {
                predicates = cb.and(
                    predicates,
                    cb.like(root.get("\"name\""), "%" + request.name() + "%")
                );
            }

            if (request.role() != null) {
                predicates = cb.and(
                    predicates,
                    cb.equal(root.get("\"role\""), request.role())
                );
            }

            if (request.status() != null) {
                predicates = cb.and(
                    predicates,
                    cb.equal(root.get("\"status\""), request.status())
                );
            }

            return predicates;
        };

        return userRepository.findAll(spec, pageable);
    }

    // 사용자 생성
    @Transactional
    public User create(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email", request.email());
        }

        User user = User.create(
            request.name(),
            request.email(),
            false,
            "",
            request.role(),
            request.status()
        );

        return userRepository.save(user);
    }

    // 사용자 수정
    @Transactional
    public User update(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new EntityExistsException("User not found with id: " + id)
        );

        if (request.name() != null) user.setName(request.name());
        if (request.email() != null) user.setEmail(request.email());
        if (request.role() != null) user.setRole(request.role());
        if (request.status() != null) user.setStatus(request.status());

        return user;
    }

    // 사용자 삭제 (비활성화 처리)
    @Transactional
    public void delete(String id) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new EntityExistsException("User not found with id: " + id)
        );

        if (user.getStatus() == UserStatus.INACTIVE) return;
        user.setStatus(UserStatus.INACTIVE);
    }

    // 역할별 사용자 수 집계
    @Transactional(readOnly = true)
    public Map<UserRole, Long> countByRole() {
        EnumMap<UserRole, Long> result = new EnumMap<>(UserRole.class);

        for (UserRole status : UserRole.values()) {
            result.put(status, 0L);
        }

        userRepository.countByRole().forEach(row -> result.put(row.getRole(), row.getCount()));

        return result;
    }
}
