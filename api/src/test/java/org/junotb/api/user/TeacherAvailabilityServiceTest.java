package org.junotb.api.user;

import org.junotb.api.common.exception.ResourceNotFoundException;
import org.junotb.api.user.web.TeacherAvailabilityRequest;
import org.junotb.api.user.web.TeacherAvailabilityResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
@DisplayName("TeacherAvailabilityService Unit Test")
class TeacherAvailabilityServiceTest {

    @Mock
    private TeacherAvailabilityRepository teacherAvailabilityRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TeacherAvailabilityService teacherAvailabilityService;

    @Test
    @DisplayName("updateAvailability_Success - 기존 데이터 삭제 후 enabled=true인 요청만 저장")
    void updateAvailability_Success() {
        // given
        String teacherId = UUID.randomUUID().toString();
        User teacher = User.builder()
                .id(teacherId)
                .name("Test Teacher")
                .email("teacher@test.com")
                .emailVerified(true)
                .image("")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        List<TeacherAvailabilityRequest> requests = List.of(
                new TeacherAvailabilityRequest(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(12, 0), true),
                new TeacherAvailabilityRequest(DayOfWeek.TUESDAY, LocalTime.of(14, 0), LocalTime.of(17, 0), false), // enabled=false
                new TeacherAvailabilityRequest(DayOfWeek.WEDNESDAY, LocalTime.of(10, 0), LocalTime.of(18, 0), true)
        );

        TeacherAvailability saved1 = TeacherAvailability.builder()
                .id(1L)
                .teacher(teacher)
                .dayOfWeek(DayOfWeek.MONDAY)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(12, 0))
                .build();

        TeacherAvailability saved2 = TeacherAvailability.builder()
                .id(2L)
                .teacher(teacher)
                .dayOfWeek(DayOfWeek.WEDNESDAY)
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(18, 0))
                .build();

        List<TeacherAvailability> saved = List.of(saved1, saved2);

        given(userRepository.findById(teacherId)).willReturn(Optional.of(teacher));
        given(teacherAvailabilityRepository.saveAll(any())).willReturn(saved);

        // when
        List<TeacherAvailabilityResponse> result = teacherAvailabilityService.updateAvailability(teacherId, requests);

        // then
        assertThat(result).hasSize(2); // enabled=true인 2개만 저장됨

        // deleteByTeacher가 먼저 호출되었는지 검증
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        then(teacherAvailabilityRepository).should(times(1)).deleteByTeacher(userCaptor.capture());
        assertThat(userCaptor.getValue().getId()).isEqualTo(teacherId);

        // saveAll이 호출되었는지 검증 (enabled=true인 것만)
        ArgumentCaptor<List<TeacherAvailability>> saveListCaptor = ArgumentCaptor.forClass(List.class);
        then(teacherAvailabilityRepository).should(times(1)).saveAll(saveListCaptor.capture());

        List<TeacherAvailability> savedList = saveListCaptor.getValue();
        assertThat(savedList).hasSize(2); // enabled=true인 2개만
        assertThat(savedList).extracting(TeacherAvailability::getDayOfWeek)
                .containsExactly(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY);
    }

    @Test
    @DisplayName("updateAvailability_Success - 모든 요청이 enabled=false인 경우 저장되지 않음")
    void updateAvailability_Success_AllDisabled() {
        // given
        String teacherId = UUID.randomUUID().toString();
        User teacher = User.builder()
                .id(teacherId)
                .name("Test Teacher")
                .email("teacher@test.com")
                .emailVerified(true)
                .image("")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        List<TeacherAvailabilityRequest> requests = List.of(
                new TeacherAvailabilityRequest(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(12, 0), false),
                new TeacherAvailabilityRequest(DayOfWeek.TUESDAY, LocalTime.of(14, 0), LocalTime.of(17, 0), false)
        );

        given(userRepository.findById(teacherId)).willReturn(Optional.of(teacher));
        given(teacherAvailabilityRepository.saveAll(any())).willReturn(List.of());

        // when
        List<TeacherAvailabilityResponse> result = teacherAvailabilityService.updateAvailability(teacherId, requests);

        // then
        assertThat(result).isEmpty();

        // deleteByTeacher는 호출됨
        then(teacherAvailabilityRepository).should(times(1)).deleteByTeacher(teacher);

        // saveAll은 빈 리스트로 호출됨
        ArgumentCaptor<List<TeacherAvailability>> saveListCaptor = ArgumentCaptor.forClass(List.class);
        then(teacherAvailabilityRepository).should(times(1)).saveAll(saveListCaptor.capture());
        assertThat(saveListCaptor.getValue()).isEmpty();
    }

    @Test
    @DisplayName("updateAvailability_Fail_UserNotFound - 강사가 존재하지 않으면 예외 발생")
    void updateAvailability_Fail_UserNotFound() {
        // given
        String teacherId = UUID.randomUUID().toString();
        List<TeacherAvailabilityRequest> requests = List.of(
                new TeacherAvailabilityRequest(DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(12, 0), true)
        );

        given(userRepository.findById(teacherId)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> teacherAvailabilityService.updateAvailability(teacherId, requests))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User")
                .hasMessageContaining(teacherId);

        // deleteByTeacher와 saveAll이 호출되지 않았는지 검증
        then(teacherAvailabilityRepository).should(never()).deleteByTeacher(any());
        then(teacherAvailabilityRepository).should(never()).saveAll(any());
    }

    @Test
    @DisplayName("getAvailability_Success - 가용성 목록 조회")
    void getAvailability_Success() {
        // given
        String teacherId = UUID.randomUUID().toString();
        User teacher = User.builder()
                .id(teacherId)
                .name("Test Teacher")
                .email("teacher@test.com")
                .emailVerified(true)
                .image("")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        TeacherAvailability availability1 = TeacherAvailability.builder()
                .id(1L)
                .teacher(teacher)
                .dayOfWeek(DayOfWeek.MONDAY)
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(12, 0))
                .build();

        TeacherAvailability availability2 = TeacherAvailability.builder()
                .id(2L)
                .teacher(teacher)
                .dayOfWeek(DayOfWeek.WEDNESDAY)
                .startTime(LocalTime.of(14, 0))
                .endTime(LocalTime.of(17, 0))
                .build();

        List<TeacherAvailability> availabilities = List.of(availability1, availability2);

        given(teacherAvailabilityRepository.findByTeacher_IdOrderByDayOfWeek(teacherId))
                .willReturn(availabilities);

        // when
        List<TeacherAvailabilityResponse> result = teacherAvailabilityService.getAvailability(teacherId);

        // then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).dayOfWeek()).isEqualTo(DayOfWeek.MONDAY);
        assertThat(result.get(1).dayOfWeek()).isEqualTo(DayOfWeek.WEDNESDAY);

        then(teacherAvailabilityRepository).should(times(1))
                .findByTeacher_IdOrderByDayOfWeek(teacherId);
    }

    @Test
    @DisplayName("getAvailability_Success - 가용성이 없는 경우 빈 리스트 반환")
    void getAvailability_Success_EmptyList() {
        // given
        String teacherId = UUID.randomUUID().toString();

        given(teacherAvailabilityRepository.findByTeacher_IdOrderByDayOfWeek(teacherId))
                .willReturn(List.of());

        // when
        List<TeacherAvailabilityResponse> result = teacherAvailabilityService.getAvailability(teacherId);

        // then
        assertThat(result).isEmpty();

        then(teacherAvailabilityRepository).should(times(1))
                .findByTeacher_IdOrderByDayOfWeek(teacherId);
    }
}
