# Absolute to Auto Layout 변환 워크플로우

이 워크플로우는 `src/lib/super-editor-v2/presets/blocks/` 하위의 프리셋들을
absolute 레이아웃에서 auto-layout으로 변환합니다.

---

## 핵심 원칙

**Hero 블록을 제외한 모든 블록은 Auto Layout을 기본으로 사용합니다.**

| 블록 타입 | 레이아웃 모드 | 이유 |
|----------|--------------|------|
| `hero` | **absolute** | 배경 이미지 중심, 정밀 배치 필요 |
| 그 외 모든 블록 | **auto** | 텍스트 오버플로우 방지, 콘텐츠 가변 대응 |

---

## 참조 문서

필요 시 아래 문서를 `Read` 도구로 로드하세요:

| 문서 | 경로 | 용도 |
|------|------|------|
| Auto Layout 참조 | `../block-preset-from-image/references/auto-layout.md` | SizeMode, 블록별 권장 설정 |
| 컬러 시스템 | `../block-preset-from-image/references/color-system.md` | P-S-T 컬러, 시맨틱 토큰 |
| Auto 요소 템플릿 | `../block-preset-from-image/references/element-templates/auto-element.md` | text, image, button 등 |
| Absolute 요소 템플릿 | `../block-preset-from-image/references/element-templates/absolute-element.md` | 장식 요소 참조용 |

---

## 워크플로우 단계

### Step 0: 변환 대상 선택

<ask>
**Absolute → Auto Layout 변환 대상 선택**

현재 absolute 레이아웃을 사용하는 프리셋들:

| 파일 | 블록 타입 | absolute 요소 수 |
|------|----------|-----------------|
| `ending/quote-share.ts` | ending | 1 (Group 내) |
| `greeting-parents/card-dual-heart.ts` | greeting-parents | 1 |
| `greeting-parents/natural-sparkle.ts` | greeting-parents | 6 (장식) |
| `profile/circle-portrait.ts` | profile | 3 |
| `calendar/handwritten-countdown.ts` | calendar | 1 |

**입력 형식:**
- `all` - 모든 absolute 프리셋 변환
- 파일명: `natural-sparkle,circle-portrait` (쉼표 구분)
- 블록타입: `greeting-parents:*` (해당 블록 전체)

입력:
</ask>

<action>사용자 입력을 `target_presets` 변수에 저장</action>

---

### Step 1: 대상 프리셋 분석

<action>선택된 프리셋 파일 로드 및 분석</action>

각 프리셋에서 다음을 추출:

| 분석 항목 | 설명 |
|----------|------|
| **layoutMode: 'absolute'** 요소들 | x, y, width, height 좌표 확인 |
| **역할 분류** | 콘텐츠 vs 장식(decoration) |
| **중첩 구조** | Group 내 absolute 여부 |
| **z-index 패턴** | 레이어 순서 |

### 분석 결과 템플릿

```markdown
## 프리셋: {{preset_name}}

### 현재 구조
- layout.mode: {{current_mode}}
- absolute 요소 수: {{absolute_count}}

### 요소별 분석
| 요소 | 타입 | 역할 | 변환 방안 |
|------|------|------|----------|
| {{element_1}} | {{type}} | content/decoration | auto/keep-absolute |
| {{element_2}} | {{type}} | content/decoration | auto/keep-absolute |

### 변환 전략
- 콘텐츠 요소: auto-layout으로 변환
- 장식 요소: 별도 처리 (position: absolute 유지 or 제거)
```

<ask>
분석 결과를 확인하시겠습니까?
[c] Continue with transformation
[e] Edit analysis
[s] Skip this preset
</ask>

---

### Step 2: 변환 규칙 적용

## 2.1 좌표 → sizing 변환

**Absolute 요소의 좌표를 Auto Layout sizing으로 변환:**

| Absolute 속성 | Auto Layout 속성 | 변환 규칙 |
|--------------|-----------------|----------|
| `x`, `y` | 제거 | Auto Layout이 자동 배치 |
| `width: fixed` | `sizing.width.type: 'fixed'` | 값 유지 (px → number) |
| `width: 100%` | `sizing.width.type: 'fill'` | 부모 채우기 |
| `height: auto` | `sizing.height.type: 'hug'` | 콘텐츠에 맞춤 |

## 2.2 변환 코드 패턴

**Before (Absolute):**
```typescript
{
  type: 'text',
  layoutMode: 'absolute',
  x: 10,
  y: 20,
  width: 80,
  height: 10,
  zIndex: 1,
  // ...
}
```

**After (Auto Layout):**
```typescript
{
  type: 'text',
  zIndex: 1,
  sizing: {
    width: { type: 'fill' },    // 80% → fill (일반적)
    height: { type: 'hug' }     // auto height
  },
  // x, y, width, height 제거
  // layoutMode 제거 (auto가 기본값)
  // ...
}
```

## 2.3 중앙 정렬 처리

Absolute에서 중앙 정렬 (`x = (100 - width) / 2`)인 요소:

```typescript
// Before
{
  x: 10,
  width: 80, // 중앙: x = (100-80)/2 = 10
}

// After
{
  sizing: { width: { type: 'fixed', value: 80, unit: '%' } },
  alignSelf: 'center', // 부모의 alignItems 활용
}
```

## 2.4 장식 요소 처리

**장식(sparkle, flower 등)은 선택적 처리:**

| 옵션 | 처리 방법 |
|------|----------|
| **유지** | `layoutMode: 'absolute'` 그대로 유지 (z-index로 레이어링) |
| **제거** | 장식 요소 삭제 (미니멀한 버전) |
| **CSS 배경** | `style.background` 이미지로 대체 |

<ask>
장식 요소 처리 방법을 선택하세요:
[k] Keep absolute - 장식은 absolute 유지
[r] Remove - 장식 요소 제거
[b] Background - 블록 배경 이미지로 이동
</ask>

---

### Step 3: 프리셋 변환 실행

<action>선택된 프리셋 파일 변환 실행</action>

각 프리셋에 대해:

1. **블록 layout 변경**
```typescript
// Before
layout: {
  mode: 'absolute',
  // ...
}

// After
layout: {
  mode: 'auto',
  direction: 'vertical',
  gap: 20,
  padding: { top: 40, right: 24, bottom: 40, left: 24 },
  alignItems: 'center',
}
```

2. **height를 hug로 변경**
```typescript
// Before
defaultHeight: 80 // vh

// After
defaultHeight: { type: 'hug' }
```

3. **요소별 변환**
   - 콘텐츠 요소: absolute → auto sizing
   - 장식 요소: 선택된 처리 방법 적용

4. **_shared.ts 확인**
```typescript
// AUTO_LAYOUT_VERTICAL, HUG_HEIGHT 상수 사용
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
```

---

### Step 4: 공통 상수 확인

<action>`_shared.ts` 파일 확인 및 필요시 업데이트</action>

**필수 상수 (없으면 추가):**

```typescript
// _shared.ts
import type { BlockLayout, SizeMode } from '../../../schema/types'

/** Auto Layout 기본 설정 - 세로 방향 */
export const AUTO_LAYOUT_VERTICAL: BlockLayout = {
  mode: 'auto',
  direction: 'vertical',
  gap: 20,
  padding: { top: 40, right: 24, bottom: 40, left: 24 },
  alignItems: 'center',
}

/** Hug Height - 콘텐츠에 맞게 자동 조절 */
export const HUG_HEIGHT: SizeMode = { type: 'hug' }
```

---

### Step 5: 타입 체크 및 검증

<action>TypeScript 컴파일 및 검증</action>

```bash
npx tsc --noEmit src/lib/super-editor-v2/presets/blocks/{{blockType}}/{{variant}}.ts
```

### 검증 체크리스트

- [ ] `layoutMode: 'absolute'` 제거됨 (장식 제외)
- [ ] `x`, `y`, `width`, `height` → `sizing` 변환됨
- [ ] `layout.mode: 'auto'` 설정됨
- [ ] `defaultHeight: { type: 'hug' }` 설정됨
- [ ] 타입 에러 없음
- [ ] 태그에 `'auto-layout'` 추가됨

---

### Step 6: 결과 보고

```markdown
## 변환 완료: {{preset_name}}

### 변경 사항
- layout.mode: absolute → auto
- 변환된 요소: {{count}} 개
- 유지된 absolute 요소: {{kept_count}} 개 (장식)

### 파일
`src/lib/super-editor-v2/presets/blocks/{{blockType}}/{{variant}}.ts`

### 검증
- [x] TypeScript 컴파일 성공
- [x] tags에 'auto-layout' 추가
```

<ask>
[n] Next preset - 다음 프리셋 변환
[r] Revert - 이 변환 되돌리기
[q] Quit - 워크플로우 종료
</ask>

---

## 변환 예시: natural-sparkle.ts

### Before
```typescript
const SPARKLE_ELEMENTS: PresetElement[] = [
  {
    type: 'image',
    layoutMode: 'absolute',
    x: 5,
    y: 8,
    width: 8,
    height: 8,
    zIndex: 0, // 장식 (배경)
    // ...
  },
  {
    type: 'text',
    layoutMode: 'absolute',
    x: 10,
    y: 15,
    width: 80,
    height: 10,
    zIndex: 1, // 콘텐츠
    binding: 'greeting.title',
    // ...
  }
]

export const GREETING_PARENTS_NATURAL_SPARKLE: BlockPreset = {
  layout: {
    mode: 'absolute',
  },
  defaultHeight: 80,
  // ...
}
```

### After
```typescript
// 장식은 absolute 유지, 콘텐츠는 auto로 변환
const DECORATION_ELEMENTS: PresetElement[] = [
  {
    type: 'image',
    layoutMode: 'absolute',
    x: 5,
    y: 8,
    width: 8,
    height: 8,
    zIndex: 0,
    // ...
  },
]

const CONTENT_ELEMENTS: PresetElement[] = [
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'greeting.title',
    // x, y, width, height, layoutMode 제거
    // ...
  }
]

const ELEMENTS: PresetElement[] = [
  ...DECORATION_ELEMENTS,
  ...CONTENT_ELEMENTS,
]

export const GREETING_PARENTS_NATURAL_SPARKLE: BlockPreset = {
  layout: AUTO_LAYOUT_VERTICAL,
  defaultHeight: HUG_HEIGHT,
  tags: [...existingTags, 'auto-layout'],
  // ...
}
```

---

## 완료

<action>모든 변환 완료 후 요약 보고</action>

```markdown
## Auto Layout 변환 완료 요약

### 변환된 프리셋
| 프리셋 | 변환된 요소 | 유지된 absolute |
|--------|-----------|----------------|
| {{preset_1}} | {{count_1}} | {{kept_1}} |
| {{preset_2}} | {{count_2}} | {{kept_2}} |

### 다음 단계
1. 프리뷰에서 렌더링 테스트
2. 레이아웃 미세 조정 (gap, padding)
3. 반응형 확인
```
