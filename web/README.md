# Web (Frontend)

Next.js App Router 기반 프론트엔드. 관리자·강사·학생 대시보드 및 수강 신청, 수업방 등 UI를 제공합니다.

## Tech Stack

| 항목 | 기술 |
|------|------|
| Framework | Next.js 15.5 (App Router) |
| Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand (Client), TanStack Query v5 (Server) |
| Forms | React Hook Form + Zod |
| Auth | Better-Auth |
| HTTP | Axios |
| Testing | Jest, React Testing Library |

## 프로젝트 구조

```
web/src/
├── app/                    # App Router 페이지
│   ├── (landing)/          # 랜딩 페이지
│   ├── admin/              # 관리자 (강좌·사용자·일정)
│   ├── study/              # 학생 (수강 신청·수업방)
│   └── teach/              # 강사 (대시보드·수업방)
├── components/             # 공통·도메인 컴포넌트
├── hooks/                  # 커스텀 훅
├── lib/                    # API 클라이언트, 유틸
├── schemas/                # Zod 스키마
├── stores/                 # Zustand 스토어
└── types/                  # TypeScript 타입
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm run start
```

개발 서버 기본 주소: `http://localhost:3000`

## 환경 변수

`.env.local`에 다음 예시를 참고하여 설정합니다.

```
# Better-Auth, API base URL 등
# (실제 항목은 프로젝트 설정 참조)
```

## 테스트

```bash
# 단일 실행
npm test

# Watch 모드
npm run test:watch
```

## 코딩 규칙

- **Server Components 우선**: `'use client'`는 상태/훅 필요 시에만 사용
- **TanStack Query**: API 호출은 `useQuery`, `useMutation` 사용
- **Tailwind v4**: Utility 클래스 위주, `tailwind.config` 없음
- **Zod**: 폼·API 검증
