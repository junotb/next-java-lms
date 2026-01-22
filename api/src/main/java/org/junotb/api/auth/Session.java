package org.junotb.api.auth;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "session")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder(toBuilder = true)
public class Session {
    @Id
    @Column(name = "\"token\"", nullable = false, unique = true)
    private String token;

    @Column(name = "\"userId\"", nullable = false)
    private String userId;

    @Column(name = "\"expiresAt\"", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "\"createdAt\"", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
    }

    public boolean isExpired() {
        return OffsetDateTime.now().isAfter(this.expiresAt);
    }
}
