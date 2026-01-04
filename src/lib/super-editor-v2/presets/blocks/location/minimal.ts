/**
 * Location Block - Minimal Preset
 *
 * 지도 영역과 네이버/티맵/카카오맵 연동 버튼을 포함한 오시는길 섹션
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
import { FONT_SIZE } from '../tokens'

// ============================================
// Default Elements
// ============================================

const LOCATION_MINIMAL_ELEMENTS: PresetElement[] = [
  // English Title (LOCATION)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'custom.locationEngTitle',
    value: 'LOCATION',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-accent)',
        fontSize: FONT_SIZE.base,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        letterSpacing: 0.2,
      },
    },
  },
  // Venue Name + Hall
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'text',
      format: '{venue.name}, {venue.hall}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: FONT_SIZE['2xl'],
        fontWeight: 600,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
      },
    },
  },
  // Address
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'venue.address',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.body,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
      },
    },
  },
  // Map Placeholder
  {
    type: 'map',
    zIndex: 1,
    sizing: {
      width: { type: 'fill' },
      height: { type: 'fixed', value: 200, unit: 'px' },
    },
    binding: 'venue',
    props: {
      type: 'map',
      zoom: 15,
      showMarker: true,
    },
    style: {
      background: '#E5E7EB',
    },
  },
  // Navigation Guide Text
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'custom.navGuide',
    value: '원하시는 내비게이션 앱을 선택해 주세요!',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.body,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // Navigation Button Group
  {
    type: 'group',
    zIndex: 1,
    sizing: {
      width: { type: 'fill' },
      height: { type: 'hug' },
    },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 12,
        alignItems: 'stretch',
      },
    },
    children: [
      // Naver Map Button
      {
        id: 'nav-naver',
        type: 'button',
        zIndex: 1,
        sizing: {
          width: { type: 'fill-portion', value: 1 },
          height: { type: 'hug' },
        },
        binding: 'venue.naverUrl',
        props: {
          type: 'button',
          label: '네이버',
          action: 'link',
          icon: 'naver',
        },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: FONT_SIZE.base,
            fontWeight: 500,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
          background: 'transparent',
          border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
        },
      },
      // T Map Button
      {
        id: 'nav-tmap',
        type: 'button',
        zIndex: 1,
        sizing: {
          width: { type: 'fill-portion', value: 1 },
          height: { type: 'hug' },
        },
        binding: 'venue.tmapUrl',
        props: {
          type: 'button',
          label: '티맵',
          action: 'link',
          icon: 'tmap',
        },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: FONT_SIZE.base,
            fontWeight: 500,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
          background: 'transparent',
          border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
        },
      },
      // Kakao Map Button
      {
        id: 'nav-kakao',
        type: 'button',
        zIndex: 1,
        sizing: {
          width: { type: 'fill-portion', value: 1 },
          height: { type: 'hug' },
        },
        binding: 'venue.kakaoUrl',
        props: {
          type: 'button',
          label: '카카오',
          action: 'link',
          icon: 'kakao',
        },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: FONT_SIZE.base,
            fontWeight: 500,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
          background: 'transparent',
          border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
        },
      },
    ],
  },
]

// ============================================
// Location Minimal Preset
// ============================================

export const LOCATION_MINIMAL: BlockPreset = {
  id: 'location-minimal',
  blockType: 'location',
  variant: 'minimal',
  name: 'Minimal Location',
  nameKo: '미니멀',
  description: '지도 영역과 네이버/티맵/카카오맵 연동 버튼을 포함한 오시는길 섹션',
  tags: ['minimal', 'centered', 'light', 'map', 'navigation', 'auto-layout'],
  complexity: 'low',
  bindings: [
    'venue.name',
    'venue.hall',
    'venue.address',
    'venue.lat',
    'venue.lng',
    'venue.naverUrl',
    'venue.tmapUrl',
    'venue.kakaoUrl',
    'custom.locationEngTitle',
    'custom.navGuide',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: LOCATION_MINIMAL_ELEMENTS,
  specialComponents: ['kakao-map', 'naver-map'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['minimal-light', 'modern-mono', 'classic-ivory'],
  aiHints: {
    mood: ['minimal', 'clean', 'simple'],
    style: ['centered', 'map-with-buttons', 'light-background'],
    useCase: ['venue-info', 'navigation-links', 'directions'],
  },
}
