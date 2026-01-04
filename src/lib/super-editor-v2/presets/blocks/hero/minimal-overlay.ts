/**
 * Hero Block - Minimal Overlay Preset (unique3 기반)
 *
 * 깔끔하고 현대적인 디자인
 * - 전체 화면 배경 이미지
 * - 반투명 카드 오버레이 (70% 투명도)
 * - Auto Layout 그룹: 왼쪽 정렬 텍스트 + padding
 * - "We're getting married" + 날짜 (YYYY.MM.DD) + 이름
 * - 폰트: Inknut Antiqua (Google Fonts 세리프)
 */

import type { BlockPreset, PresetElement } from '../types'
import { HERO_HEIGHT } from './_shared'

// 공통 폰트 설정
const FONT_FAMILY = "'Inknut Antiqua', serif"

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
  // 반투명 카드 오버레이 + Auto Layout 그룹
  // absolute로 중앙 배치, 내부는 auto layout
  {
    id: 'overlay-card',
    type: 'group',
    x: 15,
    y: 30,
    width: 70,
    height: 40,
    zIndex: 1,
    props: {
      type: 'group',
      layout: {
        direction: 'vertical',
        gap: 72, // 6rem = 96px (제목과 하단 콘텐츠 사이)
        alignItems: 'start',
        justifyContent: 'space-between',
      },
    },
    style: {
      background: 'rgba(255, 255, 255, 0.50)',  // 50% 투명도
      padding: { top: 32, right: 32, bottom: 32, left: 32 }, // 2rem = 32px
    },
    children: [
      // "We're getting married" - 왼쪽 정렬, 하단 margin 6rem
      {
        id: 'title',
        type: 'text',
        zIndex: 1,
        layoutMode: 'auto',
        sizing: {
          width: { type: 'fill' },
          height: { type: 'hug' },
        },
        value: "We're getting\nmarried",
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: FONT_FAMILY,
            fontSize: 24,  // 1.5rem = 24px
            fontWeight: 700,
            color: '#1A1A1A',
            textAlign: 'left',
            lineHeight: 1.3,
          },
        },
      },
      // 하단 콘텐츠 그룹 (divider + 날짜 + 이름) - gap 1rem
      {
        id: 'bottom-content',
        type: 'group',
        zIndex: 1,
        layoutMode: 'auto',
        sizing: {
          width: { type: 'fill' },
          height: { type: 'hug' },
        },
        props: {
          type: 'group',
          layout: {
            direction: 'vertical',
            gap: 16, // 1rem = 16px
            alignItems: 'start',
          },
        },
        children: [
          // 구분선 (1px 고정 높이, 전체 너비)
          {
            id: 'divider-line',
            type: 'divider',
            zIndex: 1,
            layoutMode: 'auto',
            sizing: {
              width: { type: 'fill' },
              height: { type: 'fixed', value: 1 },
            },
            props: { type: 'divider', dividerStyle: 'solid' },
            style: { background: '#1A1A1A' },
          },
          // 날짜 (YYYY.MM.DD 형식) - 왼쪽 정렬
          {
            id: 'wedding-date',
            type: 'text',
            zIndex: 1,
            layoutMode: 'auto',
            sizing: {
              width: { type: 'hug' },
              height: { type: 'hug' },
            },
            binding: 'wedding.dateDot',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: FONT_FAMILY,
                fontSize: 19,
                fontWeight: 400,
                color: '#1A1A1A',
                textAlign: 'left',
              },
            },
          },
          // 이름 행 (가로 배치)
          {
            id: 'names-row',
            type: 'group',
            zIndex: 1,
            layoutMode: 'auto',
            sizing: {
              width: { type: 'hug' },
              height: { type: 'hug' },
            },
            props: {
              type: 'group',
              layout: {
                direction: 'horizontal',
                gap: 16, // 1rem
                alignItems: 'center',
              },
            },
            children: [
              // 신랑 이름 (영어 우선, 없으면 한글)
              {
                id: 'groom-name',
                type: 'text',
                zIndex: 1,
                layoutMode: 'auto',
                sizing: {
                  width: { type: 'hug' },
                  height: { type: 'hug' },
                },
                binding: 'couple.groom.nameEn',
                bindingFallback: 'couple.groom.name',
                props: { type: 'text' },
                style: {
                  text: {
                    fontFamily: FONT_FAMILY,
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#1A1A1A',
                  },
                },
              },
              // 구분자
              {
                id: 'separator',
                type: 'text',
                zIndex: 1,
                layoutMode: 'auto',
                sizing: {
                  width: { type: 'hug' },
                  height: { type: 'hug' },
                },
                value: '·',
                props: { type: 'text' },
                style: {
                  text: {
                    fontFamily: FONT_FAMILY,
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#1A1A1A',
                  },
                },
              },
              // 신부 이름 (영어 우선, 없으면 한글)
              {
                id: 'bride-name',
                type: 'text',
                zIndex: 1,
                layoutMode: 'auto',
                sizing: {
                  width: { type: 'hug' },
                  height: { type: 'hug' },
                },
                binding: 'couple.bride.nameEn',
                bindingFallback: 'couple.bride.name',
                props: { type: 'text' },
                style: {
                  text: {
                    fontFamily: FONT_FAMILY,
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#1A1A1A',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
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
  bindings: ['photos.main', 'couple.groom.nameEn', 'couple.groom.name', 'couple.bride.nameEn', 'couple.bride.name', 'wedding.dateDot'],
  defaultHeight: HERO_HEIGHT,
  layout: undefined,
  defaultElements: ELEMENTS,
  specialComponents: ['overlay-card', 'divider-line'],
  recommendedAnimations: ['fade-in', 'zoom-in'],
  recommendedThemes: ['hero-minimal-overlay'],
  aiHints: {
    mood: ['minimal', 'modern', 'clean'],
    style: ['fullscreen-photo', 'overlay-card', 'serif-font'],
    useCase: ['미니멀 청첩장', '현대적 웨딩'],
  },
}
