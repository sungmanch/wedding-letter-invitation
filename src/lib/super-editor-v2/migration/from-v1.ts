/**
 * Super Editor v1 → v2 Migration
 *
 * v1 Create의 출력물(IntroGenerationResult + BasicInfo)을
 * v2 EditorDocument로 변환합니다.
 *
 * 주요 변환:
 * - IntroGenerationResult.layout (Screen) → Block (hero)
 * - IntroGenerationResult.style → StyleSystem
 * - BasicInfoData → WeddingData
 * - 기본 섹션 (greeting, calendar, gallery, location, account, message) 자동 생성
 */

'use server'

import { v4 as uuid } from 'uuid'
import { db } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'
import { editorDocumentsV2 } from '../schema/db-schema'
import type {
  EditorDocument,
  Block,
  Element,
  StyleSystem,
  WeddingData,
  TextProps,
  ImageProps,
  CalendarProps,
  MapProps,
  PersonInfo,
} from '../schema/types'
import type { IntroGenerationResult } from '@/lib/super-editor/services'
import type { StyleSchema } from '@/lib/super-editor/schema/style'

// ============================================
// Types
// ============================================

export interface BasicInfoData {
  groomName: string
  brideName: string
  weddingDate: string // YYYY-MM-DD
  weddingTime: string // HH:mm
  venueName: string
}

export interface MigrationInput {
  introResult: IntroGenerationResult
  basicInfo: BasicInfoData
}

export interface MigrationResult {
  document: Omit<EditorDocument, 'id'>
  warnings: string[]
}

// ============================================
// Constants
// ============================================

const DEFAULT_BLOCK_HEIGHT = 100 // vh

// 기본 섹션 순서
const DEFAULT_SECTION_ORDER: Array<{ type: Block['type']; enabled: boolean }> = [
  { type: 'hero', enabled: true },
  { type: 'greeting', enabled: true },
  { type: 'calendar', enabled: true },
  { type: 'gallery', enabled: true },
  { type: 'location', enabled: true },
  { type: 'parents', enabled: false },
  { type: 'account', enabled: true },
  { type: 'message', enabled: true },
]

// ============================================
// Main Migration Function
// ============================================

export function migrateV1ToV2(input: MigrationInput): MigrationResult {
  const warnings: string[] = []
  const { introResult, basicInfo } = input

  // 1. WeddingData 변환
  const weddingData = convertToWeddingData(basicInfo)

  // 2. StyleSystem 변환
  const styleSystem = convertToStyleSystem(introResult.style)

  // 3. Hero 블록 생성 (인트로 기반)
  const heroBlock = createHeroBlock(introResult, weddingData)

  // 4. 기본 섹션 블록들 생성
  const sectionBlocks = createDefaultSectionBlocks(weddingData)

  // 5. 전체 블록 배열 구성
  const blocks: Block[] = [heroBlock, ...sectionBlocks]

  // 6. EditorDocument 구성
  const document: Omit<EditorDocument, 'id'> = {
    version: 2,
    meta: {
      title: `${weddingData.groom.name} ♥ ${weddingData.bride.name} 결혼합니다`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    style: styleSystem,
    animation: {
      mood: 'elegant',
      speed: 1,
    },
    blocks,
    data: weddingData,
  }

  return { document, warnings }
}

// ============================================
// WeddingData Conversion
// ============================================

function convertToWeddingData(basicInfo: BasicInfoData): WeddingData {
  const dateDisplay = formatDateKorean(basicInfo.weddingDate)
  const timeDisplay = formatTimeKorean(basicInfo.weddingTime)

  return {
    groom: {
      name: basicInfo.groomName || '신랑',
    },
    bride: {
      name: basicInfo.brideName || '신부',
    },
    wedding: {
      date: basicInfo.weddingDate,
      time: basicInfo.weddingTime,
      dateDisplay,
    },
    venue: {
      name: basicInfo.venueName || '예식장',
      address: '',
    },
    photos: {
      gallery: [],
    },
    greeting: {
      title: '저희 결혼합니다',
      content: '서로의 마음을 확인하고\n평생을 함께 하고자 합니다.\n\n바쁘시더라도 부디 오셔서\n저희의 앞날을 축복해 주세요.',
    },
  }
}

// ============================================
// StyleSystem Conversion
// ============================================

function convertToStyleSystem(styleSchema: StyleSchema): StyleSystem {
  const colors = styleSchema.theme?.colors
  const typography = styleSchema.theme?.typography

  // 배경색 추출
  const bgDefault = colors?.background?.default || '#FFFFFF'
  const textPrimary = colors?.text?.primary || '#1a1a1a'
  const accentColor = colors?.primary?.[500] || colors?.accent?.[500] || '#C9A962'

  // 폰트 추출
  const headingFont = typography?.fonts?.heading?.family || 'Noto Serif KR'
  const bodyFont = typography?.fonts?.body?.family || 'Pretendard'

  return {
    version: 2,
    preset: undefined, // custom
    quick: {
      dominantColor: bgDefault,
      accentColor: accentColor,
      mood: 'neutral',
      contrast: 'medium',
      saturation: 'normal',
    },
    advanced: {
      palette: [
        { id: 'bg', value: bgDefault },
        { id: 'text', value: textPrimary },
        { id: 'accent', value: accentColor },
      ],
      tokens: {
        'bg-page': bgDefault,
        'bg-section': bgDefault,
        'bg-section-alt': adjustColorBrightness(bgDefault, -5),
        'bg-card': '#FFFFFF',
        'bg-overlay': 'rgba(0, 0, 0, 0.4)',
        'fg-default': textPrimary,
        'fg-muted': adjustColorOpacity(textPrimary, 0.6),
        'fg-emphasis': textPrimary,
        'fg-inverse': '#FFFFFF',
        'fg-on-accent': '#FFFFFF',
        'accent-default': accentColor,
        'accent-hover': adjustColorBrightness(accentColor, -10),
        'accent-active': adjustColorBrightness(accentColor, -20),
        'accent-secondary': adjustColorBrightness(accentColor, 20),
        'border-default': adjustColorOpacity(textPrimary, 0.1),
        'border-emphasis': adjustColorOpacity(textPrimary, 0.2),
        'border-muted': adjustColorOpacity(textPrimary, 0.05),
      },
    },
    typography: {
      preset: 'classic-elegant',
      custom: {
        fontStacks: {
          heading: headingFont,
          body: bodyFont,
        },
        weights: {
          heading: 400,
          body: 400,
        },
      },
    },
    effects: {
      preset: 'elegant',
    },
  }
}

// ============================================
// Hero Block Creation
// ============================================

function createHeroBlock(introResult: IntroGenerationResult, data: WeddingData): Block {
  const elements: Element[] = []
  let zIndex = 0

  // 배경 이미지
  elements.push(createImageElement({
    id: uuid(),
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: zIndex++,
    binding: 'photos.main',
    objectFit: 'cover',
    overlay: 'rgba(0, 0, 0, 0.3)',
  }))

  // "WEDDING INVITATION" 라벨
  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 15,
    width: 80,
    height: 5,
    zIndex: zIndex++,
    value: 'WEDDING INVITATION',
    style: {
      text: {
        fontSize: 10,
        fontWeight: 300,
        letterSpacing: 3,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
  }))

  // 신랑 이름
  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 35,
    width: 80,
    height: 8,
    zIndex: zIndex++,
    binding: 'groom.name',
    style: {
      text: {
        fontSize: 28,
        fontWeight: 400,
        textAlign: 'center',
        color: '#FFFFFF',
        fontFamily: 'Noto Serif KR',
      },
    },
  }))

  // & 기호
  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 43,
    width: 80,
    height: 5,
    zIndex: zIndex++,
    value: '&',
    style: {
      text: {
        fontSize: 20,
        fontWeight: 300,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.8)',
      },
    },
  }))

  // 신부 이름
  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 48,
    width: 80,
    height: 8,
    zIndex: zIndex++,
    binding: 'bride.name',
    style: {
      text: {
        fontSize: 28,
        fontWeight: 400,
        textAlign: 'center',
        color: '#FFFFFF',
        fontFamily: 'Noto Serif KR',
      },
    },
  }))

  // 날짜
  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 65,
    width: 80,
    height: 5,
    zIndex: zIndex++,
    binding: 'wedding.dateDisplay',
    style: {
      text: {
        fontSize: 14,
        fontWeight: 400,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.9)',
      },
    },
  }))

  // 장소
  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 72,
    width: 80,
    height: 5,
    zIndex: zIndex++,
    binding: 'venue.name',
    style: {
      text: {
        fontSize: 13,
        fontWeight: 400,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
  }))

  return {
    id: uuid(),
    type: 'hero',
    enabled: true,
    height: DEFAULT_BLOCK_HEIGHT,
    elements,
  }
}

// ============================================
// Default Section Blocks
// ============================================

function createDefaultSectionBlocks(data: WeddingData): Block[] {
  const blocks: Block[] = []

  // Greeting 블록
  blocks.push(createGreetingBlock())

  // Calendar 블록
  blocks.push(createCalendarBlock())

  // Gallery 블록
  blocks.push(createGalleryBlock())

  // Location 블록
  blocks.push(createLocationBlock())

  // Parents 블록 (기본 비활성화)
  blocks.push(createParentsBlock())

  // Account 블록
  blocks.push(createAccountBlock())

  // Message 블록 (방명록)
  blocks.push(createMessageBlock())

  return blocks
}

function createGreetingBlock(): Block {
  const elements: Element[] = []
  let zIndex = 0

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 20,
    width: 80,
    height: 10,
    zIndex: zIndex++,
    binding: 'greeting.title',
    style: {
      text: {
        fontSize: 24,
        fontWeight: 500,
        textAlign: 'center',
        fontFamily: 'Noto Serif KR',
      },
    },
  }))

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 40,
    width: 80,
    height: 30,
    zIndex: zIndex++,
    binding: 'greeting.content',
    style: {
      text: {
        fontSize: 14,
        fontWeight: 400,
        textAlign: 'center',
        lineHeight: 1.8,
      },
    },
  }))

  return {
    id: uuid(),
    type: 'greeting',
    enabled: true,
    height: DEFAULT_BLOCK_HEIGHT,
    elements,
  }
}

function createCalendarBlock(): Block {
  const elements: Element[] = []
  let zIndex = 0

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 10,
    width: 80,
    height: 8,
    zIndex: zIndex++,
    value: '예식 일시',
    style: {
      text: {
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        fontFamily: 'Noto Serif KR',
      },
    },
  }))

  elements.push({
    id: uuid(),
    type: 'calendar',
    x: 10,
    y: 25,
    width: 80,
    height: 50,
    zIndex: zIndex++,
    binding: 'wedding.date',
    props: {
      type: 'calendar',
      showDday: true,
    } as CalendarProps,
  })

  return {
    id: uuid(),
    type: 'calendar',
    enabled: true,
    height: DEFAULT_BLOCK_HEIGHT,
    elements,
  }
}

function createGalleryBlock(): Block {
  const elements: Element[] = []
  let zIndex = 0

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 5,
    width: 80,
    height: 8,
    zIndex: zIndex++,
    value: 'Gallery',
    style: {
      text: {
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        fontFamily: 'Noto Serif KR',
      },
    },
  }))

  // 갤러리 이미지 플레이스홀더
  elements.push(createImageElement({
    id: uuid(),
    x: 5,
    y: 20,
    width: 90,
    height: 70,
    zIndex: zIndex++,
    binding: 'photos.gallery',
    objectFit: 'cover',
  }))

  return {
    id: uuid(),
    type: 'gallery',
    enabled: true,
    height: DEFAULT_BLOCK_HEIGHT,
    elements,
  }
}

function createLocationBlock(): Block {
  const elements: Element[] = []
  let zIndex = 0

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 5,
    width: 80,
    height: 8,
    zIndex: zIndex++,
    value: '오시는 길',
    style: {
      text: {
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        fontFamily: 'Noto Serif KR',
      },
    },
  }))

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 15,
    width: 80,
    height: 5,
    zIndex: zIndex++,
    binding: 'venue.name',
    style: {
      text: {
        fontSize: 16,
        fontWeight: 500,
        textAlign: 'center',
      },
    },
  }))

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 22,
    width: 80,
    height: 5,
    zIndex: zIndex++,
    binding: 'venue.address',
    style: {
      text: {
        fontSize: 13,
        fontWeight: 400,
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.6)',
      },
    },
  }))

  elements.push({
    id: uuid(),
    type: 'map',
    x: 5,
    y: 35,
    width: 90,
    height: 55,
    zIndex: zIndex++,
    binding: 'venue.coordinates',
    props: {
      type: 'map',
      zoom: 15,
      showMarker: true,
    } as MapProps,
  })

  return {
    id: uuid(),
    type: 'location',
    enabled: true,
    height: DEFAULT_BLOCK_HEIGHT,
    elements,
  }
}

function createParentsBlock(): Block {
  const elements: Element[] = []
  let zIndex = 0

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 15,
    width: 80,
    height: 8,
    zIndex: zIndex++,
    value: '혼주 소개',
    style: {
      text: {
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        fontFamily: 'Noto Serif KR',
      },
    },
  }))

  // 신랑측
  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 35,
    width: 35,
    height: 20,
    zIndex: zIndex++,
    value: '신랑측 혼주\n아버지 · 어머니',
    style: {
      text: {
        fontSize: 13,
        fontWeight: 400,
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  }))

  // 신부측
  elements.push(createTextElement({
    id: uuid(),
    x: 55,
    y: 35,
    width: 35,
    height: 20,
    zIndex: zIndex++,
    value: '신부측 혼주\n아버지 · 어머니',
    style: {
      text: {
        fontSize: 13,
        fontWeight: 400,
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  }))

  return {
    id: uuid(),
    type: 'parents',
    enabled: false, // 기본 비활성화
    height: DEFAULT_BLOCK_HEIGHT,
    elements,
  }
}

function createAccountBlock(): Block {
  const elements: Element[] = []
  let zIndex = 0

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 15,
    width: 80,
    height: 8,
    zIndex: zIndex++,
    value: '마음 전하실 곳',
    style: {
      text: {
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        fontFamily: 'Noto Serif KR',
      },
    },
  }))

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 30,
    width: 80,
    height: 10,
    zIndex: zIndex++,
    value: '축하의 마음을 전해주세요',
    style: {
      text: {
        fontSize: 14,
        fontWeight: 400,
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.6)',
      },
    },
  }))

  return {
    id: uuid(),
    type: 'account',
    enabled: true,
    height: DEFAULT_BLOCK_HEIGHT,
    elements,
  }
}

function createMessageBlock(): Block {
  const elements: Element[] = []
  let zIndex = 0

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 15,
    width: 80,
    height: 8,
    zIndex: zIndex++,
    value: '축하 메시지',
    style: {
      text: {
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        fontFamily: 'Noto Serif KR',
      },
    },
  }))

  elements.push(createTextElement({
    id: uuid(),
    x: 10,
    y: 30,
    width: 80,
    height: 10,
    zIndex: zIndex++,
    value: '신랑 신부에게 축하 메시지를 남겨주세요',
    style: {
      text: {
        fontSize: 14,
        fontWeight: 400,
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.6)',
      },
    },
  }))

  return {
    id: uuid(),
    type: 'message',
    enabled: true,
    height: DEFAULT_BLOCK_HEIGHT,
    elements,
  }
}

// ============================================
// Element Creation Helpers
// ============================================

interface TextElementOptions {
  id: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  binding?: string
  value?: string
  style?: Element['style']
}

function createTextElement(options: TextElementOptions): Element {
  return {
    id: options.id,
    type: 'text',
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    zIndex: options.zIndex,
    binding: options.binding as Element['binding'],
    value: options.value,
    props: { type: 'text' } as TextProps,
    style: options.style,
  }
}

interface ImageElementOptions {
  id: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  binding?: string
  value?: string
  objectFit?: 'cover' | 'contain' | 'fill'
  overlay?: string
}

function createImageElement(options: ImageElementOptions): Element {
  return {
    id: options.id,
    type: 'image',
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    zIndex: options.zIndex,
    binding: options.binding as Element['binding'],
    value: options.value,
    props: {
      type: 'image',
      objectFit: options.objectFit || 'cover',
      overlay: options.overlay,
    } as ImageProps,
  }
}

// ============================================
// Utility Functions
// ============================================

function formatDateKorean(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}요일`
}

function formatTimeKorean(timeStr: string): string {
  if (!timeStr) return ''
  const [hourStr, minuteStr] = timeStr.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)
  if (isNaN(hour)) return timeStr

  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const minutePart = minute > 0 ? ` ${minute}분` : ''

  return `${period} ${displayHour}시${minutePart}`
}

function adjustColorBrightness(color: string, percent: number): string {
  // 간단한 밝기 조정 (실제 구현에서는 더 정교한 색상 변환 필요)
  if (color.startsWith('#')) {
    const num = parseInt(color.slice(1), 16)
    const r = Math.min(255, Math.max(0, (num >> 16) + percent * 2.55))
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent * 2.55))
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent * 2.55))
    return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`
  }
  return color
}

function adjustColorOpacity(color: string, opacity: number): string {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  return color
}

// ============================================
// Server Action: Migrate and Save to v2 DB
// ============================================

export interface MigrateAndSaveResult {
  success: boolean
  documentId?: string
  error?: string
  warnings?: string[]
}

/**
 * v1 Create 결과를 v2로 마이그레이션하고 DB에 저장
 * Create 페이지에서 호출됨
 */
export async function migrateAndSaveToV2(
  input: MigrationInput
): Promise<MigrateAndSaveResult> {
  try {
    // 1. 인증 확인
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: '로그인이 필요합니다' }
    }

    // 2. v1 → v2 마이그레이션
    const { document, warnings } = migrateV1ToV2(input)

    // 3. v2 DB에 저장
    const [savedDocument] = await db.insert(editorDocumentsV2).values({
      userId: user.id,
      title: document.meta.title,
      blocks: document.blocks,
      style: document.style,
      animation: document.animation,
      data: document.data,
      status: 'draft',
    }).returning()

    return {
      success: true,
      documentId: savedDocument.id,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  } catch (error) {
    console.error('Migration failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '마이그레이션에 실패했습니다',
    }
  }
}
