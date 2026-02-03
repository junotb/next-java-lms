package org.junotb.api.schedule;

import org.junotb.api.course.Course;
import org.junotb.api.course.CourseRepository;
import org.junotb.api.course.CourseStatus;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@DisplayName("ScheduleRepository Integration Test")
class ScheduleRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    private User teacher;
    private Course course;
    private OffsetDateTime baseTime;

    @BeforeEach
    void setUp() {
        // 테스트용 강사 생성
        teacher = User.builder()
                .id(UUID.randomUUID().toString())
                .name("Test Teacher")
                .email("teacher@test.com")
                .emailVerified(true)
                .image("")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();
        teacher = userRepository.save(teacher);

        // 테스트용 코스 생성
        course = Course.builder()
                .title("Test Course")
                .description("Test Description")
                .status(CourseStatus.OPEN)
                .build();
        course = courseRepository.save(course);

        // 기준 시간 설정 (2024-01-15 10:00:00 UTC)
        baseTime = OffsetDateTime.of(2024, 1, 15, 10, 0, 0, 0, ZoneOffset.UTC);
    }

    @Test
    @DisplayName("existsByUserIdAndScheduleOverlap - Case 1: 요청 시간이 기존 수업 시간과 완벽히 겹침")
    void existsByUserIdAndScheduleOverlap_Case1_PerfectOverlap() {
        // given: 기존 수업 (10:00 ~ 12:00)
        Schedule existingSchedule = Schedule.builder()
                .user(teacher)
                .course(course)
                .startsAt(baseTime)
                .endsAt(baseTime.plusHours(2))
                .status(ScheduleStatus.SCHEDULED)
                .build();
        entityManager.persistAndFlush(existingSchedule);

        // when: 요청 시간 (10:00 ~ 12:00) - 완벽히 겹침
        OffsetDateTime requestStart = baseTime;
        OffsetDateTime requestEnd = baseTime.plusHours(2);

        boolean result = scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacher.getId(),
                requestStart,
                requestEnd,
                ScheduleStatus.SCHEDULED
        );

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("existsByUserIdAndScheduleOverlap - Case 2: 요청 시간이 기존 수업에 일부 걸침 (앞)")
    void existsByUserIdAndScheduleOverlap_Case2_PartialOverlapFront() {
        // given: 기존 수업 (10:00 ~ 12:00)
        Schedule existingSchedule = Schedule.builder()
                .user(teacher)
                .course(course)
                .startsAt(baseTime)
                .endsAt(baseTime.plusHours(2))
                .status(ScheduleStatus.SCHEDULED)
                .build();
        entityManager.persistAndFlush(existingSchedule);

        // when: 요청 시간 (09:30 ~ 11:00) - 앞부분이 겹침
        OffsetDateTime requestStart = baseTime.minusMinutes(30);
        OffsetDateTime requestEnd = baseTime.plusHours(1);

        boolean result = scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacher.getId(),
                requestStart,
                requestEnd,
                ScheduleStatus.SCHEDULED
        );

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("existsByUserIdAndScheduleOverlap - Case 3: 요청 시간이 기존 수업에 일부 걸침 (뒤)")
    void existsByUserIdAndScheduleOverlap_Case3_PartialOverlapBack() {
        // given: 기존 수업 (10:00 ~ 12:00)
        Schedule existingSchedule = Schedule.builder()
                .user(teacher)
                .course(course)
                .startsAt(baseTime)
                .endsAt(baseTime.plusHours(2))
                .status(ScheduleStatus.SCHEDULED)
                .build();
        entityManager.persistAndFlush(existingSchedule);

        // when: 요청 시간 (11:00 ~ 12:30) - 뒷부분이 겹침
        OffsetDateTime requestStart = baseTime.plusHours(1);
        OffsetDateTime requestEnd = baseTime.plusHours(2).plusMinutes(30);

        boolean result = scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacher.getId(),
                requestStart,
                requestEnd,
                ScheduleStatus.SCHEDULED
        );

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("existsByUserIdAndScheduleOverlap - Case 4: 요청 시간이 기존 수업 안에 포함됨")
    void existsByUserIdAndScheduleOverlap_Case4_RequestInsideExisting() {
        // given: 기존 수업 (10:00 ~ 12:00)
        Schedule existingSchedule = Schedule.builder()
                .user(teacher)
                .course(course)
                .startsAt(baseTime)
                .endsAt(baseTime.plusHours(2))
                .status(ScheduleStatus.SCHEDULED)
                .build();
        entityManager.persistAndFlush(existingSchedule);

        // when: 요청 시간 (10:30 ~ 11:30) - 기존 수업 안에 완전히 포함됨
        OffsetDateTime requestStart = baseTime.plusMinutes(30);
        OffsetDateTime requestEnd = baseTime.plusHours(1).plusMinutes(30);

        boolean result = scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacher.getId(),
                requestStart,
                requestEnd,
                ScheduleStatus.SCHEDULED
        );

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("existsByUserIdAndScheduleOverlap - Case 5: 요청 시간이 기존 수업을 완전히 감쌈")
    void existsByUserIdAndScheduleOverlap_Case5_RequestWrapsExisting() {
        // given: 기존 수업 (10:00 ~ 12:00)
        Schedule existingSchedule = Schedule.builder()
                .user(teacher)
                .course(course)
                .startsAt(baseTime)
                .endsAt(baseTime.plusHours(2))
                .status(ScheduleStatus.SCHEDULED)
                .build();
        entityManager.persistAndFlush(existingSchedule);

        // when: 요청 시간 (09:00 ~ 13:00) - 기존 수업을 완전히 감쌈
        OffsetDateTime requestStart = baseTime.minusHours(1);
        OffsetDateTime requestEnd = baseTime.plusHours(3);

        boolean result = scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacher.getId(),
                requestStart,
                requestEnd,
                ScheduleStatus.SCHEDULED
        );

        // then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("existsByUserIdAndScheduleOverlap - Case 6: 요청 시간이 기존 수업과 전혀 안 겹침 (직전)")
    void existsByUserIdAndScheduleOverlap_Case6_NoOverlapBefore() {
        // given: 기존 수업 (10:00 ~ 12:00)
        Schedule existingSchedule = Schedule.builder()
                .user(teacher)
                .course(course)
                .startsAt(baseTime)
                .endsAt(baseTime.plusHours(2))
                .status(ScheduleStatus.SCHEDULED)
                .build();
        entityManager.persistAndFlush(existingSchedule);

        // when: 요청 시간 (08:00 ~ 10:00) - 직전 시간, 겹치지 않음 (endsAt == startsAt은 겹치지 않음)
        OffsetDateTime requestStart = baseTime.minusHours(2);
        OffsetDateTime requestEnd = baseTime;

        boolean result = scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacher.getId(),
                requestStart,
                requestEnd,
                ScheduleStatus.SCHEDULED
        );

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("existsByUserIdAndScheduleOverlap - Case 7: 요청 시간이 기존 수업과 전혀 안 겹침 (직후)")
    void existsByUserIdAndScheduleOverlap_Case7_NoOverlapAfter() {
        // given: 기존 수업 (10:00 ~ 12:00)
        Schedule existingSchedule = Schedule.builder()
                .user(teacher)
                .course(course)
                .startsAt(baseTime)
                .endsAt(baseTime.plusHours(2))
                .status(ScheduleStatus.SCHEDULED)
                .build();
        entityManager.persistAndFlush(existingSchedule);

        // when: 요청 시간 (12:00 ~ 14:00) - 직후 시간, 겹치지 않음 (startsAt == endsAt은 겹치지 않음)
        OffsetDateTime requestStart = baseTime.plusHours(2);
        OffsetDateTime requestEnd = baseTime.plusHours(4);

        boolean result = scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacher.getId(),
                requestStart,
                requestEnd,
                ScheduleStatus.SCHEDULED
        );

        // then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("existsByUserIdAndScheduleOverlap - Case 8: 다른 상태의 수업은 무시됨")
    void existsByUserIdAndScheduleOverlap_Case8_DifferentStatusIgnored() {
        // given: 기존 수업 (10:00 ~ 12:00) - CANCELLED 상태
        Schedule existingSchedule = Schedule.builder()
                .user(teacher)
                .course(course)
                .startsAt(baseTime)
                .endsAt(baseTime.plusHours(2))
                .status(ScheduleStatus.CANCELLED)
                .build();
        entityManager.persistAndFlush(existingSchedule);

        // when: 요청 시간 (10:00 ~ 12:00) - SCHEDULED 상태로 검색
        OffsetDateTime requestStart = baseTime;
        OffsetDateTime requestEnd = baseTime.plusHours(2);

        boolean result = scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacher.getId(),
                requestStart,
                requestEnd,
                ScheduleStatus.SCHEDULED
        );

        // then: CANCELLED 상태는 무시되므로 false
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("existsByUserIdAndScheduleOverlap - Case 9: 다른 강사의 수업은 무시됨")
    void existsByUserIdAndScheduleOverlap_Case9_DifferentTeacherIgnored() {
        // given: 다른 강사 생성
        User otherTeacher = User.builder()
                .id(UUID.randomUUID().toString())
                .name("Other Teacher")
                .email("other@test.com")
                .emailVerified(true)
                .image("")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();
        otherTeacher = userRepository.save(otherTeacher);

        // 다른 강사의 수업 (10:00 ~ 12:00)
        Schedule otherSchedule = Schedule.builder()
                .user(otherTeacher)
                .course(course)
                .startsAt(baseTime)
                .endsAt(baseTime.plusHours(2))
                .status(ScheduleStatus.SCHEDULED)
                .build();
        entityManager.persistAndFlush(otherSchedule);

        // when: 첫 번째 강사 ID로 검색
        OffsetDateTime requestStart = baseTime;
        OffsetDateTime requestEnd = baseTime.plusHours(2);

        boolean result = scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacher.getId(),
                requestStart,
                requestEnd,
                ScheduleStatus.SCHEDULED
        );

        // then: 다른 강사의 수업은 무시되므로 false
        assertThat(result).isFalse();
    }
}
