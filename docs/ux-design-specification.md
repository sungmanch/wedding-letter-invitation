# 모바일 청첩장 UX Design Specification

**Author:** BMad
**Date:** 2025-12-05
**Version:** 2.0

---

## Executive Summary

**프로젝트:** 모바일 청첩장 - AI가 만들어주는 나만의 개인화 청첩장

**비전:** 프롬프트 또는 사진 기반으로 AI가 나만의 유니크한 청첩장을 만들어주는 서비스. 25개 섹션 타입, 11개 인트로 스타일, 2패널 실시간 편집으로 완전한 커스터마이징 경험 제공.

**타겟 사용자:**
- **Host (예비 신부):** 남들과 다른 특별한 청첩장을 원하는 사람
- **Guest (하객):** 청첩장을 받고 축하 메시지를 남기는 사람

**핵심 가치:**
1. AI 디자인 생성 (5개 프리뷰, 5초 이내)
2. 11개 인트로 스타일 (Cinematic, Magazine, Vinyl 등)
3. 25개 섹션 타입 (Video, Timeline, D-DAY 등)
4. 2패널 실시간 편집 (정보 입력 + 즉시 프리뷰)
5. 게스트 축하 메시지 수집

**감정적 목표:**
- Host: 자부심 - "친구들이 이거 보면 부러워하겠다"
- Guest: 감탄 - "이 청첩장 진짜 예쁘다, 어디서 만들었지?"

**플랫폼:** 모바일 First 반응형 웹

---

## 1. Design System Foundation

### 1.1 Design System Choice

**선택:** shadcn/ui + Tailwind CSS v4 + Radix UI

**근거:**
- 모던/미니멀 베이스에 웨딩 테마 커스터마이징
- Next.js 16 + React 19와 최적 호환
- 접근성 (WCAG AA) 기본 지원

**기본 제공:**
- Button, Input, Textarea, Modal, Card, Badge, Avatar, Skeleton, Toast
- Dialog, Select, Tabs (Radix)

**커스텀 컴포넌트:**
- 인트로 컴포넌트 (11개)
- 섹션 컴포넌트 (25개)
- 편집 컴포넌트 (2패널 시스템)
- 공통 컴포넌트 (디자인 카드, 로더 등)

---

## 2. Core User Experience

### 2.1 Defining Experience

**한 문장 정의:**
> "AI와 25개 섹션으로 나만의 특별한 청첩장을 만드는 서비스"

**핵심 경험 원칙:**

| 원칙 | 적용 |
|------|------|
| **Speed** | AI 프리뷰 5초, 레이아웃 10초 |
| **Real-time** | 2패널 편집으로 즉시 프리뷰 |
| **Customization** | 25개 섹션, 11개 인트로 |
| **Delight** | 풍부한 애니메이션, 인트로 효과 |

### 2.2 핵심 인터랙션

| 기존 서비스 | 우리 서비스 |
|------------|------------|
| 템플릿 선택 | AI가 생성 |
| 폼 입력 후 미리보기 | 실시간 2패널 편집 |
| 고정된 섹션 | 25개 섹션 자유 조합 |
| 단순 로딩 | 11개 인트로 스타일 |

---

## 3. Visual Foundation

### 3.1 Color System

**Primary Palette:**

| 용도 | 색상 | Hex | 사용처 |
|------|------|-----|--------|
| Primary CTA | Deep Rose | #D4768A | CTA 버튼 (접근성 통과) |
| Primary Light | Rose | #E891A0 | 호버, 액티브 상태 |
| Accent | Blush Pink | #FFB6C1 | 배경 강조, 선택 상태 |
| Accent Gold | Soft Gold | #D4AF37 | 포인트, 아이콘, 장식 |
| Accent Light | Champagne | #F7E7CE | 배지, 하이라이트 |

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
| Text Secondary | #6B7280 | 보조 텍스트 |
| Border | #E5E7EB | 구분선, 카드 테두리 |
| Background | #FFFBFC | 페이지 배경 |
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

**Border Radius:**

| 용도 | 값 | Tailwind |
|------|-----|----------|
| Button | 12px | rounded-xl |
| Card | 16px | rounded-2xl |
| Input | 12px | rounded-xl |
| Image | 16px | rounded-2xl |
| Avatar | 50% | rounded-full |

---

## 4. User Journey Flows

### 4.1 Host Journey (청첩장 생성)

```
[1. 랜딩] → [2. 회원가입] → [3. 이미지 업로드(선택)]
                                    ↓
[4. 테마 선택/AI 생성] → [5. 디자인 선택] → [6. 2패널 편집]
                                              ↓
[9. 공유] ← [8. 결제] ← [7. 미리보기]
```

**6. 2패널 편집 (핵심 플로우):**
- 좌측: 정보 입력 폼 (아코디언 방식)
- 우측: 실시간 프리뷰 (모바일 뷰)
- 섹션 순서 드래그앤드롭
- 각 섹션별 설정 커스터마이징

### 4.2 Guest Journey (청첩장 열람)

```
[1. 링크 클릭] → [2. 인트로 화면] → [3. 청첩장 열람]
                                          ↓
                           [4. 축하 메시지 작성] → [5. 완료]
                                          ↓
                              [바이럴: "나도 만들기"]
```

**Guest 핵심 포인트:**
- 인트로 스킵 기능
- 일시/장소/지도 확인
- 계좌번호 원클릭 복사
- 축하 메시지 작성

### 4.3 Host Journey (축하 메시지 열람)

```
[로그인] → [내 청첩장] → [축하 메시지 목록] → [읽음 처리]
```

---

## 5. Component Library

### 5.1 인트로 컴포넌트 (11개)

| 컴포넌트 | 설명 | 특징 |
|----------|------|------|
| **KeynoteIntro** | Apple Keynote 스타일 | Sticky text reveal |
| **CinematicIntro** | 영화적 스타일 | 16:9/4:3/21:9 비율, 필름 그레인 |
| **ExhibitionIntro** | 갤러리 전시 | 프레임 커스터마이징, 3D 네비게이션 |
| **MagazineIntro** | 매거진 커버 | Vogue/Kinfolk/Mono 스타일 |
| **VinylIntro** | LP 레코드 | 70s/80s/90s/Y2K 시대별 |
| **ChatIntro** | 메신저 스타일 | Kakao/iMessage/커스텀 |
| **GlassmorphismIntro** | 글래스 효과 | Aurora 그라디언트, 플로팅 오브젝트 |
| **PassportIntro** | 여권 스타일 | 스탬프 효과, 세계 지도 |
| **PixelIntro** | 8비트 레트로 | RPG/플랫포머/어드벤처 |
| **TypographyIntro** | 키네틱 타이포 | B&W/네온/파스텔 |
| **IntroRenderer** | 타입 라우터 | 인트로 선택/렌더링 |

**인트로 공통 기능:**
- Skip 버튼 (딜레이 설정 가능)
- BGM 지원 (볼륨, 페이드, 루프)
- Duration 설정
- Phase 애니메이션 (loading → playing → ready → completed)

### 5.2 섹션 컴포넌트 (25개 타입)

**기본 섹션 (11개):**

| 타입 | 설명 | 주요 설정 |
|------|------|----------|
| hero | 메인 히어로 | displayMode, nameOrder, showDday |
| greeting | 인사말 | template, signatureStyle |
| calendar | 달력/날짜 | displayMode, showLunarDate, showTime |
| gallery | 갤러리 | displayMode (6종), columns, autoPlay |
| location | 장소/지도 | mapProvider (4종), showDirections |
| parents | 혼주 정보 | displayMode, showDeceased |
| contact | 연락처 | showProfileImage, grouping |
| account | 계좌 정보 | showQR, showKakaoPay |
| message | 축하 메시지 | displayMode, maxLength |
| rsvp | 참석 여부 | confirmationType, mealOptions |
| closing | 푸터/엔딩 | showWatermark, style |

**확장 섹션 (14개):**

| 타입 | 설명 | 주요 설정 |
|------|------|----------|
| video | 영상 | source (YouTube/Vimeo/file), aspectRatio |
| interview | 웨딩 Q&A | displayMode, showBothAnswers |
| timeline | 타임라인 | displayMode, showConnectors |
| dday | D-DAY 카운트다운 | style (flip/digital/analog), showSeconds |
| profile | 프로필 소개 | - |
| quote | 글귀 | - |
| parents-contact | 혼주 연락처 | - |
| transport | 교통수단 | - |
| notice | 안내사항 | - |
| announcement | 안내문 | - |
| flower-gift | 화환 보내기 | - |
| together-time | 함께한 시간 | - |
| guest-snap | 게스트스냅 | - |
| ending | 엔딩 크레딧 | - |

### 5.3 편집 컴포넌트

| 컴포넌트 | 용도 | 위치 |
|----------|------|------|
| **EditClient** | 2패널 편집 클라이언트 | `/[id]/edit` |
| **EditorForm** | 정보 입력 폼 (좌측) | 아코디언 방식 |
| **EditContext** | 편집 상태 관리 | React Context |
| **SectionEditor** | 섹션별 설정 편집 | 모달/드로어 |
| **StyleEditor** | 스타일 편집 | 색상, 폰트 등 |
| **TemplateSelector** | 템플릿 변경 | 디자인 교체 |

### 5.4 공통 컴포넌트

| 컴포넌트 | 용도 | 우선순위 |
|----------|------|----------|
| InvitationViewer | 청첩장 전체 렌더러 | High |
| DesignCard | 디자인 프리뷰 카드 | High |
| DesignPreviewCard | 확대 프리뷰 | High |
| GeneratingLoader | AI 생성 로딩 | High |
| PhotoUploader | 드래그앤드롭 업로드 | High |
| SimpleImageUploader | 간단 이미지 업로드 | High |
| TemplateCard | 템플릿 선택 카드 | Medium |
| TemplateGrid | 템플릿 그리드 | Medium |
| MessageCard | 메시지 표시 | Medium |
| MessageForm | 메시지 작성 | Medium |
| MessageList | 메시지 목록 | Medium |
| TimePicker | 시간 선택 | Medium |

---

## 6. Animation System

### 6.1 Animation Types (20+)

```typescript
type AnimationType =
  | 'none'
  | 'fade'
  | 'slide' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
  | 'scale' | 'zoom' | 'zoom-in' | 'zoom-out'
  | 'rotate' | 'flip' | 'bounce'
  | 'parallax'
  | 'sticky-reveal'
  | 'typewriter'
  | 'glitch'
  | 'neon-flicker'
  | 'film-grain'
  | 'page-turn'
  | 'pixel-appear'
  | 'stamp'
  | 'kinetic-text'
  | 'magic-scroll'
```

### 6.2 Global Effects

**Background Effects:**
- solid, gradient, pattern, animated, aurora

**Particle Systems:**
- snow, petals, confetti, sparkle, hearts, pixels, stamps

**Cursor Effects:**
- default, custom, trail, hidden

**Scroll Behavior:**
- smooth, indicators, snapping

**Transitions:**
- fade, slide, zoom, blur

---

## 7. UX Pattern Decisions

### 7.1 Button Hierarchy

| 타입 | 스타일 | 용도 |
|------|--------|------|
| **Primary** | Deep Rose 배경, 흰 텍스트 | 주요 CTA |
| **Secondary** | 흰 배경, Primary 테두리 | 보조 액션 |
| **Ghost** | 투명 배경, 텍스트만 | 링크형 |
| **Destructive** | Error Red 배경 | 삭제 |

### 7.2 Feedback Patterns

| 상황 | 패턴 | 예시 |
|------|------|------|
| Success | Toast (상단, 3초) | "저장되었습니다 ✓" |
| Error | Toast (에러 색상) | "저장에 실패했습니다" |
| Loading | Button 내 스피너 | [⟳ 저장 중...] |
| AI 생성 | GeneratingLoader | 프로그레스, 애니메이션 |
| 완료 | 모달 | "청첩장이 완성됐어요!" |

### 7.3 Form Patterns (2패널 편집)

| 영역 | 패턴 | 설명 |
|------|------|------|
| 좌측 폼 | 아코디언 | 섹션별 폼 그룹 |
| 우측 프리뷰 | 실시간 업데이트 | 모바일 뷰포트 |
| 섹션 순서 | 드래그앤드롭 | 순서 변경 |
| 섹션 설정 | 드로어/모달 | 상세 설정 |

### 7.4 Navigation Patterns

| 항목 | 결정 |
|------|------|
| 헤더 | 심플 (뒤로가기 + 로고/타이틀) |
| 2패널 | 좌측 폼, 우측 프리뷰 |
| 하단 CTA | 고정 (Primary 버튼) |
| 프로그레스 | 생성 단계에서만 표시 |

### 7.5 Empty States

| 상황 | 메시지 | CTA |
|------|--------|-----|
| 청첩장 없음 | "아직 청첩장이 없어요" | [첫 청첩장 만들기] |
| 메시지 없음 | "아직 받은 메시지가 없어요" | 청첩장 공유 유도 |
| 사진 없음 | "사진을 추가해보세요" | [사진 추가] |

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

**핵심 원칙:** 모바일 First

| 디바이스 | 범위 | 레이아웃 |
|----------|------|----------|
| Mobile | < 640px | 단일 컬럼, 풀 너비 |
| Tablet | 640px - 1024px | 2패널 (편집 시) |
| Desktop | > 1024px | 2패널, max-w-6xl 중앙 |

### 8.2 Touch Optimization

| 항목 | 기준 |
|------|------|
| 터치 타겟 | 최소 44x44px |
| 버튼 높이 | 48px (py-3) |
| 입력 필드 | 48px 높이 |
| 카드 간격 | 12px (gap-3) |

### 8.3 Accessibility (WCAG AA)

**색상 대비:**
- CTA 버튼: #D4768A + White (4.5:1 이상)
- 본문: #1F2937 + Background (14:1)

**키보드 네비게이션:**
- Tab 접근 가능
- Enter/Space로 버튼 클릭
- Escape로 모달 닫기

**Focus 표시:**
```css
:focus-visible {
  outline: 2px solid #D4768A;
  outline-offset: 2px;
}
```

**스크린 리더:**
- `role`, `aria-*` 속성 적용
- `aria-live` 동적 콘텐츠
- 의미 있는 `alt` 텍스트

---

## 9. Theme System

### 9.1 Theme Categories (6개)

| 카테고리 | 설명 | 대표 인트로 |
|----------|------|------------|
| Cinematic | 영화적 | CinematicIntro |
| Playful | 유쾌한 | PixelIntro, ChatIntro |
| Artistic | 예술적 | ExhibitionIntro |
| Classic | 클래식 | KeynoteIntro |
| Modern | 모던 | GlassmorphismIntro |
| Retro | 레트로 | VinylIntro, MagazineIntro |

### 9.2 AI Fallback Previews (5개)

| 스타일 | 배경 | 텍스트 | 특징 |
|--------|------|--------|------|
| Pure & Minimalist | #FFFFFF | #1F2937 | 미니멀, 깔끔 |
| Warm & Romantic | #FFF8F5 | #8B4513 | 따뜻한, Script 폰트 |
| Classic & Elegant | #1A2744 | #F5F5DC | 네이비, 골드 악센트 |
| Modern & Editorial | #000000 | #FFFFFF | 볼드, Sans-serif |
| Garden & Natural | #FAFFF7 | #2D5016 | 내추럴, 보태니컬 |

---

## 10. Implementation Guidance

### 10.1 핵심 화면 목록

| 화면 | 설명 | 우선순위 |
|------|------|----------|
| 랜딩 페이지 | 서비스 소개 | High |
| 회원가입/로그인 | 카카오/이메일 | High |
| 이미지 업로드 | AI 분석용 (선택) | High |
| 테마 선택/AI 생성 | 5개 프리뷰 | High |
| 2패널 편집 | 정보 입력 + 프리뷰 | High |
| 미리보기 | 전체 청첩장 확인 | High |
| 결제 | Polar.sh 연동 | High |
| 공유 | 카카오톡/링크 | High |
| 청첩장 열람 (Guest) | 인트로 + 콘텐츠 | High |
| 축하 메시지 작성 | 닉네임 + 300자 | Medium |
| 메시지 목록 (Host) | 받은 메시지 | Medium |
| 내 청첩장 관리 | 목록/수정/삭제 | Medium |

### 10.2 기술 스택 연계

- **프레임워크:** Next.js 16 (App Router)
- **스타일링:** Tailwind CSS v4 + shadcn/ui
- **폰트:** Pretendard (next/font)
- **아이콘:** Lucide Icons
- **상태 관리:** React Context (EditContext)
- **지도:** 카카오맵 API
- **공유:** 카카오 SDK
- **결제:** Polar.sh

---

## Appendix

### Related Documents
- Product Requirements: `docs/prd.md`
- Architecture: `docs/architecture-invitation.md`
- Epic Breakdown: `docs/epics.md`

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-30 | 1.0 | Initial UX Design Specification | BMad |
| 2025-12-05 | 2.0 | 인트로 11개, 섹션 25개, 2패널 편집, 애니메이션 시스템 | BMad |

---

_This UX Design Specification reflects the current implementation with 11 intro styles, 25 section types, 2-panel editing, and rich animation system._
