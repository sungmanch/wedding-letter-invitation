/**
 * Exhibition Template Preset
 * 버추얼 갤러리 스타일 - 가로 스크롤, 액자 구성, 도슨트 오디오
 */

import type { LegacyTemplatePreset } from './types'

export const exhibitionPreset: LegacyTemplatePreset = {
  id: 'exhibition',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Virtual Exhibition',
  nameKo: '버추얼 갤러리',
  category: 'artistic',
  description: 'Online art museum experience with horizontal scroll, framed photos, and docent audio feature',
  descriptionKo: '성수동 팝업 갤러리처럼 온라인 미술관에 입장한 듯한 경험, 가로 스크롤과 액자 구성',
  matchKeywords: ['갤러리', '전시회', '미술관', '성수동', '팝업', '예술', '액자', '도슨트', '아트'],
  recommendedFor: 'Couples who value artistic sensibility and prefer static elegance',
  recommendedForKo: '예술적 감각을 중시하고, 정적인 우아함을 원하는 커플',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#2C2C2C',
      secondary: '#707070',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textMuted: '#888888',
      accent: '#000000',
    },
    mood: ['예술적인', '정적인', '우아한'],
  },

  // 인트로 설정
  intro: {
    type: 'exhibition',
    duration: 3000,
    skipEnabled: true,
    skipDelay: 1500,
    settings: {
      frameStyle: 'minimal',
      navigationStyle: 'horizontal',
    },
  },

  // 인터랙션 방식
  interaction: 'horizontal',

  // 기본 색상
  defaultColors: {
    primary: '#2C2C2C',
    secondary: '#707070',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#888888',
    accent: '#000000',
  },

  // 기본 폰트
  defaultFonts: {
    title: {
      family: 'Cormorant Garamond, serif',
      weight: 300,
      style: 'italic',
    },
    body: {
      family: 'Pretendard, sans-serif',
      weight: 300,
    },
    accent: {
      family: 'Pretendard, sans-serif',
      weight: 500,
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
          exhibitionTitle: true,
        },
      },
    },
    {
      id: 'gallery',
      type: 'gallery',
      enabled: true,
      order: 1,
      layout: 'frame',
      animation: {
        type: 'slide-left',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          frameStyle: 'minimal',
          docentEnabled: true,
        },
      },
    },
    {
      id: 'greeting',
      type: 'greeting',
      enabled: true,
      order: 2,
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
      id: 'rsvp',
      type: 'rsvp',
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
      content: {
        themeSpecific: {
          ticketStyle: true,
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
