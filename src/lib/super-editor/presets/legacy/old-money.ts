/**
 * Old Money Template Preset
 * 레터프레스 질감과 클래식 세리프 타이포그래피, 여백의 미가 돋보이는 Quiet Luxury
 */

import type { PredefinedTemplatePreset } from './types'

export const oldMoneyPreset: PredefinedTemplatePreset = {
  id: 'old-money',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Old Money',
  nameKo: '올드 머니',
  category: 'classic',
  description: 'Quiet luxury with letterpress texture, classic serif typography, and timeless ivory elegance',
  descriptionKo: '레터프레스 질감과 클래식 세리프 타이포그래피, 여백의 미가 돋보이는 Quiet Luxury',
  matchKeywords: ['올드머니', 'quiet luxury', '클래식', '레터프레스', '아이보리', '골드', '우아한', '타임리스', '상속녀', '럭셔리'],
  recommendedFor: 'Couples who appreciate timeless elegance and understated luxury',
  recommendedForKo: '시대를 초월한 우아함과 과시하지 않는 럭셔리를 추구하는 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#D4AF37',
      secondary: '#8B7355',
      background: '#FFFEF5',
      surface: '#FAF9F6',
      text: '#36454F',
      textMuted: '#6B7280',
      accent: '#D4AF37',
    },
    mood: ['우아한', '타임리스', '럭셔리'],
  },

  // 인트로 설정
  intro: {
    type: 'cinematic', // old-money uses cinematic intro type
    duration: 4000,
    skipEnabled: true,
    skipDelay: 2000,
    settings: {
      textureStyle: 'letterpress',
      ornamentStyle: 'wax-seal',
    },
  },

  // 인터랙션 방식
  interaction: 'scroll',

  // 기본 색상
  defaultColors: {
    primary: '#D4AF37',
    secondary: '#8B7355',
    background: '#FFFEF5',
    surface: '#FAF9F6',
    text: '#36454F',
    textMuted: '#6B7280',
    accent: '#D4AF37',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Cormorant Garamond, serif',
      weight: 500,
      letterSpacing: '0.08em',
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
      layout: 'centered',
      animation: {
        type: 'fade',
        trigger: 'on-enter',
        duration: 1500,
      },
      style: {
        padding: 'xlarge',
      },
      content: {
        titleSize: 'medium',
        themeSpecific: {
          waxSeal: true,
          letterpressTexture: true,
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
      value: '#FFFEF5',
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
