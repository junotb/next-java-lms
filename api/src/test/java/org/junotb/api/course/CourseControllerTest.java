package org.junotb.api.course;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junotb.api.common.exception.DuplicateResourceException;
import org.junotb.api.course.web.CourseCreateRequest;
import org.junotb.api.course.web.CourseUpdateRequest;
import org.junotb.api.common.security.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CourseController.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("CourseController Slice Test")
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CourseService courseService;

    @MockBean
    private AuthenticationFilter authenticationFilter;

    @Test
    @DisplayName("list_whenValidRequest_thenReturn200")
    void list_whenValidRequest_thenReturn200() throws Exception {
        // given
        Course course = Course.builder()
            .id(1L)
            .title("Java Basics")
            .description("Learn Java")
            .status(CourseStatus.OPEN)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        Page<Course> coursePage = new PageImpl<>(List.of(course), PageRequest.of(0, 10), 1);
        given(courseService.findList(anyString(), any(), any())).willReturn(coursePage);

        // when & then
        mockMvc.perform(get("/api/courses")
                .param("title", "Java"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[0].title").value("Java Basics"));
    }

    @Test
    @DisplayName("get_whenCourseExists_thenReturn200")
    void get_whenCourseExists_thenReturn200() throws Exception {
        // given
        Long courseId = 1L;
        Course course = Course.builder()
            .id(courseId)
            .title("Java Basics")
            .description("Learn Java")
            .status(CourseStatus.OPEN)
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        given(courseService.findById(courseId)).willReturn(Optional.of(course));

        // when & then
        mockMvc.perform(get("/api/courses/{id}", courseId))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(courseId))
            .andExpect(jsonPath("$.title").value("Java Basics"));
    }

    @Test
    @DisplayName("get_whenCourseNotFound_thenReturn404")
    void get_whenCourseNotFound_thenReturn404() throws Exception {
        // given
        Long courseId = 999L;
        given(courseService.findById(courseId)).willReturn(Optional.empty());

        // when & then
        mockMvc.perform(get("/api/courses/{id}", courseId))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("create_whenValidRequest_thenReturn201")
    void create_whenValidRequest_thenReturn201() throws Exception {
        // given
        CourseCreateRequest request = new CourseCreateRequest(
            "Java Basics",
            "Learn Java from scratch",
            CourseStatus.OPEN
        );

        Course course = Course.builder()
            .id(1L)
            .title(request.title())
            .description(request.description())
            .status(request.status())
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        given(courseService.create(anyString(), anyString(), any())).willReturn(course);

        // when & then
        mockMvc.perform(post("/api/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.title").value("Java Basics"))
            .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    @DisplayName("create_whenTitleIsNull_thenReturn400")
    void create_whenTitleIsNull_thenReturn400() throws Exception {
        // given
        CourseCreateRequest request = new CourseCreateRequest(
            null,
            "Description",
            CourseStatus.OPEN
        );

        // when & then
        mockMvc.perform(post("/api/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("create_whenDuplicateTitle_thenReturn409")
    void create_whenDuplicateTitle_thenReturn409() throws Exception {
        // given
        CourseCreateRequest request = new CourseCreateRequest(
            "Java Basics",
            "Description",
            CourseStatus.OPEN
        );

        given(courseService.create(anyString(), anyString(), any()))
            .willThrow(new DuplicateResourceException("Title", "Java Basics"));

        // when & then
        mockMvc.perform(post("/api/courses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("update_whenValidRequest_thenReturn200")
    void update_whenValidRequest_thenReturn200() throws Exception {
        // given
        Long courseId = 1L;
        CourseUpdateRequest request = new CourseUpdateRequest(
            "Advanced Java",
            "Deep dive into Java",
            CourseStatus.CLOSED
        );

        Course course = Course.builder()
            .id(courseId)
            .title(request.title())
            .description(request.description())
            .status(request.status())
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();

        given(courseService.update(anyLong(), anyString(), anyString(), any())).willReturn(course);

        // when & then
        mockMvc.perform(patch("/api/courses/{id}", courseId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Advanced Java"))
            .andExpect(jsonPath("$.status").value("CLOSED"));
    }

    @Test
    @DisplayName("update_whenCourseNotFound_thenReturn404")
    void update_whenCourseNotFound_thenReturn404() throws Exception {
        // given
        Long courseId = 999L;
        CourseUpdateRequest request = new CourseUpdateRequest(
            "Title",
            "Description",
            CourseStatus.OPEN
        );

        given(courseService.update(anyLong(), anyString(), anyString(), any()))
            .willThrow(new EntityNotFoundException("Course not found"));

        // when & then
        mockMvc.perform(patch("/api/courses/{id}", courseId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("delete_whenValidId_thenReturn204")
    void delete_whenValidId_thenReturn204() throws Exception {
        // given
        Long courseId = 1L;
        willDoNothing().given(courseService).delete(courseId);

        // when & then
        mockMvc.perform(delete("/api/courses/{id}", courseId))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("delete_whenCourseNotFound_thenReturn404")
    void delete_whenCourseNotFound_thenReturn404() throws Exception {
        // given
        Long courseId = 999L;
        willThrow(new EntityNotFoundException("Course not found"))
            .given(courseService).delete(courseId);

        // when & then
        mockMvc.perform(delete("/api/courses/{id}", courseId))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("countByStatus_whenCalled_thenReturnStats")
    void countByStatus_whenCalled_thenReturnStats() throws Exception {
        // given
        Map<CourseStatus, Long> stats = Map.of(
            CourseStatus.OPEN, 10L,
            CourseStatus.CLOSED, 5L
        );
        given(courseService.countByStatus()).willReturn(stats);

        // when & then
        mockMvc.perform(get("/api/courses/stats/status"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.OPEN").value(10))
            .andExpect(jsonPath("$.CLOSED").value(5));
    }
}
