/**
 * Boarding Pass Template Preset
 * 보딩패스 스타일 - 레터프레스 엠보싱, 티켓 모양, 여행 테마
 */

import type { PredefinedTemplatePreset } from './types'

export const boardingPassPreset: PredefinedTemplatePreset = {
  id: 'boarding-pass',
  version: '1.0.0',
  source: 'static',

  // 메타 정보
  name: 'Boarding Pass',
  nameKo: '보딩패스',
  category: 'classic',
  description: 'Letterpress embossed boarding pass style with ticket shape, barcode, and travel theme',
  descriptionKo: '레터프레스로 꾹 눌러 찍은 듯한 엠보싱 효과, 비행기 티켓 모양의 로맨틱한 여행 테마',
  matchKeywords: ['보딩패스', '비행기', '티켓', '여행', '레터프레스', '엠보싱', '항공권', '탑승권', '패스포트', '웨딩 티켓'],
  recommendedFor: 'Couples who love traveling or met during a trip, want a unique ticket-style invitation',
  recommendedForKo: '여행을 좋아하거나 여행 중 만난 커플, 특별한 티켓형 청첩장을 원하는 분',

  // 프리뷰 정보
  preview: {
    colors: {
      primary: '#C4A4A4',      // 로즈 핑크 (레터프레스 잉크)
      secondary: '#F5F0EB',    // 크림 페이퍼
      background: '#FAF8F5',   // 오프화이트 종이
      surface: '#FFFFFF',      // 티켓 표면
      text: '#8B7676',         // 따뜻한 그레이 (엠보싱 텍스트)
      textMuted: '#B8A8A8',    // 연한 로즈 그레이
      accent: '#D4B5B5',       // 밝은 로즈
    },
    mood: ['클래식', '여행', '로맨틱'],
  },

  // 인트로 설정
  intro: {
    type: 'boarding-pass',
    duration: 3000,
    skipEnabled: true,
    skipDelay: 1500,
    settings: {
      ticketStyle: 'first-class',
      embossEffect: 'letterpress',
      barcodeEnabled: true,
      notchStyle: 'rounded',     // 티켓 노치 모양
      stampEffect: true,         // 스탬프 효과
    },
  },

  // 인터랙션 방식
  interaction: 'scroll',

  // 기본 색상
  defaultColors: {
    primary: '#C4A4A4',
    secondary: '#F5F0EB',
    background: '#FAF8F5',
    surface: '#FFFFFF',
    text: '#8B7676',
    textMuted: '#B8A8A8',
    accent: '#D4B5B5',
  },

  // 기본 폰트 (레터프레스 스타일)
  defaultFonts: {
    title: {
      family: 'Cormorant Garamond, serif',  // 클래식한 세리프
      weight: 500,
      letterSpacing: '0.15em',
    },
    body: {
      family: 'Pretendard, sans-serif',
      weight: 300,
      letterSpacing: '0.02em',
    },
    accent: {
      family: 'Playfair Display, serif',    // 장식용
      weight: 400,
      style: 'italic',
    },
  },

  // 섹션 정의
  sections: [
    {
      id: 'hero',
      type: 'hero',
      enabled: true,
      order: 0,
      layout: 'ticket',
      animation: {
        type: 'stamp',
        trigger: 'on-enter',
        duration: 800,
      },
      style: {
        padding: 'large',
        backgroundEffect: 'paper-texture',
      },
      content: {
        titleSize: 'hero',
        themeSpecific: {
          ticketLayout: true,
          barcodePosition: 'left',
          notchEnabled: true,
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
        type: 'fade',
        trigger: 'on-scroll',
        stagger: 100,
      },
      style: {
        padding: 'xlarge',
      },
      content: {
        themeSpecific: {
          embossedText: true,
        },
      },
    },
    {
      id: 'calendar',
      type: 'calendar',
      enabled: true,
      order: 2,
      layout: 'ticket-stub',
      animation: {
        type: 'slide-up',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          flightInfo: true,        // 항공편 스타일 날짜
          departureArrival: true,  // 출발/도착 형식
        },
      },
    },
    {
      id: 'gallery',
      type: 'gallery',
      enabled: true,
      order: 3,
      layout: 'polaroid',           // 폴라로이드 스타일
      animation: {
        type: 'scale',
        trigger: 'on-scroll',
        stagger: 150,
      },
      style: {
        padding: 'medium',
      },
      content: {
        themeSpecific: {
          stampOverlay: true,      // 여행 스탬프 오버레이
        },
      },
    },
    {
      id: 'location',
      type: 'location',
      enabled: true,
      order: 4,
      layout: 'destination',        // 목적지 스타일
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          airportCode: true,       // 공항 코드 스타일
          destinationCard: true,
        },
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
      layout: 'postcard',           // 엽서 스타일 방명록
      animation: {
        type: 'fade',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'large',
      },
      content: {
        themeSpecific: {
          postcardStyle: true,
        },
      },
    },
    {
      id: 'closing',
      type: 'closing',
      enabled: true,
      order: 7,
      layout: 'boarding-gate',      // 탑승구 스타일
      animation: {
        type: 'stamp',
        trigger: 'on-scroll',
      },
      style: {
        padding: 'xlarge',
      },
      content: {
        themeSpecific: {
          gateNumber: true,
          finalCall: true,
        },
      },
    },
  ],

  // 효과 설정
  effects: {
    background: {
      type: 'pattern',
      value: 'paper-texture',
      animation: 'none',
    },
    scrollBehavior: {
      smooth: true,
      snapToSection: false,
    },
    transition: {
      type: 'fade',
      duration: 400,
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
