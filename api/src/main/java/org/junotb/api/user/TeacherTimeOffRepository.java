package org.junotb.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface TeacherTimeOffRepository extends JpaRepository<TeacherTimeOff, Long> {
    List<TeacherTimeOff> findByTeacher_Id(String teacherId);

    /**
     * 강사의 휴무 목록을 최신순(시작일시 내림차순)으로 조회합니다.
     */
    List<TeacherTimeOff> findByTeacher_IdOrderByStartDateTimeDesc(String teacherId);

    /**
     * 강사의 휴무 중, 주어진 기간 [rangeStart, rangeEnd]와 겹치는 것만 조회.
     * 겹침: toff.startDateTime < rangeEnd AND toff.endDateTime > rangeStart
     */
    @Query("""
        SELECT t FROM TeacherTimeOff t
        WHERE t.teacher.id = :teacherId
          AND t.startDateTime < :rangeEnd
          AND t.endDateTime > :rangeStart
        """)
    List<TeacherTimeOff> findOverlappingByTeacherAndRange(
            @Param("teacherId") String teacherId,
            @Param("rangeStart") OffsetDateTime rangeStart,
            @Param("rangeEnd") OffsetDateTime rangeEnd
    );
}
