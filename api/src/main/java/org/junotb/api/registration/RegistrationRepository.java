package org.junotb.api.registration;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
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

    /**
     * 학생용: 다음 수업 1건 (REGISTERED, 스케줄 SCHEDULED, 종료되지 않은 수업, 가장 빠른 것)
     * - s.endsAt > :now: 진행 중이거나 아직 시작하지 않은 수업 포함
     * - LEFT JOIN FETCH: 연관 데이터 참조 무결성 문제로 인한 누락 방지
     */
    @Query("""
        SELECT r FROM Registration r
        LEFT JOIN FETCH r.schedule s
        LEFT JOIN FETCH s.user
        LEFT JOIN FETCH s.course
        WHERE r.student.id = :studentId AND r.status = 'REGISTERED'
        AND s.status = 'SCHEDULED' AND s.endsAt > :now
        ORDER BY s.startsAt ASC
        """)
    List<Registration> findNextRegistrationsForStudent(
            @Param("studentId") String studentId,
            @Param("now") OffsetDateTime now,
            Pageable pageable
    );

    /**
     * 학생용: 수강 중인 코스 수 (REGISTERED인 등록의 서로 다른 course 개수)
     */
    @Query("""
        SELECT COUNT(DISTINCT s.course.id) FROM Registration r
        JOIN r.schedule s
        WHERE r.student.id = :studentId AND r.status = 'REGISTERED'
        """)
    long countActiveCoursesByStudentId(@Param("studentId") String studentId);

    /**
     * 학생용: 수업 완료(출석) 횟수
     */
    @Query("""
        SELECT COUNT(r) FROM Registration r
        JOIN r.schedule s
        WHERE r.student.id = :studentId AND r.status = 'REGISTERED' AND s.status = 'ATTENDED'
        """)
    long countCompletedClassesByStudentId(@Param("studentId") String studentId);

    /**
     * 학생용: 최근 종료된 수업 3건 (ATTENDED 또는 ABSENT, endsAt 기준 내림차순)
     * - LEFT JOIN FETCH: 연관 데이터 참조 무결성 문제 방지
     */
    @Query("""
        SELECT r FROM Registration r
        LEFT JOIN FETCH r.schedule s
        LEFT JOIN FETCH s.user
        LEFT JOIN FETCH s.course
        WHERE r.student.id = :studentId AND r.status = 'REGISTERED'
        AND (s.status = 'ATTENDED' OR s.status = 'ABSENT')
        ORDER BY s.endsAt DESC
        """)
    List<Registration> findRecentCompletedRegistrationsByStudentId(
            @Param("studentId") String studentId,
            Pageable pageable
    );
}
