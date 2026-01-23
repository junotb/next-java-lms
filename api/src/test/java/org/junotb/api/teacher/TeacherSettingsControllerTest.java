package org.junotb.api.teacher;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junotb.api.common.security.AuthenticationFilter;
import org.junotb.api.teacher.dto.TeacherAvailabilityRequest;
import org.junotb.api.teacher.dto.TeacherAvailabilityResponse;
import org.junotb.api.teacher.dto.TeacherSettingsResponse;
import org.junotb.api.teacher.dto.TeacherTimeOffRequest;
import org.junotb.api.teacher.dto.TeacherTimeOffResponse;
import org.junotb.api.user.TeacherTimeOffType;
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
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TeacherSettingsController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("TeacherSettingsController Slice Test")
class TeacherSettingsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TeacherSettingService teacherSettingService;

    @MockBean
    private AuthenticationFilter authenticationFilter;

    @Test
    @DisplayName("updateAvailability_whenValidRequest_thenReturn200")
    void updateAvailability_whenValidRequest_thenReturn200() throws Exception {
        // given
        String teacherId = UUID.randomUUID().toString();
        List<TeacherAvailabilityRequest> request = List.of(
                new TeacherAvailabilityRequest(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(12, 0))
        );

        List<TeacherAvailabilityResponse> response = List.of(
                new TeacherAvailabilityResponse(1L, DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(12, 0))
        );

        given(teacherSettingService.updateAvailability(anyString(), any())).willReturn(response);

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(teacherId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(put("/api/teachers/settings/availability")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].dayOfWeek").value("MONDAY"));

        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("addTimeOff_whenValidRequest_thenReturn200")
    void addTimeOff_whenValidRequest_thenReturn200() throws Exception {
        // given
        String teacherId = UUID.randomUUID().toString();
        LocalDateTime startDateTime = LocalDateTime.now().plusDays(1);
        LocalDateTime endDateTime = LocalDateTime.now().plusDays(1).plusHours(8);

        TeacherTimeOffRequest request = new TeacherTimeOffRequest(
                startDateTime,
                endDateTime,
                TeacherTimeOffType.VACATION,
                "연차 사용"
        );

        TeacherTimeOffResponse response = new TeacherTimeOffResponse(
                1L,
                startDateTime,
                endDateTime,
                TeacherTimeOffType.VACATION,
                "연차 사용"
        );

        given(teacherSettingService.addTimeOff(anyString(), any())).willReturn(response);

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(teacherId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(post("/api/teachers/settings/time-off")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.type").value("VACATION"))
                .andExpect(jsonPath("$.reason").value("연차 사용"));

        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("removeTimeOff_whenValidId_thenReturn204")
    void removeTimeOff_whenValidId_thenReturn204() throws Exception {
        // given
        String teacherId = UUID.randomUUID().toString();
        Long timeOffId = 1L;

        willDoNothing().given(teacherSettingService).removeTimeOff(teacherId, timeOffId);

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(teacherId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(delete("/api/teachers/settings/time-off/{id}", timeOffId))
                .andExpect(status().isNoContent());

        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("getSettings_whenValidTeacherId_thenReturn200")
    void getSettings_whenValidTeacherId_thenReturn200() throws Exception {
        // given
        String teacherId = UUID.randomUUID().toString();

        TeacherSettingsResponse response = new TeacherSettingsResponse(
                List.of(new TeacherAvailabilityResponse(1L, DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(12, 0))),
                List.of(new TeacherTimeOffResponse(1L, LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(1).plusHours(8), TeacherTimeOffType.VACATION, null))
        );

        given(teacherSettingService.getSettings(teacherId)).willReturn(response);

        // SecurityContext 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(teacherId, null, null));
        SecurityContextHolder.setContext(securityContext);

        // when & then
        mockMvc.perform(get("/api/teachers/settings/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.availabilities").isArray())
                .andExpect(jsonPath("$.timeOffs").isArray());

        SecurityContextHolder.clearContext();
    }
}
