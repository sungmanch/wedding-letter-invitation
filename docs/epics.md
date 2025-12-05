# 모바일 청첩장 - Epic Breakdown v2.0

**Author:** BMad
**Date:** 2025-12-05
**Updated:** 2025-12-05 (현재 구현 상태 반영)
**Project Level:** Level 3 (Product)
**Target Scale:** MVP → Growth

---

## Overview

이 문서는 모바일 청첩장 PRD의 요구사항을 구현 가능한 에픽과 스토리로 분해합니다.

**현재 상태:** MVP 완료 (6개 Epic, 24개 Story 구현 완료)

**관련 문서:**
- PRD: `docs/prd.md`
- UX Design: `docs/ux-design-specification.md`
- Architecture: `docs/architecture-invitation.md`

---

## Epic Summary

| Epic | 제목 | 스토리 수 | 핵심 가치 | 상태 |
|------|------|----------|----------|------|
| 1 | 청첩장 인프라 구축 | 4 | DB 스키마 + 컴포넌트 시스템 | ✅ Done |
| 2 | 청첩장 생성 플로우 | 4 | 이미지 → 테마 → AI 생성 | ✅ Done |
| 3 | 2패널 편집 시스템 | 4 | 정보 입력 + 실시간 프리뷰 | ✅ Done |
| 4 | 결제 및 공유 | 4 | Polar.sh 결제, 카카오톡 공유 | ✅ Done |
| 5 | 게스트 경험 | 4 | 열람 + 메시지 + 계좌 복사 | ✅ Done |
| 6 | 확장 섹션 시스템 | 4 | Video, Timeline, Interview, D-day | ✅ Done |

**총 에픽:** 6개 / **총 스토리:** 24개 / **상태:** 100% 완료

---

## FR Coverage Map (v2.0)

```
기존 구현 (재사용):     FR1-4 (Supabase Auth + Kakao OAuth)
Epic 1 (인프라 구축):   DB 스키마, 11 인트로, 25 섹션 컴포넌트
Epic 2 (생성 플로우):   FR5, FR12-15 (이미지 업로드 → 테마 선택 → AI 생성)
Epic 3 (편집 시스템):   FR6-11, FR16-18 (2패널 편집, 사진 업로드)
Epic 4 (결제 및 공유):  FR19-24, FR34-35 (미리보기, 결제, 공유, 관리)
Epic 5 (게스트 경험):   FR25-33 (열람, 메시지, 계좌 복사)
Epic 6 (확장 섹션):     FR36-54 (인트로 스타일, 확장 섹션)
```

**FR 커버리지:** 54/54 (100%)

---

## Epic 1: 청첩장 인프라 구축 ✅

**목표:** 청첩장 서비스에 필요한 DB 스키마와 컴포넌트 시스템 구축

**상태:** 완료

### Story 1.1: 청첩장 DB 스키마 ✅

**완료된 기능:**
- `invitations` 테이블 (청첩장 기본 정보 + design_data JSONB)
- `invitation_photos` 테이블 (사진 업로드)
- `invitation_messages` 테이블 (축하 메시지)
- `invitation_payments` 테이블 (결제 정보)
- `design_templates` 테이블 (AI 템플릿 저장)
- `super_editor_*` 테이블 (Super Editor 지원)
- RLS 정책 설정 완료

**구현 파일:**
- `src/lib/db/invitation-schema.ts`
- `src/lib/db/template-schema.ts`
- `src/lib/db/super-editor-schema.ts`

---

### Story 1.2: 인트로 컴포넌트 시스템 ✅

**완료된 기능:**
- 11개 인트로 스타일 구현
- IntroRenderer 통합 컴포넌트
- IntroPreview (편집 모드)

**구현된 인트로 (11개):**
| 컴포넌트 | 스타일 | 설명 |
|----------|--------|------|
| KeynoteIntro | 클래식 | Apple Keynote 스타일 |
| CinematicIntro | 시네마틱 | 영화 타이틀 시퀀스 |
| ExhibitionIntro | 아트 | 갤러리 전시 스타일 |
| MagazineIntro | 모던 | 패션 매거진 레이아웃 |
| VinylIntro | 레트로 | LP 레코드 디자인 |
| ChatIntro | 플레이풀 | 메시지 대화 형식 |
| GlassmorphismIntro | 모던 | 반투명 글래스 효과 |
| PassportIntro | 빈티지 | 여행 여권 스탬프 |
| PixelIntro | 레트로 | 8비트 픽셀 아트 |
| TypographyIntro | 아트 | 타이포 중심 레이아웃 |
| TypewriterIntro | 빈티지 | 타자기 효과 |

**구현 파일:**
- `src/components/invitation/intros/*.tsx`
- `src/components/invitation/IntroRenderer.tsx`

---

### Story 1.3: 섹션 컴포넌트 시스템 ✅

**완료된 기능:**
- 25개 ExtendedSectionType 지원
- 각 섹션별 전용 컴포넌트

**기본 섹션 (11개):**
- intro, greeting, couple-info, wedding-info, gallery
- location, contact, account, message, closing, rsvp

**확장 섹션 (14개):**
- video, interview, timeline, dday, live-streaming
- gift-registry, dress-code, parking-info, accommodation
- schedule, music-playlist, photo-booth, honeymoon, wishes

**구현 파일:**
- `src/components/invitation/sections/*.tsx`
- `src/lib/types/invitation-design.ts`

---

### Story 1.4: InvitationViewer 통합 ✅

**완료된 기능:**
- InvitationViewer 컴포넌트 (전체 청첩장 렌더링)
- 인트로 → 섹션 순차 스크롤
- 애니메이션 시스템 (20+ 타입)
- 모바일 퍼스트 반응형

**구현 파일:**
- `src/components/invitation/InvitationViewer.tsx`

---

## Epic 2: 청첩장 생성 플로우 ✅

**목표:** 이미지 업로드 → 테마 선택 → AI 디자인 생성 플로우

**상태:** 완료

### Story 2.1: 랜딩 페이지 ✅

**완료된 기능:**
- 서비스 가치 제안 ("AI가 만들어주는 나만의 청첩장")
- "청첩장 만들기" CTA 버튼
- AI 생성 예시 갤러리
- SEO 메타 태그

**구현 파일:**
- `src/app/page.tsx`

---

### Story 2.2: 이미지 업로드 (선택) ✅

**완료된 기능:**
- SimpleImageUploader 컴포넌트
- 이미지 기반 AI 분석 (선택사항)
- 스킵 가능 (이미지 없이 진행)

**구현 파일:**
- `src/app/create/page.tsx`
- `src/components/invitation/SimpleImageUploader.tsx`

---

### Story 2.3: 테마 선택 ✅

**완료된 기능:**
- 6개 테마 카테고리 (Cinematic, Playful, Artistic, Classic, Modern, Retro)
- TemplateGrid, TemplateCard 컴포넌트
- 카테고리별 필터링

**구현 파일:**
- `src/lib/themes/schema.ts`
- `src/components/invitation/TemplateSelector.tsx`

---

### Story 2.4: AI 디자인 생성 ✅

**완료된 기능:**
- Gemini 2.0 Flash 기반 AI 생성
- 5개 디자인 프리뷰 생성 (generateDesignPreviews)
- 선택된 디자인 상세 레이아웃 생성 (generateScreenStructure)
- 10초 이내 생성 완료

**구현 파일:**
- `src/lib/actions/ai-design.ts`

---

## Epic 3: 2패널 편집 시스템 ✅

**목표:** 정보 입력 + 실시간 프리뷰 동시 편집

**상태:** 완료

### Story 3.1: 2패널 레이아웃 ✅

**완료된 기능:**
- 좌측: 정보 입력 패널 (폼)
- 우측: 실시간 프리뷰 (InvitationViewer)
- 반응형 (모바일: 탭 전환)

**구현 파일:**
- `src/app/[id]/edit/page.tsx`

---

### Story 3.2: 섹션 편집기 ✅

**완료된 기능:**
- SectionEditor 컴포넌트
- 섹션 순서 변경 (드래그앤드롭)
- 섹션 활성화/비활성화
- 섹션별 설정 커스터마이징

**구현 파일:**
- `src/app/[id]/edit/components/SectionEditor.tsx`

---

### Story 3.3: 스타일 편집기 ✅

**완료된 기능:**
- StyleEditor 컴포넌트
- 글로벌 색상/폰트 변경
- 인트로 스타일 변경
- 애니메이션 설정

**구현 파일:**
- `src/app/[id]/edit/components/StyleEditor.tsx`

---

### Story 3.4: 사진 업로드 ✅

**완료된 기능:**
- PhotoUploader 컴포넌트
- 최대 10장 업로드
- 드래그앤드롭 순서 변경
- Supabase Storage 연동

**구현 파일:**
- `src/app/[id]/photos/page.tsx`

---

## Epic 4: 결제 및 공유 ✅

**목표:** 미리보기, Polar.sh 결제, 카카오톡 공유

**상태:** 완료

### Story 4.1: 청첩장 미리보기 ✅

**완료된 기능:**
- 전체 청첩장 미리보기
- 게스트 뷰와 동일한 렌더링
- 수정하기/결제하기 버튼

**구현 파일:**
- `src/app/[id]/preview/page.tsx`

---

### Story 4.2: Polar.sh 결제 ✅

**완료된 기능:**
- Polar.sh 체크아웃 연동
- 9,900원 결제
- 웹훅 처리 (checkout.completed)
- 결제 완료 → published 상태 변경

**구현 파일:**
- `src/app/[id]/payment/page.tsx`
- `src/app/api/invitation/payment/webhook/route.ts`

---

### Story 4.3: 카카오톡 공유 ✅

**완료된 기능:**
- Kakao SDK 연동
- 링크 복사 기능
- Open Graph 동적 메타 태그
- 서비스 워터마크

**구현 파일:**
- `src/app/[id]/share/page.tsx`

---

### Story 4.4: 내 청첩장 관리 ✅

**완료된 기능:**
- 청첩장 목록 조회
- 상태별 필터 (작성중/결제완료)
- 청첩장 삭제 (soft delete)

**구현 파일:**
- `src/app/my/invitations/page.tsx`

---

## Epic 5: 게스트 경험 ✅

**목표:** 게스트가 청첩장 열람, 메시지 작성, 계좌 복사

**상태:** 완료

### Story 5.1: 청첩장 열람 (Guest) ✅

**완료된 기능:**
- 로그인 없이 열람
- InvitationViewer 렌더링
- 모바일 전용 뷰
- noindex 메타 태그

**구현 파일:**
- `src/app/[id]/page.tsx`

---

### Story 5.2: 축하 메시지 작성 ✅

**완료된 기능:**
- MessageForm 컴포넌트
- 닉네임 필수 입력
- 300자 제한
- 중복 제출 방지

**구현 파일:**
- `src/components/invitation/sections/MessageSection.tsx`

---

### Story 5.3: 계좌번호 복사 ✅

**완료된 기능:**
- 신랑측/신부측 계좌 카드
- 복사 버튼 (Clipboard API)
- 복사 완료 Toast

**구현 파일:**
- `src/components/invitation/sections/AccountSection.tsx`

---

### Story 5.4: 축하 메시지 열람 (Host) ✅

**완료된 기능:**
- 메시지 목록 조회
- 읽음 상태 관리
- Host 전용 접근 (RLS)

**구현 파일:**
- `src/app/[id]/messages/page.tsx`

---

## Epic 6: 확장 섹션 시스템 ✅

**목표:** 고급 섹션 컴포넌트 구현

**상태:** 완료

### Story 6.1: VideoSection ✅

**완료된 기능:**
- YouTube/Vimeo 임베드
- 자동 재생 옵션
- 반응형 비디오 플레이어

**구현 파일:**
- `src/components/invitation/sections/VideoSection.tsx`

---

### Story 6.2: DdaySection ✅

**완료된 기능:**
- D-day 카운트다운
- 실시간 업데이트
- 커스텀 스타일링

**구현 파일:**
- `src/components/invitation/sections/DdaySection.tsx`

---

### Story 6.3: TimelineSection ✅

**완료된 기능:**
- 커플 스토리 타임라인
- 날짜 + 이벤트 구조
- 스크롤 애니메이션

**구현 파일:**
- `src/components/invitation/sections/TimelineSection.tsx`

---

### Story 6.4: InterviewSection ✅

**완료된 기능:**
- 웨딩 인터뷰 Q&A
- 신랑/신부 답변 형식
- 카드 레이아웃

**구현 파일:**
- `src/components/invitation/sections/InterviewSection.tsx`

---

## FR Coverage Matrix (v2.0)

| FR ID | 설명 | Epic | 상태 |
|-------|------|------|------|
| FR1-4 | 사용자 인증 | 기존 | ✅ |
| FR5 | 새 청첩장 생성 | Epic 2 | ✅ |
| FR6-11 | 기본 정보 입력 | Epic 3 | ✅ |
| FR12-15 | AI 디자인 생성 | Epic 2 | ✅ |
| FR16-18 | 사진 업로드 | Epic 3 | ✅ |
| FR19-21 | 미리보기 및 결제 | Epic 4 | ✅ |
| FR22-24 | 공유 | Epic 4 | ✅ |
| FR25-27 | 게스트 열람 | Epic 5 | ✅ |
| FR28-33 | 축하 메시지 | Epic 5 | ✅ |
| FR34-35 | 청첩장 관리 | Epic 4 | ✅ |
| FR36-41 | 인트로 스타일 | Epic 1 | ✅ |
| FR42-47 | 확장 섹션 설정 | Epic 6 | ✅ |
| FR48-51 | 2패널 편집 | Epic 3 | ✅ |
| FR52-54 | 애니메이션 시스템 | Epic 1 | ✅ |

**FR 커버리지:** 54/54 (100%) ✅

---

## 기술 스택 Summary

### 프레임워크
- Next.js 16 + React 19 + TypeScript 5
- Tailwind CSS v4 + shadcn/ui + Radix UI

### 데이터베이스
- Supabase (PostgreSQL + Auth + Storage)
- Drizzle ORM 0.44.7

### AI
- Google Gemini 2.0 Flash (디자인 생성)

### 결제
- Polar.sh (9,900원)

### 공유
- Kakao JavaScript SDK

---

## Related Documents

- PRD: `docs/prd.md`
- UX Design: `docs/ux-design-specification.md`
- Architecture: `docs/architecture-invitation.md`

---

_Updated: 2025-12-05 - 현재 구현 상태 반영 (v2.0)_
