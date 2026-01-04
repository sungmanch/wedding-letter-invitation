/**
 * Template Catalog v2 - Editable Block Structures
 *
 * 템플릿을 정적 이미지가 아닌 편집 가능한 Block/Element 구조로 정의합니다.
 * 각 템플릿은 hero, greeting, gallery 등의 블록과 텍스트/이미지 요소를 포함합니다.
 */

import type { Block, BlockType, BlockLayout, Element, VariablePath } from '../schema/types'
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
  layout?: BlockLayout // Auto Layout 설정 (없으면 absolute 모드)
  elements: ElementTemplate[]
}

/**
 * 요소 템플릿 (Element의 초기 구조)
 */
export interface ElementTemplate {
  type: 'text' | 'image' | 'shape' | 'button' | 'icon' | 'divider' | 'map' | 'calendar'
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
          backgroundColor: '#FFFFFF',
        },
      },

      // "Our Wedding Day" 제목
      {
        type: 'text',
        x: 0,
        y: 12, // 조금 더 아래로
        width: 100,
        height: 15,
        zIndex: 2,
        value: 'Our\nWedding\nDay', // 줄바꿈 추가
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '3.5rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
          lineHeight: 1.1,
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },

      // 날짜 표시
      {
        type: 'text',
        x: 0,
        y: 35,
        width: 100,
        height: 6,
        zIndex: 2,
        binding: 'wedding.date',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Nanum Myeongjo', serif", // Nanum Myeongjo
          fontSize: '1rem',
          fontWeight: 400,
          fontStyle: 'italic', // 이탤릭 추가
          color: '#1A1A1A',
          textAlign: 'center',
          letterSpacing: '0.05em',
        },
      },

      // 메인 사진 (카드 형식 - 세로로 긴 형태)
      {
        type: 'image',
        x: 10,
        y: 43,
        width: 80,
        height: 55, // 더 길게
        zIndex: 1,
        binding: 'photos.main',
        props: {
          type: 'image',
          objectFit: 'cover',
        },
        style: {},
      },

      // 신랑 이름
      {
        type: 'text',
        x: 0,
        y: 102, // 화면 아래쪽
        width: 45,
        height: 8,
        zIndex: 2,
        value: '',
        binding: 'couple.groom.name',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Nanum Myeongjo', serif",
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'right',
          letterSpacing: '0.05em',
        },
      },
      // 구분자
      {
        type: 'text',
        x: 45,
        y: 102,
        width: 10,
        height: 8,
        zIndex: 2,
        value: '•',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Nanum Myeongjo', serif",
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'center',
          letterSpacing: '0.05em',
        },
      },
      // 신부 이름
      {
        type: 'text',
        x: 55,
        y: 102,
        width: 45,
        height: 8,
        zIndex: 2,
        value: '',
        binding: 'couple.bride.name',
        props: {
          type: 'text',
        },
        style: {
          fontFamily: "'Nanum Myeongjo', serif",
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'left',
          letterSpacing: '0.05em',
        },
      },
    ],
  },

  // ============================================
  // Greeting Block: 인사말
  // ============================================
  {
    type: 'greeting-parents',
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
    blockType: 'greeting-parents',
    binding: 'greeting.title',
    label: '인사말 제목',
  },
  greetingContent: {
    blockType: 'greeting-parents',
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
      // 배경 워터마크 텍스트 (반복)
      {
        type: 'text',
        x: -10,
        y: 5,
        width: 120,
        height: 100,
        zIndex: 0,
        value: 'Love, Laughter, and Happily Ever After... Love, Laughter, and Happily Ever After...',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          color: '#F0F0F0', // 아주 연한 회색
          textAlign: 'center',
          lineHeight: 2,
          whiteSpace: 'pre-wrap',
          opacity: 0.5,
        },
      },
      // "The Wedding Day" 제목
      {
        type: 'text',
        x: 0,
        y: 6, // 상단 여백
        width: 100,
        height: 8,
        zIndex: 2,
        value: 'The Wedding Day',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      // 메인 사진
      {
        type: 'image',
        x: 10,
        y: 18,
        width: 80,
        height: 55, // 세로로 길게
        zIndex: 1,
        binding: 'photos.main',
        props: { type: 'image', objectFit: 'cover' },
        style: {},
      },
      
      // 신랑 한글 이름
      {
        type: 'text',
        x: 0,
        y: 76,
        width: 45,
        height: 5,
        zIndex: 2,
        props: { type: 'text' },
        binding: 'couple.groom.name',
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1rem',
          fontWeight: 400,
          color: '#333',
          textAlign: 'right',
        },
      },
      // 구분 공백
      {
        type: 'text',
        x: 45,
        y: 76,
        width: 10,
        height: 5,
        zIndex: 2,
        value: '',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1rem',
          color: '#333',
          textAlign: 'center',
        },
      },
      // 신부 한글 이름
      {
        type: 'text',
        x: 55,
        y: 76,
        width: 45,
        height: 5,
        zIndex: 2,
        props: { type: 'text' },
        binding: 'couple.bride.name',
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1rem',
          fontWeight: 400,
          color: '#333',
          textAlign: 'left',
        },
      },

      // 영문 이름 구분자
      {
        type: 'text',
        x: 0,
        y: 80,
        width: 100,
        height: 10,
        zIndex: 2,
        value: '|',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2.5rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },

      // 2026.05.23 Save The Date
      {
        type: 'text',
        x: 0,
        y: 93,
        width: 100,
        height: 5,
        zIndex: 2,
        binding: 'wedding.date',
        props: { type: 'text', format: '{wedding.date} Save The Date' },
        style: {
          fontFamily: "'Great Vibes', cursive", // 예시이미지도 필기체 느낌이 있음
          fontSize: '1.2rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
          // letterSpacing: '0.1em',
        },
      },
    ],
  },

  // ============================================
  // Greeting Block: 인사말
  // ============================================
  {
    type: 'greeting-parents',
    enabled: true,
    height: 70,
    elements: [
      {
        type: 'shape',
        x: 0, 
        y: 0, 
        width: 100, 
        height: 100, 
        zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFFAF0' }, // FloralWhite
      },
      {
        type: 'text',
        x: 10,
        y: 15,
        width: 80,
        height: 10,
        zIndex: 1,
        binding: 'greeting.title',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 30,
        width: 80,
        height: 50,
        zIndex: 1,
        binding: 'greeting.content',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
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
  // Calendar Block
  // ============================================
  {
    type: 'calendar',
    enabled: true,
    height: 60,
    elements: [
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
      {
        type: 'text',
        x: 0,
        y: 20,
        width: 100,
        height: 12,
        zIndex: 1,
        binding: 'wedding.dateDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2.5rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 0,
        y: 38,
        width: 100,
        height: 8,
        zIndex: 1,
        binding: 'wedding.timeDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.1rem',
          fontWeight: 400,
          color: '#555',
          textAlign: 'center',
        },
      },
    ],
  },
  // ============================================
  // Location Block
  // ============================================
  {
    type: 'location',
    enabled: true,
    height: 80,
    elements: [
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFFAF0' },
      },
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: 'Location',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 22,
        width: 80,
        height: 8,
        zIndex: 1,
        binding: 'venue.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 40,
        width: 80,
        height: 10,
        zIndex: 1,
        binding: 'venue.address',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '0.9rem',
          fontWeight: 400,
          color: '#4A4A4A',
          textAlign: 'center',
          lineHeight: 1.6,
        },
      },
      {
        type: 'text',
        x: 10,
        y: 55,
        width: 80,
        height: 20,
        zIndex: 1,
        value: '[맵]',
        props: { type: 'text' },
        style: {
           fontFamily: "'Noto Serif KR', serif",
           fontSize: '0.85rem',
           color: '#999',
           textAlign: 'center'
        }
      }
    ],
  },
  // ============================================
  // Gallery Block
  // ============================================
  {
    type: 'gallery',
    enabled: true,
    height: 100,
    elements: [
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
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: 'Gallery',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 22,
        width: 80,
        height: 70,
        zIndex: 1,
        binding: 'photos.gallery',
        value: '[갤러리]',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '0.85rem',
          color: '#999',
          textAlign: 'center',
        },
      },
    ],
  },
  // ============================================
  // Contact Block
  // ============================================
  {
    type: 'contact',
    enabled: true,
    height: 60,
    elements: [
       {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFFAF0' },
      },
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: 'Contact',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 25,
        width: 40,
        height: 30,
        zIndex: 1,
        binding: 'couple.groom.name',
        props: { type: 'text', format: 'Groom {couple.groom.name}\n{couple.groom.phone}' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '0.95rem',
          color: '#4A4A4A',
          textAlign: 'center',
          lineHeight: 1.8,
        },
      },
      {
        type: 'text',
        x: 50,
        y: 25,
        width: 40,
        height: 30,
        zIndex: 1,
        binding: 'couple.bride.name',
        props: { type: 'text', format: 'Bride {couple.bride.name}\n{couple.bride.phone}' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '0.95rem',
          color: '#4A4A4A',
          textAlign: 'center',
          lineHeight: 1.8,
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
  greetingTitle: { blockType: 'greeting-parents', binding: 'greeting.title', label: '인사말 제목' },
  greetingContent: { blockType: 'greeting-parents', binding: 'greeting.content', label: '인사말 내용' },
  venueName: { blockType: 'location', binding: 'venue.name', label: '예식장 이름' },
  venueAddress: { blockType: 'location', binding: 'venue.address', label: '예식장 주소' },
  gallery: { blockType: 'gallery', binding: 'photos.gallery', label: '갤러리 사진' },
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
      // 텍스트 카드 오버레이 (중앙에 큼지막하게)
      {
        type: 'shape',
        x: 15, // 좌우 여백
        y: 30, // 상탄 여백
        width: 70,
        height: 40,
        zIndex: 1,
        props: { type: 'shape', shape: 'rectangle' },
        style: { 
          backgroundColor: 'rgba(255, 255, 255, 0.65)', // 반투명
          backdropFilter: 'blur(2px)',
        },
      },
      // "We're getting married"
      {
        type: 'text',
        x: 20,
        y: 35,
        width: 60,
        height: 10,
        zIndex: 2,
        value: "We're getting\nmarried",
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Myeongjo', serif", // Nanum Myeongjo
          fontSize: '1.8rem',
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'center', // 왼쪽 정렬? 이미지엔 좀 치우쳐보이기도 하는데, 일단 Center
          lineHeight: 1.2,
        },
      },
      // 구분선
      {
        type: 'shape',
        x: 25,
        y: 53,
        width: 50,
        height: 0.2, // 얇은 선
        zIndex: 2,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#1A1A1A' },
      },
      // 날짜 (2026.05.23)
      {
        type: 'text',
        x: 20,
        y: 56,
        width: 60,
        height: 5,
        zIndex: 2,
        binding: 'wedding.date',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Myeongjo', serif", // Nanum Myeongjo
          fontSize: '1.2rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      // 신랑 이름
      {
        type: 'text',
        x: 20,
        y: 61,
        width: 25,
        height: 5,
        zIndex: 2,
        binding: 'couple.groom.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Myeongjo', serif",
          fontSize: '1rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'right',
        },
      },
      // 구분자
      {
        type: 'text',
        x: 45,
        y: 61,
        width: 10,
        height: 5,
        zIndex: 2,
        value: '•',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Myeongjo', serif",
          fontSize: '1rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      // 신부 이름
      {
        type: 'text',
        x: 55,
        y: 61,
        width: 25,
        height: 5,
        zIndex: 2,
        binding: 'couple.bride.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Myeongjo', serif",
          fontSize: '1rem',
          fontWeight: 400,
          color: '#1A1A1A',
          textAlign: 'left',
        },
      },
    ],
  },
  // ============================================
  // Greeting Block
  // ============================================
  {
    type: 'greeting-parents',
    enabled: true,
    height: 60,
    elements: [
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
      {
        type: 'text',
        x: 10,
        y: 15,
        width: 80,
        height: 10,
        zIndex: 1,
        binding: 'greeting.title',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.4rem',
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 30,
        width: 80,
        height: 50,
        zIndex: 1,
        binding: 'greeting.content',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '0.9rem',
          fontWeight: 300,
          color: '#1A1A1A',
          textAlign: 'center',
          lineHeight: 2.0,
          whiteSpace: 'pre-wrap',
        },
      },
    ],
  },
  // ... Calendar, Location, Gallery, Contact (Minimal)
  {
    type: 'calendar',
    enabled: true,
    height: 60,
    elements: [
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#F8F8F8' }, // Slight gray
      },
      {
        type: 'text',
        x: 0,
        y: 20,
        width: 100,
        height: 12,
        zIndex: 1,
        binding: 'wedding.dateDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      // 시간 표시
      {
        type: 'text',
        x: 0,
        y: 35,
        width: 100,
        height: 8,
        zIndex: 1,
        binding: 'wedding.timeDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1rem',
          fontWeight: 400,
          color: '#555',
          textAlign: 'center',
        },
      },
    ],
  },
   {
    type: 'location',
    enabled: true,
    height: 80,
    elements: [
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
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: 'LOCATION',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1rem',
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'center',
          letterSpacing: '0.2em',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 22,
        width: 80,
        height: 8,
        zIndex: 1,
        binding: 'venue.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 40,
        width: 80,
        height: 10,
        zIndex: 1,
        binding: 'venue.address',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '0.9rem',
          fontWeight: 300,
          color: '#1A1A1A',
          textAlign: 'center',
        },
      },
       {
        type: 'map',
        x: 5,
        y: 50,
        width: 90,
        height: 40,
        zIndex: 1,
        binding: 'venue',
        props: { type: 'map', zoom: 15, showMarker: true },
        style: {}
      }
    ],
  },
  {
    type: 'gallery',
    enabled: true,
    height: 100,
    elements: [
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#F8F8F8' },
      },
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: 'GALLERY',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1rem',
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'center',
          letterSpacing: '0.2em',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 22,
        width: 80,
        height: 70,
        zIndex: 1,
        binding: 'photos.gallery',
        value: '[Grid]',
        props: { type: 'text' },
        style: {
          fontSize: '0.8rem',
          color: '#ccc',
          textAlign: 'center',
        },
      },
    ],
  },
  {
    type: 'contact',
    enabled: true,
    height: 60,
    elements: [
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
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: 'CONTACT',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1rem',
          fontWeight: 700,
          color: '#1A1A1A',
          textAlign: 'center',
          letterSpacing: '0.2em',
        },
      },
      // Simplified contact for minimal theme
      {
        type: 'text',
        x: 10,
        y: 30,
        width: 80,
        height: 20,
        zIndex: 1,
        binding: 'couple.groom.phone',
        props: { type: 'text', format: '{couple.groom.name}  |  {couple.bride.name}' },
        style: {
           fontFamily: "'Noto Serif KR', serif",
           fontSize: '1rem',
           textAlign: 'center'
        }
      }
    ],
  },
]

const UNIQUE3_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: { blockType: 'hero', binding: 'photos.main', label: '배경 사진' },
  weddingDate: { blockType: 'hero', binding: 'wedding.dateDisplay', label: '예식 날짜' },
  greetingTitle: { blockType: 'greeting-parents', binding: 'greeting.title', label: '인사말 제목' },
  greetingContent: { blockType: 'greeting-parents', binding: 'greeting.content', label: '인사말 내용' },
  venueName: { blockType: 'location', binding: 'venue.name', label: '예식장 이름' },
  gallery: { blockType: 'gallery', binding: 'photos.gallery', label: '갤러리' },
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
        props: { type: 'image', objectFit: 'cover', overlay: 'rgba(0,0,0,0.2)' }, // 살짝 어둡게
        style: {},
      },
      // 신랑 이름 (좌측 상단)
      {
        type: 'text',
        x: 8,
        y: 5,
        width: 30,
        height: 5,
        zIndex: 2,
        binding: 'couple.groom.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Square', sans-serif", // Nanum Square
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#FFB6C1', // LightPink
          textAlign: 'left',
        },
      },
      // 신부 이름 (우측 상단)
      {
        type: 'text',
        x: 62,
        y: 5,
        width: 30,
        height: 5,
        zIndex: 2,
        binding: 'couple.bride.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Square', sans-serif", // Nanum Square
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#FFB6C1', // LightPink
          textAlign: 'right',
        },
      },
      // "The"
      {
        type: 'text',
        x: 8,
        y: 55,
        width: 50,
        height: 8,
        zIndex: 2,
        value: 'The',
        props: { type: 'text' },
        style: {
          fontFamily: "'Alata', sans-serif", // Alata
          fontSize: '3rem',
          fontWeight: 400,
          color: '#FFB6C1',
          textAlign: 'left',
        },
      },
      // "Wedding"
      {
        type: 'text',
        x: 8,
        y: 63,
        width: 60,
        height: 8,
        zIndex: 2,
        value: 'Wedding',
        props: { type: 'text' },
        style: {
          fontFamily: "'Alata', sans-serif", // Alata
          fontSize: '3rem',
          fontWeight: 400,
          color: '#FFB6C1',
          textAlign: 'left',
        },
      },
      // "Day"
      {
        type: 'text',
        x: 8,
        y: 71,
        width: 50,
        height: 8,
        zIndex: 2,
        value: 'Day',
        props: { type: 'text' },
        style: {
          fontFamily: "'Alata', sans-serif", // Alata
          fontSize: '3rem',
          fontWeight: 400,
          color: '#FFB6C1',
          textAlign: 'left',
        },
      },
      // 날짜 "05.23"
      {
        type: 'text',
        x: 8,
        y: 82,
        width: 50,
        height: 8,
        zIndex: 2,
        binding: 'wedding.date',
        props: { type: 'text', format: '{wedding.month}.{wedding.day}' }, // MM.DD 포맷 필요
        value: '05.23', // fallback
        style: {
          fontFamily: "'Alata', sans-serif", // Alata
          fontSize: '3rem',
          fontWeight: 400, // 얇게
          color: '#FFB6C1',
          textAlign: 'left',
        },
      },
    ],
  },
  // ============================================
  // Greeting
  // ============================================
  {
    type: 'greeting-parents',
    enabled: true,
    height: 70,
    elements: [
       {
        type: 'shape',
        x: 0, 
        y: 0, 
        width: 100, 
        height: 100, 
        zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFF0F5' }, // LavenderBlush
      },
      {
        type: 'text',
        x: 10,
        y: 15,
        width: 80,
        height: 10,
        zIndex: 1,
        binding: 'greeting.title',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#FFB6C1', // Pink
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 30,
        width: 80,
        height: 50,
        zIndex: 1,
        binding: 'greeting.content',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '0.95rem',
          fontWeight: 400,
          color: '#555',
          textAlign: 'center',
          lineHeight: 1.8,
        },
      },
    ],
  },
  // ============================================
  // Calendar
  // ============================================
   {
    type: 'calendar',
    enabled: true,
    height: 60,
    elements: [
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
      {
        type: 'text',
        x: 0,
        y: 20,
        width: 100,
        height: 15,
        zIndex: 1,
        binding: 'wedding.dateDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.8rem',
          fontWeight: 300,
          color: '#FFB6C1',
          textAlign: 'center',
          letterSpacing: '0.1em',
        },
      },
      // 시간 표시
      {
        type: 'text',
        x: 0,
        y: 38,
        width: 100,
        height: 8,
        zIndex: 1,
        binding: 'wedding.timeDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1rem',
          fontWeight: 300,
          color: '#FFB6C1',
          textAlign: 'center',
        },
      },
    ],
  },
  // ============================================
  // Location
  // ============================================
  {
    type: 'location',
    enabled: true,
    height: 80,
    elements: [
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFF0F5' },
      },
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: '오시는 길',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.3rem',
          color: '#FFB6C1',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 22,
        width: 80,
        height: 8,
        zIndex: 1,
        binding: 'venue.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#333',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 40,
        width: 80,
        height: 10,
        zIndex: 1,
        binding: 'venue.address',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center',
        },
      },
       {
        type: 'text',
        x: 10,
        y: 55,
        width: 80,
        height: 20,
        zIndex: 1,
        value: '[지도]',
        props: { type: 'text' },
        style: { fontSize: '0.8rem', color: '#ccc', textAlign: 'center' }
      }
    ],
  },
  {
    type: 'gallery',
    enabled: true,
    height: 100,
    elements: [
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
       {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: 'Gallery',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          color: '#FFB6C1',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 22,
        width: 80,
        height: 70,
        zIndex: 1,
        binding: 'photos.gallery',
        value: '[Gallery]',
        props: { type: 'text' },
        style: { color: '#ccc', textAlign: 'center' }
      },
    ],
  },
  {
    type: 'contact',
    enabled: true,
    height: 60,
    elements: [
      {
        type: 'shape',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFF0F5' },
      },
      {
        type: 'text',
        x: 0,
        y: 10,
        width: 100,
        height: 8,
        zIndex: 1,
        value: 'Contact',
        props: { type: 'text' },
        style: {
          fontFamily: "'Noto Serif KR', serif",
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#FFB6C1',
          textAlign: 'center',
        },
      },
      {
          type: 'text',
          x: 10, y: 30, width: 80, height: 20,
          zIndex: 1,
          binding: 'couple.groom.phone',
          props: { type: 'text', format: '{couple.groom.name} | {couple.bride.name}' },
           style: {
            fontFamily: "'Noto Serif KR', serif",
            fontSize: '1rem',
            textAlign: 'center',
            color: '#333'
          }
      }
    ],
  },
]

const UNIQUE4_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: { blockType: 'hero', binding: 'photos.main', label: '배경 사진' },
  groomName: { blockType: 'hero', binding: 'couple.groom.name', label: '신랑 이름' },
  brideName: { blockType: 'hero', binding: 'couple.bride.name', label: '신부 이름' },
  weddingDate: { blockType: 'hero', binding: 'wedding.date', label: '예식 날짜' },
   greetingTitle: { blockType: 'greeting-parents', binding: 'greeting.title', label: '인사말 제목' },
  greetingContent: { blockType: 'greeting-parents', binding: 'greeting.content', label: '인사말 내용' },
  venueName: { blockType: 'location', binding: 'venue.name', label: '예식장 이름' },
  gallery: { blockType: 'gallery', binding: 'photos.gallery', label: '갤러리' },
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
        props: { type: 'image', objectFit: 'cover' }, // 오버레이 제거
        style: {},
      },
      // "05" 큰 숫자
      {
        type: 'text',
        x: 0,
        y: 5,
        width: 100,
        height: 15,
        zIndex: 1,
        // value: '05', // Removed static value
        binding: 'wedding.date', // Bind to date to trigger updates
        props: { type: 'text', format: '{wedding.month}' }, // Extract Month
        style: {
          fontFamily: "'Bangers', cursive", // Bangers
          fontSize: '9rem',
          fontWeight: 400, // Bangers is bold by default
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1,
        },
      },
      // "23" 큰 숫자
      {
        type: 'text',
        x: 0,
        y: 18, // 05 바로 아래 겹치듯이
        width: 100,
        height: 15,
        zIndex: 1,
        // value: '23', // Removed static value
        binding: 'wedding.date', // Bind to date
        props: { type: 'text', format: '{wedding.day}' }, // Extract Day
        style: {
          fontFamily: "'Bangers', cursive", // Bangers
          fontSize: '9rem',
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1,
        },
      },
      // "We are getting married" (Blue Script)
      {
        type: 'text',
        x: 0,
        y: 26, // 숫자 위에 오버랩
        width: 100,
        height: 20,
        zIndex: 2,
        value: 'We are\ngetting\nmarried',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Brush Script', cursive", // Nanum Brush
          fontSize: '4.5rem',
          fontWeight: 400,
          color: '#0047AB', // 진한 파랑 (Cobalt)
          textAlign: 'center',
          lineHeight: 1.0,
          textShadow: '0 0 10px rgba(255,255,255,0.5)', // 가독성을 위해
        },
      },
      // 신랑 이름
      {
        type: 'text',
        x: 5,
        y: 90,
        width: 30,
        height: 5,
        zIndex: 2,
        binding: 'couple.groom.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Pen Script', cursive", // Nanum Pen
          fontSize: '1.2rem',
          fontWeight: 500,
          color: '#FFFFFF',
          textAlign: 'left',
        },
      },
      // 신부 이름
      {
        type: 'text',
        x: 65,
        y: 90,
        width: 30,
        height: 5,
        zIndex: 2,
        binding: 'couple.bride.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Pen Script', cursive", // Nanum Pen
          fontSize: '1.2rem',
          fontWeight: 500,
          color: '#FFFFFF',
          textAlign: 'right',
        },
      },
    ],
  },
  // ============================================
  // Greeting
  // ============================================
  {
    type: 'greeting-parents',
    enabled: true,
    height: 70,
    elements: [
       {
        type: 'shape',
        x: 0, 
        y: 0, 
        width: 100, 
        height: 100, 
        zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#F0F8FF' }, // AliceBlue
      },
      {
        type: 'text',
        x: 10,
        y: 15,
        width: 80,
        height: 10,
        zIndex: 1,
        binding: 'greeting.title',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          color: '#4169E1', // RoyalBlue
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10,
        y: 30,
        width: 80,
        height: 50,
        zIndex: 1,
        binding: 'greeting.content',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.95rem',
          color: '#333',
          textAlign: 'center',
          lineHeight: 1.8,
        },
      },
    ],
  },
  // ============================================
  // Calendar
  // ============================================
  {
    type: 'calendar',
    enabled: true,
    height: 60,
    elements: [
       {
        type: 'shape',
        x: 0, y: 0, width: 100, height: 100, zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFFFFF' },
      },
       {
        type: 'text',
        x: 0, y: 20, width: 100, height: 15, zIndex: 1,
        binding: 'wedding.dateDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Inter', sans-serif",
          fontSize: '2rem',
          fontWeight: 700,
          color: '#4169E1',
          textAlign: 'center',
        },
      },
      // 시간 표시
      {
        type: 'text',
        x: 0,
        y: 38,
        width: 100,
        height: 8,
        zIndex: 1,
        binding: 'wedding.timeDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Inter', sans-serif",
          fontSize: '1rem',
          fontWeight: 400,
          color: '#4169E1',
          textAlign: 'center',
        },
      },
    ],
  },
   // ============================================
  // Location
  // ============================================
  {
    type: 'location',
    enabled: true,
    height: 80,
    elements: [
      {
        type: 'shape',
        x: 0, y: 0, width: 100, height: 100, zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#F0F8FF' },
      },
      {
        type: 'text',
        x: 0, y: 10, width: 100, height: 8, zIndex: 1,
        value: 'Location',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          color: '#4169E1',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10, y: 22, width: 80, height: 8, zIndex: 1,
        binding: 'venue.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#333',
          textAlign: 'center',
        },
      },
       {
        type: 'text',
        x: 10, y: 40, width: 80, height: 10, zIndex: 1,
        binding: 'venue.address',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.9rem',
          color: '#555',
          textAlign: 'center',
        },
      },
       {
        type: 'map',
        x: 5, y: 50, width: 90, height: 40, zIndex: 1,
        binding: 'venue',
        props: { type: 'map', zoom: 15, showMarker: true },
        style: {}
      }
    ],
  },
  {
    type: 'gallery',
    enabled: true,
    height: 100,
    elements: [
       {
        type: 'shape',
        x: 0, y: 0, width: 100, height: 100, zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFFFFF' },
      },
      {
        type: 'text',
        x: 0, y: 10, width: 100, height: 8, zIndex: 1,
        value: 'Gallery',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          color: '#4169E1',
          textAlign: 'center',
        },
      },
       {
        type: 'text',
        x: 10, y: 22, width: 80, height: 70, zIndex: 1,
        binding: 'photos.gallery',
        value: '[Gallery Grid]',
        props: { type: 'text' },
        style: { color: '#ccc', textAlign: 'center' },
      },
    ],
  },
  {
    type: 'contact',
    enabled: true,
    height: 60,
    elements: [
      {
        type: 'shape',
        x: 0, y: 0, width: 100, height: 100, zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#F0F8FF' },
      },
       {
        type: 'text',
        x: 0, y: 10, width: 100, height: 8, zIndex: 1,
        value: 'Contact',
        props: { type: 'text' },
        style: {
          fontFamily: "'Great Vibes', cursive",
          fontSize: '2rem',
          color: '#4169E1',
          textAlign: 'center',
        },
      },
       {
        type: 'text',
        x: 10, y: 30, width: 80, height: 20, zIndex: 1,
        binding: 'couple.groom.phone',
        props: { type: 'text', format: '{couple.groom.name} & {couple.bride.name}' },
        style: { fontFamily: "'Pretendard', sans-serif", fontSize: '1rem', textAlign: 'center' }
      }
    ]
  }
]

const UNIQUE5_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: { blockType: 'hero', binding: 'photos.main', label: '배경 사진' },
  groomName: { blockType: 'hero', binding: 'couple.groom.name', label: '신랑 이름' },
  brideName: { blockType: 'hero', binding: 'couple.bride.name', label: '신부 이름' },
  greetingTitle: { blockType: 'greeting-parents', binding: 'greeting.title', label: '인사말 제목' },
  greetingContent: { blockType: 'greeting-parents', binding: 'greeting.content', label: '인사말 내용' },
  venueName: { blockType: 'location', binding: 'venue.name', label: '예식장 이름' },
  gallery: { blockType: 'gallery', binding: 'photos.gallery', label: '갤러리' },
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
        style: { filter: 'grayscale(100%) brightness(0.9)' }, // 살짝 어둡게
      },
      // 신랑 이름
      {
        type: 'text',
        x: 0,
        y: 35,
        width: 45,
        height: 5,
        zIndex: 2,
        props: { type: 'text' },
        binding: 'couple.groom.name',
        style: {
          fontFamily: "'Nanum Square', sans-serif",
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#FF69B4',
          textAlign: 'right',
        },
      },
      // 구분자
      {
        type: 'text',
        x: 45,
        y: 35,
        width: 10,
        height: 5,
        zIndex: 2,
        value: '•',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Square', sans-serif",
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#FF69B4',
          textAlign: 'center',
        },
      },
      // 신부 이름
      {
        type: 'text',
        x: 55,
        y: 35,
        width: 45,
        height: 5,
        zIndex: 2,
        props: { type: 'text' },
        binding: 'couple.bride.name',
        style: {
          fontFamily: "'Nanum Square', sans-serif",
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#FF69B4',
          textAlign: 'left',
        },
      },
      // "The Wedding Day" (타이틀)
      {
        type: 'text',
        x: 0,
        y: 40,
        width: 100,
        height: 25,
        zIndex: 2,
        value: 'The\nWedding\nDay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif", // 명조보다는 고딕 계열
          fontSize: '4rem',
          fontWeight: 700,
          color: '#FF69B4',
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        },
      },
      // 날짜
      {
        type: 'text',
        x: 0,
        y: 66,
        width: 100,
        height: 6,
        zIndex: 2,
        binding: 'wedding.date',
        props: { type: 'text' },
        style: {
          fontFamily: "'Nanum Square', sans-serif", // Nanum Square
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#FF69B4',
          textAlign: 'center',
          letterSpacing: '0.05em',
        },
      },
    ],
  },
  // ============================================
  // Greeting
  // ============================================
  {
    type: 'greeting-parents',
    enabled: true,
    height: 70,
    elements: [
       {
        type: 'shape',
        x: 0, y: 0, width: 100, height: 100, zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#F5F5F5' }, // WhiteSmoke
      },
      {
        type: 'text',
        x: 10, y: 15, width: 80, height: 10, zIndex: 1,
        binding: 'greeting.title',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#FF69B4', // HotPink
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10, y: 30, width: 80, height: 50, zIndex: 1,
        binding: 'greeting.content',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.95rem',
          fontWeight: 500,
          color: '#000',
          textAlign: 'center',
          lineHeight: 1.6,
        },
      },
    ],
  },
  // ============================================
  // Calendar
  // ============================================
  {
    type: 'calendar',
    enabled: true,
    height: 60,
    elements: [
      {
        type: 'shape',
        x: 0, y: 0, width: 100, height: 100, zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFFFFF' },
      },
      {
        type: 'text',
        x: 0, y: 20, width: 100, height: 15, zIndex: 1,
        binding: 'wedding.dateDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '2rem',
          fontWeight: 900,
          color: '#FF69B4',
          textAlign: 'center',
        },
      },
      // 시간 표시
      {
        type: 'text',
        x: 0,
        y: 38,
        width: 100,
        height: 8,
        zIndex: 1,
        binding: 'wedding.timeDisplay',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1rem',
          fontWeight: 700,
          color: '#FF69B4',
          textAlign: 'center',
        },
      },
    ],
  },
  // ============================================
  // Location
  // ============================================
  {
    type: 'location',
    enabled: true,
    height: 80,
    elements: [
      {
        type: 'shape',
        x: 0, y: 0, width: 100, height: 100, zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#F5F5F5' },
      },
      {
        type: 'text',
        x: 0, y: 10, width: 100, height: 8, zIndex: 1,
        value: 'LOCATION',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 900,
          color: '#000',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        },
      },
      {
        type: 'text',
        x: 10, y: 22, width: 80, height: 8, zIndex: 1,
        binding: 'venue.name',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#FF69B4',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        x: 10, y: 40, width: 80, height: 10, zIndex: 1,
        binding: 'venue.address',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '0.9rem',
          fontWeight: 500,
          color: '#000',
          textAlign: 'center',
        },
      },
       {
        type: 'map',
        x: 5, y: 50, width: 90, height: 40, zIndex: 1,
        binding: 'venue',
        props: { type: 'map', zoom: 15, showMarker: true },
        style: {}
      }
    ],
  },
  {
    type: 'gallery',
    enabled: true,
    height: 100,
    elements: [
      {
        type: 'shape',
        x: 0, y: 0, width: 100, height: 100, zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#FFFFFF' },
      },
      {
        type: 'text',
        x: 0, y: 10, width: 100, height: 8, zIndex: 1,
        value: 'GALLERY',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 900,
          color: '#000',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        },
      },
      {
        type: 'text',
        x: 10, y: 22, width: 80, height: 70, zIndex: 1,
        binding: 'photos.gallery',
        value: '[B&W Gallery]',
        props: { type: 'text' },
        style: { color: '#ccc', textAlign: 'center', filter: 'grayscale(100%)' },
      },
    ],
  },
  {
    type: 'contact',
    enabled: true,
    height: 60,
    elements: [
       {
        type: 'shape',
        x: 0, y: 0, width: 100, height: 100, zIndex: 0,
        props: { type: 'shape', shape: 'rectangle' },
        style: { backgroundColor: '#F5F5F5' },
      },
       {
        type: 'text',
        x: 0, y: 10, width: 100, height: 8, zIndex: 1,
        value: 'CONTACT',
        props: { type: 'text' },
        style: {
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '1.5rem',
          fontWeight: 900,
          color: '#000',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        },
      },
       {
        type: 'text',
        x: 10, y: 30, width: 80, height: 20, zIndex: 1,
        binding: 'couple.groom.phone',
         props: { type: 'text', format: '{couple.groom.name} ♥ {couple.bride.name}' },
        style: {
           fontFamily: "'Pretendard', sans-serif",
           fontSize: '1.2rem',
           fontWeight: 700,
           color: '#FF69B4',
           textAlign: 'center'
        }
      }
    ]
  }
]

const UNIQUE6_EDITABLE_FIELDS: EditableFieldMap = {
  mainPhoto: { blockType: 'hero', binding: 'photos.main', label: '배경 사진' },
  groomName: { blockType: 'hero', binding: 'couple.groom.name', label: '신랑 이름' },
  brideName: { blockType: 'hero', binding: 'couple.bride.name', label: '신부 이름' },
  weddingDate: { blockType: 'hero', binding: 'wedding.date', label: '예식 날짜' },
  greetingTitle: { blockType: 'greeting-parents', binding: 'greeting.title', label: '인사말 제목' },
  greetingContent: { blockType: 'greeting-parents', binding: 'greeting.content', label: '인사말 내용' },
  venueName: { blockType: 'location', binding: 'venue.name', label: '예식장 이름' },
  gallery: { blockType: 'gallery', binding: 'photos.gallery', label: '갤러리' },
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
