# 청모장 Architecture

## Executive Summary

청모장은 Next.js 14 App Router + Supabase + Vercel 기반의 모바일 first 웹 애플리케이션입니다. Host는 Supabase Auth로 인증하고, Guest는 익명으로 설문에 참여합니다. 실시간 응답 현황은 Supabase Realtime으로 구현하며, Drizzle ORM으로 타입 안전한 데이터베이스 작업을 수행합니다.

## Project Initialization

첫 번째 구현 스토리에서 실행할 명령어:

```bash
# 프로젝트 생성
npx create-next-app@latest cheomojang --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd cheomojang

# Database & ORM
npm install @supabase/supabase-js @supabase/ssr drizzle-orm
npm install -D drizzle-kit

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Utilities
npm install date-fns nanoid

# Email
npm install resend

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test
```

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
|----------|----------|---------|---------------|-----------|
| Framework | Next.js (App Router) | 14.x | All | SSR/SSG, SEO 최적화, Server Actions |
| Language | TypeScript | 5.x | All | 타입 안전성 |
| Styling | Tailwind CSS | 3.x | All | 빠른 개발, 모바일 first |
| Database | Supabase (PostgreSQL) | Latest | Epic 1, 2, 3, 4, 5 | 관리형 DB, Realtime 지원 |
| ORM | Drizzle ORM | 0.29.x | All | 타입 안전성, drizzle-kit migrate |
| Realtime | Supabase Realtime | Latest | Epic 4 | 실시간 응답 현황 |
| Auth | Supabase Auth | Latest | Epic 2, 5 | Host 인증 |
| State | React Context + Server Components | - | All | 서버 중심, 클라이언트 최소화 |
| API | Server Actions + API Routes | - | All | 폼: Server Actions, 외부 연동: API Routes |
| Email | Resend | Latest | Epic 4, 5 | Next.js 친화적 |
| Hosting | Vercel | - | Epic 1 | Next.js 최적화, 자동 배포 |
| Testing | Vitest + Playwright | Latest | All | 빠른 유닛, E2E 테스트 |

## Project Structure

```
cheomojang/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # 인증 라우트 그룹
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (main)/                   # 메인 앱 라우트 그룹
│   │   │   ├── page.tsx              # 랜딩 페이지
│   │   │   ├── create/               # 청모장 만들기
│   │   │   │   └── page.tsx
│   │   │   ├── my/                   # 내 청모장 목록
│   │   │   │   └── page.tsx
│   │   │   ├── [eventId]/            # 청모장 상세
│   │   │   │   ├── page.tsx          # 대시보드
│   │   │   │   ├── share/
│   │   │   │   │   └── page.tsx      # 링크 공유
│   │   │   │   ├── responses/
│   │   │   │   │   └── page.tsx      # 응답 현황
│   │   │   │   ├── recommend/
│   │   │   │   │   └── page.tsx      # 식당 추천
│   │   │   │   ├── letters/
│   │   │   │   │   └── page.tsx      # 편지함
│   │   │   │   ├── invitation/
│   │   │   │   │   └── page.tsx      # 청모장 공유
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx      # 수정
│   │   │   └── layout.tsx
│   │   ├── survey/                   # Guest 설문 (public)
│   │   │   └── [surveyId]/
│   │   │       ├── page.tsx          # 설문 폼
│   │   │       └── complete/
│   │   │           └── page.tsx      # 완료 화면
│   │   ├── invitation/               # 공유된 청모장 (public)
│   │   │   └── [eventId]/
│   │   │       └── page.tsx
│   │   ├── admin/                    # 운영자 페이지
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   └── callback/
│   │   │   │       └── route.ts      # Supabase Auth 콜백
│   │   │   ├── kakao/
│   │   │   │   └── share/
│   │   │   │       └── route.ts      # 카카오 공유
│   │   │   ├── email/
│   │   │   │   └── send/
│   │   │   │       └── route.ts      # 이메일 발송
│   │   │   └── webhooks/
│   │   │       └── supabase/
│   │   │           └── route.ts      # DB 이벤트 웹훅
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                       # 기본 UI 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress-bar.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── index.ts
│   │   ├── forms/                    # 폼 컴포넌트
│   │   │   ├── event-form.tsx
│   │   │   ├── survey-form.tsx
│   │   │   └── letter-form.tsx
│   │   ├── cards/                    # 카드 컴포넌트
│   │   │   ├── selection-card.tsx
│   │   │   ├── letter-card.tsx
│   │   │   ├── restaurant-card.tsx
│   │   │   └── response-card.tsx
│   │   ├── layout/                   # 레이아웃 컴포넌트
│   │   │   ├── header.tsx
│   │   │   ├── bottom-nav.tsx
│   │   │   ├── bottom-cta.tsx
│   │   │   └── auth-guard.tsx
│   │   └── providers/                # Context Providers
│   │       ├── auth-provider.tsx
│   │       └── toast-provider.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # 브라우저 클라이언트
│   │   │   ├── server.ts             # 서버 클라이언트
│   │   │   └── middleware.ts         # Auth 미들웨어
│   │   ├── db/
│   │   │   ├── schema.ts             # Drizzle 스키마
│   │   │   ├── index.ts              # DB 연결
│   │   │   ├── queries/              # 읽기 쿼리
│   │   │   │   ├── events.ts
│   │   │   │   ├── responses.ts
│   │   │   │   └── letters.ts
│   │   │   └── mutations/            # 쓰기 쿼리
│   │   │       ├── events.ts
│   │   │       ├── responses.ts
│   │   │       └── letters.ts
│   │   ├── actions/                  # Server Actions
│   │   │   ├── auth.ts
│   │   │   ├── event.ts
│   │   │   ├── survey.ts
│   │   │   ├── letter.ts
│   │   │   ├── recommendation.ts
│   │   │   └── admin.ts
│   │   ├── services/                 # 비즈니스 로직
│   │   │   ├── recommendation.ts     # 식당 추천 알고리즘
│   │   │   ├── email.ts              # 이메일 서비스
│   │   │   └── kakao.ts              # 카카오 SDK
│   │   ├── utils/
│   │   │   ├── cn.ts                 # className 유틸
│   │   │   ├── date.ts               # 날짜 유틸
│   │   │   └── url.ts                # URL 생성 유틸
│   │   ├── validations/              # Zod 스키마
│   │   │   ├── event.ts
│   │   │   ├── survey.ts
│   │   │   └── letter.ts
│   │   └── constants.ts              # 상수 정의
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-realtime-responses.ts
│   │   ├── use-countdown.ts
│   │   └── use-toast.ts
│   └── types/
│       ├── database.ts               # Supabase 생성 타입
│       ├── event.ts
│       ├── survey.ts
│       └── index.ts
├── public/
│   ├── images/
│   │   └── og-image.png              # OG 이미지
│   └── icons/
│       └── favicon.ico
├── drizzle/
│   ├── migrations/                   # 마이그레이션 파일
│   └── meta/
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   └── lib/
│   └── e2e/
│       ├── auth.spec.ts
│       ├── survey.spec.ts
│       └── letters.spec.ts
├── .env.local                        # 로컬 환경변수
├── .env.example                      # 환경변수 템플릿
├── drizzle.config.ts                 # Drizzle 설정
├── tailwind.config.ts                # Tailwind 설정
├── next.config.js                    # Next.js 설정
├── middleware.ts                     # Auth 미들웨어
├── vitest.config.ts                  # Vitest 설정
├── playwright.config.ts              # Playwright 설정
├── package.json
└── tsconfig.json
```

## Epic to Architecture Mapping

| Epic | 주요 경로 | 컴포넌트 | Server Actions |
|------|----------|----------|----------------|
| **Epic 1: 기반 구축** | 설정 파일, `lib/` | UI 컴포넌트 | - |
| **Epic 2: 청모장 생성** | `app/(main)/create`, `app/(main)/[eventId]`, `app/(main)/my` | EventForm, ShareModal | `createEvent`, `updateEvent`, `deleteEvent` |
| **Epic 3: 설문 응답** | `app/survey/[surveyId]` | SurveyForm, LetterForm, SelectionCard | `submitSurvey`, `submitLetter` |
| **Epic 4: 식당 추천** | `app/(main)/[eventId]/responses`, `app/(main)/[eventId]/recommend` | ResponseCard, RestaurantCard | `generateRecommendations`, `selectRestaurant` |
| **Epic 5: 편지 열람** | `app/(main)/[eventId]/letters`, `app/admin` | LetterCard, PaymentInfo | `requestPayment`, `approvePayment`, `unlockLetters` |
| **Epic 6: 청모장 공유** | `app/(main)/[eventId]/invitation`, `app/invitation/[eventId]` | InvitationTemplate | `createInvitation`, `shareInvitation` |

## Technology Stack Details

### Core Technologies

| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 14.x | 풀스택 프레임워크 |
| React | 18.x | UI 라이브러리 |
| TypeScript | 5.x | 타입 안전성 |
| Tailwind CSS | 3.x | 스타일링 |
| Supabase | Latest | DB, Auth, Realtime |
| Drizzle ORM | 0.29.x | 타입 안전 ORM |
| Vercel | - | 호스팅, CI/CD |

### Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel                                │
│                   (Next.js Hosting)                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ App Router  │  │   Server    │  │    API Routes       │  │
│  │   Pages     │  │   Actions   │  │  (External APIs)    │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                       Supabase                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ PostgreSQL  │  │    Auth     │  │      Realtime       │  │
│  │  (Drizzle)  │  │             │  │    (WebSocket)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │                                      │
          │                                      │
          ▼                                      ▼
┌─────────────────┐                   ┌─────────────────────┐
│     Resend      │                   │    Kakao SDK        │
│  (Email API)    │                   │   (공유 API)         │
└─────────────────┘                   └─────────────────────┘
```

## Data Architecture

### Database Schema

```sql
-- Users (Supabase Auth 연동)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events (청모장)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  group_name VARCHAR(100) NOT NULL,
  expected_members VARCHAR(20),
  preferred_location VARCHAR(100),
  budget_range VARCHAR(50),
  survey_url VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'collecting',
  letter_unlock_at TIMESTAMP,
  letter_unlocked BOOLEAN DEFAULT FALSE,
  selected_restaurant_id UUID,
  meeting_date TIMESTAMP,
  meeting_time VARCHAR(10),
  additional_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Survey Responses (설문 응답)
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  guest_name VARCHAR(100) NOT NULL,
  food_types JSONB,
  atmospheres JSONB,
  dietary_restriction VARCHAR(50),
  allergy_info VARCHAR(255),
  disliked_foods TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Letters (편지)
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  survey_response_id UUID REFERENCES survey_responses(id),
  guest_name VARCHAR(100) NOT NULL,
  content TEXT,
  stickers JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Restaurant Recommendations (식당 추천)
CREATE TABLE restaurant_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  location VARCHAR(255),
  price_range VARCHAR(50),
  image_url VARCHAR(500),
  match_score INTEGER,
  match_reasons JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payment Requests (결제 요청)
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id)
);

-- Enable Realtime for survey_responses
ALTER PUBLICATION supabase_realtime ADD TABLE survey_responses;
```

### Entity Relationships

```
users (1) ──────< events (N)
events (1) ──────< survey_responses (N)
events (1) ──────< letters (N)
events (1) ──────< restaurant_recommendations (N)
events (1) ──────< payment_requests (N)
survey_responses (1) ────── letters (0..1)
```

## Implementation Patterns

### Naming Conventions

| 영역 | 패턴 | 예시 |
|------|------|------|
| DB 테이블 | snake_case, 복수형 | `survey_responses`, `payment_requests` |
| DB 컬럼 | snake_case | `guest_name`, `created_at`, `is_read` |
| React 컴포넌트 | PascalCase | `SelectionCard`, `LetterCard` |
| 파일명 (컴포넌트) | kebab-case | `selection-card.tsx`, `letter-card.tsx` |
| Server Actions | camelCase 동사형 | `createEvent`, `submitSurvey` |
| API Routes | kebab-case | `/api/kakao-share`, `/api/email/send` |
| 환경 변수 | SCREAMING_SNAKE_CASE | `NEXT_PUBLIC_SUPABASE_URL` |
| Hooks | camelCase, use 접두사 | `useAuth`, `useRealtimeResponses` |
| Types | PascalCase | `Event`, `SurveyResponse` |

### API Response Format

```typescript
// 표준 응답 타입
type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code?: string } }

// 성공 예시
{ data: { id: "uuid", groupName: "민지의 대학친구들" }, error: null }

// 실패 예시
{ data: null, error: { message: "청모장 생성에 실패했습니다", code: "CREATE_FAILED" } }
```

### Server Action Pattern

```typescript
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'

const schema = z.object({
  groupName: z.string().min(1, '그룹 이름을 입력해주세요').max(100),
  expectedMembers: z.string().optional(),
  preferredLocation: z.string().optional(),
  budgetRange: z.string().optional(),
})

export async function createEvent(formData: FormData): Promise<ApiResponse<Event>> {
  // 1. 인증 확인
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: { message: '로그인이 필요합니다', code: 'UNAUTHORIZED' } }
  }

  // 2. 입력 검증
  const parsed = schema.safeParse({
    groupName: formData.get('groupName'),
    expectedMembers: formData.get('expectedMembers'),
    preferredLocation: formData.get('preferredLocation'),
    budgetRange: formData.get('budgetRange'),
  })

  if (!parsed.success) {
    return { data: null, error: { message: parsed.error.errors[0].message } }
  }

  // 3. DB 작업
  try {
    const [event] = await db.insert(events).values({
      userId: user.id,
      ...parsed.data,
      surveyUrl: nanoid(10),
    }).returning()

    // 4. 캐시 무효화
    revalidatePath('/my')

    return { data: event, error: null }
  } catch (e) {
    console.error('createEvent error:', e)
    return { data: null, error: { message: '청모장 생성에 실패했습니다' } }
  }
}
```

### Realtime Subscription Pattern

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import type { SurveyResponse } from '@/types'

export function useRealtimeResponses(eventId: string) {
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient()

    // 초기 데이터 로드
    const fetchInitial = async () => {
      const { data } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (data) setResponses(data)
      setIsLoading(false)
    }

    fetchInitial()

    // 실시간 구독
    const channel = supabase
      .channel(`responses:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'survey_responses',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          setResponses((prev) => [payload.new as SurveyResponse, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  return { responses, isLoading }
}
```

## Consistency Rules

### Error Handling

```typescript
// 클라이언트 에러 처리
try {
  const result = await createEvent(formData)
  if (result.error) {
    toast.error(result.error.message)
    return
  }
  router.push(`/${result.data.id}`)
} catch (e) {
  toast.error('예기치 않은 오류가 발생했습니다')
}

// 서버 에러 처리 (Server Action 내부)
try {
  // DB 작업
} catch (e) {
  console.error('Action name:', e)
  return { data: null, error: { message: '사용자 친화적 메시지' } }
}
```

### Date/Time Handling

```typescript
import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

// 표시 형식
format(date, 'yyyy년 M월 d일', { locale: ko })  // "2025년 11월 22일"
format(date, 'a h:mm', { locale: ko })           // "오후 3:30"

// 상대 시간
formatDistanceToNow(date, { addSuffix: true, locale: ko })  // "3분 전"

// D-day 계산
const dDay = differenceInDays(unlockDate, new Date())
```

### Form Validation

```typescript
// Zod 스키마
const surveySchema = z.object({
  guestName: z.string().min(1, '이름을 입력해주세요'),
  foodTypes: z.array(z.string()).min(1, '음식 종류를 선택해주세요'),
  atmospheres: z.array(z.string()).min(1, '분위기를 선택해주세요'),
  dietaryRestriction: z.string().optional(),
  allergyInfo: z.string().optional(),
  dislikedFoods: z.string().optional(),
})

// React Hook Form 연동
const form = useForm<z.infer<typeof surveySchema>>({
  resolver: zodResolver(surveySchema),
})
```

## Security Architecture

### Authentication Flow

```
1. Host 회원가입/로그인
   └── Supabase Auth (Email/Password)
   └── 세션 쿠키 기반 인증

2. Guest 설문 참여
   └── 인증 불필요 (공개 URL)
   └── 이름만 입력

3. Admin 접근
   └── 특정 이메일 화이트리스트
```

### Authorization Rules

| 역할 | 접근 권한 |
|------|----------|
| **Anonymous** | 설문 응답(`/survey/*`), 공유 청모장(`/invitation/*`) |
| **Authenticated Host** | 본인 청모장 CRUD, 편지 열람 |
| **Admin** | 모든 청모장 조회, 결제 승인 |

### Data Protection

- 편지 내용: 열람 권한 없으면 접근 불가
- 설문 URL: 추측 불가능한 nanoid(10) 사용
- 환경 변수: Vercel Environment Variables 사용

## Performance Considerations

### Optimization Strategies

| 영역 | 전략 |
|------|------|
| **이미지** | Next.js Image 최적화, WebP 포맷 |
| **번들** | 동적 임포트, 코드 스플리팅 |
| **데이터** | Server Components에서 fetch, 캐싱 |
| **Realtime** | 필요한 테이블만 구독 |

### Target Metrics

| 지표 | 목표 |
|------|------|
| LCP | < 2초 |
| FID | < 100ms |
| CLS | < 0.1 |
| 동시 접속 | 100명+ |

## Deployment Architecture

```
┌─────────────────────────────────────┐
│          GitHub Repository          │
└─────────────────┬───────────────────┘
                  │ Push to main
                  ▼
┌─────────────────────────────────────┐
│             Vercel                  │
│  ┌─────────────────────────────┐   │
│  │   Build & Deploy Pipeline   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────┐ ┌─────────────┐   │
│  │  Preview    │ │ Production  │   │
│  │  (PR 별)    │ │ (main)      │   │
│  └─────────────┘ └─────────────┘   │
└─────────────────────────────────────┘
```

### Environment Variables

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
RESEND_API_KEY=
NEXT_PUBLIC_KAKAO_APP_KEY=
NEXT_PUBLIC_BASE_URL=
```

## Development Environment

### Prerequisites

- Node.js 18+
- npm 또는 pnpm
- Supabase CLI (선택)
- Vercel CLI (선택)

### Setup Commands

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 수정

# 3. Supabase 타입 생성
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts

# 4. DB 마이그레이션
npx drizzle-kit generate
npx drizzle-kit migrate

# 5. 개발 서버 실행
npm run dev
```

## Architecture Decision Records (ADRs)

### ADR-001: Supabase 선택

**컨텍스트:** 데이터베이스 + 인증 + 실시간 기능이 모두 필요

**결정:** Supabase (PostgreSQL + Auth + Realtime)

**근거:**
- 단일 서비스로 모든 요구사항 충족
- 무료 티어로 MVP 검증 가능
- Drizzle ORM과 호환

### ADR-002: Server Actions 우선

**컨텍스트:** 데이터 변경을 위한 API 패턴 결정

**결정:** Server Actions 우선, API Routes는 외부 연동용

**근거:**
- 폼 제출에 최적화
- 타입 안전성
- 캐시 무효화 간편

### ADR-003: 인증 전략

**컨텍스트:** Host와 Guest의 인증 요구사항이 다름

**결정:** Host는 Supabase Auth, Guest는 익명

**근거:**
- Host: 청모장 관리를 위해 계정 필요
- Guest: 진입 장벽 최소화 (FR-4.1)

### ADR-004: 모바일 First + 데스크탑 고정 너비

**컨텍스트:** 모바일 사용자가 대다수일 것으로 예상

**결정:** 모바일 레이아웃 기준, 데스크탑에서도 모바일 UI 유지 (최대 480px)

**근거:**
- 일관된 사용자 경험
- 개발 리소스 최적화

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2025-11-22_
_For: BMad_
