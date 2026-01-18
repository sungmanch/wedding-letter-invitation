/**
 * Hero Block - Soccer Style Preset
 *
 * 어두운 배경에 손글씨 스타일의 친근한 캐주얼 무드
 * - 축구장 콘셉트 웨딩에 적합
 * - 중앙 정렬, 손글씨 폰트
 * - 이름 사이 핑크 하트
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 배경 이미지
  {
    id: 'main-image',
    type: 'image',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: 0,
    binding: 'photos.main',
    props: { type: 'image', objectFit: 'cover', fallbackSrc: '/examples/wedding_images/new_asset_5.png' },
  },
  // "welcome to" 텍스트
  {
    id: 'welcome-text',
    type: 'text',
    x: 10,
    y: 8,
    width: 80,
    height: 5,
    zIndex: 2,
    value: 'welcome to',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Swanky and Moo Moo', cursive",
        fontSize: 22,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: '.25em',
      },
    },
  },
  // "Wedding day!" 텍스트
  {
    id: 'wedding-day-text',
    type: 'text',
    x: 5,
    y: 11,
    width: 90,
    height: 8,
    zIndex: 2,
    value: 'Wedding day!',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Swanky and Moo Moo', cursive",
        fontSize: 38,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: '.25em',
      },
    },
  },
  // 신부 이름 (좌측) - 하트 기준 우측 정렬
  {
    id: 'bride-name',
    type: 'text',
    x: 0,
    y: 26,
    width: 47,
    height: 5,
    zIndex: 2,
    binding: 'couple.bride.nameEn',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Swanky and Moo Moo', cursive",
        fontSize: 19,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'right',
        letterSpacing: '.25em',
      },
    },
  },
  // 하트 아이콘 (중앙)
  {
    id: 'heart-icon',
    type: 'text',
    x: 47,
    y: 26,
    width: 6,
    height: 5,
    zIndex: 2,
    value: '♥',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Gangwon Edu Hyunok', sans-serif",
        fontSize: 19,
        fontWeight: 400,
        color: '#FF6B8A',
        textAlign: 'center',
      },
    },
  },
  // 신랑 이름 (우측) - 하트 기준 좌측 정렬 (letter-spacing 보정 +2%)
  {
    id: 'groom-name',
    type: 'text',
    x: 55,
    y: 26,
    width: 45,
    height: 5,
    zIndex: 2,
    binding: 'couple.groom.nameEn',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Swanky and Moo Moo', cursive",
        fontSize: 19,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'left',
        letterSpacing: '.25em',
      },
    },
  },
  // 날짜 (큰 글씨)
  {
    id: 'wedding-date',
    type: 'text',
    x: 10,
    y: 78,
    width: 80,
    height: 8,
    zIndex: 2,
    binding: 'wedding.dateDot',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'KBL Jump Extended', sans-serif",
        fontSize: 24,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: '.25em',
      },
    },
  },
  // 시간
  {
    id: 'wedding-time',
    type: 'text',
    x: 10,
    y: 86,
    width: 80,
    height: 5,
    zIndex: 2,
    binding: 'wedding.timeDisplay',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'KBL Jump Extended', sans-serif",
        fontSize: 20,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: '.25em',
      },
    },
  },
]

export const HERO_SOCCER_STYLE: BlockPreset = {
  id: 'hero-soccer-style',
  blockType: 'hero',
  variant: 'soccer-style',
  name: 'Soccer Style',
  nameKo: '축구장 스타일',
  description: '어두운 배경에 손글씨 스타일의 친근한 캐주얼 무드. 축구장 콘셉트 웨딩에 적합',
  tags: ['dark', 'casual', 'handwritten', 'sports', 'playful', 'absolute'],
  complexity: 'low',
  bindings: [
    'photos.main',
    'couple.bride.nameEn',
    'couple.groom.nameEn',
    'wedding.dateDot',
    'wedding.timeDisplay',
  ],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: ['heart-icon', 'handwritten-text'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['hero-dark-romantic'],
  aiHints: {
    mood: ['casual', 'playful', 'friendly'],
    style: ['center-aligned', 'handwritten', 'dark-background'],
    useCase: ['스포츠 콘셉트 웨딩', '야외 웨딩', '캐주얼 청첩장'],
  },
}
