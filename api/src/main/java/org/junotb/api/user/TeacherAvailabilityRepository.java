package org.junotb.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

public interface TeacherAvailabilityRepository extends JpaRepository<TeacherAvailability, Long> {
    List<TeacherAvailability> findByTeacher_Id(String teacherId);

    List<TeacherAvailability> findByTeacher_IdAndDayOfWeek(String teacherId, DayOfWeek dayOfWeek);

    /**
     * 강사 ID로 가용성 목록을 조회 (요일 순서로 정렬)
     */
    List<TeacherAvailability> findByTeacher_IdOrderByDayOfWeek(String teacherId);

    /**
     * 강사로 가용성 목록 삭제
     */
    void deleteByTeacher(org.junotb.api.user.User teacher);

    /**
     * 지정된 요일들과 시간 범위를 모두 커버하는 강사 ID 목록을 조회합니다.
     * 모든 요일에 대해 해당 시간 범위(startTime ~ endTime)를 커버하는 강사만 반환됩니다.
     *
     * 조건:
     * - 강사의 status는 ACTIVE, role은 TEACHER
     * - 휴무(TeacherTimeOff): 구간과 겹치는 휴무가 있는 강사 제외 (NOT EXISTS)
     * - 기존 스케줄(Schedule): 동일 요일 + 시간대가 겹치는 수업이 있는 강사 제외 (NOT EXISTS)
     *
     * @param days 요청 요일 목록 (DayOfWeek enum)
     * @param startTime 요청 시작 시간 (LocalTime)
     * @param endTime 요청 종료 시간 (LocalTime)
     * @param dayCount 요청 요일 개수 (HAVING 조건용)
     * @param scheduleStartDateTime 전체 기간 시작 (OffsetDateTime)
     * @param scheduleEndDateTime 전체 기간 종료 (OffsetDateTime)
     * @param dayStrings 요청 요일 문자열 Set ("MONDAY", "TUESDAY", ... 대문자)
     */
    @Query(value = """
        SELECT ta."userId"
        FROM "teacherAvailability" ta
        INNER JOIN "user" u ON u."id" = ta."userId"
        WHERE ta."dayOfWeek" IN (:days)
          AND ta."startTime" <= :startTime
          AND ta."endTime" >= :endTime
          AND u."status" = 'ACTIVE'
          AND u."role" = 'TEACHER'
          AND NOT EXISTS (
              SELECT 1
              FROM "teacherTimeOff" toff
              WHERE toff."teacherId" = ta."userId"
                AND toff."startDateTime" < :scheduleEndDateTime
                AND toff."endDateTime" > :scheduleStartDateTime
          )
          AND NOT EXISTS (
              SELECT 1
              FROM "schedule" s
              WHERE s."userId" = ta."userId"
                AND s."status" <> 'CANCELLED'
                AND s."startsAt" >= :scheduleStartDateTime
                AND s."endsAt" <= :scheduleEndDateTime
                AND s."startsAt"::time < :endTime
                AND s."endsAt"::time > :startTime
                AND UPPER(to_char(s."startsAt", 'FMDay')) IN (:dayStrings)
          )
        GROUP BY ta."userId"
        HAVING COUNT(DISTINCT ta."dayOfWeek") = :dayCount
        """, nativeQuery = true)
    List<String> findCandidates(
            @Param("days") List<String> days,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("dayCount") long dayCount,
            @Param("scheduleStartDateTime") OffsetDateTime scheduleStartDateTime,
            @Param("scheduleEndDateTime") OffsetDateTime scheduleEndDateTime,
            @Param("dayStrings") Set<String> dayStrings
    );
}
