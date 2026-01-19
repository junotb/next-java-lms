package org.junotb.api.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junotb.api.user.web.UserCreateRequest;
import org.junotb.api.user.web.UserUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@DisplayName("UserController Slice Test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("list_whenValidRequest_thenReturn200")
    void list_whenValidRequest_thenReturn200() throws Exception {
        // given
        User user = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Test User")
            .email("test@test.com")
            .emailVerified(true)
            .image("")
            .role(UserRole.STUDENT)
            .status(UserStatus.ACTIVE)
            .build();

        Page<User> userPage = new PageImpl<>(List.of(user), PageRequest.of(0, 10), 1);
        given(userService.findList(any(), any())).willReturn(userPage);

        // when & then
        mockMvc.perform(get("/api/v1/user"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.items[0].name").value("Test User"));
    }

    @Test
    @DisplayName("get_whenUserExists_thenReturn200")
    void get_whenUserExists_thenReturn200() throws Exception {
        // given
        String userId = UUID.randomUUID().toString();
        User user = User.builder()
            .id(userId)
            .name("Test User")
            .email("test@test.com")
            .emailVerified(true)
            .image("")
            .role(UserRole.STUDENT)
            .status(UserStatus.ACTIVE)
            .build();

        given(userService.findById(userId)).willReturn(Optional.of(user));

        // when & then
        mockMvc.perform(get("/api/v1/user/{id}", userId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(userId))
            .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    @DisplayName("get_whenUserNotFound_thenReturn404")
    void get_whenUserNotFound_thenReturn404() throws Exception {
        // given
        String userId = UUID.randomUUID().toString();
        given(userService.findById(userId)).willReturn(Optional.empty());

        // when & then
        mockMvc.perform(get("/api/v1/user/{id}", userId))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("create_whenValidRequest_thenReturn200")
    void create_whenValidRequest_thenReturn200() throws Exception {
        // given
        UserCreateRequest request = new UserCreateRequest(
            "New User",
            "newuser@test.com",
            UserRole.STUDENT,
            UserStatus.ACTIVE
        );

        User user = User.builder()
            .id(UUID.randomUUID().toString())
            .name(request.name())
            .email(request.email())
            .emailVerified(false)
            .image("")
            .role(request.role())
            .status(request.status())
            .build();

        given(userService.create(any())).willReturn(user);

        // when & then
        mockMvc.perform(post("/api/v1/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("New User"))
            .andExpect(jsonPath("$.email").value("newuser@test.com"));
    }

    @Test
    @DisplayName("create_whenDuplicateEmail_thenReturn409")
    void create_whenDuplicateEmail_thenReturn409() throws Exception {
        // given
        UserCreateRequest request = new UserCreateRequest(
            "Test User",
            "duplicate@test.com",
            UserRole.STUDENT,
            UserStatus.ACTIVE
        );

        given(userService.create(any()))
            .willThrow(new org.junotb.api.common.exception.DuplicateResourceException("Email", "duplicate@test.com"));

        // when & then
        mockMvc.perform(post("/api/v1/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("update_whenValidRequest_thenReturn200")
    void update_whenValidRequest_thenReturn200() throws Exception {
        // given
        String userId = UUID.randomUUID().toString();
        UserUpdateRequest request = new UserUpdateRequest(
            "Updated Name",
            "updated@test.com",
            UserRole.TEACHER,
            UserStatus.ACTIVE
        );

        User updatedUser = User.builder()
            .id(userId)
            .name(request.name())
            .email(request.email())
            .emailVerified(true)
            .image("")
            .role(request.role())
            .status(request.status())
            .build();

        given(userService.update(anyString(), any())).willReturn(updatedUser);

        // when & then
        mockMvc.perform(patch("/api/v1/user/{id}", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Updated Name"))
            .andExpect(jsonPath("$.role").value("TEACHER"));
    }

    @Test
    @DisplayName("delete_whenValidId_thenReturn204")
    void delete_whenValidId_thenReturn204() throws Exception {
        // given
        String userId = UUID.randomUUID().toString();
        willDoNothing().given(userService).delete(userId);

        // when & then
        mockMvc.perform(delete("/api/v1/user/{id}", userId))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("countByRole_whenCalled_thenReturnStats")
    void countByRole_whenCalled_thenReturnStats() throws Exception {
        // given
        Map<UserRole, Long> stats = Map.of(
            UserRole.STUDENT, 10L,
            UserRole.TEACHER, 5L,
            UserRole.ADMIN, 2L
        );
        given(userService.countByRole()).willReturn(stats);

        // when & then
        mockMvc.perform(get("/api/v1/user/stats/role"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.STUDENT").value(10))
            .andExpect(jsonPath("$.TEACHER").value(5))
            .andExpect(jsonPath("$.ADMIN").value(2));
    }
}
