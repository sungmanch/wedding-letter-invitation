/**
 * Cinematic Template Preset
 * 화양연화 스타일 - 필름 그레인, 레터박스, 자막 스타일 캡션
 */

import type { PredefinedTemplatePreset } from './types'

export const cinematicPreset: PredefinedTemplatePreset = {
  id: 'cinematic',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Cinematic Mood',
  nameKo: '시네마틱 무드',
  category: 'cinematic',
  description: 'Film noir / In the Mood for Love style with letterbox format, film grain, and subtitle-like captions',
  descriptionKo: '화양연화처럼 영화의 한 장면 같은 분위기, 필름 그레인 효과와 자막 스타일 연출',
  matchKeywords: ['영화', '시네마틱', '화양연화', '필름', '빈티지', '감성', '레트로', '누아르', '자막', '그레인'],
  recommendedFor: 'Couples who love emotional, vintage moods and cinematic aesthetics',
  recommendedForKo: '감성적이고 빈티지한 무드를 사랑하는 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#C9A962',
      secondary: '#8B7355',
      background: '#1A1A1A',
      surface: '#2D2D2D',
      text: '#F5F5DC',
      textMuted: '#A0A0A0',
      accent: '#E6C068',
      overlay: 'rgba(0,0,0,0.6)',
    },
    mood: ['감성적인', '빈티지', '영화같은'],
  },

  // 인트로 설정
  intro: {
    type: 'cinematic',
    duration: 5000,
    skipEnabled: true,
    skipDelay: 3000,
    bgm: {
      trackId: 'romantic-piano',
      volume: 0.3,
      fadeIn: 2000,
      syncWithScroll: true,
    },
    settings: {
      filmGrain: true,
      aspectRatio: '21:9',
      subtitleStyle: 'korean',
    },
  },

  // 인터랙션 방식
  interaction: 'scroll',

  // 기본 색상
  defaultColors: {
    primary: '#C9A962',
    secondary: '#8B7355',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#F5F5DC',
    textMuted: '#A0A0A0',
    accent: '#E6C068',
    overlay: 'rgba(0,0,0,0.6)',
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
        backgroundEffect: 'grain',
      },
      content: {
        titleSize: 'large',
        themeSpecific: {
          letterbox: true,
          showSubtitle: true,
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
        type: 'typewriter',
        trigger: 'on-scroll',
        duration: 1500,
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
      layout: 'fullscreen',
      animation: {
        type: 'film-grain',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'none',
      },
      content: {
        themeSpecific: {
          subtitleCaptions: true,
        },
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
      layout: 'fullscreen',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
        duration: 2000,
      },
      style: {
        padding: 'xlarge',
      },
      content: {
        themeSpecific: {
          creditRoll: true,
        },
      },
    },
  ],

  // 효과 설정
  effects: {
    background: {
      type: 'solid',
      value: '#1A1A1A',
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
