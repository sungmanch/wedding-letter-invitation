/**
 * Hero Block - Hipster Preset
 *
 * 힙스터 스타일 - 좌측 정렬의 대담한 타이포그래피
 * - 좌측 하단 텍스트 배치
 * - KBL Jump Extended 폰트
 * - 레드 포인트 컬러 (#E53935)
 * - 배경 이미지 필터 없음
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

// 포인트 컬러
const ACCENT_COLOR = '#E53935'

// 폰트 설정
const FONT_FAMILY = "'KBL Jump Extended', 'Apple SD Gothic Neo', sans-serif"

const ELEMENTS: PresetElement[] = [
  // 배경 이미지 (필터 없음)
  {
    id: 'main-image',
    type: 'image',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: 0,
    binding: 'photos.main',
    props: { type: 'image', objectFit: 'cover', fallbackSrc: '/examples/wedding_images/new_asset_3.png' },
  },
  // 커플 이름 (좌측 하단, 작은 크기)
  {
    id: 'couple-names',
    type: 'text',
    x: 5,
    y: 55,
    width: 90,
    height: 4,
    zIndex: 2,
    props: {
      type: 'text',
      format: '{couple.bride.nameEn}, {couple.groom.nameEn}',
    },
    style: {
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 11,
        fontWeight: 800,
        color: ACCENT_COLOR,
        textAlign: 'left',
        letterSpacing: '0.25em',
      },
    },
  },
  // 메인 타이틀 "WE'RE GETTING MARRIED" (3줄)
  {
    id: 'hero-title',
    type: 'text',
    x: 5,
    y: 59,
    width: 90,
    height: 25,
    zIndex: 2,
    value: "WE'RE\nGETTING\nMARRIED",
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 36,
        fontWeight: 800,
        color: ACCENT_COLOR,
        textAlign: 'left',
        lineHeight: 1.2,
        letterSpacing: '0.25em',
      },
    },
  },
  // 날짜 (YYYY.MM.DD 형식)
  {
    id: 'wedding-date',
    type: 'text',
    x: 5,
    y: 85,
    width: 90,
    height: 4,
    zIndex: 2,
    binding: 'wedding.dateDot',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 16,
        fontWeight: 800,
        color: ACCENT_COLOR,
        textAlign: 'left',
        letterSpacing: '0.25em',
      },
    },
  },
  // 시간 (요일 + 시간)
  {
    id: 'wedding-time',
    type: 'text',
    x: 5,
    y: 89,
    width: 90,
    height: 4,
    zIndex: 2,
    props: {
      type: 'text',
      format: '({wedding.weekdayEn}) {wedding.timeDisplayEn}',
    },
    style: {
      text: {
        fontFamily: FONT_FAMILY,
        fontSize: 16,
        fontWeight: 800,
        color: ACCENT_COLOR,
        textAlign: 'left',
        letterSpacing: '0.25em',
      },
    },
  },
]

export const HERO_HIPSTER: BlockPreset = {
  id: 'hero-hipster',
  blockType: 'hero',
  variant: 'hipster',
  name: 'Hipster Style',
  nameKo: '힙스터 스타일',
  description: '좌측 정렬의 대담한 타이포그래피. 레드 포인트 컬러와 KBL Jump Extended 폰트',
  tags: ['hipster', 'bold', 'left-aligned', 'red', 'urban', 'absolute'],
  complexity: 'medium',
  bindings: [
    'photos.main',
    'couple.bride.nameEn',
    'couple.groom.nameEn',
    'wedding.dateDot',
    'wedding.weekdayEn',
    'wedding.timeDisplayEn',
  ],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: ['kbl-jump-extended-font', 'left-aligned-typography'],
  recommendedAnimations: ['fade-in', 'slide-left'],
  recommendedThemes: ['hero-hipster'],
  aiHints: {
    mood: ['hipster', 'urban', 'bold', 'trendy'],
    style: ['left-aligned', 'red-accent', 'extended-sans-serif'],
    useCase: ['트렌디한 청첩장', '힙한 웨딩', '모던 캐주얼'],
  },
}
