package org.junotb.api.registration;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long>, JpaSpecificationExecutor<Registration> {
    
    // 특정 스케줄에 특정 학생이 이미 등록했는지 확인
    boolean existsByScheduleIdAndStudentIdAndStatus(Long scheduleId, String studentId, RegistrationStatus status);

    // 특정 스케줄에 특정 학생의 등록 정보 조회
    Optional<Registration> findByScheduleIdAndStudentId(Long scheduleId, String studentId);

    // 특정 스케줄의 등록 수 조회 (취소되지 않은 것만) - 비관적 락
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select count(r)
        from Registration r
        where r.schedule.id = :scheduleId
        and r.status = 'REGISTERED'
    """)
    long countByScheduleIdAndStatusRegisteredWithLock(@Param("scheduleId") Long scheduleId);

    // 특정 스케줄의 등록 수 조회 (취소되지 않은 것만)
    @Query("""
        select count(r)
        from Registration r
        where r.schedule.id = :scheduleId
        and r.status = 'REGISTERED'
    """)
    long countByScheduleIdAndStatusRegistered(@Param("scheduleId") Long scheduleId);

    // 특정 학생의 모든 등록 조회
    List<Registration> findByStudentIdOrderByRegisteredAtDesc(String studentId);

    // 특정 스케줄의 모든 등록 조회
    List<Registration> findByScheduleIdOrderByRegisteredAtDesc(Long scheduleId);

    // 상태별 등록 수 집계
    @Query("""
        select r.status as status, count(r) as count
        from Registration r
        group by r.status
    """)
    List<StatusCountRow> countByStatus();
}
