/**
 * Hero Block - Curtain Backdrop Preset
 *
 * 커튼 배경
 * - 배경: 커튼 텍스처 이미지
 * - 중앙: 세로로 긴 웨딩 사진
 * - 상단: "WEDDING" 타이틀 (손글씨 스타일)
 * - 중앙: 커플 이름
 * - 하단: 날짜
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 배경 이미지 (커튼 텍스처)
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
  // 메인 웨딩 사진 (세로 직사각형)
  {
    id: 'hero-photo',
    type: 'image',
    x: 12.5,
    y: 10,
    width: 75,
    height: 70,
    zIndex: 1,
    binding: 'couple.photo',
    props: { type: 'image', objectFit: 'cover' },
  },
  // "WEDDING" 타이틀
  {
    id: 'hero-title',
    type: 'text',
    x: 15,
    y: 17,
    width: 70,
    height: 6,
    zIndex: 2,
    value: 'WEDDING',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-display)',
        fontSize: 32,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.3,
      },
    },
  },
  // 커플 이름
  {
    id: 'hero-names',
    type: 'text',
    x: 20,
    y: 42,
    width: 60,
    height: 5,
    zIndex: 2,
    props: {
      type: 'text',
      format: '{groom.name}, {bride.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.15,
      },
    },
  },
  // 날짜
  {
    id: 'hero-date',
    type: 'text',
    x: 20,
    y: 85,
    width: 60,
    height: 5,
    zIndex: 2,
    binding: 'wedding.dateDot',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-display)',
        fontSize: 24,
        fontWeight: 400,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.1,
      },
    },
  },
]

export const HERO_CURTAIN_BACKDROP: BlockPreset = {
  id: 'hero-curtain-backdrop',
  blockType: 'hero',
  variant: 'curtain-backdrop',
  name: 'Curtain Backdrop',
  nameKo: '커튼 배경',
  description: '커튼 텍스처 배경 위에 세로 사진을 중앙 배치하는 2-layer 구조',
  tags: ['curtain', 'layered', 'portrait', 'handwritten', 'dark', 'absolute'],
  complexity: 'medium',
  bindings: [
    'photos.main',
    'couple.photo',
    'couple.groom.name',
    'couple.bride.name',
    'wedding.dateDot',
  ],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: [],
  recommendedAnimations: ['fade-in'],
  recommendedThemes: ['modern-mono'],
  aiHints: {
    mood: ['modern', 'elegant', 'dramatic'],
    style: ['2-layer', 'curtain-texture', 'portrait-photo', 'handwritten-font'],
    useCase: ['스튜디오 촬영 청첩장', '모던한 웨딩'],
  },
}
