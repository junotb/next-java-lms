package org.junotb.api.schedule;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.junotb.api.common.exception.ResourceNotFoundException;
import org.junotb.api.schedule.web.ScheduleCreateRequest;
import org.junotb.api.schedule.web.ScheduleListRequest;
import org.junotb.api.schedule.web.ScheduleUpdateRequest;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    // 스케줄 조회
    public Optional<Schedule> findById(Long id) {
        return scheduleRepository.findById(id);
    }

    // 스케줄 목록 조회
    public Page<Schedule> findList(ScheduleListRequest request, Pageable pageable) {
        Specification<Schedule> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 사용자 번호로 필터링
            if (request.userId() != null) {
                predicates.add(
                    cb.equal(root.get("\"userId\""), request.userId())
                );
            }

            // 스케줄 상태로 필터링
            if (request.status() != null) {
                predicates.add(
                    cb.equal(root.get("\"status\""), request.status())
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return scheduleRepository.findAll(spec, pageable);
    }

    // 스케줄 생성
    @Transactional
    public Schedule create(ScheduleCreateRequest request) {
        // 사용자 존재 여부 확인
        User user = userRepository.findById(request.userId()).orElseThrow(() ->
            new ResourceNotFoundException("id", request.userId())
        );

        Schedule schedule = Schedule.create(
            user.getId(),
            request.startsAt(),
            request.endsAt(),
            request.status()
        );

        return scheduleRepository.save(schedule);
    }

    // 스케줄 수정
    @Transactional
    public Schedule update(Long id, ScheduleUpdateRequest request) {
        // 스케줄 번호에 해당하는 스케줄 존재 여부 확인
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() ->
            new EntityExistsException("Schedule not found with id: " + id)
        );

        // 수정할 필드만 업데이트
        if (request.startsAt() != null) schedule.setStartsAt(request.startsAt());
        if (request.endsAt() != null) schedule.setEndsAt(request.endsAt());
        if (request.status() != null) schedule.setStatus(request.status());

        return schedule;
    }

    // 스케줄 삭제 (취소 처리)
    @Transactional
    public void delete(Long id) {
        // 스케줄 번호에 해당하는 스케줄 존재 여부 확인
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(
            () -> new EntityExistsException("Schedule not found with id: " + id)
        );

        // 이미 취소된 스케줄인 경우 처리하지 않음
        if (schedule.getStatus() == ScheduleStatus.CANCELLED) return;
        schedule.setStatus(ScheduleStatus.CANCELLED);
    }

    // 상태별 스케줄 개수 조회
    @Transactional(readOnly = true)
    public Map<ScheduleStatus, Long> countByStatus(String userId) {
        EnumMap<ScheduleStatus, Long> result = new EnumMap<>(ScheduleStatus.class);

        // 모든 상태를 0으로 초기화
        for (ScheduleStatus status : ScheduleStatus.values()) {
            result.put(status, 0L);
        }

        scheduleRepository.countByStatus(userId).forEach(row -> result.put(row.getStatus(), row.getCount()));

        return result;
    }
}
