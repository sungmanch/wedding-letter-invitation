# 컬러 시스템 참조

세 가지 컬러 시스템을 지원합니다. AI가 이미지에서 색상을 추출하면 적절한 시스템을 선택하여 적용합니다.

---

## 시스템 선택 가이드

| 이미지 특성 | 추천 시스템 | 이유 |
|------------|------------|------|
| 선명한 포인트 컬러 1개 | **1컬러** | 강조색 통일 |
| 제목색 ≠ 버튼색 (2개 색상) | **2컬러** | 역할 분리 |
| 아이보리/베이지/브라운 계열 | **톤온톤** | 배경~전경 조화 |
| 저채도, 자연스러운 톤 | **톤온톤** | 부드러운 그라데이션 |

---

## 1. 1컬러 시스템 (P-S-T)

**입력**: Primary (P) 1개
**특징**: 배경 흰색, Primary로 모든 강조

```typescript
generateSemanticTokens({
  type: 'one-color',
  primary: '#EF90CB'  // 핑크
})
```

### 자동 계산

```
P (Primary)   → 사용자 입력 (제목, 강조, 버튼)
S (Secondary) → H 유지, S×0.5, L=97% (카드 배경)
T (Tertiary)  → H 유지, S×0.9, L=85% (hover 상태)
```

### 토큰 매핑

| 토큰 | 값 |
|------|-----|
| `bg-page`, `bg-section` | #FFFFFF |
| `bg-card` | **S** |
| `fg-emphasis` | **P** |
| `accent-default` | **P** |
| `accent-hover` | **T** |

---

## 2. 2컬러 시스템 (P-S-T + A)

**입력**: Primary (P) + Accent (A) 2개
**특징**: 제목과 버튼 색상 분리

```typescript
generateSemanticTokens({
  type: 'two-color',
  primary: '#1A365D',  // 네이비 (제목)
  accent: '#C9A962'    // 골드 (버튼)
})
```

### 토큰 매핑

| 토큰 | 값 |
|------|-----|
| `bg-page`, `bg-section` | #FFFFFF |
| `bg-card` | **S** (P에서 계산) |
| `fg-emphasis` | **P** (제목) |
| `accent-default` | **A** (버튼/아이콘) |
| `border-emphasis` | **A** |

### 추천 조합

| 이름 | Primary | Accent |
|------|---------|--------|
| 네이비 + 골드 | #1A365D | #C9A962 |
| 그린 + 코랄 | #2D5A4A | #EC8A87 |
| 버건디 + 골드 | #722F37 | #D4AF37 |

---

## 3. 톤온톤 시스템 (Hue 기반)

**입력**: Primary 1개 (Hue 추출)
**특징**: 배경~전경 동일 Hue, 명도 변화

```typescript
generateSemanticTokens({
  type: 'tone-on-tone',
  primary: '#8B7355'  // 브라운 (H=30°)
})
```

### 자동 계산 (H=40° 예시)

| 용도 | S | L | 결과 |
|------|---|---|------|
| bg-page | 10% | 98% | #FAF8F5 |
| bg-section | 15% | 95% | #F5F2ED |
| fg-default | 30% | 25% | #3D3328 |
| fg-emphasis | 35% | 15% | #2D2319 |
| accent-default | 40% | 45% | #8B7355 |

### 토큰 매핑

| 토큰 | 공식 |
|------|------|
| `bg-page` | H, S:10%, L:98% |
| `bg-section` | H, S:15%, L:95% |
| `bg-card` | H, S:5%, L:100% |
| `fg-default` | H, S:30%, L:25% |
| `fg-emphasis` | H, S:35%, L:15% |
| `accent-default` | H, S:40%, L:45% |

### 추천 Hue

| 무드 | Hue | 예시 색상 |
|------|-----|----------|
| 아이보리/베이지 | 30-45° | #FAF8F5 |
| 로즈/블러쉬 | 350-10° | #FFF9F9 |
| 세이지/그린 | 120-150° | #F8FAF8 |
| 라벤더 | 270-290° | #F9F8FA |

---

## 테마 프리셋 ID

```typescript
type ThemePresetId =
  // 1컬러 시스템
  | 'simple-pink'      // P: #EF90CB
  | 'simple-coral'     // P: #EC8A87
  | 'simple-blue'      // P: #002BFF
  // 기본
  | 'minimal-light'
  // 클래식 (톤온톤 스타일)
  | 'classic-ivory'    // H: 40°
  | 'classic-gold'
  // 모던
  | 'modern-mono'
  // 로맨틱 (톤온톤 스타일)
  | 'romantic-blush'   // H: 0°
  | 'romantic-garden'  // H: 120°
  // 특수
  | 'photo-adaptive'
```

---

## 스타일에서 사용

```typescript
// ❌ 하드코딩
color: '#1A1A1A'
background: '#FAF8F5'

// ✅ 시맨틱 토큰
color: 'var(--fg-default)'
color: 'var(--fg-emphasis)'
color: 'var(--fg-muted)'
background: 'var(--bg-section)'
background: 'var(--bg-card)'
```

---

## AI 분석 시 판단 기준

1. **색상 개수 확인**
   - 1개 → 1컬러 또는 톤온톤
   - 2개 → 2컬러

2. **채도 확인** (HSL의 S값)
   - S > 50% → 1컬러 (선명한 강조)
   - S < 30% → 톤온톤 (부드러운 조화)

3. **Hue 확인**
   - 20-50° (브라운/베이지) + 저채도 → 톤온톤
   - 그 외 → 1컬러

4. **배경색 확인**
   - 흰색 배경 → 1컬러 또는 2컬러
   - 유색 배경 (아이보리, 크림) → 톤온톤
