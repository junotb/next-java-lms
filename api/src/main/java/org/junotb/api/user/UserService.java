package org.junotb.api.user;

import lombok.RequiredArgsConstructor;
import org.junotb.api.common.exception.DuplicateResourceException;
import org.junotb.api.common.exception.ResourceNotFoundException;
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

/**
 * 사용자(강사·학생) CRUD 및 통계 서비스.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    /**
     * ID로 사용자 조회.
     *
     * @param id 사용자 ID
     * @return 사용자 (없으면 Optional.empty())
     */
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    /**
     * 사용자 목록 조회. Specification으로 동적 필터 적용.
     * JPA @Column(name) 이스케이프로 인해 root.get("\"name\"") 등 사용.
     *
     * @param request  필터 (name, role, status)
     * @param pageable 페이징
     * @return 페이징된 목록
     */
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

    /**
     * 사용자 생성. 이메일 중복 시 DuplicateResourceException.
     *
     * @param request 생성 요청
     * @return 저장된 사용자
     * @throws DuplicateResourceException 이메일 중복 시
     */
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

    /**
     * 사용자 수정. null이 아닌 필드만 업데이트.
     *
     * @param id      사용자 ID
     * @param request 수정 요청
     * @return 수정된 사용자
     * @throws ResourceNotFoundException 사용자 미존재 시
     */
    @Transactional
    public User update(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("User", id)
        );

        if (request.name() != null) user.setName(request.name());
        if (request.email() != null) user.setEmail(request.email());
        if (request.role() != null) user.setRole(request.role());
        if (request.status() != null) user.setStatus(request.status());

        return user;
    }

    /**
     * 사용자 삭제(비활성화). 이미 INACTIVE면 idempotent로 조기 반환.
     *
     * @param id 사용자 ID
     * @throws ResourceNotFoundException 사용자 미존재 시
     */
    @Transactional
    public void delete(String id) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("User", id)
        );

        if (user.getStatus() == UserStatus.INACTIVE) return;
        user.setStatus(UserStatus.INACTIVE);
    }

    /**
     * 역할별 사용자 수 집계. countByRole()이 반환하지 않는 역할은 0으로 초기화.
     *
     * @return 역할별 건수
     */
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
