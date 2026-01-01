/**
 * Location Block - With Transport Preset
 *
 * 지도, 네비게이션 버튼, 대중교통/셔틀버스/주차/전세버스 상세 안내를 포함한 오시는길 섹션
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

// ============================================
// Default Elements
// ============================================

const LOCATION_WITH_TRANSPORT_ELEMENTS: PresetElement[] = [
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
        fontSize: 14,
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
        fontSize: 22,
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
        fontSize: 15,
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
        fontSize: 15,
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
        },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
          background: 'transparent',
          border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
        },
      },
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
        },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
          background: 'transparent',
          border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
        },
      },
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
        },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 14,
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
  // ─── Transportation Sections ───
  // Public Transport Section
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: { direction: 'vertical', gap: 8, alignItems: 'start' },
    },
    children: [
      {
        id: 'transport-subway-title',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        value: '대중교통',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--fg-default)',
            textAlign: 'left',
          },
        },
      },
      {
        id: 'transport-subway-content',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        binding: 'venue.transportation.subway',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'left',
            lineHeight: 1.6,
          },
        },
      },
    ],
  },
  // Shuttle Bus Section
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: { direction: 'vertical', gap: 8, alignItems: 'start' },
    },
    children: [
      {
        id: 'transport-shuttle-title',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        value: '셔틀버스',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--fg-default)',
            textAlign: 'left',
          },
        },
      },
      {
        id: 'transport-shuttle-content',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        binding: 'venue.transportation.shuttle',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'left',
            lineHeight: 1.6,
          },
        },
      },
    ],
  },
  // Parking Section
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: { direction: 'vertical', gap: 8, alignItems: 'start' },
    },
    children: [
      {
        id: 'transport-parking-title',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        value: '주차',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--fg-default)',
            textAlign: 'left',
          },
        },
      },
      {
        id: 'transport-parking-content',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        binding: 'venue.transportation.parking',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'left',
            lineHeight: 1.6,
          },
        },
      },
    ],
  },
  // Charter Bus Section
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: { direction: 'vertical', gap: 8, alignItems: 'start' },
    },
    children: [
      {
        id: 'transport-etc-title',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        value: '전세 버스',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--fg-default)',
            textAlign: 'left',
          },
        },
      },
      {
        id: 'transport-etc-content',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        binding: 'venue.transportation.etc',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'left',
            lineHeight: 1.6,
          },
        },
      },
    ],
  },
]

// ============================================
// Location With Transport Preset
// ============================================

export const LOCATION_WITH_TRANSPORT: BlockPreset = {
  id: 'location-with-transport',
  blockType: 'location',
  variant: 'with-transport',
  name: 'Location with Transport Info',
  nameKo: '교통 정보',
  description: '지도, 네비게이션 버튼, 대중교통/셔틀버스/주차/전세버스 상세 안내를 포함한 오시는길 섹션',
  tags: ['detailed', 'transport', 'centered', 'light', 'map', 'navigation', 'auto-layout'],
  complexity: 'medium',
  bindings: [
    'venue.name',
    'venue.hall',
    'venue.address',
    'venue.lat',
    'venue.lng',
    'venue.naverUrl',
    'venue.tmapUrl',
    'venue.kakaoUrl',
    'venue.transportation.subway',
    'venue.transportation.shuttle',
    'venue.transportation.parking',
    'venue.transportation.etc',
    'custom.locationEngTitle',
    'custom.navGuide',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: LOCATION_WITH_TRANSPORT_ELEMENTS,
  specialComponents: ['kakao-map', 'naver-map'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['minimal-light', 'modern-mono', 'classic-ivory'],
  aiHints: {
    mood: ['detailed', 'informative', 'clean'],
    style: ['centered', 'map-with-buttons', 'transport-info'],
    useCase: ['venue-info', 'navigation-links', 'directions', 'transportation'],
  },
  relatedPresets: ['location-minimal'],
}
