package org.junotb.api.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long>, JpaSpecificationExecutor<Schedule> {
    @Query("""
        select s.status as status, count(s) as count
        from Schedule s
        where (:userId is null or s.userId = :userId)
        and exists (
            select 1 from User u
            where u.id = s.userId
            and u.status = 'ACTIVE'
        )
        group by s.status
    """)
    List<StatusCountRow> countByStatus(@Param("userId") Long userId);

}
