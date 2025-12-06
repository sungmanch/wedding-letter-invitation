/**
 * Pixel Template Preset
 * 8비트 픽셀 스타일 - 레트로 게임, 퀘스트 RSVP, 미니게임
 */

import type { LegacyTemplatePreset } from './types'

export const pixelPreset: LegacyTemplatePreset = {
  id: 'pixel',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: '8-Bit Pixel Love',
  nameKo: '픽셀 러브',
  category: 'playful',
  description: 'Retro game style with pixel art characters, mini-game elements, and quest-style RSVP',
  descriptionKo: '귀엽고 키치한 픽셀 아트, 게임 캐릭터가 되어 결혼식장으로 향하는 여정',
  matchKeywords: ['게임', '픽셀', '8비트', '레트로', '아케이드', '귀여운', '키치', '퀘스트', 'RPG'],
  recommendedFor: 'Game-loving couples who want something completely unique and cute',
  recommendedForKo: '게임을 좋아하거나, 남들과 완전히 다른 귀여움을 원하는 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#5B8A3D',
      secondary: '#E6B84F',
      background: '#2D1B2E',
      surface: '#442A45',
      text: '#FFFFFF',
      textMuted: '#B8A9B9',
      accent: '#E85D75',
    },
    mood: ['귀여운', '유쾌한', '게임같은'],
  },

  // 인트로 설정
  intro: {
    type: 'pixel',
    duration: 5000,
    skipEnabled: true,
    skipDelay: 2000,
    bgm: {
      trackId: '8bit-love',
      volume: 0.3,
      loop: true,
    },
    settings: {
      pixelSize: 4,
      characterStyle: 'rpg',
      gameTitle: 'WEDDING QUEST',
    },
  },

  // 인터랙션 방식
  interaction: 'game-progress',

  // 기본 색상
  defaultColors: {
    primary: '#5B8A3D',
    secondary: '#E6B84F',
    background: '#2D1B2E',
    surface: '#442A45',
    text: '#FFFFFF',
    textMuted: '#B8A9B9',
    accent: '#E85D75',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Press Start 2P, monospace',
      weight: 400,
    },
    body: {
      family: 'VT323, monospace',
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
        type: 'pixel-appear',
        trigger: 'on-enter',
        duration: 2000,
      },
      style: {
        padding: 'large',
      },
      content: {
        titleSize: 'large',
        themeSpecific: {
          gameTitleScreen: true,
          pressStartPrompt: true,
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
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          levelProgress: true,
          characterWalking: true,
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
        type: 'pixel-appear',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'medium',
      },
      content: {
        decorationType: 'pixel',
      },
    },
    {
      id: 'greeting',
      type: 'greeting',
      enabled: true,
      order: 3,
      layout: 'centered',
      animation: {
        type: 'typewriter',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          dialogBox: true,
        },
      },
    },
    {
      id: 'calendar',
      type: 'calendar',
      enabled: true,
      order: 4,
      layout: 'centered',
      animation: {
        type: 'bounce',
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
      layout: 'centered',
      animation: {
        type: 'slide-up',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          pixelMap: true,
        },
      },
    },
    {
      id: 'quest',
      type: 'quest',
      enabled: true,
      order: 6,
      layout: 'centered',
      animation: {
        type: 'bounce',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          questAccept: true,
          questText: '결혼식에 참석하시겠습니까?',
        },
      },
    },
    {
      id: 'account',
      type: 'account',
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
          treasureChest: true,
        },
      },
    },
    {
      id: 'message',
      type: 'message',
      enabled: true,
      order: 8,
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
      order: 9,
      layout: 'fullscreen',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'xlarge',
      },
      content: {
        themeSpecific: {
          endCredits: true,
          characterCelebration: true,
        },
      },
    },
  ],

  // 효과 설정
  effects: {
    background: {
      type: 'pattern',
      value: 'pixel-stars',
    },
    soundEffects: {
      enabled: true,
      onClick: '8bit-click',
      onScroll: '8bit-step',
    },
    scrollBehavior: {
      smooth: false,
      indicator: true,
      indicatorStyle: 'progress',
    },
  },

  // 커스터마이징
  customizable: {
    colors: true,
    fonts: false,
    sectionOrder: false,
    sectionToggle: true,
    introSettings: true,
    effects: true,
  },
}
