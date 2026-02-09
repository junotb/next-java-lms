package org.junotb.api.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junotb.api.auth.Session;
import org.junotb.api.auth.SessionRepository;
import org.junotb.api.user.UserRepository;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

/**
 * 인증 필터
 * 쿠키 또는 Bearer Token을 추출하여 세션을 검증하고, 사용자 역할 정보를 포함한 Authentication 객체를 생성합니다.
 * 쿠키를 우선적으로 확인하고, 없으면 Bearer Token을 확인합니다 (하위 호환성).
 * Redis 캐싱을 사용하여 DB 부하를 감소시킵니다.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String SESSION_CACHE_PREFIX = "session:";
    private static final String BETTER_AUTH_SESSION_TOKEN_COOKIE = "better-auth.session_token";
    
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final RedissonClient redissonClient;
    
    @Value("${app.session.cache-ttl-seconds:300}")
    private long sessionCacheTtlSeconds;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            // 쿠키 또는 Bearer Token에서 세션 토큰 추출
            Optional<String> tokenOpt = extractSessionToken(request);

            if (tokenOpt.isPresent()) {
                String token = tokenOpt.get();

                // Redis에서 먼저 조회
                Optional<Session> session = getSessionFromCache(token)
                    .or(() -> {
                        // 캐시 미스 시 DB 조회
                        Optional<Session> dbSession = sessionRepository.findByToken(token)
                            .filter(s -> !s.isExpired());
                        
                        // DB에서 조회한 세션을 캐시에 저장
                        dbSession.ifPresent(s -> cacheSession(token, s));
                        return dbSession;
                    });

                session.flatMap(s -> userRepository.findById(s.getUserId()))
                    .ifPresent(user -> {
                        // 사용자 역할을 기반으로 권한 생성
                        String role = "ROLE_" + user.getRole().name();
                        Authentication authentication = new UsernamePasswordAuthenticationToken(
                            user.getId(),
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority(role))
                        );
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        
                        // 인증 소스 확인 (쿠키 또는 Bearer Token)
                        String authSource = extractSessionTokenFromCookies(request).isPresent() ? "cookie" : "bearer";
                        log.debug("인증 성공: userId={}, role={}, source={}", user.getId(), role, authSource);
                    });
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("AuthenticationFilter 처리 중 오류 발생: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * 쿠키에서 Better-Auth 세션 토큰을 추출합니다.
     * 
     * @param request HTTP 요청
     * @return 세션 토큰 (없으면 empty)
     */
    private Optional<String> extractSessionTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }
        
        return Arrays.stream(cookies)
            .filter(cookie -> BETTER_AUTH_SESSION_TOKEN_COOKIE.equals(cookie.getName()))
            .map(cookie -> {
                try {
                    // 쿠키 값에서 토큰 추출 (서명 제거)
                    // better-auth.session_token 형식: "token.signature"
                    // 토큰만 추출 (점 이전 부분)
                    // 서블릿 컨테이너가 자동으로 URL 디코딩하지만, 명시적으로 처리
                    String cookieValue = cookie.getValue();
                    if (cookieValue == null || cookieValue.isEmpty()) {
                        return null;
                    }
                    
                    // URL 디코딩 (서블릿 컨테이너가 자동으로 처리하지만, 혹시 모를 경우를 대비)
                    // 실제로는 서블릿 컨테이너가 이미 디코딩했을 가능성이 높음
                    int dotIndex = cookieValue.indexOf('.');
                    return dotIndex > 0 ? cookieValue.substring(0, dotIndex) : cookieValue;
                } catch (Exception e) {
                    log.warn("쿠키 값 파싱 중 오류 발생: cookie={}, error={}", cookie.getName(), e.getMessage());
                    return null;
                }
            })
            .filter(token -> token != null && !token.isEmpty())
            .findFirst();
    }
    
    /**
     * Bearer Token 또는 쿠키에서 세션 토큰을 추출합니다.
     * 쿠키를 우선적으로 확인하고, 없으면 Bearer Token을 확인합니다.
     * 
     * @param request HTTP 요청
     * @return 세션 토큰 (없으면 empty)
     */
    private Optional<String> extractSessionToken(HttpServletRequest request) {
        // 1. 쿠키에서 먼저 확인 (우선순위)
        Optional<String> cookieToken = extractSessionTokenFromCookies(request);
        if (cookieToken.isPresent()) {
            return cookieToken;
        }
        
        // 2. Bearer Token 확인 (하위 호환성)
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(authHeader) && authHeader.startsWith(BEARER_PREFIX)) {
            return Optional.of(authHeader.substring(BEARER_PREFIX.length()));
        }
        
        return Optional.empty();
    }
    
    /**
     * Redis에서 세션을 조회합니다.
     * 
     * @param token 세션 토큰
     * @return 세션 (캐시에 없으면 empty)
     */
    private Optional<Session> getSessionFromCache(String token) {
        try {
            RBucket<Session> bucket = redissonClient.getBucket(SESSION_CACHE_PREFIX + token);
            Session session = bucket.get();
            
            if (session != null && !session.isExpired()) {
                return Optional.of(session);
            }
            
            // 만료된 세션이면 캐시에서 제거
            if (session != null) {
                bucket.delete();
            }
            
            return Optional.empty();
        } catch (Exception e) {
            log.warn("Redis 캐시 조회 중 오류 발생: {}", e.getMessage());
            return Optional.empty();
        }
    }
    
    /**
     * 세션을 Redis에 캐싱합니다.
     * 
     * @param token 세션 토큰
     * @param session 세션 객체
     */
    private void cacheSession(String token, Session session) {
        try {
            RBucket<Session> bucket = redissonClient.getBucket(SESSION_CACHE_PREFIX + token);
            bucket.set(session, sessionCacheTtlSeconds, TimeUnit.SECONDS);
        } catch (Exception e) {
            log.warn("Redis 캐시 저장 중 오류 발생: {}", e.getMessage());
        }
    }
}
