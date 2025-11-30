package org.junotb.api.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.schedule.dtos.ScheduleDto;
import org.junotb.api.user.dtos.UserCreateRequest;
import org.junotb.api.user.dtos.UserDto;
import org.junotb.api.user.dtos.UserUpdateRequest;
import org.junotb.api.user.enums.UserRole;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("")
    public List<UserDto> list(
        @RequestParam(required = true)
        UserRole role,
        Pageable pageable
    ) {
        return userService.findByRole(role, pageable).stream().map(UserDto::from).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> get(@PathVariable Long id) {
        return ResponseEntity.of(userService.findById(id).map(UserDto::from));
    }

    @GetMapping("/{id}/schedules")
    public List<ScheduleDto> listSchedules(@PathVariable Long id) {
        return userService.findSchedulesById(id).stream().map(ScheduleDto::from).toList();
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody @Valid UserCreateRequest request) {
        var created = userService.create(request);
        var body = UserDto.from(created);
        return ResponseEntity.created(URI.create("/api/user/" + body.id())).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @RequestBody @Valid UserUpdateRequest request) {
        return ResponseEntity.of(userService.update(id, request).map(UserDto::from));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = userService.delete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
