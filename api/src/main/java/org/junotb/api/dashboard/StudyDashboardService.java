package org.junotb.api.dashboard;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junotb.api.dashboard.dto.DashboardNextClassResponse;
import org.junotb.api.dashboard.dto.ScheduleSummaryResponse;
import org.junotb.api.dashboard.dto.StudyDashboardResponse;
import org.junotb.api.registration.Registration;
import org.junotb.api.registration.RegistrationRepository;
import org.junotb.api.schedule.Schedule;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyDashboardService {

    private final RegistrationRepository registrationRepository;

    @Transactional(readOnly = true)
    public StudyDashboardResponse getDashboard(String studentId) {
        if (studentId == null || studentId.isBlank()) {
            return new StudyDashboardResponse(
                null,
                new StudyDashboardResponse.StudyDashboardStats(0L, 0L),
                Collections.emptyList()
            );
        }

        try {
            OffsetDateTime now = OffsetDateTime.now();

            DashboardNextClassResponse nextClass = findNextClass(studentId, now);
            long activeCourseCount = 0L;
            long completedClassCount = 0L;
            try {
                activeCourseCount = registrationRepository.countActiveCoursesByStudentId(studentId);
                completedClassCount = registrationRepository.countCompletedClassesByStudentId(studentId);
            } catch (Exception e) {
                log.warn("Error fetching stats for studentId={}", studentId, e);
            }

            StudyDashboardResponse.StudyDashboardStats stats = new StudyDashboardResponse.StudyDashboardStats(
                activeCourseCount,
                completedClassCount
            );
            List<ScheduleSummaryResponse> recentSchedules = findRecentSchedules(studentId);

            return new StudyDashboardResponse(nextClass, stats, recentSchedules);
        } catch (Exception e) {
            log.error("Error in getDashboard for studentId={}", studentId, e);
            return new StudyDashboardResponse(
                null,
                new StudyDashboardResponse.StudyDashboardStats(0L, 0L),
                Collections.emptyList()
            );
        }
    }

    private DashboardNextClassResponse findNextClass(String studentId, OffsetDateTime now) {
        if (studentId == null || studentId.isBlank() || now == null) {
            log.warn("findNextClass: Invalid parameters - studentId={}, now={}", studentId, now);
            return null;
        }

        try {
            log.info("findNextClass: Searching next class for studentId={}, now={}", studentId, now);
            List<Registration> list = registrationRepository.findNextRegistrationsForStudent(
                studentId, now, PageRequest.of(0, 1)
            );
            log.info("findNextClass: Query result size={} for studentId={}", list != null ? list.size() : 0, studentId);
            if (list == null || list.isEmpty()) {
                log.info("findNextClass: No next class found for studentId={}", studentId);
                return null;
            }

            Registration r = list.get(0);
            if (r == null) return null;

            Schedule s = r.getSchedule();
            if (s == null || s.getId() == null) return null;

            OffsetDateTime startsAt = s.getStartsAt() != null ? s.getStartsAt() : now;
            OffsetDateTime endsAt = s.getEndsAt() != null ? s.getEndsAt() : now;

            return new DashboardNextClassResponse(
                s.getId(),
                s.getCourse() != null ? s.getCourse().getTitle() : "",
                startsAt,
                endsAt,
                s.getUser() != null ? s.getUser().getName() : null,
                null,
                s.getMeetLink()
            );
        } catch (Exception e) {
            log.error("Error in findNextClass for studentId={}, now={}", studentId, now, e);
            return null;
        }
    }

    private List<ScheduleSummaryResponse> findRecentSchedules(String studentId) {
        if (studentId == null || studentId.isBlank()) {
            return Collections.emptyList();
        }

        try {
            List<Registration> list = registrationRepository.findRecentCompletedRegistrationsByStudentId(
                studentId, PageRequest.of(0, 3)
            );
            if (list == null) {
                return Collections.emptyList();
            }
            return list.stream()
                .filter(r -> r != null)
                .map(Registration::getSchedule)
                .filter(schedule -> schedule != null)
                .map(ScheduleSummaryResponse::from)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error in findRecentSchedules for studentId={}", studentId, e);
            return Collections.emptyList();
        }
    }
}
