package org.junotb.api.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

/**
 * 만료된 세션을 정리하는 스케줄러
 * 매일 새벽 2시에 실행되어 만료된 세션을 삭제합니다.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SessionCleanupScheduler {

    private final SessionRepository sessionRepository;

    /**
     * 만료된 세션을 정리합니다.
     * 매일 새벽 2시에 실행됩니다.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupExpiredSessions() {
        try {
            OffsetDateTime now = OffsetDateTime.now();
            long deletedCount = sessionRepository.deleteByExpiresAtBefore(now);
            log.info("만료된 세션 {}개 삭제 완료", deletedCount);
        } catch (Exception e) {
            log.error("만료된 세션 정리 중 오류 발생", e);
        }
    }
}
