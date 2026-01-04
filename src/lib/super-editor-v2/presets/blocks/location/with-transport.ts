/**
 * Location Block - With Transport Preset
 *
 * 지도, 네비게이션 버튼, 대중교통/셔틀버스/주차/전세버스 상세 안내를 포함한 오시는길 섹션
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'
import { FONT_SIZE } from '../tokens'

// ============================================
// Default Elements
// ============================================

const LOCATION_WITH_TRANSPORT_ELEMENTS: PresetElement[] = [
  // Korean Title (오시는길)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'custom.locationTitle',
    value: '오시는길',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 24,
        fontWeight: 600,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
      },
    },
  },
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
  // ─── Transportation Sections ───
  // Subway Section
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'venue.transportation.subway',
    props: {
      type: 'group',
      layout: { direction: 'vertical', gap: 12, alignItems: 'start' },
      hideWhenEmpty: true,
    },
    children: [
      {
        id: 'transport-subway-header',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'horizontal', gap: 8, alignItems: 'center' },
        },
        children: [
          {
            id: 'transport-subway-icon',
            type: 'image',
            zIndex: 1,
            sizing: {
              width: { type: 'fixed', value: 24, unit: 'px' },
              height: { type: 'fixed', value: 24, unit: 'px' },
            },
            value: '/assets/icon_subway.svg',
            props: {
              type: 'image',
              objectFit: 'contain',
            },
          },
          {
            id: 'transport-subway-title',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
            value: '지하철',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: FONT_SIZE.md,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
        ],
      },
      {
        id: 'transport-subway-divider',
        type: 'divider',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 1, unit: 'px' } },
        props: { type: 'divider', dividerStyle: 'solid' },
        style: { background: 'var(--border-default)' },
      },
      {
        id: 'transport-subway-content',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        binding: 'venue.transportation.subway',
        props: { type: 'text', listStyle: 'bullet' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: FONT_SIZE.base,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'left',
            lineHeight: 1.6,
          },
        },
      },
    ],
  },
  // Bus Section
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'venue.transportation.bus',
    props: {
      type: 'group',
      layout: { direction: 'vertical', gap: 12, alignItems: 'start' },
      hideWhenEmpty: true,
    },
    children: [
      {
        id: 'transport-bus-header',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'horizontal', gap: 8, alignItems: 'center' },
        },
        children: [
          {
            id: 'transport-bus-icon',
            type: 'image',
            zIndex: 1,
            sizing: {
              width: { type: 'fixed', value: 24, unit: 'px' },
              height: { type: 'fixed', value: 24, unit: 'px' },
            },
            value: '/assets/icon_bus.svg',
            props: {
              type: 'image',
              objectFit: 'contain',
            },
          },
          {
            id: 'transport-bus-title',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
            value: '버스',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: FONT_SIZE.md,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
        ],
      },
      {
        id: 'transport-bus-divider',
        type: 'divider',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 1, unit: 'px' } },
        props: { type: 'divider', dividerStyle: 'solid' },
        style: { background: 'var(--border-default)' },
      },
      {
        id: 'transport-bus-content',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        binding: 'venue.transportation.bus',
        props: { type: 'text', listStyle: 'bullet' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: FONT_SIZE.base,
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
    binding: 'venue.transportation.shuttle',
    props: {
      type: 'group',
      layout: { direction: 'vertical', gap: 12, alignItems: 'start' },
      hideWhenEmpty: true,
    },
    children: [
      {
        id: 'transport-shuttle-header',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'horizontal', gap: 8, alignItems: 'center' },
        },
        children: [
          {
            id: 'transport-shuttle-icon',
            type: 'image',
            zIndex: 1,
            sizing: {
              width: { type: 'fixed', value: 24, unit: 'px' },
              height: { type: 'fixed', value: 24, unit: 'px' },
            },
            value: '/assets/icon_bus.svg',
            props: {
              type: 'image',
              objectFit: 'contain',
            },
          },
          {
            id: 'transport-shuttle-title',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
            value: '셔틀버스',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: FONT_SIZE.md,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
        ],
      },
      {
        id: 'transport-shuttle-divider',
        type: 'divider',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 1, unit: 'px' } },
        props: { type: 'divider', dividerStyle: 'solid' },
        style: { background: 'var(--border-default)' },
      },
      {
        id: 'transport-shuttle-content',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        binding: 'venue.transportation.shuttle',
        props: { type: 'text', listStyle: 'bullet' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: FONT_SIZE.base,
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
    binding: 'venue.transportation.parking',
    props: {
      type: 'group',
      layout: { direction: 'vertical', gap: 12, alignItems: 'start' },
      hideWhenEmpty: true,
    },
    children: [
      {
        id: 'transport-parking-header',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'horizontal', gap: 8, alignItems: 'center' },
        },
        children: [
          {
            id: 'transport-parking-icon',
            type: 'image',
            zIndex: 1,
            sizing: {
              width: { type: 'fixed', value: 24, unit: 'px' },
              height: { type: 'fixed', value: 24, unit: 'px' },
            },
            value: '/assets/icon_car.svg',
            props: {
              type: 'image',
              objectFit: 'contain',
            },
          },
          {
            id: 'transport-parking-title',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
            value: '주차',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: FONT_SIZE.md,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
        ],
      },
      {
        id: 'transport-parking-divider',
        type: 'divider',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 1, unit: 'px' } },
        props: { type: 'divider', dividerStyle: 'solid' },
        style: { background: 'var(--border-default)' },
      },
      {
        id: 'transport-parking-content',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        binding: 'venue.transportation.parking',
        props: { type: 'text', listStyle: 'bullet' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: FONT_SIZE.base,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'left',
            lineHeight: 1.6,
          },
        },
      },
    ],
  },
  // Charter Bus Section (전세버스)
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'venue.transportation.etc',
    props: {
      type: 'group',
      layout: { direction: 'vertical', gap: 12, alignItems: 'start' },
      hideWhenEmpty: true,
    },
    children: [
      {
        id: 'transport-etc-header',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'horizontal', gap: 8, alignItems: 'center' },
        },
        children: [
          {
            id: 'transport-etc-icon',
            type: 'image',
            zIndex: 1,
            sizing: {
              width: { type: 'fixed', value: 24, unit: 'px' },
              height: { type: 'fixed', value: 24, unit: 'px' },
            },
            value: '/assets/icon_bus.svg',
            props: {
              type: 'image',
              objectFit: 'contain',
            },
          },
          {
            id: 'transport-etc-title',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
            value: '전세 버스',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-body)',
                fontSize: FONT_SIZE.md,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'left',
              },
            },
          },
        ],
      },
      {
        id: 'transport-etc-divider',
        type: 'divider',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 1, unit: 'px' } },
        props: { type: 'divider', dividerStyle: 'solid' },
        style: { background: 'var(--border-default)' },
      },
      {
        id: 'transport-etc-content',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        binding: 'venue.transportation.etc',
        props: { type: 'text', listStyle: 'bullet' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: FONT_SIZE.base,
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
  description:
    '지도, 네비게이션 버튼, 대중교통/셔틀버스/주차/전세버스 상세 안내를 포함한 오시는길 섹션',
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
    'venue.transportation.bus',
    'venue.transportation.shuttle',
    'venue.transportation.parking',
    'venue.transportation.etc',
    'custom.locationTitle',
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
