/**
 * Notice Block - Card Icon Preset
 *
 * 아이콘과 카드 배경이 있는 공지사항 스타일
 * 점선 테두리와 부드러운 배경색으로 정보를 강조합니다.
 *
 * 특징:
 * - notice.items[] 배열 기반 다중 카드 지원
 * - Swiper로 좌우 스와이프 가능
 * - 각 카드별 아이콘, 배경색, 테두리색 커스터마이징
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

// ============================================
// Icon Type Mapping
// ============================================

/**
 * iconType → SVG 파일 매핑
 * 렌더러에서 사용
 */
export const NOTICE_ICON_MAP = {
  rings: '/assets/notice1.svg', // 결혼 반지 + 나뭇잎
  birds: '/assets/notice2.svg', // 새 두 마리 + 하트
  hearts: '/assets/notice3.svg', // 하트 두 개 + 나뭇잎
} as const

/**
 * 기본 카드 색상 프리셋
 * 이미지 #2 참조: 각 카드별 다른 Hue의 배경색
 */
export const NOTICE_CARD_COLORS = {
  blue: { background: '#E8F4FD', border: '#A8D4F0' },
  pink: { background: '#FDF2F8', border: '#F9A8D4' },
  green: { background: '#ECFDF5', border: '#A7F3D0' },
  orange: { background: '#FFF7ED', border: '#FDBA74' },
  purple: { background: '#FAF5FF', border: '#D8B4FE' },
} as const

// ============================================
// Default Elements (Header Only)
// ============================================

/**
 * 헤더 요소들 (고정)
 * 카드 영역은 notice-swiper 컴포넌트에서 동적 렌더링
 */
const NOTICE_CARD_ICON_ELEMENTS: PresetElement[] = [
  // 섹션 제목 (영문 라벨)
  {
    type: 'text',
    layoutMode: 'auto',
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    zIndex: 1,
    binding: 'notice.sectionTitle',
    value: 'NOTICE',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-accent)',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        letterSpacing: 0.15,
      },
    },
  },
  // 블록 제목 (한글)
  {
    type: 'text',
    layoutMode: 'auto',
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    zIndex: 1,
    binding: 'notice.title',
    value: '예식 안내사항',  // 기본값 (바인딩 없을 때)
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 24,
        fontWeight: 600,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.4,
      },
    },
  },
  // Description
  {
    type: 'text',
    layoutMode: 'auto',
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    zIndex: 1,
    binding: 'notice.description',
    value: '저희 웨딩에 대한 사전 안내를 드립니다.',  // 기본값 (바인딩 없을 때)
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // Swiper Container Placeholder
  // 실제 카드들은 notice-swiper 컴포넌트에서 notice.items[]를 반복하여 렌더링
]

// ============================================
// Card Template (for renderer reference)
// ============================================

/**
 * 카드 템플릿 구조
 * notice-swiper 렌더러가 이 구조를 참조하여 각 카드 생성
 */
export const NOTICE_CARD_TEMPLATE = {
  container: {
    sizing: {
      width: { type: 'fixed' as const, value: 85, unit: '%' as const },
      height: { type: 'hug' as const },
    },
    layout: {
      direction: 'vertical' as const,
      gap: 20,
      alignItems: 'center' as const,
    },
    style: {
      padding: 32,
      borderRadius: 8,
      borderStyle: 'dashed' as const,
      borderWidth: 1,
    },
  },
  icon: {
    sizing: {
      width: { type: 'fixed' as const, value: 80, unit: 'px' as const },
      height: { type: 'fixed' as const, value: 50, unit: 'px' as const },
    },
    objectFit: 'contain' as const,
  },
  title: {
    style: {
      fontFamily: 'var(--font-heading)',
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--fg-emphasis)',
      textAlign: 'center' as const,
      lineHeight: 1.4,
    },
  },
  content: {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      fontWeight: 400,
      color: 'var(--fg-default)',
      textAlign: 'center' as const,
      lineHeight: 1.8,
    },
  },
}

// ============================================
// Swiper Configuration
// ============================================

export const NOTICE_SWIPER_CONFIG = {
  slidesPerView: 1,
  spaceBetween: 16,
  centeredSlides: true,
  pagination: {
    clickable: true,
    type: 'bullets' as const,
  },
  navigation: false,
  loop: false,
}

// ============================================
// Notice Card Icon Preset
// ============================================

export const NOTICE_CARD_ICON: BlockPreset = {
  id: 'notice-card-icon',
  blockType: 'notice',
  variant: 'card-icon',
  name: 'Card Icon',
  nameKo: '카드 아이콘',
  description:
    '아이콘과 카드 배경이 있는 공지사항 스타일. Swiper로 여러 공지를 스와이프하며 확인할 수 있습니다.',
  tags: [
    'card',
    'icon',
    'swiper',
    'carousel',
    'centered',
    'elegant',
    'soft',
    'light',
    'auto-layout',
  ],
  complexity: 'medium',
  bindings: ['notice.sectionTitle', 'notice.title', 'notice.description', 'notice.items'],
  defaultHeight: HUG_HEIGHT,
  layout: {
    ...AUTO_LAYOUT_VERTICAL,
    gap: 24,
    padding: { top: 48, right: 0, bottom: 48, left: 0 }, // Swiper는 좌우 패딩 없음
  },
  defaultElements: NOTICE_CARD_ICON_ELEMENTS,
  specialComponents: ['notice-swiper'], // Swiper 렌더러 사용
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['classic-ivory', 'minimal-light', 'romantic-blush', 'simple-blue'],
  aiHints: {
    mood: ['elegant', 'soft', 'informative'],
    style: ['card', 'icon-header', 'dashed-border', 'centered', 'swipeable'],
    useCase: ['피로연안내', '연회식사', '코스식사', '답례품', '폐백', '일반공지'],
  },
}
