/**
 * Super Editor v2 - Theme Presets
 *
 * 10개 테마 프리셋 정의 (1컬러 3개 + 기존 Light 7개)
 * Level 1 스타일 시스템용
 *
 * 1컬러 시스템 (디자이너 확정):
 * - Primary: 제목, 아이콘, 강조 문구, 활성 탭/버튼, 탭 밑줄 (fg-emphasis, accent-default)
 * - Secondary: 카드 배경, 비활성 탭 배경 (bg-card)
 * - Tertiary: hover/보조 상태 (accent-hover, accent-secondary)
 * - 배경: #FFFFFF 통일
 */

import type {
  ThemePresetId,
  SemanticTokens,
  GradientValue,
  QuickStyleConfig,
} from '../schema/types'
import { SIMPLE_COLOR_PRESETS } from '../utils/color-generator'

// ============================================
// Theme Preset 정의
// ============================================

export interface ThemePreset {
  id: ThemePresetId
  name: string
  nameKo: string
  description: string
  category: 'simple' | 'basic' | 'classic' | 'modern' | 'romantic' | 'special'
  tokens: SemanticTokens
  quick?: Partial<QuickStyleConfig>
  // 추천 타이포그래피 프리셋
  recommendedTypography?: string
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  // ─── 1컬러 시스템 (Simple) ───
  'simple-pink': {
    id: 'simple-pink',
    name: 'Simple Pink',
    nameKo: '심플 핑크',
    description: '부드러운 핑크 컬러 테마',
    category: 'simple',
    tokens: {
      'bg-page': '#FFFFFF',
      'bg-section': '#FFFFFF',
      'bg-section-alt': '#FFFFFF',
      'bg-card': SIMPLE_COLOR_PRESETS.pink.secondary,         // S: 카드/비활성탭 배경
      'bg-overlay': 'rgba(0, 0, 0, 0.4)',
      'fg-default': '#1A1A1A',
      'fg-muted': '#6B7280',
      'fg-emphasis': SIMPLE_COLOR_PRESETS.pink.primary,       // P: 제목
      'fg-inverse': '#FFFFFF',
      'fg-on-accent': '#FFFFFF',
      'accent-default': SIMPLE_COLOR_PRESETS.pink.primary,    // P: 아이콘, 강조, 활성탭/버튼
      'accent-hover': SIMPLE_COLOR_PRESETS.pink.tertiary,     // T: hover 상태
      'accent-active': SIMPLE_COLOR_PRESETS.pink.primary,
      'accent-secondary': SIMPLE_COLOR_PRESETS.pink.tertiary, // T: 보조
      'border-default': '#E5E7EB',
      'border-emphasis': SIMPLE_COLOR_PRESETS.pink.primary,   // P: 강조 테두리
      'border-muted': '#F3F4F6',
    },
    quick: {
      mood: 'warm',
      contrast: 'medium',
      saturation: 'normal',
    },
    recommendedTypography: 'romantic-soft',
  },

  'simple-coral': {
    id: 'simple-coral',
    name: 'Simple Coral',
    nameKo: '심플 다홍',
    description: '따뜻한 다홍 컬러 테마',
    category: 'simple',
    tokens: {
      'bg-page': '#FFFFFF',
      'bg-section': '#FFFFFF',
      'bg-section-alt': '#FFFFFF',
      'bg-card': SIMPLE_COLOR_PRESETS.coral.secondary,         // S: 카드/비활성탭 배경
      'bg-overlay': 'rgba(0, 0, 0, 0.4)',
      'fg-default': '#1A1A1A',
      'fg-muted': '#6B7280',
      'fg-emphasis': SIMPLE_COLOR_PRESETS.coral.primary,       // P: 제목
      'fg-inverse': '#FFFFFF',
      'fg-on-accent': '#FFFFFF',
      'accent-default': SIMPLE_COLOR_PRESETS.coral.primary,    // P: 아이콘, 강조, 활성탭/버튼
      'accent-hover': SIMPLE_COLOR_PRESETS.coral.tertiary,     // T: hover 상태
      'accent-active': SIMPLE_COLOR_PRESETS.coral.primary,
      'accent-secondary': SIMPLE_COLOR_PRESETS.coral.tertiary, // T: 보조
      'border-default': '#E5E7EB',
      'border-emphasis': SIMPLE_COLOR_PRESETS.coral.primary,   // P: 강조 테두리
      'border-muted': '#F3F4F6',
    },
    quick: {
      mood: 'warm',
      contrast: 'medium',
      saturation: 'normal',
    },
    recommendedTypography: 'romantic-soft',
  },

  'simple-blue': {
    id: 'simple-blue',
    name: 'Simple Blue',
    nameKo: '심플 블루',
    description: '시원한 블루 컬러 테마',
    category: 'simple',
    tokens: {
      'bg-page': '#FFFFFF',
      'bg-section': '#FFFFFF',
      'bg-section-alt': '#FFFFFF',
      'bg-card': SIMPLE_COLOR_PRESETS.blue.secondary,         // S: 카드/비활성탭 배경
      'bg-overlay': 'rgba(0, 0, 0, 0.4)',
      'fg-default': '#1A1A1A',
      'fg-muted': '#6B7280',
      'fg-emphasis': SIMPLE_COLOR_PRESETS.blue.primary,       // P: 제목
      'fg-inverse': '#FFFFFF',
      'fg-on-accent': '#FFFFFF',
      'accent-default': SIMPLE_COLOR_PRESETS.blue.primary,    // P: 아이콘, 강조, 활성탭/버튼
      'accent-hover': SIMPLE_COLOR_PRESETS.blue.tertiary,     // T: hover 상태
      'accent-active': SIMPLE_COLOR_PRESETS.blue.primary,
      'accent-secondary': SIMPLE_COLOR_PRESETS.blue.tertiary, // T: 보조
      'border-default': '#E5E7EB',
      'border-emphasis': SIMPLE_COLOR_PRESETS.blue.primary,   // P: 강조 테두리
      'border-muted': '#F3F4F6',
    },
    quick: {
      mood: 'cool',
      contrast: 'medium',
      saturation: 'normal',
    },
    recommendedTypography: 'modern-clean',
  },

  // ─── 기본 (Basic) ───
  'minimal-light': {
    id: 'minimal-light',
    name: 'Minimal Light',
    nameKo: '미니멀 라이트',
    description: '깔끔하고 밝은 미니멀 디자인',
    category: 'basic',
    tokens: {
      'bg-page': '#FFFFFF',
      'bg-section': '#FAFAFA',
      'bg-section-alt': '#F5F5F5',
      'bg-card': '#FFFFFF',
      'bg-overlay': 'rgba(0, 0, 0, 0.4)',
      'fg-default': '#1A1A1A',
      'fg-muted': '#6B7280',
      'fg-emphasis': '#000000',
      'fg-inverse': '#FFFFFF',
      'fg-on-accent': '#FFFFFF',
      'accent-default': '#1A1A1A',
      'accent-hover': '#333333',
      'accent-active': '#000000',
      'accent-secondary': '#6B7280',
      'border-default': '#E5E7EB',
      'border-emphasis': '#D1D5DB',
      'border-muted': '#F3F4F6',
    },
    quick: {
      mood: 'neutral',
      contrast: 'medium',
      saturation: 'muted',
    },
    recommendedTypography: 'modern-minimal',
  },

  // ─── 클래식 (Classic) ───
  'classic-ivory': {
    id: 'classic-ivory',
    name: 'Classic Ivory',
    nameKo: '클래식 아이보리',
    description: '따뜻하고 우아한 아이보리 톤',
    category: 'classic',
    tokens: {
      'bg-page': '#FAF8F5',
      'bg-section': '#F5F2ED',
      'bg-section-alt': '#EFEBE4',
      'bg-card': '#FFFFFF',
      'bg-overlay': 'rgba(45, 35, 25, 0.4)',
      'fg-default': '#3D3328',
      'fg-muted': '#7A6F5D',
      'fg-emphasis': '#2D2319',
      'fg-inverse': '#FAF8F5',
      'fg-on-accent': '#FFFFFF',
      'accent-default': '#8B7355',
      'accent-hover': '#7A6347',
      'accent-active': '#6A5339',
      'accent-secondary': '#A89880',
      'border-default': '#E5DED3',
      'border-emphasis': '#D4C9B8',
      'border-muted': '#F0EBE3',
    },
    quick: {
      mood: 'warm',
      contrast: 'low',
      saturation: 'muted',
    },
    recommendedTypography: 'classic-elegant',
  },

  'classic-gold': {
    id: 'classic-gold',
    name: 'Classic Gold',
    nameKo: '클래식 골드',
    description: '고급스러운 골드 포인트',
    category: 'classic',
    tokens: {
      'bg-page': '#FFFDF8',
      'bg-section': '#FAF7F0',
      'bg-section-alt': '#F5F0E5',
      'bg-card': '#FFFFFF',
      'bg-overlay': 'rgba(45, 35, 25, 0.5)',
      'fg-default': '#2D2319',
      'fg-muted': '#6B5D4D',
      'fg-emphasis': '#1A1408',
      'fg-inverse': '#FFFDF8',
      'fg-on-accent': '#1A1408',
      'accent-default': '#C9A962',
      'accent-hover': '#B8983F',
      'accent-active': '#A68A2D',
      'accent-secondary': '#D4BE7A',
      'border-default': '#E8DFC8',
      'border-emphasis': '#D4C5A5',
      'border-muted': '#F2EDE0',
    },
    quick: {
      mood: 'warm',
      contrast: 'medium',
      saturation: 'normal',
    },
    recommendedTypography: 'classic-traditional',
  },

  // ─── 모던 (Modern) ───
  'modern-mono': {
    id: 'modern-mono',
    name: 'Modern Mono',
    nameKo: '모던 모노크롬',
    description: '세련된 흑백 디자인',
    category: 'modern',
    tokens: {
      'bg-page': '#FFFFFF',
      'bg-section': '#F8F8F8',
      'bg-section-alt': '#F0F0F0',
      'bg-card': '#FFFFFF',
      'bg-overlay': 'rgba(0, 0, 0, 0.5)',
      'fg-default': '#1A1A1A',
      'fg-muted': '#737373',
      'fg-emphasis': '#000000',
      'fg-inverse': '#FFFFFF',
      'fg-on-accent': '#FFFFFF',
      'accent-default': '#000000',
      'accent-hover': '#262626',
      'accent-active': '#404040',
      'accent-secondary': '#525252',
      'border-default': '#E5E5E5',
      'border-emphasis': '#D4D4D4',
      'border-muted': '#F5F5F5',
    },
    quick: {
      mood: 'neutral',
      contrast: 'high',
      saturation: 'muted',
    },
    recommendedTypography: 'modern-geometric',
  },

  // ─── 로맨틱 (Romantic) ───
  'romantic-blush': {
    id: 'romantic-blush',
    name: 'Romantic Blush',
    nameKo: '로맨틱 블러쉬',
    description: '부드러운 블러쉬 핑크',
    category: 'romantic',
    tokens: {
      'bg-page': '#FFF9F9',
      'bg-section': '#FFF5F5',
      'bg-section-alt': '#FFEFEF',
      'bg-card': '#FFFFFF',
      'bg-overlay': 'rgba(80, 40, 50, 0.4)',
      'fg-default': '#4A3535',
      'fg-muted': '#8C7070',
      'fg-emphasis': '#3A2525',
      'fg-inverse': '#FFF9F9',
      'fg-on-accent': '#FFFFFF',
      'accent-default': '#E8A0A0',
      'accent-hover': '#E08888',
      'accent-active': '#D87070',
      'accent-secondary': '#F0B8B8',
      'border-default': '#F5E0E0',
      'border-emphasis': '#EBD0D0',
      'border-muted': '#FAF0F0',
    },
    quick: {
      mood: 'warm',
      contrast: 'low',
      saturation: 'muted',
    },
    recommendedTypography: 'romantic-soft',
  },

  'romantic-garden': {
    id: 'romantic-garden',
    name: 'Romantic Garden',
    nameKo: '로맨틱 가든',
    description: '자연스러운 가든 그린',
    category: 'romantic',
    tokens: {
      'bg-page': '#F8FAF8',
      'bg-section': '#F2F7F2',
      'bg-section-alt': '#EBF2EB',
      'bg-card': '#FFFFFF',
      'bg-overlay': 'rgba(35, 55, 40, 0.4)',
      'fg-default': '#2D3D32',
      'fg-muted': '#5A7560',
      'fg-emphasis': '#1D2D22',
      'fg-inverse': '#F8FAF8',
      'fg-on-accent': '#FFFFFF',
      'accent-default': '#6B8E6B',
      'accent-hover': '#5A7D5A',
      'accent-active': '#4A6C4A',
      'accent-secondary': '#8BA88B',
      'border-default': '#D8E5D8',
      'border-emphasis': '#C5D8C5',
      'border-muted': '#E8F0E8',
    },
    quick: {
      mood: 'cool',
      contrast: 'low',
      saturation: 'muted',
    },
    recommendedTypography: 'natural-warm',
  },

  // ─── 특수 (Special) ───
  'photo-adaptive': {
    id: 'photo-adaptive',
    name: 'Photo Adaptive',
    nameKo: '사진 기반 자동',
    description: '메인 사진에서 색상 자동 추출',
    category: 'special',
    tokens: {
      // 기본값 (사진 추출 전)
      'bg-page': '#FFFFFF',
      'bg-section': '#F8F8F8',
      'bg-section-alt': '#F0F0F0',
      'bg-card': '#FFFFFF',
      'bg-overlay': 'rgba(0, 0, 0, 0.4)',
      'fg-default': '#1A1A1A',
      'fg-muted': '#6B7280',
      'fg-emphasis': '#000000',
      'fg-inverse': '#FFFFFF',
      'fg-on-accent': '#FFFFFF',
      'accent-default': '#6B7280',
      'accent-hover': '#5A6370',
      'accent-active': '#4B5563',
      'accent-secondary': '#9CA3AF',
      'border-default': '#E5E7EB',
      'border-emphasis': '#D1D5DB',
      'border-muted': '#F3F4F6',
    },
    quick: {
      photoExtraction: {
        enabled: true,
        source: 'photos.main',
        mapping: {
          dominant: 'most-common',
          accent: 'most-saturated',
        },
      },
    },
    recommendedTypography: 'modern-minimal',
  },
}

// ============================================
// Helper Functions
// ============================================

/**
 * 프리셋 ID로 테마 가져오기
 */
export function getThemePreset(presetId: ThemePresetId): ThemePreset {
  return THEME_PRESETS[presetId]
}

/**
 * 카테고리별 프리셋 목록
 */
export function getPresetsByCategory(category: ThemePreset['category']): ThemePreset[] {
  return Object.values(THEME_PRESETS).filter(preset => preset.category === category)
}

/**
 * 모든 프리셋 목록 (카테고리 순서대로)
 */
export function getAllThemePresets(): ThemePreset[] {
  const categoryOrder: ThemePreset['category'][] = [
    'simple',   // 1컬러 시스템 (최상단)
    'basic',
    'classic',
    'modern',
    'romantic',
    'special',
  ]

  return categoryOrder.flatMap(category => getPresetsByCategory(category))
}

/**
 * 프리셋에서 SemanticTokens 추출
 */
export function getTokensFromPreset(presetId: ThemePresetId): SemanticTokens {
  return THEME_PRESETS[presetId].tokens
}

/**
 * 배경색 밝기 판단
 */
export function isDarkBackground(bgColor: string): boolean {
  // hex to rgb
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}
