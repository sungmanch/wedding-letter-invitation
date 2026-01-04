# Typography Tokens Migration Guide

> hero 블록은 미감이 우선시되어 하드코딩 허용
> **이 문서는 hero를 제외한 블록 프리셋의 fontSize 토큰화 작업 가이드**

## 현재 사용되는 fontSize 값 분석

| 값 (px) | 용도 | 제안 토큰명 |
|---------|------|------------|
| 10 | 카운트다운 라벨 (일/시/분/초) | `FONT_SIZE.xs` |
| 12 | 서브타이틀, 라벨, 메타 | `FONT_SIZE.sm` |
| 13 | 작은 본문, 부가 설명 | `FONT_SIZE.caption` |
| 14 | 기본 본문 텍스트 | `FONT_SIZE.base` |
| 15 | 본문 (약간 큰) | `FONT_SIZE.body` |
| 16 | 버튼, 강조 본문 | `FONT_SIZE.md` |
| 18 | 이름, 강조 텍스트 | `FONT_SIZE.lg` |
| 20 | 섹션 타이틀 | `FONT_SIZE.xl` |
| 22 | 블록 타이틀 (보조) | `FONT_SIZE.2xl` |
| 24 | 블록 타이틀 (주요) | `FONT_SIZE.3xl` |
| 28 | 디스플레이 숫자 (카운트다운) | `FONT_SIZE.4xl` |

---

## 파일별 마이그레이션 체크리스트

### profile/
- [ ] **dual-card.ts** (14개)
  - 12 → `FONT_SIZE.sm` (라벨)
  - 24 → `FONT_SIZE.3xl` (블록 타이틀)
  - 18 → `FONT_SIZE.lg` (이름)
  - 14 → `FONT_SIZE.base` (역할, 관계)
  - 12 → `FONT_SIZE.sm` (전화 라벨)

- [ ] **circle-portrait.ts** (12개)
  - 14 → `FONT_SIZE.base` (서브타이틀)
  - 18 → `FONT_SIZE.lg` (타이틀)
  - 20 → `FONT_SIZE.xl` (이름)
  - 16 → `FONT_SIZE.md` (관계)
  - 13 → `FONT_SIZE.caption` (전화번호)

- [ ] **dual-card-interview.ts** (14개)
  - dual-card.ts와 동일 패턴

### account/
- [ ] **tab-card.ts** (3개)
  - 14 → `FONT_SIZE.base` (서브타이틀)
  - 24 → `FONT_SIZE.3xl` (블록 타이틀)
  - 15 → `FONT_SIZE.body` (본문)

### calendar/
- [ ] **heart-strip-countdown.ts** (26개)
  - 14 → `FONT_SIZE.base` (요일)
  - 28 → `FONT_SIZE.4xl` (날짜 숫자)
  - 10 → `FONT_SIZE.xs` (카운트다운 라벨)
  - 24 → `FONT_SIZE.3xl` (카운트다운 숫자)

- [ ] **korean-countdown-box.ts** (18개)
  - heart-strip-countdown.ts와 동일 패턴

### rsvp/
- [ ] **basic.ts** (4개)
  - 14 → `FONT_SIZE.base` (서브타이틀)
  - 24 → `FONT_SIZE.3xl` (블록 타이틀)
  - 16 → `FONT_SIZE.md` (버튼/본문)

### notice/
- [ ] **card-icon.ts** (5개)
  - 12 → `FONT_SIZE.sm` (라벨)
  - 24 → `FONT_SIZE.3xl` (블록 타이틀)
  - 15 → `FONT_SIZE.body` (본문)
  - 18 → `FONT_SIZE.lg` (아이템 타이틀)

- [ ] **classic-label.ts** (3개)
  - 12 → `FONT_SIZE.sm` (라벨)
  - 20 → `FONT_SIZE.xl` (블록 타이틀)
  - 15 → `FONT_SIZE.body` (본문)

### location/
- [ ] **minimal.ts** (7개)
  - 14 → `FONT_SIZE.base` (서브타이틀, 버튼)
  - 22 → `FONT_SIZE.2xl` (블록 타이틀)
  - 15 → `FONT_SIZE.body` (주소)

- [ ] **with-tel.ts** (8개)
  - minimal.ts와 동일 + 전화번호

- [ ] **with-transport.ts** (16개)
  - 14 → `FONT_SIZE.base` (서브타이틀, 본문)
  - 22 → `FONT_SIZE.2xl` (블록 타이틀)
  - 15 → `FONT_SIZE.body` (주소)
  - 16 → `FONT_SIZE.md` (교통수단 타이틀)

### wreath/
- [ ] **decline.ts** (2개)
  - 20 → `FONT_SIZE.xl` (타이틀, 본문)

### ending/
- [ ] **quote-share.ts** (5개)
  - 16 → `FONT_SIZE.md` (인용문)
  - 15 → `FONT_SIZE.body` (버튼 텍스트)
  - 14 → `FONT_SIZE.base` (부가 텍스트)

### message/
- [ ] **minimal.ts** (7개)
  - 12 → `FONT_SIZE.sm` (라벨)
  - 24 → `FONT_SIZE.3xl` (블록 타이틀)
  - 15 → `FONT_SIZE.body` (버튼)
  - 16 → `FONT_SIZE.md` (form label - CSS)
  - 20px, 14px (CSS)

### greeting-parents/
- [ ] **balloon-heart.ts** (5개)
  - 20 → `FONT_SIZE.xl` (타이틀)
  - 15 → `FONT_SIZE.body` (인사말)
  - 14 → `FONT_SIZE.base` (부모님 정보)

- [ ] **with-divider.ts** (4개)
  - 24 → `FONT_SIZE.3xl` (블록 타이틀)
  - 16 → `FONT_SIZE.md` (인사말)
  - 14 → `FONT_SIZE.base` (부모님 정보)

- [ ] **ribbon.ts** (5개)
  - 20 → `FONT_SIZE.xl` (타이틀)
  - 15 → `FONT_SIZE.body` (인사말)
  - 14 → `FONT_SIZE.base` (부모님 정보)

- [ ] **box-style.ts** (6개)
  - 12 → `FONT_SIZE.sm` (라벨)
  - 22 → `FONT_SIZE.2xl` (블록 타이틀)
  - 15 → `FONT_SIZE.body` (인사말)
  - 16 → `FONT_SIZE.md` (부모님 이름)

- [ ] **baptismal.ts** (8개)
  - 14 → `FONT_SIZE.base` (라벨, 본문)
  - 11 → 특수 케이스 (세례명 작은 텍스트)
  - 15 → `FONT_SIZE.body` (이름)
  - 20 → `FONT_SIZE.xl` (타이틀)

- [ ] **natural-sparkle.ts** (2개+)
  - 20 → `FONT_SIZE.xl` (타이틀)
  - 15 → `FONT_SIZE.body` (인사말)

### interview/
- [ ] **accordion.ts** (2개)
  - 20 → `FONT_SIZE.xl` (블록 타이틀)
  - 14 → `FONT_SIZE.base` (본문)

### gallery/
- [ ] **_shared.ts** (4개)
  - 12 → `FONT_SIZE.sm` (라벨)
  - 24 → `FONT_SIZE.3xl` (블록 타이틀)
  - 14 → `FONT_SIZE.base` (서브타이틀, 본문)

### contact/
- [ ] **minimal.ts** (18개)
  - 20 → `FONT_SIZE.xl` (섹션 타이틀)
  - 22 → `FONT_SIZE.2xl` (블록 타이틀)
  - 14 → `FONT_SIZE.base` (라벨, 본문)
  - 13 → `FONT_SIZE.caption` (작은 텍스트)
  - 15 → `FONT_SIZE.body` (이름)

---

## tokens.ts에 추가할 코드

```typescript
// ============================================
// Typography Tokens
// ============================================

/** 폰트 크기 토큰 (px 단위) */
export const FONT_SIZE = {
  xs: 10,      // 카운트다운 라벨
  sm: 12,      // 서브타이틀, 라벨
  caption: 13, // 작은 본문, 부가 설명
  base: 14,    // 기본 본문
  body: 15,    // 본문 (약간 큰)
  md: 16,      // 버튼, 강조 본문
  lg: 18,      // 이름, 강조 텍스트
  xl: 20,      // 섹션 타이틀
  '2xl': 22,   // 블록 타이틀 (보조)
  '3xl': 24,   // 블록 타이틀 (주요)
  '4xl': 28,   // 디스플레이 숫자
} as const

export type FontSizeToken = keyof typeof FONT_SIZE
```

---

## 마이그레이션 순서 제안

1. **tokens.ts**에 `FONT_SIZE` 토큰 추가
2. 단순한 블록부터 시작 (rsvp, wreath, interview)
3. 복잡한 블록 진행 (calendar, profile, contact)
4. 테스트 및 시각적 검증

---

## 통계 요약

| 블록 카테고리 | 파일 수 | 하드코딩 수 |
|--------------|--------|------------|
| profile | 3 | 40 |
| calendar | 2 | 44 |
| location | 3 | 31 |
| greeting-parents | 6 | 30 |
| contact | 1 | 18 |
| notice | 2 | 8 |
| message | 1 | 7 |
| ending | 1 | 5 |
| gallery | 1 | 4 |
| account | 1 | 3 |
| rsvp | 1 | 4 |
| wreath | 1 | 2 |
| interview | 1 | 2 |
| **총계** | **24** | **~198** |
