/**
 * Passport Template Preset
 * 여권 스타일 - 여권 오프닝, 스탬프 효과, 여행 지도 타임라인
 */

import type { LegacyTemplatePreset } from './types'

export const passportPreset: LegacyTemplatePreset = {
  id: 'passport',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'The Passport',
  nameKo: '패스포트',
  category: 'classic',
  description: 'Travel-themed with passport opening animation, stamp effects, and journey map timeline',
  descriptionKo: '인생이라는 긴 여행을 함께 떠나는 컨셉, 여권 애니메이션과 입국 도장 효과',
  matchKeywords: ['여행', '여권', '패스포트', '비행기', '도장', '스탬프', '지도', '어드벤처', '장거리연애'],
  recommendedFor: 'Couples who love travel or met through long-distance relationship',
  recommendedForKo: '여행을 좋아하거나, 장거리 연애를 끝내고 결혼하는 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#1E3A5F',
      secondary: '#C9A962',
      background: '#F5F1E8',
      surface: '#FFFFFF',
      text: '#1E3A5F',
      textMuted: '#6B7B8C',
      accent: '#B8860B',
    },
    mood: ['여행', '모험적인', '클래식'],
  },

  // 인트로 설정
  intro: {
    type: 'passport',
    duration: 4000,
    skipEnabled: true,
    skipDelay: 2000,
    settings: {
      passportColor: 'navy',
      stampStyle: 'vintage',
      showMap: true,
    },
  },

  // 인터랙션 방식
  interaction: 'scroll',

  // 기본 색상
  defaultColors: {
    primary: '#1E3A5F',
    secondary: '#C9A962',
    background: '#F5F1E8',
    surface: '#FFFFFF',
    text: '#1E3A5F',
    textMuted: '#6B7B8C',
    accent: '#B8860B',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Courier Prime, monospace',
      weight: 700,
    },
    body: {
      family: 'Pretendard, sans-serif',
      weight: 400,
    },
    accent: {
      family: 'Special Elite, cursive',
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
      layout: 'centered',
      animation: {
        type: 'flip',
        trigger: 'on-enter',
        duration: 1500,
      },
      style: {
        padding: 'large',
      },
      content: {
        titleSize: 'large',
        themeSpecific: {
          passportCover: true,
          stampAnimation: true,
        },
      },
    },
    {
      id: 'story',
      type: 'story',
      enabled: true,
      order: 1,
      layout: 'stack',
      animation: {
        type: 'stamp',
        trigger: 'on-scroll',
        stagger: 300,
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          mapTimeline: true,
          locationStamps: true,
        },
      },
    },
    {
      id: 'gallery',
      type: 'gallery',
      enabled: true,
      order: 2,
      layout: 'carousel',
      animation: {
        type: 'slide-left',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'medium',
      },
      content: {
        decorationType: 'stamp',
      },
    },
    {
      id: 'greeting',
      type: 'greeting',
      enabled: true,
      order: 3,
      layout: 'centered',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'xlarge',
      },
    },
    {
      id: 'calendar',
      type: 'calendar',
      enabled: true,
      order: 4,
      layout: 'centered',
      animation: {
        type: 'stamp',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          boardingPassStyle: true,
        },
      },
    },
    {
      id: 'location',
      type: 'location',
      enabled: true,
      order: 5,
      layout: 'centered',
      animation: {
        type: 'zoom-in',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          earthZoomIn: true,
        },
      },
    },
    {
      id: 'account',
      type: 'account',
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
      id: 'message',
      type: 'message',
      enabled: true,
      order: 7,
      layout: 'centered',
      animation: {
        type: 'stamp',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          guestbookStamps: true,
        },
      },
    },
    {
      id: 'closing',
      type: 'closing',
      enabled: true,
      order: 8,
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
      type: 'pattern',
      value: 'passport-texture',
    },
    scrollBehavior: {
      smooth: true,
      indicator: true,
      indicatorStyle: 'dot',
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
