/**
 * Hero Block - Casual Playful Preset
 *
 * 로맨틱 워터마크 스타일
 * - 배경: "Love, Laughter, and Happily Ever After" 워터마크 반복
 * - 상단: "The Wedding Day" (The Nautigal)
 * - 중앙: 세로 카드형 메인 사진 (검정 테두리)
 * - 하단: 신랑/신부 한글이름 + 영문이름 (2줄), 세로 구분선
 * - 최하단: "YYYY.MM.DD Save The Date"
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

// 워터마크 텍스트 (배경 장식용)
const WATERMARK_TEXT = 'Love, Laughter, and Happily Ever After'
const WATERMARK_STYLE = {
  fontFamily: "'The Nautigal', cursive",
  fontSize: 24,
  fontWeight: 400,
  color: 'rgba(0, 0, 0, 0.08)',
  textAlign: 'center' as const,
  fontStyle: 'italic' as const,
}

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
  // 워터마크 텍스트들 (이미지 높이의 120%, 이미지 상하 10% 여백)
  // 이미지: y=17, height=52 → 범위 17~69%
  // 워터마크: 시작 12%, 끝 74% → 총 62% 범위, 11줄
  {
    id: 'watermark-1',
    type: 'text',
    x: -20,
    y: 12,
    width: 140,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  {
    id: 'watermark-2',
    type: 'text',
    x: -30,
    y: 18,
    width: 160,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  {
    id: 'watermark-3',
    type: 'text',
    x: -15,
    y: 24,
    width: 130,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  {
    id: 'watermark-4',
    type: 'text',
    x: -25,
    y: 30,
    width: 150,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  {
    id: 'watermark-5',
    type: 'text',
    x: -10,
    y: 36,
    width: 120,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  {
    id: 'watermark-6',
    type: 'text',
    x: -20,
    y: 42,
    width: 140,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  {
    id: 'watermark-7',
    type: 'text',
    x: -30,
    y: 48,
    width: 160,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  {
    id: 'watermark-8',
    type: 'text',
    x: -15,
    y: 54,
    width: 130,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  {
    id: 'watermark-9',
    type: 'text',
    x: -25,
    y: 60,
    width: 150,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  {
    id: 'watermark-10',
    type: 'text',
    x: -10,
    y: 66,
    width: 120,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  {
    id: 'watermark-11',
    type: 'text',
    x: -20,
    y: 72,
    width: 140,
    height: 4,
    zIndex: 0,
    value: `${WATERMARK_TEXT}   ${WATERMARK_TEXT}   ${WATERMARK_TEXT}`,
    props: { type: 'text' },
    style: { text: { ...WATERMARK_STYLE } },
  },
  // "The Wedding Day" 제목 (The Nautigal)
  {
    id: 'title',
    type: 'text',
    x: 0,
    y: 7,
    width: 100,
    height: 6,
    zIndex: 2,
    value: 'The Wedding Day',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'The Nautigal', cursive",
        fontSize: 36,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
      },
    },
  },
  // 메인 사진 (검정 테두리)
  {
    id: 'main-image',
    type: 'image',
    x: 10,
    y: 17,
    width: 80,
    height: 52,
    zIndex: 1,
    binding: 'photos.main',
    props: { type: 'image', objectFit: 'cover' },
    style: {
      border: { width: 1, color: '#1A1A1A', style: 'solid', radius: 0 },
    },
  },
  // 신랑 영문 이름 (The Nautigal) - 구분선 왼쪽, 우측 정렬
  {
    id: 'groom-name-en',
    type: 'text',
    x: 0,
    y: 75,
    width: 43,  // 구분선(50%) - 간격(7%)
    height: 8,
    zIndex: 2,
    binding: 'couple.groom.nameEn',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'The Nautigal', cursive",
        fontSize: 48,  // 3rem = 48px
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'right',  // 구분선 쪽으로 정렬
      },
    },
  },
  // 세로 구분선 - 정중앙 (height 절반, width ~1.25px)
  {
    id: 'divider-line',
    type: 'shape',
    x: 49.85,
    y: 75,
    width: 0.3,
    height: 6,
    zIndex: 2,
    props: { type: 'shape', shape: 'rectangle' },
    style: { background: '#CCCCCC' },
  },
  // 신부 영문 이름 (The Nautigal) - 구분선 오른쪽, 좌측 정렬
  {
    id: 'bride-name-en',
    type: 'text',
    x: 57,  // 구분선(50%) + 간격(7%)
    y: 75,
    width: 43,
    height: 8,
    zIndex: 2,
    binding: 'couple.bride.nameEn',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'The Nautigal', cursive",
        fontSize: 48,  // 3rem = 48px
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'left',  // 구분선 쪽으로 정렬
      },
    },
  },
  // 날짜 (YYYY.MM.DD 형식)
  {
    id: 'wedding-date',
    type: 'text',
    x: 0,
    y: 91,
    width: 50,
    height: 5,
    zIndex: 2,
    binding: 'wedding.dateDot',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'The Nautigal', cursive",
        fontSize: 24,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'right',
        letterSpacing: 2,
      },
    },
  },
  // "Save The Date" 문구
  {
    id: 'save-the-date-text',
    type: 'text',
    x: 50,
    y: 91,
    width: 50,
    height: 5,
    zIndex: 2,
    value: ' Save The Date',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: "'The Nautigal', cursive",
        fontSize: 24,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'left',
        letterSpacing: 2,
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
  description:
    'Love, Laughter, and Happily Ever After 워터마크 배경에 The Nautigal 스크립트 폰트를 사용한 로맨틱 스타일',
  tags: [
    'casual',
    'romantic',
    'watermark',
    'save-the-date',
    'script-font',
    'absolute',
  ],
  complexity: 'medium',
  bindings: [
    'photos.main',
    'couple.groom.nameEn',
    'couple.bride.nameEn',
    'wedding.dateDot',
  ],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: ['script-title', 'save-the-date', 'watermark-background'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['hero-casual-playful'],
  aiHints: {
    mood: ['romantic', 'playful', 'bright'],
    style: ['watermark', 'save-the-date', 'card-photo', 'script-font'],
    useCase: ['로맨틱 청첩장', '밝은 분위기 웨딩'],
  },
}
