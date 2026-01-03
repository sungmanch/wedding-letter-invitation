/**
 * Hero Block - Monochrome Bold Preset (unique6 기반)
 *
 * 모던하고 도시적인 감성
 * - 흑백 필터 배경 이미지
 * - 중앙 "The Wedding Day" 볼드 타이틀
 * - 핫핑크 포인트 컬러
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 배경 이미지 (흑백 필터)
  {
    id: 'main-image',
    type: 'image',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: 0,
    binding: 'photos.main',
    props: { type: 'image', objectFit: 'cover', filter: 'grayscale(100%) brightness(0.9)' },
  },
  // 신랑 이름
  {
    id: 'groom-name',
    type: 'text',
    x: 0,
    y: 35,
    width: 45,
    height: 5,
    zIndex: 2,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Nanum Square', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        color: '#FF69B4',
        textAlign: 'right',
      },
    },
  },
  // 구분자
  {
    id: 'separator',
    type: 'text',
    x: 45,
    y: 35,
    width: 10,
    height: 5,
    zIndex: 2,
    value: '•',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Nanum Square', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        color: '#FF69B4',
        textAlign: 'center',
      },
    },
  },
  // 신부 이름
  {
    id: 'bride-name',
    type: 'text',
    x: 55,
    y: 35,
    width: 45,
    height: 5,
    zIndex: 2,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Nanum Square', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        color: '#FF69B4',
        textAlign: 'left',
      },
    },
  },
  // "The Wedding Day" 타이틀 (3줄)
  {
    id: 'title',
    type: 'text',
    x: 0,
    y: 40,
    width: 100,
    height: 25,
    zIndex: 2,
    value: 'The\nWedding\nDay',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 64,
        fontWeight: 700,
        color: '#FF69B4',
        textAlign: 'center',
        lineHeight: 1.1,
        letterSpacing: -1,
      },
    },
  },
  // 날짜
  {
    id: 'wedding-date',
    type: 'text',
    x: 0,
    y: 66,
    width: 100,
    height: 6,
    zIndex: 2,
    binding: 'wedding.date',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Nanum Square', sans-serif",
        fontSize: 19,
        fontWeight: 600,
        color: '#FF69B4',
        textAlign: 'center',
        letterSpacing: 1,
      },
    },
  },
]

export const HERO_MONOCHROME_BOLD: BlockPreset = {
  id: 'hero-monochrome-bold',
  blockType: 'hero',
  variant: 'monochrome-bold',
  name: 'Monochrome Bold',
  nameKo: '모노크롬 볼드',
  description: '모던하고 도시적인 감성. 흑백 사진에 핫핑크 포인트',
  tags: ['monochrome', 'bold', 'urban', 'hot-pink', 'absolute'],
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
  specialComponents: ['grayscale-filter', 'bold-typography'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['monochrome-pink', 'urban-chic'],
  aiHints: {
    mood: ['modern', 'urban', 'bold'],
    style: ['grayscale', 'hot-pink-accent', 'bold-sans-serif'],
    useCase: ['모던 청첩장', '도시적 감성 웨딩'],
  },
}
