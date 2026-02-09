package org.junotb.api.lessonfeedback;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junotb.api.common.exception.ResourceNotFoundException;
import org.junotb.api.course.Course;
import org.junotb.api.lessonfeedback.dto.LessonFeedbackResponse;
import org.junotb.api.lessonfeedback.dto.VideoUploadResponse;
import org.junotb.api.registration.Registration;
import org.junotb.api.registration.RegistrationRepository;
import org.junotb.api.registration.RegistrationStatus;
import org.junotb.api.schedule.Schedule;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.schedule.ScheduleStatus;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

/**
 * {@link LessonFeedbackService} 단위 테스트.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("LessonFeedbackService Unit Test")
class LessonFeedbackServiceTest {

    @Mock
    private LessonFeedbackRepository lessonFeedbackRepository;

    @Mock
    private ScheduleRepository scheduleRepository;

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private VideoProcessor videoProcessor;

    @InjectMocks
    private LessonFeedbackService lessonFeedbackService;

    private User createTeacher(String id) {
        return User.builder()
            .id(id != null ? id : UUID.randomUUID().toString())
            .name("Instructor")
            .email("instructor@test.com")
            .role(UserRole.TEACHER)
            .status(UserStatus.ACTIVE)
            .build();
    }

    private User createStudent(String id) {
        return User.builder()
            .id(id != null ? id : UUID.randomUUID().toString())
            .name("Student")
            .email("student@test.com")
            .role(UserRole.STUDENT)
            .status(UserStatus.ACTIVE)
            .build();
    }

    private Schedule createAttendedSchedule(Long scheduleId, User teacher) {
        Course course = Course.builder().id(1L).title("Java").build();
        return Schedule.builder()
            .id(scheduleId)
            .user(teacher)
            .course(course)
            .status(ScheduleStatus.ATTENDED)
            .startsAt(OffsetDateTime.now().minusHours(1))
            .endsAt(OffsetDateTime.now())
            .build();
    }

    @Test
    @DisplayName("uploadVideo_whenValidRequest_thenReturn201AndSaveFeedback")
    void uploadVideo_whenValidRequest_thenReturn201AndSaveFeedback() throws IOException {
        Long scheduleId = 1L;
        String teacherId = UUID.randomUUID().toString();
        User teacher = createTeacher(teacherId);
        Schedule schedule = createAttendedSchedule(scheduleId, teacher);
        MultipartFile file = new MockMultipartFile("file", "test.mp4", "video/mp4", "video content".getBytes());

        String vttContent = "WEBVTT\n\n00:00:00.000 --> 00:00:01.000\n안녕하세요";
        LessonFeedback savedFeedback = LessonFeedback.builder()
            .id(100L)
            .schedule(schedule)
            .vttContent(vttContent)
            .feedbackStatus(LessonFeedbackStatus.PENDING)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));
        given(lessonFeedbackRepository.findByScheduleId(scheduleId)).willReturn(Optional.empty());
        given(videoProcessor.extractVttSync(eq(scheduleId), any(String.class))).willReturn(vttContent);
        given(lessonFeedbackRepository.save(any(LessonFeedback.class))).willReturn(savedFeedback);

        VideoUploadResponse result = lessonFeedbackService.uploadVideo(scheduleId, teacherId, file);

        assertThat(result).isNotNull();
        assertThat(result.lessonFeedbackId()).isEqualTo(100L);
        assertThat(result.status()).isEqualTo("PENDING");

        ArgumentCaptor<LessonFeedback> feedbackCaptor = ArgumentCaptor.forClass(LessonFeedback.class);
        then(lessonFeedbackRepository).should().save(feedbackCaptor.capture());
        assertThat(feedbackCaptor.getValue().getVttContent()).isEqualTo(vttContent);
        assertThat(feedbackCaptor.getValue().getFeedbackStatus()).isEqualTo(LessonFeedbackStatus.PENDING);

        then(videoProcessor).should().processFeedbackAsync(100L);
    }

    @Test
    @DisplayName("uploadVideo_whenNotTeacher_thenThrowException")
    void uploadVideo_whenNotTeacher_thenThrowException() throws IOException {
        Long scheduleId = 1L;
        String otherUserId = UUID.randomUUID().toString();
        User teacher = createTeacher(UUID.randomUUID().toString());
        Schedule schedule = createAttendedSchedule(scheduleId, teacher);
        MultipartFile file = new MockMultipartFile("file", "test.mp4", "video/mp4", "content".getBytes());

        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));

        assertThatThrownBy(() -> lessonFeedbackService.uploadVideo(scheduleId, otherUserId, file))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("강사만 가능");

        then(videoProcessor).should(never()).extractVttSync(anyLong(), any());
        then(lessonFeedbackRepository).should(never()).save(any(LessonFeedback.class));
    }

    @Test
    @DisplayName("uploadVideo_whenScheduleNotAttended_thenThrowException")
    void uploadVideo_whenScheduleNotAttended_thenThrowException() throws IOException {
        Long scheduleId = 1L;
        String teacherId = UUID.randomUUID().toString();
        User teacher = createTeacher(teacherId);
        Schedule schedule = createAttendedSchedule(scheduleId, teacher);
        schedule.setStatus(ScheduleStatus.SCHEDULED);
        MultipartFile file = new MockMultipartFile("file", "test.mp4", "video/mp4", "content".getBytes());

        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));

        assertThatThrownBy(() -> lessonFeedbackService.uploadVideo(scheduleId, teacherId, file))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("수업 종료(출석) 처리된 수업만");

        then(videoProcessor).should(never()).extractVttSync(anyLong(), any());
        then(lessonFeedbackRepository).should(never()).save(any(LessonFeedback.class));
    }

    @Test
    @DisplayName("uploadVideo_whenFeedbackAlreadyExists_thenThrowException")
    void uploadVideo_whenFeedbackAlreadyExists_thenThrowException() throws IOException {
        Long scheduleId = 1L;
        String teacherId = UUID.randomUUID().toString();
        User teacher = createTeacher(teacherId);
        Schedule schedule = createAttendedSchedule(scheduleId, teacher);
        MultipartFile file = new MockMultipartFile("file", "test.mp4", "video/mp4", "content".getBytes());
        LessonFeedback existing = LessonFeedback.builder().id(1L).schedule(schedule).build();

        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));
        given(lessonFeedbackRepository.findByScheduleId(scheduleId)).willReturn(Optional.of(existing));

        assertThatThrownBy(() -> lessonFeedbackService.uploadVideo(scheduleId, teacherId, file))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("이미 피드백이 등록된 수업");

        then(videoProcessor).should(never()).extractVttSync(anyLong(), any());
        then(lessonFeedbackRepository).should(never()).save(any(LessonFeedback.class));
    }

    @Test
    @DisplayName("uploadVideo_whenFileEmpty_thenThrowException")
    void uploadVideo_whenFileEmpty_thenThrowException() throws IOException {
        Long scheduleId = 1L;
        String teacherId = UUID.randomUUID().toString();
        User teacher = createTeacher(teacherId);
        Schedule schedule = createAttendedSchedule(scheduleId, teacher);
        MultipartFile file = new MockMultipartFile("file", "test.mp4", "video/mp4", new byte[0]);

        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));
        given(lessonFeedbackRepository.findByScheduleId(scheduleId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> lessonFeedbackService.uploadVideo(scheduleId, teacherId, file))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("비어 있습니다");

        then(videoProcessor).should(never()).extractVttSync(anyLong(), any());
        then(lessonFeedbackRepository).should(never()).save(any(LessonFeedback.class));
    }

    @Test
    @DisplayName("uploadVideo_whenVttExtractionFails_thenNoDbSaveAndThrowException")
    void uploadVideo_whenVttExtractionFails_thenNoDbSaveAndThrowException() throws IOException {
        Long scheduleId = 1L;
        String teacherId = UUID.randomUUID().toString();
        User teacher = createTeacher(teacherId);
        Schedule schedule = createAttendedSchedule(scheduleId, teacher);
        MultipartFile file = new MockMultipartFile("file", "test.mp4", "video/mp4", "content".getBytes());

        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));
        given(lessonFeedbackRepository.findByScheduleId(scheduleId)).willReturn(Optional.empty());
        given(videoProcessor.extractVttSync(eq(scheduleId), any(String.class)))
            .willThrow(new IllegalStateException("VTT 추출 실패"));

        assertThatThrownBy(() -> lessonFeedbackService.uploadVideo(scheduleId, teacherId, file))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("VTT 추출 실패");

        then(lessonFeedbackRepository).should(never()).save(any(LessonFeedback.class));
        then(videoProcessor).should(never()).processFeedbackAsync(anyLong());
    }

    @Test
    @DisplayName("uploadVideo_whenVttSuccess_thenProcessFeedbackAsyncCalled")
    void uploadVideo_whenVttSuccess_thenProcessFeedbackAsyncCalled() throws IOException {
        Long scheduleId = 1L;
        String teacherId = UUID.randomUUID().toString();
        User teacher = createTeacher(teacherId);
        Schedule schedule = createAttendedSchedule(scheduleId, teacher);
        MultipartFile file = new MockMultipartFile("file", "test.mp4", "video/mp4", "content".getBytes());
        String vttContent = "WEBVTT\n\n00:00:00.000 --> 00:00:01.000\n테스트";
        LessonFeedback savedFeedback = LessonFeedback.builder()
            .id(50L)
            .schedule(schedule)
            .vttContent(vttContent)
            .feedbackStatus(LessonFeedbackStatus.PENDING)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.of(schedule));
        given(lessonFeedbackRepository.findByScheduleId(scheduleId)).willReturn(Optional.empty());
        given(videoProcessor.extractVttSync(eq(scheduleId), any(String.class))).willReturn(vttContent);
        given(lessonFeedbackRepository.save(any(LessonFeedback.class))).willReturn(savedFeedback);

        lessonFeedbackService.uploadVideo(scheduleId, teacherId, file);

        then(videoProcessor).should().processFeedbackAsync(50L);
    }

    @Test
    @DisplayName("uploadVideo_whenScheduleNotFound_thenThrowException")
    void uploadVideo_whenScheduleNotFound_thenThrowException() throws IOException {
        Long scheduleId = 999L;
        String teacherId = UUID.randomUUID().toString();
        MultipartFile file = new MockMultipartFile("file", "test.mp4", "video/mp4", "content".getBytes());

        given(scheduleRepository.findById(scheduleId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> lessonFeedbackService.uploadVideo(scheduleId, teacherId, file))
            .isInstanceOf(ResourceNotFoundException.class);

        then(videoProcessor).should(never()).extractVttSync(anyLong(), any());
        then(lessonFeedbackRepository).should(never()).save(any(LessonFeedback.class));
    }

    @Test
    @DisplayName("getFeedback_whenTeacher_thenReturnResponse")
    void getFeedback_whenTeacher_thenReturnResponse() {
        Long scheduleId = 1L;
        String teacherId = UUID.randomUUID().toString();
        User teacher = createTeacher(teacherId);
        Schedule schedule = createAttendedSchedule(scheduleId, teacher);
        LessonFeedback feedback = LessonFeedback.builder()
            .id(1L)
            .schedule(schedule)
            .vttContent("WEBVTT\n\n")
            .feedbackContent("피드백 내용")
            .feedbackStatus(LessonFeedbackStatus.COMPLETED)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        given(lessonFeedbackRepository.findByScheduleId(scheduleId)).willReturn(Optional.of(feedback));

        LessonFeedbackResponse result = lessonFeedbackService.getFeedback(scheduleId, teacherId);

        assertThat(result).isNotNull();
        assertThat(result.scheduleId()).isEqualTo(scheduleId);
        assertThat(result.feedbackContent()).isEqualTo("피드백 내용");
        assertThat(result.feedbackStatus()).isEqualTo(LessonFeedbackStatus.COMPLETED);
    }

    @Test
    @DisplayName("getFeedback_whenStudent_thenReturnResponse")
    void getFeedback_whenStudent_thenReturnResponse() {
        Long scheduleId = 1L;
        String studentId = UUID.randomUUID().toString();
        User teacher = createTeacher(UUID.randomUUID().toString());
        User student = createStudent(studentId);
        Schedule schedule = createAttendedSchedule(scheduleId, teacher);
        LessonFeedback feedback = LessonFeedback.builder()
            .id(1L)
            .schedule(schedule)
            .vttContent("WEBVTT\n\n")
            .feedbackContent("피드백")
            .feedbackStatus(LessonFeedbackStatus.COMPLETED)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();
        Registration registration = Registration.builder()
            .schedule(schedule)
            .student(student)
            .status(RegistrationStatus.REGISTERED)
            .build();

        given(lessonFeedbackRepository.findByScheduleId(scheduleId)).willReturn(Optional.of(feedback));
        given(registrationRepository.findByScheduleIdAndStudentId(scheduleId, studentId))
            .willReturn(Optional.of(registration));

        LessonFeedbackResponse result = lessonFeedbackService.getFeedback(scheduleId, studentId);

        assertThat(result).isNotNull();
        assertThat(result.scheduleId()).isEqualTo(scheduleId);
    }

    @Test
    @DisplayName("getFeedback_whenUnauthorizedUser_thenThrowException")
    void getFeedback_whenUnauthorizedUser_thenThrowException() {
        Long scheduleId = 1L;
        String unauthorizedUserId = UUID.randomUUID().toString();
        User teacher = createTeacher(UUID.randomUUID().toString());
        Schedule schedule = createAttendedSchedule(scheduleId, teacher);
        LessonFeedback feedback = LessonFeedback.builder()
            .id(1L)
            .schedule(schedule)
            .vttContent("WEBVTT\n\n")
            .feedbackContent("피드백")
            .feedbackStatus(LessonFeedbackStatus.COMPLETED)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        given(lessonFeedbackRepository.findByScheduleId(scheduleId)).willReturn(Optional.of(feedback));
        given(registrationRepository.findByScheduleIdAndStudentId(scheduleId, unauthorizedUserId))
            .willReturn(Optional.empty());

        assertThatThrownBy(() -> lessonFeedbackService.getFeedback(scheduleId, unauthorizedUserId))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("권한이 없습니다");
    }

    @Test
    @DisplayName("getFeedback_whenFeedbackNotFound_thenThrowException")
    void getFeedback_whenFeedbackNotFound_thenThrowException() {
        Long scheduleId = 999L;
        String userId = UUID.randomUUID().toString();

        given(lessonFeedbackRepository.findByScheduleId(scheduleId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> lessonFeedbackService.getFeedback(scheduleId, userId))
            .isInstanceOf(ResourceNotFoundException.class);
    }
}
