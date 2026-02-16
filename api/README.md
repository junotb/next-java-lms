# API (Backend)

Spring Boot 기반 REST API. 1:1 수강 신청, 수업 관리, 수업 피드백 등을 처리합니다.

## Tech Stack

| 항목 | 기술 |
|------|------|
| Framework | Spring Boot 3.3.3 |
| Language | Java 21 |
| Build | Gradle (Kotlin DSL) |
| DB | PostgreSQL (Production), H2 (Test) |
| ORM | JPA / Hibernate |
| Security | Spring Security + 커스텀 인증 필터 |
| Concurrency | Redisson (Distributed Lock) |
| API Docs | SpringDoc OpenAPI (Swagger) |
| Utils | Lombok, Commons Lang3 |

## 프로젝트 구조

```
api/src/main/java/org/junotb/api/
├── auth/           # 세션·인증
├── common/         # 예외 처리, Security Filter
├── config/         # Security, Web, Redis, OpenAPI
├── course/         # 강좌
├── dashboard/      # 강사/학생 대시보드
├── lesson/         # 수업방(세션) API
├── registration/   # 수강 신청
├── schedule/       # 수업 일정
├── schedulefeedback/ # 수업 피드백 (녹화·AI)
├── teacher/        # 강사 설정·가용 시간
├── user/           # 사용자 관리
└── LmsApplication.java
```

## 실행 방법

```bash
# Gradle Wrapper 사용
./gradlew bootRun

# 특정 포트 지정
PORT=8081 ./gradlew bootRun
```

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `PORT` | 서버 포트 | 8080 |
| `DB_URL` | PostgreSQL 연결 URL | jdbc:postgresql://localhost:5432/java_lms_db |
| `DB_USERNAME` | DB 사용자 | postgres |
| `DB_PASSWORD` | DB 비밀번호 | password |
| `REDIS_URL` | Redis URL | redis://localhost:6379 |
| `CORS_ALLOWED_ORIGINS` | CORS 허용 Origin | http://localhost:3000 |
| `GOOGLE_GEMINI_API_KEY` | Gemini API 키 (AI 피드백) | - |
| `FFMPEG_PATH` | FFmpeg 실행 경로 | ffmpeg |
| `VIDEO_PROCESSOR_ENABLED` | 비디오 처리 활성화 | true |

## API 문서

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## 테스트

```bash
./gradlew test
```

## 아키텍처

- **Layered**: Controller → Service → Repository
- **DTO**: Request/Response 분리, Entity 직접 반환 금지
- **Concurrency**: 수강 신청 시 Redis 분산 락 또는 DB 비관적 락
