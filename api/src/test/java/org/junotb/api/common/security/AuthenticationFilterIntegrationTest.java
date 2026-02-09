package org.junotb.api.common.security;

import jakarta.servlet.http.Cookie;
import org.junotb.api.auth.Session;
import org.junotb.api.auth.SessionRepository;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;

import static org.mockito.Mockito.mock;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * AuthenticationFilter 통합 테스트
 * 실제 API 엔드포인트와 함께 인증 필터의 동작을 테스트합니다.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("AuthenticationFilter Integration Test")
class AuthenticationFilterIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SessionRepository sessionRepository;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private RedissonClient redissonClient;

    private String validToken;
    private String userId;
    private Session validSession;
    private User validUser;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        
        validToken = "valid-session-token";
        userId = UUID.randomUUID().toString();
        
        validSession = Session.builder()
            .id(UUID.randomUUID().toString())
            .token(validToken)
            .userId(userId)
            .expiresAt(OffsetDateTime.now().plusDays(7))
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();
        
        validUser = User.builder()
            .id(userId)
            .name("Test User")
            .email("test@test.com")
            .emailVerified(true)
            .image("")
            .role(UserRole.STUDENT)
            .status(UserStatus.ACTIVE)
            .build();
    }

    @Test
    @DisplayName("쿠키 기반 인증으로 API 호출 성공")
    void apiCall_withCookieAuth_thenSuccess() throws Exception {
        // given
        Cookie cookie = new Cookie("better-auth.session_token", validToken + ".signature");
        
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null); // 캐시 미스
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(validSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));
        
        Page<User> userPage = new PageImpl<>(List.of(validUser), PageRequest.of(0, 10), 1);
        when(userRepository.findAll(any(Specification.class), any(org.springframework.data.domain.Pageable.class)))
            .thenReturn(userPage);

        // when & then
        mockMvc.perform(get("/api/v1/user")
                .cookie(cookie))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.items").exists());

        verify(sessionRepository).findByToken(validToken);
        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("Bearer Token 폴백 동작 확인")
    void apiCall_withBearerToken_thenSuccess() throws Exception {
        // given
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(validSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));
        
        Page<User> userPage = new PageImpl<>(List.of(validUser), PageRequest.of(0, 10), 1);
        when(userRepository.findAll(any(Specification.class), any(org.springframework.data.domain.Pageable.class)))
            .thenReturn(userPage);

        // when & then
        mockMvc.perform(get("/api/v1/user")
                .header("Authorization", "Bearer " + validToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.items").exists());

        verify(sessionRepository).findByToken(validToken);
        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("쿠키 없이 API 호출 시 401 응답")
    void apiCall_withoutAuth_thenReturn401() throws Exception {
        // given - 인증 정보 없음

        // when & then
        mockMvc.perform(get("/api/v1/user"))
            .andExpect(status().isForbidden());

        verify(sessionRepository, never()).findByToken(anyString());
        verify(userRepository, never()).findById(anyString());
    }

    @Test
    @DisplayName("만료된 세션으로 API 호출 시 401 응답")
    void apiCall_withExpiredSession_thenReturn401() throws Exception {
        // given
        Session expiredSession = Session.builder()
            .id(UUID.randomUUID().toString())
            .token(validToken)
            .userId(userId)
            .expiresAt(OffsetDateTime.now().minusDays(1)) // 만료된 세션
            .createdAt(OffsetDateTime.now().minusDays(8))
            .updatedAt(OffsetDateTime.now().minusDays(8))
            .build();
        
        Cookie cookie = new Cookie("better-auth.session_token", validToken + ".signature");
        
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(expiredSession));

        // when & then
        mockMvc.perform(get("/api/v1/user")
                .cookie(cookie))
            .andExpect(status().isForbidden());

        verify(sessionRepository).findByToken(validToken);
        verify(userRepository, never()).findById(anyString()); // 만료된 세션이므로 사용자 조회 안 함
    }

    @Test
    @DisplayName("쿠키 우선순위 확인 - 쿠키와 Bearer Token 모두 있을 때 쿠키 사용")
    void apiCall_withBothCookieAndBearerToken_thenPreferCookie() throws Exception {
        // given
        String cookieToken = "cookie-token";
        String bearerToken = "bearer-token";
        
        Session cookieSession = Session.builder()
            .id(UUID.randomUUID().toString())
            .token(cookieToken)
            .userId(userId)
            .expiresAt(OffsetDateTime.now().plusDays(7))
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();
        
        Cookie cookie = new Cookie("better-auth.session_token", cookieToken + ".signature");
        
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(cookieToken)).thenReturn(Optional.of(cookieSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));
        
        Page<User> userPage = new PageImpl<>(List.of(validUser), PageRequest.of(0, 10), 1);
        when(userRepository.findAll(any(Specification.class), any(org.springframework.data.domain.Pageable.class)))
            .thenReturn(userPage);

        // when & then
        mockMvc.perform(get("/api/v1/user")
                .cookie(cookie)
                .header("Authorization", "Bearer " + bearerToken))
            .andExpect(status().isOk());

        verify(sessionRepository).findByToken(cookieToken); // 쿠키 토큰 사용
        verify(sessionRepository, never()).findByToken(bearerToken); // Bearer Token 미사용
    }

    @Test
    @DisplayName("Redis 캐시 히트 시 DB 조회 없음")
    void apiCall_withCacheHit_thenNoDbQuery() throws Exception {
        // given
        Cookie cookie = new Cookie("better-auth.session_token", validToken + ".signature");
        
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(validSession); // 캐시 히트
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));
        
        Page<User> userPage = new PageImpl<>(List.of(validUser), PageRequest.of(0, 10), 1);
        when(userRepository.findAll(any(Specification.class), any(org.springframework.data.domain.Pageable.class)))
            .thenReturn(userPage);

        // when & then
        mockMvc.perform(get("/api/v1/user")
                .cookie(cookie))
            .andExpect(status().isOk());

        verify(bucket).get();
        verify(sessionRepository, never()).findByToken(anyString()); // DB 조회 안 함
        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("잘못된 토큰으로 API 호출 시 401 응답")
    void apiCall_withInvalidToken_thenReturn401() throws Exception {
        // given
        String invalidToken = "invalid-token";
        Cookie cookie = new Cookie("better-auth.session_token", invalidToken + ".signature");
        
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(invalidToken)).thenReturn(Optional.empty());

        // when & then
        mockMvc.perform(get("/api/v1/user")
                .cookie(cookie))
            .andExpect(status().isForbidden());

        verify(sessionRepository).findByToken(invalidToken);
        verify(userRepository, never()).findById(anyString());
    }

    @Test
    @DisplayName("세션은 있지만 사용자가 없을 때 401 응답")
    void apiCall_whenSessionExistsButUserNotFound_thenReturn401() throws Exception {
        // given
        Cookie cookie = new Cookie("better-auth.session_token", validToken + ".signature");
        
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(validSession));
        when(userRepository.findById(userId)).thenReturn(Optional.empty()); // 사용자 없음

        // when & then
        mockMvc.perform(get("/api/v1/user")
                .cookie(cookie))
            .andExpect(status().isForbidden());

        verify(sessionRepository).findByToken(validToken);
        verify(userRepository).findById(userId);
    }
}
