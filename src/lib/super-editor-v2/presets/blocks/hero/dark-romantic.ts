/**
 * Hero Block - Dark Romantic Preset (unique4 기반)
 *
 * 세련되고 시크한 무드
 * - 어두운 배경 이미지 (오버레이)
 * - 좌측 정렬 "The Wedding Day" 타이틀
 * - 핑크 포인트 컬러
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 배경 이미지 (어둡게)
  {
    id: 'main-image',
    type: 'image',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: 0,
    binding: 'photos.main',
    props: { type: 'image', objectFit: 'cover', overlay: 'rgba(0,0,0,0.2)' },
  },
  // 신랑 이름 (좌측 상단)
  {
    id: 'groom-name',
    type: 'text',
    x: 8,
    y: 5,
    width: 30,
    height: 5,
    zIndex: 2,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 19,
        fontWeight: 600,
        color: '#EC8A87',
        textAlign: 'left',
      },
    },
  },
  // 신부 이름 (우측 상단)
  {
    id: 'bride-name',
    type: 'text',
    x: 62,
    y: 5,
    width: 30,
    height: 5,
    zIndex: 2,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 19,
        fontWeight: 600,
        color: '#EC8A87',
        textAlign: 'right',
      },
    },
  },
  // "The" (좌측 정렬)
  {
    id: 'title-the',
    type: 'text',
    x: 8,
    y: 55,
    width: 50,
    height: 8,
    zIndex: 2,
    value: 'The',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Kodchasan', sans-serif",
        fontSize: 64,
        fontWeight: 400,
        color: '#EC8A87',
        textAlign: 'left',
        lineHeight: 66,
        letterSpacing: -3.2, // -5% of 64px
      },
    },
  },
  // "Wedding"
  {
    id: 'title-wedding',
    type: 'text',
    x: 8,
    y: 63,
    width: 60,
    height: 8,
    zIndex: 2,
    value: 'Wedding',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Kodchasan', sans-serif",
        fontSize: 64,
        fontWeight: 400,
        color: '#EC8A87',
        textAlign: 'left',
        lineHeight: 66,
        letterSpacing: -3.2, // -5% of 64px
      },
    },
  },
  // "Day"
  {
    id: 'title-day',
    type: 'text',
    x: 8,
    y: 71,
    width: 50,
    height: 8,
    zIndex: 2,
    value: 'Day',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Kodchasan', sans-serif",
        fontSize: 64,
        fontWeight: 400,
        color: '#EC8A87',
        textAlign: 'left',
        lineHeight: 66,
        letterSpacing: -3.2, // -5% of 64px
      },
    },
  },
  // 날짜
  {
    id: 'wedding-date',
    type: 'text',
    x: 8,
    y: 82,
    width: 50,
    height: 8,
    zIndex: 2,
    binding: 'wedding.dateMonthDay',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Kodchasan', sans-serif",
        fontSize: 48,
        fontWeight: 400,
        color: '#EC8A87',
        textAlign: 'left',
      },
    },
  },
]

export const HERO_DARK_ROMANTIC: BlockPreset = {
  id: 'hero-dark-romantic',
  blockType: 'hero',
  variant: 'dark-romantic',
  name: 'Dark Romantic',
  nameKo: '다크 로맨틱',
  description: '세련되고 시크한 무드. 어두운 배경에 핑크 포인트 컬러',
  tags: ['dark', 'romantic', 'chic', 'pink-accent', 'absolute'],
  complexity: 'medium',
  bindings: [
    'photos.main',
    'couple.groom.name',
    'couple.bride.name',
    'wedding.dateMonthDay',
  ],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: ['dark-overlay', 'left-aligned-title'],
  recommendedAnimations: ['fade-in', 'slide-left'],
  recommendedThemes: ['hero-dark-romantic'],
  aiHints: {
    mood: ['dark', 'romantic', 'chic'],
    style: ['left-aligned', 'pink-accent', 'bold-typography'],
    useCase: ['시크한 청첩장', '다크 무드 웨딩'],
  },
}
