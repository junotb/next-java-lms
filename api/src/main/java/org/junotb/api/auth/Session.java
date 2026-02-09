package org.junotb.api.auth;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

/**
 * Better-Auth 세션 엔티티
 * ERD의 실제 테이블 구조와 일치하도록 정의되었습니다.
 * Better-Auth가 생성한 세션을 백엔드에서 직접 사용합니다.
 */
@Entity
@Table(name = "\"session\"")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class Session {
    @Id
    @Column(name = "\"id\"", nullable = false, unique = true)
    private String id;

    @Column(name = "\"token\"", nullable = false, unique = true)
    private String token;

    @Column(name = "\"userId\"", nullable = false)
    private String userId;

    @Column(name = "\"expiresAt\"", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "\"createdAt\"", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "\"updatedAt\"", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "\"ipAddress\"")
    private String ipAddress;

    @Column(name = "\"userAgent\"")
    private String userAgent;

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        if (this.updatedAt == null) {
            this.updatedAt = now;
        }
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    /**
     * 세션이 만료되었는지 확인합니다.
     * 
     * @return 만료 여부
     */
    public boolean isExpired() {
        return OffsetDateTime.now().isAfter(this.expiresAt);
    }
}
