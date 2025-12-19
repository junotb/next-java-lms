package org.junotb.api.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.junotb.api.schedule.dtos.ScheduleDto;
import org.junotb.api.user.dtos.UserCreateRequest;
import org.junotb.api.user.dtos.UserDto;
import org.junotb.api.user.dtos.UserListRequest;
import org.junotb.api.user.dtos.UserUpdateRequest;
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
        @ModelAttribute UserListRequest request,
        Pageable pageable
    ) {
        return userService.findList(request, pageable).stream().map(UserDto::from).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> get(@PathVariable Long id) {
        return ResponseEntity.of(userService.findById(id).map(UserDto::from));
    }

    @GetMapping("/{id}/schedule")
    public List<ScheduleDto> listSchedule(@PathVariable Long id) {
        return userService.findScheduleById(id).stream().map(ScheduleDto::from).toList();
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody @Valid UserCreateRequest request) {
        var created = userService.create(request);
        var body = UserDto.from(created);
        return ResponseEntity.created(URI.create("/api/user/" + body.id())).body(body);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @RequestBody @Valid UserUpdateRequest request) {
        return ResponseEntity.of(userService.update(id, request).map(UserDto::from));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = userService.delete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
