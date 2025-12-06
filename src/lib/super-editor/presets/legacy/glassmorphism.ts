/**
 * Glassmorphism Template Preset
 * 글래스모피즘 스타일 - 3D 오브젝트, 유리 질감, 오로라 그라데이션
 */

import type { LegacyTemplatePreset } from './types'

export const glassmorphismPreset: LegacyTemplatePreset = {
  id: 'glassmorphism',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Glassmorphism',
  nameKo: '글래스모피즘',
  category: 'modern',
  description: 'Framer-style 3D objects with glass-like textures, aurora gradients, and fluid motion',
  descriptionKo: '유리 같은 질감과 3D 오브젝트가 둥둥 떠다니는 몽환적인 스타일, 오로라 그라데이션',
  matchKeywords: ['글래스', '3D', '프레이머', '모던', '테크', '오로라', '투명', '몽환적', '부드러운'],
  recommendedFor: 'Young, tech-savvy couples who love trendy design',
  recommendedForKo: '트렌디한 디자인과 IT/테크에 친숙한 젊은 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#A855F7',
      secondary: '#3B82F6',
      background: '#0F0F23',
      surface: 'rgba(255,255,255,0.1)',
      text: '#FFFFFF',
      textMuted: 'rgba(255,255,255,0.6)',
      accent: '#EC4899',
      overlay: 'rgba(255,255,255,0.05)',
    },
    mood: ['몽환적인', '트렌디한', '미래적인'],
  },

  // 인트로 설정
  intro: {
    type: 'glassmorphism',
    duration: 4000,
    skipEnabled: true,
    skipDelay: 2000,
    settings: {
      glassOpacity: 0.1,
      gradientColors: ['#A855F7', '#3B82F6', '#EC4899'],
      floatingObjects: ['heart', 'ring', 'star'],
    },
  },

  // 인터랙션 방식
  interaction: 'scroll',

  // 기본 색상
  defaultColors: {
    primary: '#A855F7',
    secondary: '#3B82F6',
    background: '#0F0F23',
    surface: 'rgba(255,255,255,0.1)',
    text: '#FFFFFF',
    textMuted: 'rgba(255,255,255,0.6)',
    accent: '#EC4899',
    overlay: 'rgba(255,255,255,0.05)',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Outfit, sans-serif',
      weight: 600,
    },
    body: {
      family: 'Inter, sans-serif',
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
        type: 'scale',
        trigger: 'on-enter',
        duration: 1500,
      },
      style: {
        padding: 'xlarge',
        glassmorphism: true,
        backgroundEffect: 'aurora',
      },
      content: {
        titleSize: 'xlarge',
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
      },
      style: {
        padding: 'xlarge',
        glassmorphism: true,
      },
    },
    {
      id: 'gallery',
      type: 'gallery',
      enabled: true,
      order: 2,
      layout: 'grid',
      animation: {
        type: 'scale',
        trigger: 'on-scroll',
        stagger: 100,
      },
      style: {
        padding: 'large',
        glassmorphism: true,
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
        glassmorphism: true,
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
        glassmorphism: true,
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
        glassmorphism: true,
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
        glassmorphism: true,
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
        padding: 'xlarge',
      },
    },
  ],

  // 효과 설정
  effects: {
    background: {
      type: 'aurora',
      value: 'linear-gradient(135deg, #A855F7, #3B82F6, #EC4899)',
      animation: 'aurora-flow',
    },
    particles: {
      enabled: true,
      type: 'sparkle',
      density: 'low',
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
