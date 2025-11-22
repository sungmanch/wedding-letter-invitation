# Story 1.1: 프로젝트 초기 설정 및 개발 환경 구성

Status: done

## Story

As a 개발자,
I want 프로젝트 구조와 개발 환경이 설정된 상태,
so that 팀이 일관된 환경에서 개발을 시작할 수 있다.

## Acceptance Criteria

1. Next.js 14+ 프로젝트가 TypeScript로 생성되어 있다
2. ESLint/Prettier 설정이 적용되어 코드 스타일이 일관된다
3. Tailwind CSS가 설정되고 웨딩 테마 컬러(Blush Pink, Soft Gold)가 적용된다
4. 기본 레이아웃 컴포넌트가 존재한다 (모바일 first, 최대 480px)
5. 로컬 개발 서버가 정상 실행된다 (`npm run dev`)
6. 필수 패키지가 설치되어 있다 (Supabase, Drizzle, React Hook Form, Zod 등)

## Tasks / Subtasks

- [x] Task 1: Next.js 프로젝트 생성 (AC: 1)
  - [x] `npx create-next-app@latest` 실행 (TypeScript, Tailwind, ESLint, App Router, src 디렉토리)
  - [x] 프로젝트 구조 확인

- [x] Task 2: 필수 패키지 설치 (AC: 6)
  - [x] Database & ORM: `@supabase/supabase-js`, `@supabase/ssr`, `drizzle-orm`, `drizzle-kit`
  - [x] UI Components: `@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-tabs`
  - [x] Utilities: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`
  - [x] Forms & Validation: `react-hook-form`, `zod`, `@hookform/resolvers`
  - [x] Utilities: `date-fns`, `nanoid`
  - [x] Email: `resend`
  - [x] Testing: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `playwright`

- [x] Task 3: ESLint/Prettier 설정 (AC: 2)
  - [x] Prettier 설치 및 설정 파일 생성 (`.prettierrc`)
  - [x] ESLint 설정 업데이트 (Next.js 권장 설정 유지)
  - [x] VSCode 설정 추가 (`.vscode/settings.json`)

- [x] Task 4: Tailwind CSS 웨딩 테마 설정 (AC: 3)
  - [x] `globals.css`에 Tailwind v4 @theme 블록으로 커스텀 컬러 추가
    - `blush-pink`: #FFB6C1
    - `soft-gold`: #D4AF37
    - 추가 색상: cream, warm-white, charcoal
  - [x] 폰트 설정 (한글 폰트 - Pretendard 스택)

- [x] Task 5: 기본 레이아웃 컴포넌트 생성 (AC: 4)
  - [x] `src/app/layout.tsx` - Root 레이아웃 (메타데이터, 뷰포트 설정)
  - [x] `src/app/globals.css` - 전역 스타일 (웨딩 테마)
  - [x] 모바일 first 컨테이너 (max-width: 480px, 중앙 정렬)

- [x] Task 6: 환경 변수 템플릿 생성 (AC: 1, 6)
  - [x] `.env.example` 파일 생성
  - [x] `.gitignore` 확인 (`.env.local` 포함, `.env.example` 제외)

- [x] Task 7: 개발 서버 실행 및 검증 (AC: 5)
  - [x] `npm run dev` 실행
  - [x] 브라우저에서 기본 페이지 확인
  - [x] 웨딩 테마 컬러 적용 확인

## Dev Notes

### Architecture Patterns

- **Framework**: Next.js 16 App Router (최신 버전)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4 with @theme inline
- **State Management**: React Context + Server Components
- **Form Handling**: React Hook Form + Zod

### Source Tree Components

```
src/
├── app/
│   ├── layout.tsx          # Root 레이아웃 (생성)
│   ├── page.tsx            # 랜딩 페이지 placeholder (수정)
│   └── globals.css         # 전역 스타일 (수정)
├── components/
│   └── ui/                 # UI 컴포넌트 (Story 1.3에서 구현)
├── lib/
│   └── utils/
│       ├── cn.ts           # className 유틸 (생성)
│       └── index.ts        # 유틸 export (생성)
└── types/                  # 타입 정의 폴더 (생성)
```

### Naming Conventions

- 파일명: kebab-case (`auth-provider.tsx`)
- React 컴포넌트: PascalCase (`SelectionCard`)
- 함수/변수: camelCase (`createEvent`)
- 환경 변수: SCREAMING_SNAKE_CASE (`NEXT_PUBLIC_SUPABASE_URL`)

### Testing Standards

- Unit tests: Vitest + Testing Library
- E2E tests: Playwright
- Coverage target: 핵심 로직 80%+

### Project Structure Notes

- `src/` 디렉토리 사용 (create-next-app --src-dir 옵션)
- App Router 사용 (`app/` 디렉토리)
- 경로 별칭: `@/*` → `src/*`
- Tailwind v4 사용 (globals.css의 @theme 블록으로 커스텀 테마 설정)

### References

- [Source: docs/architecture.md#Project Initialization]
- [Source: docs/architecture.md#Project Structure]
- [Source: docs/architecture.md#Naming Conventions]
- [Source: docs/prd.md#Technical Decisions]

## Dev Agent Record

### Context Reference

<!-- No context file was generated for this story -->

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- Next.js 프로젝트를 임시 디렉토리에 생성 후 기존 프로젝트로 파일 복사
- Tailwind v4 사용으로 tailwind.config.ts 대신 globals.css의 @theme 블록 사용

### Completion Notes

**Completed:** 2025-11-22
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

- Next.js 16.0.3 (최신 버전) 사용
- Tailwind CSS v4 (@tailwindcss/postcss) 사용
- 웨딩 테마 컬러 (Blush Pink, Soft Gold, Cream, Warm White, Charcoal) 적용
- 모바일 first 레이아웃 (max-width: 480px) 구현
- 빌드 및 개발 서버 정상 동작 확인

### File List

**Created:**
- src/app/layout.tsx
- src/app/page.tsx
- src/app/globals.css
- src/lib/utils/cn.ts
- src/lib/utils/index.ts
- .prettierrc
- .prettierignore
- .vscode/settings.json
- .env.example
- eslint.config.mjs
- package.json
- tsconfig.json
- next.config.ts
- postcss.config.mjs
- next-env.d.ts

**Modified:**
- .gitignore (added !.env.example)
