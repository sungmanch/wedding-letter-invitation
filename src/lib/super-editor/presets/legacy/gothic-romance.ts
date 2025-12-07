/**
 * Gothic Romance Template Preset
 * 딥 버건디와 에메랄드의 무디한 색감, 빅토리안 우아함과 드라마틱한 분위기
 */

import type { PredefinedTemplatePreset } from './types'

export const gothicRomancePreset: PredefinedTemplatePreset = {
  id: 'gothic-romance',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Gothic Romance',
  nameKo: '고딕 로맨스',
  category: 'cinematic',
  description: 'Dark, moody aesthetic with deep jewel tones, Victorian-inspired elegance, and dramatic shadows',
  descriptionKo: '딥 버건디와 에메랄드의 무디한 색감, 빅토리안 우아함과 드라마틱한 분위기',
  matchKeywords: ['무디', '고딕', '드라마틱', '주얼톤', '버건디', '에메랄드', '빅토리안', '다크', '로맨틱', '럭셔리'],
  recommendedFor: 'Couples who love dramatic, moody aesthetics with deep jewel tones and vintage elegance',
  recommendedForKo: '드라마틱하고 무디한 분위기를 선호하며, 깊은 주얼톤과 빈티지 우아함을 원하는 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#722F37',
      secondary: '#2F4538',
      background: '#0D0D0D',
      surface: '#1A1A1A',
      text: '#F5E6D3',
      textMuted: '#A89F91',
      accent: '#C9A962',
    },
    mood: ['무디한', '드라마틱', '럭셔리'],
  },

  // 인트로 설정
  intro: {
    type: 'cinematic', // gothic-romance uses cinematic intro type
    duration: 4500,
    skipEnabled: true,
    skipDelay: 2500,
    settings: {
      colorScheme: 'jewel',
      vignetteIntensity: 'strong',
      ornamentStyle: 'victorian',
    },
  },

  // 인터랙션 방식
  interaction: 'scroll',

  // 기본 색상
  defaultColors: {
    primary: '#722F37',
    secondary: '#2F4538',
    background: '#0D0D0D',
    surface: '#1A1A1A',
    text: '#F5E6D3',
    textMuted: '#A89F91',
    accent: '#C9A962',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Cormorant Garamond, serif',
      weight: 500,
      style: 'italic',
      letterSpacing: '0.05em',
    },
    body: {
      family: 'Noto Sans KR, sans-serif',
      weight: 300,
    },
    accent: {
      family: 'Cormorant Garamond, serif',
      weight: 400,
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
          vignette: true,
          ornaments: true,
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
      value: 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
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
