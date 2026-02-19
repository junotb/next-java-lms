package org.junotb.api.schedule;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.exception.ResourceNotFoundException;
import org.junotb.api.course.Course;
import org.junotb.api.course.CourseRepository;
import org.junotb.api.schedule.web.ScheduleCreateRequest;
import org.junotb.api.schedule.web.ScheduleListRequest;
import org.junotb.api.schedule.web.ScheduleMeetLinkRequest;
import org.junotb.api.schedule.web.ScheduleUpdateRequest;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 수업 스케줄 CRUD 및 통계 서비스.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    /**
     * ID로 스케줄 조회.
     *
     * @param id 스케줄 ID
     * @return 스케줄 (없으면 Optional.empty())
     */
    public Optional<Schedule> findById(Long id) {
        return scheduleRepository.findById(id);
    }

    /**
     * 스케줄 목록 조회. Specification으로 동적 필터 적용.
     *
     * @param request  필터 (userId, courseId, status)
     * @param pageable 페이징
     * @return 페이징된 목록
     */
    public Page<Schedule> findList(ScheduleListRequest request, Pageable pageable) {
        Specification<Schedule> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.userId() != null) {
                predicates.add(
                    cb.equal(root.get("user").get("id"), request.userId())
                );
            }

            if (request.courseId() != null) {
                predicates.add(
                    cb.equal(root.get("course").get("id"), request.courseId())
                );
            }

            if (request.status() != null) {
                predicates.add(
                    cb.equal(root.get("status"), request.status())
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return scheduleRepository.findAll(spec, pageable);
    }

    /**
     * 스케줄 생성. 강사·코스 존재 검증 후 저장.
     *
     * @param userId  강사(사용자) ID
     * @param request 생성 요청
     * @return 저장된 스케줄
     * @throws ResourceNotFoundException 강사 또는 코스 미존재 시
     */
    @Transactional
    public Schedule create(String userId, ScheduleCreateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() ->
            new ResourceNotFoundException("User", userId)
        );

        Course course = courseRepository.findById(request.courseId()).orElseThrow(() ->
            new ResourceNotFoundException("Course", request.courseId().toString())
        );

        Schedule schedule = Schedule.create(
            user,
            course,
            request.startsAt(),
            request.endsAt(),
            request.status()
        );

        return scheduleRepository.save(schedule);
    }

    /**
     * 스케줄 수정. null이 아닌 필드만 업데이트.
     *
     * @param id      스케줄 ID
     * @param request 수정 요청
     * @return 수정된 스케줄
     * @throws ResourceNotFoundException 스케줄 미존재 시
     */
    @Transactional
    public Schedule update(Long id, ScheduleUpdateRequest request) {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() ->
            new ResourceNotFoundException("Schedule", id.toString())
        );

        if (request.startsAt() != null) schedule.setStartsAt(request.startsAt());
        if (request.endsAt() != null) schedule.setEndsAt(request.endsAt());
        if (request.status() != null) schedule.setStatus(request.status());

        return schedule;
    }

    /**
     * 강사 전용. 해당 스케줄의 Meet 링크를 등록/수정.
     *
     * @param scheduleId 스케줄 ID
     * @param teacherId  강사 사용자 ID (본인 확인용)
     * @param request    meet 링크 요청
     * @return 수정된 스케줄
     * @throws ResourceNotFoundException 스케줄 미존재
     * @throws IllegalStateException     요청자가 해당 스케줄의 강사가 아님
     */
    @Transactional
    public Schedule updateMeetLink(Long scheduleId, String teacherId, ScheduleMeetLinkRequest request) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new ResourceNotFoundException("Schedule", scheduleId.toString()));

        if (!schedule.getUser().getId().equals(teacherId)) {
            throw new IllegalStateException("Meet 링크 수정은 해당 수업의 강사만 가능합니다.");
        }

        schedule.setMeetLink(request.meetLink().trim());
        return schedule;
    }

    /**
     * 스케줄 삭제(취소). 이미 CANCELED면 idempotent로 조기 반환.
     *
     * @param id 스케줄 ID
     * @throws ResourceNotFoundException 스케줄 미존재 시
     */
    @Transactional
    public void delete(Long id) {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("Schedule", id.toString())
        );

        if (schedule.getStatus() == ScheduleStatus.CANCELED) return;
        schedule.setStatus(ScheduleStatus.CANCELED);
    }

    /**
     * 강사별 상태별 스케줄 개수. countByStatus()가 반환하지 않는 상태는 0으로 초기화.
     *
     * @param userId 강사 ID
     * @return 상태별 건수
     */
    @Transactional(readOnly = true)
    public Map<ScheduleStatus, Long> countByStatus(String userId) {
        EnumMap<ScheduleStatus, Long> result = new EnumMap<>(ScheduleStatus.class);

        for (ScheduleStatus status : ScheduleStatus.values()) {
            result.put(status, 0L);
        }

        scheduleRepository.countByStatus(userId).forEach(row -> result.put(row.getStatus(), row.getCount()));

        return result;
    }
}
