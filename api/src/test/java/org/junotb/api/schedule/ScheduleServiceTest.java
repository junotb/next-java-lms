package org.junotb.api.schedule;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ScheduleServiceTest {

    @Mock
    ScheduleRepository scheduleRepository;

    @InjectMocks
    ScheduleService scheduleService;

    @Test
    @DisplayName("should find schedule by ID")
    void findById() {
        Schedule schedule = mock(Schedule.class);
        when(scheduleRepository.findById(1L)).thenReturn(Optional.of(schedule));

        Optional<Schedule> result = scheduleService.findById(1L);

        assertThat(result).isPresent();
        verify(scheduleRepository).findById(1L);
    }

    @Test
    @DisplayName("should find schedules by user ID")
    void findByUserId() {
        Schedule schedule = mock(Schedule.class);
        when(scheduleRepository.findByUserId(10L)).thenReturn(List.of(schedule));

        List<Schedule> result = scheduleService.findByUserId(10L);

        assertThat(result).hasSize(1);
        verify(scheduleRepository).findByUserId(10L);
    }

    @Test
    @DisplayName("should create a new schedule")
    void create() {
        Schedule schedule = mock(Schedule.class);
        when(scheduleRepository.save(schedule)).thenReturn(schedule);

        Schedule saved = scheduleService.create(schedule);

        assertThat(saved).isEqualTo(schedule);
        verify(scheduleRepository).save(schedule);
    }
}