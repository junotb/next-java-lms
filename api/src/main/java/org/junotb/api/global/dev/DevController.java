package org.junotb.api.global.dev;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.junotb.api.auth.Session;
import org.junotb.api.auth.SessionRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/dev")
@RequiredArgsConstructor
@Profile({"local", "test"})
@Tag(name = "Dev Tools", description = "개발자 전용 유틸리티 (로컬/테스트 환경에서만 사용 가능)")
public class DevController {

    private final SessionRepository sessionRepository;

    @GetMapping("/token")
    @Operation(summary = "개발용 토큰 생성", description = "지정된 userId로 유효기간이 긴(1년) 세션 토큰을 생성합니다.")
    public ResponseEntity<Map<String, String>> generateToken(@RequestParam String userId) {
        String token = UUID.randomUUID().toString();
        OffsetDateTime expiresAt = OffsetDateTime.now().plusYears(1);

        Session session = Session.builder()
            .token(token)
            .userId(userId)
            .expiresAt(expiresAt)
            .build();

        sessionRepository.save(session);

        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/ping")
    @Operation(summary = "핑 테스트", description = "서버 응답 확인용 엔드포인트")
    public ResponseEntity<Map<String, String>> ping() {
        return ResponseEntity.ok(Map.of("message", "pong"));
    }
}
