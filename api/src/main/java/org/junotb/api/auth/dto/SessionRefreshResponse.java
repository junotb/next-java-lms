package org.junotb.api.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;

/**
 * 세션 갱신 응답 DTO
 */
@Getter
@AllArgsConstructor
public class SessionRefreshResponse {
    private String token;
    private OffsetDateTime expiresAt;
}
