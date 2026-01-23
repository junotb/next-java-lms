package org.junotb.api.teacher;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junotb.api.teacher.dto.TeacherAvailabilityRequest;
import org.junotb.api.teacher.dto.TeacherAvailabilityResponse;
import org.junotb.api.teacher.dto.TeacherTimeOffRequest;
import org.junotb.api.teacher.dto.TeacherTimeOffResponse;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.user.TeacherAvailability;
import org.junotb.api.user.TeacherAvailabilityRepository;
import org.junotb.api.user.TeacherTimeOff;
import org.junotb.api.user.TeacherTimeOffRepository;
import org.junotb.api.user.TeacherTimeOffType;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
@DisplayName("TeacherSettingService Unit Test")
class TeacherSettingServiceTest {

    @Mock
    private TeacherAvailabilityRepository availabilityRepository;

    @Mock
    private TeacherTimeOffRepository timeOffRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ScheduleRepository scheduleRepository;

    @InjectMocks
    private TeacherSettingService teacherSettingService;

    @Test
    @DisplayName("updateAvailability_Success - 기존 설정 삭제 후 새로 저장")
    void updateAvailability_Success() {
        // given
        String teacherId = UUID.randomUUID().toString();
        User teacher = User.builder()
                .id(teacherId)
                .name("Teacher")
                .email("teacher@test.com")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        List<TeacherAvailabilityRequest> requests = List.of(
                new TeacherAvailabilityRequest(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(12, 0)),
                new TeacherAvailabilityRequest(DayOfWeek.WEDNESDAY, LocalTime.of(14, 0), LocalTime.of(17, 0))
        );

        TeacherAvailability existing1 = TeacherAvailability.builder()
                .id(1L)
                .teacher(teacher)
                .dayOfWeek(DayOfWeek.TUESDAY)
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(11, 0))
                .build();

        List<TeacherAvailability> existing = List.of(existing1);

        TeacherAvailability new1 = TeacherAvailability.builder()
                .id(2L)
                .teacher(teacher)
                .dayOfWeek(DayOfWeek.MONDAY)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(12, 0))
                .build();

        TeacherAvailability new2 = TeacherAvailability.builder()
                .id(3L)
                .teacher(teacher)
                .dayOfWeek(DayOfWeek.WEDNESDAY)
                .startTime(LocalTime.of(14, 0))
                .endTime(LocalTime.of(17, 0))
                .build();

        List<TeacherAvailability> saved = List.of(new1, new2);

        given(userRepository.getReferenceById(teacherId)).willReturn(teacher);
        given(scheduleRepository.existsByUserIdAndStartsAtAfterAndStatus(anyString(), any(), any())).willReturn(false);
        given(availabilityRepository.findByTeacher_Id(teacherId)).willReturn(existing);
        given(availabilityRepository.saveAll(any())).willReturn(saved);

        // when
        List<TeacherAvailabilityResponse> result = teacherSettingService.updateAvailability(teacherId, requests);

        // then
        assertThat(result).hasSize(2);
        then(availabilityRepository).should(times(1)).deleteAll(existing);
        then(availabilityRepository).should(times(1)).saveAll(any());
    }

    @Test
    @DisplayName("addTimeOff_Success - 정상적으로 휴무가 저장됨")
    void addTimeOff_Success() {
        // given
        String teacherId = UUID.randomUUID().toString();
        User teacher = User.builder()
                .id(teacherId)
                .name("Teacher")
                .email("teacher@test.com")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        LocalDateTime startDateTime = LocalDateTime.now().plusDays(1);
        LocalDateTime endDateTime = LocalDateTime.now().plusDays(1).plusHours(8);

        TeacherTimeOffRequest request = new TeacherTimeOffRequest(
                startDateTime,
                endDateTime,
                TeacherTimeOffType.VACATION,
                "연차 사용"
        );

        TeacherTimeOff saved = TeacherTimeOff.builder()
                .id(1L)
                .teacher(teacher)
                .startDateTime(startDateTime)
                .endDateTime(endDateTime)
                .type(TeacherTimeOffType.VACATION)
                .reason("연차 사용")
                .build();

        given(userRepository.getReferenceById(teacherId)).willReturn(teacher);
        given(scheduleRepository.existsByUserIdAndStartsAtBetweenAndStatus(anyString(), any(), any(), any())).willReturn(false);
        given(timeOffRepository.save(any(TeacherTimeOff.class))).willReturn(saved);

        // when
        TeacherTimeOffResponse result = teacherSettingService.addTimeOff(teacherId, request);

        // then
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.type()).isEqualTo(TeacherTimeOffType.VACATION);
        assertThat(result.reason()).isEqualTo("연차 사용");
        then(timeOffRepository).should(times(1)).save(any(TeacherTimeOff.class));
    }

    @Test
    @DisplayName("addTimeOff_Fail_InvalidTimeRange - 시작 시간이 종료 시간보다 늦을 경우 예외 발생")
    void addTimeOff_Fail_InvalidTimeRange() {
        // given
        String teacherId = UUID.randomUUID().toString();
        User teacher = User.builder()
                .id(teacherId)
                .name("Teacher")
                .email("teacher@test.com")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        LocalDateTime startDateTime = LocalDateTime.now().plusDays(2);
        LocalDateTime endDateTime = LocalDateTime.now().plusDays(1);

        TeacherTimeOffRequest request = new TeacherTimeOffRequest(
                startDateTime,
                endDateTime,
                TeacherTimeOffType.VACATION,
                null
        );

        // when & then
        assertThatThrownBy(() -> teacherSettingService.addTimeOff(teacherId, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("시작 일시는 종료 일시보다 빨라야 합니다");

        then(timeOffRepository).should(never()).save(any(TeacherTimeOff.class));
    }

    @Test
    @DisplayName("removeTimeOff_Success - 본인의 휴무 ID인 경우 정상 삭제")
    void removeTimeOff_Success() {
        // given
        String teacherId = UUID.randomUUID().toString();
        User teacher = User.builder()
                .id(teacherId)
                .name("Teacher")
                .email("teacher@test.com")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        Long timeOffId = 1L;

        TeacherTimeOff timeOff = TeacherTimeOff.builder()
                .id(timeOffId)
                .teacher(teacher)
                .startDateTime(LocalDateTime.now().plusDays(1))
                .endDateTime(LocalDateTime.now().plusDays(1).plusHours(8))
                .type(TeacherTimeOffType.VACATION)
                .build();

        given(timeOffRepository.findById(timeOffId)).willReturn(Optional.of(timeOff));

        // when
        teacherSettingService.removeTimeOff(teacherId, timeOffId);

        // then
        then(timeOffRepository).should(times(1)).findById(timeOffId);
        then(timeOffRepository).should(times(1)).delete(timeOff);
    }

    @Test
    @DisplayName("removeTimeOff_Fail_NotOwner - 다른 강사의 휴무를 지우려 할 때 예외 발생")
    void removeTimeOff_Fail_NotOwner() {
        // given
        String teacherId = UUID.randomUUID().toString();
        String otherTeacherId = UUID.randomUUID().toString();
        User otherTeacher = User.builder()
                .id(otherTeacherId)
                .name("Other Teacher")
                .email("other@test.com")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        Long timeOffId = 1L;

        TeacherTimeOff timeOff = TeacherTimeOff.builder()
                .id(timeOffId)
                .teacher(otherTeacher) // 다른 강사
                .startDateTime(LocalDateTime.now().plusDays(1))
                .endDateTime(LocalDateTime.now().plusDays(1).plusHours(8))
                .type(TeacherTimeOffType.VACATION)
                .build();

        given(timeOffRepository.findById(timeOffId)).willReturn(Optional.of(timeOff));

        // when & then
        assertThatThrownBy(() -> teacherSettingService.removeTimeOff(teacherId, timeOffId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("본인의 휴무 일정만 삭제할 수 있습니다");

        then(timeOffRepository).should(times(1)).findById(timeOffId);
        then(timeOffRepository).should(never()).delete(any(TeacherTimeOff.class));
    }

    @Test
    @DisplayName("removeTimeOff_Fail_NotFound - 휴무 일정이 존재하지 않을 때 예외 발생")
    void removeTimeOff_Fail_NotFound() {
        // given
        String teacherId = UUID.randomUUID().toString();
        Long timeOffId = 999L;

        given(timeOffRepository.findById(timeOffId)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> teacherSettingService.removeTimeOff(teacherId, timeOffId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("휴무 일정을 찾을 수 없습니다");

        then(timeOffRepository).should(times(1)).findById(timeOffId);
        then(timeOffRepository).should(never()).delete(any(TeacherTimeOff.class));
    }

    @Test
    @DisplayName("getSettings_Success - 현재 설정 조회")
    void getSettings_Success() {
        // given
        String teacherId = UUID.randomUUID().toString();
        User teacher = User.builder()
                .id(teacherId)
                .name("Teacher")
                .email("teacher@test.com")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        TeacherAvailability availability = TeacherAvailability.builder()
                .id(1L)
                .teacher(teacher)
                .dayOfWeek(DayOfWeek.MONDAY)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(12, 0))
                .build();

        TeacherTimeOff timeOff = TeacherTimeOff.builder()
                .id(1L)
                .teacher(teacher)
                .startDateTime(LocalDateTime.now().plusDays(1))
                .endDateTime(LocalDateTime.now().plusDays(1).plusHours(8))
                .type(TeacherTimeOffType.VACATION)
                .build();

        given(availabilityRepository.findByTeacher_Id(teacherId)).willReturn(List.of(availability));
        given(timeOffRepository.findByTeacher_Id(teacherId)).willReturn(List.of(timeOff));

        // when
        var result = teacherSettingService.getSettings(teacherId);

        // then
        assertThat(result.availabilities()).hasSize(1);
        assertThat(result.timeOffs()).hasSize(1);
        then(availabilityRepository).should(times(1)).findByTeacher_Id(teacherId);
        then(timeOffRepository).should(times(1)).findByTeacher_Id(teacherId);
    }
}
