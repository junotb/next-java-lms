package org.junotb.api.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, String> {
    Optional<Session> findByToken(String token);
    
    /**
     * 만료 시간 이전의 세션들을 삭제합니다.
     * 
     * @param now 현재 시간
     * @return 삭제된 세션 개수
     */
    @Modifying
    @Query("DELETE FROM Session s WHERE s.expiresAt < :now")
    long deleteByExpiresAtBefore(@Param("now") OffsetDateTime now);
}
