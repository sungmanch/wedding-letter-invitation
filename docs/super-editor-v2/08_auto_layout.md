# Super Editor v2 - Auto Layout 시스템

> **목표**: Figma 스타일 Auto Layout 도입으로 텍스트 오버플로우 문제 해결
> **버전**: v1.0 (2025-12-28)

---

## 1. 개요

### 1.1 Auto Layout이란?

Figma의 Auto Layout 개념을 Super Editor v2에 적용한 레이아웃 시스템입니다.
요소의 크기가 콘텐츠에 따라 자동으로 조절되고, 형제 요소들이 자동으로 재배치됩니다.

```
┌─────────────────────────────────────────────────────────────┐
│  기존 (Absolute)           │  신규 (Auto Layout)           │
├────────────────────────────┼────────────────────────────────┤
│  x, y, width, height 고정  │  sizing: hug/fill 자동 조절   │
│  텍스트 오버플로우 발생     │  콘텐츠에 맞게 자동 확장       │
│  폰트 변경 시 깨짐          │  폰트 변경 시에도 유지         │
│  AI 생성 어려움             │  AI가 의미 기반 생성 가능      │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 하위 호환성

- 기존 `layoutMode: undefined` 또는 생략 시 → `'absolute'`로 동작
- 기존 프리셋 그대로 동작
- 새로운 프리셋만 `layout.mode: 'auto'` 사용

---

## 2. 핵심 타입

### 2.1 SizeMode

요소/블록의 크기 결정 방식:

```typescript
type SizeMode =
  | { type: 'fixed'; value: number; unit?: 'px' | 'vh' | 'vw' | '%' }
  | { type: 'hug' }                         // fit-content (콘텐츠에 맞춤)
  | { type: 'fill' }                        // 100% (부모 채우기)
  | { type: 'fill-portion'; value: number } // flex 비율
```

| 타입 | CSS 변환 | 용도 |
|------|---------|------|
| `hug` | `fit-content` | 텍스트, 버튼 등 콘텐츠 기반 |
| `fill` | `100%` + `flex: 1` | 부모 너비 채우기 |
| `fill-portion` | `flex: {value}` | 형제와 비율 분할 |
| `fixed` | `{value}{unit}` | 고정 크기 |

### 2.2 BlockLayout

블록의 레이아웃 설정:

```typescript
interface BlockLayout {
  mode: 'absolute' | 'auto'  // 기본: 'absolute'

  // Auto 모드 전용
  direction?: 'vertical' | 'horizontal'  // 기본: 'vertical'
  gap?: number              // px, 자식 간 간격
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }

  // 정렬
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'

  // 래핑 (horizontal일 때)
  wrap?: boolean
}
```

### 2.3 Element Auto Layout 필드

```typescript
interface Element {
  // 레이아웃 모드 선택
  layoutMode?: 'absolute' | 'auto'  // 기본: 'absolute'

  // Auto Layout 모드
  sizing?: {
    width?: SizeMode   // 기본: { type: 'fill' }
    height?: SizeMode  // 기본: { type: 'hug' }
  }
  constraints?: {
    minWidth?: number   // px
    maxWidth?: number   // px
    minHeight?: number  // px
    maxHeight?: number  // px
  }
  alignSelf?: 'start' | 'center' | 'end' | 'stretch'

  // Group 요소 전용
  children?: Element[]  // type: 'group'일 때
}
```

---

## 3. Group 요소

### 3.1 개요

여러 요소를 하나의 그룹으로 묶어 중첩 레이아웃을 구성합니다.

```typescript
interface GroupProps {
  type: 'group'
  layout?: {
    direction?: 'vertical' | 'horizontal'
    gap?: number
    alignItems?: 'start' | 'center' | 'end' | 'stretch'
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
    reverse?: boolean  // flex-direction: row-reverse / column-reverse
  }
}
```

### 3.2 사용 예시

**카운트다운 박스 (4개 박스 가로 배치)**:
```typescript
{
  type: 'group',
  layoutMode: 'auto',
  props: {
    type: 'group',
    layout: { direction: 'horizontal', gap: 12, alignItems: 'center' }
  },
  children: [
    // 일 박스
    {
      type: 'group',
      props: { type: 'group', layout: { direction: 'vertical', gap: 4, alignItems: 'center' } },
      children: [
        { type: 'text', binding: 'countdown.days', ... },
        { type: 'text', value: '일', ... }
      ]
    },
    // 시, 분, 초 박스도 동일 구조
  ]
}
```

**좌우 교차 배치 (신랑/신부 프로필)**:
```typescript
// 신랑: 사진(왼쪽) + 정보(오른쪽)
{
  type: 'group',
  props: { type: 'group', layout: { direction: 'horizontal', gap: 16 } },
  children: [photo, infoGroup]
}

// 신부: 정보(왼쪽) + 사진(오른쪽) - reverse 사용
{
  type: 'group',
  props: { type: 'group', layout: { direction: 'horizontal', gap: 16, reverse: true } },
  children: [photo, infoGroup]  // DOM 순서 동일, 시각적으로만 반전
}
```

---

## 4. Mixed 모드

하나의 블록에서 `absolute`와 `auto` 요소를 혼합할 수 있습니다.

### 4.1 렌더링 순서

1. `layoutMode: 'absolute'` 요소들 → 절대 위치로 렌더링 (배경, 장식)
2. `layoutMode: 'auto'` 요소들 → flexbox 내부에 렌더링 (콘텐츠)

### 4.2 예시

```typescript
{
  id: 'block-greeting',
  type: 'greeting-parents',
  layout: {
    mode: 'auto',
    direction: 'vertical',
    gap: 24,
    padding: { top: 60, right: 40, bottom: 60, left: 40 },
    alignItems: 'center',
  },
  height: { type: 'hug' },
  elements: [
    // 배경 장식 (absolute) - z-index 낮음
    {
      id: 'sparkle-1',
      type: 'image',
      layoutMode: 'absolute',
      x: 10, y: 5, width: 8, height: 10,
      zIndex: 0,
      props: { type: 'image', objectFit: 'contain' },
    },
    {
      id: 'sparkle-2',
      type: 'image',
      layoutMode: 'absolute',
      x: 85, y: 8, width: 6, height: 8,
      zIndex: 0,
      props: { type: 'image', objectFit: 'contain' },
    },
    // 콘텐츠 (auto) - z-index 높음
    {
      id: 'title',
      type: 'text',
      layoutMode: 'auto',
      sizing: { height: { type: 'hug' } },
      binding: 'greeting.title',
      zIndex: 1,
      props: { type: 'text' },
    },
    {
      id: 'content',
      type: 'text',
      layoutMode: 'auto',
      sizing: { height: { type: 'hug' } },
      constraints: { minHeight: 100 },
      binding: 'greeting.content',
      zIndex: 1,
      props: { type: 'text' },
    },
  ],
}
```

---

## 5. 블록 유형별 권장 설정

| 블록 타입 | layout.mode | height | direction | 이유 |
|----------|-------------|--------|-----------|------|
| `greeting-parents` | `auto` | `hug` | `vertical` | 인사말 길이 가변 |
| `profile` | `auto` | `hug` | `vertical` | 정보 그룹 중첩 |
| `rsvp` | `auto` | `hug` | `vertical` | 폼 요소 나열 |
| `notice` | `auto` | `hug` | `vertical` | 안내 항목 가변 |
| `calendar` | `auto` | `hug` | `vertical` | 카운트다운 그룹 |
| `hero` | `absolute` | 고정 vh | - | 배경 중심 |
| `gallery` | `absolute` | 고정 vh | - | 캐러셀/그리드 |
| `location` | `absolute` | 고정 vh | - | 지도 배치 |

---

## 6. CSS 변환

### 6.1 resolveSizeMode 함수

```typescript
// src/lib/super-editor-v2/utils/size-resolver.ts

export function resolveSizeMode(
  prop: 'width' | 'height',
  mode: SizeMode | undefined,
  defaultMode: SizeMode = { type: 'hug' }
): CSSProperties {
  const m = mode ?? defaultMode

  switch (m.type) {
    case 'fixed':
      const unit = m.unit ?? 'px'
      return { [prop]: `${m.value}${unit}` }

    case 'hug':
      return { [prop]: 'fit-content' }

    case 'fill':
      return {
        [prop]: '100%',
        flex: prop === 'width' ? '1 1 0' : undefined,
      }

    case 'fill-portion':
      return { flex: `${m.value} 1 0` }

    default:
      return {}
  }
}
```

### 6.2 블록 레이아웃 스타일

```typescript
// Auto Layout 블록
const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: layout.direction === 'horizontal' ? 'row' : 'column',
  gap: layout.gap ? `${layout.gap}px` : undefined,
  alignItems: layout.alignItems ?? 'stretch',
  justifyContent: layout.justifyContent ?? 'start',
  flexWrap: layout.wrap ? 'wrap' : 'nowrap',
  paddingTop: layout.padding?.top,
  paddingRight: layout.padding?.right,
  paddingBottom: layout.padding?.bottom,
  paddingLeft: layout.padding?.left,
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
}
```

---

## 7. 구현 파일

| 파일 | 역할 |
|------|------|
| `schema/types.ts` | SizeMode, BlockLayout, ElementSizing 타입 |
| `utils/size-resolver.ts` | SizeMode → CSS 변환 |
| `renderer/block-renderer.tsx` | layout.mode에 따라 분기 |
| `renderer/auto-layout-element.tsx` | Auto Layout 요소 렌더러 + GroupElement |
| `components/elements/text-element.tsx` | hug 모드 지원 |
| `components/elements/button-element.tsx` | hug 모드 지원 |

---

## 8. 마이그레이션 가이드

### 8.1 기존 프리셋 → Auto Layout 변환

**Before (Absolute)**:
```typescript
{
  type: 'text',
  x: 10, y: 22, width: 80, height: 30,  // 고정 높이 문제
  binding: 'greeting.content',
}
```

**After (Auto Layout)**:
```typescript
{
  type: 'text',
  layoutMode: 'auto',
  sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
  constraints: { minHeight: 100 },  // 최소 높이만 보장
  binding: 'greeting.content',
}
```

### 8.2 마이그레이션 체크리스트

- [ ] `x`, `y`, `width`, `height` 제거 (auto 요소)
- [ ] `layoutMode: 'auto'` 추가
- [ ] `sizing` 설정 (보통 `width: fill`, `height: hug`)
- [ ] 필요시 `constraints` 추가
- [ ] 장식 요소는 `layoutMode: 'absolute'` 유지
- [ ] 블록에 `layout: { mode: 'auto', ... }` 추가
- [ ] 블록 `height`를 `{ type: 'hug' }`로 변경

---

## 9. 관련 문서

| 문서 | 내용 |
|------|------|
| [01a_core_schema.md](./01a_core_schema.md) | 핵심 데이터 구조 |
| [05b_block_element_renderer.md](./05b_block_element_renderer.md) | 블록/요소 렌더러 |
| [06_ai_prompt.md](./06_ai_prompt.md) | AI 프롬프트 (Auto Layout 섹션) |
| [PLAN_auto-layout.md](./PLAN_auto-layout.md) | 구현 계획 |

---

## 10. 참고 자료

- [Figma Auto Layout Docs](https://help.figma.com/hc/en-us/articles/360040451373-Explore-auto-layout-properties)
- [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)
