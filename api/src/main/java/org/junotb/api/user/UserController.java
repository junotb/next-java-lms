package org.junotb.api.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.web.PageResponse;
import org.junotb.api.user.web.UserCreateRequest;
import org.junotb.api.user.web.UserResponse;
import org.junotb.api.user.web.UserListRequest;
import org.junotb.api.user.web.UserUpdateRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // 사용자 목록 조회
    @GetMapping("")
    public PageResponse<UserResponse> list(@ModelAttribute UserListRequest request, Pageable pageable) {
        UserListRequest safeRequest = Objects.requireNonNullElse(request, UserListRequest.empty());

        return PageResponse.from(
            userService.findList(safeRequest, pageable).map(UserResponse::from)
        );
    }

    // 사용자 조회
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> get(@PathVariable Long id) {
        return ResponseEntity.of(userService.findById(id).map(UserResponse::from));
    }

    // 사용자 생성
    @PostMapping
    public ResponseEntity<UserResponse> create(@RequestBody @Valid UserCreateRequest request) {
        User user = userService.create(request);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    // 사용자 수정
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @RequestBody @Valid UserUpdateRequest request) {
        User user = userService.update(id, request);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    // 사용자 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 사용자 역할별 통계 조회
    @GetMapping("/stats/role")
    public ResponseEntity<Map<UserRole, Long>> countByRole() {
        Map<UserRole, Long> stats = userService.countByRole();
        return ResponseEntity.ok(stats);
    }
}
