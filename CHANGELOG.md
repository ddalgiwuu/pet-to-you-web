# Pet to You Web — 변경 로그

> 날짜/시간별 작업 내용, 수정 사항, 에러 및 해결 기록

---

## 2026-02-26

### [작업] React Best Practices 적용 (`206af08`)
**시간**: 세션 중 (이전 컨텍스트)

**변경 파일**:
- `App.tsx` — React.lazy() + Suspense 적용, useCallback 추가
- `components/Sidebar.tsx` — ICONS 모듈 레벨 호이스팅, NavItem React.memo
- `components/ProcessBoard.tsx` — useMemo, 루프 합산 최적화

**내용**:
- 6개 페이지 컴포넌트 lazy loading 적용 (Schedule, MedicalStatus, PatientRecords, CallHistoryPage, Messages, Reports, Settings)
- 3개 모달/화면 lazy loading (QuickAddModal, CallDetailModal, Kiosk)
- Suspense fallback: 페이지는 spinner, 모달은 null
- `ICONS` 객체를 Sidebar 컴포넌트 밖으로 호이스팅 (매 렌더마다 JSX 재생성 방지)
- NavItem `isActive: boolean` prop으로 변경 → React.memo가 shallow compare로 정확히 비교 가능
- ProcessBoard `filteredCases`, `uniqueBreeds`, `uniqueOwners` useMemo 처리
- 두 개의 `.map()` 루프를 단일 `for-of`로 합산

---

### [작업] 프로필 드롭다운 기능 구현 (`3c26880`)
**시간**: 세션 중 (이전 컨텍스트)

**변경 파일**:
- `components/TopNav.tsx` — 프로필 드롭다운, 이니셜 아바타
- `App.tsx` — user/onLogout prop 전달
- `services/auth.service.ts` — updateProfile(), changePassword() 추가
- `context/AuthContext.tsx` — updateProfile, changePassword 컨텍스트에 추가
- `components/ProfileModal.tsx` — **신규 파일** 생성

**내용**:
- 하드코딩된 "김수의 원장" + picsum 아바타 → 실제 user.name + 이니셜 아바타
- 클릭 시 드롭다운: 이름/이메일/역할 표시 + 내 계정 설정 + 로그아웃
- ProfileModal: 기본정보 탭(이름 변경) + 비밀번호 탭(현재/새 비밀번호)
- 로딩 스피너, 성공/에러 피드백 3초 자동 닫힘

---

### [버그 수정] changePassword HTTP 메서드 불일치 (`0795d83`)
**시간**: 2026-02-26 (현재 세션)

**파일**: `services/auth.service.ts:56`

**에러 원인**:
```
Frontend: apiClient.patch('/auth/change-password', ...) → HTTP 405
Backend:  @Post('change-password')  ← POST만 등록되어 있음
```

**수정 내용**:
```typescript
// 수정 전
await apiClient.patch('/auth/change-password', { currentPassword, newPassword });
// 수정 후
await apiClient.post('/auth/change-password', { currentPassword, newPassword });
```

**발견 경위**: 백엔드 `auth.controller.ts` 직접 확인 후 메서드 불일치 발견

---

### [기능 추가] PATCH /users/me 백엔드 구현 (`1e8eef9` — API 레포)
**시간**: 2026-02-26 (현재 세션)

**에러 원인**: ProfileModal에서 이름 변경 시 `PATCH /users/me` 호출 → 404 (엔드포인트 미존재)
`UsersModule`이 빈 스켈레톤 상태였음

**신규 파일 (API 레포)**:
- `src/modules/users/dto/update-profile.dto.ts`
- `src/modules/users/services/users.service.ts`
- `src/modules/users/controllers/users.controller.ts`

**수정 파일 (API 레포)**:
- `src/modules/users/users.module.ts` — TypeOrmModule + AuthModule 연결

**구현 내용**:
```typescript
// PATCH /users/me → { success: true, data: User }
// Body: { name?: string }
// Guard: JwtAuthGuard (@CurrentUser()로 현재 유저 주입)
```

---

### [인프라] Git 히스토리 diverged 해결
**시간**: 2026-02-26 (현재 세션)

**에러 메시지**:
```
! [rejected] main -> main (non-fast-forward)
CONFLICT (add/add): Merge conflict in src/modules/users/users.module.ts
```

**원인**: 로컬과 리모트가 공통 조상 없이 분기된 상태 (이전에 동일한 커밋을 다른 경로로 푸시했던 것으로 추정)

**해결**:
1. `git stash` → `git pull origin main --no-rebase --allow-unrelated-histories`
2. `users.module.ts` 충돌: 로컬(구현 버전) 채택, 리모트(빈 스켈레톤) 폐기
3. 충돌 해결 후 merge commit 생성 (`5071fd3`) → push 성공

---

## 알려진 미해결 이슈

| 날짜 발견 | 파일 | 이슈 | 상태 |
|-----------|------|------|------|
| 이전 세션 | `ProcessBoard.tsx:190` | `@hello-pangea/dnd` Draggable `key` prop TS 오류 | ⏳ 미해결 (기능 영향 없음) |
