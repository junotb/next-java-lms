package org.junotb.api.lesson;

import lombok.RequiredArgsConstructor;
import org.junotb.api.common.exception.ResourceNotFoundException;
import org.junotb.api.course.web.CourseResponse;
import org.junotb.api.lesson.dto.LessonAccessResponse;
import org.junotb.api.registration.RegistrationRepository;
import org.junotb.api.registration.RegistrationStatus;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.schedule.ScheduleStatus;
import org.junotb.api.schedule.web.ScheduleResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class LessonService {

    private static final String ROLE_TEACHER = "TEACHER";
    private static final String ROLE_STUDENT = "STUDENT";

    private final ScheduleRepository scheduleRepository;
    private final RegistrationRepository registrationRepository;

    /**
     * 수업방 입장 권한 검증.
     * - 강사: 상태가 SCHEDULED이면 시간 무관 입장 가능.
     * - 학생: 상태가 SCHEDULED이고 현재 시각이 startsAt ~ endsAt 사이일 때만 입장 가능.
     */
    @Transactional(readOnly = true)
    public LessonAccessResponse validateAccess(Long scheduleId, String userId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new ResourceNotFoundException("Schedule", scheduleId.toString()));

        String role = resolveRole(schedule, userId);
        if (role == null) {
            return buildAccessResponse(false, null, schedule);
        }

        if (!schedule.getStatus().equals(ScheduleStatus.SCHEDULED)) {
            return buildAccessResponse(false, role, schedule);
        }

        OffsetDateTime now = OffsetDateTime.now();

        if (ROLE_TEACHER.equals(role)) {
            return buildAccessResponse(true, role, schedule);
        }

        if (ROLE_STUDENT.equals(role)) {
            boolean inTime = !now.isBefore(schedule.getStartsAt()) && !now.isAfter(schedule.getEndsAt());
            return buildAccessResponse(inTime, role, schedule);
        }

        return buildAccessResponse(false, role, schedule);
    }

    /**
     * 수업 종료(출석 처리). 강사만 호출 가능.
     */
    @Transactional
    public void finishLesson(Long scheduleId, String teacherId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new ResourceNotFoundException("Schedule", scheduleId.toString()));

        if (!schedule.getUser().getId().equals(teacherId)) {
            throw new IllegalStateException("수업 종료는 해당 수업의 강사만 가능합니다.");
        }

        schedule.setStatus(ScheduleStatus.ATTENDED);
    }

    private String resolveRole(Schedule schedule, String userId) {
        if (schedule.getUser().getId().equals(userId)) {
            return ROLE_TEACHER;
        }
        boolean isStudent = registrationRepository
            .findByScheduleIdAndStudentId(schedule.getId(), userId)
            .filter(r -> r.getStatus() == RegistrationStatus.REGISTERED)
            .isPresent();
        return isStudent ? ROLE_STUDENT : null;
    }

    private LessonAccessResponse buildAccessResponse(boolean allowed, String role, Schedule schedule) {
        ScheduleResponse scheduleResponse = ScheduleResponse.from(schedule);
        CourseResponse courseResponse = schedule.getCourse() != null
            ? CourseResponse.from(schedule.getCourse())
            : null;
        return new LessonAccessResponse(allowed, role != null ? role : "", scheduleResponse, courseResponse);
    }
}
