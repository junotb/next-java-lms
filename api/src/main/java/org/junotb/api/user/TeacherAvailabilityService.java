package org.junotb.api.user;

import lombok.RequiredArgsConstructor;
import org.junotb.api.common.exception.ResourceNotFoundException;
import org.junotb.api.user.web.TeacherAvailabilityRequest;
import org.junotb.api.user.web.TeacherAvailabilityResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TeacherAvailabilityService {
    private final TeacherAvailabilityRepository teacherAvailabilityRepository;
    private final UserRepository userRepository;

    /**
     * 강사의 가용 시간 설정을 업데이트합니다.
     * 기존 데이터를 전량 삭제한 후 신규 데이터를 삽입하는 방식(Replace All)을 사용합니다.
     *
     * @param teacherId 강사 ID
     * @param requests 가용 시간 설정 요청 목록
     * @return 업데이트된 가용 시간 설정 목록
     */
    @Transactional
    public List<TeacherAvailabilityResponse> updateAvailability(
            String teacherId,
            List<TeacherAvailabilityRequest> requests
    ) {
        // 강사(사용자) 존재 여부 확인
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("User", teacherId));

        // 기존 가용 시간 설정 전량 삭제
        teacherAvailabilityRepository.deleteByTeacher(teacher);

        // enabled가 true인 요청만 필터링하여 엔티티 생성
        List<TeacherAvailability> newAvailabilities = requests.stream()
                .filter(TeacherAvailabilityRequest::enabled)
                .map(request -> TeacherAvailability.create(
                        teacher,
                        request.dayOfWeek(),
                        request.startTime(),
                        request.endTime()
                ))
                .toList();

        // 신규 데이터 저장
        List<TeacherAvailability> saved = teacherAvailabilityRepository.saveAll(newAvailabilities);

        // DTO로 변환하여 반환
        return saved.stream()
                .map(TeacherAvailabilityResponse::from)
                .toList();
    }

    /**
     * 강사의 가용 시간 설정을 조회합니다.
     *
     * @param teacherId 강사 ID
     * @return 가용 시간 설정 목록 (요일 순서로 정렬)
     */
    public List<TeacherAvailabilityResponse> getAvailability(String teacherId) {
        List<TeacherAvailability> availabilities = teacherAvailabilityRepository
                .findByTeacher_IdOrderByDayOfWeek(teacherId);

        return availabilities.stream()
                .map(TeacherAvailabilityResponse::from)
                .toList();
    }
}
