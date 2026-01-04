/**
 * Location Block - With Tel Preset
 *
 * 장소명, 주소, 전화번호와 네이버/카카오 지도 버튼이 포함된 오시는길 섹션
 * 이미지 분석 기반 생성
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
import { FONT_SIZE } from '../tokens'

// ============================================
// Default Elements
// ============================================

const LOCATION_WITH_TEL_ELEMENTS: PresetElement[] = [
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
        color: 'var(--accent-default)',
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
  // Phone Number (NEW)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'venue.tel',
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
  // Map
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
  // Navigation Button Group (2 buttons: Naver, Kakao)
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
// Location With Tel Preset
// ============================================

export const LOCATION_WITH_TEL: BlockPreset = {
  id: 'location-with-tel',
  blockType: 'location',
  variant: 'with-tel',
  name: 'Location with Phone',
  nameKo: '전화번호 포함',
  description: '장소명, 주소, 전화번호와 네이버/카카오 지도 버튼이 포함된 오시는길 섹션',
  tags: ['minimal', 'centered', 'light', 'map', 'navigation', 'phone', 'auto-layout'],
  complexity: 'low',
  bindings: [
    'venue.name',
    'venue.hall',
    'venue.address',
    'venue.tel',
    'venue.lat',
    'venue.lng',
    'venue.naverUrl',
    'venue.kakaoUrl',
    'custom.locationEngTitle',
    'custom.navGuide',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: LOCATION_WITH_TEL_ELEMENTS,
  specialComponents: ['kakao-map', 'naver-map'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['minimal-light', 'modern-mono', 'classic-ivory'],
  aiHints: {
    mood: ['minimal', 'clean', 'simple'],
    style: ['centered', 'map-with-buttons', 'light-background'],
    useCase: ['venue-info', 'navigation-links', 'directions', 'phone-contact'],
  },
}
