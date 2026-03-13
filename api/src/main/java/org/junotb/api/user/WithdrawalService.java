package org.junotb.api.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junotb.api.common.exception.ResourceNotFoundException;
import org.junotb.api.schedule.ScheduleRepository;
import org.junotb.api.schedulefeedback.ScheduleFeedbackRepository;
import org.junotb.api.auth.SessionRepository;
import org.junotb.api.registration.RegistrationRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 회원 탈퇴 서비스.
 * 사용자와 연관된 모든 데이터(스케줄, 수강 등록, 피드백, 가용 시간, 휴무, 세션, 계정)를 삭제합니다.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class WithdrawalService {

    private final UserRepository userRepository;
    private final ScheduleFeedbackRepository scheduleFeedbackRepository;
    private final RegistrationRepository registrationRepository;
    private final ScheduleRepository scheduleRepository;
    private final TeacherTimeOffRepository teacherTimeOffRepository;
    private final TeacherAvailabilityRepository teacherAvailabilityRepository;
    private final SessionRepository sessionRepository;
    private final JdbcTemplate jdbcTemplate;

    /**
     * 회원 탈퇴 처리. FK 제약 순서에 맞춰 연관 데이터를 모두 삭제합니다.
     *
     * @param userId 탈퇴할 사용자 ID (인증된 본인)
     * @throws ResourceNotFoundException 사용자 미존재 시
     */
    public void withdraw(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", userId);
        }

        log.info("회원 탈퇴 시작: userId={}", userId);

        // 1. 수업 피드백 (스케줄 소유 시)
        int feedbackDeleted = scheduleFeedbackRepository.deleteBySchedule_UserId(userId);
        log.debug("schedule_feedback 삭제: {}건", feedbackDeleted);

        // 2. 수강 등록 (학생으로 등록한 것 + 강사 스케줄에 등록된 것)
        int regByStudent = registrationRepository.deleteByStudentId(userId);
        int regBySchedule = registrationRepository.deleteBySchedule_UserId(userId);
        log.debug("registration 삭제: student={}, schedule={}", regByStudent, regBySchedule);

        // 3. 스케줄 (강사 소유)
        int scheduleDeleted = scheduleRepository.deleteByUserId(userId);
        log.debug("schedule 삭제: {}건", scheduleDeleted);

        // 4. 강사 휴무
        int timeOffDeleted = teacherTimeOffRepository.deleteByTeacherId(userId);
        log.debug("teacher_time_off 삭제: {}건", timeOffDeleted);

        // 5. 강사 가용 시간
        teacherAvailabilityRepository.deleteByTeacher(userRepository.getReferenceById(userId));

        // 6. 세션 (Better-Auth + Backend 공통 테이블)
        int sessionDeleted = sessionRepository.deleteByUserId(userId);
        log.debug("session 삭제: {}건", sessionDeleted);

        // 7. 계정 (Better-Auth, password 등 - entity 없음)
        int accountDeleted = jdbcTemplate.update("DELETE FROM account WHERE \"userId\" = ?", userId);
        log.debug("account 삭제: {}건", accountDeleted);

        // 8. 사용자
        userRepository.deleteById(userId);
        log.info("회원 탈퇴 완료: userId={}", userId);
    }
}
