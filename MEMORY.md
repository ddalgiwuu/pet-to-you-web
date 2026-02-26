# Pet to You Web — 프로젝트 메모리

> **마지막 업데이트**: 2026-02-26
> **레포**: https://github.com/ddalgiwuu/pet-to-you-web
> **연관 백엔드**: https://github.com/ddalgiwuu/pet-to-you-api

---

## 프로젝트 개요

동물병원·미용·호텔 통합 관리 웹 어드민 대시보드.
수의사·미용사·호텔 매니저가 예약·환자·일정·메시지·통화 기록을 한 곳에서 관리.

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| State | React Context (AuthContext) |
| HTTP | Axios (`services/api.ts`) |
| Auth | JWT (access + refresh), localStorage |
| Icons | lucide-react |
| DnD | @hello-pangea/dnd (ProcessBoard) |
| 배포 | — (미정) |

---

## 프로젝트 구조

```
pet-to-you-web/
├── App.tsx                  # 라우팅, 전역 상태, lazy loading
├── types.ts                 # 공유 타입 정의
├── constants.ts             # 초기 목 데이터
├── context/
│   └── AuthContext.tsx      # 인증 상태, login/logout/updateProfile/changePassword
├── services/
│   ├── api.ts               # Axios 인스턴스, 토큰 인터셉터
│   ├── auth.service.ts      # login/logout/updateProfile/changePassword
│   └── booking.service.ts   # 예약 API
├── components/
│   ├── Sidebar.tsx          # 사이드바 네비게이션 (memo 최적화)
│   ├── TopNav.tsx           # 상단 네비 + 프로필 드롭다운 + 알림
│   ├── Login.tsx            # 로그인 화면
│   ├── ProfileModal.tsx     # 프로필/비밀번호 수정 모달
│   ├── ProcessBoard.tsx     # Kanban 보드 (useMemo 최적화)
│   ├── MedicalStatus.tsx    # 진료·미용·호텔 현황
│   ├── PatientRecords.tsx   # 환자 차트
│   ├── Schedule.tsx         # 일정 캘린더
│   ├── Messages.tsx         # 메시지
│   ├── Reports.tsx          # 리포트
│   ├── Settings.tsx         # 설정 (직원·룸 관리)
│   ├── Kiosk.tsx            # 키오스크 모드
│   └── ...                  # 기타 위젯/모달
└── hooks/                   # 커스텀 훅 (미사용 상태)
```

---

## API 연동 현황

### 인증 (Auth)
| 메서드 | 엔드포인트 | 상태 | 비고 |
|--------|------------|------|------|
| POST | `/auth/login` | ✅ 연동 완료 | |
| POST | `/auth/logout` | ✅ 연동 완료 | |
| POST | `/auth/refresh` | ✅ 연동 완료 | 인터셉터 자동 처리 |
| POST | `/auth/change-password` | ✅ 연동 완료 | ProfileModal에서 사용 |

### 사용자 (Users)
| 메서드 | 엔드포인트 | 상태 | 비고 |
|--------|------------|------|------|
| PATCH | `/users/me` | ✅ 연동 완료 | 이름 수정, ProfileModal에서 사용 |

### 기타 (목 데이터 사용 중)
| 기능 | 파일 | 상태 |
|------|------|------|
| 예약 목록 | `constants.ts` | ⏳ 백엔드 연동 필요 |
| 환자 차트 | `constants.ts` | ⏳ 백엔드 연동 필요 |
| 일정 | `constants.ts` | ⏳ 백엔드 연동 필요 |
| 직원 목록 | `constants.ts` | ⏳ 백엔드 연동 필요 |
| 룸 목록 | `constants.ts` | ⏳ 백엔드 연동 필요 |
| 통화 기록 | `constants.ts` | ⏳ 백엔드 연동 필요 |
| 메시지 | — | ⏳ 백엔드 연동 필요 |
| 리포트 | — | ⏳ 백엔드 연동 필요 |

---

## 완료된 작업 ✅

### 인프라 / 셋업
- [x] Next.js 모노레포에서 Vite SPA로 마이그레이션 (`cee0b23`)
- [x] Axios 인터셉터 설정 (토큰 자동 첨부, refresh 처리)
- [x] React.lazy() + Suspense 적용 — 6개 페이지 컴포넌트 코드 스플리팅 (`206af08`)

### UI / 컴포넌트
- [x] 대시보드 UI 구현 (ProcessBoard, ReservationWidget, ScheduleWidget, ClinicStatusWidget, CallHistoryWidget)
- [x] Sidebar 최적화 — ICONS 객체 호이스팅, NavItem React.memo, isActive prop (`206af08`)
- [x] TopNav 프로필 드롭다운 — 실제 유저 이름/이니셜 아바타 표시 (`3c26880`)
- [x] ProfileModal — 이름 변경 / 비밀번호 변경 탭 UI (`3c26880`)
- [x] ProcessBoard 최적화 — useMemo, 루프 합산 최적화 (`206af08`)

### 인증 / 프로필
- [x] AuthContext에 `updateProfile`, `changePassword` 추가 (`3c26880`)
- [x] `auth.service.ts`에 `updateProfile()`, `changePassword()` 구현 (`3c26880`)
- [x] `changePassword` HTTP 메서드 불일치 수정: `PATCH` → `POST` (`0795d83`)
- [x] App.tsx에 `user`, `onLogout` prop TopNav에 전달 (`3c26880`)

---

## 진행 중 / 남은 작업 ⏳

### 우선순위 높음
- [ ] **예약 데이터 백엔드 연동** — `ReservationWidget`, `ProcessBoard` 목 데이터 → API
- [ ] **환자 차트 백엔드 연동** — `PatientRecords` 목 데이터 → API
- [ ] **직원·룸 설정 백엔드 연동** — `Settings` 목 데이터 → API

### 우선순위 중간
- [ ] **일정 백엔드 연동** — `Schedule`, `ScheduleWidget` 목 데이터 → API
- [ ] **통화 기록 백엔드 연동** — `CallHistoryPage`, `CallHistoryWidget` 목 데이터 → API
- [ ] **알림 백엔드 연동** — TopNav 알림 → API

### 우선순위 낮음
- [ ] **메시지 기능 구현** — `Messages` 컴포넌트 백엔드 연동
- [ ] **리포트 기능 구현** — `Reports` 컴포넌트 차트 + 백엔드
- [ ] **키오스크 모드 완성** — `Kiosk` 컴포넌트 백엔드 연동
- [ ] **다크모드 상태 localStorage 저장** — 새로고침 시 유지
- [ ] **에러 바운더리 추가** — Suspense fallback 개선
- [ ] **`@hello-pangea/dnd` key prop 타입 오류 수정** — ProcessBoard.tsx:190

### 기술 부채
- [ ] `constants.ts` 목 데이터 → 실제 API 교체 후 제거
- [ ] `hooks/` 디렉토리 활용 (공통 훅 추출)
- [ ] 환경변수 `.env` 파일 정리

---

## 알려진 이슈

| 파일 | 위치 | 내용 |
|------|------|------|
| `ProcessBoard.tsx` | `:190` | `@hello-pangea/dnd` Draggable `key` prop TS 타입 오류 (pre-existing, 기능 영향 없음) |

---

## 핵심 패턴 / 규칙

### 상태 관리
- 전역 인증 상태: `context/AuthContext.tsx` → `useAuth()` 훅으로 사용
- 페이지 데이터: `App.tsx`에서 관리 후 props로 내려보냄

### API 호출
```typescript
// 모든 API 호출은 services/api.ts의 apiClient 사용
import { apiClient } from '../services/api';
// 응답 envelope: { success: boolean, data: T, timestamp: string }
const { data: res } = await apiClient.get<{ success: boolean; data: T }>('/endpoint');
const result = res.data;
```

### 컴포넌트 최적화
- 정적 JSX/객체는 컴포넌트 밖으로 호이스팅
- 리스트 아이템은 `React.memo` 적용
- 비싼 계산은 `useMemo` 사용
- 안정적 콜백은 `useCallback` + 함수형 setState 패턴

---

## 커밋 히스토리 (주요)

| 해시 | 메시지 |
|------|--------|
| `0795d83` | fix(auth): correct HTTP method for change-password endpoint |
| `206af08` | perf: apply React best practices (Vercel guidelines) |
| `3c26880` | feat(profile): user profile dropdown with account settings |
| `cee0b23` | refactor: migrate from Next.js monorepo to Vite SPA |
