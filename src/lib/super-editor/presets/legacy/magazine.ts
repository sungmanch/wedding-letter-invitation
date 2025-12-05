/**
 * Magazine Template Preset
 * 매거진 스타일 - 에디토리얼 레이아웃, 페이지 플립, 인터뷰 포맷
 */

import type { LegacyTemplatePreset } from './types'

export const magazinePreset: LegacyTemplatePreset = {
  id: 'magazine',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'The Magazine',
  nameKo: '매거진',
  category: 'modern',
  description: 'Vogue/Kinfolk editorial style with bold typography overlays, page-flip transitions, and interview format',
  descriptionKo: '보그/킨포크처럼 패션 잡지를 넘겨보는 듯한 레이아웃, 과감한 타이포그래피와 페이지 넘김 효과',
  matchKeywords: ['매거진', '보그', '킨포크', '패션', '에디토리얼', '잡지', '화보', '인터뷰', '스타일'],
  recommendedFor: 'Couples who are fashion-conscious and have studio photos that look like editorials',
  recommendedForKo: '패션에 관심이 많고 스튜디오 촬영본이 화보처럼 잘 나온 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#000000',
      secondary: '#E8E4DF',
      background: '#F8F6F3',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textMuted: '#6B6B6B',
      accent: '#C4A77D',
    },
    mood: ['트렌디한', '감각적인', '에디토리얼'],
  },

  // 인트로 설정
  intro: {
    type: 'magazine',
    duration: 2500,
    skipEnabled: true,
    skipDelay: 1000,
    settings: {
      coverStyle: 'vogue',
      pageTransition: 'flip',
    },
  },

  // 인터랙션 방식
  interaction: 'swipe',

  // 기본 색상
  defaultColors: {
    primary: '#000000',
    secondary: '#E8E4DF',
    background: '#F8F6F3',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#6B6B6B',
    accent: '#C4A77D',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Playfair Display, serif',
      weight: 700,
      style: 'italic',
    },
    body: {
      family: 'Pretendard, sans-serif',
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
      layout: 'overlay-text',
      animation: {
        type: 'page-turn',
        trigger: 'on-enter',
      },
      style: {
        padding: 'none',
      },
      content: {
        titleSize: 'hero',
        themeSpecific: {
          magazineCover: true,
        },
      },
    },
    {
      id: 'interview',
      type: 'interview',
      enabled: true,
      order: 1,
      layout: 'split',
      animation: {
        type: 'page-turn',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          interviewFormat: true,
        },
      },
    },
    {
      id: 'gallery',
      type: 'gallery',
      enabled: true,
      order: 2,
      layout: 'masonry',
      animation: {
        type: 'page-turn',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'medium',
      },
    },
    {
      id: 'greeting',
      type: 'greeting',
      enabled: true,
      order: 3,
      layout: 'overlay-text',
      animation: {
        type: 'page-turn',
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
        type: 'page-turn',
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
      order: 5,
      layout: 'split',
      animation: {
        type: 'page-turn',
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
      order: 6,
      layout: 'centered',
      animation: {
        type: 'page-turn',
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
        type: 'page-turn',
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
      order: 8,
      layout: 'centered',
      animation: {
        type: 'page-turn',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'xlarge',
      },
    },
  ],

  // 효과 설정
  effects: {
    scrollBehavior: {
      smooth: true,
      snapToSection: true,
    },
    transition: {
      type: 'slide',
      duration: 500,
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
