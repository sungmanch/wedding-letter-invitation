/**
 * Jewel Velvet Template Preset
 * 에메랄드와 버건디의 깊은 주얼톤, 벨벳 텍스처의 드라마틱 럭셔리
 */

import type { PredefinedTemplatePreset } from './types'

export const jewelVelvetPreset: PredefinedTemplatePreset = {
  id: 'jewel-velvet',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Jewel Velvet',
  nameKo: '주얼 벨벳',
  category: 'cinematic',
  description: 'Deep jewel tones with velvet texture, emerald and burgundy gradient, dramatic luxury',
  descriptionKo: '에메랄드와 버건디의 깊은 주얼톤, 벨벳 텍스처의 드라마틱 럭셔리',
  matchKeywords: ['주얼톤', '벨벳', '에메랄드', '버건디', '드라마틱', '럭셔리', '무디', '보석', '질감', '깊은'],
  recommendedFor: 'Couples who love rich, dramatic aesthetics with deep jewel tones',
  recommendedForKo: '깊고 드라마틱한 주얼톤의 럭셔리한 분위기를 원하는 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#2F4538',
      secondary: '#722F37',
      background: '#0D0D0D',
      surface: '#1A1A1A',
      text: '#F5E6D3',
      textMuted: '#A89F91',
      accent: '#C9A962',
    },
    mood: ['드라마틱', '무디', '럭셔리'],
  },

  // 인트로 설정
  intro: {
    type: 'jewel-velvet',
    duration: 4500,
    skipEnabled: true,
    skipDelay: 2500,
    settings: {
      gradientStyle: 'emerald-burgundy',
      velvetTexture: true,
    },
  },

  // 인터랙션 방식
  interaction: 'scroll',

  // 기본 색상
  defaultColors: {
    primary: '#2F4538',
    secondary: '#722F37',
    background: '#0D0D0D',
    surface: '#1A1A1A',
    text: '#F5E6D3',
    textMuted: '#A89F91',
    accent: '#C9A962',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Nanum Myeongjo, serif',
      weight: 400,
      letterSpacing: '0.1em',
    },
    body: {
      family: 'Noto Sans KR, sans-serif',
      weight: 300,
    },
    accent: {
      family: 'Cormorant Garamond, serif',
      weight: 400,
      style: 'italic',
    },
  },

  // 섹션 정의
  sections: [
    {
      id: 'hero',
      type: 'hero',
      enabled: true,
      order: 0,
      layout: 'fullscreen',
      animation: {
        type: 'fade',
        trigger: 'on-enter',
        duration: 2000,
      },
      style: {
        padding: 'none',
        backgroundEffect: 'gradient',
      },
      content: {
        titleSize: 'large',
        themeSpecific: {
          velvetGradient: true,
          jewelOverlay: true,
        },
      },
    },
    {
      id: 'greeting',
      type: 'greeting',
      enabled: true,
      order: 1,
      layout: 'centered',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
        duration: 1200,
      },
      style: {
        padding: 'xlarge',
      },
    },
    {
      id: 'gallery',
      type: 'gallery',
      enabled: true,
      order: 2,
      layout: 'masonry',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
    },
    {
      id: 'calendar',
      type: 'calendar',
      enabled: true,
      order: 3,
      layout: 'centered',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
    },
    {
      id: 'location',
      type: 'location',
      enabled: true,
      order: 4,
      layout: 'centered',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
    },
    {
      id: 'account',
      type: 'account',
      enabled: true,
      order: 5,
      layout: 'centered',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
    },
    {
      id: 'message',
      type: 'message',
      enabled: true,
      order: 6,
      layout: 'centered',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
    },
    {
      id: 'closing',
      type: 'closing',
      enabled: true,
      order: 7,
      layout: 'centered',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
        duration: 1500,
      },
      style: {
        padding: 'xlarge',
      },
    },
  ],

  // 효과 설정
  effects: {
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #2F4538 0%, #0D0D0D 50%, #722F37 100%)',
    },
    scrollBehavior: {
      smooth: true,
      indicator: false,
    },
  },

  // 커스터마이징
  customizable: {
    colors: true,
    fonts: true,
    sectionOrder: true,
    sectionToggle: true,
    introSettings: true,
    effects: true,
  },
}
