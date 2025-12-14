/**
 * Super Editor v2 - Theme Presets
 *
 * 13개 테마 프리셋 정의
 * Level 1 스타일 시스템용
 */

import type {
  ThemePresetId,
  SemanticTokens,
  GradientValue,
  QuickStyleConfig,
} from '../schema/types'

// ============================================
// Theme Preset 정의
// ============================================

export interface ThemePreset {
  id: ThemePresetId
  name: string
  nameKo: string
  description: string
  category: 'basic' | 'classic' | 'modern' | 'romantic' | 'cinematic' | 'special'
  tokens: SemanticTokens
  quick?: Partial<QuickStyleConfig>
  // 추천 타이포그래피 프리셋
  recommendedTypography?: string
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
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

  'minimal-dark': {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    nameKo: '미니멀 다크',
    description: '세련된 다크 모드 디자인',
    category: 'basic',
    tokens: {
      'bg-page': '#0A0A0A',
      'bg-section': '#141414',
      'bg-section-alt': '#1F1F1F',
      'bg-card': '#1A1A1A',
      'bg-overlay': 'rgba(0, 0, 0, 0.6)',
      'fg-default': '#F5F5F5',
      'fg-muted': '#A3A3A3',
      'fg-emphasis': '#FFFFFF',
      'fg-inverse': '#0A0A0A',
      'fg-on-accent': '#0A0A0A',
      'accent-default': '#FFFFFF',
      'accent-hover': '#E5E5E5',
      'accent-active': '#D4D4D4',
      'accent-secondary': '#737373',
      'border-default': '#262626',
      'border-emphasis': '#404040',
      'border-muted': '#1A1A1A',
    },
    quick: {
      mood: 'cool',
      contrast: 'high',
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

  'modern-contrast': {
    id: 'modern-contrast',
    name: 'Modern Contrast',
    nameKo: '모던 하이 콘트라스트',
    description: '강렬한 대비의 현대적 디자인',
    category: 'modern',
    tokens: {
      'bg-page': '#0F0F0F',
      'bg-section': '#1A1A1A',
      'bg-section-alt': '#262626',
      'bg-card': '#1F1F1F',
      'bg-overlay': 'rgba(0, 0, 0, 0.7)',
      'fg-default': '#FFFFFF',
      'fg-muted': '#A3A3A3',
      'fg-emphasis': '#FFFFFF',
      'fg-inverse': '#0F0F0F',
      'fg-on-accent': '#0F0F0F',
      'accent-default': '#FF3B30',
      'accent-hover': '#FF5349',
      'accent-active': '#E62E24',
      'accent-secondary': '#FF6B5B',
      'border-default': '#333333',
      'border-emphasis': '#4D4D4D',
      'border-muted': '#262626',
    },
    quick: {
      mood: 'cool',
      contrast: 'high',
      saturation: 'vivid',
    },
    recommendedTypography: 'modern-clean',
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

  // ─── 시네마틱 (Cinematic) ───
  'cinematic-dark': {
    id: 'cinematic-dark',
    name: 'Cinematic Dark',
    nameKo: '시네마틱 다크',
    description: '영화적 무드의 다크 테마',
    category: 'cinematic',
    tokens: {
      'bg-page': '#0D0D0D',
      'bg-section': '#151515',
      'bg-section-alt': '#1A1A1A',
      'bg-card': '#1F1F1F',
      'bg-overlay': 'rgba(0, 0, 0, 0.7)',
      'fg-default': '#E5E5E5',
      'fg-muted': '#8A8A8A',
      'fg-emphasis': '#FFFFFF',
      'fg-inverse': '#0D0D0D',
      'fg-on-accent': '#0D0D0D',
      'accent-default': '#C9A962',
      'accent-hover': '#D4B872',
      'accent-active': '#B8983F',
      'accent-secondary': '#A08040',
      'border-default': '#2A2A2A',
      'border-emphasis': '#3D3D3D',
      'border-muted': '#1F1F1F',
      'gradient-hero': {
        type: 'radial',
        shape: 'ellipse',
        position: 'center',
        stops: [
          { color: '#000000', position: 0, opacity: 0 },
          { color: '#000000', position: 70, opacity: 0.5 },
          { color: '#000000', position: 100, opacity: 0.8 },
        ],
      },
    },
    quick: {
      mood: 'warm',
      contrast: 'high',
      saturation: 'muted',
    },
    recommendedTypography: 'classic-elegant',
  },

  'cinematic-warm': {
    id: 'cinematic-warm',
    name: 'Cinematic Warm',
    nameKo: '시네마틱 웜',
    description: '따뜻한 영화적 색감',
    category: 'cinematic',
    tokens: {
      'bg-page': '#1A1510',
      'bg-section': '#211A14',
      'bg-section-alt': '#2A2118',
      'bg-card': '#2A2118',
      'bg-overlay': 'rgba(20, 15, 10, 0.6)',
      'fg-default': '#E8DDD0',
      'fg-muted': '#A89880',
      'fg-emphasis': '#FFF8F0',
      'fg-inverse': '#1A1510',
      'fg-on-accent': '#1A1510',
      'accent-default': '#D4A05A',
      'accent-hover': '#E0B06A',
      'accent-active': '#C4904A',
      'accent-secondary': '#B08040',
      'border-default': '#3D3228',
      'border-emphasis': '#4D4238',
      'border-muted': '#2A2118',
      'gradient-overlay': {
        type: 'linear',
        angle: 180,
        stops: [
          { color: '#1A1510', position: 0, opacity: 0 },
          { color: '#1A1510', position: 100, opacity: 0.8 },
        ],
      },
    },
    quick: {
      mood: 'warm',
      contrast: 'medium',
      saturation: 'muted',
    },
    recommendedTypography: 'romantic-italian',
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

  'duotone': {
    id: 'duotone',
    name: 'Duotone',
    nameKo: '듀오톤',
    description: '두 가지 색상의 조화',
    category: 'special',
    tokens: {
      'bg-page': '#1A1A2E',
      'bg-section': '#16213E',
      'bg-section-alt': '#0F3460',
      'bg-card': '#1A1A2E',
      'bg-overlay': 'rgba(10, 10, 20, 0.6)',
      'fg-default': '#E8E8E8',
      'fg-muted': '#A0A0B0',
      'fg-emphasis': '#FFFFFF',
      'fg-inverse': '#1A1A2E',
      'fg-on-accent': '#1A1A2E',
      'accent-default': '#E94560',
      'accent-hover': '#F05070',
      'accent-active': '#D83550',
      'accent-secondary': '#533483',
      'border-default': '#2A2A4E',
      'border-emphasis': '#3A3A6E',
      'border-muted': '#1A1A2E',
    },
    quick: {
      mood: 'cool',
      contrast: 'high',
      saturation: 'vivid',
    },
    recommendedTypography: 'modern-geometric',
  },

  'gradient-hero': {
    id: 'gradient-hero',
    name: 'Gradient Hero',
    nameKo: '그라데이션 히어로',
    description: '화려한 그라데이션 중심 디자인',
    category: 'special',
    tokens: {
      'bg-page': '#0F0F1A',
      'bg-section': '#1A1A2E',
      'bg-section-alt': '#252540',
      'bg-card': '#1F1F35',
      'bg-overlay': 'rgba(15, 15, 26, 0.5)',
      'fg-default': '#F0F0F5',
      'fg-muted': '#A0A0B5',
      'fg-emphasis': '#FFFFFF',
      'fg-inverse': '#0F0F1A',
      'fg-on-accent': '#FFFFFF',
      'accent-default': '#8B5CF6',
      'accent-hover': '#9D6FF8',
      'accent-active': '#7C4DE8',
      'accent-secondary': '#EC4899',
      'border-default': '#2D2D4A',
      'border-emphasis': '#3D3D6A',
      'border-muted': '#1A1A30',
      'gradient-hero': {
        type: 'linear',
        angle: 135,
        stops: [
          { color: '#667EEA', position: 0 },
          { color: '#764BA2', position: 50 },
          { color: '#F093FB', position: 100 },
        ],
      },
      'gradient-accent': {
        type: 'linear',
        angle: 90,
        stops: [
          { color: '#8B5CF6', position: 0 },
          { color: '#EC4899', position: 100 },
        ],
      },
    },
    quick: {
      mood: 'cool',
      contrast: 'high',
      saturation: 'vivid',
    },
    recommendedTypography: 'modern-clean',
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
    'basic',
    'classic',
    'modern',
    'romantic',
    'cinematic',
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
