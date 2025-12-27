# Super Editor v2 - Auto Layout 시스템 구현 계획

> **목표**: Figma 스타일 Auto Layout 도입으로 텍스트 오버플로우 문제 해결
> **작성일**: 2025-12-27

---

## 1. 현재 문제

### 1.1 Absolute 레이아웃의 한계

| 문제 | 원인 | 영향 |
|------|------|------|
| 텍스트 오버플로우 | height 고정 (%) | 긴 인사말 잘림/넘침 |
| 폰트 변경 시 깨짐 | 폰트별 line-height 차이 | 레이아웃 붕괴 |
| AI 생성 어려움 | 텍스트 길이 예측 필요 | 부정확한 height 지정 |
| 요소 겹침 | 앞 요소 크기 변화 무시 | 후속 요소와 충돌 |

### 1.2 현재 코드 (`element-renderer.tsx:82-96`)

```typescript
// 모든 요소가 고정 좌표/크기
const leftPx = (element.x / 100) * viewport.width
const topPx = (element.y / 100) * blockHeightPx
const heightPx = (elemHeight / 100) * blockHeightPx
```

---

## 2. 목표

1. **Hug Content**: 텍스트 요소가 콘텐츠 길이에 맞게 자동 확장
2. **자동 재배치**: 앞 요소 크기 변화 시 후속 요소 위치 자동 조정
3. **하위 호환**: 기존 absolute 프리셋 그대로 동작
4. **하이브리드**: 장식(absolute) + 콘텐츠(auto) 혼합 가능
5. **AI 친화적**: AI가 의미 기반으로 레이아웃 생성 가능

---

## 3. 스키마 설계

### 3.1 SizeMode 타입

```typescript
// src/lib/super-editor-v2/schema/types.ts

type SizeMode =
  | { type: 'fixed'; value: number; unit?: 'px' | 'vh' | 'vw' | '%' }
  | { type: 'hug' }                        // fit-content
  | { type: 'fill' }                       // 100% + flex: 1
  | { type: 'fill-portion'; value: number } // flex 비율
```

### 3.2 Element 확장

```typescript
interface Element {
  id: string
  type: ElementType

  // ─── 레이아웃 모드 선택 ───
  layoutMode?: 'absolute' | 'auto'  // 기본: 'absolute' (하위 호환)

  // ─── Absolute 모드 (기존) ───
  x?: number      // vw %
  y?: number      // 블록 내 vh %
  width?: number  // vw %
  height?: number // 블록 내 vh %
  rotation?: number

  // ─── Auto Layout 모드 (신규) ───
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

  // 부모 Auto Layout 내에서 자기 정렬
  alignSelf?: 'start' | 'center' | 'end' | 'stretch'

  // 기타 (기존 유지)
  zIndex: number
  binding?: VariablePath
  value?: string | number
  props: ElementProps
  style?: ElementStyle
}
```

### 3.3 Block Layout 설정

```typescript
interface Block {
  id: string
  type: BlockType
  enabled: boolean

  // ─── 레이아웃 설정 (신규) ───
  layout?: BlockLayout

  // ─── 높이 ───
  height: number | SizeMode  // number = 기존 vh 고정, SizeMode = 신규

  elements: Element[]
  style?: BlockStyleOverride
}

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

---

## 4. 구현 단계

### Phase 1: 스키마 및 타입 확장 ✅ 완료
- [x] `schema/types.ts`에 SizeMode, BlockLayout 타입 추가
- [x] Element에 layoutMode, sizing, constraints, alignSelf 추가
- [x] Block에 layout 필드 추가
- [x] 기존 필드 optional 처리로 하위 호환 유지

### Phase 2: 렌더러 분기 구현 ✅ 완료
- [x] `renderer/block-renderer.tsx` - layout.mode에 따라 분기
- [x] `renderer/auto-layout-block.tsx` - 신규 Auto Layout 블록 렌더러
- [x] `renderer/element-renderer.tsx` - layoutMode에 따라 분기
- [x] `utils/size-resolver.ts` - SizeMode → CSS 변환 유틸

### Phase 3: 컴포넌트 조정 ✅ 완료
- [x] `components/elements/text-element.tsx` - hug 모드 지원
- [x] `components/elements/button-element.tsx` - hug 모드 지원
- [x] `components/elements/divider-element.tsx` - hug 모드 지원
- [x] `components/elements/image-element.tsx` - hug 모드 지원
- [x] `components/elements/shape-element.tsx` - hug 모드 지원

### Phase 4: 프리셋 마이그레이션 ✅ 완료 (2025-12-27)
- [x] `presets/blocks/types.ts` - BlockPreset에 layout 필드 추가
- [x] `presets/blocks/greeting-parents-presets.ts` - 4개 auto-layout, 3개 absolute 유지
  - ✅ minimal, with-divider: 순수 auto-layout
  - ✅ natural-sparkle, balloon-heart: mixed 모드 (장식 요소 absolute)
  - ⏭️ baptismal, box-style, ribbon: absolute 유지 (복잡한 레이아웃)
- [x] `presets/blocks/rsvp-presets.ts` - rsvp-basic auto-layout
- [x] `presets/blocks/notice-presets.ts` - notice-classic-label auto-layout
- ⏭️ `presets/blocks/profile-presets.ts` - absolute 유지 (좌우 교차 배치)
- ⏭️ `presets/blocks/calendar-presets.ts` - absolute 유지 (정밀 배치 필요)

### Phase 5: AI 통합
- [ ] `docs/super-editor-v2/06_ai_prompt.md` 업데이트
- [ ] AI가 auto layout 사용하도록 가이드 추가
- [ ] 블록 유형별 기본 layout 권장사항

### Phase 6: 문서화
- [ ] `docs/super-editor-v2/08_auto_layout.md` 작성
- [ ] 프리셋 작성 가이드 업데이트

---

## 5. 상세 구현

### 5.1 SizeMode → CSS 변환

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
      const unit = m.unit ?? (prop === 'height' ? 'px' : 'px')
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

### 5.2 Auto Layout Block 렌더러

```typescript
// src/lib/super-editor-v2/renderer/auto-layout-block.tsx

export function AutoLayoutBlock({ block }: { block: Block }) {
  const layout = block.layout!

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: layout.direction === 'horizontal' ? 'row' : 'column',
    gap: layout.gap ? `${layout.gap}px` : undefined,
    alignItems: layout.alignItems ?? 'stretch',
    justifyContent: layout.justifyContent ?? 'start',
    flexWrap: layout.wrap ? 'wrap' : 'nowrap',

    // 패딩
    paddingTop: layout.padding?.top,
    paddingRight: layout.padding?.right,
    paddingBottom: layout.padding?.bottom,
    paddingLeft: layout.padding?.left,

    // 블록 높이
    ...resolveBlockHeight(block.height),

    // 기본
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  }

  // absolute 요소와 auto 요소 분리
  const absoluteElements = block.elements.filter(e => e.layoutMode === 'absolute')
  const autoElements = block.elements.filter(e => e.layoutMode !== 'absolute')

  return (
    <section style={containerStyle}>
      {/* Absolute 요소 (배경, 장식) */}
      {absoluteElements.map(el => (
        <AbsoluteElement key={el.id} element={el} />
      ))}

      {/* Auto Layout 요소 (콘텐츠) */}
      {autoElements.map(el => (
        <AutoLayoutElement key={el.id} element={el} />
      ))}
    </section>
  )
}
```

### 5.3 Auto Layout Element

```typescript
// src/lib/super-editor-v2/renderer/auto-layout-element.tsx

export function AutoLayoutElement({ element }: { element: Element }) {
  const style: CSSProperties = {
    // 크기
    ...resolveSizeMode('width', element.sizing?.width, { type: 'fill' }),
    ...resolveSizeMode('height', element.sizing?.height, { type: 'hug' }),

    // 제약
    minWidth: element.constraints?.minWidth,
    maxWidth: element.constraints?.maxWidth,
    minHeight: element.constraints?.minHeight,
    maxHeight: element.constraints?.maxHeight,

    // 자기 정렬
    alignSelf: element.alignSelf,

    // z-index
    zIndex: element.zIndex,
  }

  return (
    <div style={style}>
      <ElementTypeRenderer element={element} />
    </div>
  )
}
```

---

## 6. 프리셋 마이그레이션 예시

### Before (Absolute)

```typescript
const GREETING_MINIMAL: PresetElement[] = [
  {
    type: 'text',
    x: 10, y: 10, width: 80, height: 8,
    binding: 'greeting.title',
    // ...
  },
  {
    type: 'text',
    x: 10, y: 22, width: 80, height: 30,  // 고정 height 문제
    binding: 'greeting.content',
    // ...
  },
]
```

### After (Auto Layout)

```typescript
const GREETING_MINIMAL_AUTO: BlockPreset = {
  // 블록 레이아웃 설정
  layout: {
    mode: 'auto',
    direction: 'vertical',
    gap: 24,
    padding: { top: 40, right: 40, bottom: 40, left: 40 },
    alignItems: 'center',
  },
  height: { type: 'hug' },

  defaultElements: [
    {
      type: 'text',
      layoutMode: 'auto',
      sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
      binding: 'greeting.title',
      // ...
    },
    {
      type: 'text',
      layoutMode: 'auto',
      sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
      constraints: { minHeight: 100 },  // 최소 높이만 보장
      binding: 'greeting.content',
      // ...
    },
  ],
}
```

---

## 7. AI 프롬프트 가이드 (추가할 내용)

```markdown
## Auto Layout 사용 가이드

### 언제 Auto Layout을 사용하는가?

| 상황 | 레이아웃 모드 | 이유 |
|------|-------------|------|
| 텍스트 콘텐츠 (인사말, 설명) | auto + hug | 길이 가변 |
| 버튼, 레이블 | auto + hug | 텍스트에 맞춤 |
| 배경 이미지 | absolute | 전체 덮기 |
| 장식 (별, 리본) | absolute | 정확한 위치 필요 |
| 카드/박스 | auto + fill | 부모 채우기 |

### 블록 유형별 권장 설정

| 블록 타입 | layout.mode | direction | 이유 |
|----------|-------------|-----------|------|
| greeting-parents | auto | vertical | 텍스트 중심 |
| profile | auto | vertical | 정보 나열 |
| hero | mixed | - | 배경(abs) + 텍스트(auto) |
| calendar | absolute | - | 정밀 배치 필요 |
| gallery | auto | horizontal + wrap | 그리드 |
```

---

## 8. 검증 체크리스트

### 기능 검증
- [ ] 긴 텍스트가 자동으로 높이 확장되는가? → **테스트 필요**
- [ ] 후속 요소가 자동으로 밀려나는가? → **테스트 필요**
- [ ] 폰트 변경 시 레이아웃이 유지되는가? → **테스트 필요**
- [x] 기존 absolute 프리셋이 그대로 동작하는가? → profile, calendar는 absolute 유지
- [x] mixed 모드에서 absolute/auto가 공존하는가? → natural-sparkle, balloon-heart에 적용

### 성능 검증
- [ ] 불필요한 리렌더링이 없는가?
- [ ] 많은 요소에서도 부드러운가?

### AI 검증
- [ ] AI가 auto layout으로 블록을 생성하는가?
- [ ] 생성된 레이아웃이 의도대로 동작하는가?

---

## 9. 타임라인

| 단계 | 예상 작업 |
|------|----------|
| Phase 1 | 스키마 확장 |
| Phase 2 | 렌더러 구현 |
| Phase 3 | 컴포넌트 조정 |
| Phase 4 | 프리셋 마이그레이션 (1-2개) |
| Phase 5 | AI 통합 |
| Phase 6 | 문서화 |

---

## 10. 참고

- [Figma Auto Layout Docs](https://help.figma.com/hc/en-us/articles/360040451373-Explore-auto-layout-properties)
- [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)
