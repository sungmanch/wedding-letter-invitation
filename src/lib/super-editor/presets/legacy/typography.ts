/**
 * Typography Template Preset
 * 미니멀 타이포 스타일 - 키네틱 텍스트, 흑백 대비, 히든 포토
 */

import type { LegacyTemplatePreset } from './types'

export const typographyPreset: LegacyTemplatePreset = {
  id: 'typography',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Minimalist Typo',
  nameKo: '미니멀 타이포',
  category: 'artistic',
  description: 'Typography-focused design with kinetic text, bold contrasts, and hidden photo reveals',
  descriptionKo: '사진보다 글자의 미학을 강조, 키네틱 타이포그래피와 강렬한 블랙&화이트',
  matchKeywords: ['타이포', '글자', '미니멀', '흑백', '네온', '디자이너', '시크', '모던', '포스터'],
  recommendedFor: 'Designer couples or those who prefer minimal photo exposure',
  recommendedForKo: '디자이너 커플, 혹은 사진 공개를 최소화하고 싶은 시크한 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#FFFFFF',
      secondary: '#333333',
      background: '#000000',
      surface: '#111111',
      text: '#FFFFFF',
      textMuted: '#666666',
      accent: '#FFFFFF',
    },
    mood: ['시크한', '미니멀', '아티스틱'],
  },

  // 인트로 설정
  intro: {
    type: 'typography',
    duration: 4000,
    skipEnabled: true,
    skipDelay: 2000,
    settings: {
      colorScheme: 'bw',
      motionIntensity: 'dynamic',
      hiddenPhotos: true,
    },
  },

  // 인터랙션 방식
  interaction: 'scroll',

  // 기본 색상
  defaultColors: {
    primary: '#FFFFFF',
    secondary: '#333333',
    background: '#000000',
    surface: '#111111',
    text: '#FFFFFF',
    textMuted: '#666666',
    accent: '#FFFFFF',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Bebas Neue, sans-serif',
      weight: 400,
      letterSpacing: '0.05em',
    },
    body: {
      family: 'Inter, sans-serif',
      weight: 300,
    },
    accent: {
      family: 'Space Mono, monospace',
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
        type: 'kinetic-text',
        trigger: 'on-enter',
        duration: 3000,
      },
      style: {
        padding: 'none',
      },
      content: {
        titleSize: 'hero',
        titleAnimation: 'kinetic-text',
      },
    },
    {
      id: 'greeting',
      type: 'greeting',
      enabled: true,
      order: 1,
      layout: 'centered',
      animation: {
        type: 'kinetic-text',
        trigger: 'on-scroll',
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
        trigger: 'on-click',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          hiddenOnPress: true,
          revealHint: '길게 눌러 사진 보기',
        },
      },
    },
    {
      id: 'calendar',
      type: 'calendar',
      enabled: true,
      order: 3,
      layout: 'fullscreen',
      animation: {
        type: 'kinetic-text',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'xlarge',
      },
      content: {
        titleSize: 'hero',
      },
    },
    {
      id: 'location',
      type: 'location',
      enabled: true,
      order: 4,
      layout: 'centered',
      animation: {
        type: 'slide-up',
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
      layout: 'fullscreen',
      animation: {
        type: 'kinetic-text',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'xlarge',
      },
    },
  ],

  // 효과 설정
  effects: {
    cursor: {
      type: 'custom',
      asset: 'crosshair',
    },
    scrollBehavior: {
      smooth: true,
      indicator: true,
      indicatorStyle: 'line',
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
