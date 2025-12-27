# Super Editor v2 - 컬러 시스템 가이드

## 개요

Super Editor v2는 다양한 컬러 시스템을 **17개 시맨틱 토큰**으로 통합합니다.
사용자는 간단한 입력(1~2개 색상)만 제공하면, 시스템이 자동으로 전체 토큰을 생성합니다.

```
입력 (1~2개 색상) → 변환 함수 → 출력 (17개 SemanticTokens)
```

---

## 시맨틱 토큰 구조 (17개)

| 카테고리 | 토큰 | 용도 |
|----------|------|------|
| **배경** | `bg-page` | 페이지 전체 배경 |
| | `bg-section` | 섹션 배경 |
| | `bg-section-alt` | 대체 섹션 배경 |
| | `bg-card` | 카드, 비활성 탭 배경 |
| | `bg-overlay` | 오버레이, 모달 딤 |
| **전경** | `fg-default` | 기본 본문 텍스트 |
| | `fg-muted` | 보조 텍스트, 캡션 |
| | `fg-emphasis` | 제목, 강조 텍스트 |
| | `fg-inverse` | 반전 배경 위 텍스트 |
| | `fg-on-accent` | 액센트 버튼 위 텍스트 |
| **강조** | `accent-default` | 아이콘, 버튼, 활성 탭, 링크 |
| | `accent-hover` | 호버 상태 |
| | `accent-active` | 클릭/활성 상태 |
| | `accent-secondary` | 보조 강조 |
| **테두리** | `border-default` | 기본 테두리 |
| | `border-emphasis` | 강조 테두리 |
| | `border-muted` | 연한 테두리 |

---

## 컬러 시스템 종류

### 1. 1컬러 시스템 (P-S-T)

**입력:** Primary (P) 1개
**자동 계산:** Secondary (S), Tertiary (T)

```
P (Primary)  → 사용자 입력
S (Secondary) → H 유지, S×0.5, L=97%
T (Tertiary)  → H 유지, S×0.9, L=85%
```

**용도:**
- P: 제목, 아이콘, 강조 문구, 활성 탭/버튼
- S: 카드 배경, 비활성 탭 배경
- T: hover/보조 상태

**예시 (블루):**
| 구분 | 색상 | HEX |
|------|------|-----|
| P | 메인 블루 | `#002BFF` |
| S | 연한 블루 | `#F3F5FF` |
| T | 중간 블루 | `#BEC9FC` |

---

### 2. 2컬러 시스템 (P-S-T + A)

**입력:** Primary (P) + Accent (A) 2개
**자동 계산:** Secondary (S), Tertiary (T)

```
P (Primary)  → 사용자 입력 (텍스트/제목용)
A (Accent)   → 사용자 입력 (버튼/아이콘용)
S (Secondary) → P에서 계산 (L=97%)
T (Tertiary)  → P에서 계산 (L=85%)
```

**용도:**
- P: 제목, 강조 텍스트
- A: 아이콘, 버튼, 활성 탭
- S: 카드 배경
- T: hover 상태

**예시 (네이비 + 골드):**
| 구분 | 색상 | HEX |
|------|------|-----|
| P | 네이비 | `#1A365D` |
| A | 골드 | `#C9A962` |
| S | 연한 네이비 | `#F5F7FA` |
| T | 중간 네이비 | `#B8C4D9` |

---

### 3. 톤온톤 시스템 (Hue 기반)

**입력:** Base Hue (H) 1개
**자동 계산:** 동일 Hue의 5단계 명도 변화

```
모든 색상이 같은 Hue(H), 다른 Saturation(S)과 Lightness(L)
```

**용도:**
- 부드럽고 조화로운 단색 그라데이션 디자인
- 클래식, 로맨틱 테마에 적합

**예시 (아이보리 톤온톤, H=40°):**
| 용도 | S | L | HEX |
|------|---|---|-----|
| bg-page | 10% | 98% | `#FAF8F5` |
| bg-section | 15% | 95% | `#F5F2ED` |
| fg-default | 30% | 25% | `#3D3328` |
| fg-emphasis | 35% | 15% | `#2D2319` |
| accent | 40% | 45% | `#8B7355` |

---

## 토큰 매핑 테이블

### 17개 토큰 × 3개 시스템

| 토큰 | 1컬러 (P-S-T) | 2컬러 (P-S-T+A) | 톤온톤 (H) |
|------|---------------|-----------------|------------|
| **배경** | | | |
| `bg-page` | `#FFFFFF` | `#FFFFFF` | H, S:10%, L:98% |
| `bg-section` | `#FFFFFF` | `#FFFFFF` | H, S:15%, L:95% |
| `bg-section-alt` | `#FFFFFF` | `#FFFFFF` | H, S:20%, L:92% |
| `bg-card` | **S** | **S** | H, S:5%, L:100% |
| `bg-overlay` | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.4)` | H, S:50%, L:20%, A:0.4 |
| **전경** | | | |
| `fg-default` | `#1A1A1A` | `#1A1A1A` | H, S:30%, L:25% |
| `fg-muted` | `#6B7280` | `#6B7280` | H, S:20%, L:50% |
| `fg-emphasis` | **P** | **P** | H, S:35%, L:15% |
| `fg-inverse` | `#FFFFFF` | `#FFFFFF` | H, S:10%, L:98% |
| `fg-on-accent` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| **강조** | | | |
| `accent-default` | **P** | **A** | H, S:40%, L:45% |
| `accent-hover` | **T** | A (L+10%) | H, S:35%, L:55% |
| `accent-active` | **P** | A (L-5%) | H, S:45%, L:40% |
| `accent-secondary` | **T** | **T** | H, S:30%, L:60% |
| **테두리** | | | |
| `border-default` | `#E5E7EB` | `#E5E7EB` | H, S:15%, L:85% |
| `border-emphasis` | **P** | **A** | H, S:25%, L:75% |
| `border-muted` | `#F3F4F6` | `#F3F4F6` | H, S:10%, L:92% |

### 범례
- **P**: Primary (사용자 입력)
- **S**: Secondary (P에서 자동 계산, L=97%)
- **T**: Tertiary (P에서 자동 계산, L=85%)
- **A**: Accent (2컬러에서 사용자 입력)
- **H**: Base Hue (톤온톤에서 사용자 입력)

---

## 1컬러 vs 2컬러 차이점

| 요소 | 1컬러 | 2컬러 |
|------|-------|-------|
| 제목 (`fg-emphasis`) | P | P |
| 아이콘/버튼 (`accent-default`) | **P** | **A** |
| 카드 배경 (`bg-card`) | S (P 기반) | S (P 기반) |

**핵심 차이:** `accent-default`가 P를 쓰느냐, 별도 A를 쓰느냐

---

## 디자이너 협업 가이드

### 디자이너가 제공해야 할 것

| 시스템 | 필요한 입력 | 예시 |
|--------|------------|------|
| 1컬러 | Primary 1개 | `#002BFF` |
| 2컬러 | Primary + Accent | `#1A365D`, `#C9A962` |
| 톤온톤 | Base Hue (0-360°) | `40°` (아이보리) |

### S, T 자동 계산 공식

```typescript
// Primary에서 Secondary 계산
S = HSL(P.h, P.s × 0.5, 97%)

// Primary에서 Tertiary 계산
T = HSL(P.h, P.s × 0.9, 85%)
```

---

## 프리셋 예시

### 1컬러 프리셋 (현재 구현)

| 이름 | P (Primary) | S (Secondary) | T (Tertiary) |
|------|-------------|---------------|--------------|
| 심플 핑크 | `#EF90CB` | `#FCF5F9` | `#F4BDDF` |
| 심플 다홍 | `#EC8A87` | `#FFF4F1` | `#F7BCBA` |
| 심플 블루 | `#002BFF` | `#F3F5FF` | `#BEC9FC` |

### 2컬러 프리셋 (추가 제안)

| 이름 | P (Primary) | A (Accent) |
|------|-------------|------------|
| 네이비 + 골드 | `#1A365D` | `#C9A962` |
| 그린 + 코랄 | `#2D5A4A` | `#EC8A87` |
| 버건디 + 골드 | `#722F37` | `#D4AF37` |

---

## 관련 파일

- `schema/types.ts` - SemanticTokens 타입 정의
- `utils/color-generator.ts` - P-S-T 자동 계산 함수
- `presets/theme-presets.ts` - 테마 프리셋 정의
