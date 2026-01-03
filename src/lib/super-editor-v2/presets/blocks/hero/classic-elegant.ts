/**
 * Hero Block - Classic Elegant Preset (unique1 기반)
 *
 * 우아하고 고전적인 스타일
 * - 상단: "Our Wedding Day" (스크립트 폰트)
 * - 중앙: 세로로 긴 메인 사진
 * - 하단: 신랑 · 신부 이름
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 배경색 (흰색)
  {
    id: 'background',
    type: 'shape',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: 0,
    props: { type: 'shape', shape: 'rectangle' },
    style: { background: '#FFFFFF' },
  },
  // "Our" 제목 (Great Vibes)
  {
    id: 'title-our',
    type: 'text',
    x: 0,
    y: 4,
    width: 100,
    height: 5,
    zIndex: 2,
    value: 'Our',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Great Vibes', cursive",
        fontSize: 36,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
  // "Wedding" 제목 (Great Vibes)
  {
    id: 'title-wedding',
    type: 'text',
    x: 0,
    y: 8,
    width: 100,
    height: 6,
    zIndex: 2,
    value: 'Wedding',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Great Vibes', cursive",
        fontSize: 48,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
  // "Day" 제목 (Great Vibes)
  {
    id: 'title-day',
    type: 'text',
    x: 0,
    y: 14,
    width: 100,
    height: 5,
    zIndex: 2,
    value: 'Day',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Great Vibes', cursive",
        fontSize: 36,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
  // 날짜 표시 (Great Vibes)
  {
    id: 'wedding-date',
    type: 'text',
    x: 0,
    y: 21,
    width: 100,
    height: 4,
    zIndex: 2,
    binding: 'wedding.date',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Great Vibes', cursive",
        fontSize: 18,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
  // 메인 사진 (세로로 긴 카드)
  {
    id: 'main-image',
    type: 'image',
    x: 10,
    y: 27,
    width: 80,
    height: 58,
    zIndex: 1,
    binding: 'photos.main',
    props: { type: 'image', objectFit: 'cover' },
  },
  // 신랑 이름 (Calistoga)
  {
    id: 'groom-name',
    type: 'text',
    x: 0,
    y: 88,
    width: 45,
    height: 6,
    zIndex: 2,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Calistoga', serif",
        fontSize: 16,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'right',
        letterSpacing: 1,
      },
    },
  },
  // 구분자 (Calistoga)
  {
    id: 'separator',
    type: 'text',
    x: 45,
    y: 88,
    width: 10,
    height: 6,
    zIndex: 2,
    value: '·',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Calistoga', serif",
        fontSize: 16,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
  // 신부 이름 (Calistoga)
  {
    id: 'bride-name',
    type: 'text',
    x: 55,
    y: 88,
    width: 45,
    height: 6,
    zIndex: 2,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Calistoga', serif",
        fontSize: 16,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'left',
        letterSpacing: 1,
      },
    },
  },
]

export const HERO_CLASSIC_ELEGANT: BlockPreset = {
  id: 'hero-classic-elegant',
  blockType: 'hero',
  variant: 'classic-elegant',
  name: 'Classic Elegant',
  nameKo: '클래식 엘레강스',
  description: '우아하고 고전적인 스타일. 스크립트 폰트 제목과 세로 카드형 사진',
  tags: ['classic', 'elegant', 'script-font', 'card-photo', 'absolute'],
  complexity: 'medium',
  bindings: [
    'photos.main',
    'couple.groom.name',
    'couple.bride.name',
    'wedding.date',
  ],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: ['script-title'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['classic-ivory', 'romantic-blush'],
  aiHints: {
    mood: ['elegant', 'classic', 'timeless'],
    style: ['card-photo', 'script-font', 'vertical-layout'],
    useCase: ['전통적인 청첩장', '우아한 웨딩'],
  },
}
