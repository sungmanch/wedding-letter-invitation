/**
 * Super Editor - Semantic Design Tokens
 * AI 병렬 생성 시 일관성을 위한 시맨틱 토큰 시스템
 */

// ============================================
// Typography Token
// ============================================

export interface TypoToken {
  fontFamily: string
  fontSize: string
  fontWeight: number
  lineHeight: number
  letterSpacing?: string
}

// ============================================
// Semantic Design Tokens
// ============================================

export interface SemanticDesignTokens {
  // 시맨틱 컬러 (구체적 값만, ColorScale 참조 금지)
  colors: {
    brand: string // 메인 브랜드 색상
    accent: string // 강조 색상
    background: string // 배경
    surface: string // 카드/컨테이너 배경
    text: {
      primary: string // 본문
      secondary: string // 부제목
      muted: string // 힌트/비활성
      onBrand: string // 브랜드 색상 위 텍스트
    }
    border: string // 기본 테두리
    divider: string // 구분선
  }

  // 타이포그래피 프리셋
  typography: {
    displayLg: TypoToken // 인트로 메인 제목 (28-36px)
    displayMd: TypoToken // 섹션 대제목 (24-28px)
    sectionTitle: TypoToken // 섹션 영문 제목 (GALLERY, LOCATION 등)
    headingLg: TypoToken // H1 (20-24px)
    headingMd: TypoToken // H2 (18-20px)
    headingSm: TypoToken // H3 (16-18px)
    bodyLg: TypoToken // 본문 큰 글씨 (16px)
    bodyMd: TypoToken // 기본 본문 (14-15px)
    bodySm: TypoToken // 작은 본문 (13px)
    caption: TypoToken // 캡션 (12px)
  }

  // 간격 스케일
  spacing: {
    xs: string // 4px
    sm: string // 8px
    md: string // 16px
    lg: string // 24px
    xl: string // 32px
    xxl: string // 48px
    section: string // 섹션 패딩 (24-32px)
    component: string // 컴포넌트 간격 (16-20px)
  }

  // 테두리
  borders: {
    radiusSm: string // 4px
    radiusMd: string // 8px
    radiusLg: string // 16px
    radiusFull: string // 9999px
  }

  // 그림자
  shadows: {
    sm: string
    md: string
    lg: string
  }

  // 애니메이션
  animation: {
    durationFast: number // 150ms
    durationNormal: number // 300ms
    durationSlow: number // 500ms
    easing: string // cubic-bezier(0.4, 0, 0.2, 1)
    staggerDelay: number // 50ms
  }
}

// ============================================
// Token Reference Type (스켈레톤에서 사용)
// ============================================

// $token.colors.brand 형식의 참조
export type TokenRef = `$token.${string}`

// 토큰 참조 또는 직접 값
export type TokenOrValue<T> = TokenRef | T

// 스타일 객체에서 토큰 참조 허용
export type TokenStyleRef = {
  [K in keyof React.CSSProperties]?: TokenOrValue<React.CSSProperties[K]>
}

// ============================================
// Default Token Values
// ============================================

export const DEFAULT_TOKENS: SemanticDesignTokens = {
  colors: {
    brand: '#EC4899',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: {
      primary: '#1A1A1A',
      secondary: '#4A4A4A',
      muted: '#9CA3AF',
      onBrand: '#FFFFFF',
    },
    border: '#E5E7EB',
    divider: '#F3F4F6',
  },
  typography: {
    displayLg: {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    },
    displayMd: {
      fontFamily: "'Noto Serif KR', serif",
      fontSize: '26px',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
    },
    sectionTitle: {
      fontFamily: "'Cinzel', 'Noto Serif KR', serif",
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.25em',
    },
    headingLg: {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: '22px',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    headingMd: {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.45,
    },
    headingSm: {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    bodyLg: {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    bodyMd: {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.65,
    },
    bodySm: {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    caption: {
      fontFamily: "'Noto Sans KR', sans-serif",
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    section: '28px',
    component: '18px',
  },
  borders: {
    radiusSm: '4px',
    radiusMd: '8px',
    radiusLg: '16px',
    radiusFull: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  animation: {
    durationFast: 150,
    durationNormal: 300,
    durationSlow: 500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    staggerDelay: 50,
  },
}
