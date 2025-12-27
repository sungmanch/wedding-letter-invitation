# Super Editor v2 문서 인덱스

AI 기반 청첩장 에디터 시스템의 기술 문서입니다.

---

## 1. 데이터 스키마

| 문서 | 내용 | 토큰 |
|------|------|------|
| [01a_core_schema.md](./01a_core_schema.md) | EditorDocument, Block, Element, WeddingData | ~600 |
| [01b_style_system.md](./01b_style_system.md) | 3-Level 스타일 시스템, SemanticTokens | ~500 |

---

## 2. 애니메이션 시스템

| 문서 | 내용 | 토큰 |
|------|------|------|
| [02a_triggers_actions.md](./02a_triggers_actions.md) | 트리거, 액션 타입, 프리셋 | ~700 |
| [02b_state_machine.md](./02b_state_machine.md) | 상태 머신, Floating 요소, AI 통합 | ~500 |

---

## 3. 변수 시스템

| 문서 | 내용 | 토큰 |
|------|------|------|
| [03_variables.md](./03_variables.md) | AVAILABLE_VARIABLES, Computed Fields | ~800 |

---

## 4. 에디터 UI

| 문서 | 내용 | 토큰 |
|------|------|------|
| [04a_layout_tabs.md](./04a_layout_tabs.md) | 2패널 레이아웃, 탭 구조, Section-First | ~400 |
| [04b_variable_editors.md](./04b_variable_editors.md) | 변수 기반 에디터, Compound 입력 | ~500 |
| [04c_direct_editing.md](./04c_direct_editing.md) | 드래그앤드롭, 컨텍스트 메뉴, ID 시스템 | ~500 |
| [04d_ai_context.md](./04d_ai_context.md) | AI 프롬프트 컨텍스트 압축 | ~400 |
| [04e_design_tab.md](./04e_design_tab.md) | 디자인 탭, 3-Level 스타일 UI | ~600 |

---

## 5. 렌더러 시스템

| 문서 | 내용 | 토큰 |
|------|------|------|
| [05a_context_providers.md](./05a_context_providers.md) | React Context, 변수 바인딩 해석 | ~400 |
| [05b_block_element_renderer.md](./05b_block_element_renderer.md) | 블록/요소 렌더러 컴포넌트 | ~600 |
| [05c_animation_runtime.md](./05c_animation_runtime.md) | GSAP 기반 애니메이션 런타임 | ~500 |
| [05d_style_resolver.md](./05d_style_resolver.md) | 스타일 해석, K-means 색상 추출 | ~600 |

---

## 6. AI 시스템

| 문서 | 내용 | 토큰 |
|------|------|------|
| [06_ai_prompt.md](./06_ai_prompt.md) | AI 프롬프트 시스템 가이드 | ~1,200 |

---

## 7. 레이아웃 시스템

| 문서 | 내용 | 토큰 |
|------|------|------|
| [08_auto_layout.md](./08_auto_layout.md) | Auto Layout 시스템 (Figma 스타일) | ~800 |

---

## 8. 기타

| 문서 | 내용 | 토큰 |
|------|------|------|
| [06_web_worker.md](./06_web_worker.md) | Web Worker (K-means 분리) | ~500 |
| [07_typography_system.md](./07_typography_system.md) | 타이포그래피 프리셋 시스템 | ~400 |

---

## 문서 구조도

```
super-editor-v2/
├── index.md                     # 이 파일
│
├── 01_데이터_스키마/
│   ├── 01a_core_schema.md       # 핵심 데이터 구조
│   └── 01b_style_system.md      # 3-Level 스타일
│
├── 02_애니메이션/
│   ├── 02a_triggers_actions.md  # 트리거/액션
│   └── 02b_state_machine.md     # 상태 머신
│
├── 03_variables.md              # 변수 시스템
│
├── 04_에디터_UI/
│   ├── 04a_layout_tabs.md       # 레이아웃
│   ├── 04b_variable_editors.md  # 변수 에디터
│   ├── 04c_direct_editing.md    # 직접 편집
│   ├── 04d_ai_context.md        # AI 컨텍스트
│   └── 04e_design_tab.md        # 디자인 탭
│
├── 05_렌더러/
│   ├── 05a_context_providers.md # 컨텍스트
│   ├── 05b_block_element_renderer.md # 블록/요소
│   ├── 05c_animation_runtime.md # 애니메이션 런타임
│   └── 05d_style_resolver.md    # 스타일 해석
│
├── 06_ai_prompt.md              # AI 프롬프트 시스템
├── 06_web_worker.md             # Web Worker
├── 07_typography_system.md      # 타이포그래피
└── 08_auto_layout.md            # Auto Layout 시스템
```

---

## 빠른 참조

### 핵심 타입

- `EditorDocument` → [01a_core_schema.md](./01a_core_schema.md)
- `Block`, `Element` → [01a_core_schema.md](./01a_core_schema.md)
- `StyleSystem`, `SemanticTokens` → [01b_style_system.md](./01b_style_system.md)
- `AnimationAction`, `Trigger` → [02a_triggers_actions.md](./02a_triggers_actions.md)
- `AnimationStateMachine` → [02b_state_machine.md](./02b_state_machine.md)
- `AVAILABLE_VARIABLES` → [03_variables.md](./03_variables.md)
- `SizeMode`, `BlockLayout` → [08_auto_layout.md](./08_auto_layout.md)

### 주요 컴포넌트

- `DocumentRenderer` → [05b_block_element_renderer.md](./05b_block_element_renderer.md)
- `BlockRenderer`, `ElementRenderer` → [05b_block_element_renderer.md](./05b_block_element_renderer.md)
- `DesignTab` → [04e_design_tab.md](./04e_design_tab.md)
- `DraggableElement` → [04c_direct_editing.md](./04c_direct_editing.md)

### 유틸리티

- `resolveBinding()` → [05a_context_providers.md](./05a_context_providers.md)
- `resolveStyleSystem()` → [05d_style_resolver.md](./05d_style_resolver.md)
- `extractPaletteOptimized()` → [05d_style_resolver.md](./05d_style_resolver.md)
- `applyAction()` → [05c_animation_runtime.md](./05c_animation_runtime.md)
