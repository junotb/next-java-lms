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


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("")
    public PageResponse<UserResponse> list(@ModelAttribute UserListRequest request, Pageable pageable) {
        return PageResponse.from(
            userService.findList(request, pageable).map(UserResponse::from)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> get(@PathVariable Long id) {
        return ResponseEntity.of(userService.findById(id).map(UserResponse::from));
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@RequestBody @Valid UserCreateRequest request) {
        User user = userService.create(request);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @RequestBody @Valid UserUpdateRequest request) {
        User user = userService.update(id, request);
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
