/**
 * Hero Block - Center Text Preset
 *
 * 메인 사진 위에 중앙 정렬된 텍스트를 오버레이하는 미니멀 히어로 레이아웃
 * absolute positioning 사용 (auto-layout 아님)
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT, OVERLAY_TEXT_SHADOW } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 메인 사진 (전체 배경)
  {
    id: 'main-image',
    type: 'image',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: 0,
    binding: 'photos.main',
    props: { type: 'image', objectFit: 'cover' },
  },
  // 신랑 이름 (상단)
  {
    id: 'groom-name',
    type: 'text',
    x: 10,
    y: 35,
    width: 80,
    height: 10,
    zIndex: 1,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 32,
        fontWeight: 300,
        color: '#ffffff',
        textAlign: 'center',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 신부 이름 (하단)
  {
    id: 'bride-name',
    type: 'text',
    x: 10,
    y: 45,
    width: 80,
    height: 10,
    zIndex: 1,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 32,
        fontWeight: 300,
        color: '#ffffff',
        textAlign: 'center',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 결혼 날짜
  {
    id: 'wedding-date',
    type: 'text',
    x: 15,
    y: 58,
    width: 70,
    height: 8,
    zIndex: 1,
    binding: 'wedding.dateDisplay',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: 2,
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
]

export const HERO_CENTER_TEXT: BlockPreset = {
  id: 'hero-center-text',
  blockType: 'hero',
  variant: 'center-text',
  name: 'Center Text',
  nameKo: '중앙 정렬',
  description: '메인 사진 위에 중앙 정렬된 텍스트를 오버레이하는 미니멀 히어로 레이아웃',
  tags: ['minimal', 'center', 'overlay', 'photo-focused', 'absolute'],
  complexity: 'low',
  bindings: [
    'photos.main',
    'couple.groom.name',
    'couple.bride.name',
    'wedding.dateDisplay',
  ],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: ['image-overlay'],
  recommendedAnimations: ['fade-in', 'zoom-in'],
  recommendedThemes: ['minimal-light', 'simple-white', 'modern-clean'],
  aiHints: {
    mood: ['minimal', 'modern', 'clean'],
    style: ['centered', 'stacked', 'vertical'],
    useCase: ['메인 히어로', '첫 화면', '심플한 청첩장'],
  },
}
