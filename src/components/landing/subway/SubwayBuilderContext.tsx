'use client'

/**
 * Subway Builder Context
 *
 * 서브웨이 스타일 청첩장 빌더의 상태 관리
 * - 선택된 Hero 템플릿 (전체 색상 테마)
 * - 각 섹션별 선택된 프리셋
 * - CSS 변수 (색상 전파용)
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { BlockType, ThemePresetId } from '@/lib/super-editor-v2/schema/types'
import { getTemplateV2ById } from '@/lib/super-editor-v2/config/template-catalog-v2'
import { buildStyleSystemFromTemplate } from '@/lib/super-editor-v2/services/template-applier'
import {
  resolveStyle,
  styleToCSSVariables,
} from '@/lib/super-editor-v2/renderer/style-resolver'
import { DEFAULT_STYLE_SYSTEM } from '@/lib/super-editor-v2/schema'
import {
  isHeroPresetId,
  getThemeForHeroPreset,
  type HeroPresetId,
} from '@/lib/super-editor-v2/presets/blocks/hero'
import { getHeroPresetIdForTemplate } from '@/lib/super-editor-v2/config/template-preset-map'
import { createDocument } from '@/lib/super-editor-v2/actions/document'
import { getBlockPreset } from '@/lib/super-editor-v2/presets/blocks'
import { SAMPLE_WEDDING_DATA } from '@/lib/super-editor-v2/schema'
import { nanoid } from 'nanoid'
import type { Block, Element, SizeMode } from '@/lib/super-editor-v2/schema/types'
import type { PresetElement } from '@/lib/super-editor-v2/presets/blocks/types'

// ============================================
// Types
// ============================================

/** 선택 가능한 섹션 타입 */
export type SelectableSectionType =
  | 'hero'
  | 'greeting-parents'
  | 'calendar'
  | 'gallery'
  | 'location'

/** 섹션별 선택된 프리셋 */
export type SelectedPresets = Record<SelectableSectionType, string>

/** 상태 */
export interface SubwayBuilderState {
  /** 선택된 Hero 템플릿 ID (unique1 ~ unique6) */
  selectedTemplateId: string
  /** 섹션별 선택된 프리셋 ID */
  selectedPresets: SelectedPresets
  /** 테마에서 추출한 CSS 변수 */
  cssVariables: Record<string, string>
}

/** 액션 타입 */
type SubwayBuilderAction =
  | {
      type: 'SET_TEMPLATE'
      payload: { templateId: string; heroPresetId: string; cssVariables: Record<string, string> }
    }
  | {
      type: 'SET_PRESET'
      payload: { sectionType: SelectableSectionType; presetId: string }
    }
  | { type: 'RESET' }

/** Context 값 */
interface SubwayBuilderContextValue {
  state: SubwayBuilderState
  setTemplate: (templateId: string) => void
  setPreset: (sectionType: SelectableSectionType, presetId: string) => void
  reset: () => void
  /** 현재 선택 상태를 저장하고 문서 생성 시도 (비로그인 시 로그인 페이지로 이동) */
  saveAndCreateDocument: () => Promise<void>
  /** 문서 생성 중 상태 */
  isCreating: boolean
}

// ============================================
// Constants
// ============================================

/** 기본 프리셋 선택 */
export const DEFAULT_PRESETS: SelectedPresets = {
  hero: 'hero-classic-elegant',
  'greeting-parents': 'greeting-parents-minimal',
  calendar: 'calendar-korean-countdown-box',
  gallery: 'gallery-square-3col',
  location: 'location-minimal',
}

/** 섹션 순서 (표시 순서) - hero는 상위 스타일 선택에서 처리, location은 기본 프리셋 자동 적용 */
export const SECTION_ORDER: SelectableSectionType[] = [
  'greeting-parents',
  'calendar',
  'gallery',
]

/** 섹션별 라벨 */
export const SECTION_LABELS: Record<SelectableSectionType, string> = {
  hero: '대표사진',
  'greeting-parents': '인사말',
  calendar: '예식일시',
  gallery: '갤러리',
  location: '오시는길',
}

/** 초기 CSS 변수 (unique1 기준) */
function getInitialCssVariables(): Record<string, string> {
  const template = getTemplateV2ById('unique1')
  if (!template) return {}

  const style = buildStyleSystemFromTemplate(template, DEFAULT_STYLE_SYSTEM)
  const resolved = resolveStyle(style)
  return styleToCSSVariables(resolved)
}

/** 초기 상태 (서버/클라이언트 동일 - Hydration 안정성) */
const INITIAL_STATE: SubwayBuilderState = {
  selectedTemplateId: 'unique1',
  selectedPresets: DEFAULT_PRESETS,
  cssVariables: getInitialCssVariables(),
}

// ============================================
// LocalStorage Helpers
// ============================================

const STORAGE_KEY = 'subway-builder-pending-selection'

interface PendingSelection {
  templateId: string
  presets: SelectedPresets
  timestamp: number
}

/** 선택 상태를 localStorage에 저장 */
function savePendingSelection(state: SubwayBuilderState): void {
  if (typeof window === 'undefined') return
  const data: PendingSelection = {
    templateId: state.selectedTemplateId,
    presets: state.selectedPresets,
    timestamp: Date.now(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/** localStorage에서 pending 선택 상태 로드 (1시간 이내만 유효) */
function loadPendingSelection(): PendingSelection | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const data = JSON.parse(stored) as PendingSelection
    // 1시간 이내만 유효
    if (Date.now() - data.timestamp > 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

/** pending 선택 상태 삭제 */
function clearPendingSelection(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

// ============================================
// Block Creation Helpers
// ============================================

function convertPresetElement(el: PresetElement): Element {
  const element: Element = {
    ...el,
    id: el.id || nanoid(8),
  } as Element

  if (el.children && el.children.length > 0) {
    element.children = el.children.map((child) =>
      convertPresetElement(child as PresetElement)
    )
  }

  return element
}

function createBlockFromPresetData(presetId: string): Block | null {
  const preset = getBlockPreset(presetId)
  if (!preset) return null

  let height: number | SizeMode = 80
  if (preset.defaultHeight) {
    height =
      typeof preset.defaultHeight === 'number'
        ? preset.defaultHeight
        : preset.defaultHeight
  }

  return {
    id: nanoid(8),
    type: preset.blockType,
    enabled: true,
    presetId: preset.id,
    height,
    layout: preset.layout,
    elements: preset.defaultElements
      ? preset.defaultElements.map(convertPresetElement)
      : [],
  }
}

// ============================================
// Reducer
// ============================================

function subwayBuilderReducer(
  state: SubwayBuilderState,
  action: SubwayBuilderAction
): SubwayBuilderState {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return {
        ...state,
        selectedTemplateId: action.payload.templateId,
        selectedPresets: {
          ...state.selectedPresets,
          hero: action.payload.heroPresetId,
        },
        cssVariables: action.payload.cssVariables,
      }

    case 'SET_PRESET':
      return {
        ...state,
        selectedPresets: {
          ...state.selectedPresets,
          [action.payload.sectionType]: action.payload.presetId,
        },
      }

    case 'RESET':
      return {
        ...INITIAL_STATE,
        cssVariables: getInitialCssVariables(),
      }

    default:
      return state
  }
}

// ============================================
// Context
// ============================================

const SubwayBuilderContext = createContext<SubwayBuilderContextValue | null>(
  null
)

// ============================================
// Provider
// ============================================

interface SubwayBuilderProviderProps {
  children: ReactNode
}

export function SubwayBuilderProvider({
  children,
}: SubwayBuilderProviderProps) {
  const router = useRouter()
  const [state, dispatch] = useReducer(subwayBuilderReducer, INITIAL_STATE)
  const [isCreating, setIsCreating] = useState(false)

  // 문서 생성 헬퍼 함수
  const createDocumentFromSelection = useCallback(
    async (templateId: string, presets: SelectedPresets) => {
      const template = getTemplateV2ById(templateId)
      if (!template) {
        throw new Error('템플릿을 찾을 수 없습니다')
      }

      // 블록 생성
      const blocks: Block[] = []

      // Hero 블록 추가
      const heroPresetId = presets.hero
      if (heroPresetId) {
        const heroBlock = createBlockFromPresetData(heroPresetId)
        if (heroBlock) {
          blocks.push(heroBlock)
        }
      }

      // 나머지 섹션 추가
      for (const sectionType of SECTION_ORDER) {
        const presetId = presets[sectionType]
        if (presetId) {
          const block = createBlockFromPresetData(presetId)
          if (block) {
            blocks.push(block)
          }
        }
      }

      const style = buildStyleSystemFromTemplate(template, DEFAULT_STYLE_SYSTEM)

      const doc = await createDocument({
        title: '새 청첩장',
        blocks,
        style,
        weddingData: SAMPLE_WEDDING_DATA,
      })

      return doc
    },
    []
  )

  // 로그인 후 pending 선택이 있으면 자동으로 문서 생성
  useEffect(() => {
    const checkAndCreatePendingDocument = async () => {
      const pending = loadPendingSelection()
      if (!pending) return

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // pending 선택이 있고 로그인 상태면 자동 생성
      setIsCreating(true)
      try {
        const doc = await createDocumentFromSelection(pending.templateId, pending.presets)
        clearPendingSelection()
        router.push(`/se2/${doc.id}/edit`)
      } catch (err) {
        console.error('Auto document creation failed:', err)
        clearPendingSelection()
        setIsCreating(false)
      }
    }

    checkAndCreatePendingDocument()
  }, [createDocumentFromSelection, router])

  // Hero 템플릿 선택 시 색상 전파 + hero 프리셋 연동
  const setTemplate = useCallback((templateId: string) => {
    const template = getTemplateV2ById(templateId)
    if (!template) {
      console.warn(`Template not found: ${templateId}`)
      return
    }

    // 템플릿에 맞는 hero 프리셋 조회
    const heroPresetId = getHeroPresetIdForTemplate(templateId) || DEFAULT_PRESETS.hero

    const style = buildStyleSystemFromTemplate(template, DEFAULT_STYLE_SYSTEM)
    const resolved = resolveStyle(style)
    const cssVariables = styleToCSSVariables(resolved)

    dispatch({
      type: 'SET_TEMPLATE',
      payload: { templateId, heroPresetId, cssVariables },
    })
  }, [])

  // 섹션 프리셋 선택
  // 히어로 프리셋 변경 시 테마도 자동 적용
  const setPreset = useCallback(
    (sectionType: SelectableSectionType, presetId: string) => {
      dispatch({
        type: 'SET_PRESET',
        payload: { sectionType, presetId },
      })

      // 히어로 프리셋 변경 시 테마 자동 적용
      if (sectionType === 'hero' && isHeroPresetId(presetId)) {
        const themePresetId = getThemeForHeroPreset(presetId)
        if (themePresetId) {
          // 테마 프리셋으로 CSS 변수 재생성
          const style = {
            ...DEFAULT_STYLE_SYSTEM,
            preset: themePresetId as ThemePresetId,
          }
          const resolved = resolveStyle(style)
          const cssVariables = styleToCSSVariables(resolved)

          dispatch({
            type: 'SET_TEMPLATE',
            payload: { templateId: state.selectedTemplateId, heroPresetId: presetId, cssVariables },
          })
        }
      }
    },
    [state.selectedTemplateId]
  )

  // 초기화
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  // 선택 상태를 저장하고 문서 생성 시도
  const saveAndCreateDocument = useCallback(async () => {
    setIsCreating(true)

    try {
      // 인증 확인
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // 비로그인: 선택 상태 저장 후 로그인 페이지로 이동
        savePendingSelection(state)
        router.push('/login?redirect=/')
        return
      }

      // 로그인 상태: 바로 문서 생성
      const doc = await createDocumentFromSelection(
        state.selectedTemplateId,
        state.selectedPresets
      )
      router.push(`/se2/${doc.id}/edit`)
    } catch (err) {
      console.error('Document creation failed:', err)
      setIsCreating(false)
    }
  }, [state, createDocumentFromSelection, router])

  const contextValue = useMemo<SubwayBuilderContextValue>(
    () => ({
      state,
      setTemplate,
      setPreset,
      reset,
      saveAndCreateDocument,
      isCreating,
    }),
    [state, setTemplate, setPreset, reset, saveAndCreateDocument, isCreating]
  )

  return (
    <SubwayBuilderContext.Provider value={contextValue}>
      {children}
    </SubwayBuilderContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useSubwayBuilder(): SubwayBuilderContextValue {
  const context = useContext(SubwayBuilderContext)
  if (!context) {
    throw new Error(
      'useSubwayBuilder must be used within a SubwayBuilderProvider'
    )
  }
  return context
}

// ============================================
// Utilities
// ============================================

/** 템플릿 ID 목록 */
export const TEMPLATE_IDS = [
  'unique1',
  'unique2',
  'unique3',
  'unique4',
  'unique5',
  'unique6',
] as const

export type TemplateId = (typeof TEMPLATE_IDS)[number]

/** 템플릿별 라벨 */
export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  unique1: '클래식',
  unique2: '캐주얼',
  unique3: '미니멀',
  unique4: '다크',
  unique5: '브라이트',
  unique6: '모노크롬',
}

/** 템플릿별 설명 */
export const TEMPLATE_DESCRIPTIONS: Record<TemplateId, string> = {
  unique1: '우아하고 고전적인 스타일',
  unique2: '밝고 경쾌한 분위기',
  unique3: '깔끔하고 현대적인 디자인',
  unique4: '세련되고 시크한 무드',
  unique5: '화사하고 밝은 느낌',
  unique6: '모던하고 도시적인 감성',
}
