package org.junotb.api.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junotb.api.auth.dto.SessionRefreshResponse;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 세션 관리 컨트롤러
 * 세션 갱신 등의 기능을 제공합니다.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Auth", description = "인증 관련 API")
public class SessionController {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String SESSION_CACHE_PREFIX = "session:";
    
    private final SessionRepository sessionRepository;
    private final RedissonClient redissonClient;
    
    @Value("${app.session.expires-in-days:7}")
    private int sessionExpiresInDays;
    
    @Value("${app.session.cache-ttl-seconds:300}")
    private long sessionCacheTtlSeconds;

    /**
     * 세션을 갱신합니다.
     * 만료 시간을 연장하고 Redis 캐시도 업데이트합니다.
     * 
     * @param authHeader Authorization 헤더
     * @param userId 인증된 사용자 ID
     * @return 갱신된 세션 정보
     */
    @PostMapping("/refresh")
    @Operation(summary = "세션 갱신", description = "세션 만료 시간을 연장합니다.")
    public ResponseEntity<SessionRefreshResponse> refreshSession(
        @RequestHeader(AUTHORIZATION_HEADER) String authHeader,
        @AuthenticationPrincipal String userId
    ) {
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            return ResponseEntity.badRequest().build();
        }
        
        String token = authHeader.substring(BEARER_PREFIX.length());
        
        return sessionRepository.findByToken(token)
            .filter(session -> session.getUserId().equals(userId))
            .filter(session -> !session.isExpired())
            .map(session -> {
                // 만료 시간 연장 (현재 시간 기준으로 설정된 일수만큼)
                OffsetDateTime newExpiresAt = OffsetDateTime.now().plusDays(sessionExpiresInDays);
                session.setExpiresAt(newExpiresAt);
                Session updatedSession = sessionRepository.save(session);
                
                // Redis 캐시 업데이트
                updateSessionCache(token, updatedSession);
                
                log.debug("세션 갱신 완료: userId={}, expiresAt={}", userId, newExpiresAt);
                
                return ResponseEntity.ok(new SessionRefreshResponse(
                    updatedSession.getToken(),
                    updatedSession.getExpiresAt()
                ));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Redis 캐시의 세션을 업데이트합니다.
     * 
     * @param token 세션 토큰
     * @param session 세션 객체
     */
    private void updateSessionCache(String token, Session session) {
        try {
            RBucket<Session> bucket = redissonClient.getBucket(SESSION_CACHE_PREFIX + token);
            bucket.set(session, sessionCacheTtlSeconds, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("Redis 캐시 업데이트 중 오류 발생: {}", e.getMessage());
        }
    }
}
