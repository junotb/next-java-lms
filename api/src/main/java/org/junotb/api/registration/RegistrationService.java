package org.junotb.api.registration;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.exception.DuplicateResourceException;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

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
}
