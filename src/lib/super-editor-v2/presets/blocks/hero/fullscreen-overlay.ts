/**
 * Hero Block - Fullscreen Overlay Preset
 *
 * 전체 화면 메인 사진 위에 신랑/신부 이름과 날짜를 오버레이하는 클래식 히어로 레이아웃
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
  // 신랑 이름 (왼쪽)
  {
    id: 'groom-name',
    type: 'text',
    x: 10,
    y: 40,
    width: 35,
    height: 10,
    zIndex: 1,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 28,
        fontWeight: 400,
        color: '#ffffff',
        textAlign: 'right',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 앰퍼샌드 (&)
  {
    id: 'ampersand',
    type: 'text',
    x: 45,
    y: 40,
    width: 10,
    height: 10,
    zIndex: 1,
    value: '&',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 24,
        fontWeight: 300,
        color: '#ffffff',
        textAlign: 'center',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 신부 이름 (오른쪽)
  {
    id: 'bride-name',
    type: 'text',
    x: 55,
    y: 40,
    width: 35,
    height: 10,
    zIndex: 1,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 28,
        fontWeight: 400,
        color: '#ffffff',
        textAlign: 'left',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 결혼 날짜
  {
    id: 'wedding-date',
    type: 'text',
    x: 20,
    y: 52,
    width: 60,
    height: 8,
    zIndex: 1,
    binding: 'wedding.dateDisplay',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        fontWeight: 400,
        color: '#ffffff',
        textAlign: 'center',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
]

export const HERO_FULLSCREEN_OVERLAY: BlockPreset = {
  id: 'hero-fullscreen-overlay',
  blockType: 'hero',
  variant: 'fullscreen-overlay',
  name: 'Fullscreen Overlay',
  nameKo: '풀스크린 오버레이',
  description: '전체 화면 메인 사진 위에 신랑/신부 이름과 날짜를 오버레이하는 클래식 히어로 레이아웃',
  tags: ['classic', 'fullscreen', 'overlay', 'photo-focused', 'absolute'],
  complexity: 'low',
  bindings: [
    'photos.main',
    'couple.groom.name',
    'couple.bride.name',
    'wedding.dateDisplay',
  ],
  defaultHeight: HERO_HEIGHT,
  // Hero는 absolute layout 사용 (auto-layout 아님)
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: ['image-overlay'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['classic-ivory', 'romantic-blush', 'minimal-light'],
  aiHints: {
    mood: ['romantic', 'elegant', 'classic'],
    style: ['fullscreen', 'overlay', 'photo-centric'],
    useCase: ['메인 히어로', '첫 화면', '대표 사진'],
  },
}
