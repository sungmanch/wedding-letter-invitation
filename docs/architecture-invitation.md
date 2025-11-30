# 모바일 청첩장 - Architecture Document

**Author:** BMad
**Date:** 2025-11-30
**Version:** 1.0

---

## 1. Executive Summary

모바일 청첩장 서비스의 기술 아키텍처 문서. 기존 청모장 프로젝트의 인프라를 활용하면서, 새로운 청첩장 기능을 별도 모듈로 추가한다.

**핵심 기술 챌린지:**
1. AI 기반 디자인 생성 (10초 이내)
2. 사진 업로드 및 처리 (최대 10장)
3. 결제 연동 (Polar.sh)
4. 카카오톡 공유 (Open Graph 최적화)

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
│    Supabase      │ │   Claude API     │ │    Polar.sh      │
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

### 2.2 기존 시스템과의 관계

```
┌─────────────────────────────────────────────────────────────────┐
│                      기존 레거시 (청모장)                         │
│  Routes: /my, /event/*, /survey/*                               │
│  Tables: events, surveyResponses, letters, restaurantRec...     │
│  ─────────────────────────────────────────────────────────────  │
│                      신규 추가 (청첩장)                           │
│  Routes: /invitation/*, /my/invitations                         │
│  Tables: invitations, invitation_designs, invitation_photos...  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  공유 리소스       │
                    │  - Supabase Auth  │
                    │  - Middleware     │
                    │  - UI Components  │
                    └──────────────────┘
```

---

## 3. Technology Stack

### 3.1 기존 유지 (재사용)

| 레이어 | 기술 | 버전 | 비고 |
|--------|------|------|------|
| Framework | Next.js | 16.0.3 | App Router |
| UI Library | React | 19.2.0 | - |
| Language | TypeScript | 5.x | - |
| Styling | Tailwind CSS | 4.x | - |
| UI Components | shadcn/ui | - | 커스텀 확장 |
| Database | PostgreSQL | - | Supabase |
| ORM | Drizzle | 0.44.7 | - |
| Auth | Supabase Auth | - | Kakao OAuth |
| Hosting | Vercel | - | - |

### 3.2 신규 추가

| 레이어 | 기술 | 용도 |
|--------|------|------|
| AI | Anthropic Claude API | 디자인 생성 |
| Payment | Polar.sh | 결제 처리 |
| Share | Kakao JavaScript SDK | 카카오톡 공유 |
| Storage | Supabase Storage | 사진 저장 |
| Animation | Framer Motion | 로딩/전환 효과 |

---

## 4. Database Schema

### 4.1 신규 테이블 (청첩장)

#### invitations (청첩장)

```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

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

  -- 연락처
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

  -- AI 프롬프트 및 디자인
  style_prompt TEXT,
  selected_design_id UUID,

  -- 상태
  status VARCHAR(20) DEFAULT 'draft' NOT NULL, -- draft, published, deleted
  is_paid BOOLEAN DEFAULT FALSE NOT NULL,

  -- 메타
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### invitation_designs (AI 생성 디자인)

```sql
CREATE TABLE invitation_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,

  -- 디자인 데이터 (JSON)
  design_data JSONB NOT NULL,
  -- {
  --   theme: 'spring_romantic',
  --   colors: { primary: '#FFB6C1', secondary: '#D4AF37' },
  --   layout: 'classic',
  --   fonts: { title: 'Noto Serif', body: 'Pretendard' },
  --   decorations: ['floral_top', 'gold_border'],
  --   thumbnail_url: 'https://...'
  -- }

  generation_batch INTEGER NOT NULL, -- 1, 2, 3... (재생성 배치)
  is_selected BOOLEAN DEFAULT FALSE NOT NULL,

  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### invitation_photos (사진)

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

#### invitation_messages (축하 메시지)

```sql
CREATE TABLE invitation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,

  guest_name VARCHAR(50) NOT NULL,
  content TEXT NOT NULL, -- 300자 제한 (앱에서 검증)

  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### invitation_payments (결제)

```sql
CREATE TABLE invitation_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  polar_checkout_id VARCHAR(100),
  polar_order_id VARCHAR(100),
  amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, completed, failed, refunded

  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP
);
```

### 4.2 Drizzle Schema

```typescript
// src/lib/db/invitation-schema.ts

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  time,
  boolean,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core'

export const invitations = pgTable('invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),

  // 신랑/신부 정보
  groomName: varchar('groom_name', { length: 50 }).notNull(),
  brideName: varchar('bride_name', { length: 50 }).notNull(),
  groomFatherName: varchar('groom_father_name', { length: 50 }),
  groomMotherName: varchar('groom_mother_name', { length: 50 }),
  brideFatherName: varchar('bride_father_name', { length: 50 }),
  brideMotherName: varchar('bride_mother_name', { length: 50 }),

  // 결혼 정보
  weddingDate: date('wedding_date').notNull(),
  weddingTime: time('wedding_time').notNull(),
  venueName: varchar('venue_name', { length: 100 }).notNull(),
  venueAddress: varchar('venue_address', { length: 255 }).notNull(),
  venueDetail: varchar('venue_detail', { length: 100 }),
  venueMapUrl: varchar('venue_map_url', { length: 500 }),

  // 연락처
  groomPhone: varchar('groom_phone', { length: 20 }),
  bridePhone: varchar('bride_phone', { length: 20 }),
  groomFatherPhone: varchar('groom_father_phone', { length: 20 }),
  groomMotherPhone: varchar('groom_mother_phone', { length: 20 }),
  brideFatherPhone: varchar('bride_father_phone', { length: 20 }),
  brideMotherPhone: varchar('bride_mother_phone', { length: 20 }),

  // 계좌 정보
  groomBank: varchar('groom_bank', { length: 50 }),
  groomAccount: varchar('groom_account', { length: 50 }),
  groomAccountHolder: varchar('groom_account_holder', { length: 50 }),
  brideBank: varchar('bride_bank', { length: 50 }),
  brideAccount: varchar('bride_account', { length: 50 }),
  brideAccountHolder: varchar('bride_account_holder', { length: 50 }),

  // AI 프롬프트 및 디자인
  stylePrompt: text('style_prompt'),
  selectedDesignId: uuid('selected_design_id'),

  // 상태
  status: varchar('status', { length: 20 }).default('draft').notNull(),
  isPaid: boolean('is_paid').default(false).notNull(),

  // 메타
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}).enableRLS()

export const invitationDesigns = pgTable('invitation_designs', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id').references(() => invitations.id, { onDelete: 'cascade' }).notNull(),
  designData: jsonb('design_data').notNull(),
  generationBatch: integer('generation_batch').notNull(),
  isSelected: boolean('is_selected').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS()

export const invitationPhotos = pgTable('invitation_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id').references(() => invitations.id, { onDelete: 'cascade' }).notNull(),
  storagePath: varchar('storage_path', { length: 500 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  displayOrder: integer('display_order').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS()

export const invitationMessages = pgTable('invitation_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id').references(() => invitations.id, { onDelete: 'cascade' }).notNull(),
  guestName: varchar('guest_name', { length: 50 }).notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}).enableRLS()

export const invitationPayments = pgTable('invitation_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitation_id').references(() => invitations.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').notNull(),
  polarCheckoutId: varchar('polar_checkout_id', { length: 100 }),
  polarOrderId: varchar('polar_order_id', { length: 100 }),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
}).enableRLS()
```

### 4.3 RLS Policies

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

-- invitation_messages: 누구나 작성 가능, 본인 청첩장만 열람 가능
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

## 5. API Design

### 5.1 Server Actions (권장)

Next.js Server Actions를 사용하여 데이터 처리. API Route 대신 Server Action 우선.

```typescript
// src/lib/actions/invitation.ts

'use server'

// 청첩장 생성
export async function createInvitation(formData: InvitationFormData)

// 청첩장 조회
export async function getInvitation(id: string)
export async function getMyInvitations()

// 청첩장 수정
export async function updateInvitation(id: string, data: Partial<InvitationFormData>)

// 청첩장 삭제
export async function deleteInvitation(id: string)

// 청첩장 발행
export async function publishInvitation(id: string)
```

```typescript
// src/lib/actions/invitation-design.ts

'use server'

// AI 디자인 생성 (5개)
export async function generateDesigns(invitationId: string, prompt: string)

// 디자인 선택
export async function selectDesign(invitationId: string, designId: string)

// 디자인 재생성 (추가 결제 필요)
export async function regenerateDesigns(invitationId: string, prompt: string)
```

```typescript
// src/lib/actions/invitation-photo.ts

'use server'

// 사진 업로드
export async function uploadPhotos(invitationId: string, files: File[])

// 사진 삭제
export async function deletePhoto(photoId: string)

// 사진 순서 변경
export async function reorderPhotos(invitationId: string, photoIds: string[])
```

```typescript
// src/lib/actions/invitation-message.ts

'use server'

// 축하 메시지 작성 (Guest)
export async function createMessage(invitationId: string, guestName: string, content: string)

// 축하 메시지 목록 조회 (Host)
export async function getMessages(invitationId: string)

// 메시지 읽음 처리
export async function markMessageAsRead(messageId: string)
```

### 5.2 API Routes (외부 연동)

```typescript
// POST /api/invitation/payment/checkout
// Polar.sh 결제 세션 생성

// POST /api/invitation/payment/webhook
// Polar.sh 결제 완료 웹훅

// POST /api/invitation/design/generate
// AI 디자인 생성 (스트리밍)
```

---

## 6. AI Design Generation

### 6.1 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Client                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ GeneratingLoader Component                               │   │
│  │ - Progress animation                                     │   │
│  │ - User prompt display                                    │   │
│  │ - Server Action 호출                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │ generateDesigns()
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Server Action                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. 사용자 프롬프트 + 청첩장 정보 조합                       │   │
│  │ 2. Claude API 호출 (5개 시안 동시 생성)                    │   │
│  │ 3. 결과를 DB에 저장                                        │   │
│  │ 4. 디자인 ID 배열 반환                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Claude API                                                      │
│  - Model: claude-sonnet-4-20250514 (속도 우선)                   │
│  - 동시 5회 호출 (Promise.all)                                   │
│  - 구조화된 JSON 출력                                            │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Prompt Engineering

```typescript
// src/lib/ai/design-generator.ts

const SYSTEM_PROMPT = `
당신은 모바일 청첩장 디자인 전문가입니다.
사용자의 요청을 바탕으로 유니크한 청첩장 디자인을 생성합니다.

디자인 JSON 구조:
{
  "theme": "테마 이름 (영문)",
  "colors": {
    "primary": "#HEX",
    "secondary": "#HEX",
    "background": "#HEX",
    "text": "#HEX"
  },
  "layout": "classic | modern | minimal | romantic | traditional",
  "fonts": {
    "title": "폰트명",
    "body": "폰트명"
  },
  "decorations": ["장식 요소 배열"],
  "style_description": "디자인 설명 (한글, 2-3문장)"
}
`

const generateDesignPrompt = (userPrompt: string, weddingInfo: WeddingInfo) => `
결혼하는 커플: ${weddingInfo.groomName} & ${weddingInfo.brideName}
결혼 날짜: ${weddingInfo.weddingDate}
결혼 장소: ${weddingInfo.venueName}

사용자 요청:
"${userPrompt}"

위 정보를 바탕으로 유니크한 청첩장 디자인을 생성해주세요.
`
```

### 6.3 Performance 최적화

| 전략 | 설명 |
|------|------|
| **병렬 호출** | 5개 시안 동시 생성 (Promise.all) |
| **캐싱** | 동일 프롬프트 재요청 시 캐시 반환 |
| **타임아웃** | 10초 초과 시 부분 결과 반환 |
| **폴백** | API 실패 시 기본 템플릿 제공 |

---

## 7. File Storage

### 7.1 Supabase Storage 구조

```
wedding-photos/
├── {user_id}/
│   ├── {invitation_id}/
│   │   ├── photo_001.jpg
│   │   ├── photo_002.jpg
│   │   └── ...
```

### 7.2 업로드 플로우

```typescript
// 1. 클라이언트에서 직접 Supabase Storage 업로드
const { data, error } = await supabase.storage
  .from('wedding-photos')
  .upload(`${userId}/${invitationId}/${fileName}`, file)

// 2. 업로드 완료 후 Server Action 호출하여 DB에 기록
await addPhotoToInvitation(invitationId, data.path)
```

### 7.3 이미지 최적화

| 항목 | 처리 |
|------|------|
| **리사이즈** | 최대 2000px (Next.js Image 컴포넌트) |
| **포맷** | WebP 자동 변환 |
| **압축** | 품질 80% |
| **썸네일** | 400px 버전 자동 생성 |

---

## 8. Payment Integration (Polar.sh)

### 8.1 결제 플로우

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  미리보기    │ ──▶ │  결제 버튼   │ ──▶ │  Polar.sh   │
│  확인       │     │  클릭       │     │  Checkout   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  청첩장     │ ◀── │  Webhook    │ ◀── │  결제 완료   │
│  발행       │     │  처리       │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 8.2 Webhook 처리

```typescript
// POST /api/invitation/payment/webhook

export async function POST(request: Request) {
  const payload = await request.json()
  const signature = request.headers.get('polar-signature')

  // 서명 검증
  if (!verifyPolarSignature(payload, signature)) {
    return new Response('Invalid signature', { status: 401 })
  }

  if (payload.type === 'checkout.completed') {
    const { checkout_id, order_id } = payload.data

    // 결제 상태 업데이트
    await updatePaymentStatus(checkout_id, {
      status: 'completed',
      polarOrderId: order_id,
      completedAt: new Date(),
    })

    // 청첩장 발행 상태로 변경
    await publishInvitation(payload.data.metadata.invitation_id)
  }

  return new Response('OK', { status: 200 })
}
```

---

## 9. Kakao Integration

### 9.1 SDK 초기화

```typescript
// src/lib/kakao.ts

export function initKakaoSDK() {
  if (typeof window !== 'undefined' && !window.Kakao?.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY)
  }
}
```

### 9.2 공유 기능

```typescript
// src/lib/kakao.ts

export function shareInvitation(invitation: Invitation) {
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`,
      description: `${formatDate(invitation.weddingDate)} ${invitation.venueName}`,
      imageUrl: invitation.thumbnailUrl,
      link: {
        mobileWebUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/invitation/${invitation.id}`,
        webUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/invitation/${invitation.id}`,
      },
    },
    buttons: [
      {
        title: '청첩장 보기',
        link: {
          mobileWebUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/invitation/${invitation.id}`,
          webUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/invitation/${invitation.id}`,
        },
      },
    ],
  })
}
```

### 9.3 Open Graph 메타 태그

```typescript
// src/app/invitation/[id]/page.tsx

export async function generateMetadata({ params }): Promise<Metadata> {
  const invitation = await getPublishedInvitation(params.id)

  return {
    title: `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`,
    description: `${formatDate(invitation.weddingDate)} ${invitation.venueName}`,
    openGraph: {
      title: `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`,
      description: `${formatDate(invitation.weddingDate)} ${invitation.venueName}`,
      images: [invitation.thumbnailUrl],
      type: 'website',
    },
    robots: {
      index: false, // 검색 엔진 노출 방지
    },
  }
}
```

---

## 10. Route Structure

### 10.1 신규 라우트

```
src/app/
├── invitation/
│   ├── create/
│   │   └── page.tsx          # 대화형 청첩장 생성
│   ├── [id]/
│   │   ├── page.tsx          # 청첩장 열람 (Guest)
│   │   ├── edit/
│   │   │   └── page.tsx      # 청첩장 수정 (Host)
│   │   ├── preview/
│   │   │   └── page.tsx      # 미리보기 (Host)
│   │   └── messages/
│   │       └── page.tsx      # 축하 메시지 열람 (Host)
├── my/
│   └── invitations/
│       └── page.tsx          # 내 청첩장 목록
├── api/
│   └── invitation/
│       ├── payment/
│       │   ├── checkout/
│       │   │   └── route.ts  # 결제 세션 생성
│       │   └── webhook/
│       │       └── route.ts  # 결제 완료 웹훅
│       └── design/
│           └── generate/
│               └── route.ts  # AI 디자인 생성 (스트리밍)
```

### 10.2 페이지별 인증 요구사항

| 라우트 | 인증 | 비고 |
|--------|------|------|
| `/invitation/create` | 필수 | 로그인 후 생성 |
| `/invitation/[id]` | 불필요 | 누구나 열람 가능 |
| `/invitation/[id]/edit` | 필수 | 본인만 수정 |
| `/invitation/[id]/preview` | 필수 | 본인만 미리보기 |
| `/invitation/[id]/messages` | 필수 | 본인만 메시지 열람 |
| `/my/invitations` | 필수 | 본인 청첩장 목록 |

---

## 11. Security Considerations

### 11.1 인증/인가

| 항목 | 구현 |
|------|------|
| **인증** | Supabase Auth (Kakao OAuth, Email) |
| **세션** | JWT 기반, 미들웨어에서 검증 |
| **인가** | RLS + Server Action 내 검증 |

### 11.2 데이터 보안

| 항목 | 구현 |
|------|------|
| **청첩장 URL** | UUID (추측 불가능) |
| **축하 메시지** | RLS로 Host만 조회 가능 |
| **결제 정보** | Polar.sh 위임 (민감 정보 미저장) |
| **사진** | Supabase Storage RLS |

### 11.3 API 보안

| 항목 | 구현 |
|------|------|
| **Webhook** | Polar.sh 서명 검증 |
| **Rate Limiting** | AI 생성 API 제한 |
| **입력 검증** | Zod 스키마 검증 |

---

## 12. Performance Requirements

| 항목 | 목표 | 전략 |
|------|------|------|
| **AI 생성** | 10초 이내 | 병렬 호출, 캐싱 |
| **페이지 로딩** | 3초 이내 | SSR, 이미지 최적화 |
| **사진 업로드** | 10장 동시 | 병렬 업로드, 압축 |
| **LCP** | 2.5초 이내 | Next.js Image, 폰트 최적화 |

---

## 13. Environment Variables

```env
# 기존
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# 신규 추가
ANTHROPIC_API_KEY=
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
NEXT_PUBLIC_KAKAO_JS_KEY=
```

---

## 14. Implementation Priority

### Phase 1 - Core (MVP)
1. DB 스키마 생성 및 마이그레이션
2. 대화형 청첩장 생성 UI
3. AI 디자인 생성
4. 사진 업로드
5. 청첩장 열람 (Guest)
6. 결제 연동

### Phase 2 - Complete
7. 축하 메시지 기능
8. 카카오톡 공유
9. 내 청첩장 관리
10. 디자인 재생성

---

## Appendix

### Related Documents
- Product Requirements: `docs/prd.md`
- UX Design Specification: `docs/ux-design-specification.md`
- Epic Breakdown: `docs/epics.md`
- Legacy Architecture: `docs/architecture.md`

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-30 | 1.0 | Initial Architecture Document | BMad |

---

_This architecture document captures the technical decisions for 모바일 청첩장, designed to coexist with the existing 청모장 legacy system._
