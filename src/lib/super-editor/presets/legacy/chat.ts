/**
 * Chat Template Preset
 * 인터랙티브 채팅 스타일 - 메신저 UI, 챗봇 인터랙션, 위치 공유
 */

import type { LegacyTemplatePreset } from './types'

export const chatPreset: LegacyTemplatePreset = {
  id: 'chat',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Interactive Chat',
  nameKo: '인터랙티브 채팅',
  category: 'playful',
  description: 'Messenger-style invitation with chat bot interactions, dynamic photo loading, and location sharing UI',
  descriptionKo: '커플과 1:1 채팅하는 듯한 화면, 대화형 인터랙션과 친근한 분위기',
  matchKeywords: ['채팅', '메신저', '카톡', '대화', '유쾌한', '친근한', '재미있는', '봇', '인터랙티브'],
  recommendedFor: 'Witty couples who prefer intimacy over formality',
  recommendedForKo: '위트 있고 유쾌하며, 격식보다는 친밀함을 전하고 싶은 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#FEE500',
      secondary: '#3C1E1E',
      background: '#B2C7D9',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textMuted: '#6B6B6B',
      accent: '#FEE500',
    },
    mood: ['친근한', '유쾌한', '인터랙티브'],
  },

  // 인트로 설정
  intro: {
    type: 'chat',
    duration: 3000,
    skipEnabled: true,
    skipDelay: 1500,
    settings: {
      platform: 'kakao',
      botPersonality: 'friendly',
    },
  },

  // 인터랙션 방식
  interaction: 'chat-flow',

  // 기본 색상
  defaultColors: {
    primary: '#FEE500',
    secondary: '#3C1E1E',
    background: '#B2C7D9',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#6B6B6B',
    accent: '#FEE500',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Pretendard, sans-serif',
      weight: 700,
    },
    body: {
      family: 'Pretendard, sans-serif',
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
      layout: 'chat-bubble',
      animation: {
        type: 'slide-up',
        trigger: 'on-enter',
        stagger: 300,
      },
      style: {
        padding: 'medium',
      },
      content: {
        themeSpecific: {
          chatHeader: true,
          profileImages: true,
        },
      },
    },
    {
      id: 'greeting',
      type: 'greeting',
      enabled: true,
      order: 1,
      layout: 'chat-bubble',
      animation: {
        type: 'slide-up',
        trigger: 'on-scroll',
        stagger: 200,
      },
      style: {
        padding: 'medium',
      },
    },
    {
      id: 'gallery',
      type: 'gallery',
      enabled: true,
      order: 2,
      layout: 'chat-bubble',
      animation: {
        type: 'slide-up',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'medium',
      },
      content: {
        themeSpecific: {
          photoAsMessage: true,
        },
      },
    },
    {
      id: 'calendar',
      type: 'calendar',
      enabled: true,
      order: 3,
      layout: 'chat-bubble',
      animation: {
        type: 'slide-up',
        trigger: 'on-click',
      },
      style: {
        padding: 'medium',
      },
      content: {
        themeSpecific: {
          questionButton: '결혼식 날짜가 언제야?',
        },
      },
    },
    {
      id: 'location',
      type: 'location',
      enabled: true,
      order: 4,
      layout: 'chat-bubble',
      animation: {
        type: 'slide-up',
        trigger: 'on-click',
      },
      style: {
        padding: 'medium',
      },
      content: {
        themeSpecific: {
          locationShareUI: true,
          questionButton: '결혼식장 어디야?',
        },
      },
    },
    {
      id: 'account',
      type: 'account',
      enabled: true,
      order: 5,
      layout: 'chat-bubble',
      animation: {
        type: 'slide-up',
        trigger: 'on-click',
      },
      style: {
        padding: 'medium',
      },
      content: {
        themeSpecific: {
          questionButton: '축의금은 어디로 보내?',
        },
      },
    },
    {
      id: 'rsvp',
      type: 'rsvp',
      enabled: true,
      order: 6,
      layout: 'chat-bubble',
      animation: {
        type: 'slide-up',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'medium',
      },
      content: {
        themeSpecific: {
          quickReplyButtons: true,
        },
      },
    },
    {
      id: 'message',
      type: 'message',
      enabled: true,
      order: 7,
      layout: 'chat-bubble',
      animation: {
        type: 'slide-up',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'medium',
      },
    },
    {
      id: 'closing',
      type: 'closing',
      enabled: true,
      order: 8,
      layout: 'chat-bubble',
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
    },
  ],

  // 효과 설정
  effects: {
    soundEffects: {
      enabled: true,
      onClick: 'message-send',
    },
    scrollBehavior: {
      smooth: true,
      indicator: false,
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
