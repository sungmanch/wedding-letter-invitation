/**
 * Hero Block - Casual Playful Preset (unique2 기반)
 *
 * 밝고 경쾌한 분위기
 * - 상단: "The Wedding Day" (스크립트)
 * - 중앙: 세로 카드형 메인 사진
 * - 하단: 신랑/신부 이름 + "Save The Date"
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 배경색
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
  // "The Wedding Day" 제목
  {
    id: 'title',
    type: 'text',
    x: 0,
    y: 6,
    width: 100,
    height: 8,
    zIndex: 2,
    value: 'The Wedding Day',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Great Vibes', cursive",
        fontSize: 32,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
  // 메인 사진
  {
    id: 'main-image',
    type: 'image',
    x: 10,
    y: 18,
    width: 80,
    height: 55,
    zIndex: 1,
    binding: 'photos.main',
    props: { type: 'image', objectFit: 'cover' },
  },
  // 신랑 이름
  {
    id: 'groom-name',
    type: 'text',
    x: 0,
    y: 76,
    width: 45,
    height: 5,
    zIndex: 2,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Noto Serif KR', serif",
        fontSize: 16,
        fontWeight: 400,
        color: '#333333',
        textAlign: 'right',
      },
    },
  },
  // 구분 공백/구분자
  {
    id: 'separator',
    type: 'text',
    x: 45,
    y: 76,
    width: 10,
    height: 5,
    zIndex: 2,
    value: '',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Noto Serif KR', serif",
        fontSize: 16,
        color: '#333333',
        textAlign: 'center',
      },
    },
  },
  // 신부 이름
  {
    id: 'bride-name',
    type: 'text',
    x: 55,
    y: 76,
    width: 45,
    height: 5,
    zIndex: 2,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Noto Serif KR', serif",
        fontSize: 16,
        fontWeight: 400,
        color: '#333333',
        textAlign: 'left',
      },
    },
  },
  // 영문 구분자 (|)
  {
    id: 'divider',
    type: 'text',
    x: 0,
    y: 80,
    width: 100,
    height: 10,
    zIndex: 2,
    value: '|',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Great Vibes', cursive",
        fontSize: 40,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
  // Save The Date
  {
    id: 'save-the-date',
    type: 'text',
    x: 0,
    y: 93,
    width: 100,
    height: 5,
    zIndex: 2,
    binding: 'wedding.date',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Great Vibes', cursive",
        fontSize: 19,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
]

export const HERO_CASUAL_PLAYFUL: BlockPreset = {
  id: 'hero-casual-playful',
  blockType: 'hero',
  variant: 'casual-playful',
  name: 'Casual Playful',
  nameKo: '캐주얼 플레이풀',
  description: '밝고 경쾌한 분위기. Save The Date 스타일',
  tags: ['casual', 'playful', 'save-the-date', 'script-font', 'absolute'],
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
  specialComponents: ['script-title', 'save-the-date'],
  recommendedAnimations: ['fade-in', 'bounce'],
  recommendedThemes: ['casual-cream', 'floral-white'],
  aiHints: {
    mood: ['casual', 'playful', 'bright'],
    style: ['save-the-date', 'card-photo', 'script-font'],
    useCase: ['캐주얼 청첩장', '밝은 분위기 웨딩'],
  },
}
