package org.junotb.api.schedule;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junotb.api.course.Course;
import org.junotb.api.course.CourseStatus;
import org.junotb.api.schedule.web.ScheduleCreateRequest;
import org.junotb.api.schedule.web.ScheduleUpdateRequest;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.junotb.api.common.security.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScheduleController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("ScheduleController Slice Test")
class ScheduleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ScheduleService scheduleService;

    @MockBean
    private AuthenticationFilter authenticationFilter;

    @Test
    @DisplayName("list_whenValidRequest_thenReturn200")
    void list_whenValidRequest_thenReturn200() throws Exception {
        // given
        User teacher = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Teacher")
            .role(UserRole.TEACHER)
            .build();

        Course course = Course.builder()
            .id(1L)
            .title("Java Basics")
            .status(CourseStatus.ACTIVE)
            .build();

        Schedule schedule = Schedule.builder()
            .id(1L)
            .user(teacher)
            .course(course)
            .startsAt(OffsetDateTime.now().plusDays(1))
            .endsAt(OffsetDateTime.now().plusDays(1).plusHours(1))
            .status(ScheduleStatus.SCHEDULED)
            .build();

        Page<Schedule> schedulePage = new PageImpl<>(List.of(schedule), PageRequest.of(0, 10), 1);
        given(scheduleService.findList(any(), any())).willReturn(schedulePage);

        // when & then
        mockMvc.perform(get("/api/v1/schedule")
                .header("Authorization", "Bearer test-token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.items[0].id").value(1))
            .andExpect(jsonPath("$.items[0].status").value("SCHEDULED"));
    }

    @Test
    @DisplayName("get_whenScheduleExists_thenReturn200")
    void get_whenScheduleExists_thenReturn200() throws Exception {
        // given
        Long scheduleId = 1L;
        User teacher = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Teacher")
            .build();

        Course course = Course.builder()
            .id(1L)
            .title("Java Basics")
            .build();

        Schedule schedule = Schedule.builder()
            .id(scheduleId)
            .user(teacher)
            .course(course)
            .startsAt(OffsetDateTime.now().plusDays(1))
            .endsAt(OffsetDateTime.now().plusDays(1).plusHours(1))
            .status(ScheduleStatus.SCHEDULED)
            .build();

        given(scheduleService.findById(scheduleId)).willReturn(Optional.of(schedule));

        // when & then
        mockMvc.perform(get("/api/v1/schedule/{id}", scheduleId)
                .header("Authorization", "Bearer test-token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(scheduleId))
            .andExpect(jsonPath("$.status").value("SCHEDULED"));
    }

    @Test
    @DisplayName("get_whenScheduleNotFound_thenReturn404")
    void get_whenScheduleNotFound_thenReturn404() throws Exception {
        // given
        Long scheduleId = 999L;
        given(scheduleService.findById(scheduleId)).willReturn(Optional.empty());

        // when & then
        mockMvc.perform(get("/api/v1/schedule/{id}", scheduleId)
                .header("Authorization", "Bearer test-token"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("create_whenValidRequest_thenReturn200")
    void create_whenValidRequest_thenReturn200() throws Exception {
        // given
        String teacherId = UUID.randomUUID().toString();
        Long courseId = 1L;
        OffsetDateTime startsAt = OffsetDateTime.now().plusDays(1);
        OffsetDateTime endsAt = startsAt.plusHours(1);

        ScheduleCreateRequest request = new ScheduleCreateRequest(
            courseId,
            startsAt,
            endsAt,
            ScheduleStatus.SCHEDULED
        );

        User teacher = User.builder()
            .id(teacherId)
            .name("Teacher")
            .build();

        Course course = Course.builder()
            .id(courseId)
            .title("Java Basics")
            .build();

        Schedule schedule = Schedule.builder()
            .id(1L)
            .user(teacher)
            .course(course)
            .startsAt(startsAt)
            .endsAt(endsAt)
            .status(ScheduleStatus.SCHEDULED)
            .build();

        given(scheduleService.create(anyString(), any(ScheduleCreateRequest.class))).willReturn(schedule);

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(teacherId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(post("/api/v1/schedule")
                .header("Authorization", "Bearer test-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.status").value("SCHEDULED"));
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("update_whenValidRequest_thenReturn200")
    void update_whenValidRequest_thenReturn200() throws Exception {
        // given
        Long scheduleId = 1L;
        ScheduleUpdateRequest request = new ScheduleUpdateRequest(
            null,
            null,
            ScheduleStatus.ATTENDED
        );

        User teacher = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Teacher")
            .build();

        Course course = Course.builder()
            .id(1L)
            .title("Java Basics")
            .build();

        Schedule schedule = Schedule.builder()
            .id(scheduleId)
            .user(teacher)
            .course(course)
            .startsAt(OffsetDateTime.now())
            .endsAt(OffsetDateTime.now().plusHours(1))
            .status(ScheduleStatus.ATTENDED)
            .build();

        given(scheduleService.update(anyLong(), any())).willReturn(schedule);

        // when & then
        mockMvc.perform(patch("/api/v1/schedule/{id}", scheduleId)
                .header("Authorization", "Bearer test-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("ATTENDED"));
    }

    @Test
    @DisplayName("delete_whenValidId_thenReturn204")
    void delete_whenValidId_thenReturn204() throws Exception {
        // given
        Long scheduleId = 1L;
        willDoNothing().given(scheduleService).delete(scheduleId);

        // when & then
        mockMvc.perform(delete("/api/v1/schedule/{id}", scheduleId)
                .header("Authorization", "Bearer test-token"))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("countByStatus_whenCalled_thenReturnStats")
    void countByStatus_whenCalled_thenReturnStats() throws Exception {
        // given
        String userId = UUID.randomUUID().toString();
        Map<ScheduleStatus, Long> stats = Map.of(
            ScheduleStatus.SCHEDULED, 10L,
            ScheduleStatus.ATTENDED, 5L,
            ScheduleStatus.CANCELLED, 2L
        );
        given(scheduleService.countByStatus(anyString())).willReturn(stats);

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(userId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(get("/api/v1/schedule/stats/status")
                .header("Authorization", "Bearer test-token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.SCHEDULED").value(10))
            .andExpect(jsonPath("$.ATTENDED").value(5))
            .andExpect(jsonPath("$.CANCELLED").value(2));
        
        SecurityContextHolder.clearContext();
    }
}
