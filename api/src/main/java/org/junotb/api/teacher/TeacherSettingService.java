package org.junotb.api.teacher;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.schedule.ScheduleStatus;
import org.junotb.api.teacher.dto.TeacherAvailabilityRequest;
import org.junotb.api.teacher.dto.TeacherAvailabilityResponse;
import org.junotb.api.teacher.dto.TeacherSettingsResponse;
import org.junotb.api.teacher.dto.TeacherTimeOffRequest;
import org.junotb.api.teacher.dto.TeacherTimeOffResponse;
import org.junotb.api.user.TeacherAvailability;
import org.junotb.api.user.TeacherAvailabilityRepository;
import org.junotb.api.user.TeacherTimeOff;
import org.junotb.api.user.TeacherTimeOffRepository;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TeacherSettingService {
    private final TeacherAvailabilityRepository availabilityRepository;
    private final TeacherTimeOffRepository timeOffRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    /**
     * 강사의 근무 가능 시간을 일괄 업데이트합니다.
     * 기존 설정을 모두 삭제한 후 새로운 설정으로 교체합니다.
     */
    @Transactional
    public List<TeacherAvailabilityResponse> updateAvailability(
            String teacherId,
            List<TeacherAvailabilityRequest> requests
    ) {
        // 방어 로직: 현재 시점 이후에 잡힌 SCHEDULED 상태의 스케줄이 있는지 확인
        OffsetDateTime now = OffsetDateTime.now();
        if (scheduleRepository.existsByUserIdAndStartsAtAfterAndStatus(teacherId, now, ScheduleStatus.SCHEDULED)) {
            throw new IllegalStateException("예약된 수업이 있어 근무 설정을 변경할 수 없습니다. 먼저 수업을 취소하거나 완료해주세요.");
        }

        // User 프록시 객체 조회 (불필요한 SELECT 쿼리 없이 ID만 가진 프록시)
        User teacher = userRepository.getReferenceById(teacherId);

        // 기존 설정 삭제
        List<TeacherAvailability> existing = availabilityRepository.findByTeacher_Id(teacherId);
        availabilityRepository.deleteAll(existing);

        // 새로운 설정 저장
        List<TeacherAvailability> newAvailabilities = requests.stream()
                .map(request -> TeacherAvailability.create(
                        teacher,
                        request.dayOfWeek(),
                        request.startTime(),
                        request.endTime()
                ))
                .toList();

        List<TeacherAvailability> saved = availabilityRepository.saveAll(newAvailabilities);

        return saved.stream()
                .map(TeacherAvailabilityResponse::from)
                .toList();
    }

    /**
     * 강사의 휴무 일정을 추가합니다.
     */
    @Transactional
    public TeacherTimeOffResponse addTimeOff(String teacherId, TeacherTimeOffRequest request) {
        // 시간 검증: 시작 일시가 종료 일시보다 늦으면 안 됨
        if (request.startDateTime().isAfter(request.endDateTime()) || request.startDateTime().isEqual(request.endDateTime())) {
            throw new IllegalArgumentException("시작 일시는 종료 일시보다 빨라야 합니다");
        }
        
        // 방어 로직: 신청하려는 휴무 기간에 SCHEDULED 상태의 스케줄이 있는지 확인
        OffsetDateTime startDateTime = request.startDateTime().atOffset(ZoneOffset.UTC);
        OffsetDateTime endDateTime = request.endDateTime().atOffset(ZoneOffset.UTC);
        if (scheduleRepository.existsByUserIdAndScheduleOverlap(
                teacherId,
                startDateTime,
                endDateTime,
                ScheduleStatus.SCHEDULED
        )) {
            throw new IllegalStateException("해당 기간에 예약된 수업이 있어 휴무를 설정할 수 없습니다.");
        }

        // User 프록시 객체 조회 (불필요한 SELECT 쿼리 없이 ID만 가진 프록시)
        User teacher = userRepository.getReferenceById(teacherId);

        TeacherTimeOff timeOff = TeacherTimeOff.create(
                teacher,
                startDateTime,
                endDateTime,
                request.type(),
                request.reason()
        );

        TeacherTimeOff saved = timeOffRepository.save(timeOff);
        return TeacherTimeOffResponse.from(saved);
    }

    /**
     * 강사의 휴무 일정을 삭제합니다.
     * 본인 확인을 위해 teacherId를 검증합니다.
     */
    @Transactional
    public void removeTimeOff(String teacherId, Long timeOffId) {
        TeacherTimeOff timeOff = timeOffRepository.findById(timeOffId)
                .orElseThrow(() -> new EntityNotFoundException("휴무 일정을 찾을 수 없습니다: " + timeOffId));

        if (!timeOff.getTeacher().getId().equals(teacherId)) {
            throw new IllegalArgumentException("본인의 휴무 일정만 삭제할 수 있습니다.");
        }

        timeOffRepository.delete(timeOff);
    }

    /**
     * 강사의 현재 설정을 조회합니다.
     * 근무 가능 시간 목록과 휴무 일정 목록을 반환합니다.
     */
    public TeacherSettingsResponse getSettings(String teacherId) {
        List<TeacherAvailabilityResponse> availabilities = availabilityRepository.findByTeacher_Id(teacherId)
                .stream()
                .map(TeacherAvailabilityResponse::from)
                .toList();

        List<TeacherTimeOffResponse> timeOffs = timeOffRepository.findByTeacher_Id(teacherId)
                .stream()
                .map(TeacherTimeOffResponse::from)
                .toList();

        return new TeacherSettingsResponse(availabilities, timeOffs);
    }
}
