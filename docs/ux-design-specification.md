# 모바일 청첩장 UX Design Specification

_Created on 2025-11-30 by BMad_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

**프로젝트:** 모바일 청첩장 - AI가 만들어주는 나만의 개인화 청첩장

**비전:** 텍스트로 설명하면 AI가 나만의 유니크한 청첩장을 만들어주는 서비스. 기존 템플릿 기반 서비스와 달리 "선택"이 아닌 "창작"하는 경험 제공.

**타겟 사용자:**
- **Host (예비 신부):** 남들과 다른 특별한 청첩장을 원하는 사람
- **Guest (하객):** 청첩장을 받고 축하 메시지를 남기는 사람

**핵심 가치:**
1. 대화형 AI로 청첩장 생성 (Gamma 스타일)
2. 10초 만에 5개 시안 생성
3. 사진/영상으로 개인화
4. 게스트 축하 메시지 수집

**감정적 목표:**
- Host: 자부심 - "친구들이 이거 보면 부러워하겠다"
- Guest: 감탄 - "이 청첩장 진짜 예쁘다, 어디서 만들었지?"

**플랫폼:** 모바일 First 반응형 웹

**UX 복잡도:** 낮음-중간
- 2개 사용자 역할 (Host, Guest)
- 주요 플로우: 대화형 생성 → 시안 선택 → 공유 → 메시지 열람

**레퍼런스:** Gamma (AI 생성 경험, 깔끔한 UI)

**차별점:** 커머스(장바구니→구매)가 아닌 크리에이션(AI와 함께 만드는) 경험

---

## 1. Design System Foundation

### 1.1 Design System Choice

**선택:** shadcn/ui + Tailwind CSS

**근거:**
- Gamma 스타일의 모던/미니멀 베이스
- 웨딩 테마(Blush Pink, Soft Gold) 커스터마이징 용이
- 빠른 개발 + 일관된 UI
- Next.js + Tailwind 기술 스택과 최적 호환

**기본 제공 (shadcn/ui):**
- Button, Input, Textarea, Modal, Card, Badge, Avatar, Skeleton, Toast

**커스텀 컴포넌트 필요:**
- ChatBubble, ChatInput (대화형 UI)
- DesignCard (AI 시안 선택)
- DatePicker, TimePicker (날짜/시간 선택)
- PhotoUploader (사진 업로드)
- InvitationViewer (청첩장 뷰어)
- MessageCard (축하 메시지)
- GeneratingLoader (AI 생성 로딩)

---

## 2. Core User Experience

### 2.1 Defining Experience

**한 문장 정의:**
> "텍스트로 설명하면 AI가 나만의 청첩장을 만들어주는 서비스"

**핵심 경험 원칙:**

| 원칙 | 적용 |
|------|------|
| **Speed** | AI 생성 10초 이내, 로딩 UX로 기대감 유발 |
| **Guidance** | 대화형으로 자연스럽게 정보 수집, 프롬프트 예시 제공 |
| **Feedback** | 생성 중 애니메이션, 선택 시 즉각 반응 |
| **Delight** | 5개 시안 공개 순간의 "와!" 경험 |

### 2.2 핵심 인터랙션

**기존 서비스 vs 우리 서비스:**

| 기존 서비스 | 우리 서비스 |
|------------|------------|
| 커머스 (장바구니 → 구매) | 크리에이션 (나만의 것을 만든다) |
| 템플릿에 나를 맞춤 | AI가 나에게 맞춤 |
| 폼 입력 (딱딱함) | 대화형 입력 (자연스러움) |
| 선택하는 느낌 | 창작하는 느낌 |

---

## 3. Visual Foundation

### 3.1 Color System

**Primary Palette:**

| 용도 | 색상 | Hex | 사용처 |
|------|------|-----|--------|
| Primary | Blush Pink | #FFB6C1 | 배경 강조, 선택 상태 |
| Primary CTA | Deep Rose | #D4768A | CTA 버튼 (접근성 통과) |
| Primary Dark | Rose | #E891A0 | 호버, 액티브 상태 |
| Accent | Soft Gold | #D4AF37 | 포인트, 아이콘, 장식 요소 |
| Accent Light | Champagne | #F7E7CE | 배지, 하이라이트 배경 |

**Semantic Colors:**

| 용도 | Hex | 사용처 |
|------|-----|--------|
| Success | #10B981 | 완료, 성공 메시지 |
| Warning | #F59E0B | 주의, 알림 |
| Error | #EF4444 | 에러, 필수 표시 |
| Info | #3B82F6 | 정보, 도움말 |

**Neutral Scale:**

| 용도 | Hex | 사용처 |
|------|-----|--------|
| Text Primary | #1F2937 | 제목, 본문 |
| Text Secondary | #6B7280 | 보조 텍스트, 플레이스홀더 |
| Border | #E5E7EB | 구분선, 카드 테두리 |
| Background | #FFFBFC | 페이지 배경 (약간 핑크빛) |
| Card Background | #FFFFFF | 카드, 모달 배경 |

### 3.2 Typography

**Font Family:** Pretendard (한글 최적화, 모던)

| 레벨 | 크기 | 무게 | 용도 |
|------|------|------|------|
| H1 | 28px | Bold (700) | 페이지 타이틀 |
| H2 | 22px | Semibold (600) | 섹션 타이틀 |
| H3 | 18px | Semibold (600) | 카드 타이틀 |
| Body | 16px | Regular (400) | 본문 |
| Small | 14px | Regular (400) | 보조 텍스트 |
| Tiny | 12px | Medium (500) | 라벨, 배지 |

### 3.3 Spacing & Border Radius

**Spacing (8px 베이스):**

| 토큰 | 값 | Tailwind |
|------|-----|----------|
| xs | 4px | p-1 |
| sm | 8px | p-2 |
| md | 16px | p-4 |
| lg | 24px | p-6 |
| xl | 32px | p-8 |
| 2xl | 48px | p-12 |

**Border Radius (웨딩 테마 - 부드러운 곡선):**

| 용도 | 값 | Tailwind |
|------|-----|----------|
| Button | 12px | rounded-xl |
| Card | 16px | rounded-2xl |
| Input | 12px | rounded-xl |
| Image | 16px | rounded-2xl |
| Avatar | 50% | rounded-full |

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**방향:** Gamma 스타일 (모던/미니멀) + 웨딩 테마 (로맨틱/따뜻함)

**레이아웃 원칙:**
- 모바일 First (단일 컬럼)
- 중앙 정렬, 여백 충분히
- 카드 기반 컨텐츠
- 고정 하단 CTA

**비주얼 스타일:**
- 깔끔하고 미니멀한 베이스
- Blush Pink + Soft Gold 포인트
- 부드러운 그림자 (shadow-sm)
- 충분한 여백으로 고급스러운 느낌

**핵심 화면 구조:**

```
┌─────────────────────────┐
│     ← Back / Logo       │  ← 심플한 헤더
├─────────────────────────┤
│                         │
│    Main Content Area    │  ← 충분한 여백
│    (Cards, Chat, AI)    │     깔끔한 카드
│                         │
├─────────────────────────┤
│   [ Primary CTA ]       │  ← 고정 하단 버튼
└─────────────────────────┘
```

---

## 5. User Journey Flows

### 5.1 Host Journey (청첩장 생성)

```
[1. 랜딩] → [2. 회원가입] → [3. 대화형 생성] → [4. 시안 선택]
                                                    ↓
[8. 공유] ← [7. 결제] ← [6. 미리보기] ← [5. 사진 업로드]
```

**3. 대화형 생성 (핵심 플로우):**

AI와 대화하며 모든 정보를 자연스럽게 수집:
- 신랑/신부 이름
- 결혼 일시 (캘린더 선택)
- 결혼 장소
- 혼주 이름
- 연락처
- 계좌번호
- 원하는 스타일 (프롬프트)

**대화형 UI 예시:**

```
🤖 "안녕하세요! 특별한 청첩장을 만들어 드릴게요 ✨
    먼저, 결혼하시는 두 분 성함을 알려주세요!"

            [ 신랑: 김민수 ]  👤

🤖 "반가워요! 신부님 성함도 알려주세요"

            [ 신부: 이수진 ]  👤

🤖 "민수님 💑 수진님, 축하드려요!
    결혼식은 언제인가요?"

        [ 📅 날짜 선택하기 ]  → 캘린더 피커

🤖 "봄 결혼식이네요! 🌸 몇 시에 진행하시나요?"

        [ ⏰ 시간 선택하기 ]  → 타임 피커

    ... (장소, 혼주, 연락처, 계좌 입력) ...

🤖 "거의 다 됐어요! 마지막으로,
    어떤 느낌의 청첩장을 원하세요?

    예시:
    • 봄처럼 따뜻하고 화사하게
    • 모던하고 심플하게
    • 클래식하고 우아하게"

            [ 봄 야외 결혼식 느낌으로
              따뜻하고 로맨틱하게 ✨ ]  👤

🤖 "완벽해요! 민수님과 수진님만의
    특별한 청첩장을 만들어 드릴게요"

        [ 🎨 청첩장 생성하기 ]
```

### 5.2 Guest Journey (청첩장 열람)

```
[1. 링크 클릭] → [2. 청첩장 열람] → [3. 축하 메시지 작성] → [4. 완료]
                       ↓
                [바이럴: "나도 만들기"]
```

**Guest 핵심 포인트:**
- 로그인 없이 열람
- 아름다운 청첩장 디자인 (감탄 유발)
- 일시/장소/지도 쉽게 확인
- 계좌번호 원클릭 복사
- 축하 메시지 남기기 (선택)
- "어디서 만들었지?" → 서비스 인지 → 바이럴

### 5.3 Host Journey (축하 메시지 열람)

```
[로그인] → [내 청첩장] → [축하 메시지 목록] → [메시지 상세]
```

---

## 6. Component Library

### 6.1 커스텀 컴포넌트

#### ChatBubble
- **용도:** 대화형 정보 입력 UI
- **Variants:** `ai` (좌측, 회색), `user` (우측, Primary)
- **States:** default, typing (타이핑 애니메이션)

#### ChatInput
- **용도:** 대화 중 사용자 입력
- **Variants:** `text`, `date`, `time`, `address`, `account`
- **States:** default, focus, filled, error

#### DatePicker
- **용도:** 결혼 날짜 선택
- **Features:** 월 이동, 날짜 선택, 요일 표시
- **제한:** 과거 날짜 비활성화
- **스타일:** 선택된 날짜 Primary 색상

#### TimePicker
- **용도:** 결혼 시간 선택
- **Features:** 오전/오후, 시, 분 스크롤 선택
- **기본값:** 오후 12:00
- **단위:** 30분 단위

#### DesignCard
- **용도:** AI 생성 시안 5개 선택
- **States:** default, hover, selected
- **인터랙션:** 클릭 시 선택, 단일 선택

#### PhotoUploader
- **용도:** 최대 10장 사진 업로드
- **Features:** 드래그앤드롭, 순서 변경, 삭제
- **States:** empty, uploading, filled

#### InvitationViewer
- **용도:** 완성된 청첩장 표시
- **Sections:** AI 디자인, 정보, 갤러리, 지도, 연락처, 계좌, 메시지
- **States:** preview (Host), published (Guest)

#### MessageCard
- **용도:** Host가 받은 축하 메시지 열람
- **States:** new, read
- **Features:** 닉네임, 메시지 (300자), 작성시간

#### GeneratingLoader
- **용도:** AI 시안 생성 중 (10초)
- **Features:** 프로그레스 바, 사용자 프롬프트 표시, 애니메이션
- **UX 목표:** 기대감 유발, 지루함 방지

### 6.2 컴포넌트 우선순위

| 컴포넌트 | 사용 화면 | 우선순위 |
|----------|----------|----------|
| ChatBubble | 대화형 생성 | 🔴 High |
| ChatInput | 대화형 생성 | 🔴 High |
| DatePicker | 대화형 생성 | 🔴 High |
| TimePicker | 대화형 생성 | 🔴 High |
| DesignCard | 시안 선택 | 🔴 High |
| GeneratingLoader | AI 생성 중 | 🔴 High |
| InvitationViewer | 미리보기, Guest 열람 | 🔴 High |
| PhotoUploader | 사진 업로드 | 🟡 Medium |
| MessageCard | 축하 메시지 열람 | 🟡 Medium |

---

## 7. UX Pattern Decisions

### 7.1 Button Hierarchy

| 타입 | 스타일 | 용도 |
|------|--------|------|
| **Primary** | Deep Rose (#D4768A) 배경, 흰 텍스트 | 주요 액션 (생성, 다음, 결제) |
| **Secondary** | 흰 배경, Primary 테두리 | 보조 액션 (이전, 건너뛰기) |
| **Ghost** | 투명 배경, 텍스트만 | 링크형 액션 (취소, 더보기) |
| **Destructive** | Error Red 배경 | 삭제, 탈퇴 |

### 7.2 Feedback Patterns

| 상황 | 패턴 | 예시 |
|------|------|------|
| **Success** | Toast (상단, 3초 자동 닫힘) | "저장되었습니다 ✓" |
| **Error** | AI 버블로 친절하게 재요청 | "날짜 형식이 맞지 않아요" |
| **Loading** | Button 내 스피너 | [⟳ 저장 중...] |
| **AI 생성** | 전용 로딩 화면 | GeneratingLoader |
| **완료** | 모달 (축하 메시지) | "청첩장이 완성됐어요! 🎉" |

### 7.3 Form Patterns (대화형)

| 입력 타입 | 패턴 | UI |
|----------|------|-----|
| **텍스트** | 일반 입력 필드 | ChatInput |
| **날짜** | 캘린더 피커 | DatePicker 모달 |
| **시간** | 시간 선택 | TimePicker (스크롤) |
| **주소** | 입력 + 지도 검색 | ChatInput + 카카오맵 |
| **계좌** | 은행 선택 + 번호 | Select + Input |

### 7.4 Navigation Patterns

| 항목 | 결정 |
|------|------|
| **헤더** | 심플 (뒤로가기 + 로고/타이틀) |
| **뒤로가기** | 이전 단계로 (대화 히스토리 유지) |
| **프로그레스** | 단계 화면에서만 표시 |
| **하단 CTA** | 고정 (Primary 버튼) |

### 7.5 Empty States

| 상황 | 메시지 | CTA |
|------|--------|-----|
| 청첩장 없음 | "아직 청첩장이 없어요" | [첫 청첩장 만들기] |
| 축하 메시지 없음 | "아직 받은 메시지가 없어요 💌" | 청첩장 공유 유도 |
| 사진 없음 | "사진을 추가해보세요" | [사진 추가] |

### 7.6 Confirmation Patterns

| 상황 | 패턴 |
|------|------|
| 청첩장 삭제 | 모달 확인 ("정말 삭제할까요?") |
| 결제 취소 | 모달 확인 + 환불 안내 |
| 작성 중 이탈 | 자동 저장 (확인 불필요) |
| 시안 재생성 | 모달 확인 (추가 결제 안내) |

### 7.7 Sharing Patterns

| 방법 | UX |
|------|-----|
| **카카오톡** | 원클릭 공유, OG 이미지 최적화 |
| **링크 복사** | 복사 완료 Toast, URL 단축 |

### 7.8 Account Copy Pattern

계좌번호 복사 시:
- [복사] 버튼 클릭
- Toast: "계좌번호가 복사되었습니다 ✓"

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

**핵심 원칙:** 모바일 First → 데스크탑에서도 모바일 레이아웃 유지

| 디바이스 | 범위 | 레이아웃 |
|----------|------|----------|
| **Mobile** | < 640px | 단일 컬럼, 풀 너비 |
| **Tablet** | 640px - 1024px | 단일 컬럼, max-w-lg 중앙 정렬 |
| **Desktop** | > 1024px | 단일 컬럼, max-w-md 중앙 정렬 |

### 8.2 Touch Optimization

| 항목 | 기준 |
|------|------|
| **터치 타겟** | 최소 44x44px |
| **버튼 높이** | 48px (py-3) |
| **입력 필드** | 48px 높이 |
| **카드 간격** | 12px (gap-3) |

### 8.3 Accessibility (WCAG AA)

**색상 대비:**
- CTA 버튼: #D4768A + White (4.5:1 이상)
- 본문: #1F2937 + Background (14:1)

**키보드 네비게이션:**
- 모든 인터랙티브 요소 Tab 접근 가능
- Enter/Space로 버튼 클릭
- 방향키로 시안/날짜 선택
- Escape로 모달 닫기

**Focus 표시:**
```css
:focus-visible {
  outline: 2px solid #D4768A;
  outline-offset: 2px;
}
```

**스크린 리더:**
- 시안 카드: `role="radio"`, `aria-checked`
- 프로그레스: `aria-valuenow`, `aria-valuemax`
- 로딩: `aria-live="polite"`
- 모달: `role="dialog"`, `aria-modal="true"`

---

## 9. Implementation Guidance

### 9.1 핵심 화면 목록

| 화면 | 설명 | 우선순위 |
|------|------|----------|
| 랜딩 페이지 | 서비스 소개, CTA | 🔴 High |
| 회원가입/로그인 | 카카오/이메일 | 🔴 High |
| 대화형 생성 | AI 대화로 정보 수집 | 🔴 High |
| AI 시안 선택 | 5개 시안 중 선택 | 🔴 High |
| 사진 업로드 | 최대 10장 | 🔴 High |
| 미리보기 | 완성된 청첩장 확인 | 🔴 High |
| 결제 | Polar.sh 연동 | 🔴 High |
| 공유 | 카카오톡/링크 복사 | 🔴 High |
| 청첩장 열람 (Guest) | 게스트 뷰 | 🔴 High |
| 축하 메시지 작성 | 닉네임 + 300자 | 🟡 Medium |
| 메시지 목록 (Host) | 받은 메시지 열람 | 🟡 Medium |
| 내 청첩장 관리 | 목록, 수정, 삭제 | 🟡 Medium |

### 9.2 기술 스택 연계

- **프레임워크:** Next.js 14+ (App Router)
- **스타일링:** Tailwind CSS + shadcn/ui
- **폰트:** Pretendard (next/font)
- **아이콘:** Lucide Icons
- **애니메이션:** Framer Motion (로딩, 전환)
- **지도:** 카카오맵 API
- **공유:** 카카오 SDK

---

## Appendix

### Related Documents
- Product Requirements: `docs/prd.md`
- Epic Breakdown: `docs/epics.md`

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-30 | 1.0 | Initial UX Design Specification | BMad |

---

_This UX Design Specification was created through collaborative design facilitation, not template generation. All decisions were made with user input and are documented with rationale._
