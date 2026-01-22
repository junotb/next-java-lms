package org.junotb.api.registration;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junotb.api.course.Course;
import org.junotb.api.registration.web.RegistrationRequest;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleStatus;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.junotb.api.common.security.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RegistrationController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("RegistrationController Slice Test")
class RegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RegistrationService registrationService;

    @MockBean
    private AuthenticationFilter authenticationFilter;

    @Test
    @DisplayName("register_whenValidRequest_thenReturn201")
    void register_whenValidRequest_thenReturn201() throws Exception {
        // given
        Long scheduleId = 1L;
        String studentId = UUID.randomUUID().toString();
        RegistrationRequest request = new RegistrationRequest(scheduleId);

        User instructor = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Instructor")
            .email("instructor@test.com")
            .role(UserRole.TEACHER)
            .status(UserStatus.ACTIVE)
            .build();

        Course course = Course.builder()
            .id(1L)
            .title("Java Basics")
            .build();

        Schedule schedule = Schedule.builder()
            .id(scheduleId)
            .user(instructor)
            .course(course)
            .status(ScheduleStatus.SCHEDULED)
            .startsAt(OffsetDateTime.now().plusDays(1))
            .endsAt(OffsetDateTime.now().plusDays(1).plusHours(1))
            .build();

        User student = User.builder()
            .id(studentId)
            .name("Student")
            .email("student@test.com")
            .role(UserRole.STUDENT)
            .status(UserStatus.ACTIVE)
            .build();

        Registration registration = Registration.builder()
            .id(1L)
            .schedule(schedule)
            .student(student)
            .status(RegistrationStatus.REGISTERED)
            .registeredAt(OffsetDateTime.now())
            .build();

        given(registrationService.register(scheduleId, studentId)).willReturn(registration);

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(studentId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(post("/api/registrations")
                .header("Authorization", "Bearer test-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.scheduleId").value(scheduleId))
            .andExpect(jsonPath("$.studentId").value(studentId))
            .andExpect(jsonPath("$.status").value("REGISTERED"));
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("register_whenScheduleIdIsNull_thenReturn400")
    void register_whenScheduleIdIsNull_thenReturn400() throws Exception {
        // given
        String studentId = UUID.randomUUID().toString();
        RegistrationRequest request = new RegistrationRequest(null);

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(studentId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(post("/api/registrations")
                .header("Authorization", "Bearer test-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("register_whenScheduleNotFound_thenReturn404")
    void register_whenScheduleNotFound_thenReturn404() throws Exception {
        // given
        Long scheduleId = 999L;
        String studentId = UUID.randomUUID().toString();
        RegistrationRequest request = new RegistrationRequest(scheduleId);

        given(registrationService.register(anyLong(), anyString()))
            .willThrow(new EntityNotFoundException("Schedule not found with id: " + scheduleId));

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(studentId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(post("/api/registrations")
                .header("Authorization", "Bearer test-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound());
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("register_whenScheduleIsFull_thenReturn400")
    void register_whenScheduleIsFull_thenReturn400() throws Exception {
        // given
        Long scheduleId = 1L;
        String studentId = UUID.randomUUID().toString();
        RegistrationRequest request = new RegistrationRequest(scheduleId);

        given(registrationService.register(anyLong(), anyString()))
            .willThrow(new IllegalStateException("Schedule is already full"));

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(studentId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(post("/api/registrations")
                .header("Authorization", "Bearer test-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("getByStudent_whenValidStudentId_thenReturn200")
    void getByStudent_whenValidStudentId_thenReturn200() throws Exception {
        // given
        String studentId = UUID.randomUUID().toString();

        User instructor = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Instructor")
            .build();

        Course course = Course.builder()
            .id(1L)
            .title("Java Basics")
            .build();

        Schedule schedule = Schedule.builder()
            .id(1L)
            .user(instructor)
            .course(course)
            .status(ScheduleStatus.SCHEDULED)
            .build();

        User student = User.builder()
            .id(studentId)
            .name("Student")
            .build();

        Registration registration = Registration.builder()
            .id(1L)
            .schedule(schedule)
            .student(student)
            .status(RegistrationStatus.REGISTERED)
            .registeredAt(OffsetDateTime.now())
            .build();

        given(registrationService.findByStudentId(studentId)).willReturn(List.of(registration));

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(studentId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(get("/api/registrations/student/me")
                .header("Authorization", "Bearer test-token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].studentId").value(studentId));
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("cancel_whenValidId_thenReturn200")
    void cancel_whenValidId_thenReturn200() throws Exception {
        // given
        Long registrationId = 1L;

        User instructor = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Instructor")
            .build();

        Course course = Course.builder()
            .id(1L)
            .title("Java Basics")
            .build();

        Schedule schedule = Schedule.builder()
            .id(1L)
            .user(instructor)
            .course(course)
            .status(ScheduleStatus.SCHEDULED)
            .build();

        User student = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Student")
            .build();

        Registration registration = Registration.builder()
            .id(registrationId)
            .schedule(schedule)
            .student(student)
            .status(RegistrationStatus.CANCELED)
            .registeredAt(OffsetDateTime.now())
            .build();

        given(registrationService.cancel(registrationId)).willReturn(registration);

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(UUID.randomUUID().toString(), null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(delete("/api/registrations/{id}", registrationId)
                .header("Authorization", "Bearer test-token"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(registrationId))
            .andExpect(jsonPath("$.status").value("CANCELED"));
        
        SecurityContextHolder.clearContext();
    }
}
