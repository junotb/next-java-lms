package org.junotb.api.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.web.PageResponse;
import org.junotb.api.user.web.UserCreateRequest;
import org.junotb.api.user.web.UserListRequest;
import org.junotb.api.user.web.UserResponse;
import org.junotb.api.user.web.UserUpdateRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

/**
 * 관리자용 사용자(강사·학생) 관리 API.
 */
@Tag(name = "User", description = "사용자(강사·학생) 관리 API")
@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final WithdrawalService withdrawalService;

    /**
     * 회원 탈퇴. 본인 인증 후 회원·스케줄·수강 등록 등 모든 연관 데이터를 삭제합니다.
     *
     * @param userId 인증된 사용자 ID
     * @return 204 No Content
     */
    @Operation(summary = "회원 탈퇴", description = "본인 계정 및 연관 데이터를 모두 삭제합니다.")
    @PostMapping("/me/withdraw")
    public ResponseEntity<Void> withdraw(@AuthenticationPrincipal String userId) {
        withdrawalService.withdraw(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 사용자 목록을 페이징하여 조회. 이름·역할·상태로 필터링 가능.
     *
     * @param request  필터 조건 (name, role, status)
     * @param pageable 페이징
     * @return 페이징된 사용자 목록
     */
    @Operation(summary = "사용자 목록 조회", description = "이름·역할·상태로 필터링하여 페이징 조회합니다.")
    @GetMapping("")
    public PageResponse<UserResponse> list(@ModelAttribute UserListRequest request, Pageable pageable) {
        UserListRequest safeRequest = Objects.requireNonNullElse(request, UserListRequest.empty());

        return PageResponse.from(
            userService.findList(safeRequest, pageable).map(UserResponse::from)
        );
    }

    /**
     * ID로 사용자 조회.
     *
     * @param id 사용자 ID
     * @return 사용자 정보 (없으면 404)
     */
    @Operation(summary = "사용자 조회", description = "ID로 사용자를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> get(@PathVariable String id) {
        return ResponseEntity.of(userService.findById(id).map(UserResponse::from));
    }

    /**
     * 새 사용자 생성.
     *
     * @param request 생성 요청 (name, email, role, status)
     * @return 생성된 사용자
     * @throws DuplicateResourceException 이메일 중복 시
     */
    @Operation(summary = "사용자 생성", description = "이메일 중복 검사 후 새 사용자를 생성합니다.")
    @PostMapping
    public ResponseEntity<UserResponse> create(@RequestBody @Valid UserCreateRequest request) {
        User user = userService.create(request);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    /**
     * 사용자 정보 수정. null이 아닌 필드만 업데이트.
     *
     * @param id      사용자 ID
     * @param request 수정 요청 (name, email, role, status)
     * @return 수정된 사용자
     * @throws ResourceNotFoundException 사용자 미존재 시
     */
    @Operation(summary = "사용자 수정", description = "null이 아닌 필드만 부분 수정합니다.")
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable String id, @RequestBody @Valid UserUpdateRequest request) {
        User user = userService.update(id, request);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    /**
     * 사용자 삭제(비활성화). 논리 삭제로 상태를 INACTIVE로 변경.
     *
     * @param id 사용자 ID
     * @return 204 No Content
     * @throws ResourceNotFoundException 사용자 미존재 시
     */
    @Operation(summary = "사용자 삭제", description = "논리 삭제로 비활성화 처리합니다.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 역할별 사용자 수 통계 조회.
     *
     * @return 역할(UserRole)별 건수
     */
    @Operation(summary = "역할별 통계", description = "TEACHER, STUDENT 등 역할별 사용자 수를 반환합니다.")
    @GetMapping("/stats/role")
    public ResponseEntity<Map<UserRole, Long>> countByRole() {
        Map<UserRole, Long> stats = userService.countByRole();
        return ResponseEntity.ok(stats);
    }
}
