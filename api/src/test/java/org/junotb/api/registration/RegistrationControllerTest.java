package org.junotb.api.registration;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junotb.api.common.exception.LockAcquisitionException;
import org.junotb.api.common.security.AuthenticationFilter;
import org.junotb.api.course.Course;
import org.junotb.api.registration.dto.CourseRegistrationRequest;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleStatus;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * {@link RegistrationController} API 슬라이스 테스트.
 */
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

    private CourseRegistrationRequest validRequest() {
        return new CourseRegistrationRequest(
            1L,
            1,
            List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY),
            LocalTime.of(14, 0),
            60
        );
    }

    @Test
    @DisplayName("registerCourse_whenValidRequest_thenReturn201")
    void registerCourse_whenValidRequest_thenReturn201() throws Exception {
        String studentId = UUID.randomUUID().toString();
        User instructor = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Instructor")
            .email("instructor@test.com")
            .role(UserRole.TEACHER)
            .status(UserStatus.ACTIVE)
            .build();
        Course course = Course.builder().id(1L).title("Java Basics").build();
        Schedule schedule = Schedule.builder()
            .id(1L)
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

        given(registrationService.registerCourse(anyString(), any(CourseRegistrationRequest.class)))
            .willReturn(registration);

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(studentId, null, null));
        SecurityContextHolder.setContext(securityContext);

        try {
            mockMvc.perform(post("/api/registrations/course")
                    .header("Authorization", "Bearer test-token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.scheduleId").value(1))
                .andExpect(jsonPath("$.studentId").value(studentId))
                .andExpect(jsonPath("$.status").value("REGISTERED"));
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("registerCourse_whenLockTimeout_thenReturn429")
    void registerCourse_whenLockTimeout_thenReturn429() throws Exception {
        String studentId = UUID.randomUUID().toString();

        given(registrationService.registerCourse(anyString(), any(CourseRegistrationRequest.class)))
            .willThrow(new LockAcquisitionException("현재 수강 신청이 몰려 처리할 수 없습니다."));

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(studentId, null, null));
        SecurityContextHolder.setContext(securityContext);

        try {
            mockMvc.perform(post("/api/registrations/course")
                    .header("Authorization", "Bearer test-token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isTooManyRequests());
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("registerCourse_whenValidationFails_thenReturn400")
    void registerCourse_whenValidationFails_thenReturn400() throws Exception {
        String studentId = UUID.randomUUID().toString();
        CourseRegistrationRequest invalidRequest = new CourseRegistrationRequest(
            null,
            1,
            List.of(DayOfWeek.MONDAY),
            LocalTime.of(14, 0),
            60
        );

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(studentId, null, null));
        SecurityContextHolder.setContext(securityContext);

        try {
            mockMvc.perform(post("/api/registrations/course")
                    .header("Authorization", "Bearer test-token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("registerCourse_whenStudentNotFound_thenReturn404")
    void registerCourse_whenStudentNotFound_thenReturn404() throws Exception {
        String studentId = UUID.randomUUID().toString();

        given(registrationService.registerCourse(anyString(), any(CourseRegistrationRequest.class)))
            .willThrow(new EntityNotFoundException("Student not found with id: " + studentId));

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(studentId, null, null));
        SecurityContextHolder.setContext(securityContext);

        try {
            mockMvc.perform(post("/api/registrations/course")
                    .header("Authorization", "Bearer test-token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validRequest())))
                .andExpect(status().isNotFound());
        } finally {
            SecurityContextHolder.clearContext();
        }
    }
}
