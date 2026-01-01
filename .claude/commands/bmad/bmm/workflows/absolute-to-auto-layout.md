---
description: 'Block preset을 absolute 레이아웃에서 auto-layout으로 변환합니다. 텍스트 오버플로우 방지 및 콘텐츠 가변 대응을 위한 마이그레이션 워크플로우.'
---

## Absolute to Auto Layout 변환 워크플로우

이 워크플로우는 `src/lib/super-editor-v2/presets/blocks/` 하위의 프리셋들을
absolute 레이아웃에서 auto-layout으로 변환합니다.

### 실행 방법

1. 워크플로우 문서를 읽습니다:
   - `Read .bmad/bmm/workflows/absolute-to-auto-layout/instructions.md`

2. 체크리스트를 참조합니다:
   - `Read .bmad/bmm/workflows/absolute-to-auto-layout/checklist.md`

3. Auto Layout 참조 문서:
   - `Read .bmad/bmm/workflows/block-preset-from-image/references/auto-layout.md`

### 변환 대상

현재 absolute 레이아웃을 사용하는 프리셋들:

| 파일 | 블록 타입 |
|------|----------|
| `ending/quote-share.ts` | ending |
| `greeting-parents/card-dual-heart.ts` | greeting-parents |
| `greeting-parents/natural-sparkle.ts` | greeting-parents |
| `profile/circle-portrait.ts` | profile |
| `calendar/handwritten-countdown.ts` | calendar |

### 핵심 원칙

- **Hero 블록 제외**: Hero 블록만 absolute 레이아웃 유지
- **콘텐츠 요소**: auto-layout의 sizing 시스템 사용
- **장식 요소**: 선택적으로 absolute 유지 또는 제거

<instructions>
Read .bmad/bmm/workflows/absolute-to-auto-layout/instructions.md 파일을 로드하고 워크플로우를 시작하세요.
</instructions>
