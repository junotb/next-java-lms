package org.junotb.api.lessonfeedback;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * {@link VideoProcessService} 단위 테스트.
 * FFmpeg, GCP Speech-to-Text, Gemini API 의존 테스트는 Mock/통합 환경 필요.
 */
@DisplayName("VideoProcessService Unit Test")
class VideoProcessServiceTest {

    private VideoProcessService videoProcessService;

    @BeforeEach
    void setUp() {
        videoProcessService = new VideoProcessService();
    }

    @Test
    @DisplayName("generateFeedback_whenApiKeyMissing_thenThrowException")
    void generateFeedback_whenApiKeyMissing_thenThrowException() {
        ReflectionTestUtils.setField(videoProcessService, "geminiApiKey", "");
        ReflectionTestUtils.setField(videoProcessService, "geminiModel", "gemini-1.5-flash");

        assertThatThrownBy(() -> videoProcessService.generateFeedback("WEBVTT\n\n00:00:00.000 --> 00:00:01.000\n테스트"))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("GOOGLE_GEMINI_API_KEY");
    }

    @Test
    @DisplayName("generateFeedback_whenApiKeyNull_thenThrowException")
    void generateFeedback_whenApiKeyNull_thenThrowException() {
        ReflectionTestUtils.setField(videoProcessService, "geminiApiKey", null);

        assertThatThrownBy(() -> videoProcessService.generateFeedback("WEBVTT\n\n테스트"))
            .isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("GOOGLE_GEMINI_API_KEY");
    }
}
