package org.junotb.api.schedule.web;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 강사용 Google Meet 링크 입력 DTO.
 *
 * @param meetLink Google Meet URL (필수, 최대 2048자)
 */
public record ScheduleMeetLinkRequest(
    @NotBlank(message = "Meet 링크는 필수입니다.")
    @Size(max = 2048)
    String meetLink
) {}
