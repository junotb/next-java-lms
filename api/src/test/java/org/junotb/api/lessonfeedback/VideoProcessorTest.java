package org.junotb.api.lessonfeedback;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junotb.api.course.Course;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleStatus;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

/**
 * {@link VideoProcessor} 단위 테스트.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("VideoProcessor Unit Test")
class VideoProcessorTest {

    @Mock
    private VideoProcessService videoProcessService;

    @Mock
    private LessonFeedbackRepository lessonFeedbackRepository;

    @InjectMocks
    private VideoProcessor videoProcessor;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(videoProcessor, "enabled", true);
    }

    @Test
    @DisplayName("extractVttSync_whenEnabledAndSuccess_thenReturnVtt")
    void extractVttSync_whenEnabledAndSuccess_thenReturnVtt() throws IOException {
        Long scheduleId = 1L;
        String videoPath = "/tmp/test.mp4";
        String expectedVtt = "WEBVTT\n\n00:00:00.000 --> 00:00:01.000\n안녕하세요";

        given(videoProcessService.extractVtt(videoPath)).willReturn(expectedVtt);

        String result = videoProcessor.extractVttSync(scheduleId, videoPath);

        assertThat(result).isEqualTo(expectedVtt);
        then(videoProcessService).should().extractVtt(videoPath);
    }

    @Test
    @DisplayName("extractVttSync_whenDisabled_thenThrowException")
    void extractVttSync_whenDisabled_thenThrowException() throws IOException {
        ReflectionTestUtils.setField(videoProcessor, "enabled", false);

        assertThatThrownBy(() -> videoProcessor.extractVttSync(1L, "/tmp/test.mp4"))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("비활성화");

        then(videoProcessService).should(org.mockito.Mockito.never()).extractVtt(any());
    }

    @Test
    @DisplayName("extractVttSync_whenExtractionFails_thenThrowException")
    void extractVttSync_whenExtractionFails_thenThrowException() throws IOException {
        Long scheduleId = 1L;
        String videoPath = "/tmp/invalid.mp4";

        given(videoProcessService.extractVtt(videoPath)).willThrow(new RuntimeException("STT failed"));

        assertThatThrownBy(() -> videoProcessor.extractVttSync(scheduleId, videoPath))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("VTT 추출에 실패했습니다");

        then(videoProcessService).should().extractVtt(videoPath);
    }

    @Test
    @DisplayName("processFeedbackAsync_whenVttContentExists_thenUpdateToCompleted")
    void processFeedbackAsync_whenVttContentExists_thenUpdateToCompleted() {
        Long feedbackId = 1L;
        String vttContent = "WEBVTT\n\n00:00:00.000 --> 00:00:01.000\n수업 내용";
        String feedbackContent = "AI 생성 피드백";

        User teacher = User.builder()
            .id(UUID.randomUUID().toString())
            .name("Teacher")
            .role(UserRole.TEACHER)
            .status(UserStatus.ACTIVE)
            .build();
        Course course = Course.builder().id(1L).title("Java").build();
        Schedule schedule = Schedule.builder()
            .id(1L)
            .user(teacher)
            .course(course)
            .status(ScheduleStatus.ATTENDED)
            .startsAt(OffsetDateTime.now())
            .endsAt(OffsetDateTime.now().plusHours(1))
            .build();
        LessonFeedback feedback = LessonFeedback.builder()
            .id(feedbackId)
            .schedule(schedule)
            .vttContent(vttContent)
            .feedbackStatus(LessonFeedbackStatus.PENDING)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        given(lessonFeedbackRepository.findById(feedbackId)).willReturn(Optional.of(feedback));
        given(videoProcessService.generateFeedback(vttContent)).willReturn(feedbackContent);
        given(lessonFeedbackRepository.save(any(LessonFeedback.class))).willReturn(feedback);

        videoProcessor.processFeedbackAsync(feedbackId);

        ArgumentCaptor<LessonFeedback> captor = ArgumentCaptor.forClass(LessonFeedback.class);
        then(lessonFeedbackRepository).should().save(captor.capture());
        LessonFeedback saved = captor.getValue();
        assertThat(saved.getFeedbackContent()).isEqualTo(feedbackContent);
        assertThat(saved.getFeedbackStatus()).isEqualTo(LessonFeedbackStatus.COMPLETED);
        then(videoProcessService).should().generateFeedback(vttContent);
    }

    @Test
    @DisplayName("processFeedbackAsync_whenVttContentEmpty_thenMarkFailed")
    void processFeedbackAsync_whenVttContentEmpty_thenMarkFailed() {
        Long feedbackId = 1L;
        LessonFeedback feedback = LessonFeedback.builder()
            .id(feedbackId)
            .vttContent("")
            .feedbackStatus(LessonFeedbackStatus.PENDING)
            .build();

        given(lessonFeedbackRepository.findById(feedbackId)).willReturn(Optional.of(feedback));
        given(lessonFeedbackRepository.save(any(LessonFeedback.class))).willReturn(feedback);

        videoProcessor.processFeedbackAsync(feedbackId);

        ArgumentCaptor<LessonFeedback> captor = ArgumentCaptor.forClass(LessonFeedback.class);
        then(lessonFeedbackRepository).should().save(captor.capture());
        assertThat(captor.getValue().getFeedbackStatus()).isEqualTo(LessonFeedbackStatus.FAILED);
        then(videoProcessService).should(org.mockito.Mockito.never()).generateFeedback(any());
    }

    @Test
    @DisplayName("processFeedbackAsync_whenVttContentNull_thenMarkFailed")
    void processFeedbackAsync_whenVttContentNull_thenMarkFailed() {
        Long feedbackId = 1L;
        LessonFeedback feedback = LessonFeedback.builder()
            .id(feedbackId)
            .vttContent(null)
            .feedbackStatus(LessonFeedbackStatus.PENDING)
            .build();

        given(lessonFeedbackRepository.findById(feedbackId)).willReturn(Optional.of(feedback));
        given(lessonFeedbackRepository.save(any(LessonFeedback.class))).willReturn(feedback);

        videoProcessor.processFeedbackAsync(feedbackId);

        ArgumentCaptor<LessonFeedback> captor = ArgumentCaptor.forClass(LessonFeedback.class);
        then(lessonFeedbackRepository).should().save(captor.capture());
        assertThat(captor.getValue().getFeedbackStatus()).isEqualTo(LessonFeedbackStatus.FAILED);
        then(videoProcessService).should(org.mockito.Mockito.never()).generateFeedback(any());
    }

    @Test
    @DisplayName("processFeedbackAsync_whenGenerateFails_thenMarkFailed")
    void processFeedbackAsync_whenGenerateFails_thenMarkFailed() {
        Long feedbackId = 1L;
        String vttContent = "WEBVTT\n\n";
        LessonFeedback feedback = LessonFeedback.builder()
            .id(feedbackId)
            .vttContent(vttContent)
            .feedbackStatus(LessonFeedbackStatus.PENDING)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        given(lessonFeedbackRepository.findById(feedbackId)).willReturn(Optional.of(feedback));
        given(videoProcessService.generateFeedback(vttContent)).willThrow(new RuntimeException("Gemini API error"));
        given(lessonFeedbackRepository.save(any(LessonFeedback.class))).willReturn(feedback);

        videoProcessor.processFeedbackAsync(feedbackId);

        ArgumentCaptor<LessonFeedback> captor = ArgumentCaptor.forClass(LessonFeedback.class);
        then(lessonFeedbackRepository).should().save(captor.capture());
        assertThat(captor.getValue().getFeedbackStatus()).isEqualTo(LessonFeedbackStatus.FAILED);
    }

    @Test
    @DisplayName("processFeedbackAsync_whenDisabled_thenNoProcessing")
    void processFeedbackAsync_whenDisabled_thenNoProcessing() {
        ReflectionTestUtils.setField(videoProcessor, "enabled", false);

        videoProcessor.processFeedbackAsync(1L);

        then(lessonFeedbackRepository).should(org.mockito.Mockito.never()).findById(anyLong());
        then(videoProcessService).should(org.mockito.Mockito.never()).generateFeedback(any());
    }
}
