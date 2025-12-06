/**
 * Keynote Template Preset
 * Apple Keynote 스타일 - 스티키 스크롤, 다이나믹 텍스트 리빌, 시네마틱 줌 효과
 */

import type { LegacyTemplatePreset } from './types'

export const keynotePreset: LegacyTemplatePreset = {
  id: 'keynote',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'The Keynote',
  nameKo: '키노트',
  category: 'modern',
  description: 'Apple product launch style with sticky scroll, dynamic text reveals, and cinematic zoom effects',
  descriptionKo: '애플 제품 공개처럼 스크롤에 따라 텍스트가 서서히 떠오르고 이미지가 줌인/줌아웃되는 스타일',
  matchKeywords: ['애플', '키노트', '모던', '세련된', '깔끔한', '프리미엄', '미니멀', '테크', '스티키', '다이나믹'],
  recommendedFor: 'Couples who prefer clean, sophisticated design and have high-quality wedding photos',
  recommendedForKo: '깔끔하고 세련된 것을 선호하며, 웨딩 사진 퀄리티가 높은 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#000000',
      secondary: '#86868B',
      background: '#FFFFFF',
      surface: '#F5F5F7',
      text: '#1D1D1F',
      textMuted: '#86868B',
      accent: '#0071E3',
    },
    mood: ['세련된', '프리미엄', '다이나믹'],
  },

  // 인트로 설정
  intro: {
    type: 'keynote',
    duration: 4000,
    skipEnabled: true,
    skipDelay: 2000,
    settings: {
      stickyTexts: ['우리의 사랑', '그 완전히 새로운 시작'],
    },
  },

  // 인터랙션 방식
  interaction: 'sticky-scroll',

  // 기본 색상
  defaultColors: {
    primary: '#000000',
    secondary: '#86868B',
    background: '#FFFFFF',
    surface: '#F5F5F7',
    text: '#1D1D1F',
    textMuted: '#86868B',
    accent: '#0071E3',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'SF Pro Display, Pretendard',
      weight: 700,
      letterSpacing: '-0.02em',
    },
    body: {
      family: 'SF Pro Text, Pretendard',
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
        type: 'sticky-reveal',
        trigger: 'on-scroll',
        duration: 1000,
      },
      style: {
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
        padding: 'none',
      },
      content: {
        titleSize: 'hero',
        titleAnimation: 'zoom-in',
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
        duration: 800,
      },
      style: {
        padding: 'xlarge',
      },
      content: {
        titleSize: 'large',
      },
    },
    {
      id: 'gallery',
      type: 'gallery',
      enabled: true,
      order: 2,
      layout: 'fullscreen',
      animation: {
        type: 'parallax',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'none',
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
      layout: 'centered',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
      },
    },
  ],

  // 효과 설정
  effects: {
    scrollBehavior: {
      smooth: true,
      indicator: true,
      indicatorStyle: 'progress',
      snapToSection: false,
    },
    transition: {
      type: 'fade',
      duration: 300,
    },
  },

  // 커스터마이징
  customizable: {
    colors: true,
    fonts: false,
    sectionOrder: true,
    sectionToggle: true,
    introSettings: true,
    effects: true,
  },
}
