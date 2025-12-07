/**
 * Monogram Crest Template Preset
 * 커플 이니셜 모노그램 엠블럼, 네이비와 골드의 로열 프리미엄 디자인
 */

import type { PredefinedTemplatePreset } from './types'

export const monogramPreset: PredefinedTemplatePreset = {
  id: 'monogram',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Monogram Crest',
  nameKo: '모노그램 크레스트',
  category: 'classic',
  description: 'Royal emblem design with couple\'s monogram, navy and gold palette, and premium foil accents',
  descriptionKo: '커플 이니셜 모노그램 엠블럼, 네이비와 골드의 로열 프리미엄 디자인',
  matchKeywords: ['모노그램', '크레스트', '엠블럼', '로얄', '네이비', '골드', '프리미엄', '이니셜', '포일', '왕실'],
  recommendedFor: 'Couples who want a personalized royal emblem representing their union',
  recommendedForKo: '두 사람의 결합을 상징하는 개인화된 로열 엠블럼을 원하는 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#1E3A5F',
      secondary: '#C9A962',
      background: '#F5E6D3',
      surface: '#FFFFFF',
      text: '#1E3A5F',
      textMuted: '#6B7280',
      accent: '#C9A962',
    },
    mood: ['로열', '프리미엄', '클래식'],
  },

  // 인트로 설정
  intro: {
    type: 'cinematic', // monogram uses cinematic intro type
    duration: 3500,
    skipEnabled: true,
    skipDelay: 2000,
    settings: {
      emblemStyle: 'shield',
      foilEffect: true,
    },
  },

  // 인터랙션 방식
  interaction: 'scroll',

  // 기본 색상
  defaultColors: {
    primary: '#1E3A5F',
    secondary: '#C9A962',
    background: '#F5E6D3',
    surface: '#FFFFFF',
    text: '#1E3A5F',
    textMuted: '#6B7280',
    accent: '#C9A962',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Playfair Display, serif',
      weight: 600,
      letterSpacing: '0.05em',
    },
    body: {
      family: 'Noto Sans KR, sans-serif',
      weight: 300,
    },
    accent: {
      family: 'Cormorant Garamond, serif',
      weight: 500,
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
      layout: 'centered',
      animation: {
        type: 'scale',
        trigger: 'on-enter',
        duration: 1500,
      },
      style: {
        padding: 'xlarge',
      },
      content: {
        titleSize: 'large',
        themeSpecific: {
          monogramEmblem: true,
          foilAccent: true,
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
      layout: 'frame',
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
      type: 'solid',
      value: '#F5E6D3',
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
