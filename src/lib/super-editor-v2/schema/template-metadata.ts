/**
 * Template Metadata Schema
 *
 * 사전 정의된 intro 템플릿(unique1~6.png)의 메타데이터 타입 정의
 * AI 분석 결과와 디자인 패턴을 저장하여 사용자 레퍼런스와 매칭에 사용
 */

/**
 * 템플릿 메타데이터
 */
export interface TemplateMetadata {
  /** 템플릿 ID ('unique1' ~ 'unique6') */
  id: string

  /** 템플릿 이름 (한글, 예: '클래식 엘레강스') */
  name: string

  /** 이미지 경로 (예: '/examples/unique1.png') */
  imagePath: string

  // ==========================================
  // AI 분석 결과 (AnalysisResult와 동일 구조)
  // ==========================================

  /** 분위기 키워드 (예: ['elegant', 'classic', 'romantic']) */
  mood: string[]

  /** 주요 색상 HEX 코드 (예: ['#FFFFFF', '#1A1A1A', '#C9A962']) */
  colors: string[]

  /** 타이포그래피 스타일 */
  typography: string

  /** 레이아웃 스타일 */
  layout: string

  /** 스타일 키워드 (예: ['outdoor', 'nature', 'classic']) */
  keywords: string[]

  /** 한 줄 요약 */
  summary: string

  // ==========================================
  // 디자인 패턴 메타데이터
  // ==========================================

  designPattern: {
    /** 인트로 타입 */
    introType: 'elegant' | 'minimal' | 'romantic' | 'cinematic' | 'polaroid'

    /** 이미지 레이아웃 */
    imageLayout: 'fullscreen-bg' | 'centered' | 'card' | 'split-left'

    /** 텍스트 레이아웃 */
    textLayout: 'bottom-overlay' | 'center' | 'below-image' | 'side-right'

    /** 컬러 테마 */
    colorTheme: 'light' | 'dark' | 'overlay' | 'warm'

    /** 스타일 프리셋 매핑 (optional) */
    stylePreset?:
      | 'minimal-light'
      | 'minimal-dark'
      | 'classic-serif'
      | 'modern-sans'
      | 'romantic-script'
      | 'nature-organic'

    /**
     * 컬러 팔레트 (Primary/Secondary/Tertiary 구조)
     * - Primary: 메인 텍스트, 강조 요소 (가장 진한 색상)
     * - Secondary: 배경, 카드 surface (가장 밝은 색상)
     * - Tertiary: 하이라이트, 버튼, 링크 (중간 색상)
     */
    colorPalette: {
      /** Primary 컬러 3개 (메인 텍스트, 강조 요소) */
      primary: [string, string, string]

      /** Secondary 컬러 3개 (배경, 카드 surface) */
      secondary: [string, string, string]

      /** Tertiary 컬러 3개 (하이라이트, 버튼, 링크) */
      tertiary: [string, string, string]
    }

    /** 커스텀 스타일 (optional) */
    customStyles?: {
      backgroundColor?: string
      primaryColor?: string
      accentColor?: string
      headingFont?: string
      bodyFont?: string
    }
  }

  /** 버전 */
  version: number

  /** 생성 시간 */
  createdAt: string

  /** 수정 시간 */
  updatedAt: string
}

/**
 * 템플릿 ID 타입
 */
export type TemplateId = 'unique1' | 'unique2' | 'unique3' | 'unique4' | 'unique5' | 'unique6'

/**
 * 템플릿 카탈로그 타입
 */
export type TemplateCatalog = TemplateMetadata[]
