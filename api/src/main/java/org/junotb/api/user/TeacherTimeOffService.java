package org.junotb.api.user;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.schedule.ScheduleStatus;
import org.junotb.api.teacher.dto.TeacherTimeOffRequest;
import org.junotb.api.teacher.dto.TeacherTimeOffResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TeacherTimeOffService {

    private final TeacherTimeOffRepository teacherTimeOffRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    /**
     * 강사 휴무를 등록합니다.
     * - 기존 휴무와 기간이 겹치면 예외
     * - 해당 기간에 예약된 수업이 있으면 예외
     */
    @Transactional
    public TeacherTimeOffResponse create(String teacherId, TeacherTimeOffRequest request) {
        ZoneId systemZone = ZoneId.systemDefault();
        OffsetDateTime startDateTime = request.startDateTime().atZone(systemZone).toOffsetDateTime();
        OffsetDateTime endDateTime = request.endDateTime().atZone(systemZone).toOffsetDateTime();

        if (startDateTime.isAfter(endDateTime) || startDateTime.isEqual(endDateTime)) {
            throw new IllegalArgumentException("시작 일시는 종료 일시보다 빨라야 합니다.");
        }

        // 유효성 검증 1: 기존 휴무와 겹치는지 확인
        List<TeacherTimeOff> overlapping = teacherTimeOffRepository.findOverlappingByTeacherAndRange(
                teacherId, startDateTime, endDateTime);
        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("해당 기간에 이미 등록된 휴무가 있습니다.");
        }

        // 유효성 검증 2: 해당 기간에 예약된 수업이 있는지 확인
        if (scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacherId, startDateTime, endDateTime, ScheduleStatus.SCHEDULED)) {
            throw new IllegalStateException("해당 기간에 예약된 수업이 있어 휴무를 설정할 수 없습니다.");
        }

        User teacher = userRepository.getReferenceById(teacherId);
        TeacherTimeOff timeOff = TeacherTimeOff.create(
                teacher, startDateTime, endDateTime, request.type(), request.reason());
        TeacherTimeOff saved = teacherTimeOffRepository.save(timeOff);
        return TeacherTimeOffResponse.from(saved);
    }

    /**
     * 강사 휴무를 삭제합니다. 본인의 휴무만 삭제 가능합니다.
     */
    @Transactional
    public void delete(Long id, String teacherId) {
        TeacherTimeOff timeOff = teacherTimeOffRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("휴무 일정을 찾을 수 없습니다: " + id));

        if (!timeOff.getTeacher().getId().equals(teacherId)) {
            throw new IllegalArgumentException("본인의 휴무 일정만 삭제할 수 있습니다.");
        }

        teacherTimeOffRepository.delete(timeOff);
    }

    /**
     * 강사의 휴무 목록을 최신순으로 조회합니다.
     */
    public List<TeacherTimeOffResponse> getList(String teacherId) {
        return teacherTimeOffRepository.findByTeacher_IdOrderByStartDateTimeDesc(teacherId)
                .stream()
                .map(TeacherTimeOffResponse::from)
                .toList();
    }
}
