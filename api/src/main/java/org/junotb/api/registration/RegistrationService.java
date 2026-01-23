package org.junotb.api.registration;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.exception.DuplicateResourceException;
import org.junotb.api.common.exception.LockAcquisitionException;
import org.junotb.api.course.Course;
import org.junotb.api.course.CourseRepository;
import org.junotb.api.registration.dto.CourseRegistrationRequest;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.schedule.ScheduleStatus;
import org.junotb.api.user.TeacherAvailabilityRepository;
import org.junotb.api.user.TeacherTimeOff;
import org.junotb.api.user.TeacherTimeOffRepository;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.junotb.api.user.UserRole;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RegistrationService {
    private final RegistrationRepository registrationRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final TeacherAvailabilityRepository teacherAvailabilityRepository;
    private final TeacherTimeOffRepository teacherTimeOffRepository;
    private final RedissonClient redissonClient;
    private final TransactionTemplate transactionTemplate;

    // 등록 조회
    public Optional<Registration> findById(Long id) {
        return registrationRepository.findById(id);
    }

    // 등록 목록 조회 (페이징)
    public Page<Registration> findList(Long scheduleId, String studentId, RegistrationStatus status, Pageable pageable) {
        Specification<Registration> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (scheduleId != null) {
                predicates = cb.and(
                    predicates,
                    cb.equal(root.get("schedule").get("id"), scheduleId)
                );
            }

            if (studentId != null && !studentId.isBlank()) {
                predicates = cb.and(
                    predicates,
                    cb.equal(root.get("student").get("id"), studentId)
                );
            }

            if (status != null) {
                predicates = cb.and(
                    predicates,
                    cb.equal(root.get("status"), status)
                );
            }

            return predicates;
        };

        return registrationRepository.findAll(spec, pageable);
    }

    // 학생별 등록 목록 조회
    public List<Registration> findByStudentId(String studentId) {
        return registrationRepository.findByStudentIdOrderByRegisteredAtDesc(studentId);
    }

    // 스케줄별 등록 목록 조회
    public List<Registration> findByScheduleId(Long scheduleId) {
        return registrationRepository.findByScheduleIdOrderByRegisteredAtDesc(scheduleId);
    }

    // 수강 신청 (Redisson 분산 락 적용)
    public Registration register(Long scheduleId, String studentId) {
        // 1. 분산 락 키 생성
        String lockKey = "lock:schedule:" + scheduleId;
        RLock lock = redissonClient.getLock(lockKey);
        
        try {
            // 2. 락 획득 시도 (wait=3초, lease=5초)
            boolean isLocked = lock.tryLock(3, 5, TimeUnit.SECONDS);
            
            if (!isLocked) {
                throw new IllegalStateException("Failed to acquire lock for schedule: " + scheduleId);
            }
            
            // 3. 트랜잭션 내에서 검증 및 등록 수행
            return transactionTemplate.execute(status -> {
                // 스케줄 존재 여부 확인
                Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(
                    () -> new EntityNotFoundException("Schedule not found with id: " + scheduleId)
                );

                // 스케줄 상태 확인 (SCHEDULED 상태만 신청 가능)
                if (schedule.getStatus() != org.junotb.api.schedule.ScheduleStatus.SCHEDULED) {
                    throw new IllegalStateException("Schedule is not available for registration. Current status: " + schedule.getStatus());
                }

                // 학생 존재 여부 확인
                User student = userRepository.findById(studentId).orElseThrow(
                    () -> new EntityNotFoundException("Student not found with id: " + studentId)
                );

                // 이미 등록된 경우 중복 등록 방지
                if (registrationRepository.existsByScheduleIdAndStudentIdAndStatus(scheduleId, studentId, RegistrationStatus.REGISTERED)) {
                    throw new IllegalStateException("Student has already registered for this schedule");
                }

                // 1:1 수업이므로 정원 체크 (최대 1명)
                long currentCount = registrationRepository.countByScheduleIdAndStatusRegistered(scheduleId);
                if (currentCount >= 1) {
                    throw new IllegalStateException("Schedule is already full");
                }

                Registration registration = Registration.create(schedule, student, RegistrationStatus.REGISTERED);
                return registrationRepository.save(registration);
            });
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Thread was interrupted while waiting for lock", e);
        } finally {
            // 4. 락 해제 (트랜잭션 커밋 후)
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    // 수강 신청 취소
    @Transactional
    public Registration cancel(Long id) {
        Registration registration = registrationRepository.findById(id).orElseThrow(
            () -> new EntityNotFoundException("Registration not found with id: " + id)
        );

        if (registration.getStatus() == RegistrationStatus.CANCELED) {
            throw new IllegalStateException("Registration is already canceled");
        }

        registration.setStatus(RegistrationStatus.CANCELED);
        return registration;
    }

    // 특정 학생의 특정 스케줄 등록 취소
    @Transactional
    public Registration cancelByScheduleAndStudent(Long scheduleId, String studentId) {
        Registration registration = registrationRepository.findByScheduleIdAndStudentId(scheduleId, studentId)
            .orElseThrow(() -> new EntityNotFoundException(
                "Registration not found with scheduleId=" + scheduleId + ", studentId=" + studentId
            ));

        if (registration.getStatus() == RegistrationStatus.CANCELED) {
            throw new IllegalStateException("Registration is already canceled");
        }

        registration.setStatus(RegistrationStatus.CANCELED);
        return registration;
    }

    // 스케줄별 등록 수 조회
    public long countByScheduleId(Long scheduleId) {
        return registrationRepository.countByScheduleIdAndStatusRegistered(scheduleId);
    }

    // 상태별 등록 수 집계
    @Transactional(readOnly = true)
    public Map<RegistrationStatus, Long> countByStatus() {
        EnumMap<RegistrationStatus, Long> result = new EnumMap<>(RegistrationStatus.class);

        for (RegistrationStatus status : RegistrationStatus.values()) {
            result.put(status, 0L);
        }

        registrationRepository.countByStatus().forEach(row -> result.put(row.getStatus(), row.getCount()));

        return result;
    }

    /**
     * 강좌 수강 신청 (자동 강사 매칭 및 스케줄 생성)
     * 분산 락을 적용하여 동시성 문제를 방지합니다.
     */
    private static final long LOCK_WAIT_TIME = 5L;
    private static final long LOCK_LEASE_TIME = 3L;

    public Registration registerCourse(String studentId, CourseRegistrationRequest request) {
        // 1. 학생 존재 및 역할 확인
        User student = userRepository.findById(studentId).orElseThrow(
                () -> new EntityNotFoundException("Student not found with id: " + studentId)
        );

        if (student.getRole() != UserRole.STUDENT) {
            throw new IllegalStateException("Only students can register for courses");
        }

        // 2. 강좌 존재 확인
        Course course = courseRepository.findById(request.courseId()).orElseThrow(
                () -> new EntityNotFoundException("Course not found with id: " + request.courseId())
        );

        // 3. 종료 시간 계산
        LocalTime endTime = request.startTime().plusMinutes(request.durationMinutes());

        // 4. 후보 강사 조회 (모든 요일과 시간 범위를 커버하는 강사)
        List<String> candidateTeacherIds = teacherAvailabilityRepository.findCandidates(
                request.days(),
                request.startTime(),
                endTime,
                (long) request.days().size()
        );

        if (candidateTeacherIds.isEmpty()) {
            throw new IllegalStateException("No available teacher found for the requested schedule");
        }

        // 5. 날짜 생성 (향후 N개월간의 모든 수업 날짜)
        List<LocalDateTime> classDates = generateClassDates(
                request.days(),
                request.startTime(),
                request.durationMinutes(),
                request.months()
        );

        // 6. 가용성 검증 및 최종 강사 선택
        String selectedTeacherId = findAvailableTeacher(
                candidateTeacherIds,
                classDates,
                request.durationMinutes()
        );

        if (selectedTeacherId == null) {
            throw new IllegalStateException("No available teacher found after availability check");
        }

        // 7. 분산 락 적용 (매칭된 강사 ID 기준)
        String lockKey = "lock:registration:teacher:" + selectedTeacherId;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            // 락 획득 시도 (waitTime 5초, leaseTime 3초)
            boolean isLocked = lock.tryLock(LOCK_WAIT_TIME, LOCK_LEASE_TIME, TimeUnit.SECONDS);

            if (!isLocked) {
                throw new LockAcquisitionException("현재 수강 신청이 몰려 처리할 수 없습니다. 잠시 후 다시 시도해주세요.");
            }

            // 트랜잭션 내에서 등록 로직 실행
            return transactionTemplate.execute(status -> {
                // 가용성 재검증 (락 획득 후 다시 확인)
                String verifiedTeacherId = findAvailableTeacher(
                        List.of(selectedTeacherId),
                        classDates,
                        request.durationMinutes()
                );

                if (verifiedTeacherId == null) {
                    throw new IllegalStateException("No available teacher found after availability check");
                }

                User teacher = userRepository.findById(verifiedTeacherId).orElseThrow(
                        () -> new EntityNotFoundException("Teacher not found with id: " + verifiedTeacherId)
                );

                // 스케줄 대량 생성 및 저장
                List<Schedule> schedules = new ArrayList<>();
                for (LocalDateTime classDateTime : classDates) {
                    OffsetDateTime startsAt = classDateTime.atOffset(ZoneOffset.UTC);
                    OffsetDateTime endsAt = classDateTime.plusMinutes(request.durationMinutes()).atOffset(ZoneOffset.UTC);

                    Schedule schedule = Schedule.create(
                            teacher,
                            course,
                            startsAt,
                            endsAt,
                            ScheduleStatus.SCHEDULED
                    );
                    schedules.add(schedule);
                }

                List<Schedule> savedSchedules = scheduleRepository.saveAll(schedules);

                // 첫 번째 스케줄에 대한 Registration 생성
                Schedule firstSchedule = savedSchedules.get(0);
                Registration registration = Registration.create(
                        firstSchedule,
                        student,
                        RegistrationStatus.REGISTERED
                );

                return registrationRepository.save(registration);
            });

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new LockAcquisitionException("수강 신청 처리 중 오류가 발생했습니다.", e);
        } finally {
            // 락 해제
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    /**
     * 수업 날짜 목록 생성
     */
    private List<LocalDateTime> generateClassDates(
            List<DayOfWeek> days,
            LocalTime startTime,
            int durationMinutes,
            int months
    ) {
        List<LocalDateTime> classDates = new ArrayList<>();
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(months);

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            DayOfWeek dayOfWeek = currentDate.getDayOfWeek();
            if (days.contains(dayOfWeek)) {
                LocalDateTime classDateTime = currentDate.atTime(startTime);
                classDates.add(classDateTime);
            }
            currentDate = currentDate.plusDays(1);
        }

        return classDates;
    }

    /**
     * 가용성 검증 후 사용 가능한 강사 찾기
     */
    private String findAvailableTeacher(
            List<String> candidateTeacherIds,
            List<LocalDateTime> classDates,
            int durationMinutes
    ) {
        for (String teacherId : candidateTeacherIds) {
            // 해당 강사의 기간 내 전체 스케줄 조회
            LocalDateTime firstDate = classDates.get(0);
            LocalDateTime lastDate = classDates.get(classDates.size() - 1).plusMinutes(durationMinutes);

            List<Schedule> existingSchedules = scheduleRepository.findAll((root, query, cb) -> {
                return cb.and(
                        cb.equal(root.get("user").get("id"), teacherId),
                        cb.equal(root.get("status"), ScheduleStatus.SCHEDULED),
                        cb.greaterThanOrEqualTo(root.get("startsAt"), firstDate.atOffset(ZoneOffset.UTC)),
                        cb.lessThanOrEqualTo(root.get("endsAt"), lastDate.atOffset(ZoneOffset.UTC))
                );
            });

            // 해당 강사의 기간 내 전체 휴무 조회
            List<TeacherTimeOff> timeOffs = teacherTimeOffRepository
                    .findByTeacher_IdAndStartDateTimeLessThanEqualAndEndDateTimeGreaterThanEqual(
                            teacherId,
                            lastDate,
                            firstDate
                    );

            // 충돌 검사
            boolean hasConflict = false;
            for (LocalDateTime classDateTime : classDates) {
                OffsetDateTime classStart = classDateTime.atOffset(ZoneOffset.UTC);
                OffsetDateTime classEnd = classDateTime.plusMinutes(durationMinutes).atOffset(ZoneOffset.UTC);

                // Schedule 충돌 확인
                for (Schedule schedule : existingSchedules) {
                    if (isOverlapping(classStart, classEnd, schedule.getStartsAt(), schedule.getEndsAt())) {
                        hasConflict = true;
                        break;
                    }
                }

                if (hasConflict) break;

                // TimeOff 충돌 확인
                for (TeacherTimeOff timeOff : timeOffs) {
                    OffsetDateTime timeOffStart = timeOff.getStartDateTime().atOffset(ZoneOffset.UTC);
                    OffsetDateTime timeOffEnd = timeOff.getEndDateTime().atOffset(ZoneOffset.UTC);
                    if (isOverlapping(classStart, classEnd, timeOffStart, timeOffEnd)) {
                        hasConflict = true;
                        break;
                    }
                }

                if (hasConflict) break;
            }

            if (!hasConflict) {
                return teacherId;
            }
        }

        return null;
    }

    /**
     * 두 시간 범위가 겹치는지 확인
     */
    private boolean isOverlapping(
            OffsetDateTime start1,
            OffsetDateTime end1,
            OffsetDateTime start2,
            OffsetDateTime end2
    ) {
        return start1.isBefore(end2) && start2.isBefore(end1);
    }
}
