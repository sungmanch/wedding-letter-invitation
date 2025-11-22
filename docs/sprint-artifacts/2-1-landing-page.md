# Story 2.1: 랜딩 페이지 및 서비스 소개

Status: done

## Story

As a 방문자,
I want 서비스의 가치를 한눈에 이해할 수 있는 랜딩 페이지,
so that 서비스 사용 여부를 결정할 수 있다.

## Acceptance Criteria

1. 서비스 소개와 핵심 가치가 표시된다
2. "청모장 만들기" CTA 버튼이 눈에 띄게 배치된다
3. 3-step 프로세스 안내가 표시된다
4. 모바일에서 최적화되어 보인다

## Tasks / Subtasks

- [x] Task 1: Hero Section (AC: 1, 2)
  - [x] 서비스 타이틀 및 설명
  - [x] CTA 버튼 ("청모장 만들기")
  - [x] 서브 텍스트

- [x] Task 2: How It Works Section (AC: 3)
  - [x] 3단계 프로세스 안내 (링크 공유 → 식당 추천 → 편지 열람)
  - [x] 아이콘 + 텍스트 조합

- [x] Task 3: Features Section (AC: 1)
  - [x] 핵심 기능 소개 카드 3개
  - [x] 취향 기반 식당 추천, 축하 편지 보관함, 예쁜 청모장 공유

- [x] Task 4: CTA Section (AC: 2)
  - [x] 그라데이션 배경 CTA
  - [x] "지금 바로 시작하세요"

- [x] Task 5: Footer (AC: 4)
  - [x] 심플한 푸터

## Dev Notes

### Source Tree Components

```
src/app/page.tsx  # 랜딩 페이지
```

### References

- [Source: docs/ux-design-specification.md]
- [Source: docs/epics.md#Story 2.1]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Completion Notes

**Completed:** 2025-11-22
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

- Hero, How It Works, Features, CTA, Footer 섹션 구현
- Lucide React 아이콘 활용
- 웨딩 테마 컬러 적용
- 빌드 성공 확인

### File List

**Modified:**
- src/app/page.tsx
