/**
 * Template Catalog v2 - Editable Block Structures
 *
 * 템플릿을 정적 이미지가 아닌 편집 가능한 Block/Element 구조로 정의합니다.
 * 각 템플릿은 hero, greeting, gallery 등의 블록과 텍스트/이미지 요소를 포함합니다.
 */

import type { Block, BlockType, Element, VariablePath } from '../schema/types'
import type { TemplateMetadata } from '../schema/template-metadata'

/**
 * 템플릿 v2 인터페이스
 * - 기존 메타데이터 + 편집 가능한 Block 구조
 */
export interface TemplateV2 extends TemplateMetadata {
  /**
   * 템플릿의 블록 구조 (편집 가능)
   * - hero, greeting, calendar, gallery 등의 블록 포함
   * - 각 블록은 텍스트/이미지/도형 등의 요소를 포함
   */
  blockStructure: BlockTemplate[]

  /**
   * 편집 가능한 필드 매핑
   * - UI에서 자동으로 편집 폼 생성
   */
  editableFields: EditableFieldMap
}

/**
 * 블록 템플릿 (Block의 초기 구조)
 */
export interface BlockTemplate {
  type: BlockType
  enabled: boolean
  height: number // vh
  elements: ElementTemplate[]
}

/**
 * 요소 템플릿 (Element의 초기 구조)
 */
export interface ElementTemplate {
  type: 'text' | 'image' | 'shape' | 'button' | 'icon' | 'divider'
  x: number // vw
  y: number // vh (블록 내 상대 위치)
  width: number // vw
  height: number // vh
  zIndex: number
  binding?: VariablePath
  value?: string | number
  props: any
  style?: any
}

/**
 * 편집 가능한 필드 매핑
 */
export interface EditableFieldMap {
  [key: string]: {
    blockType: BlockType
    binding: VariablePath
    label: string
    description?: string
  }
}

// ============================================
// UNIQUE1: 클래식 엘레강스
// ============================================

/**
 * Unique1 템플릿의 블록 구조
 *
 * 디자인 분석 (unique1.png):
 * - 상단: "Our Wedding Day" (스크립트 폰트, 중앙 정렬)
 * - 날짜: "2026.05.23" (작은 폰트, 중앙)
 * - 메인 사진: 야외 커플 사진 (중앙, 카드 형식)
 * - 하단: "Sanghoon · Najin" (이름, 중앙)
 * - 배경: 흰색, 깔끔한 여백
 */
const UNIQUE1_BLOCK_STRUCTURE: BlockTemplate[] = [
  // ============================================
  // Hero Block: 메인 비주얼
  // ============================================
  {
    type: 'hero',
    enabled: true,
    height: 100, // 전체 화면
    elements: [
      // 배경색
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: {
          type: 'shape',
          shape: 'rectangle',
        },
        style: {
          backgroundColor: '#FFFFFF', // Secondary[0]
        },
      },

      // "Our Wedding Day" 제목
      {
        type: 'text',
        x: 0,
        y: 8,
        width: 100,
        height: 12,
        zIndex: 2,
        value: 'Our Wedding Day',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '3rem',
          fontWeight: 400,
          color: '#1A1A1A', // Primary[0]
          textAlign: 'center',
          lineHeight: 1.2,
        },
      },

      // 날짜 표시
      {
        type: 'text',
        x: 0,
        y: 22,
        width: 100,
        height: 6,
        zIndex: 2,
        binding: 'wedding.date',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '0.95rem',
          fontWeight: 400,
          color: '#8B7355', // Primary[1]
          textAlign: 'center',
          letterSpacing: '0.1em',
        },
      },

      // 메인 사진 (카드 형식)
      {
        type: 'image',
        x: 10,
        y: 32,
        width: 80,
        height: 45,
        zIndex: 1,
        binding: 'photos.main',
        props: {
          type: 'image',
          objectFit: 'cover',
        },
        style: {
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },

      // 신랑·신부 이름
      {
        type: 'text',
        x: 0,
        y: 82,
        width: 100,
        height: 8,
        zIndex: 2,
        value: '', // 동적으로 계산
        binding: 'couple.groom.name', // 임시 (나중에 포맷팅 로직 추가)
        props: {
          type: 'text',
          format: '{couple.groom.name} · {couple.bride.name}',
        },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.25rem',
          fontWeight: 400,
          color: '#1A1A1A', // Primary[0]
          textAlign: 'center',
          letterSpacing: '0.05em',
        },
      },
    ],
  },

  // ============================================
  // Greeting Block: 인사말
  // ============================================
  {
    type: 'greeting',
    enabled: true,
    height: 70,
    elements: [
      // 배경
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: {
          type: 'shape',
          shape: 'rectangle',
        },
        style: {
          backgroundColor: '#FAF8F5', // Secondary[2]
        },
      },

      // 인사말 제목
      {
        type: 'text',
        x: 10,
        y: 15,
        width: 80,
        height: 10,
        zIndex: 1,
        binding: 'greeting.title',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1A1A1A',
          textAlign: 'center',
          lineHeight: 1.6,
        },
      },

      // 인사말 본문
      {
        type: 'text',
        x: 10,
        y: 30,
        width: 80,
        height: 50,
        zIndex: 1,
        binding: 'greeting.content',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.95rem',
          fontWeight: 400,
          color: '#4A4A4A',
          textAlign: 'center',
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
        },
      },
    ],
  },

  // ============================================
  // Calendar Block: 날짜 정보
  // ============================================
  {
    type: 'calendar',
    enabled: true,
    height: 60,
    elements: [
      // 배경
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: {
          type: 'shape',
          shape: 'rectangle',
        },
        style: {
          backgroundColor: '#FFFFFF',
        },
      },

      // 날짜 표시 (큰 글씨)
      {
        type: 'text',
        x: 0,
        y: 20,
        width: 100,
        height: 12,
        zIndex: 1,
        binding: 'wedding.dateDisplay',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.75rem',
          fontWeight: 600,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },

      // 시간 표시
      {
        type: 'text',
        x: 0,
        y: 36,
        width: 100,
        height: 8,
        zIndex: 1,
        binding: 'wedding.timeDisplay',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.1rem',
          fontWeight: 400,
          color: '#8B7355',
          textAlign: 'center',
        },
      },

      // D-Day 카운터
      {
        type: 'text',
        x: 0,
        y: 50,
        width: 100,
        height: 8,
        zIndex: 1,
        binding: 'wedding.dday',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.9rem',
          fontWeight: 400,
          color: '#C9A962',
          textAlign: 'center',
        },
      },
    ],
  },

  // ============================================
  // Location Block: 예식장 정보
  // ============================================
  {
    type: 'location',
    enabled: true,
    height: 80,
    elements: [
      // 배경
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: {
          type: 'shape',
          shape: 'rectangle',
        },
        style: {
          backgroundColor: '#FAF8F5',
        },
      },

      // 섹션 제목
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: '오시는 길',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },

      // 예식장 이름
      {
        type: 'text',
        x: 10,
        y: 22,
        width: 80,
        height: 8,
        zIndex: 1,
        binding: 'venue.name',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },

      // 홀 이름
      {
        type: 'text',
        x: 10,
        y: 32,
        width: 80,
        height: 6,
        zIndex: 1,
        binding: 'venue.hall',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1rem',
          fontWeight: 400,
          color: '#8B7355',
          textAlign: 'center',
        },
      },

      // 주소
      {
        type: 'text',
        x: 10,
        y: 40,
        width: 80,
        height: 10,
        zIndex: 1,
        binding: 'venue.address',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.9rem',
          fontWeight: 400,
          color: '#4A4A4A',
          textAlign: 'center',
          lineHeight: 1.6,
        },
      },

      // 지도 (나중에 MapElement로 교체 가능)
      {
        type: 'text',
        x: 10,
        y: 55,
        width: 80,
        height: 20,
        zIndex: 1,
        value: '[지도]',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.85rem',
          color: '#999',
          textAlign: 'center',
        },
      },
    ],
  },

  // ============================================
  // Gallery Block: 포토 갤러리
  // ============================================
  {
    type: 'gallery',
    enabled: true,
    height: 100,
    elements: [
      // 배경
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: {
          type: 'shape',
          shape: 'rectangle',
        },
        style: {
          backgroundColor: '#FFFFFF',
        },
      },

      // 섹션 제목
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: '갤러리',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },

      // 갤러리 컨테이너 (실제로는 GalleryElement 컴포넌트로 렌더링)
      {
        type: 'text',
        x: 10,
        y: 22,
        width: 80,
        height: 70,
        zIndex: 1,
        binding: 'photos.gallery',
        value: '[갤러리 그리드]',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.85rem',
          color: '#999',
          textAlign: 'center',
        },
      },
    ],
  },

  // ============================================
  // Contact Block: 연락하기
  // ============================================
  {
    type: 'contact',
    enabled: true,
    height: 60,
    elements: [
      // 배경
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: {
          type: 'shape',
          shape: 'rectangle',
        },
        style: {
          backgroundColor: '#FAF8F5',
        },
      },

      // 섹션 제목
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: '연락하기',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },

      // 신랑측 연락처
      {
        type: 'text',
        x: 10,
        y: 25,
        width: 40,
        height: 30,
        zIndex: 1,
        binding: 'couple.groom.name',
        props: {
          type: 'text',
          format: '신랑 {couple.groom.name}\n{couple.groom.phone}',
        },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.95rem',
          fontWeight: 400,
          color: '#4A4A4A',
          textAlign: 'center',
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
        },
      },

      // 신부측 연락처
      {
        type: 'text',
        x: 50,
        y: 25,
        width: 40,
        height: 30,
        zIndex: 1,
        binding: 'couple.bride.name',
        props: {
          type: 'text',
          format: '신부 {couple.bride.name}\n{couple.bride.phone}',
        },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.95rem',
          fontWeight: 400,
          color: '#4A4A4A',
          textAlign: 'center',
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
        },
      },
    ],
  },
]

/**
 * Unique1 편집 가능한 필드 매핑
 */
const UNIQUE1_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: {
    blockType: 'hero',
    binding: 'photos.main',
    label: '메인 사진',
    description: '청첩장 메인 화면에 표시될 사진',
  },
  groomName: {
    blockType: 'hero',
    binding: 'couple.groom.name',
    label: '신랑 이름',
  },
  brideName: {
    blockType: 'hero',
    binding: 'couple.bride.name',
    label: '신부 이름',
  },
  weddingDate: {
    blockType: 'hero',
    binding: 'wedding.date',
    label: '예식 날짜',
  },
  greetingTitle: {
    blockType: 'greeting',
    binding: 'greeting.title',
    label: '인사말 제목',
  },
  greetingContent: {
    blockType: 'greeting',
    binding: 'greeting.content',
    label: '인사말 내용',
    description: '청첩장 인사말 본문',
  },
  venueName: {
    blockType: 'location',
    binding: 'venue.name',
    label: '예식장 이름',
  },
  venueHall: {
    blockType: 'location',
    binding: 'venue.hall',
    label: '예식장 홀 이름',
  },
  venueAddress: {
    blockType: 'location',
    binding: 'venue.address',
    label: '예식장 주소',
  },
  gallery: {
    blockType: 'gallery',
    binding: 'photos.gallery',
    label: '갤러리 사진',
    description: '청첩장에 표시될 웨딩 사진들',
  },
}

// ============================================
// 기존 템플릿 메타데이터 가져오기
// ============================================

import { TEMPLATE_CATALOG, getTemplateById } from './template-catalog'

/**
 * Unique1 템플릿 v2 (메타데이터 + Block 구조)
 */
export const UNIQUE1_TEMPLATE_V2: TemplateV2 = {
  // 기존 메타데이터 (template-catalog.ts에서 가져옴)
  ...(getTemplateById('unique1')!),

  // 새로운 Block 구조
  blockStructure: UNIQUE1_BLOCK_STRUCTURE,
  editableFields: UNIQUE1_EDITABLE_FIELDS,
}

// ============================================
// UNIQUE2: 캐주얼 플레이풀
// ============================================

/**
 * Unique2 템플릿의 블록 구조
 *
 * 디자인 분석 (unique2.png):
 * - 상단: "The Wedding Day" (스크립트 폰트)
 * - 중앙: 메인 사진 (세로 카드)
 * - 하단: 이름 "Sanghoon · Najin" (스크립트)
 * - 최하단: "2026.09.23 Save The Date"
 */
const UNIQUE2_BLOCK_STRUCTURE: BlockTemplate[] = [
  {
    type: 'hero',
    enabled: true,
    height: 100,
    elements: [
      // 배경
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFFFFF' },
      },
      // "The Wedding Day" 제목
      {
        type: 'text',
        x: 0,
        y: 5,
        width: 100,
        height: 10,
        zIndex: 2,
        value: 'The Wedding Day',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2.5rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      // 메인 사진
      {
        type: 'image',
        x: 15,
        y: 18,
        width: 70,
        height: 50,
        zIndex: 1,
        binding: 'photos.main',
        props: { type: 'image', objectFit: 'cover' },
        style: { borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
      },
      // 신랑·신부 이름
      {
        type: 'text',
        x: 0,
        y: 72,
        width: 100,
        height: 8,
        zIndex: 2,
        props: { type: 'text', format: '{couple.groom.name} · {couple.bride.name}' },
        binding: 'couple.groom.name',
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      // Save The Date
      {
        type: 'text',
        x: 0,
        y: 85,
        width: 100,
        height: 6,
        zIndex: 2,
        binding: 'wedding.date',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.9rem',
          fontWeight: 400,
          color: '#8B7355',
          textAlign: 'center',
          letterSpacing: '0.15em',
        },
      },
    ],
  },
]

const UNIQUE2_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: { blockType: 'hero', binding: 'photos.main', label: '메인 사진' },
  groomName: { blockType: 'hero', binding: 'couple.groom.name', label: '신랑 이름' },
  brideName: { blockType: 'hero', binding: 'couple.bride.name', label: '신부 이름' },
  weddingDate: { blockType: 'hero', binding: 'wedding.date', label: '예식 날짜' },
}

export const UNIQUE2_TEMPLATE_V2: TemplateV2 = {
  ...(getTemplateById('unique2')!),
  blockStructure: UNIQUE2_BLOCK_STRUCTURE,
  editableFields: UNIQUE2_EDITABLE_FIELDS,
}

// ============================================
// UNIQUE3: 미니멀 모던
// ============================================

const UNIQUE3_BLOCK_STRUCTURE: BlockTemplate[] = [
  {
    type: 'hero',
    enabled: true,
    height: 100,
    elements: [
      // 배경 이미지 (전체)
      {
        type: 'image',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        binding: 'photos.main',
        props: { type: 'image', objectFit: 'cover' },
        style: {},
      },
      // 텍스트 카드 오버레이 (작고 미니멀하게)
      {
        type: 'shape',
        x: 15,
        y: 40,
        width: 70,
        height: 20,
        zIndex: 1,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFFFFF', opacity: 0.85, borderRadius: '8px' },
      },
      // "We're getting married" (볼드하고 크게)
      {
        type: 'text',
        x: 20,
        y: 43,
        width: 60,
        height: 7,
        zIndex: 2,
        value: "We're getting married",
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      // 날짜 (작고 심플하게)
      {
        type: 'text',
        x: 20,
        y: 51,
        width: 60,
        height: 5,
        zIndex: 2,
        binding: 'wedding.dateDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '0.85rem',
          fontWeight: 300,
          color: '#4A4A4A',
          textAlign: 'center',
        },
      },
    ],
  },
]

const UNIQUE3_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: { blockType: 'hero', binding: 'photos.main', label: '배경 사진' },
  weddingDate: { blockType: 'hero', binding: 'wedding.dateDisplay', label: '예식 날짜' },
}

export const UNIQUE3_TEMPLATE_V2: TemplateV2 = {
  ...(getTemplateById('unique3')!),
  blockStructure: UNIQUE3_BLOCK_STRUCTURE,
  editableFields: UNIQUE3_EDITABLE_FIELDS,
}

// ============================================
// UNIQUE4: 다크 로맨틱
// ============================================

const UNIQUE4_BLOCK_STRUCTURE: BlockTemplate[] = [
  {
    type: 'hero',
    enabled: true,
    height: 100,
    elements: [
      // 배경 이미지
      {
        type: 'image',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        binding: 'photos.main',
        props: { type: 'image', objectFit: 'cover', overlay: 'rgba(0,0,0,0.4)' },
        style: {},
      },
      // 신랑 이름 (좌측 상단)
      {
        type: 'text',
        x: 10,
        y: 10,
        width: 35,
        height: 8,
        zIndex: 2,
        binding: 'couple.groom.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.1rem',
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'left',
        },
      },
      // 신부 이름 (우측 상단)
      {
        type: 'text',
        x: 55,
        y: 10,
        width: 35,
        height: 8,
        zIndex: 2,
        binding: 'couple.bride.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.1rem',
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'right',
        },
      },
      // "The Wedding Day"
      {
        type: 'text',
        x: 0,
        y: 55,
        width: 100,
        height: 15,
        zIndex: 2,
        value: 'The\nWedding\nDay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '3.5rem',
          fontWeight: 400,
          color: '#FFB6C1',
          textAlign: 'center',
          lineHeight: 1.1,
        },
      },
      // 날짜
      {
        type: 'text',
        x: 0,
        y: 85,
        width: 100,
        height: 8,
        zIndex: 2,
        binding: 'wedding.date',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 300,
          color: '#FFB6C1',
          textAlign: 'center',
          letterSpacing: '0.1em',
        },
      },
    ],
  },
]

const UNIQUE4_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: { blockType: 'hero', binding: 'photos.main', label: '배경 사진' },
  groomName: { blockType: 'hero', binding: 'couple.groom.name', label: '신랑 이름' },
  brideName: { blockType: 'hero', binding: 'couple.bride.name', label: '신부 이름' },
  weddingDate: { blockType: 'hero', binding: 'wedding.date', label: '예식 날짜' },
}

export const UNIQUE4_TEMPLATE_V2: TemplateV2 = {
  ...(getTemplateById('unique4')!),
  blockStructure: UNIQUE4_BLOCK_STRUCTURE,
  editableFields: UNIQUE4_EDITABLE_FIELDS,
}

// ============================================
// UNIQUE5: 브라이트 캐주얼
// ============================================

const UNIQUE5_BLOCK_STRUCTURE: BlockTemplate[] = [
  {
    type: 'hero',
    enabled: true,
    height: 100,
    elements: [
      // 배경 이미지
      {
        type: 'image',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        binding: 'photos.main',
        props: { type: 'image', objectFit: 'cover', overlay: 'rgba(255,255,255,0.2)' },
        style: {},
      },
      // "05" 큰 숫자
      {
        type: 'text',
        x: 0,
        y: 15,
        width: 100,
        height: 20,
        zIndex: 2,
        value: '05',
        props: { type: 'text' },
        style: {
          fontFamily: "'Bangers', cursive",
          fontSize: '8rem',
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1,
        },
      },
      // "We are getting married"
      {
        type: 'text',
        x: 0,
        y: 40,
        width: 100,
        height: 15,
        zIndex: 2,
        value: 'We are\ngetting\nmarried',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '3rem',
          fontWeight: 400,
          color: '#4169E1',
          textAlign: 'center',
          lineHeight: 1.2,
        },
      },
      // 이름
      {
        type: 'text',
        x: 0,
        y: 75,
        width: 100,
        height: 8,
        zIndex: 2,
        props: { type: 'text', format: '{couple.groom.name} & {couple.bride.name}' },
        binding: 'couple.groom.name',
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.2rem',
          fontWeight: 500,
          color: '#FFFFFF',
          textAlign: 'center',
        },
      },
    ],
  },
]

const UNIQUE5_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: { blockType: 'hero', binding: 'photos.main', label: '배경 사진' },
  groomName: { blockType: 'hero', binding: 'couple.groom.name', label: '신랑 이름' },
  brideName: { blockType: 'hero', binding: 'couple.bride.name', label: '신부 이름' },
}

export const UNIQUE5_TEMPLATE_V2: TemplateV2 = {
  ...(getTemplateById('unique5')!),
  blockStructure: UNIQUE5_BLOCK_STRUCTURE,
  editableFields: UNIQUE5_EDITABLE_FIELDS,
}

// ============================================
// UNIQUE6: 모노크롬 볼드
// ============================================

const UNIQUE6_BLOCK_STRUCTURE: BlockTemplate[] = [
  {
    type: 'hero',
    enabled: true,
    height: 100,
    elements: [
      // 배경 이미지 (흑백 필터)
      {
        type: 'image',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        binding: 'photos.main',
        props: { type: 'image', objectFit: 'cover' },
        style: { filter: 'grayscale(100%)' },
      },
      // 이름 (상단)
      {
        type: 'text',
        x: 0,
        y: 15,
        width: 100,
        height: 10,
        zIndex: 2,
        props: { type: 'text', format: '{couple.groom.name} ♥ {couple.bride.name}' },
        binding: 'couple.groom.name',
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.3rem',
          fontWeight: 500,
          color: '#FF69B4',
          textAlign: 'center',
        },
      },
      // "The Wedding Day"
      {
        type: 'text',
        x: 0,
        y: 50,
        width: 100,
        height: 18,
        zIndex: 2,
        value: 'The\nWedding\nDay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Calistoga', cursive",
          fontSize: '3.5rem',
          fontWeight: 400,
          color: '#FF69B4',
          textAlign: 'center',
          lineHeight: 1.1,
        },
      },
      // 날짜
      {
        type: 'text',
        x: 0,
        y: 82,
        width: 100,
        height: 8,
        zIndex: 2,
        binding: 'wedding.date',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 500,
          color: '#FFFFFF',
          textAlign: 'center',
        },
      },
    ],
  },
]

const UNIQUE6_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: { blockType: 'hero', binding: 'photos.main', label: '배경 사진' },
  groomName: { blockType: 'hero', binding: 'couple.groom.name', label: '신랑 이름' },
  brideName: { blockType: 'hero', binding: 'couple.bride.name', label: '신부 이름' },
  weddingDate: { blockType: 'hero', binding: 'wedding.date', label: '예식 날짜' },
}

export const UNIQUE6_TEMPLATE_V2: TemplateV2 = {
  ...(getTemplateById('unique6')!),
  blockStructure: UNIQUE6_BLOCK_STRUCTURE,
  editableFields: UNIQUE6_EDITABLE_FIELDS,
}

/**
 * 템플릿 v2 카탈로그 (전체 6개)
 */
export const TEMPLATE_CATALOG_V2: TemplateV2[] = [
  UNIQUE1_TEMPLATE_V2,
  UNIQUE2_TEMPLATE_V2,
  UNIQUE3_TEMPLATE_V2,
  UNIQUE4_TEMPLATE_V2,
  UNIQUE5_TEMPLATE_V2,
  UNIQUE6_TEMPLATE_V2,
]

/**
 * 템플릿 ID로 v2 템플릿 조회
 */
export function getTemplateV2ById(id: string): TemplateV2 | undefined {
  return TEMPLATE_CATALOG_V2.find((t) => t.id === id)
}

/**
 * v2로 변환 가능한 템플릿인지 확인
 */
export function isTemplateV2Available(id: string): boolean {
  return TEMPLATE_CATALOG_V2.some((t) => t.id === id)
}
