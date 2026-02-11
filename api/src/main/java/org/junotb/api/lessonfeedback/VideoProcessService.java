package org.junotb.api.lessonfeedback;

import com.google.cloud.speech.v1.LongRunningRecognizeResponse;
import com.google.cloud.speech.v1.RecognitionAudio;
import com.google.cloud.speech.v1.RecognitionConfig;
import com.google.cloud.speech.v1.SpeakerDiarizationConfig;
import com.google.cloud.speech.v1.SpeechClient;
import com.google.cloud.speech.v1.SpeechRecognitionAlternative;
import com.google.cloud.speech.v1.SpeechRecognitionResult;
import com.google.cloud.speech.v1.WordInfo;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * 비디오 → VTT 추출, VTT → Gemini 피드백 생성.
 * FFmpeg, GCP Speech-to-Text, Gemini API 사용.
 */
@Service
@Slf4j
public class VideoProcessService {

    @Value("${app.video.ffmpeg-path:ffmpeg}")
    private String ffmpegPath;

    @Value("${app.gemini.api-key:${GOOGLE_GEMINI_API_KEY:}}")
    private String geminiApiKey;

    @Value("${app.gemini.model:gemini-2.5-flash}")
    private String geminiModel;

    private static final String PROMPT_RESOURCE_PATH = "prompts/feedback.txt";

    /**
     * 비디오에서 VTT 문자열 추출. FFmpeg → GCP Speech-to-Text.
     */
    public String extractVtt(String videoFilePath) throws IOException {
        Path videoPath = Path.of(videoFilePath);
        Path tempDir = videoPath.getParent();
        Path audioPath = tempDir.resolve("audio-" + System.currentTimeMillis() + ".flac");

        try {
            extractAudio(videoPath, audioPath);
            return transcribeToVtt(audioPath);
        } finally {
            Files.deleteIfExists(audioPath);
        }
    }

    /**
     * VTT 내용으로 Gemini 피드백 생성.
     */
    public String generateFeedback(String vttContent) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            throw new IllegalStateException("GOOGLE_GEMINI_API_KEY 또는 app.gemini.api-key가 필요합니다.");
        }

        String promptTemplate = loadPromptTemplate();
        String prompt = promptTemplate.replace("{{vttContent}}", vttContent);

        Client client = Client.builder().apiKey(geminiApiKey).build();
        GenerateContentResponse response = client.models.generateContent(geminiModel, prompt, null);
        String text = response.text();
        return text != null && !text.isBlank() ? text : "(피드백 생성 실패)";
    }

    private void extractAudio(Path videoPath, Path audioPath) throws IOException {
        ProcessBuilder pb = new ProcessBuilder(
            ffmpegPath,
            "-i", videoPath.toAbsolutePath().toString(),
            "-vn", "-acodec", "flac", "-ar", "16000", "-ac", "1",
            audioPath.toAbsolutePath().toString(),
            "-y"
        );
        pb.redirectErrorStream(true);
        Process p = pb.start();
        try {
            if (!p.waitFor(30, java.util.concurrent.TimeUnit.MINUTES)) {
                p.destroyForcibly();
                throw new IOException("FFmpeg 타임아웃");
            }
            if (p.exitValue() != 0) {
                String err = new String(p.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
                throw new IOException("FFmpeg 실패: " + err);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            p.destroyForcibly();
            throw new IOException("FFmpeg 중단", e);
        }
    }

    private String transcribeToVtt(Path audioPath) throws IOException {
        byte[] audioBytes = Files.readAllBytes(audioPath);

        SpeakerDiarizationConfig diarizationConfig = SpeakerDiarizationConfig.newBuilder()
            .setEnableSpeakerDiarization(true)
            .setMinSpeakerCount(1)
            .setMaxSpeakerCount(2)
            .build();

        RecognitionConfig config = RecognitionConfig.newBuilder()
            .setEncoding(RecognitionConfig.AudioEncoding.FLAC)
            .setSampleRateHertz(16000)
            .setLanguageCode("en-US")
            .setEnableWordTimeOffsets(true)
            .setDiarizationConfig(diarizationConfig)
            .build();

        RecognitionAudio audio = RecognitionAudio.newBuilder()
            .setContent(com.google.protobuf.ByteString.copyFrom(audioBytes))
            .build();

        try (SpeechClient speechClient = createSpeechClient()) {
            LongRunningRecognizeResponse response = speechClient
                .longRunningRecognizeAsync(config, audio)
                .get();
            List<SpeechRecognitionResult> results = response.getResultsList();

            if (results.isEmpty()) {
                return "WEBVTT\n\n00:00:00.000 --> 00:00:00.001\n(음성 인식 결과 없음)";
            }

            SpeechRecognitionAlternative lastAlt = results.get(results.size() - 1).getAlternatives(0);
            List<WordInfo> words = lastAlt.getWordsList();
            if (words.isEmpty()) {
                return "WEBVTT\n\n00:00:00.000 --> 00:00:00.001\n(음성 인식 결과 없음)";
            }

            return buildVttWithSpeakers(words);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Speech-to-Text 중단", e);
        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            if (cause instanceof IOException io) {
                throw io;
            }
            throw new IOException("Speech-to-Text 실패", cause != null ? cause : e);
        }
    }

    private String buildVttWithSpeakers(List<WordInfo> words) {
        StringBuilder vtt = new StringBuilder("WEBVTT\n\n");
        int currentSpeaker = words.get(0).getSpeakerTag();
        double segmentStart = toSeconds(words.get(0).getStartTime());
        StringBuilder segmentWords = new StringBuilder().append(words.get(0).getWord());
        double segmentEnd = toSeconds(words.get(0).getEndTime());

        for (int i = 1; i < words.size(); i++) {
            WordInfo word = words.get(i);
            int speaker = word.getSpeakerTag();
            if (speaker == currentSpeaker) {
                segmentWords.append(" ").append(word.getWord());
                segmentEnd = toSeconds(word.getEndTime());
            } else {
                vtt.append(formatVttTime(segmentStart)).append(" --> ").append(formatVttTime(segmentEnd))
                    .append("\n[Speaker ").append(currentSpeaker).append("] ").append(segmentWords)
                    .append("\n\n");
                currentSpeaker = speaker;
                segmentStart = toSeconds(word.getStartTime());
                segmentEnd = toSeconds(word.getEndTime());
                segmentWords = new StringBuilder().append(word.getWord());
            }
        }
        vtt.append(formatVttTime(segmentStart)).append(" --> ").append(formatVttTime(segmentEnd))
            .append("\n[Speaker ").append(currentSpeaker).append("] ").append(segmentWords)
            .append("\n");
        return vtt.toString().trim();
    }

    private static double toSeconds(com.google.protobuf.Duration d) {
        return d.getSeconds() + d.getNanos() / 1_000_000_000.0;
    }

    private SpeechClient createSpeechClient() throws IOException {
        return SpeechClient.create();
    }

    private static String formatVttTime(double seconds) {
        int h = (int) (seconds / 3600);
        int m = (int) ((seconds % 3600) / 60);
        double s = seconds % 60;
        return String.format("%02d:%02d:%06.3f", h, m, s).replace(',', '.');
    }

    private String loadPromptTemplate() {
        String defaultPrompt = "다음 수업 자막을 분석하여 수업 피드백을 작성해주세요.\n\n{{vttContent}}";
        try {
            return new ClassPathResource(PROMPT_RESOURCE_PATH).getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.warn("프롬프트 파일 로드 실패: {}", PROMPT_RESOURCE_PATH, e);
            return defaultPrompt;
        }
    }
}
