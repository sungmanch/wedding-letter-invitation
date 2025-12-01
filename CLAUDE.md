# Project

이 프로젝트는 개인화된 모바일 청첩장을 생성할 수 있는 서비스입니다.
사용자가 본인의 웨딩 이미지를 업로드하면 해당 이미지를 바탕으로 꾸며진 모바일 청첩장 프리뷰를 보여주고 사용자에게 선택을 유도합니다.

## 중요 규칙
1. 모든 작업은 마이크로 단위로 작업에 대한 commit을 합니다.
2, 모든 작업 후에 왜 기능이 추가되었는 지에 대한 메모를 CLAUDE.md 파일에 기록한다. 단 CLAUDE.md 파일은 200줄을 넘기면 안되고 필요한 파일들은 참조를 통해서 관리한다.

## 라우트 구조

- `/` - 청첩장 서비스 (메인)
  - `/create` - 청첩장 생성
  - `/[id]` - 게스트용 청첩장 뷰어 (모바일 전용)
  - `/[id]/edit` - 2패널 편집 페이지 (정보 입력 + 실시간 프리뷰)
  - `/[id]/photos`, `/preview`, `/payment`, `/share`, `/messages` - 편집/관리 페이지 (데스크탑 지원)
- `/party` - 청모장 서비스 (서브)
  - `/party/create`, `/party/[eventId]/*` - 청모장 관련 페이지

## 참고 문서

- [테마 시스템](./src/lib/themes/CLAUDE.md) - 청첩장 테마 템플릿

## 변경 이력

### 2025-12-02: AI 템플릿 시스템 + 확장 섹션 컴포넌트
- **이유**: Salon de Letter 수준의 30+ 섹션 지원, AI 동적 템플릿 저장, S3 정적 배포
- **변경**:
  - Sprint 0: `design_templates` 테이블 추가, 큐레이션/강화학습 데이터 구조
  - Sprint 1: `InvitationDesignData` v2 타입, 25개 ExtendedSectionType, 마이그레이션 유틸
  - Sprint 2: 신규 섹션 컴포넌트 (VideoSection, InterviewSection, TimelineSection, DdaySection)
  - Sprint 3: 편집 UI - 섹션 관리, 스타일 설정, 템플릿 재사용
- **파일**:
  - `src/lib/db/template-schema.ts` - 템플릿 DB 스키마
  - `src/lib/types/invitation-design.ts` - v2 데이터 타입
  - `src/lib/utils/design-migration.ts` - 레거시 → v2 마이그레이션
  - `src/components/invitation/sections/` - 신규 섹션 컴포넌트
  - `src/app/[id]/edit/components/` - 편집 UI 컴포넌트 (SectionEditor, StyleEditor, TemplateSelector)
- **계획**: [AI 디자인 플랫폼 설계](./.claude/plans/streamed-percolating-wave.md)

### 2025-12-02: 마이그레이션 구조 재정비
- **이유**: `updated_at` 컬럼 누락 에러 해결, 스키마와 DB 동기화
- **변경**:
  - `drizzle-kit introspect`로 현재 DB 상태를 기준선으로 설정
  - `foreignKey()` 헬퍼로 FK 명시적 이름 지정 (`_fkey` 컨벤션)
  - 인덱스, RLS 정책을 스키마에 명시하여 불필요한 DROP 방지
- **파일**: `src/lib/db/invitation-schema.ts`, `drizzle/migrations/`

### 2025-12-01: 인트로를 인라인 섹션으로 변경
- **이유**: Intro → Content 순서로 스크롤 가능한 단일 페이지 UX 요구
- **변경**:
  - IntroRenderer 오버레이 방식 제거, IntroPreview를 인라인 섹션으로 사용
  - 모든 인트로 컴포넌트 fixed → absolute 변경 (모바일 퍼스트)
- **파일**: `src/components/invitation/InvitationViewer.tsx`, `src/components/invitation/intros/*.tsx`

## 마이그레이션 규칙
- 절대로 마이그레이션 파일을 직접 생성하지 말것 `drizzle-kit generate`를 활용한 생성만 할것
- 스키마 변경 시 `drizzle-kit generate` → `drizzle-kit migrate` 순서로 진행