package org.junotb.api.teacher;

import lombok.RequiredArgsConstructor;
import org.junotb.api.teacher.dto.TeacherCandidateResponse;
import org.junotb.api.user.TeacherAvailabilityRepository;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherCandidateService {

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    /** 휴무 NOT EXISTS 검사용 기본 구간: 현재 ~ 12개월 후 */
    private static final int DEFAULT_SCHEDULE_WINDOW_MONTHS = 12;

    private final TeacherAvailabilityRepository teacherAvailabilityRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TeacherCandidateResponse> findCandidates(
            List<DayOfWeek> days,
            String startTimeStr,
            int durationMinutes
    ) {
        LocalTime startTime = LocalTime.parse(startTimeStr, TIME_FORMAT);
        LocalTime endTime = startTime.plusMinutes(durationMinutes);
        long dayCount = days.size();

        OffsetDateTime scheduleStart = OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime scheduleEnd = scheduleStart.plusMonths(DEFAULT_SCHEDULE_WINDOW_MONTHS);

        // Native Query 호환: DayOfWeek → String 변환
        List<String> dayStrList = days.stream()
                .map(DayOfWeek::name)
                .toList();
        Set<String> dayStrings = days.stream()
                .map(DayOfWeek::name)
                .collect(Collectors.toSet());

        List<String> teacherIds = teacherAvailabilityRepository.findCandidates(
                dayStrList,
                startTime,
                endTime,
                dayCount,
                scheduleStart,
                scheduleEnd,
                dayStrings
        );

        return teacherIds.stream()
                .map(userRepository::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(this::toResponse)
                .toList();
    }

    private TeacherCandidateResponse toResponse(User user) {
        return new TeacherCandidateResponse(user.getId(), user.getName());
    }

    public static List<DayOfWeek> parseDays(String daysParam) {
        if (daysParam == null || daysParam.isBlank()) {
            return List.of();
        }
        return Arrays.stream(daysParam.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(DayOfWeek::valueOf)
                .toList();
    }
}
