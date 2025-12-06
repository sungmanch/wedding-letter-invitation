# Maison de Letter - Architecture Document

**Author:** BMad
**Date:** 2025-12-05
**Version:** 2.0

---

## 1. Executive Summary

모바일 청첩장 서비스의 기술 아키텍처 문서. AI 기반 디자인 생성과 25개 이상의 섹션 타입을 지원하는 확장 가능한 청첩장 플랫폼.

**핵심 기술 챌린지:**
1. AI 기반 디자인 생성 (Gemini 2.0 Flash)
2. 25개 ExtendedSectionType 지원
3. 11개 인트로 스타일 (Cinematic, Magazine, Vinyl 등)
4. 2패널 실시간 편집 시스템
5. Polar.sh 결제 연동
6. 카카오톡 공유 (Open Graph 최적화)

---

## 2. System Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│                    Next.js App (React 19)                        │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Server                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ App Router   │  │ API Routes   │  │ Server Actions       │   │
│  │ (Pages)      │  │ (/api/*)     │  │ (lib/actions)        │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│    Supabase      │ │   Gemini API     │ │    Polar.sh      │
│  ┌────────────┐  │ │                  │ │                  │
│  │ PostgreSQL │  │ │  AI Design       │ │  결제 처리        │
│  │ (Drizzle)  │  │ │  Generation      │ │                  │
│  ├────────────┤  │ └──────────────────┘ └──────────────────┘
│  │ Auth       │  │
│  │ (Kakao)    │  │           ┌──────────────────┐
│  ├────────────┤  │           │   Kakao SDK      │
│  │ Storage    │  │           │                  │
│  │ (Photos)   │  │           │  공유 기능        │
│  └────────────┘  │           └──────────────────┘
└──────────────────┘
```

---

## 3. Technology Stack

### 3.1 Core Framework

| 레이어 | 기술 | 버전 | 비고 |
|--------|------|------|------|
| Framework | Next.js | 16.0.3 | App Router |
| UI Library | React | 19.2.0 | Server Components |
| Language | TypeScript | 5.x | Strict mode |
| Styling | Tailwind CSS | 4.x | PostCSS |
| UI Components | shadcn/ui + Radix | - | 커스텀 확장 |
| Database | PostgreSQL | - | Supabase |
| ORM | Drizzle | 0.44.7 | Type-safe |
| Auth | Supabase Auth | - | Kakao OAuth |
| Hosting | Vercel | - | Seoul Region |

### 3.2 AI & External Services

| 서비스 | 기술 | 용도 |
|--------|------|------|
| AI Design | Google Gemini 2.0 Flash | 디자인 생성 |
| Payment | Polar.sh | 결제 처리 |
| Share | Kakao JavaScript SDK | 카카오톡 공유 |
| Storage | Supabase Storage | 사진 저장 (S3 호환) |
| Email | Resend | 이메일 발송 |

---

## 4. Route Structure

### 4.1 청첩장 라우트

```
src/app/
├── /                          # 랜딩 페이지
├── /login                     # 로그인
├── /signup                    # 회원가입
├── /auth/callback             # OAuth 콜백
├── /create                    # 청첩장 생성 플로우
│   └── (이미지 업로드 → 테마 선택 → AI 생성)
├── /[id]/                     # 게스트 뷰 (모바일, 공개)
├── /[id]/edit/                # 2패널 편집기 (인증 필요)
├── /[id]/photos/              # 사진 업로드
├── /[id]/preview/             # 미리보기 (인증 필요)
├── /[id]/payment/             # 결제 페이지
├── /[id]/share/               # 공유 페이지 (결제 후)
├── /[id]/messages/            # 축하 메시지 관리
├── /my/                       # 사용자 대시보드
└── /my/invitations/           # 내 청첩장 목록
```

### 4.2 API Routes

```
src/app/api/
├── /claim-event/              # 이벤트 소유권 주장
├── /wedding/webhook/          # Polar 결제 웹훅
└── /super-editor/
    ├── /chat/                 # LLM 채팅
    └── /suggestions/          # 디자인 제안
```

### 4.3 인증 요구사항

| 라우트 | 인증 | 소유권 확인 | 비고 |
|--------|------|------------|------|
| `/[id]` | 불필요 | 불필요 | 공개 열람 (published만) |
| `/create` | 필수 | - | 로그인 후 생성 |
| `/[id]/edit` | 필수 | 필수 | 본인만 편집 |
| `/[id]/preview` | 필수 | 필수 | 본인만 미리보기 |
| `/[id]/payment` | 불필요 | - | 클라이언트 사이드 |
| `/[id]/share` | 필수 | 필수 | 결제 후 접근 |
| `/[id]/messages` | 필수 | 필수 | 본인만 열람 |

---

## 5. Database Schema

### 5.1 청첩장 테이블

#### invitations

```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),

  -- 신랑/신부 정보
  groom_name VARCHAR(50) NOT NULL,
  bride_name VARCHAR(50) NOT NULL,
  groom_father_name VARCHAR(50),
  groom_mother_name VARCHAR(50),
  bride_father_name VARCHAR(50),
  bride_mother_name VARCHAR(50),

  -- 결혼 정보
  wedding_date DATE NOT NULL,
  wedding_time TIME NOT NULL,
  venue_name VARCHAR(100) NOT NULL,
  venue_address VARCHAR(255) NOT NULL,
  venue_detail VARCHAR(100),
  venue_map_url VARCHAR(500),

  -- 연락처 (신랑/신부/혼주)
  groom_phone VARCHAR(20),
  bride_phone VARCHAR(20),
  groom_father_phone VARCHAR(20),
  groom_mother_phone VARCHAR(20),
  bride_father_phone VARCHAR(20),
  bride_mother_phone VARCHAR(20),

  -- 계좌 정보
  groom_bank VARCHAR(50),
  groom_account VARCHAR(50),
  groom_account_holder VARCHAR(50),
  bride_bank VARCHAR(50),
  bride_account VARCHAR(50),
  bride_account_holder VARCHAR(50),

  -- AI 디자인
  style_prompt TEXT,
  selected_design_id UUID,

  -- 템플릿 참조
  template_id UUID REFERENCES design_templates(id),
  is_template_reuse BOOLEAN DEFAULT FALSE,

  -- 배포
  published_url VARCHAR(500),

  -- 상태
  status VARCHAR(20) DEFAULT 'draft' NOT NULL,  -- draft, published, deleted
  is_paid BOOLEAN DEFAULT FALSE NOT NULL,

  -- 메타
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### invitation_designs

```sql
CREATE TABLE invitation_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,

  -- 디자인 데이터 (InvitationDesignData v2 또는 레거시)
  design_data JSONB NOT NULL,

  generation_batch INTEGER NOT NULL,  -- 1, 2, 3... (재생성 배치)
  is_selected BOOLEAN DEFAULT FALSE NOT NULL,

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### invitation_photos

```sql
CREATE TABLE invitation_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,

  storage_path VARCHAR(500) NOT NULL,
  url VARCHAR(500) NOT NULL,
  display_order INTEGER NOT NULL,

  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### invitation_messages

```sql
CREATE TABLE invitation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,

  guest_name VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,  -- 300자 제한 (앱에서 검증)

  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### invitation_payments

```sql
CREATE TABLE invitation_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  polar_checkout_id VARCHAR(100),
  polar_order_id VARCHAR(100),
  amount INTEGER NOT NULL,  -- 9900 (원)
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,  -- pending, completed, failed, refunded

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP
);
```

### 5.2 템플릿 테이블

#### design_templates

```sql
CREATE TABLE design_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,  -- NULL이면 시스템 템플릿

  name VARCHAR(100) NOT NULL,
  description TEXT,
  source VARCHAR(20) NOT NULL,  -- 'ai-generated', 'user-created', 'system'

  -- 템플릿 데이터 (InvitationDesignData v2)
  template_data JSONB NOT NULL,

  -- AI 생성 컨텍스트
  generation_context JSONB,  -- { prompt, model, modelVersion, parameters }

  -- 큐레이션 라벨
  curation JSONB,  -- { quality, tags, category, features, curatedAt, curatedBy }

  thumbnail_url VARCHAR(500),
  is_public BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'draft' NOT NULL,  -- draft, curated, approved, rejected

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### 5.3 RLS Policies

```sql
-- invitations: 본인만 CRUD
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own invitations"
ON invitations FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- published 상태는 누구나 조회 가능 (Guest 열람)
CREATE POLICY "Anyone can view published invitations"
ON invitations FOR SELECT
USING (status = 'published');

-- invitation_messages: 누구나 작성, 본인 청첩장만 열람
CREATE POLICY "Anyone can create messages"
ON invitation_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Owners can view messages"
ON invitation_messages FOR SELECT
USING (
  invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  )
);
```

---

## 6. InvitationDesignData v2 Type System

### 6.1 Core Structure

```typescript
interface InvitationDesignData {
  version: '2.0'

  template: {
    id: string
    source: 'static' | 'ai-generated' | 'user-created'
    name?: string
  }

  globalStyles: {
    colors: ColorPalette      // primary, secondary, background, text, accent
    fonts: FontSet            // title, body, accent
    background: BackgroundConfig
  }

  intro: IntroConfig          // 11개 인트로 스타일

  sections: SectionSetting[]  // 25개 섹션 타입

  effects: EffectsConfig      // 파티클, 스크롤, 트랜지션

  sharing: SharingConfig      // OG, 카카오, SMS

  customTexts?: Record<string, string>

  meta: {
    createdAt: string
    updatedAt: string
    lastEditedBy: 'user' | 'ai'
  }
}
```

### 6.2 ExtendedSectionType (25개)

```typescript
type ExtendedSectionType =
  // 기존 섹션 (11개)
  | 'hero'              // 메인 히어로
  | 'greeting'          // 인사말
  | 'calendar'          // 달력/날짜
  | 'gallery'           // 갤러리
  | 'location'          // 장소/지도
  | 'parents'           // 혼주 정보
  | 'contact'           // 연락처
  | 'account'           // 계좌 정보
  | 'message'           // 축하 메시지
  | 'rsvp'              // 참석 여부
  | 'closing'           // 푸터/엔딩
  // 신규 섹션 (14개)
  | 'loading'           // 로딩 화면
  | 'quote'             // 글귀
  | 'profile'           // 프로필형 소개
  | 'parents-contact'   // 혼주 연락처
  | 'timeline'          // 타임라인/스토리
  | 'video'             // 영상
  | 'interview'         // 웨딩 인터뷰
  | 'transport'         // 교통수단
  | 'notice'            // 안내사항
  | 'announcement'      // 안내문
  | 'flower-gift'       // 화환 보내기
  | 'together-time'     // 함께한 시간
  | 'dday'              // D-DAY 카운트다운
  | 'guest-snap'        // 게스트스냅
  | 'ending'            // 엔딩 크레딧
```

### 6.3 인트로 타입 (11개)

```typescript
type IntroType =
  | 'keynote'           // Apple Keynote 스타일
  | 'cinematic'         // 영화적
  | 'exhibition'        // 갤러리 전시
  | 'magazine'          // 매거진 커버
  | 'vinyl'             // LP 레코드
  | 'chat'              // 메신저 스타일
  | 'glassmorphism'     // 글래스모피즘
  | 'passport'          // 여권 스타일
  | 'pixel'             // 8비트 레트로
  | 'typography'        // 키네틱 타이포
  | 'none'              // 인트로 없음
```

---

## 7. AI Design Generation

### 7.1 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Client                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ /create 페이지                                           │   │
│  │ - 이미지 업로드 (선택)                                    │   │
│  │ - 프롬프트 입력 또는 테마 선택                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │ generateDesignPreviews()
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Server Action (Stage 1)                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. 사용자 프롬프트 + 이미지(선택) 조합                     │   │
│  │ 2. Gemini API 호출                                       │   │
│  │ 3. 5개 디자인 프리뷰 생성                                 │   │
│  │    - 스타일 이름, 설명, 무드, 컬러, 폰트 추천             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │ 사용자 선택
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Server Action (Stage 2)                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ generateScreenStructure()                                 │   │
│  │ - 선택된 프리뷰 기반 상세 레이아웃 생성                    │   │
│  │ - 섹션 구성 (8-10개)                                      │   │
│  │ - 애니메이션, 이펙트 설정                                 │   │
│  │ - InvitationDesignData v2 형식으로 저장                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Design Preview Structure

```typescript
interface DesignPreview {
  id: string
  styleName: {
    en: string  // "Pure & Minimalist"
    ko: string  // "순수하고 미니멀한"
  }
  description: string  // 2-3문장 설명
  mood: string[]       // ["elegant", "clean", "modern"]
  colors: {
    background: string
    text: string
    accent: string
  }
  fontStyle: 'serif' | 'sans-serif' | 'script' | 'mixed'
  visualKeywords: string[]
  recommendations: string[]
}
```

### 7.3 Fallback System

AI 실패 시 5개 기본 프리뷰 제공:
1. Pure & Minimalist - 미니멀 화이트
2. Warm & Romantic - 따뜻한 로맨틱
3. Classic & Elegant - 클래식 엘레강스
4. Modern & Editorial - 모던 에디토리얼
5. Garden & Natural - 가든 내추럴

---

## 8. Component Architecture

### 8.1 인트로 컴포넌트 (11개)

```
src/components/invitation/intros/
├── IntroRenderer.tsx        # 인트로 타입 라우터
├── IntroPreview.tsx         # 인라인 섹션 버전
├── KeynoteIntro.tsx         # Apple Keynote 스타일
├── CinematicIntro.tsx       # 영화적 스타일
├── ExhibitionIntro.tsx      # 갤러리 전시
├── MagazineIntro.tsx        # 매거진 커버
├── VinylIntro.tsx           # LP 레코드
├── ChatIntro.tsx            # 메신저 스타일
├── GlassmorphismIntro.tsx   # 글래스모피즘
├── PassportIntro.tsx        # 여권 스타일
├── PixelIntro.tsx           # 8비트 레트로
└── TypographyIntro.tsx      # 키네틱 타이포
```

### 8.2 섹션 컴포넌트

```
src/components/invitation/sections/
├── VideoSection.tsx         # 영상 (YouTube, Vimeo, 파일)
├── InterviewSection.tsx     # 웨딩 Q&A
├── TimelineSection.tsx      # 타임라인/스토리
└── DdaySection.tsx          # D-DAY 카운트다운
```

### 8.3 편집 컴포넌트

```
src/app/[id]/edit/components/
├── EditClient.tsx           # 편집 클라이언트
├── EditorForm.tsx           # 정보 입력 폼
├── EditContext.tsx          # 편집 상태 관리
├── SectionEditor.tsx        # 섹션 편집기
├── StyleEditor.tsx          # 스타일 편집기
└── TemplateSelector.tsx     # 템플릿 선택기
```

### 8.4 공통 컴포넌트

```
src/components/invitation/
├── InvitationViewer.tsx     # 청첩장 전체 렌더러
├── DesignCard.tsx           # 디자인 카드
├── DesignPreviewCard.tsx    # 프리뷰 카드
├── GeneratingLoader.tsx     # AI 생성 로딩
├── PhotoUploader.tsx        # 사진 업로드
├── SimpleImageUploader.tsx  # 간단한 이미지 업로드
├── MessageCard.tsx          # 메시지 카드
├── MessageForm.tsx          # 메시지 작성
├── MessageList.tsx          # 메시지 목록
├── TimePicker.tsx           # 시간 선택
├── TemplateCard.tsx         # 템플릿 카드
└── TemplateGrid.tsx         # 템플릿 그리드
```

---

## 9. Server Actions

### 9.1 Actions 목록

```
src/lib/actions/
├── ai-design.ts            # AI 디자인 생성
│   ├── generateDesignPreviews()
│   ├── generateScreenStructure()
│   └── regenerateDesigns()
├── invitation.ts           # 청첩장 CRUD
│   ├── getInvitationData()
│   └── updateInvitation()
├── wedding.ts              # 웨딩 관리
├── wedding-payment.ts      # 결제 처리
├── message.ts              # 축하 메시지
│   ├── createMessage()
│   └── getMessages()
├── photo.ts                # 사진 업로드
│   └── uploadPhotos()
├── admin.ts                # 관리자 기능
├── event.ts                # 이벤트 관리
├── payment.ts              # 결제
├── recommendation.ts       # 추천
└── survey.ts               # 설문
```

---

## 10. Payment Integration (Polar.sh)

### 10.1 결제 플로우

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  /preview   │ ──▶ │  /payment   │ ──▶ │  Polar.sh   │
│  미리보기    │     │  결제 버튼   │     │  Checkout   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  /share     │ ◀── │  Webhook    │ ◀── │  결제 완료   │
│  공유       │     │  처리       │     │  9,900원    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 10.2 Webhook 처리

```typescript
// POST /api/wedding/webhook

export async function POST(request: Request) {
  const payload = await request.json()
  const signature = request.headers.get('polar-signature')

  // HMAC-SHA256 서명 검증
  if (!verifyPolarSignature(payload, signature)) {
    return new Response('Invalid signature', { status: 401 })
  }

  switch (payload.type) {
    case 'checkout.completed':
      // 결제 완료 → 청첩장 발행
      await updatePaymentStatus(payload.data.metadata.payment_id, 'completed')
      await publishInvitation(payload.data.metadata.invitation_id)
      break
    case 'order.refunded':
      await updatePaymentStatus(payload.data.metadata.payment_id, 'refunded')
      break
  }

  return new Response('OK', { status: 200 })
}
```

---

## 11. File Storage

### 11.1 Supabase Storage 구조

```
wedding-photos/
├── {user_id}/
│   ├── {invitation_id}/
│   │   ├── photo_001.jpg
│   │   ├── photo_002.jpg
│   │   └── ...
```

### 11.2 이미지 최적화

| 항목 | 처리 |
|------|------|
| 지원 포맷 | JPEG, PNG, HEIC, HEIF, WebP |
| 최대 크기 | 10MB/장 |
| 최대 개수 | 10장/청첩장 |
| 자동 변환 | WebP (Next.js Image) |

---

## 12. Theme System

### 12.1 테마 카테고리 (6개)

| 카테고리 | 설명 | 예시 키워드 |
|----------|------|------------|
| Cinematic | 영화적 | 시네마, 영화, cinematic |
| Playful | 유쾌한 | 발랄한, 재미있는, 픽셀 |
| Artistic | 예술적 | 아트, 갤러리, 전시 |
| Classic | 클래식 | 클래식, 전통, 고급 |
| Modern | 모던 | 모던, 심플, 미니멀 |
| Retro | 레트로 | 레트로, 빈티지, LP |

### 12.2 애니메이션 타입 (20+)

```typescript
type AnimationType =
  | 'none' | 'fade' | 'slide' | 'scale' | 'zoom'
  | 'rotate' | 'flip' | 'bounce' | 'parallax'
  | 'sticky-reveal' | 'typewriter' | 'glitch'
  | 'neon-flicker' | 'film-grain' | 'page-turn'
  | 'pixel-appear' | 'stamp' | 'kinetic-text' | 'magic-scroll'
```

---

## 13. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# AI
GOOGLE_AI_API_KEY=               # Gemini API

# Payment
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=

# Kakao
NEXT_PUBLIC_KAKAO_JS_KEY=

# Email
RESEND_API_KEY=

# Slack (알림)
SLACK_WEBHOOK_URL=
```

---

## 14. Performance Requirements

| 항목 | 목표 | 전략 |
|------|------|------|
| AI 프리뷰 생성 | 5초 이내 | Gemini Flash 모델 |
| 페이지 로딩 | 3초 이내 (모바일) | SSR, 이미지 최적화 |
| 사진 업로드 | 10장 동시 | 병렬 업로드, 압축 |
| LCP | 2.5초 이내 | Next.js Image, 폰트 최적화 |

---

## 15. Security

### 15.1 인증/인가

| 항목 | 구현 |
|------|------|
| 인증 | Supabase Auth (Kakao OAuth, Email) |
| 세션 | JWT 기반, 미들웨어 검증 |
| 인가 | RLS + Server Action 내 소유권 검증 |

### 15.2 데이터 보안

| 항목 | 구현 |
|------|------|
| 청첩장 URL | UUID (추측 불가능) |
| 축하 메시지 | RLS로 Host만 조회 |
| 결제 정보 | Polar.sh 위임 (민감 정보 미저장) |
| 사진 | Supabase Storage RLS |

---

## Appendix

### Related Documents
- Product Requirements: `docs/prd.md`
- UX Design Specification: `docs/ux-design-specification.md`
- Epic Breakdown: `docs/epics.md`

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-30 | 1.0 | Initial Architecture Document | BMad |
| 2025-12-05 | 2.0 | v2 섹션 시스템, Gemini AI, 인트로 컴포넌트 반영 | BMad |

---

_This architecture document reflects the current implementation of 모바일 청첩장, featuring AI-powered design generation with 25+ section types and 11 intro styles._
