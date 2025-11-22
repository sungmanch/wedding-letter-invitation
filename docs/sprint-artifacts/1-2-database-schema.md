# Story 1.2: 데이터베이스 스키마 및 연결 설정

Status: done

## Story

As a 개발자,
I want 데이터베이스가 설계되고 연결된 상태,
so that 데이터를 안전하게 저장하고 조회할 수 있다.

## Acceptance Criteria

1. Supabase (PostgreSQL) 연결이 설정된다
2. Drizzle ORM 스키마가 정의된다 (users, events, survey_responses, letters, restaurant_recommendations, payment_requests)
3. drizzle-kit migrate로 마이그레이션이 동작한다
4. Supabase 클라이언트 (브라우저/서버)가 설정된다
5. 타입 안전한 데이터베이스 쿼리가 가능하다

## Tasks / Subtasks

- [x] Task 1: Drizzle 설정 파일 생성 (AC: 1, 3)
  - [x] `drizzle.config.ts` 생성
  - [x] DATABASE_URL 환경변수 사용

- [x] Task 2: 데이터베이스 스키마 정의 (AC: 2)
  - [x] `src/lib/db/schema.ts` - 모든 테이블 정의
  - [x] users 테이블 (Supabase Auth 연동)
  - [x] events 테이블 (청모장)
  - [x] survey_responses 테이블 (설문 응답)
  - [x] letters 테이블 (편지)
  - [x] restaurant_recommendations 테이블 (식당 추천)
  - [x] payment_requests 테이블 (결제 요청)

- [x] Task 3: Drizzle DB 연결 설정 (AC: 1, 5)
  - [x] `src/lib/db/index.ts` - DB 연결 및 export
  - [x] postgres 드라이버 사용

- [x] Task 4: Supabase 클라이언트 설정 (AC: 4)
  - [x] `src/lib/supabase/client.ts` - 브라우저 클라이언트
  - [x] `src/lib/supabase/server.ts` - 서버 클라이언트
  - [x] `src/lib/supabase/middleware.ts` - 미들웨어용

- [x] Task 5: 타입 정의 (AC: 5)
  - [x] `src/types/database.ts` - DB 타입 export
  - [x] `src/types/index.ts` - 공통 타입 export

- [x] Task 6: 마이그레이션 생성 및 테스트 (AC: 3)
  - [x] `npx drizzle-kit generate` 실행
  - [x] 마이그레이션 파일 확인

## Dev Notes

### Architecture Patterns

- **ORM**: Drizzle ORM with PostgreSQL
- **Database**: Supabase PostgreSQL
- **Migration**: drizzle-kit migrate (NOT push)

### Source Tree Components

```
src/
├── lib/
│   ├── db/
│   │   ├── schema.ts         # Drizzle 스키마 정의
│   │   └── index.ts          # DB 연결
│   └── supabase/
│       ├── client.ts         # 브라우저 클라이언트
│       ├── server.ts         # 서버 클라이언트
│       └── middleware.ts     # Auth 미들웨어
├── types/
│   ├── database.ts           # DB 타입
│   └── index.ts              # 공통 타입
drizzle/
├── migrations/               # 마이그레이션 파일
drizzle.config.ts             # Drizzle 설정
```

### References

- [Source: docs/architecture.md#Database Schema]
- [Source: docs/epics.md#Story 1.2]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Completion Notes

**Completed:** 2025-11-22
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

- Drizzle ORM 스키마 정의 완료 (6개 테이블)
- Supabase 클라이언트 (브라우저/서버/미들웨어) 설정 완료
- 마이그레이션 파일 생성 완료 (0000_absurd_valkyrie.sql)
- 타입 정의 완료 (database.ts, index.ts)
- 빌드 성공 확인

### File List

**Created:**
- drizzle.config.ts
- src/lib/db/schema.ts
- src/lib/db/index.ts
- src/lib/supabase/client.ts
- src/lib/supabase/server.ts
- src/lib/supabase/middleware.ts
- src/types/database.ts
- src/types/index.ts
- middleware.ts
- drizzle/migrations/0000_absurd_valkyrie.sql
