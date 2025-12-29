# 프리셋 코드 템플릿

## Auto Layout 블록 프리셋 (Hero 제외)

```typescript
import { BlockPreset } from '../types';

export const PRESET_NAME: BlockPreset = {
  id: '{{blockType}}-{{variant}}',
  name: '{{한글 이름}}',
  description: '{{설명}}',

  // ─── 블록 설정 ───
  type: '{{blockType}}',
  layout: {
    mode: 'auto',  // ⚠️ Auto Layout First!
    direction: 'vertical',  // vertical | horizontal
    gap: 24,
    padding: {
      top: 60,
      right: 24,
      bottom: 60,
      left: 24,
    },
    alignItems: 'center',  // center | start | end | stretch
  },
  height: { type: 'hug' },  // 콘텐츠에 맞게 자동 조절

  // ─── 요소 정의 ───
  defaultElements: [
    // 장식 요소 (Absolute) - zIndex: 0
    {
      id: 'deco-1',
      type: 'image',
      layoutMode: 'absolute',
      x: 10,
      y: 5,
      width: 8,
      height: 10,
      zIndex: 0,
      value: '/decorations/sparkle.svg',
      props: { type: 'image', objectFit: 'contain' },
    },

    // Auto Layout 요소 - zIndex: 1+
    {
      id: 'title',
      type: 'text',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fill' },
        height: { type: 'hug' },
      },
      zIndex: 1,
      binding: 'greeting.title',
      props: { type: 'text' },
      style: {
        text: {
          fontFamily: 'var(--font-heading)',
          fontSize: 24,
          fontWeight: 600,
          color: 'var(--fg-emphasis)',
          textAlign: 'center',
        },
      },
    },

    // Group 요소
    {
      id: 'info-group',
      type: 'group',
      layoutMode: 'auto',
      sizing: { height: { type: 'hug' } },
      zIndex: 1,
      props: {
        type: 'group',
        layout: {
          direction: 'horizontal',
          gap: 16,
          alignItems: 'center',
        },
      },
      children: [
        // 자식 요소들...
      ],
    },
  ],

  // ─── 기본 스타일 ───
  defaultStyle: {
    background: 'var(--bg-section)',
  },
};
```

## Hero 블록 프리셋 (Absolute 모드)

```typescript
import { BlockPreset } from '../types';

export const HERO_PRESET_NAME: BlockPreset = {
  id: 'hero-{{variant}}',
  name: '{{한글 이름}}',
  description: '{{설명}}',

  // ─── 블록 설정 ───
  type: 'hero',
  // layout.mode 생략 또는 'absolute' (기본값)
  height: 100,  // vh (고정)

  // ─── 요소 정의 (모두 Absolute) ───
  defaultElements: [
    // 배경 이미지
    {
      id: 'hero-bg',
      type: 'image',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      zIndex: 0,
      binding: 'couple.photo',
      props: {
        type: 'image',
        objectFit: 'cover',
        overlay: 'rgba(0,0,0,0.3)',
      },
    },

    // 커플 이름
    {
      id: 'hero-names',
      type: 'text',
      x: 15,  // 가로 중앙: (100 - 70) / 2
      y: 40,
      width: 70,
      height: 10,
      zIndex: 2,
      props: {
        type: 'text',
        format: '{groom.name} ♥ {bride.name}',
      },
      style: {
        text: {
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'center',
        },
      },
    },

    // 날짜
    {
      id: 'hero-date',
      type: 'text',
      x: 20,
      y: 55,
      width: 60,
      height: 5,
      zIndex: 2,
      binding: 'wedding.dateDisplay',
      props: { type: 'text' },
      style: {
        text: {
          fontFamily: 'var(--font-body)',
          fontSize: 18,
          color: '#FFFFFF',
          textAlign: 'center',
        },
      },
    },
  ],
};
```

## 파일 위치

```
src/lib/super-editor-v2/presets/blocks/
├── hero/
│   └── {{variant}}.ts
├── greeting-parents/
│   └── {{variant}}.ts
├── profile/
│   └── {{variant}}.ts
├── calendar/
│   └── {{variant}}.ts
└── ...
```

## 레지스트리 등록

```typescript
// src/lib/super-editor-v2/presets/blocks/index.ts
export const BLOCK_PRESETS = {
  hero: {
    '{{variant}}': HERO_PRESET_NAME,
  },
  'greeting-parents': {
    '{{variant}}': GREETING_PRESET_NAME,
  },
  // ...
};
```
