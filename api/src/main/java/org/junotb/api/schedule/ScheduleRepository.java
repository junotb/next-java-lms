package org.junotb.api.schedule;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
}
