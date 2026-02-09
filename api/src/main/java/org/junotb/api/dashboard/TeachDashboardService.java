package org.junotb.api.dashboard;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junotb.api.dashboard.dto.DashboardNextClassResponse;
import org.junotb.api.dashboard.dto.ScheduleSummaryResponse;
import org.junotb.api.dashboard.dto.TeachDashboardResponse;
import org.junotb.api.registration.RegistrationRepository;
import org.junotb.api.registration.RegistrationStatus;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.schedule.ScheduleStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TeachDashboardService {

    private final ScheduleRepository scheduleRepository;
    private final RegistrationRepository registrationRepository;

    @Transactional(readOnly = true)
    public TeachDashboardResponse getDashboard(String teacherId) {
        log.info("=== TeachDashboardService.getDashboard START: teacherId={} ===", teacherId);
        
        if (teacherId == null || teacherId.isBlank()) {
            log.warn("getDashboard: teacherId is null or blank");
            return new TeachDashboardResponse(
                null,
                new TeachDashboardResponse.TeachDashboardStats(0L, 0L),
                Collections.emptyList(),
                Collections.emptyList()
            );
        }

        try {
            OffsetDateTime now = OffsetDateTime.now();
            ZoneId zone = ZoneId.systemDefault();
            LocalDate today = LocalDate.now(zone);
            OffsetDateTime dayStart = today.atStartOfDay(zone).toOffsetDateTime();
            OffsetDateTime dayEnd = today.plusDays(1).atStartOfDay(zone).toOffsetDateTime();

            log.info("getDashboard: now={}, dayStart={}, dayEnd={}", now, dayStart, dayEnd);

            // upcomingClassCount를 먼저 조회해서 디버깅
            long upcomingClassCount = scheduleRepository.countUpcomingByTeacherId(teacherId, now);
            log.info("getDashboard: upcomingClassCount={} for teacherId={}, now={}", upcomingClassCount, teacherId, now);
            
            DashboardNextClassResponse nextClass = findNextClass(teacherId, now);
            
            // todayScheduleList 조회 (Course 조회 실패 시에도 계속 진행)
            List<Schedule> todayScheduleList = null;
            try {
                todayScheduleList = scheduleRepository.findTodaySchedulesForTeacher(teacherId, dayStart, dayEnd);
            } catch (Exception e) {
                log.warn("Error fetching today schedules for teacherId={}, continuing without today schedules", teacherId, e);
                todayScheduleList = Collections.emptyList();
            }
            long todayClassCount = todayScheduleList != null ? todayScheduleList.size() : 0L;
            List<ScheduleSummaryResponse> todaySchedules = (todayScheduleList != null ? todayScheduleList : Collections.<Schedule>emptyList())
                .stream()
                .filter(schedule -> schedule != null)
                .map(schedule -> {
                    ScheduleSummaryResponse base = ScheduleSummaryResponse.from(schedule);
                    // 학생 이름 조회
                    String studentName = null;
                    try {
                        List<org.junotb.api.registration.Registration> registrations =
                            registrationRepository.findByScheduleIdOrderByRegisteredAtDesc(schedule.getId());
                        if (registrations != null) {
                            studentName = registrations.stream()
                                .filter(r -> r != null && r.getStatus() == RegistrationStatus.REGISTERED)
                                .filter(r -> r.getStudent() != null)
                                .findFirst()
                                .map(r -> r.getStudent().getName())
                                .orElse(null);
                        }
                    } catch (Exception e) {
                        log.debug("Error fetching student name for scheduleId={}", schedule.getId(), e);
                    }
                    return new ScheduleSummaryResponse(
                        base.id(),
                        base.userId(),
                        base.courseId(),
                        base.courseTitle(),
                        base.startsAt(),
                        base.endsAt(),
                        base.status(),
                        base.createdAt(),
                        base.updatedAt(),
                        base.instructorName(),
                        studentName
                    );
                })
                .collect(Collectors.toList());

            List<ScheduleSummaryResponse> recentCompletedSchedules = findRecentCompletedSchedules(teacherId);

            TeachDashboardResponse.TeachDashboardStats stats =
                new TeachDashboardResponse.TeachDashboardStats(todayClassCount, upcomingClassCount);

            log.info("getDashboard: FINISH - nextClass={}, stats={}, todaySchedules.size={}, recentCompleted.size={}",
                nextClass != null ? "exists" : "null", stats, todaySchedules.size(), recentCompletedSchedules.size());

            return new TeachDashboardResponse(nextClass, stats, todaySchedules, recentCompletedSchedules);
        } catch (Exception e) {
            log.error("Error in getDashboard for teacherId={}", teacherId, e);
            return new TeachDashboardResponse(
                null,
                new TeachDashboardResponse.TeachDashboardStats(0L, 0L),
                Collections.emptyList(),
                Collections.emptyList()
            );
        }
    }

    private List<ScheduleSummaryResponse> findRecentCompletedSchedules(String teacherId) {
        try {
            List<Schedule> list = scheduleRepository.findRecentCompletedSchedulesForTeacher(
                teacherId, PageRequest.of(0, 10)
            );
            if (list == null) return Collections.emptyList();
            return list.stream()
                .filter(s -> s != null)
                .map(schedule -> {
                    ScheduleSummaryResponse base = ScheduleSummaryResponse.from(schedule);
                    String studentName = null;
                    try {
                        var registrations = registrationRepository.findByScheduleIdOrderByRegisteredAtDesc(schedule.getId());
                        if (registrations != null) {
                            studentName = registrations.stream()
                                .filter(r -> r != null && r.getStatus() == RegistrationStatus.REGISTERED)
                                .filter(r -> r.getStudent() != null)
                                .findFirst()
                                .map(r -> r.getStudent().getName())
                                .orElse(null);
                        }
                    } catch (Exception e) {
                        log.debug("Error fetching student name for scheduleId={}", schedule.getId(), e);
                    }
                    return new ScheduleSummaryResponse(
                        base.id(), base.userId(), base.courseId(), base.courseTitle(),
                        base.startsAt(), base.endsAt(), base.status(),
                        base.createdAt(), base.updatedAt(), base.instructorName(), studentName
                    );
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.warn("Error fetching recent completed schedules for teacherId={}", teacherId, e);
            return Collections.emptyList();
        }
    }

    private DashboardNextClassResponse findNextClass(String teacherId, OffsetDateTime now) {
        log.info("=== findNextClass START: teacherId={}, now={} ===", teacherId, now);
        
        if (teacherId == null || teacherId.isBlank() || now == null) {
            log.warn("findNextClass: Invalid parameters - teacherId={}, now={}", teacherId, now);
            return null;
        }

        try {
            log.info("findNextClass: Searching next class for teacherId={}, now={}, status=SCHEDULED", teacherId, now);
            
            // 먼저 count로 확인
            long count = scheduleRepository.countUpcomingByTeacherId(teacherId, now);
            log.info("findNextClass: countUpcomingByTeacherId={} for teacherId={}", count, teacherId);
            
            if (count == 0) {
                log.warn("findNextClass: countUpcomingByTeacherId is 0, returning null");
                return null;
            }
            
            List<Schedule> list = scheduleRepository.findNextSchedulesForTeacher(
                teacherId, ScheduleStatus.SCHEDULED, now, PageRequest.of(0, 1)
            );
            log.info("findNextClass: Query result size={} for teacherId={}, expected count={}", 
                list != null ? list.size() : 0, teacherId, count);
            
            if (list == null || list.isEmpty()) {
                log.error("findNextClass: CRITICAL - No next class found for teacherId={}, but countUpcomingByTeacherId={}", teacherId, count);
                return null;
            }

            Schedule s = list.get(0);
            if (s == null || s.getId() == null) return null;

            String studentName = null;
            try {
                List<org.junotb.api.registration.Registration> registrations = 
                    registrationRepository.findByScheduleIdOrderByRegisteredAtDesc(s.getId());
                if (registrations != null) {
                    studentName = registrations.stream()
                        .filter(r -> r != null && r.getStatus() == RegistrationStatus.REGISTERED)
                        .filter(r -> r.getStudent() != null)
                        .findFirst()
                        .map(r -> r.getStudent().getName())
                        .orElse(null);
                }
            } catch (Exception e) {
                log.warn("Error fetching student name for scheduleId={}, teacherId={}", s.getId(), teacherId, e);
            }

            DashboardNextClassResponse response = new DashboardNextClassResponse(
                s.getId(),
                s.getCourse() != null ? s.getCourse().getTitle() : "",
                s.getStartsAt() != null ? s.getStartsAt() : now,
                s.getEndsAt() != null ? s.getEndsAt() : now,
                null,
                studentName,
                s.getMeetLink()
            );
            log.info("findNextClass: SUCCESS - scheduleId={}, courseTitle={}, studentName={}", 
                response.scheduleId(), response.courseTitle(), response.studentName());
            return response;
        } catch (Exception e) {
            log.error("findNextClass: ERROR - Exception occurred for teacherId={}, now={}", teacherId, now, e);
            return null;
        }
    }
}
