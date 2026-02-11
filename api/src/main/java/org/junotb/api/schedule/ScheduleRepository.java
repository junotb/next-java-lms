package org.junotb.api.schedule;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long>, JpaSpecificationExecutor<Schedule> {
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Schedule s where s.id = :id")
    Optional<Schedule> findByIdWithLock(@Param("id") Long id);

    @Query("""
        select s from Schedule s
        left join fetch s.user
        left join fetch s.course
        where s.id = :id
        """)
    Optional<Schedule> findByIdWithCourseAndUser(@Param("id") Long id);
    
    @Query("""
        select s.status as status, count(s) as count
        from Schedule s
        where (:userId is null or s.user.id = :userId)
        and s.user.status = 'ACTIVE'
        group by s.status
    """)
    List<StatusCountRow> countByStatus(@Param("userId") String userId);

    /**
     * 특정 강사에게 미래에 잡힌 수업이 하나라도 있는지 확인
     */
    @Query("""
        SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
        FROM Schedule s
        WHERE s.user.id = :userId
          AND s.startsAt > :now
          AND s.status = :status
        """)
    boolean existsByUserIdAndStartsAtAfterAndStatus(
            @Param("userId") String userId,
            @Param("now") OffsetDateTime now,
            @Param("status") ScheduleStatus status
    );

    /**
     * 특정 강사에게 특정 기간과 겹치는(Overlap) 수업이 있는지 확인
     * Overlap 조건: s.startsAt < :end AND s.endsAt > :start
     */
    @Query("""
        SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
        FROM Schedule s
        WHERE s.user.id = :userId
          AND s.startsAt < :end
          AND s.endsAt > :start
          AND s.status = :status
        """)
    boolean existsByUserIdAndScheduleOverlap(
            @Param("userId") String userId,
            @Param("start") OffsetDateTime start,
            @Param("end") OffsetDateTime end,
            @Param("status") ScheduleStatus status
    );

    /**
     * 강사용: 다음 수업 1건 (SCHEDULED, 종료되지 않은 수업, 가장 빠른 것)
     * - endsAt > now: 진행 중이거나 아직 시작하지 않은 수업 포함
     * - LEFT JOIN FETCH: 연관 데이터(User, Course) 참조 무결성 문제로 인한 누락 방지
     * - DISTINCT 사용: LEFT JOIN FETCH로 인한 중복 방지
     */
    @Query(value = """
        SELECT DISTINCT s FROM Schedule s
        LEFT JOIN FETCH s.user
        LEFT JOIN FETCH s.course
        WHERE s.user.id = :teacherId AND s.status = :status AND s.endsAt > :now
        ORDER BY s.startsAt ASC
        """)
    List<Schedule> findNextSchedulesForTeacher(
            @Param("teacherId") String teacherId,
            @Param("status") ScheduleStatus status,
            @Param("now") OffsetDateTime now,
            Pageable pageable
    );

    /**
     * 강사용: 오늘 예정된 수업 (startsAt이 dayStart 이상 dayEnd 미만)
     * - LEFT JOIN FETCH: 연관 데이터 참조 무결성 문제 방지
     */
    @Query("""
        SELECT s FROM Schedule s
        LEFT JOIN FETCH s.user
        LEFT JOIN FETCH s.course
        WHERE s.user.id = :teacherId AND s.status = 'SCHEDULED'
        AND s.startsAt >= :dayStart AND s.startsAt < :dayEnd
        ORDER BY s.startsAt ASC
        """)
    List<Schedule> findTodaySchedulesForTeacher(
            @Param("teacherId") String teacherId,
            @Param("dayStart") OffsetDateTime dayStart,
            @Param("dayEnd") OffsetDateTime dayEnd
    );

    /**
     * 강사용: 예정된 수업 수 (SCHEDULED, endsAt > now)
     * - endsAt > now: 진행 중이거나 아직 시작하지 않은 수업 포함
     * - findNextSchedulesForTeacher와 동일한 조건 사용
     */
    @Query("""
        SELECT COUNT(s) FROM Schedule s
        WHERE s.user.id = :teacherId AND s.status = 'SCHEDULED' AND s.endsAt > :now
        """)
    long countUpcomingByTeacherId(@Param("teacherId") String teacherId, @Param("now") OffsetDateTime now);

    /**
     * 강사용: 최근 완료 수업 (ATTENDED 또는 ABSENT, endsAt 기준 내림차순)
     */
    @Query("""
        SELECT s FROM Schedule s
        LEFT JOIN FETCH s.user
        LEFT JOIN FETCH s.course
        WHERE s.user.id = :teacherId AND (s.status = 'ATTENDED' OR s.status = 'ABSENT')
        ORDER BY s.endsAt DESC
        """)
    List<Schedule> findRecentCompletedSchedulesForTeacher(
        @Param("teacherId") String teacherId,
        Pageable pageable
    );
}
