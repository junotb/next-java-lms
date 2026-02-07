# 코드 분석 리포트

## 1. 기능 명세서 (Reverse Engineered Spec)

### 1.1 시스템 개요
이 시스템은 **1:1 온라인 강의 수강 신청 및 관리 시스템**입니다. 학생이 강좌를 신청하면 조건에 맞는 강사를 자동 매칭하고, 강사와 학생이 수업을 진행할 수 있는 플랫폼입니다.

### 1.2 주요 기능 모듈

#### 1.2.1 코스(Course) 관리
**기능**: 관리자가 강좌를 생성, 수정, 삭제, 조회할 수 있습니다.

**User Flow**:
1. 관리자가 `/admin/course` 페이지 접근
2. 코스 목록 조회 (`GET /api/courses`)
3. 코스 생성/수정/삭제 버튼 클릭
4. 폼 제출 → API 호출 (`POST /api/courses`, `PATCH /api/courses/{id}`, `DELETE /api/courses/{id}`)
5. 상태별 통계 조회 (`GET /api/courses/stats/status`)

**API Contract**:
- `GET /api/courses` - 코스 목록 조회 (페이징, 제목/상태 필터)
- `GET /api/courses/{id}` - 코스 상세 조회
- `POST /api/courses` - 코스 생성
- `PATCH /api/courses/{id}` - 코스 수정
- `DELETE /api/courses/{id}` - 코스 삭제
- `GET /api/courses/stats/status` - 상태별 통계

**Request/Response**:
- `CourseCreateRequest`: `{ title: string, description?: string, status: CourseStatus }`
- `CourseUpdateRequest`: `{ title?: string, description?: string, status?: CourseStatus }`
- `CourseResponse`: `{ id: number, title: string, description: string | null, status: CourseStatus, createdAt: string, updatedAt: string }`

---

#### 1.2.2 수강 신청(Registration) 관리
**기능**: 학생이 강좌를 신청하면 강사를 자동 매칭하고 스케줄을 생성합니다.

**User Flow**:
1. 학생이 `/study/registration` 페이지 접근
2. Step 1: 강좌 선택 및 수강 기간 선택 (courseId, months)
3. Step 2: 요일 선택 (days)
4. Step 3: 시작 시간 및 수업 시간 선택 → 가용 강사 후보 조회 (`GET /api/v1/teachers/candidates`)
5. Step 4: 최종 확인 후 신청 (`POST /api/registrations/course`)
6. 백엔드에서 강사 자동 매칭 및 스케줄 생성
7. Registration 엔티티 생성 및 저장

**API Contract**:
- `POST /api/registrations/course` - 강좌 수강 신청 (자동 매칭)
- `GET /api/v1/teachers/candidates` - 가용 강사 후보 조회

**Request/Response**:
- `CourseRegistrationRequest`: `{ courseId: number, months: number, days: DayOfWeek[], startTime: string, durationMinutes: number }`
- `RegistrationResponse`: `{ id: number, scheduleId: number, studentId: string, status: RegistrationStatus, registeredAt: string }`

**핵심 로직**:
- 동시성 제어: Redis Distributed Lock 사용
- 강사 매칭: 요일, 시작 시간, 수업 시간에 맞는 가용 강사 검색
- 스케줄 자동 생성: 매칭된 강사와 학생의 스케줄 생성

---

#### 1.2.3 스케줄(Schedule) 관리
**기능**: 관리자가 수업 스케줄을 생성, 수정, 삭제, 조회할 수 있습니다.

**User Flow**:
1. 관리자가 `/admin/schedule` 페이지 접근
2. 스케줄 목록 조회 (`GET /api/v1/schedule`)
3. 스케줄 생성/수정/삭제 버튼 클릭
4. 폼 제출 → API 호출 (`POST /api/v1/schedule`, `PATCH /api/v1/schedule/{id}`, `DELETE /api/v1/schedule/{id}`)
5. 상태별 통계 조회 (`GET /api/v1/schedule/stats/status`)

**API Contract**:
- `GET /api/v1/schedule` - 스케줄 목록 조회 (페이징, userId/상태 필터)
- `GET /api/v1/schedule/{id}` - 스케줄 상세 조회
- `POST /api/v1/schedule` - 스케줄 생성
- `PATCH /api/v1/schedule/{id}` - 스케줄 수정
- `DELETE /api/v1/schedule/{id}` - 스케줄 삭제
- `GET /api/v1/schedule/stats/status` - 상태별 통계

**Request/Response**:
- `ScheduleCreateRequest`: `{ userId: string, startsAt: string, endsAt: string, status: ScheduleStatus }`
- `ScheduleResponse`: `{ id: number, userId: string, courseId: number | null, startsAt: string, endsAt: string, status: ScheduleStatus, createdAt: string, updatedAt: string }`

---

#### 1.2.4 사용자(User) 관리
**기능**: 관리자가 사용자를 생성, 수정, 삭제, 조회할 수 있습니다.

**User Flow**:
1. 관리자가 `/admin/user` 페이지 접근
2. 사용자 목록 조회 (`GET /api/v1/user`)
3. 사용자 생성/수정/삭제 버튼 클릭
4. 폼 제출 → API 호출 (`POST /api/v1/user`, `PATCH /api/v1/user/{id}`, `DELETE /api/v1/user/{id}`)
5. 역할별 통계 조회 (`GET /api/v1/user/stats/role`)

**API Contract**:
- `GET /api/v1/user` - 사용자 목록 조회 (페이징, 이름/이메일/역할/상태 필터)
- `GET /api/v1/user/{id}` - 사용자 상세 조회
- `POST /api/v1/user` - 사용자 생성
- `PATCH /api/v1/user/{id}` - 사용자 수정
- `DELETE /api/v1/user/{id}` - 사용자 삭제
- `GET /api/v1/user/stats/role` - 역할별 통계

**Request/Response**:
- `UserCreateRequest`: `{ email: string, password: string, name: string, role: UserRole, status: UserStatus }`
- `UserUpdateRequest`: `{ email: string, name: string, role: UserRole, status: UserStatus }`
- `UserResponse`: `{ id: string, name: string, email: string, emailVerified: boolean, image: string | null, createdAt: string, updatedAt: string, role: UserRole, status: UserStatus }`

---

#### 1.2.5 강사 가용 시간(Teacher Availability) 관리
**기능**: 강사가 자신의 근무 가능 시간을 설정합니다.

**User Flow**:
1. 강사가 `/teach/availability` 페이지 접근
2. 가용 시간 조회 (`GET /api/v1/teachers/me/availability`)
3. 요일별 가용 시간 설정 후 저장 (`PUT /api/v1/teachers/me/availability`)

**API Contract**:
- `GET /api/v1/teachers/me/availability` - 가용 시간 조회
- `PUT /api/v1/teachers/me/availability` - 가용 시간 업데이트

**Request/Response**:
- `TeacherAvailabilityRequest[]`: `[{ dayOfWeek: DayOfWeek, startTime: string, endTime: string, enabled: boolean }]`
- `TeacherAvailabilityResponse[]`: `[{ id: number, dayOfWeek: DayOfWeek, startTime: string, endTime: string }]`

---

#### 1.2.6 강사 휴무(Teacher Time Off) 관리
**기능**: 강사가 자신의 휴무 일정을 등록/삭제합니다.

**User Flow**:
1. 강사가 `/teach/time-off` 페이지 접근
2. 휴무 목록 조회 (`GET /api/v1/teachers/me/time-off`)
3. 휴무 등록 버튼 클릭 → 폼 제출 (`POST /api/v1/teachers/me/time-off`)
4. 휴무 삭제 버튼 클릭 (`DELETE /api/v1/teachers/me/time-off/{id}`)

**API Contract**:
- `GET /api/v1/teachers/me/time-off` - 휴무 목록 조회
- `POST /api/v1/teachers/me/time-off` - 휴무 등록
- `DELETE /api/v1/teachers/me/time-off/{id}` - 휴무 삭제

**Request/Response**:
- `TeacherTimeOffRequest`: `{ startDateTime: string, endDateTime: string, type: TeacherTimeOffType, reason?: string }`
- `TeacherTimeOffResponse`: `{ id: number, startDateTime: string, endDateTime: string, type: TeacherTimeOffType, reason: string | null }`

---

#### 1.2.7 수업방(Lesson) 접근 및 종료
**기능**: 학생/강사가 수업방에 입장하고, 강사가 수업을 종료합니다.

**User Flow**:
1. 사용자가 `/classroom/{id}` 페이지 접근
2. 입장 권한 확인 (`GET /api/v1/lessons/{scheduleId}/access`)
3. 권한이 있으면 수업방 입장
4. 강사가 수업 종료 버튼 클릭 (`POST /api/v1/lessons/{scheduleId}/finish`)

**API Contract**:
- `GET /api/v1/lessons/{scheduleId}/access` - 입장 권한 확인
- `POST /api/v1/lessons/{scheduleId}/finish` - 수업 종료

**Request/Response**:
- `LessonAccessResponse`: `{ allowed: boolean, role: "TEACHER" | "STUDENT" | null, scheduleId: number, courseId?: number | null }`

---

#### 1.2.8 대시보드(Dashboard)
**기능**: 학생/강사가 자신의 대시보드를 조회합니다.

**User Flow**:
1. 학생이 `/study` 페이지 접근 → `GET /api/v1/study/dashboard`
2. 강사가 `/teach` 페이지 접근 → `GET /api/v1/teach/dashboard`

**API Contract**:
- `GET /api/v1/study/dashboard` - 학생 대시보드
- `GET /api/v1/teach/dashboard` - 강사 대시보드

**Response**:
- `StudyDashboardResponse`: `{ nextClass: Schedule | null, stats: { totalClasses: number, attendedClasses: number, ... }, recentClasses: Schedule[] }`
- `TeachDashboardResponse`: `{ nextClass: Schedule | null, stats: { upcomingClassCount: number, ... }, todaySchedules: Schedule[] }`

---

**리포트 생성일**: 2026-02-07  
**분석 대상**: Frontend (Next.js) + Backend (Spring Boot)
