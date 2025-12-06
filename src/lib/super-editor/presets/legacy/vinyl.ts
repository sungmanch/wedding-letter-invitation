/**
 * Vinyl Template Preset
 * LP 레코드 스타일 - 바이닐 회전, 트랙리스트 네비게이션, 레트로 오디오
 */

import type { LegacyTemplatePreset } from './types'

export const vinylPreset: LegacyTemplatePreset = {
  id: 'vinyl',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Vinyl Record',
  nameKo: '바이닐 레코드',
  category: 'retro',
  description: 'LP player aesthetic with spinning vinyl, track list navigation, and retro audio interactions',
  descriptionKo: 'LP판이 돌아가는 인터랙티브 인트로, 앨범 트랙리스트처럼 구성된 스토리',
  matchKeywords: ['LP', '바이닐', '레코드', '음악', '레트로', 'Y2K', 'CD', '카세트', '힙', '앨범'],
  recommendedFor: 'Couples with strong music taste who prefer hip, retro aesthetics',
  recommendedForKo: '음악 취향이 확고하거나 힙(Hip)한 감성을 선호하는 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#1A1A1A',
      secondary: '#F5E6D3',
      background: '#2D2D2D',
      surface: '#3D3D3D',
      text: '#F5E6D3',
      textMuted: '#A0A0A0',
      accent: '#E85D04',
    },
    mood: ['힙한', '레트로', '음악적인'],
  },

  // 인트로 설정
  intro: {
    type: 'vinyl',
    duration: 4000,
    skipEnabled: true,
    skipDelay: 2000,
    bgm: {
      trackId: 'lo-fi-love',
      volume: 0.4,
      fadeIn: 1000,
      loop: true,
    },
    settings: {
      vinylColor: '#1A1A1A',
      albumArtStyle: 'photo',
      era: '80s',
    },
  },

  // 인터랙션 방식
  interaction: 'track-list',

  // 기본 색상
  defaultColors: {
    primary: '#1A1A1A',
    secondary: '#F5E6D3',
    background: '#2D2D2D',
    surface: '#3D3D3D',
    text: '#F5E6D3',
    textMuted: '#A0A0A0',
    accent: '#E85D04',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Space Grotesk, sans-serif',
      weight: 700,
    },
    body: {
      family: 'IBM Plex Mono, monospace',
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
        type: 'rotate',
        trigger: 'on-enter',
        duration: 3000,
      },
      style: {
        padding: 'large',
      },
      content: {
        titleSize: 'large',
        themeSpecific: {
          vinylSpinner: true,
          albumCover: true,
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
        type: 'slide-up',
        trigger: 'on-scroll',
        stagger: 100,
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          trackListFormat: true,
          tracks: ['만남', '연애', '프러포즈', '결혼'],
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
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          fadeOutVinyl: true,
        },
      },
    },
  ],

  // 효과 설정
  effects: {
    background: {
      type: 'pattern',
      value: 'vinyl-texture',
    },
    soundEffects: {
      enabled: true,
      onClick: 'vinyl-scratch',
    },
    scrollBehavior: {
      smooth: true,
      indicator: true,
      indicatorStyle: 'progress',
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
