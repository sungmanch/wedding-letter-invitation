/**
 * Gallery Block Presets - Shared Elements
 *
 * 갤러리 블록 공통 요소 정의
 * - 섹션 라벨, 제목, 설명
 * - Lightbox 설정 (클릭 확대, 스와이프 loop)
 */

import type { VariablePath } from '../../../schema/types'
import type { PresetElement } from '../types'
import { FONT_SIZE } from '../tokens'

// ============================================
// Common Bindings
// ============================================

export const GALLERY_COMMON_BINDINGS: readonly VariablePath[] = [
  'photos.gallery',
] as const

// ============================================
// Common Text Styles
// ============================================

export const GALLERY_TEXT_STYLES = {
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: FONT_SIZE.sm,
    fontWeight: 500,
    color: 'var(--fg-muted)',
    textAlign: 'center' as const,
    letterSpacing: 0.1,
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: FONT_SIZE['3xl'],
    fontWeight: 600,
    color: 'var(--fg-default)',
    textAlign: 'center' as const,
  },
  description: {
    fontFamily: 'var(--font-body)',
    fontSize: FONT_SIZE.base,
    fontWeight: 400,
    color: 'var(--fg-muted)',
    textAlign: 'center' as const,
  },
  moreButton: {
    fontFamily: 'var(--font-body)',
    fontSize: FONT_SIZE.base,
    fontWeight: 500,
    color: 'var(--fg-default)',
    textAlign: 'center' as const,
  },
} as const

// ============================================
// Common Header Elements (Auto Layout)
// ============================================

export function createGalleryHeaderElements(): PresetElement[] {
  return [
    // 섹션 라벨 (GALLERY)
    {
      type: 'text',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fill' },
        height: { type: 'hug' },
      },
      zIndex: 1,
      value: 'GALLERY',
      props: { type: 'text' },
      style: {
        text: GALLERY_TEXT_STYLES.label,
      },
    },
    // 섹션 제목
    {
      type: 'text',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fill' },
        height: { type: 'hug' },
      },
      zIndex: 1,
      value: '웨딩 갤러리',
      props: { type: 'text' },
      style: {
        text: GALLERY_TEXT_STYLES.title,
      },
    },
    // 설명
    {
      type: 'text',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fill' },
        height: { type: 'hug' },
      },
      zIndex: 1,
      value: '사진을 클릭하시면 전체 화면보기가 가능합니다.',
      props: { type: 'text' },
      style: {
        text: GALLERY_TEXT_STYLES.description,
      },
    },
  ]
}

// ============================================
// Gallery Grid Element (Special Component)
// ============================================

export interface GalleryGridConfig {
  /** 열 개수 */
  columns: 2 | 3
  /** 사진 비율 (width:height) */
  aspectRatio: '1:1' | '3:4' | 'mixed'
  /** 사진 간 간격 (px) */
  gap: number
  /** 초기 표시 행 수 */
  initialRows: number
  /** 더보기 버튼 표시 여부 */
  showMoreButton: boolean
}

/**
 * Gallery grid special component element
 * - Renderer에서 GalleryGridComponent로 처리
 */
export function createGalleryGridElement(config: GalleryGridConfig): PresetElement {
  return {
    type: 'group',
    layoutMode: 'auto',
    sizing: {
      width: { type: 'fill' },
      height: { type: 'hug' },
    },
    zIndex: 1,
    binding: 'photos.gallery',
    props: {
      type: 'group',
      layout: {
        direction: 'vertical',
        gap: config.gap,
        alignItems: 'stretch',
      },
      // Gallery-specific configuration
      // @ts-expect-error - custom gallery props
      gallery: {
        columns: config.columns,
        aspectRatio: config.aspectRatio,
        gap: config.gap,
        initialRows: config.initialRows,
        showMoreButton: config.showMoreButton,
        // Lightbox 설정
        lightbox: {
          enabled: true,
          swipe: true,
          loop: true,
          closeButton: {
            position: 'top-right',
            icon: 'x',
          },
          overlay: {
            background: 'rgba(0, 0, 0, 0.9)',
          },
        },
      },
    },
  }
}

// ============================================
// More Button Element
// ============================================

export function createMoreButtonElement(): PresetElement {
  return {
    type: 'button',
    layoutMode: 'auto',
    sizing: {
      width: { type: 'fill' },
      height: { type: 'hug' },
    },
    constraints: {
      minHeight: 48,
    },
    zIndex: 1,
    value: '더보기',
    props: {
      type: 'button',
      label: '더보기',
      action: 'show-block',
    },
    style: {
      text: GALLERY_TEXT_STYLES.moreButton,
      background: 'transparent',
      border: {
        width: 1,
        color: 'var(--border-default)',
        style: 'solid',
        radius: 4,
      },
    },
  }
}

// ============================================
// AI Hints
// ============================================

export const GALLERY_AI_HINTS = {
  mood: ['elegant', 'romantic', 'minimal', 'modern'] as const,
  style: ['grid', 'masonry', 'carousel', 'lightbox'] as const,
  useCase: ['wedding-photos', 'couple-gallery', 'photo-album'] as const,
}

// ============================================
// Special Components
// ============================================

export const GALLERY_SPECIAL_COMPONENTS = [
  'GalleryGrid',      // 그리드 레이아웃 + 클릭 핸들링
  'Lightbox',         // 전체화면 모달 + 스와이프
] as const

// ============================================
// Recommended Themes
// ============================================

export const GALLERY_RECOMMENDED_THEMES = [
  'hero-minimal-overlay',
  'hero-classic-elegant',
  'hero-monochrome-bold',
] as const
