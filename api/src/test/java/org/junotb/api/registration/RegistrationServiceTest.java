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
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;
import org.mockito.ArgumentCaptor;

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
        
        given(userRepository.findById(studentId)).willReturn(Optional.of(student));
        given(courseRepository.findById(courseId)).willReturn(Optional.of(course));
        given(teacherAvailabilityRepository.findCandidates(
                any(), any(), any(), anyLong(), any(), any(), any()
        )).willReturn(List.of(teacherId));
        given(scheduleRepository.findAll(any(Specification.class))).willReturn(List.of()); // 기존 스케줄 없음
        given(teacherTimeOffRepository.findOverlappingByTeacherAndRange(
                anyString(), any(OffsetDateTime.class), any(OffsetDateTime.class)
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
        
        // 스케줄 개수 검증: 1개월(약 4주) * 주 2회(월/수) = 약 8개
        ArgumentCaptor<List<Schedule>> scheduleCaptor = ArgumentCaptor.forClass(List.class);
        then(scheduleRepository).should().saveAll(scheduleCaptor.capture());
        List<Schedule> savedSchedules = scheduleCaptor.getValue();
        // 1개월이면 약 4주, 주 2회이므로 8개 정도의 스케줄이 생성되어야 함
        // 정확한 개수는 시작 날짜에 따라 달라질 수 있지만, 최소 7개 이상은 되어야 함
        assertThat(savedSchedules.size()).isBetween(7, 9);
        
        then(registrationRepository).should().save(any(Registration.class));
    }

    @Test
    @DisplayName("registerCourse_Fail_TimeOff_Conflict - 강사 A가 월/수 가능하지만, 중간에 '연차'가 껴있는 경우 -> 매칭 실패 확인")
    void registerCourse_Fail_TimeOff_Conflict() {
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
                .startDateTime(firstMondayDateTime.minusHours(1).atOffset(ZoneOffset.UTC))
                .endDateTime(firstMondayDateTime.plusHours(2).atOffset(ZoneOffset.UTC))
                .type(TeacherTimeOffType.VACATION)
                .reason("연차")
                .build();

        given(userRepository.findById(studentId)).willReturn(Optional.of(student));
        given(courseRepository.findById(courseId)).willReturn(Optional.of(course));
        given(teacherAvailabilityRepository.findCandidates(
                any(), any(), any(), anyLong(), any(), any(), any()
        )).willReturn(List.of(teacherId));
        given(scheduleRepository.findAll(any(Specification.class))).willReturn(List.of()); // 기존 스케줄 없음
        given(teacherTimeOffRepository.findOverlappingByTeacherAndRange(
                anyString(), any(), any()
        )).willReturn(List.of(timeOff)); // 휴무 있음

        // when & then
        // findAvailableTeacher가 null을 반환하므로 락 획득 전에 예외 발생
        assertThatThrownBy(() -> registrationService.registerCourse(studentId, request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("No available teacher found");

        then(scheduleRepository).should(never()).saveAll(any());
        then(registrationRepository).should(never()).save(any(Registration.class));
        then(transactionTemplate).should(never()).execute(any(TransactionCallback.class));
    }

    @Test
    @DisplayName("registerCourse_Success_Skip_Busy_Teacher - 강사 A는 바쁘고 강사 B는 가능한 경우 -> 강사 B와 매칭 성공")
    void registerCourse_Success_Skip_Busy_Teacher() throws Exception {
        // given
        String studentId = UUID.randomUUID().toString();
        String teacherAId = UUID.randomUUID().toString();
        String teacherBId = UUID.randomUUID().toString();
        Long courseId = 1L;

        User student = User.builder()
                .id(studentId)
                .name("Student")
                .email("student@test.com")
                .role(UserRole.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();

        User teacherA = User.builder()
                .id(teacherAId)
                .name("Teacher A")
                .email("teachera@test.com")
                .role(UserRole.TEACHER)
                .status(UserStatus.ACTIVE)
                .build();

        User teacherB = User.builder()
                .id(teacherBId)
                .name("Teacher B")
                .email("teacherb@test.com")
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

        // 첫 번째 월요일 날짜 계산
        LocalDate firstMonday = LocalDate.now();
        while (firstMonday.getDayOfWeek() != DayOfWeek.MONDAY) {
            firstMonday = firstMonday.plusDays(1);
        }
        LocalDateTime firstMondayDateTime = firstMonday.atTime(14, 0);

        // 강사 A의 기존 스케줄 (충돌 발생)
        Schedule conflictingSchedule = Schedule.builder()
                .id(1L)
                .user(teacherA)
                .course(course)
                .status(ScheduleStatus.SCHEDULED)
                .startsAt(firstMondayDateTime.atOffset(ZoneOffset.UTC))
                .endsAt(firstMondayDateTime.plusHours(1).atOffset(ZoneOffset.UTC))
                .build();

        Registration expectedRegistration = Registration.builder()
                .id(1L)
                .student(student)
                .status(RegistrationStatus.REGISTERED)
                .build();

        // Mock Redisson lock
        given(redissonClient.getLock(anyString())).willReturn(lock);
        given(lock.tryLock(anyLong(), anyLong(), any(TimeUnit.class))).willReturn(true);
        given(lock.isHeldByCurrentThread()).willReturn(true);
        
        given(userRepository.findById(studentId)).willReturn(Optional.of(student));
        given(courseRepository.findById(courseId)).willReturn(Optional.of(course));
        given(teacherAvailabilityRepository.findCandidates(
                any(), any(), any(), anyLong(), any(), any(), any()
        )).willReturn(List.of(teacherAId, teacherBId)); // 두 강사 모두 후보
        
        // 호출 횟수를 추적하여 강사 A와 B를 구분
        // findAvailableTeacher는 두 번 호출됨:
        // 1. 락 획득 전: 후보 강사 리스트로 호출 (teacherAId, teacherBId)
        // 2. 트랜잭션 내부: 선택된 강사만으로 재검증 (teacherBId)
        java.util.concurrent.atomic.AtomicInteger scheduleCallCount = new java.util.concurrent.atomic.AtomicInteger(0);
        
        // 강사 A 조회 시 충돌 스케줄 반환, 강사 B 조회 시 빈 리스트 반환
        given(scheduleRepository.findAll(any(Specification.class))).willAnswer(invocation -> {
            int count = scheduleCallCount.getAndIncrement();
            if (count == 0) {
                // 첫 번째 호출: 강사 A (충돌 있음)
                return List.of(conflictingSchedule);
            } else if (count == 1) {
                // 두 번째 호출: 강사 B (충돌 없음) - 락 획득 전
                return List.of();
            } else {
                // 세 번째 호출: 강사 B 재검증 (트랜잭션 내부) - 충돌 없음
                return List.of();
            }
        });
        
        // 휴무는 모두 없음 (여러 번 호출될 수 있음)
        given(teacherTimeOffRepository.findOverlappingByTeacherAndRange(
                anyString(), any(OffsetDateTime.class), any(OffsetDateTime.class)
        )).willReturn(List.of()); // 휴무 없음
        
        // 트랜잭션 내부에서 강사 B 조회
        given(userRepository.findById(teacherBId)).willReturn(Optional.of(teacherB));
        given(scheduleRepository.saveAll(any())).willAnswer(invocation -> {
            List<Schedule> schedules = invocation.getArgument(0);
            for (int i = 0; i < schedules.size(); i++) {
                Schedule s = schedules.get(i);
                s.setId((long) (i + 1));
                // 강사 B의 ID로 저장되는지 확인
                assertThat(s.getUser().getId()).isEqualTo(teacherBId);
            }
            return schedules;
        });
        given(registrationRepository.save(any(Registration.class))).willReturn(expectedRegistration);

        // when
        Registration result = registrationService.registerCourse(studentId, request);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(RegistrationStatus.REGISTERED);
        then(scheduleRepository).should().saveAll(any());
        
        // 저장된 스케줄이 강사 B의 ID를 가지고 있는지 확인
        then(scheduleRepository).should().saveAll(argThat(schedules -> {
            List<Schedule> scheduleList = (List<Schedule>) schedules;
            return scheduleList.stream()
                    .allMatch(s -> s.getUser().getId().equals(teacherBId));
        }));
        then(registrationRepository).should().save(any(Registration.class));
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
                any(), any(), any(), anyLong(), any(), any(), any()
        )).willReturn(List.of(teacherId));
        given(scheduleRepository.findAll(any(Specification.class))).willReturn(List.of(conflictingSchedule)); // 기존 스케줄 있음
        given(teacherTimeOffRepository.findOverlappingByTeacherAndRange(
                anyString(), any(OffsetDateTime.class), any(OffsetDateTime.class)
        )).willReturn(List.of()); // 휴무 없음

        // when & then
        assertThatThrownBy(() -> registrationService.registerCourse(studentId, request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("No available teacher found");

        then(scheduleRepository).should(never()).saveAll(any());
        then(registrationRepository).should(never()).save(any(Registration.class));
        then(transactionTemplate).should(never()).execute(any(TransactionCallback.class));
    }

    @Test
    @DisplayName("registerCourse_Fail_Lock_Timeout - 락 획득 실패 시 LockAcquisitionException 발생 및 트랜잭션 미실행 확인")
    void registerCourse_Fail_Lock_Timeout() throws Exception {
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

        // Mock Redisson lock - 락 획득 실패
        given(redissonClient.getLock(anyString())).willReturn(lock);
        given(lock.tryLock(anyLong(), anyLong(), any(TimeUnit.class))).willReturn(false); // 락 획득 실패
        
        given(userRepository.findById(studentId)).willReturn(Optional.of(student));
        given(courseRepository.findById(courseId)).willReturn(Optional.of(course));
        given(teacherAvailabilityRepository.findCandidates(
                any(), any(), any(), anyLong(), any(), any(), any()
        )).willReturn(List.of(teacherId));
        given(scheduleRepository.findAll(any(Specification.class))).willReturn(List.of()); // 기존 스케줄 없음
        given(teacherTimeOffRepository.findOverlappingByTeacherAndRange(
                anyString(), any(OffsetDateTime.class), any(OffsetDateTime.class)
        )).willReturn(List.of()); // 휴무 없음

        // when & then
        assertThatThrownBy(() -> registrationService.registerCourse(studentId, request))
                .isInstanceOf(org.junotb.api.common.exception.LockAcquisitionException.class)
                .hasMessageContaining("현재 수강 신청이 몰려 처리할 수 없습니다");

        // 트랜잭션이 실행되지 않아야 함
        then(transactionTemplate).should(never()).execute(any(TransactionCallback.class));
        then(scheduleRepository).should(never()).saveAll(any());
        then(registrationRepository).should(never()).save(any(Registration.class));
    }
}
