package org.junotb.api.schedule;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.junotb.api.schedule.web.ScheduleCreateRequest;
import org.junotb.api.schedule.web.ScheduleListRequest;
import org.junotb.api.schedule.web.ScheduleUpdateRequest;
import org.junotb.api.schedule.enums.ScheduleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;

    public Optional<Schedule> findById(Long id) {
        return scheduleRepository.findById(id);
    }

    public Page<Schedule> findList(ScheduleListRequest request, Pageable pageable) {
        Specification<Schedule> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.userId() != null) {
                predicates.add(
                    cb.equal(root.get("user").get("id"), request.userId())
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

    @Transactional
    public Schedule create(ScheduleCreateRequest request) {
        Schedule schedule = Schedule.create(
            request.userId(),
            request.startsAt(),
            request.endsAt(),
            request.status()
        );

        return scheduleRepository.save(schedule);
    }

    @Transactional
    public Schedule update(Long id, ScheduleUpdateRequest request) {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() ->
            new EntityExistsException("Schedule not found with id: " + id)
        );

        if (request.startsAt() != null) schedule.setStartsAt(request.startsAt());
        if (request.endsAt() != null) schedule.setEndsAt(request.endsAt());
        if (request.status() != null) schedule.setStatus(request.status());

        return schedule;
    }

    @Transactional
    public void delete(Long id) {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(
            () -> new EntityExistsException("Schedule not found with id: " + id)
        );

        if (schedule.getStatus() == ScheduleStatus.CANCELLED) return;
        schedule.setStatus(ScheduleStatus.CANCELLED);
    }
}
