# Super Editor v2 - 블록 프리셋 작성 가이드

> **목표**: Auto Layout 기반 블록 프리셋 작성 방법
> **버전**: v1.0 (2025-12-28)

---

## 1. 프리셋 구조

### 1.1 BlockPreset 타입

```typescript
interface BlockPreset {
  id: string
  name: string
  description?: string
  thumbnail?: string

  // 블록 설정
  type: BlockType
  layout?: BlockLayout       // Auto Layout 설정
  height: number | SizeMode  // vh 또는 SizeMode

  // 기본 요소
  defaultElements: Partial<Element>[]

  // 기본 스타일
  defaultStyle?: BlockStyleOverride
}
```

### 1.2 파일 구조

```
presets/blocks/
├── types.ts                      # BlockPreset 타입 정의
├── greeting-parents-presets.ts   # 인사말 프리셋
├── profile-presets.ts            # 프로필 프리셋
├── calendar-presets.ts           # 캘린더 프리셋
├── rsvp-presets.ts               # RSVP 프리셋
├── notice-presets.ts             # 공지사항 프리셋
└── index.ts                      # 전체 export
```

---

## 2. 레이아웃 모드 선택

### 2.1 언제 Auto Layout을 사용하는가?

| 상황 | 레이아웃 모드 | 이유 |
|------|--------------|------|
| 텍스트 중심 블록 | `auto` | 콘텐츠 길이 가변 |
| 폼/입력 요소 | `auto` | 요소 수 가변 |
| 정보 나열 | `auto` | 항목 추가/삭제 용이 |
| 배경 이미지 중심 | `absolute` | 정밀 배치 필요 |
| 갤러리/캐러셀 | `absolute` | 커스텀 그리드 |
| 지도/특수 UI | `absolute` | 외부 라이브러리 |

### 2.2 블록 유형별 권장

| 블록 타입 | layout.mode | height | 권장 이유 |
|----------|-------------|--------|-----------|
| `greeting-parents` | `auto` | `hug` | 인사말 길이 가변 |
| `profile` | `auto` | `hug` | 신랑/신부 정보 그룹 |
| `rsvp` | `auto` | `hug` | 폼 요소 나열 |
| `notice` | `auto` | `hug` | 안내 항목 가변 |
| `calendar` | `auto` | `hug` | 카운트다운 그룹 |
| `hero` | `absolute` | `100` (vh) | 배경 이미지 중심 |
| `gallery` | `absolute` | `80` (vh) | 캐러셀/그리드 |
| `location` | `absolute` | `60` (vh) | 지도 배치 |

---

## 3. Auto Layout 프리셋 작성

### 3.1 기본 템플릿

```typescript
export const MY_AUTO_PRESET: BlockPreset = {
  id: 'my-preset',
  name: '내 프리셋',
  type: 'greeting-parents',

  // Auto Layout 설정
  layout: {
    mode: 'auto',
    direction: 'vertical',
    gap: 24,
    padding: { top: 40, right: 40, bottom: 40, left: 40 },
    alignItems: 'center',
  },
  height: { type: 'hug' },  // 콘텐츠에 맞게 자동 조절

  defaultElements: [
    // 요소들...
  ],
}
```

### 3.2 Auto 요소 작성

```typescript
// 텍스트 요소 (콘텐츠에 맞게 높이 조절)
{
  id: 'title',
  type: 'text',
  layoutMode: 'auto',
  sizing: {
    width: { type: 'fill' },   // 부모 너비 채우기
    height: { type: 'hug' },   // 콘텐츠에 맞춤
  },
  binding: 'greeting.title',
  zIndex: 1,
  props: { type: 'text' },
  style: {
    text: {
      fontSize: 20,
      fontWeight: 600,
      textAlign: 'center',
    },
  },
}

// 최소 높이가 필요한 텍스트
{
  id: 'content',
  type: 'text',
  layoutMode: 'auto',
  sizing: { height: { type: 'hug' } },
  constraints: { minHeight: 100 },  // 최소 100px 보장
  binding: 'greeting.content',
  zIndex: 1,
  props: { type: 'text' },
}
```

### 3.3 Absolute 요소 (장식)

```typescript
// 배경 장식 요소 (Mixed 모드)
{
  id: 'sparkle-top-left',
  type: 'image',
  layoutMode: 'absolute',  // 명시적으로 absolute
  x: 10,
  y: 5,
  width: 8,
  height: 10,
  zIndex: 0,  // 콘텐츠보다 뒤에
  value: '/decorations/sparkle.svg',
  props: { type: 'image', objectFit: 'contain' },
}
```

---

## 4. Group 요소 활용

### 4.1 언제 Group을 사용하는가?

- 여러 요소를 수평으로 나란히 배치할 때
- 신랑/신부 정보를 좌우 교차 배치할 때
- 카운트다운 박스 (숫자 + 라벨) 그룹화
- 구분선 + 텍스트 + 구분선 조합

### 4.2 기본 Group 구조

```typescript
{
  id: 'my-group',
  type: 'group',
  layoutMode: 'auto',
  sizing: { height: { type: 'hug' } },
  zIndex: 1,
  props: {
    type: 'group',
    layout: {
      direction: 'horizontal',  // 가로 배치
      gap: 12,                  // 자식 간 간격
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  children: [
    // 자식 요소들...
  ],
}
```

### 4.3 좌우 교차 배치 (reverse)

```typescript
// 신랑: 사진(왼쪽) + 정보(오른쪽)
{
  type: 'group',
  props: {
    type: 'group',
    layout: { direction: 'horizontal', gap: 16 },
  },
  children: [photoElement, infoGroup],
}

// 신부: 정보(왼쪽) + 사진(오른쪽)
{
  type: 'group',
  props: {
    type: 'group',
    layout: { direction: 'horizontal', gap: 16, reverse: true },
  },
  children: [photoElement, infoGroup],  // DOM 순서 동일, 시각적 반전
}
```

### 4.4 카운트다운 박스 예시

```typescript
// 최상위: 4개 박스 가로 배치
{
  id: 'countdown-group',
  type: 'group',
  props: {
    type: 'group',
    layout: { direction: 'horizontal', gap: 12, alignItems: 'center', justifyContent: 'center' },
  },
  children: [
    // 각 박스: 숫자 + 라벨 세로 배치
    {
      id: 'days-box',
      type: 'group',
      props: { type: 'group', layout: { direction: 'vertical', gap: 4, alignItems: 'center' } },
      children: [
        { id: 'days-value', type: 'text', binding: 'countdown.days', ... },
        { id: 'days-label', type: 'text', value: '일', ... },
      ],
    },
    // 시, 분, 초 박스도 동일 구조
  ],
}
```

---

## 5. Mixed 모드 (Absolute + Auto)

하나의 블록에서 장식은 `absolute`, 콘텐츠는 `auto`로 혼합합니다.

### 5.1 z-index 규칙

| 요소 유형 | layoutMode | zIndex |
|----------|------------|--------|
| 배경 장식 | `absolute` | 0 |
| 콘텐츠 | `auto` | 1+ |
| 전경 장식 | `absolute` | 10+ |

### 5.2 예시

```typescript
{
  id: 'greeting-natural-sparkle',
  type: 'greeting-parents',
  layout: {
    mode: 'auto',
    direction: 'vertical',
    gap: 24,
    padding: { top: 60, right: 40, bottom: 60, left: 40 },
    alignItems: 'center',
  },
  height: { type: 'hug' },

  defaultElements: [
    // ─── 배경 장식 (absolute, z-index: 0) ───
    {
      id: 'sparkle-1',
      type: 'image',
      layoutMode: 'absolute',
      x: 10, y: 5, width: 8, height: 10,
      zIndex: 0,
      value: '/decorations/sparkle.svg',
      props: { type: 'image', objectFit: 'contain' },
    },
    {
      id: 'sparkle-2',
      type: 'image',
      layoutMode: 'absolute',
      x: 85, y: 8, width: 6, height: 8,
      zIndex: 0,
      value: '/decorations/sparkle.svg',
      props: { type: 'image', objectFit: 'contain' },
    },

    // ─── 콘텐츠 (auto, z-index: 1) ───
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
      zIndex: 2,
      props: { type: 'text' },
    },
  ],
}
```

---

## 6. SizeMode 선택 가이드

```
┌─────────────────────────────────────────────────────────────┐
│ 질문: 이 요소의 크기는 무엇에 의해 결정되어야 하는가?       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  콘텐츠 길이에 따라? ──────────────► { type: 'hug' }        │
│  (텍스트, 버튼, 아이콘)                                     │
│                                                             │
│  부모 너비를 채워야? ──────────────► { type: 'fill' }       │
│  (전체 너비 텍스트, 카드)                                   │
│                                                             │
│  정확한 픽셀 값이 필요? ───────────► { type: 'fixed',       │
│  (이미지, 고정 박스)                   value: 200,          │
│                                        unit: 'px' }         │
│                                                             │
│  형제와 비율 분할? ────────────────► { type: 'fill-portion',│
│  (좌우 50:50 분할)                     value: 1 }           │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. 체크리스트

### 7.1 Auto Layout 프리셋 체크리스트

- [ ] `layout.mode: 'auto'` 설정
- [ ] `height: { type: 'hug' }` 설정 (콘텐츠 가변 시)
- [ ] `layout.direction` 설정 (vertical/horizontal)
- [ ] `layout.gap` 설정 (자식 간 간격)
- [ ] `layout.padding` 설정 (블록 내부 여백)
- [ ] `layout.alignItems` 설정 (정렬)

### 7.2 Auto 요소 체크리스트

- [ ] `layoutMode: 'auto'` 명시
- [ ] `x`, `y`, `width`, `height` 제거 (absolute 전용)
- [ ] `sizing.width` 설정 (보통 `fill`)
- [ ] `sizing.height` 설정 (보통 `hug`)
- [ ] 필요시 `constraints` 설정 (minHeight 등)
- [ ] `zIndex` 설정 (콘텐츠는 1 이상)

### 7.3 장식 요소 체크리스트

- [ ] `layoutMode: 'absolute'` 명시
- [ ] `x`, `y`, `width`, `height` 설정
- [ ] `zIndex: 0` (배경) 또는 `10+` (전경)

### 7.4 Group 요소 체크리스트

- [ ] `type: 'group'` 설정
- [ ] `props.type: 'group'` 설정
- [ ] `props.layout` 설정 (direction, gap, alignItems)
- [ ] `children` 배열에 자식 요소 추가
- [ ] 좌우 교차 시 `reverse: true` 활용

---

## 8. 관련 문서

| 문서 | 내용 |
|------|------|
| [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) | 컬러 시스템 가이드 |
| [08_auto_layout.md](../../../docs/super-editor-v2/08_auto_layout.md) | Auto Layout 시스템 |
| [06_ai_prompt.md](../../../docs/super-editor-v2/06_ai_prompt.md) | AI 프롬프트 가이드 |
