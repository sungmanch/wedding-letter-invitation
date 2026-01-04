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

// 포인트 컬러
const ACCENT_COLOR = '#EF90CB'

// 요소 간 간격
const GAP = 0 // vh

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
  // 신랑 이름 (y=35, height=3)
  {
    id: 'groom-name',
    type: 'text',
    x: 0,
    y: 35,
    width: 45,
    height: 3,
    zIndex: 2,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        color: ACCENT_COLOR,
        textAlign: 'right',
        letterSpacing: -0.72, // -4%
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
    height: 3,
    zIndex: 2,
    value: '•',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        color: ACCENT_COLOR,
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
    height: 3,
    zIndex: 2,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        color: ACCENT_COLOR,
        textAlign: 'left',
        letterSpacing: -0.72, // -4%
      },
    },
  },
  // "The Wedding Day" 타이틀 (3줄) - 이름 끝(38) + GAP(0) = 38
  {
    id: 'title',
    type: 'text',
    x: 0,
    y: 38,
    width: 100,
    height: 22,
    zIndex: 2,
    value: 'The\nWedding\nDay',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Alata', sans-serif",
        fontSize: 60,
        fontWeight: 400,
        color: ACCENT_COLOR,
        textAlign: 'center',
        lineHeight: 0.83, // 50px at 60px font
        letterSpacing: -2.4, // -4%
      },
    },
  },
  // 날짜 (YYYY.MM.DD 형식) - 타이틀 끝(60) + 1vh = 61
  {
    id: 'wedding-date',
    type: 'text',
    x: 0,
    y: 61,
    width: 100,
    height: 4,
    zIndex: 2,
    binding: 'wedding.dateDot',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Alata', sans-serif",
        fontSize: 19,
        fontWeight: 400,
        color: ACCENT_COLOR,
        textAlign: 'center',
        letterSpacing: -0.76, // -4%
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
    'wedding.dateDot',
  ],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: ['grayscale-filter', 'bold-typography'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['hero-monochrome-bold'],
  aiHints: {
    mood: ['modern', 'urban', 'bold'],
    style: ['grayscale', 'hot-pink-accent', 'bold-sans-serif'],
    useCase: ['모던 청첩장', '도시적 감성 웨딩'],
  },
}
