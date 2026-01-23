package org.junotb.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

public interface TeacherAvailabilityRepository extends JpaRepository<TeacherAvailability, Long> {
    List<TeacherAvailability> findByTeacher_Id(String teacherId);

    List<TeacherAvailability> findByTeacher_IdAndDayOfWeek(String teacherId, DayOfWeek dayOfWeek);

    /**
     * 지정된 요일들과 시간 범위를 모두 커버하는 강사 ID 목록을 조회합니다.
     * 모든 요일에 대해 해당 시간 범위(startTime ~ endTime)를 커버하는 강사만 반환됩니다.
     */
    @Query("""
        SELECT ta.teacher.id
        FROM TeacherAvailability ta
        WHERE ta.dayOfWeek IN :days
          AND ta.startTime <= :startTime
          AND ta.endTime >= :endTime
        GROUP BY ta.teacher.id
        HAVING COUNT(DISTINCT ta.dayOfWeek) = :dayCount
        """)
    List<String> findCandidates(
            @Param("days") List<DayOfWeek> days,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("dayCount") long dayCount
    );
}
