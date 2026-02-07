# 역할 수정에 따른 변경 예상 문서

역할 정의 변경에 따라 수정이 예상되는 파일 및 작업을 정리합니다.

---

## 1. 역할 정의 변경 요약

### Course
- **교육 콘텐츠 정의**: 강좌 종류(제목, 소개)를 정의. 단, 교육 콘텐츠는 강사가 별도로 시스템 밖에서 제공.

### Classroom
- **실시간 수업 공간**: Schedule 기준 1:1 화상 수업이 진행되는 **링크**(Google Meet 등 외부 링크)
- **역할별 권한 관리**: 강사가 Google Meet 링크를 입력한 경우 입장 가능
- **강좌 컨텍스트 제공 없음**: 교육 콘텐츠는 강사가 Google Meet 내부에서 자체 제공
- **수업 영상 자막 저장**: 수업 후 강사가 수업 비디오 파일을 업로드. 비디오는 .vtt(WebVTT) 문자열로 변환되어 저장 (가능 여부 §7 참고)

---

## 2. 반영 시 User Flow

### 2.1 관리자 (Admin)

| 기능 | User Flow | 비고 |
|------|-----------|------|
| 강좌 관리 | 1. `/admin/course` 접근 → 2. 목록 조회 → 3. 생성/수정/삭제 | **변경 없음** |
| 스케줄 관리 | 1. `/admin/schedule` 접근 → 2. 목록 조회 → 3. 생성/수정/삭제 | **변경 없음** |
| 사용자 관리 | 1. `/admin/user` 접근 → 2. 목록 조회 → 3. CRUD | **변경 없음** |

---

### 2.2 학생 (Student)

| 기능 | User Flow | 비고 |
|------|-----------|------|
| 수강 신청 | 1. `/study/registration` 접근 → 2. 강좌/기간/요일/시간 선택 → 3. 강사 후보 확인 → 4. 신청 완료 | **변경 없음** |
| 대시보드 | 1. `/study` 접근 → 2. 다음 수업 카드 확인 → 3. "수업 입장" 클릭 | 입장 가능 시각(수업 시작~종료)에만 버튼 활성화 |
| **수업 입장** | 1. "수업 입장" 클릭 → 2. `GET /api/v1/lessons/{scheduleId}/access` 호출 → 3. `allowed=true` & `meetLink` 존재 시 `/classroom/{scheduleId}` 이동 → 4. **"Google Meet 참가" 버튼** 클릭 → 5. **새 탭에서 Google Meet 링크**로 이동 → 6. Google Meet에서 수업 진행 | 수업방은 링크 전달 역할만. 교육 콘텐츠는 Meet 내부 |
| 수업 종료 후 | 수업 종료는 강사만 수행. 학생은 Meet에서 나가기 | **변경 없음** |

---

### 2.3 강사 (Teacher)

| 기능 | User Flow | 비고 |
|------|-----------|------|
| 대시보드 | 1. `/teach` 접근 → 2. 다음 수업 카드 확인 | meet link 미등록 시 "링크 입력" 안내 |
| **Meet 링크 등록** | 1. 다음 수업 카드에서 "Meet 링크 입력" 클릭 → 2. Google Meet URL 입력 (또는 모달/폼) → 3. `PATCH /api/v1/schedule/{id}/meet-link` 호출 → 4. 저장 완료 | **신규** 수업 전 필수 |
| **수업 입장** | 1. "수업 입장" 클릭 → 2. `GET /api/v1/lessons/{scheduleId}/access` (meetLink 존재 여부 검증) → 3. `allowed=true` 시 `/classroom/{scheduleId}` 이동 → 4. "Google Meet 참가" 버튼 → 5. **새 탭에서 Google Meet** 이동 → 6. Meet에서 수업 진행 | meet link 미등록 시 입장 불가 |
| 수업 종료 | 1. 수업방 하단 "수업 종료" 클릭 → 2. 확인 다이얼로그 → 3. `POST /api/v1/lessons/{scheduleId}/finish` → 4. Schedule 상태 ATTENDED로 변경 | **변경 없음** |
| **수업 영상 업로드** | 1. 수업 종료 후 대시보드 또는 과거 수업 목록에서 해당 수업 선택 → 2. "수업 영상 업로드" 클릭 → 3. 비디오 파일 선택 (mp4 등) → 4. 업로드 진행 → 5. `POST /api/v1/lessons/{scheduleId}/video` → 6. 백그라운드: 저장 → 오디오 추출 → STT → VTT 생성 → 7. 완료 알림(토스트 또는 폴링) | **신규** 비동기 처리 |

---

### 2.4 수업방(Classroom) 페이지 흐름

```
/classroom/[scheduleId] 접근
         │
         ▼
GET /api/v1/lessons/{scheduleId}/access
         │
    ┌────┴────┐
    │ allowed? │
    └────┬────┘
         │
    ┌────┴────────────┐
    │ NO              │ YES
    ▼                 ▼
토스트 + router.back()  meetLink 존재?
                              │
                         ┌────┴────┐
                         │ YES     │ NO
                         ▼         ▼
               "Google Meet 참가"  "강사가 링크를 등록할 때까지
                버튼 표시          대기해 주세요" 메시지
                         │
                         ▼
               클릭 시 meetLink 새 탭으로 오픈
                         │
                         ▼
               하단: 남은 시간 | 수업 종료(강사) | 나가기
```

---

### 2.5 전체 타임라인 요약

| 시점 | 학생 | 강사 |
|------|------|------|
| 수업 전 | 대시보드에서 다음 수업 확인 | Meet 링크 등록 (필수) |
| 수업 시간 | 수업 입장 → Classroom → Google Meet 링크 클릭 → Meet에서 수업 | 수업 입장 → Meet에서 수업 진행 |
| 수업 중 | Meet에서 수업 | 수업 종료 버튼 클릭 (출석 처리) |
| 수업 후 | - | 수업 영상 업로드 → VTT 자동 변환 저장 |

---

## 3. Course 관련 수정 예상

### 3.1 문서 / 주석
| 대상 | 수정 내용 |
|------|-----------|
| `api/src/main/java/org/junotb/api/course/Course.java` | 엔티티 JavaDoc: "교육 콘텐츠는 강사가 시스템 밖에서 제공" 명시 |
| `api/src/main/java/org/junotb/api/course/web/CourseCreateRequest.java` | description 필드 주석: "강좌 소개 (실제 교육 콘텐츠는 강사가 별도 제공)" |
| `api/src/main/java/org/junotb/api/course/web/CourseUpdateRequest.java` | 동일 |
| `api/src/main/java/org/junotb/api/course/CourseController.java` | `@Tag` description 보강 |
| `CODE_ANALYSIS_REPORT.md` | Course 역할 정의 갱신 |

### 3.2 구조 변경
- **없음**: Course 엔티티 필드(제목, 소개, 상태)는 유지. 역할 정의만 문구로 명확화.

---

## 4. Classroom 관련 수정 예상

### 4.1 DB / 엔티티
| 대상 | 수정 내용 |
|------|-----------|
| **신규 마이그레이션** | `schedule` 테이블에 `meetLink`(또는 `videoLink`) 컬럼 추가 (nullable VARCHAR) |
| `api/.../schedule/Schedule.java` | `String meetLink` 필드 추가, setter/getter |
| `api/.../schedule/ScheduleService.java` | create/update 시 meetLink 처리 (또는 별도 엔드포인트) |

### 4.2 API
| 대상 | 수정 내용 |
|------|-----------|
| `api/.../lesson/LessonService.java` | `validateAccess()`: 강사 입장 시 `meetLink` 존재 여부 확인. 없으면 `allowed=false` |
| `api/.../lesson/dto/LessonAccessResponse.java` | `CourseResponse course` 제거 또는 optional로 변경. `String meetLink` 추가 |
| `api/.../lesson/LessonService.java` | `buildAccessResponse()`: course 제거, meetLink 포함 |
| **신규** `api/.../schedule/web/ScheduleMeetLinkRequest.java` | 강사용 meet link 입력 DTO |
| `api/.../schedule/ScheduleController.java` | `PATCH /{id}/meet-link` 등 강사 전용 meet link 입력 API 추가 |
| `api/.../schedule/web/ScheduleResponse.java` | `String meetLink` (nullable) 추가 |

### 4.3 Frontend – 스키마 / API 클라이언트
| 대상 | 수정 내용 |
|------|-----------|
| `web/src/schema/lesson/lesson.ts` | `LessonAccessResponseSchema`: `course` 제거, `meetLink: z.string().nullable()` 추가 |
| `web/src/lib/lesson.ts` | `checkLessonAccess` 응답 타입 반영 |

### 4.4 Frontend – 수업방 UI
| 대상 | 수정 내용 |
|------|-----------|
| `web/src/app/classroom/[id]/page.tsx` | `VideoArea` → Google Meet 링크 영역으로 교체. `CourseViewer` 제거 |
| `web/src/component/classroom/VideoArea.tsx` | **삭제** 또는 **MeetLinkArea.tsx**로 대체: "Google Meet 참가" 버튼/링크, `meetLink` 없을 시 "강사가 링크를 등록할 때까지 대기" 메시지 |
| `web/src/component/classroom/CourseViewer.tsx` | **삭제** 또는 사용 중단 |
| `web/src/component/classroom/LessonController.tsx` | 유지 (남은 시간, 수업 종료, 나가기) |

### 4.5 Frontend – 강사 Meet Link 입력 UI
| 대상 | 수정 내용 |
|------|-----------|
| **신규** `web/src/component/teach/MeetLinkForm.tsx` (또는 유사) | 강사가 해당 Schedule의 Google Meet 링크 입력 폼 |
| **신규** `web/src/hook/useMeetLink.ts` | meet link 조회/수정 mutation |
| `web/src/app/teach/page.tsx` | 다음 수업 카드에 "Meet 링크 입력" 버튼 또는 링크 등록 영역 추가 |
| `web/src/component/dashboard/DashboardNextClassCard.tsx` | 강사 카드: meet link 미등록 시 "링크 입력" 안내 또는 모달 진입점 |

### 4.6 Frontend – 입장 흐름
| 대상 | 수정 내용 |
|------|-----------|
| `web/src/component/dashboard/DashboardNextClassCard.tsx` | "수업 입장" 클릭 시: meet link 있으면 새 탭에서 Google Meet 열기 또는 `/classroom/[id]`에서 링크로 이동 |
| `web/src/component/dashboard/DashboardScheduleList.tsx` | 동일한 입장 흐름 적용 |

### 4.7 테스트
| 대상 | 수정 내용 |
|------|-----------|
| `api/.../lesson/LessonService` 단위 테스트 | meet link 기반 입장 검증 로직 테스트 (신규 작성) |
| `api/.../schedule` 테스트 | meet link CRUD 시나리오 추가 |

### 4.8 수업 영상 업로드 및 VTT 저장 (역할 5)
| 대상 | 수정 내용 |
|------|-----------|
| **신규 마이그레이션** | `schedule` 테이블에 `videoUrl`(또는 `videoStorageKey`), `vttContent`(TEXT) 컬럼 추가 |
| `api/.../schedule/Schedule.java` | `String videoUrl`, `String vttContent` 필드 추가 |
| **신규** `api/.../lesson/` 또는 `schedule/` | 비디오 업로드 API: `POST /api/v1/lessons/{scheduleId}/video` (multipart/form-data) |
| **신규** 비디오 처리 서비스 | 1) 파일 저장(S3 등), 2) 오디오 추출(FFmpeg), 3) STT 변환(Whisper/Google/AWS), 4) VTT 포맷 생성 |
| `api/.../schedule/web/ScheduleResponse.java` | `videoUrl`, `vttContent`(또는 별도 조회) 추가 |
| `web/src/component/teach/VideoUploadForm.tsx` | 강사용 비디오 업로드 폼 (수업 종료 후 노출) |
| `web/src/hook/useVideoUpload.ts` | 업로드 mutation (진행률, 완료 시 VTT 저장) |

---

## 5. 수정 파일 목록 요약

### 신규 생성
- DB 마이그레이션: `schedule.meetLink`, `schedule.videoUrl`, `schedule.vttContent` 컬럼
- `ScheduleMeetLinkRequest.java` (또는 ScheduleUpdateRequest 확장)
- `web/src/component/teach/MeetLinkForm.tsx` (또는 유사 컴포넌트)
- `web/src/hook/useMeetLink.ts`
- 비디오 업로드 API 및 VTT 변환 서비스
- `web/src/component/teach/VideoUploadForm.tsx`, `web/src/hook/useVideoUpload.ts`

### 수정
- `Schedule.java`, `ScheduleResponse.java`
- `ScheduleController.java`, `ScheduleService.java`
- `LessonService.java`, `LessonAccessResponse.java`
- `web/src/schema/lesson/lesson.ts`, `web/src/lib/lesson.ts`
- `web/src/app/classroom/[id]/page.tsx`
- `web/src/component/classroom/VideoArea.tsx` (대체 또는 삭제)
- `web/src/component/dashboard/DashboardNextClassCard.tsx`
- `web/src/component/dashboard/DashboardScheduleList.tsx`
- `web/src/app/teach/page.tsx`

### 삭제 또는 미사용
- `web/src/component/classroom/CourseViewer.tsx` (삭제 또는 사용 중단)

---

## 6. 의존성 / 영향 범위

- **Course ↔ Schedule**: Course는 그대로 유지. Schedule에 `meetLink`만 추가.
- **Registration**: 변경 없음.
- **Dashboard 응답**: meet link 존재 여부를 노출할 경우 `DashboardNextClassResponse` 등에 `meetLink` 또는 `hasMeetLink` 추가 검토.

---

## 7. 비디오 → VTT 변환 가능 여부 검토

### 개요
비디오 파일을 **직접** .vtt로 변환하는 것은 불가능합니다. VTT(WebVTT)는 자막/캡션 형식으로, **음성 → 텍스트 + 타임스탬프**가 필요합니다.

### 변환 흐름
```
비디오 파일 → [1. 오디오 추출] → [2. STT 변환] → [3. VTT 포맷 생성] → .vtt 문자열
```

| 단계 | 도구/서비스 | 비고 |
|------|-------------|------|
| 1. 오디오 추출 | FFmpeg | 무료, 서버에 설치 |
| 2. STT (음성→텍스트) | Whisper(OpenAI), Google Speech-to-Text, AWS Transcribe, Azure Speech | API 비용, 정확도·언어 지원 차이 |
| 3. VTT 생성 | 자체 포맷터 또는 라이브러리 | STT API가 타임스탬프를 주면 변환 가능 |

### 구현 옵션
| 옵션 | 장점 | 단점 |
|------|------|------|
| **Whisper API** | 고품질, 다국어, 타임스탬프 제공 | 유료, 호출 제한 |
| **Google Speech-to-Text** | 실시간/배치, VTT/SRT 지원 | GCP 의존, 비용 |
| **FFmpeg + Whisper(로컬)** | 무료, 오프라인 가능 | GPU 필요, 처리 시간 |
| **외부 서비스** (Video Transcriber AI 등) | E2E 처리 | 유료, 데이터 외부 전송 |

### 결론
- **가능**: STT API + 포맷 변환으로 구현 가능.
- **고려사항**: 스토리지(S3 등), 처리 비용, 비동기 처리(업로드 → 백그라운드 변환 → 완료 알림).
