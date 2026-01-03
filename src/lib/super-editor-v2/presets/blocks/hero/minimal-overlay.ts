/**
 * Hero Block - Minimal Overlay Preset (unique3 기반)
 *
 * 깔끔하고 현대적인 디자인
 * - 전체 화면 배경 이미지
 * - 반투명 카드 오버레이
 * - "We're getting married" + 날짜 + 이름
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 배경 이미지 (전체)
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
  // 반투명 카드 오버레이
  {
    id: 'overlay-card',
    type: 'shape',
    x: 15,
    y: 30,
    width: 70,
    height: 40,
    zIndex: 1,
    props: { type: 'shape', shape: 'rectangle' },
    style: { background: 'rgba(255, 255, 255, 0.65)' },
  },
  // "We're getting married"
  {
    id: 'title',
    type: 'text',
    x: 20,
    y: 35,
    width: 60,
    height: 10,
    zIndex: 2,
    value: "We're getting\nmarried",
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Nanum Myeongjo', serif",
        fontSize: 29,
        fontWeight: 700,
        color: '#1A1A1A',
        textAlign: 'center',
        lineHeight: 1.2,
      },
    },
  },
  // 구분선
  {
    id: 'divider-line',
    type: 'shape',
    x: 25,
    y: 53,
    width: 50,
    height: 0.3,
    zIndex: 2,
    props: { type: 'shape', shape: 'rectangle' },
    style: { background: '#1A1A1A' },
  },
  // 날짜
  {
    id: 'wedding-date',
    type: 'text',
    x: 20,
    y: 56,
    width: 60,
    height: 5,
    zIndex: 2,
    binding: 'wedding.date',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Nanum Myeongjo', serif",
        fontSize: 19,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
  // 신랑 이름
  {
    id: 'groom-name',
    type: 'text',
    x: 20,
    y: 61,
    width: 25,
    height: 5,
    zIndex: 2,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Nanum Myeongjo', serif",
        fontSize: 16,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'right',
      },
    },
  },
  // 구분자
  {
    id: 'separator',
    type: 'text',
    x: 45,
    y: 61,
    width: 10,
    height: 5,
    zIndex: 2,
    value: '•',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Nanum Myeongjo', serif",
        fontSize: 16,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
  // 신부 이름
  {
    id: 'bride-name',
    type: 'text',
    x: 55,
    y: 61,
    width: 25,
    height: 5,
    zIndex: 2,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Nanum Myeongjo', serif",
        fontSize: 16,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'left',
      },
    },
  },
]

export const HERO_MINIMAL_OVERLAY: BlockPreset = {
  id: 'hero-minimal-overlay',
  blockType: 'hero',
  variant: 'minimal-overlay',
  name: 'Minimal Overlay',
  nameKo: '미니멀 오버레이',
  description: '전체 화면 사진 위에 반투명 카드 오버레이. 깔끔하고 현대적인 디자인',
  tags: ['minimal', 'modern', 'overlay', 'fullscreen', 'absolute'],
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
  specialComponents: ['overlay-card', 'divider-line'],
  recommendedAnimations: ['fade-in', 'zoom-in'],
  recommendedThemes: ['minimal-white', 'modern-clean'],
  aiHints: {
    mood: ['minimal', 'modern', 'clean'],
    style: ['fullscreen-photo', 'overlay-card', 'serif-font'],
    useCase: ['미니멀 청첩장', '현대적 웨딩'],
  },
}
