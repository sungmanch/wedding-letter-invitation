# 모바일 청첩장 - Epic Breakdown

**Author:** BMad
**Date:** 2025-11-30
**Updated:** 2025-11-30 (Architecture & UX 반영)
**Project Level:** Level 3 (Product)
**Target Scale:** MVP → Growth

---

## Overview

이 문서는 모바일 청첩장 PRD의 요구사항을 구현 가능한 에픽과 스토리로 분해합니다.

**기존 청모장 프로젝트 활용:** 인증, 미들웨어, 기본 UI 컴포넌트는 기존 구현을 재사용합니다.

**관련 문서:**
- PRD: `docs/prd.md`
- UX Design: `docs/ux-design-specification.md`
- Architecture: `docs/architecture-invitation.md`

---

## Functional Requirements Inventory

### 사용자 계정 및 인증 (FR1-4)

| FR ID | 설명 |
|-------|------|
| FR1 | 사용자는 이메일로 회원가입할 수 있다 |
| FR2 | 사용자는 소셜 로그인(카카오)으로 회원가입할 수 있다 |
| FR3 | 사용자는 로그인하여 세션을 유지할 수 있다 |
| FR4 | 사용자는 비밀번호를 재설정할 수 있다 |

### 청첩장 기본 정보 입력 (FR5-11)

| FR ID | 설명 |
|-------|------|
| FR5 | Host는 새 청첩장을 생성할 수 있다 |
| FR6 | Host는 신랑/신부 이름을 입력할 수 있다 |
| FR7 | Host는 신랑/신부 혼주 이름을 입력할 수 있다 |
| FR8 | Host는 결혼 일시를 입력할 수 있다 |
| FR9 | Host는 결혼 장소 정보를 입력할 수 있다 (장소명, 주소, 지도) |
| FR10 | Host는 연락처를 입력할 수 있다 (신랑측, 신부측) |
| FR11 | Host는 축의금 계좌번호를 입력할 수 있다 (신랑측, 신부측) |

### AI 디자인 생성 (FR12-15)

| FR ID | 설명 |
|-------|------|
| FR12 | Host는 원하는 청첩장 스타일을 텍스트로 설명할 수 있다 |
| FR13 | 시스템은 텍스트 프롬프트를 기반으로 5개의 디자인 시안을 생성한다 |
| FR14 | Host는 5개 시안 중 하나를 선택할 수 있다 |
| FR15 | Host는 추가 결제 후 새로운 5개 시안을 재생성할 수 있다 |

### 사진 업로드 (FR16-18)

| FR ID | 설명 |
|-------|------|
| FR16 | Host는 최대 10장의 사진을 업로드할 수 있다 |
| FR17 | 시스템은 선택된 디자인에 맞게 사진 레이아웃을 자동 적용한다 |
| FR18 | Host는 업로드한 사진을 삭제하거나 교체할 수 있다 |

### 미리보기 및 결제 (FR19-21)

| FR ID | 설명 |
|-------|------|
| FR19 | Host는 결제 전 청첩장 전체 미리보기를 확인할 수 있다 |
| FR20 | Host는 청첩장 결제를 완료할 수 있다 |
| FR21 | Host는 결제 후에도 청첩장 내용을 수정할 수 있다 |

### 청첩장 공유 (FR22-24)

| FR ID | 설명 |
|-------|------|
| FR22 | Host는 카카오톡으로 청첩장을 공유할 수 있다 |
| FR23 | Host는 청첩장 링크를 복사할 수 있다 |
| FR24 | 청첩장에는 서비스 워터마크/링크가 표시된다 (바이럴) |

### 게스트 청첩장 열람 (FR25-27)

| FR ID | 설명 |
|-------|------|
| FR25 | Guest는 로그인 없이 청첩장을 열람할 수 있다 |
| FR26 | Guest는 청첩장에서 결혼 정보를 확인할 수 있다 (일시, 장소, 지도) |
| FR27 | Guest는 축의금 계좌번호를 복사할 수 있다 |

### 게스트 축하 메시지 (FR28-31)

| FR ID | 설명 |
|-------|------|
| FR28 | Guest는 축하 메시지를 작성할 수 있다 (선택) |
| FR29 | Guest는 닉네임을 입력해야 한다 (필수) |
| FR30 | 축하 메시지는 300자로 제한된다 |
| FR31 | Guest는 메시지 제출 후 수정할 수 없다 |

### Host 축하 메시지 관리 (FR32-33)

| FR ID | 설명 |
|-------|------|
| FR32 | Host는 받은 축하 메시지 목록을 열람할 수 있다 |
| FR33 | 축하 메시지는 Host만 볼 수 있다 (비공개) |

### 청첩장 관리 (FR34-35)

| FR ID | 설명 |
|-------|------|
| FR34 | Host는 자신이 만든 청첩장 목록을 조회할 수 있다 |
| FR35 | Host는 청첩장을 삭제할 수 있다 |

---

## Epic Summary

| Epic | 제목 | 스토리 수 | 핵심 가치 | 상태 |
|------|------|----------|----------|------|
| 1 | 청첩장 인프라 구축 | 3 | 신규 DB 스키마 + 커스텀 컴포넌트 | 신규 |
| 2 | 대화형 청첩장 생성 | 4 | AI와 대화하며 청첩장을 만든다 | 신규 |
| 3 | 결제 및 공유 | 4 | Polar.sh 결제, 카카오톡 공유 | 신규 |
| 4 | 게스트 경험 | 4 | Guest가 청첩장을 보고 축하할 수 있다 | 신규 |

**총 에픽:** 4개 / **총 스토리:** 15개

**기존 활용:** 인증 시스템 (Supabase Auth + Kakao OAuth), 미들웨어, 배포 파이프라인 (Vercel)

---

## FR Coverage Map

```
기존 구현 (재사용):     FR1, FR2, FR3, FR4 (인증 - 이미 구현됨)
Epic 1 (인프라 구축):   신규 DB 스키마, 커스텀 컴포넌트
Epic 2 (청첩장 생성):   FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18
Epic 3 (결제 및 공유):  FR19, FR20, FR21, FR22, FR23, FR24, FR34, FR35
Epic 4 (게스트 경험):   FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33
```

**FR 커버리지:** 35/35 (100%) - FR1-4는 기존 구현 활용

---

## Epic 1: 청첩장 인프라 구축

**목표:** 기존 청모장 인프라를 활용하면서, 청첩장 서비스에 필요한 신규 DB 스키마와 커스텀 컴포넌트를 구축한다.

**기존 활용:**
- Next.js 16 + React 19 + TypeScript (기존)
- Supabase Auth + Kakao OAuth (기존)
- Drizzle ORM (기존)
- Vercel 배포 (기존)
- 기본 UI 컴포넌트: Button, Input, Card, Modal, Calendar (기존)

### Story 1.1: 청첩장 DB 스키마 생성

As a 개발자,
I want 청첩장 관련 테이블이 생성된 상태,
So that 청첩장 데이터를 저장하고 조회할 수 있다.

**Acceptance Criteria:**

**Given** 기존 프로젝트에 새 스키마 파일을 추가하면
**When** 마이그레이션을 실행하면
**Then** 다음 테이블이 생성된다:
  - `invitations` (청첩장 기본 정보)
  - `invitation_designs` (AI 생성 디자인)
  - `invitation_photos` (업로드된 사진)
  - `invitation_messages` (축하 메시지)
  - `invitation_payments` (결제 정보)
**And** RLS 정책이 설정된다 (본인 청첩장만 수정, published는 누구나 조회)
**And** `drizzle-kit migrate` 명령으로 마이그레이션이 실행된다

**Prerequisites:** 없음 (기존 프로젝트 활용)

**Technical Notes:**
- `src/lib/db/invitation-schema.ts` 생성
- 기존 `schema.ts`는 레거시로 유지
- Drizzle ORM (drizzle-kit migrate 사용, push 금지)
- UUID를 청첩장 ID로 사용 (추측 불가능)

---

### Story 1.2: 대화형 UI 컴포넌트 구현

As a 개발자,
I want 대화형 청첩장 생성에 필요한 커스텀 컴포넌트,
So that Gamma 스타일의 AI 대화 경험을 구현할 수 있다.

**Acceptance Criteria:**

**Given** 기존 UI 컴포넌트가 있는 상태
**When** 신규 컴포넌트를 구현하면
**Then** 다음 컴포넌트가 존재한다:
  - **ChatBubble** (AI/사용자 메시지 표시, typing 애니메이션)
  - **ChatInput** (텍스트, 날짜, 시간, 주소, 계좌 입력)
  - **DatePicker** (캘린더 기반 날짜 선택)
  - **TimePicker** (오전/오후, 시/분 선택)
  - **DesignCard** (AI 시안 선택 카드)
  - **GeneratingLoader** (AI 생성 중 프로그레스, 10초)
**And** 웨딩 테마 컬러가 적용된다:
  - Primary: Deep Rose #D4768A (CTA 버튼)
  - Accent: Blush Pink #FFB6C1, Soft Gold #D4AF37
**And** 모바일 퍼스트 반응형 스타일이 적용된다
**And** 터치 타겟이 최소 44x44px이다
**And** WCAG AA 접근성 기준을 충족한다

**Prerequisites:** Story 1.1

**Technical Notes:**
- Framer Motion 추가 (애니메이션)
- Pretendard 폰트 적용
- `src/components/invitation/` 폴더에 생성

---

### Story 1.3: 청첩장 뷰어 및 공유 컴포넌트 구현

As a 개발자,
I want 완성된 청첩장을 렌더링하는 컴포넌트,
So that Host와 Guest 모두 청첩장을 볼 수 있다.

**Acceptance Criteria:**

**Given** 청첩장 데이터가 있는 상태
**When** 뷰어 컴포넌트를 구현하면
**Then** 다음 컴포넌트가 존재한다:
  - **InvitationViewer** (청첩장 전체 렌더링)
    - 디자인 테마 적용
    - 신랑/신부 정보
    - 결혼 일시/장소
    - 갤러리 (사진)
    - 지도 (카카오맵)
    - 연락처
    - 계좌 정보 (복사 기능)
  - **PhotoUploader** (드래그앤드롭, 순서 변경, 최대 10장)
  - **MessageCard** (축하 메시지 표시)
**And** preview/published 상태에 따라 다르게 렌더링된다
**And** 서비스 워터마크가 표시된다 ("Made with [서비스명]")

**Prerequisites:** Story 1.2

**Technical Notes:**
- 카카오맵 API 연동
- Supabase Storage (사진 업로드)
- 이미지 최적화 (Next.js Image)

---

## Epic 2: 대화형 청첩장 생성

**목표:** Host가 AI와 대화하며 기본 정보를 입력하고, 디자인을 생성하며, 사진을 업로드하여 개인화된 청첩장을 만들 수 있다.

**관련 FR:** FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18

**핵심 차별점:** 폼 입력이 아닌 대화형(Gamma 스타일) UI로 자연스럽게 정보 수집

### Story 2.1: 랜딩 페이지 및 서비스 소개

As a 방문자,
I want 서비스의 가치를 한눈에 이해할 수 있는 랜딩 페이지,
So that 서비스 사용 여부를 결정할 수 있다.

**Acceptance Criteria:**

**Given** 사용자가 메인 URL에 접속하면
**When** 랜딩 페이지가 로드되면
**Then** 서비스 핵심 가치가 표시된다 ("AI가 만들어주는 나만의 청첩장")
**And** "청첩장 만들기" CTA 버튼이 Deep Rose(#D4768A) 색상으로 눈에 띄게 배치된다
**And** AI 생성 예시 이미지/갤러리가 표시된다
**And** 모바일에서 3초 이내 로딩된다
**And** SEO 메타 태그가 설정된다 ("모바일 청첩장", "청첩장 만들기")

**Prerequisites:** Story 1.3

**Technical Notes:**
- SEO 최적화 (메타 태그, 시맨틱 HTML)
- Open Graph 태그 (카카오톡 공유 미리보기)
- 서비스 페이지는 검색 노출, 청첩장 페이지는 noindex

---

### Story 2.2: 대화형 청첩장 생성 플로우

As a Host(예비 신부),
I want AI와 대화하며 청첩장 정보를 입력,
So that 자연스럽게 결혼 정보와 원하는 스타일을 전달할 수 있다.

**Acceptance Criteria:**

**Given** 로그인한 사용자가 "청첩장 만들기"를 클릭하면
**When** 대화형 생성 화면(`/invitation/create`)이 표시되면
**Then** AI가 인사 메시지를 표시한다 ("안녕하세요! 특별한 청첩장을 만들어 드릴게요 ✨")
**And** 대화형으로 다음 정보를 순차적으로 수집한다:
  1. 신랑/신부 이름 (필수) (FR5, FR6)
  2. 결혼 일시 - **캘린더 피커로 선택** (필수) (FR8)
  3. 결혼 시간 - **타임 피커로 선택** (필수) (FR8)
  4. 결혼 장소 (장소명, 주소) (필수) (FR9)
  5. 혼주 이름 (필수) (FR7)
  6. 연락처 (선택) (FR10)
  7. 계좌번호 (선택) (FR11)
  8. 원하는 스타일 설명 (필수) (FR12)
**And** 각 단계에서 ChatBubble로 AI 질문, ChatInput으로 사용자 입력이 표시된다
**And** 뒤로가기 시 이전 대화로 돌아갈 수 있다
**And** 입력 중 자동 저장된다 (draft 상태)

**Prerequisites:** Story 1.2, Story 2.1

**Technical Notes:**
- 대화 상태 관리 (React state 또는 zustand)
- DatePicker, TimePicker 컴포넌트 사용
- 카카오맵 API (장소 검색)
- Server Action: `createInvitation`, `updateInvitation`

**대화 플로우 예시:**
```
🤖 "안녕하세요! 특별한 청첩장을 만들어 드릴게요 ✨
    먼저, 결혼하시는 두 분 성함을 알려주세요!"

            [ 신랑: 김민수 ]  👤

🤖 "반가워요! 신부님 성함도 알려주세요"

            [ 신부: 이수진 ]  👤

🤖 "민수님 💑 수진님, 축하드려요!
    결혼식은 언제인가요?"

        [ 📅 날짜 선택하기 ]  → 캘린더 피커 열림
```

---

### Story 2.3: AI 디자인 생성 및 선택

As a Host,
I want 입력한 정보를 바탕으로 AI 디자인을 받고 선택,
So that 나만의 유니크한 청첩장 디자인을 얻을 수 있다.

**Acceptance Criteria:**

**Given** 대화형 입력이 완료된 상태
**When** "청첩장 생성하기" 버튼을 클릭하면
**Then** GeneratingLoader가 표시된다 (프로그레스 바, 사용자 프롬프트 표시)
**And** 10초 이내에 5개의 디자인 시안이 생성된다 (FR13)
**And** 5개 시안이 가로 스크롤 갤러리로 표시된다
**And** 각 시안에는 테마명과 설명이 표시된다
**And** 시안 탭 시 확대 미리보기가 가능하다
**And** 하나의 시안을 선택할 수 있다 (FR14)
**And** 선택된 디자인에 border와 체크마크가 표시된다
**And** "이 디자인으로 계속하기" 버튼이 활성화된다

**Given** 마음에 드는 시안이 없으면
**When** "다시 생성하기" 버튼을 클릭하면
**Then** 추가 비용 안내 모달이 표시된다 (FR15)
**And** 결제 확인 후 프롬프트 수정 기회가 주어진다
**And** 새로운 5개 시안이 생성된다

**Prerequisites:** Story 2.2

**Technical Notes:**
- Claude API 연동 (claude-sonnet-4-20250514 - 속도 우선)
- 5개 동시 생성 (Promise.all)
- 10초 타임아웃 처리, 부분 결과 반환
- Server Action: `generateDesigns`, `selectDesign`
- DesignCard 컴포넌트 사용

---

### Story 2.4: 사진 업로드 및 미리보기

As a Host,
I want 커플 사진을 업로드하여 청첩장에 넣기,
So that 더욱 개인화된 청첩장을 만들 수 있다.

**Acceptance Criteria:**

**Given** 디자인을 선택한 상태
**When** 사진 업로드 화면이 표시되면
**Then** PhotoUploader 컴포넌트가 표시된다
**And** 최대 10장의 사진을 업로드할 수 있다 (FR16)
**And** 드래그앤드롭 또는 파일 선택으로 업로드한다
**And** 업로드 진행률이 실시간 표시된다
**And** 선택된 디자인에 맞게 사진 레이아웃이 자동 적용된다 (FR17)
**And** 업로드한 사진을 삭제하거나 교체할 수 있다 (FR18)
**And** 사진 순서를 드래그로 변경할 수 있다
**And** "미리보기" 버튼으로 전체 청첩장을 확인할 수 있다

**Prerequisites:** Story 2.3

**Technical Notes:**
- Supabase Storage (wedding-photos 버킷)
- 이미지 최적화 (리사이즈 2000px, WebP 변환, 압축 80%)
- 지원 포맷: JPG, PNG, HEIC
- 파일 크기 제한: 10MB/장
- Server Action: `uploadPhotos`, `deletePhoto`, `reorderPhotos`

---

## Epic 3: 결제 및 공유

**목표:** Host가 청첩장을 미리보기하고, Polar.sh로 결제를 완료하며, 카카오톡으로 공유할 수 있다.

**관련 FR:** FR19, FR20, FR21, FR22, FR23, FR24, FR34, FR35

### Story 3.1: 청첩장 미리보기

As a Host,
I want 결제 전에 완성된 청첩장을 미리보기,
So that 최종 결과물을 확인하고 수정할 수 있다.

**Acceptance Criteria:**

**Given** 디자인 선택과 사진 업로드를 완료한 상태
**When** 미리보기 화면(`/invitation/[id]/preview`)에 진입하면
**Then** InvitationViewer 컴포넌트로 완성된 청첩장이 표시된다 (FR19)
**And** 실제 게스트가 보는 것과 동일한 형태로 렌더링된다
**And** 스크롤하여 전체 내용을 확인할 수 있다:
  - 신랑/신부 정보
  - 결혼 일시/장소
  - 갤러리 (사진)
  - 지도
  - 연락처
  - 계좌 정보
**And** "수정하기" 버튼으로 이전 단계로 돌아갈 수 있다
**And** "결제하기" 버튼이 Deep Rose(#D4768A) 색상으로 하단에 고정된다

**Prerequisites:** Story 2.4

**Technical Notes:**
- InvitationViewer 컴포넌트 (Story 1.3)
- 모바일 뷰포트 기준 미리보기

---

### Story 3.2: Polar.sh 결제 연동

As a Host,
I want 청첩장 결제를 완료,
So that 청첩장을 공유할 수 있다.

**Acceptance Criteria:**

**Given** 미리보기를 확인한 상태
**When** "결제하기" 버튼을 클릭하면
**Then** 결제 금액과 내역이 표시된다
**And** Polar.sh 체크아웃 페이지로 리다이렉트된다 (FR20)
**And** 결제 완료 후 `/invitation/[id]?success=true`로 리다이렉트된다

**Given** Polar.sh 웹훅이 호출되면
**When** `checkout.completed` 이벤트를 수신하면
**Then** 서명 검증 후 결제 상태가 `completed`로 업데이트된다
**And** 청첩장 상태가 `published`로 변경된다
**And** `is_paid`가 `true`로 설정된다

**Given** 결제 실패 시
**When** 에러 페이지로 리다이렉트되면
**Then** 에러 메시지와 재시도 버튼이 표시된다

**Prerequisites:** Story 3.1

**Technical Notes:**
- Polar.sh API 연동
- API Route: `POST /api/invitation/payment/checkout` (체크아웃 세션 생성)
- API Route: `POST /api/invitation/payment/webhook` (웹훅 처리)
- 웹훅 서명 검증 (POLAR_WEBHOOK_SECRET)
- Server Action: `updatePaymentStatus`, `publishInvitation`

---

### Story 3.3: 카카오톡 공유 및 링크 복사

As a Host,
I want 완성된 청첩장을 친구들에게 공유,
So that 결혼 소식을 알릴 수 있다.

**Acceptance Criteria:**

**Given** 결제가 완료된 상태
**When** 공유 화면이 표시되면
**Then** 카카오톡 공유 버튼이 표시된다
**And** 버튼 클릭 시 Kakao SDK로 공유 팝업이 열린다 (FR22)
**And** 공유 메시지에 포함되는 내용:
  - 제목: "{신랑} ♥ {신부} 결혼합니다"
  - 설명: "{결혼일시} {장소명}"
  - 이미지: 청첩장 썸네일
  - 버튼: "청첩장 보기"
**And** 링크 복사 버튼 클릭 시 클립보드에 복사된다 (FR23)
**And** 복사 완료 Toast가 3초간 표시된다
**And** 청첩장 하단에 "Made with [서비스명]" 워터마크가 표시된다 (FR24)

**Given** 결제 후에도
**When** `/invitation/[id]/edit`에서 청첩장 내용을 수정하면
**Then** 수정 사항이 저장된다 (FR21)
**And** 이미 공유된 링크에서도 수정된 내용이 반영된다

**Prerequisites:** Story 3.2

**Technical Notes:**
- Kakao JavaScript SDK 초기화 (NEXT_PUBLIC_KAKAO_JS_KEY)
- Open Graph 동적 메타 태그 (generateMetadata)
- 청첩장 페이지는 `robots: { index: false }` 설정

---

### Story 3.4: 내 청첩장 관리 (목록/수정/삭제)

As a Host,
I want 내가 만든 청첩장을 관리,
So that 여러 청첩장을 효율적으로 관리할 수 있다.

**Acceptance Criteria:**

**Given** 로그인한 사용자가 `/my/invitations`에 접속하면
**When** 내 청첩장 페이지가 표시되면
**Then** 생성한 청첩장 목록이 카드 형태로 표시된다 (FR34)
**And** 각 청첩장에 표시되는 정보:
  - 썸네일
  - 신랑/신부 이름
  - 결혼 일시
  - 상태 배지 (작성중/결제완료)
**And** 청첩장 카드 클릭 시:
  - 작성중: 이어서 작성 페이지로 이동
  - 결제완료: 상세/수정 페이지로 이동

**Given** 청첩장 상세 페이지에서
**When** 삭제 버튼을 클릭하면
**Then** 확인 모달이 표시된다 ("정말 삭제할까요?")
**And** 확인 시 청첩장 상태가 `deleted`로 변경된다 (FR35)
**And** 삭제된 청첩장 URL 접근 시 404 페이지가 표시된다

**Prerequisites:** Story 3.2

**Technical Notes:**
- Soft delete (status: 'deleted')
- Server Action: `getMyInvitations`, `deleteInvitation`
- 삭제 확인 모달로 실수 방지

---

## Epic 4: 게스트 경험

**목표:** Guest가 청첩장을 열람하고, 축하 메시지를 보내며, Host가 메시지를 확인할 수 있다.

**관련 FR:** FR25, FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33

### Story 4.1: 청첩장 열람 (Guest)

As a Guest(하객),
I want 공유받은 링크로 청첩장을 열람,
So that 결혼 정보를 확인할 수 있다.

**Acceptance Criteria:**

**Given** Guest가 공유받은 청첩장 링크(`/invitation/[id]`)를 클릭하면
**When** 청첩장 페이지가 로드되면
**Then** 로그인 없이 바로 청첩장을 볼 수 있다 (FR25)
**And** InvitationViewer 컴포넌트로 다음 정보가 표시된다 (FR26):
  - AI 생성 디자인 테마 적용
  - 신랑/신부 이름, 혼주 이름
  - 결혼 일시 (D-day 표시)
  - 결혼 장소 (이름, 주소, 카카오맵)
  - 커플 사진 갤러리
  - 연락처 (전화 아이콘 클릭 시 전화 앱 연결)
  - 서비스 워터마크
**And** 페이지가 모바일에서 3초 이내 로딩된다
**And** 페이지에 `robots: { index: false }` 메타 태그가 설정된다
**And** Open Graph 태그가 동적으로 설정된다

**Prerequisites:** Story 3.3

**Technical Notes:**
- 청첩장 페이지는 검색 노출 방지 (noindex)
- 카카오맵 클릭 시 네이버/카카오맵 앱으로 연결 (모바일 딥링크)
- SSR로 OG 태그 생성 (generateMetadata)

---

### Story 4.2: 계좌번호 복사 (Guest)

As a Guest,
I want 축의금 계좌번호를 쉽게 복사,
So that 축의금을 편리하게 보낼 수 있다.

**Acceptance Criteria:**

**Given** 청첩장을 열람하는 중
**When** 계좌번호 영역이 표시되면
**Then** 신랑측, 신부측 계좌가 각각 카드 형태로 표시된다
**And** 각 카드에 표시되는 정보:
  - 은행명
  - 계좌번호
  - 예금주
**And** "복사" 버튼(44x44px 이상)을 클릭하면 계좌번호가 클립보드에 복사된다 (FR27)
**And** 복사 완료 Toast가 3초간 표시된다 ("계좌번호가 복사되었습니다 ✓")

**Prerequisites:** Story 4.1

**Technical Notes:**
- Clipboard API (`navigator.clipboard.writeText`)
- 터치 타겟 최소 44x44px

---

### Story 4.3: 축하 메시지 작성 (Guest)

As a Guest,
I want 신랑신부에게 축하 메시지를 남기기,
So that 진심 어린 축하를 전할 수 있다.

**Acceptance Criteria:**

**Given** 청첩장을 열람하는 중
**When** 축하 메시지 섹션이 표시되면
**Then** "축하 메시지 남기기" 버튼이 표시된다
**And** 버튼 클릭 시 메시지 작성 모달이 열린다
**And** 닉네임 입력란이 표시된다 (필수, placeholder: "이름을 입력해주세요") (FR29)
**And** 메시지 입력란이 표시된다 (Textarea) (FR28)
**And** 300자 제한, 실시간 글자 수 카운터 표시 (FR30)
**And** "보내기" 버튼 클릭 시:
  - 버튼 내 스피너 표시
  - 메시지가 저장된다
  - 모달이 닫히고 감사 Toast 표시 ("축하 메시지가 전달되었습니다 💌")
**And** 제출 후 수정할 수 없다 (FR31)
**And** 동일 브라우저에서 중복 제출 방지 (localStorage)

**Prerequisites:** Story 4.1

**Technical Notes:**
- Server Action: `createMessage`
- 스팸 방지: localStorage 기반 제출 기록
- Zod 검증: 닉네임 필수, 내용 300자 제한

---

### Story 4.4: 축하 메시지 열람 (Host)

As a Host,
I want 받은 축하 메시지를 확인,
So that 하객들의 축하를 감상할 수 있다.

**Acceptance Criteria:**

**Given** 로그인한 Host가 `/invitation/[id]/messages`에 접속하면
**When** 축하 메시지 페이지가 표시되면
**Then** 받은 축하 메시지 목록이 MessageCard 컴포넌트로 표시된다 (FR32)
**And** 각 카드에 표시되는 정보:
  - 닉네임
  - 메시지 내용
  - 작성 시간 (상대 시간: "3분 전")
  - 읽음 상태 배지 (new/read)
**And** 최신순으로 정렬된다
**And** 메시지 카드 클릭 시 읽음 처리된다 (is_read: true)
**And** 메시지는 Host만 볼 수 있다 (FR33)
**And** 권한 없는 사용자 접근 시 403 또는 리다이렉트

**Given** 아직 받은 메시지가 없으면
**When** 페이지가 표시되면
**Then** Empty State가 표시된다 ("아직 받은 메시지가 없어요 💌")
**And** 청첩장 공유 유도 버튼이 표시된다

**Prerequisites:** Story 4.3

**Technical Notes:**
- Server Action: `getMessages`, `markMessageAsRead`
- RLS 정책: 본인 청첩장의 메시지만 조회 가능
- 실시간 업데이트 고려 (선택적 - Supabase Realtime)

---

## FR Coverage Matrix

| FR ID | 설명 | Epic | Story |
|-------|------|------|-------|
| FR1 | 이메일 회원가입 | 기존 구현 | 재사용 |
| FR2 | 카카오 소셜 로그인 | 기존 구현 | 재사용 |
| FR3 | 로그인 세션 유지 | 기존 구현 | 재사용 |
| FR4 | 비밀번호 재설정 | 기존 구현 | 재사용 |
| FR5 | 새 청첩장 생성 | Epic 2 | Story 2.2 |
| FR6 | 신랑/신부 이름 입력 | Epic 2 | Story 2.2 |
| FR7 | 혼주 이름 입력 | Epic 2 | Story 2.2 |
| FR8 | 결혼 일시 입력 | Epic 2 | Story 2.2 |
| FR9 | 결혼 장소 입력 | Epic 2 | Story 2.2 |
| FR10 | 연락처 입력 | Epic 2 | Story 2.2 |
| FR11 | 계좌번호 입력 | Epic 2 | Story 2.2 |
| FR12 | 텍스트로 스타일 설명 | Epic 2 | Story 2.2 |
| FR13 | 5개 디자인 시안 생성 | Epic 2 | Story 2.3 |
| FR14 | 시안 선택 | Epic 2 | Story 2.3 |
| FR15 | 추가 결제 후 재생성 | Epic 2 | Story 2.3 |
| FR16 | 사진 10장 업로드 | Epic 2 | Story 2.4 |
| FR17 | 사진 레이아웃 자동 적용 | Epic 2 | Story 2.4 |
| FR18 | 사진 삭제/교체 | Epic 2 | Story 2.4 |
| FR19 | 결제 전 미리보기 | Epic 3 | Story 3.1 |
| FR20 | 결제 완료 | Epic 3 | Story 3.2 |
| FR21 | 결제 후 수정 가능 | Epic 3 | Story 3.3 |
| FR22 | 카카오톡 공유 | Epic 3 | Story 3.3 |
| FR23 | 링크 복사 | Epic 3 | Story 3.3 |
| FR24 | 워터마크 표시 | Epic 3 | Story 3.3 |
| FR25 | 비로그인 열람 | Epic 4 | Story 4.1 |
| FR26 | 결혼 정보 확인 | Epic 4 | Story 4.1 |
| FR27 | 계좌번호 복사 | Epic 4 | Story 4.2 |
| FR28 | 축하 메시지 작성 | Epic 4 | Story 4.3 |
| FR29 | 닉네임 입력 | Epic 4 | Story 4.3 |
| FR30 | 300자 제한 | Epic 4 | Story 4.3 |
| FR31 | 제출 후 수정 불가 | Epic 4 | Story 4.3 |
| FR32 | 축하 메시지 열람 | Epic 4 | Story 4.4 |
| FR33 | Host만 열람 가능 | Epic 4 | Story 4.4 |
| FR34 | 청첩장 목록 조회 | Epic 3 | Story 3.4 |
| FR35 | 청첩장 삭제 | Epic 3 | Story 3.4 |

**FR 커버리지:** 35/35 (100%) ✅
- FR1-4: 기존 구현 재사용
- FR5-35: 신규 구현

---

## Summary

### 에픽 요약

| Epic | 제목 | 스토리 수 | 핵심 내용 |
|------|------|----------|----------|
| 1 | 청첩장 인프라 구축 | 3 | DB 스키마, 대화형 UI 컴포넌트, 청첩장 뷰어 |
| 2 | 대화형 청첩장 생성 | 4 | 랜딩, 대화형 입력, AI 디자인, 사진 업로드 |
| 3 | 결제 및 공유 | 4 | 미리보기, Polar.sh 결제, 카카오톡 공유, 관리 |
| 4 | 게스트 경험 | 4 | 청첩장 열람, 계좌 복사, 축하 메시지 |

**총 에픽:** 4개
**총 스토리:** 15개
**FR 커버리지:** 100% (35/35)

### 기존 인프라 활용

| 항목 | 재사용 |
|------|--------|
| 인증 | Supabase Auth + Kakao OAuth |
| 미들웨어 | 세션 관리 |
| 배포 | Vercel |
| 기본 UI | Button, Input, Card, Modal, Calendar |
| DB 연결 | Drizzle ORM |

### 신규 추가 기술

| 항목 | 용도 |
|------|------|
| Claude API | AI 디자인 생성 |
| Polar.sh | 결제 처리 |
| Kakao SDK | 카카오톡 공유 |
| Framer Motion | 애니메이션 |
| Supabase Storage | 사진 저장 |

### 에픽 순서 근거

1. **Epic 1 (인프라):** DB 스키마 + 커스텀 컴포넌트 - 모든 기능의 기반
2. **Epic 2 (핵심 가치):** 대화형 AI 청첩장 생성 - 제품 차별화
3. **Epic 3 (수익화):** 결제 및 공유 - 비즈니스 모델 검증
4. **Epic 4 (완결):** Guest 경험 - 바이럴 루프 완성

각 에픽은 이전 에픽에 의존하며, **순방향 의존성만** 존재합니다.

### 다음 단계

1. **Story 1.1** - DB 스키마 생성 및 마이그레이션
2. **Story 1.2** - 대화형 UI 컴포넌트 구현
3. **Sprint Planning** - 스프린트 단위로 스토리 배치

---

## Related Documents

- PRD: `docs/prd.md`
- UX Design: `docs/ux-design-specification.md`
- Architecture: `docs/architecture-invitation.md`

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_Updated: 2025-11-30 - Architecture & UX Design 워크플로우 반영_
