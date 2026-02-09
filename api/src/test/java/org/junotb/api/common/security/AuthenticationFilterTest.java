package org.junotb.api.common.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junotb.api.auth.Session;
import org.junotb.api.auth.SessionRepository;
import org.junotb.api.user.User;
import org.junotb.api.user.UserRepository;
import org.junotb.api.user.UserRole;
import org.junotb.api.user.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

/**
 * AuthenticationFilter 단위 테스트
 * 쿠키 기반 인증 및 Bearer Token 폴백 기능을 테스트합니다.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthenticationFilter Unit Test")
class AuthenticationFilterTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private jakarta.servlet.FilterChain filterChain;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RedissonClient redissonClient;

    private AuthenticationFilter filter;

    private String validToken;
    private String userId;
    private Session validSession;
    private User validUser;

    @BeforeEach
    void setUp() {
        filter = new AuthenticationFilter(sessionRepository, userRepository, redissonClient);
        
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
    @DisplayName("쿠키에서 세션 토큰 추출 성공 - 서명 포함된 쿠키 값")
    void doFilterInternal_whenCookieWithSignature_thenExtractToken() throws Exception {
        // given
        String cookieValue = validToken + ".signature123";
        Cookie cookie = new Cookie("better-auth.session_token", cookieValue);
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null); // 캐시 미스
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(validSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        verify(sessionRepository).findByToken(validToken);
        verify(userRepository).findById(userId);
        verify(filterChain).doFilter(request, response);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        assertThat(authentication.getName()).isEqualTo(userId);
        assertThat(authentication.getAuthorities()).hasSize(1);
        assertThat(authentication.getAuthorities().iterator().next().getAuthority()).isEqualTo("ROLE_STUDENT");
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("쿠키에서 세션 토큰 추출 성공 - 서명 없는 쿠키 값")
    void doFilterInternal_whenCookieWithoutSignature_thenExtractToken() throws Exception {
        // given
        Cookie cookie = new Cookie("better-auth.session_token", validToken);
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(validSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        verify(sessionRepository).findByToken(validToken);
        verify(userRepository).findById(userId);
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Bearer Token 폴백 동작 확인 - 쿠키 없을 때")
    void doFilterInternal_whenNoCookie_thenUseBearerToken() throws Exception {
        // given
        when(request.getCookies()).thenReturn(null);
        when(request.getHeader("Authorization")).thenReturn("Bearer " + validToken);
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(validSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        verify(sessionRepository).findByToken(validToken);
        verify(userRepository).findById(userId);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("쿠키 우선순위 확인 - 쿠키와 Bearer Token 모두 있을 때 쿠키 사용")
    void doFilterInternal_whenBothCookieAndBearerToken_thenPreferCookie() throws Exception {
        // given
        String cookieToken = "cookie-token";
        String bearerToken = "bearer-token";
        
        Cookie cookie = new Cookie("better-auth.session_token", cookieToken + ".signature");
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        lenient().when(request.getHeader("Authorization")).thenReturn("Bearer " + bearerToken);
        
        Session cookieSession = Session.builder()
            .id(UUID.randomUUID().toString())
            .token(cookieToken)
            .userId(userId)
            .expiresAt(OffsetDateTime.now().plusDays(7))
            .createdAt(OffsetDateTime.now())
            .updatedAt(OffsetDateTime.now())
            .build();
        
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(cookieToken)).thenReturn(Optional.of(cookieSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        verify(sessionRepository).findByToken(cookieToken); // 쿠키 토큰 사용
        verify(sessionRepository, never()).findByToken(bearerToken); // Bearer Token 미사용
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("인증 실패 - 쿠키와 Bearer Token 모두 없음")
    void doFilterInternal_whenNoAuth_thenNoAuthentication() throws Exception {
        // given
        when(request.getCookies()).thenReturn(null);
        when(request.getHeader("Authorization")).thenReturn(null);

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        verify(sessionRepository, never()).findByToken(anyString());
        verify(userRepository, never()).findById(anyString());
        verify(filterChain).doFilter(request, response);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNull();
    }

    @Test
    @DisplayName("인증 실패 - 만료된 세션")
    void doFilterInternal_whenExpiredSession_thenNoAuthentication() throws Exception {
        // given
        Cookie cookie = new Cookie("better-auth.session_token", validToken + ".signature");
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        
        Session expiredSession = Session.builder()
            .id(UUID.randomUUID().toString())
            .token(validToken)
            .userId(userId)
            .expiresAt(OffsetDateTime.now().minusDays(1)) // 만료된 세션
            .createdAt(OffsetDateTime.now().minusDays(8))
            .updatedAt(OffsetDateTime.now().minusDays(8))
            .build();
        
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(expiredSession));

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        verify(sessionRepository).findByToken(validToken);
        verify(userRepository, never()).findById(anyString()); // 만료된 세션이므로 사용자 조회 안 함
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNull();
    }

    @Test
    @DisplayName("인증 실패 - 세션은 있지만 사용자가 없음")
    void doFilterInternal_whenSessionExistsButUserNotFound_thenNoAuthentication() throws Exception {
        // given
        Cookie cookie = new Cookie("better-auth.session_token", validToken + ".signature");
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(validSession));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        verify(sessionRepository).findByToken(validToken);
        verify(userRepository).findById(userId);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNull();
    }

    @Test
    @DisplayName("Redis 캐시 히트 확인")
    void doFilterInternal_whenCacheHit_thenUseCache() throws Exception {
        // given
        Cookie cookie = new Cookie("better-auth.session_token", validToken + ".signature");
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(validSession); // 캐시 히트
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        verify(bucket).get();
        verify(sessionRepository, never()).findByToken(anyString()); // DB 조회 안 함
        verify(userRepository).findById(userId);
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("다른 쿠키는 무시하고 better-auth.session_token만 사용")
    void doFilterInternal_whenMultipleCookies_thenUseOnlySessionTokenCookie() throws Exception {
        // given
        Cookie sessionCookie = new Cookie("better-auth.session_token", validToken + ".signature");
        Cookie otherCookie = new Cookie("other-cookie", "other-value");
        when(request.getCookies()).thenReturn(new Cookie[]{otherCookie, sessionCookie});
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(validSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(validUser));

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        verify(sessionRepository).findByToken(validToken);
        verify(userRepository).findById(userId);
        
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("빈 쿠키 값 처리")
    void doFilterInternal_whenEmptyCookieValue_thenNoAuthentication() throws Exception {
        // given
        Cookie cookie = new Cookie("better-auth.session_token", "");
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        verify(sessionRepository, never()).findByToken(anyString());
        verify(userRepository, never()).findById(anyString());
    }

    @Test
    @DisplayName("사용자 역할 확인 - TEACHER")
    void doFilterInternal_whenTeacherRole_thenSetCorrectAuthority() throws Exception {
        // given
        User teacher = User.builder()
            .id(userId)
            .name("Teacher")
            .email("teacher@test.com")
            .emailVerified(true)
            .image("")
            .role(UserRole.TEACHER)
            .status(UserStatus.ACTIVE)
            .build();
        
        Cookie cookie = new Cookie("better-auth.session_token", validToken + ".signature");
        when(request.getCookies()).thenReturn(new Cookie[]{cookie});
        @SuppressWarnings("unchecked")
        RBucket<Session> bucket = mock(RBucket.class);
        when(redissonClient.getBucket(anyString())).thenAnswer(invocation -> bucket);
        when(bucket.get()).thenReturn(null);
        when(sessionRepository.findByToken(validToken)).thenReturn(Optional.of(validSession));
        when(userRepository.findById(userId)).thenReturn(Optional.of(teacher));

        // when
        filter.doFilterInternal(request, response, filterChain);

        // then
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        assertThat(authentication.getAuthorities()).hasSize(1);
        assertThat(authentication.getAuthorities().iterator().next().getAuthority()).isEqualTo("ROLE_TEACHER");
        
        SecurityContextHolder.clearContext();
    }
}
