# 1:1 Course Registration System (LMS)

1:1 과외·튜터링 기반 Learning Management System (LMS). 높은 동시성을 고려한 수강 신청 및 수업 관리 Monorepo입니다.

## 프로젝트 배경

이전 시스템에서는 튜터 가용성을 **사전 생성된 Time Block(행) INSERT** 방식으로 관리했습니다. 이 접근은 다음 위험을 내포했으며, 현 프로젝트에서 이를 해결하고자 합니다.

- **스토리지 급증**: 튜터 수 × 시간슬롯 × 기간에 비례해 행 수가 선형 증가 (예: 1,000명 × 16개월 ≈ 2,300만 행)
- **동기화 위험**: 근무조건·휴식·오버타임·수업·공휴일 등 진실 소스가 분산되어 있어, 변경 시 재동기화가 누락되면 불일치 발생
- **오래된 데이터**: 강사가 근무시간을 10~17시로 변경했는데, 가용 슬롯은 9~18시 기준으로 노출 → 잘못된 예약 또는 기회 손실
- **가용 기간 계속 넓히기 부담**: 16개월치 가용 슬롯을 앞으로 밀어가며 유지하는 배치에 의존, 실패 시 공백
- **동시성·재계산 비용**: 대량 UPDATE와 예약 트랜잭션 경합, 재배치 시 DB 부하 급증

본 프로젝트는 **TeacherAvailability(가용 시간)·TeacherTimeOff(휴무)·Schedule(수업)** 기반으로 가용성을 조회 시점에 계산하는 모델을 채택하여, 사전 INSERT·동기화·가용 기간 유지 배치 의존을 줄이고 일관성을 확보합니다.

## 프로젝트 성과

| 구분 | 이전 시스템 | 이번 프로젝트 |
|------|-------------|---------------|
| **스토리지** | 튜터 수 × 슬롯 × 기간에 비례해 수백만 행 증가 | 가용 시간·휴무·수업만 저장, 행 수 최소화 |
| **동기화** | 근무조건·휴식·수업 등 다수 소스 재동기화 필요 | 조회 시점 계산으로 재동기화 불필요 |
| **오래된 데이터** | 강사 근무시간 변경 후 재배치 미실행 시 가용 슬롯이 구버전 유지 | 조회 시점에 TeacherAvailability 기준 계산으로 항상 최신 가용성 노출 |
| **가용 기간 유지** | 16개월치를 앞으로 밀어가는 배치 유지, 실패 시 공백 | 기간 제한 없이 필요 시점 계산 |
| **동시성** | 대량 UPDATE와 예약 트랜잭션 경합 | Redis 분산 락으로 수강 신청 경합만 관리 |
| **운영** | 재배치·일별 확장 배치 의존 | 관련 배치 제거로 운영 부담 감소 |

## 프로젝트 구조

```
next-java-lms/
├── api/          # Spring Boot 백엔드 (Java 21)
├── web/          # Next.js 프론트엔드 (React 19)
└── docs/         # 프로젝트 문서
```

## Tech Stack

| 구분 | 기술 |
|------|------|
| Backend | Spring Boot 3.3.3, Java 21, JPA, PostgreSQL |
| Frontend | Next.js 15.5, React 19, TypeScript |
| 인증 | Better-Auth (Web), Session (API) |
| 동시성 | Redis (Redisson Distributed Lock) |
| API 문서 | SpringDoc OpenAPI (Swagger) |

## 사전 요구사항

- **Java 21** (JDK)
- **Node.js 20+** (LTS 권장)
- **PostgreSQL** 14+
- **Redis** 7+
- **Gradle** (Wrapper 포함)

## 빠른 시작

### 1. 백엔드 실행

```bash
cd api
./gradlew bootRun
```

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### 2. 프론트엔드 실행

```bash
cd web
npm install
npm run dev
```

- Web: `http://localhost:3000`

### 3. 환경 변수

- `api/`: `.env` 또는 시스템 환경 변수 (`DB_URL`, `REDIS_URL`, `CORS_ALLOWED_ORIGINS` 등)
- `web/`: `.env.local` (Better-Auth, API URL 등)

## 주요 기능

- **관리자**: 강좌·사용자·수업 일정 관리
- **강사**: 대시보드, 수업 예정 조회, 가용 시간·휴무 설정
- **학생**: 수강 신청, 대시보드, 수업방 진입
- **수업 피드백**: 녹화본 업로드, AI 피드백 (VTT, Google Gemini)

