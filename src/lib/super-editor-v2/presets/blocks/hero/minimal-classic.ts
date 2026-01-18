/**
 * Hero Block - Minimal Classic Preset
 *
 * 미니멀 클래식 스타일
 * - 상단: "WEDDING INVITATION" (넓은 자간)
 * - 중앙: "WEDDING DAY" (세리프 타이틀)
 * - 하단: 날짜, 이름, 초대 메시지
 * - 배경: 전체 화면 커플 사진
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 배경 이미지 (전체 화면)
  {
    id: 'hero-bg',
    type: 'image',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: 0,
    binding: 'photos.main',
    props: { type: 'image', objectFit: 'cover' },
  },
  // "WEDDING INVITATION" 라벨
  {
    id: 'hero-label',
    type: 'text',
    x: 10,
    y: 7,
    width: 80,
    height: 3,
    zIndex: 1,
    value: 'WEDDING INVITATION',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 400,
        color: '#000000',
        textAlign: 'center',
        letterSpacing: 0.25,
      },
    },
  },
  // "WEDDING DAY" 타이틀
  {
    id: 'hero-title',
    type: 'text',
    x: 10,
    y: 43,
    width: 80,
    height: 12,
    zIndex: 1,
    value: 'WEDDING\nDAY',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 40,
        fontWeight: 600,
        color: '#000000',
        textAlign: 'center',
        lineHeight: 1.2,
      },
    },
  },
  // 날짜 표시
  {
    id: 'hero-date',
    type: 'text',
    x: 15,
    y: 78,
    width: 70,
    height: 4,
    zIndex: 1,
    binding: 'wedding.dateDot',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        fontWeight: 400,
        color: '#000000',
        textAlign: 'center',
        letterSpacing: 0.25,
      },
    },
  },
  // 커플 이름
  {
    id: 'hero-names',
    type: 'text',
    x: 10,
    y: 87,
    width: 80,
    height: 3,
    zIndex: 1,
    props: {
      type: 'text',
      format: '{groom.name}, {bride.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 16,
        fontWeight: 400,
        color: '#000000',
        textAlign: 'center',
      },
    },
  },
  // 초대 메시지
  {
    id: 'hero-message',
    type: 'text',
    x: 10,
    y: 92,
    width: 80,
    height: 3,
    zIndex: 1,
    value: '결혼식에 초대합니다',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: 14,
        fontWeight: 400,
        color: '#000000',
        textAlign: 'center',
      },
    },
  },
]

export const HERO_MINIMAL_CLASSIC: BlockPreset = {
  id: 'hero-minimal-classic',
  blockType: 'hero',
  variant: 'minimal-classic',
  name: 'Minimal Classic',
  nameKo: '미니멀 클래식',
  description: '중앙 정렬의 클래식한 히어로, 넓은 자간과 세리프 타이틀',
  tags: ['minimal', 'classic', 'serif', 'center-aligned', 'absolute'],
  complexity: 'low',
  bindings: [
    'photos.main',
    'couple.groom.name',
    'couple.bride.name',
    'wedding.dateDot',
  ],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: [],
  recommendedAnimations: ['fade-in'],
  recommendedThemes: ['hero-minimal-overlay'],
  aiHints: {
    mood: ['minimal', 'classic', 'elegant'],
    style: ['center-aligned', 'serif-title', 'wide-letterSpacing'],
    useCase: ['미니멀 청첩장', '클래식한 웨딩'],
  },
}
