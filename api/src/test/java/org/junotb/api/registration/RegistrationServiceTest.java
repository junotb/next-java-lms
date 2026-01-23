package org.junotb.api.registration;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junotb.api.course.Course;
import org.junotb.api.course.CourseRepository;
import org.junotb.api.registration.dto.CourseRegistrationRequest;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.schedule.ScheduleStatus;
import org.junotb.api.user.TeacherAvailabilityRepository;
import org.junotb.api.user.TeacherTimeOff;
import org.junotb.api.user.TeacherTimeOffRepository;
import org.junotb.api.user.TeacherTimeOffType;
import org.springframework.data.jpa.domain.Specification;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
@DisplayName("RegistrationService Unit Test")
class RegistrationServiceTest {

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private TeacherAvailabilityRepository teacherAvailabilityRepository;

    @Mock
    private TeacherTimeOffRepository teacherTimeOffRepository;

    @Mock
    private RedissonClient redissonClient;

    @Mock
    private TransactionTemplate transactionTemplate;

    @Mock
    private RLock lock;

    @InjectMocks
    private RegistrationService registrationService;

    @Test
    @DisplayName("register_whenScheduleIsScheduled_thenSuccess")
    void register_whenScheduleIsScheduled_thenSuccess() throws Exception {
        // given
        Long scheduleId = 1L;
        String studentId = UUID.randomUUID().toString();

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

        Registration expectedRegistration = Registration.builder()
            .id(1L)
            .schedule(schedule)
            .student(student)
            .status(RegistrationStatus.REGISTERED)
            .registeredAt(OffsetDateTime.now())
            .build();

        // Mock Redisson lock
        given(redissonClient.getLock(anyString())).willReturn(lock);
        given(lock.tryLock(anyLong(), anyLong(), any(TimeUnit.class))).willReturn(true);
        given(lock.isHeldByCurrentThread()).willReturn(true);
        
        // Mock TransactionTemplate to execute the callback
        given(transactionTemplate.execute(any(TransactionCallback.class))).willAnswer(invocation -> {
            TransactionCallback<?> callback = invocation.getArgument(0);
            return callback.doInTransaction(null);
        });
        
        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));
        given(userRepository.findById(studentId)).willReturn(Optional.of(student));
        given(registrationRepository.existsByScheduleIdAndStudentIdAndStatus(scheduleId, studentId, RegistrationStatus.REGISTERED))
            .willReturn(false);
        given(registrationRepository.countByScheduleIdAndStatusRegistered(scheduleId)).willReturn(0L);
        given(registrationRepository.save(any(Registration.class))).willReturn(expectedRegistration);

        // when
        Registration result = registrationService.register(scheduleId, studentId);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getSchedule().getId()).isEqualTo(scheduleId);
        assertThat(result.getStudent().getId()).isEqualTo(studentId);
        assertThat(result.getStatus()).isEqualTo(RegistrationStatus.REGISTERED);
        then(registrationRepository).should().save(any(Registration.class));
    }

    @Test
    @DisplayName("register_whenScheduleIsNotScheduled_thenThrowException")
    void register_whenScheduleIsNotScheduled_thenThrowException() throws Exception {
        // given
        Long scheduleId = 1L;
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
            .id(scheduleId)
            .user(instructor)
            .course(course)
            .status(ScheduleStatus.ATTENDED) // 이미 수업 완료
            .startsAt(OffsetDateTime.now().minusDays(1))
            .endsAt(OffsetDateTime.now().minusDays(1).plusHours(1))
            .build();

        // Mock Redisson lock
        given(redissonClient.getLock(anyString())).willReturn(lock);
        given(lock.tryLock(anyLong(), anyLong(), any(TimeUnit.class))).willReturn(true);
        given(lock.isHeldByCurrentThread()).willReturn(true);
        
        // Mock TransactionTemplate to execute the callback
        given(transactionTemplate.execute(any(TransactionCallback.class))).willAnswer(invocation -> {
            TransactionCallback<?> callback = invocation.getArgument(0);
            return callback.doInTransaction(null);
        });
        
        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));

        // when & then
        assertThatThrownBy(() -> registrationService.register(scheduleId, studentId))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("Schedule is not available for registration");

        then(registrationRepository).should(never()).save(any(Registration.class));
    }

    @Test
    @DisplayName("register_whenDuplicateRegistration_thenThrowException")
    void register_whenDuplicateRegistration_thenThrowException() throws Exception {
        // given
        Long scheduleId = 1L;
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
            .build();

        // Mock Redisson lock
        given(redissonClient.getLock(anyString())).willReturn(lock);
        given(lock.tryLock(anyLong(), anyLong(), any(TimeUnit.class))).willReturn(true);
        given(lock.isHeldByCurrentThread()).willReturn(true);
        
        // Mock TransactionTemplate to execute the callback
        given(transactionTemplate.execute(any(TransactionCallback.class))).willAnswer(invocation -> {
            TransactionCallback<?> callback = invocation.getArgument(0);
            return callback.doInTransaction(null);
        });
        
        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));
        given(userRepository.findById(studentId)).willReturn(Optional.of(student));
        given(registrationRepository.existsByScheduleIdAndStudentIdAndStatus(scheduleId, studentId, RegistrationStatus.REGISTERED))
            .willReturn(true); // 이미 등록됨

        // when & then
        assertThatThrownBy(() -> registrationService.register(scheduleId, studentId))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("already registered");

        then(registrationRepository).should(never()).save(any(Registration.class));
    }

    @Test
    @DisplayName("register_whenScheduleIsFull_thenThrowException")
    void register_whenScheduleIsFull_thenThrowException() throws Exception {
        // given
        Long scheduleId = 1L;
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
            .build();

        // Mock Redisson lock
        given(redissonClient.getLock(anyString())).willReturn(lock);
        given(lock.tryLock(anyLong(), anyLong(), any(TimeUnit.class))).willReturn(true);
        given(lock.isHeldByCurrentThread()).willReturn(true);
        
        // Mock TransactionTemplate to execute the callback
        given(transactionTemplate.execute(any(TransactionCallback.class))).willAnswer(invocation -> {
            TransactionCallback<?> callback = invocation.getArgument(0);
            return callback.doInTransaction(null);
        });
        
        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));
        given(userRepository.findById(studentId)).willReturn(Optional.of(student));
        given(registrationRepository.existsByScheduleIdAndStudentIdAndStatus(scheduleId, studentId, RegistrationStatus.REGISTERED))
            .willReturn(false);
        given(registrationRepository.countByScheduleIdAndStatusRegistered(scheduleId)).willReturn(1L); // 이미 1명 등록됨

        // when & then
        assertThatThrownBy(() -> registrationService.register(scheduleId, studentId))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("Schedule is already full");

        then(registrationRepository).should(never()).save(any(Registration.class));
    }

    @Test
    @DisplayName("register_whenScheduleNotFound_thenThrowException")
    void register_whenScheduleNotFound_thenThrowException() throws Exception {
        // given
        Long scheduleId = 999L;
        String studentId = UUID.randomUUID().toString();

        // Mock Redisson lock
        given(redissonClient.getLock(anyString())).willReturn(lock);
        given(lock.tryLock(anyLong(), anyLong(), any(TimeUnit.class))).willReturn(true);
        given(lock.isHeldByCurrentThread()).willReturn(true);
        
        // Mock TransactionTemplate to execute the callback
        given(transactionTemplate.execute(any(TransactionCallback.class))).willAnswer(invocation -> {
            TransactionCallback<?> callback = invocation.getArgument(0);
            return callback.doInTransaction(null);
        });
        
        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> registrationService.register(scheduleId, studentId))
            .isInstanceOf(EntityNotFoundException.class)
            .hasMessageContaining("Schedule not found");

        then(registrationRepository).should(never()).save(any(Registration.class));
    }

    @Test
    @DisplayName("cancel_whenRegistrationExists_thenSuccess")
    void cancel_whenRegistrationExists_thenSuccess() {
        // given
        Long registrationId = 1L;

        User student = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Student")
            .build();

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

        Registration registration = Registration.builder()
            .id(registrationId)
            .schedule(schedule)
            .student(student)
            .status(RegistrationStatus.REGISTERED)
            .build();

        given(registrationRepository.findById(registrationId)).willReturn(Optional.of(registration));

        // when
        Registration result = registrationService.cancel(registrationId);

        // then
        assertThat(result.getStatus()).isEqualTo(RegistrationStatus.CANCELED);
    }

    @Test
    @DisplayName("cancel_whenAlreadyCanceled_thenThrowException")
    void cancel_whenAlreadyCanceled_thenThrowException() {
        // given
        Long registrationId = 1L;

        User student = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Student")
            .build();

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

        Registration registration = Registration.builder()
            .id(registrationId)
            .schedule(schedule)
            .student(student)
            .status(RegistrationStatus.CANCELED) // 이미 취소됨
            .build();

        given(registrationRepository.findById(registrationId)).willReturn(Optional.of(registration));

        // when & then
        assertThatThrownBy(() -> registrationService.cancel(registrationId))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("already canceled");
    }

    @Test
    @DisplayName("registerCourse_Success - 강사 A가 월/수 14:00 가능 -> 학생이 1개월 신청 -> 스케줄 8개(4주x2회) 생성 확인")
    void registerCourse_Success() throws Exception {
        // given
        String studentId = UUID.randomUUID().toString();
        String teacherId = UUID.randomUUID().toString();
        Long courseId = 1L;

        User student = User.builder()
                .id(studentId)
                .name("Student")
                .email("student@test.com")
                .role(UserRole.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();

        User teacher = User.builder()
                .id(teacherId)
                .name("Teacher")
                .email("teacher@test.com")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        Course course = Course.builder()
                .id(courseId)
                .title("Java Basics")
                .build();

        CourseRegistrationRequest request = new CourseRegistrationRequest(
                courseId,
                1, // 1개월
                List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY),
                LocalTime.of(14, 0),
                60 // 60분
        );

        Registration expectedRegistration = Registration.builder()
                .id(1L)
                .student(student)
                .status(RegistrationStatus.REGISTERED)
                .build();

        // Mock Redisson lock
        given(redissonClient.getLock(anyString())).willReturn(lock);
        given(lock.tryLock(anyLong(), anyLong(), any(TimeUnit.class))).willReturn(true);
        given(lock.isHeldByCurrentThread()).willReturn(true);
        
        // Mock TransactionTemplate to execute the callback
        given(transactionTemplate.execute(any(TransactionCallback.class))).willAnswer(invocation -> {
            TransactionCallback<?> callback = invocation.getArgument(0);
            return callback.doInTransaction(null);
        });
        
        given(userRepository.findById(studentId)).willReturn(Optional.of(student));
        given(courseRepository.findById(courseId)).willReturn(Optional.of(course));
        given(teacherAvailabilityRepository.findCandidates(
                request.days(),
                request.startTime(),
                request.startTime().plusMinutes(request.durationMinutes()),
                (long) request.days().size()
        )).willReturn(List.of(teacherId));
        given(scheduleRepository.findAll(any(Specification.class))).willReturn(List.of()); // 기존 스케줄 없음
        given(teacherTimeOffRepository.findByTeacher_IdAndStartDateTimeLessThanEqualAndEndDateTimeGreaterThanEqual(
                anyString(), any(), any()
        )).willReturn(List.of()); // 휴무 없음
        given(userRepository.findById(teacherId)).willReturn(Optional.of(teacher));
        given(scheduleRepository.saveAll(any())).willAnswer(invocation -> {
            List<Schedule> schedules = invocation.getArgument(0);
            for (int i = 0; i < schedules.size(); i++) {
                Schedule s = schedules.get(i);
                s.setId((long) (i + 1));
            }
            return schedules;
        });
        given(registrationRepository.save(any(Registration.class))).willReturn(expectedRegistration);

        // when
        Registration result = registrationService.registerCourse(studentId, request);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(RegistrationStatus.REGISTERED);
        then(scheduleRepository).should().saveAll(any()); // 스케줄이 저장되었는지 확인
    }

    @Test
    @DisplayName("registerCourse_Fail_TimeOff - 강사 A가 월/수 가능하지만, 중간에 '연차'가 껴있는 경우 -> 매칭 실패 확인")
    void registerCourse_Fail_TimeOff() {
        // given
        String studentId = UUID.randomUUID().toString();
        String teacherId = UUID.randomUUID().toString();
        Long courseId = 1L;

        User student = User.builder()
                .id(studentId)
                .name("Student")
                .email("student@test.com")
                .role(UserRole.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();

        Course course = Course.builder()
                .id(courseId)
                .title("Java Basics")
                .build();

        CourseRegistrationRequest request = new CourseRegistrationRequest(
                courseId,
                1, // 1개월
                List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY),
                LocalTime.of(14, 0),
                60 // 60분
        );

        // 첫 번째 월요일 날짜 계산
        LocalDate firstMonday = LocalDate.now();
        while (firstMonday.getDayOfWeek() != DayOfWeek.MONDAY) {
            firstMonday = firstMonday.plusDays(1);
        }
        LocalDateTime firstMondayDateTime = firstMonday.atTime(14, 0);

        User teacher = User.builder()
                .id(teacherId)
                .name("Teacher")
                .email("teacher@test.com")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        TeacherTimeOff timeOff = TeacherTimeOff.builder()
                .id(1L)
                .teacher(teacher)
                .startDateTime(firstMondayDateTime.minusHours(1))
                .endDateTime(firstMondayDateTime.plusHours(2))
                .type(TeacherTimeOffType.VACATION)
                .reason("연차")
                .build();

        given(userRepository.findById(studentId)).willReturn(Optional.of(student));
        given(courseRepository.findById(courseId)).willReturn(Optional.of(course));
        given(teacherAvailabilityRepository.findCandidates(
                request.days(),
                request.startTime(),
                request.startTime().plusMinutes(request.durationMinutes()),
                (long) request.days().size()
        )).willReturn(List.of(teacherId));
        given(scheduleRepository.findAll(any(Specification.class))).willReturn(List.of()); // 기존 스케줄 없음
        given(teacherTimeOffRepository.findByTeacher_IdAndStartDateTimeLessThanEqualAndEndDateTimeGreaterThanEqual(
                anyString(), any(), any()
        )).willReturn(List.of(timeOff)); // 휴무 있음

        // when & then
        assertThatThrownBy(() -> registrationService.registerCourse(studentId, request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("No available teacher found");

        then(scheduleRepository).should(never()).saveAll(any());
        then(registrationRepository).should(never()).save(any(Registration.class));
    }

    @Test
    @DisplayName("registerCourse_Fail_ScheduleConflict - 강사 A가 해당 시간에 이미 다른 수업이 있는 경우 -> 매칭 실패 확인")
    void registerCourse_Fail_ScheduleConflict() {
        // given
        String studentId = UUID.randomUUID().toString();
        String teacherId = UUID.randomUUID().toString();
        Long courseId = 1L;

        User student = User.builder()
                .id(studentId)
                .name("Student")
                .email("student@test.com")
                .role(UserRole.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();

        User otherTeacher = User.builder()
                .id(UUID.randomUUID().toString())
                .name("Other Teacher")
                .build();

        Course course = Course.builder()
                .id(courseId)
                .title("Java Basics")
                .build();

        Course otherCourse = Course.builder()
                .id(2L)
                .title("Python Basics")
                .build();

        CourseRegistrationRequest request = new CourseRegistrationRequest(
                courseId,
                1, // 1개월
                List.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY),
                LocalTime.of(14, 0),
                60 // 60분
        );

        // 첫 번째 월요일 날짜 계산
        LocalDate firstMonday = LocalDate.now();
        while (firstMonday.getDayOfWeek() != DayOfWeek.MONDAY) {
            firstMonday = firstMonday.plusDays(1);
        }
        LocalDateTime firstMondayDateTime = firstMonday.atTime(14, 0);

        Schedule conflictingSchedule = Schedule.builder()
                .id(1L)
                .user(otherTeacher)
                .course(otherCourse)
                .status(ScheduleStatus.SCHEDULED)
                .startsAt(firstMondayDateTime.atOffset(ZoneOffset.UTC))
                .endsAt(firstMondayDateTime.plusHours(1).atOffset(ZoneOffset.UTC))
                .build();

        given(userRepository.findById(studentId)).willReturn(Optional.of(student));
        given(courseRepository.findById(courseId)).willReturn(Optional.of(course));
        given(teacherAvailabilityRepository.findCandidates(
                request.days(),
                request.startTime(),
                request.startTime().plusMinutes(request.durationMinutes()),
                (long) request.days().size()
        )).willReturn(List.of(teacherId));
        given(scheduleRepository.findAll(any(Specification.class))).willReturn(List.of(conflictingSchedule)); // 기존 스케줄 있음
        given(teacherTimeOffRepository.findByTeacher_IdAndStartDateTimeLessThanEqualAndEndDateTimeGreaterThanEqual(
                anyString(), any(), any()
        )).willReturn(List.of()); // 휴무 없음

        // when & then
        assertThatThrownBy(() -> registrationService.registerCourse(studentId, request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("No available teacher found");

        then(scheduleRepository).should(never()).saveAll(any());
        then(registrationRepository).should(never()).save(any(Registration.class));
    }
}
