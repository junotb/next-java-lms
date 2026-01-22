package org.junotb.api.schedule;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junotb.api.course.Course;
import org.junotb.api.course.CourseRepository;
import org.junotb.api.schedule.web.ScheduleCreateRequest;
import org.junotb.api.schedule.web.ScheduleUpdateRequest;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junotb.api.schedule.ScheduleStatus.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock
    ScheduleRepository scheduleRepository;

    @InjectMocks
    ScheduleService scheduleService;

    @Mock
    UserRepository userRepository;

    @Mock
    CourseRepository courseRepository;

    @Test
    @DisplayName("스케줄 생성")
    void create() {
        String userId = "user-1";
        ScheduleCreateRequest request = new ScheduleCreateRequest(1L, OffsetDateTime.now(), OffsetDateTime.now().plusHours(1), SCHEDULED);
        User user = mock(User.class);
        when(user.getId()).thenReturn(userId);

        Course course = mock(Course.class);
        when(course.getId()).thenReturn(1L);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user)); // 사용자 존재 확인 Mock
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course)); // 코스 존재 확인 Mock
        when(scheduleRepository.save(any())).thenAnswer(i -> i.getArguments()[0]); // 받은 그대로 반환

        Schedule created = scheduleService.create(userId, request);

        assertThat(created.getUser().getId()).isEqualTo(userId);
        assertThat(created.getCourse().getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("스케줄 수정")
    void update() {
        User user = mock(User.class);
        Course course = mock(Course.class);

        Schedule schedule = Schedule.create(user, course, OffsetDateTime.now(), OffsetDateTime.now().plusHours(1), SCHEDULED);
        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));

        ScheduleUpdateRequest request = new ScheduleUpdateRequest(null, null, ATTENDED);

        Schedule updated = scheduleService.update(1L, request);

        assertThat(updated.getStatus()).isEqualTo(ATTENDED);
    }

    @Test
    @DisplayName("스케줄 삭제 (취소)")
    void delete() {
        Long id = 1L;
        User user = mock(User.class);
        Course course = mock(Course.class);

        Schedule schedule = Schedule.create(user, course, OffsetDateTime.now(), OffsetDateTime.now().plusHours(1), SCHEDULED);
        when(scheduleRepository.findById(id)).thenReturn(Optional.of(schedule));

        scheduleService.delete(id);

        assertThat(schedule.getStatus()).isEqualTo(CANCELLED);
    }
}