package org.junotb.api.registration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junotb.api.course.Course;
import org.junotb.api.course.CourseRepository;
import org.junotb.api.course.CourseStatus;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.schedule.ScheduleStatus;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("RegistrationConcurrencyTest Integration Test")
@Disabled("Requires Redis connection - enable when Redis is available")
class RegistrationConcurrencyTest {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    private Schedule testSchedule;
    private List<User> testStudents;
    private static final int CONCURRENT_REQUESTS = 100;

    @BeforeEach
    void setUp() {
        // 기존 데이터 정리
        registrationRepository.deleteAll();
        scheduleRepository.deleteAll();
        userRepository.deleteAll();
        courseRepository.deleteAll();

        // 강사 생성
        User instructor = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Instructor")
            .email("instructor@test.com")
            .emailVerified(true)
            .image("")
            .role(UserRole.TEACHER)
            .status(UserStatus.ACTIVE)
            .build();
        userRepository.save(instructor);

        // 코스 생성
        Course course = Course.builder()
            .title("Java Concurrency Test")
            .description("Test course for concurrency")
            .status(CourseStatus.ACTIVE)
            .build();
        courseRepository.save(course);

        // 스케줄 생성 (1:1 수업)
        testSchedule = Schedule.builder()
            .user(instructor)
            .course(course)
            .startsAt(OffsetDateTime.now().plusDays(1))
            .endsAt(OffsetDateTime.now().plusDays(1).plusHours(1))
            .status(ScheduleStatus.SCHEDULED)
            .build();
        testSchedule = scheduleRepository.save(testSchedule);

        // 100명의 학생 생성
        testStudents = new ArrayList<>();
        for (int i = 0; i < CONCURRENT_REQUESTS; i++) {
            User student = User.builder()
                .id(UUID.randomUUID().toString())
                .name("Student " + i)
                .email("student" + i + "@test.com")
                .emailVerified(true)
                .image("")
                .role(UserRole.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();
            testStudents.add(userRepository.save(student));
        }
    }

    @Test
    @DisplayName("register_when100ConcurrentRequests_thenOnlyOneSucceeds")
    void register_when100ConcurrentRequests_thenOnlyOneSucceeds() throws InterruptedException {
        // given
        ExecutorService executorService = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(CONCURRENT_REQUESTS);
        CountDownLatch startLatch = new CountDownLatch(1);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        // when
        for (int i = 0; i < CONCURRENT_REQUESTS; i++) {
            final int index = i;
            executorService.submit(() -> {
                try {
                    // 모든 스레드가 동시에 시작하도록 대기
                    startLatch.await();
                    
                    registrationService.register(testSchedule.getId(), testStudents.get(index).getId());
                    successCount.incrementAndGet();
                } catch (IllegalStateException e) {
                    // 정원 초과 또는 중복 등록 예외 예상
                    failureCount.incrementAndGet();
                } catch (Exception e) {
                    // 기타 예외
                    System.err.println("Unexpected exception: " + e.getMessage());
                    failureCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        // 모든 스레드 동시 시작
        startLatch.countDown();
        
        // 모든 작업 완료 대기
        latch.await();
        executorService.shutdown();

        // then
        // 실제 DB에 저장된 등록 수 확인
        long actualRegistrationCount = registrationRepository.countByScheduleIdAndStatusRegistered(testSchedule.getId());
        
        System.out.println("=== Concurrency Test Results ===");
        System.out.println("Total requests: " + CONCURRENT_REQUESTS);
        System.out.println("Success count: " + successCount.get());
        System.out.println("Failure count: " + failureCount.get());
        System.out.println("Actual DB count: " + actualRegistrationCount);
        
        // 1:1 수업이므로 정확히 1명만 등록되어야 함
        assertThat(actualRegistrationCount).isEqualTo(1);
        assertThat(successCount.get()).isEqualTo(1);
        assertThat(failureCount.get()).isEqualTo(CONCURRENT_REQUESTS - 1);
        
        // 스케줄 상태는 여전히 SCHEDULED여야 함 (또는 비즈니스 로직에 따라 변경)
        Schedule updatedSchedule = scheduleRepository.findById(testSchedule.getId()).orElseThrow();
        assertThat(updatedSchedule.getStatus()).isEqualTo(ScheduleStatus.SCHEDULED);
    }

    @Test
    @DisplayName("register_when50ConcurrentRequestsWith2Schedules_thenEachScheduleHasOneRegistration")
    void register_when50ConcurrentRequestsWith2Schedules_thenEachScheduleHasOneRegistration() throws InterruptedException {
        // given
        // 두 번째 스케줄 생성
        User instructor = userRepository.findAll().get(0);
        Course course = courseRepository.findAll().get(0);
        
        Schedule secondSchedule = Schedule.builder()
            .user(instructor)
            .course(course)
            .startsAt(OffsetDateTime.now().plusDays(2))
            .endsAt(OffsetDateTime.now().plusDays(2).plusHours(1))
            .status(ScheduleStatus.SCHEDULED)
            .build();
        secondSchedule = scheduleRepository.save(secondSchedule);

        ExecutorService executorService = Executors.newFixedThreadPool(32);
        CountDownLatch latch = new CountDownLatch(CONCURRENT_REQUESTS);
        CountDownLatch startLatch = new CountDownLatch(1);

        final Long schedule1Id = testSchedule.getId();
        final Long schedule2Id = secondSchedule.getId();

        // when
        for (int i = 0; i < CONCURRENT_REQUESTS; i++) {
            final int index = i;
            executorService.submit(() -> {
                try {
                    startLatch.await();
                    
                    // 짝수 인덱스는 첫 번째 스케줄, 홀수는 두 번째 스케줄에 신청
                    Long targetScheduleId = (index % 2 == 0) ? schedule1Id : schedule2Id;
                    registrationService.register(targetScheduleId, testStudents.get(index).getId());
                } catch (IllegalStateException e) {
                    // 정원 초과 예상
                } catch (Exception e) {
                    System.err.println("Unexpected exception: " + e.getMessage());
                } finally {
                    latch.countDown();
                }
            });
        }

        startLatch.countDown();
        latch.await();
        executorService.shutdown();

        // then
        long schedule1Count = registrationRepository.countByScheduleIdAndStatusRegistered(schedule1Id);
        long schedule2Count = registrationRepository.countByScheduleIdAndStatusRegistered(schedule2Id);

        System.out.println("=== Multi-Schedule Concurrency Test Results ===");
        System.out.println("Schedule 1 registrations: " + schedule1Count);
        System.out.println("Schedule 2 registrations: " + schedule2Count);

        // 각 스케줄에 정확히 1명씩 등록되어야 함
        assertThat(schedule1Count).isEqualTo(1);
        assertThat(schedule2Count).isEqualTo(1);
    }
}
