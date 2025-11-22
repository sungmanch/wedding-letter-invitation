# Story 1.4: 배포 파이프라인 구축

Status: done

## Story

As a 개발자,
I want 자동화된 배포 환경,
so that 코드 변경이 신속하게 프로덕션에 반영된다.

## Acceptance Criteria

1. Vercel 배포 설정이 완료된다
2. Next.js 설정이 프로덕션에 최적화된다
3. 환경 변수가 안전하게 관리된다
4. 보안 헤더가 설정된다

## Tasks / Subtasks

- [x] Task 1: next.config.ts 프로덕션 설정 (AC: 2, 4)
  - [x] Supabase Storage 이미지 도메인 설정
  - [x] 보안 헤더 설정 (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

- [x] Task 2: Vercel 배포 설정 (AC: 1, 3)
  - [x] vercel.json 생성
  - [x] 환경 변수 참조 설정
  - [x] 서울 리전(icn1) 설정

- [x] Task 3: 빌드 검증 (AC: 2)
  - [x] npm run build 성공 확인

## Dev Notes

### Architecture Patterns

- **Hosting**: Vercel (Next.js optimized)
- **Region**: Seoul (icn1)
- **Deployment**: GitHub → Vercel auto-deploy

### Deployment Flow

```
GitHub (main branch)
       ↓
   Vercel Build
       ↓
 Preview / Production
```

### Environment Variables (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
RESEND_API_KEY
NEXT_PUBLIC_KAKAO_APP_KEY
NEXT_PUBLIC_BASE_URL
```

### References

- [Source: docs/architecture.md#Deployment Architecture]
- [Source: docs/epics.md#Story 1.4]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Completion Notes

**Completed:** 2025-11-22
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

- next.config.ts 프로덕션 설정 완료 (이미지, 보안 헤더)
- vercel.json 생성 완료 (서울 리전, 환경 변수)
- 빌드 성공 확인
- GitHub 연동 후 자동 배포 가능

### File List

**Created:**
- vercel.json

**Modified:**
- next.config.ts
