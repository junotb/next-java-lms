package org.junotb.api.schedule;

import jakarta.persistence.LockModeType;
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
     * 특정 강사에게 특정 기간에 잡힌 수업이 있는지 확인
     */
    @Query("""
        SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
        FROM Schedule s
        WHERE s.user.id = :userId
          AND s.startsAt >= :start
          AND s.startsAt <= :end
          AND s.status = :status
        """)
    boolean existsByUserIdAndStartsAtBetweenAndStatus(
            @Param("userId") String userId,
            @Param("start") OffsetDateTime start,
            @Param("end") OffsetDateTime end,
            @Param("status") ScheduleStatus status
    );
}
