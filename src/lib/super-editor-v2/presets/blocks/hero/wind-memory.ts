/**
 * Hero Block - Wind Memory (바람기억) Preset
 *
 * 자연 배경에 손글씨 캐치프레이즈를 배치한 내추럴 로맨틱 스타일
 * - 넓은 풀밭/자연 배경
 * - 영문 손글씨 3줄 캐치프레이즈
 * - 상단 "WEDDING INVITATION" 레터링
 * - 하단 날짜/시간 배치
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT, OVERLAY_TEXT_SHADOW } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 배경 이미지 (자연스러운 야외 사진)
  {
    id: 'main-image',
    type: 'image',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: 0,
    binding: 'photos.main',
    props: { type: 'image', objectFit: 'cover', fallbackSrc: '/examples/wedding_images/new_asset_4.png' },
  },
  // "WEDDING INVITATION" 상단 레터링
  {
    id: 'title-label',
    type: 'text',
    x: 10,
    y: 8,
    width: 80,
    height: 5,
    zIndex: 2,
    value: 'WEDDING INVITATION',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: '"Nothing You Could Do"',
        fontSize: 14,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: '0.25em',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 캐치프레이즈 1줄: "Two hearts,"
  {
    id: 'quote-line1',
    type: 'text',
    x: 8,
    y: 48,
    width: 84,
    height: 10,
    zIndex: 2,
    binding: 'custom.heroQuote.0',
    value: 'Two hearts,',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: '"Nothing You Could Do"',
        fontSize: 38,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: '0.25em',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 캐치프레이즈 2줄: "One love,"
  {
    id: 'quote-line2',
    type: 'text',
    x: 8,
    y: 56,
    width: 84,
    height: 10,
    zIndex: 2,
    binding: 'custom.heroQuote.1',
    value: 'One love,',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: '"Nothing You Could Do"',
        fontSize: 38,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: '0.25em',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 캐치프레이즈 3줄: "Forever."
  {
    id: 'quote-line3',
    type: 'text',
    x: 8,
    y: 64,
    width: 84,
    height: 10,
    zIndex: 2,
    binding: 'custom.heroQuote.2',
    value: 'Forever.',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: '"Nothing You Could Do"',
        fontSize: 38,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: '0.25em',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 날짜 (2026.07.11(sat))
  {
    id: 'wedding-date',
    type: 'text',
    x: 10,
    y: 82,
    width: 80,
    height: 5,
    zIndex: 2,
    binding: 'wedding.dateDotWithDay',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: '"Nothing You Could Do"',
        fontSize: 24,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: '0.25em',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 시간 (pm 1:30)
  {
    id: 'wedding-time',
    type: 'text',
    x: 10,
    y: 87,
    width: 80,
    height: 5,
    zIndex: 2,
    binding: 'wedding.timeDisplayEnLower',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: '"Nothing You Could Do"',
        fontSize: 22,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: '0.25em',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
]

export const HERO_WIND_MEMORY: BlockPreset = {
  id: 'hero-wind-memory',
  blockType: 'hero',
  variant: 'wind-memory',
  name: 'Wind Memory',
  nameKo: '바람기억',
  description: '자연 배경에 손글씨 캐치프레이즈를 배치한 내추럴 로맨틱 스타일',
  tags: ['natural', 'romantic', 'handwritten', 'quote', 'outdoor', 'absolute'],
  complexity: 'low',
  bindings: [
    'photos.main',
    'custom.heroQuote',
    'wedding.dateDotWithDay',
    'wedding.timeDisplayEnLower',
  ],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  defaultData: {
    custom: {
      heroQuote: 'Two hearts,\nOne love,\nForever.',
    },
  },
  specialComponents: ['handwritten-quote', 'natural-background'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['hero-minimal-overlay'],
  aiHints: {
    mood: ['natural', 'romantic', 'warm', 'free'],
    style: ['handwritten', 'center-aligned', 'quote-focused'],
    useCase: ['야외 웨딩', '자연 배경 청첩장', '로맨틱한 분위기'],
  },
}
