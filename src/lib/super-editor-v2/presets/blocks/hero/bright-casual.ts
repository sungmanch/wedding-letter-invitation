/**
 * Hero Block - Bright Casual Preset (unique5 기반)
 *
 * 화사하고 밝은 느낌
 * - 큰 월/일 숫자 (Bangers 폰트)
 * - "We are getting married" (브러쉬 스크립트)
 * - 파란색 포인트
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT, OVERLAY_TEXT_SHADOW } from './_shared'

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
    props: { type: 'image', objectFit: 'cover' },
  },
  // 날짜 (MM\nDD 형식)
  {
    id: 'date-number',
    type: 'text',
    x: 0,
    y: 10, // +5% top padding
    width: 100,
    height: 25,
    zIndex: 1,
    binding: 'wedding.date',
    props: { type: 'text', format: '{wedding.month}\n{wedding.day}' },
    style: {
      text: {
        fontFamily: "'Bangers', cursive",
        fontSize: 150,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 0.8, // 120px / 150px
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // "We are getting married" (Great Vibes 스크립트, 12.79도 회전)
  {
    id: 'title',
    type: 'text',
    x: 0,
    y: 34, // 21 + 10% padding + 3% extra
    width: 100,
    height: 20,
    zIndex: 2,
    rotation: -12.79,
    value: 'We are\ngetting\nmarried',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Great Vibes', cursive",
        fontSize: 80,
        fontWeight: 400,
        color: '#0047AB',
        textAlign: 'center',
        lineHeight: 0.925, // 74px / 80px
        letterSpacing: 4, // 5% of 80px
      },
    },
  },
  // 신랑 이름 (좌측 하단)
  {
    id: 'groom-name',
    type: 'text',
    x: 5,
    y: 90,
    width: 30,
    height: 5,
    zIndex: 2,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 19,
        fontWeight: 500,
        color: '#FFFFFF',
        textAlign: 'left',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
  // 신부 이름 (우측 하단)
  {
    id: 'bride-name',
    type: 'text',
    x: 65,
    y: 90,
    width: 30,
    height: 5,
    zIndex: 2,
    binding: 'couple.bride.name',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'Pretendard', sans-serif",
        fontSize: 19,
        fontWeight: 500,
        color: '#FFFFFF',
        textAlign: 'right',
        textShadow: OVERLAY_TEXT_SHADOW,
      },
    },
  },
]

export const HERO_BRIGHT_CASUAL: BlockPreset = {
  id: 'hero-bright-casual',
  blockType: 'hero',
  variant: 'bright-casual',
  name: 'Bright Casual',
  nameKo: '브라이트 캐주얼',
  description: '화사하고 밝은 느낌. 큰 숫자와 브러쉬 스크립트 폰트',
  tags: ['bright', 'casual', 'bold-numbers', 'brush-script', 'absolute'],
  complexity: 'high',
  bindings: ['photos.main', 'couple.groom.name', 'couple.bride.name', 'wedding.date'],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: ['bold-date-numbers', 'brush-script'],
  recommendedAnimations: ['fade-in', 'bounce'],
  recommendedThemes: ['alice-blue', 'bright-casual'],
  aiHints: {
    mood: ['bright', 'casual', 'fun'],
    style: ['bold-typography', 'blue-accent', 'brush-script'],
    useCase: ['화사한 청첩장', '젊은 커플 웨딩'],
  },
}
