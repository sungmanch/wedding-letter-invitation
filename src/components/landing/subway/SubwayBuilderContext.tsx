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
  type ReactNode,
} from 'react'
import type { BlockType } from '@/lib/super-editor-v2/schema/types'
import { getTemplateV2ById } from '@/lib/super-editor-v2/config/template-catalog-v2'
import { buildStyleSystemFromTemplate } from '@/lib/super-editor-v2/services/template-applier'
import {
  resolveStyle,
  styleToCSSVariables,
} from '@/lib/super-editor-v2/renderer/style-resolver'
import { DEFAULT_STYLE_SYSTEM } from '@/lib/super-editor-v2/schema'

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
      payload: { templateId: string; cssVariables: Record<string, string> }
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
}

// ============================================
// Constants
// ============================================

/** 기본 프리셋 선택 */
export const DEFAULT_PRESETS: SelectedPresets = {
  hero: 'hero-fullscreen-overlay',
  'greeting-parents': 'greeting-parents-minimal',
  calendar: 'calendar-korean-countdown-box',
  gallery: 'gallery-square-3col',
  location: 'location-minimal',
}

/** 섹션 순서 (표시 순서) */
export const SECTION_ORDER: SelectableSectionType[] = [
  'hero',
  'greeting-parents',
  'calendar',
  'gallery',
  'location',
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
  const [state, dispatch] = useReducer(subwayBuilderReducer, INITIAL_STATE)

  // Hero 템플릿 선택 시 색상 전파
  const setTemplate = useCallback((templateId: string) => {
    const template = getTemplateV2ById(templateId)
    if (!template) {
      console.warn(`Template not found: ${templateId}`)
      return
    }

    const style = buildStyleSystemFromTemplate(template, DEFAULT_STYLE_SYSTEM)
    const resolved = resolveStyle(style)
    const cssVariables = styleToCSSVariables(resolved)

    dispatch({
      type: 'SET_TEMPLATE',
      payload: { templateId, cssVariables },
    })
  }, [])

  // 섹션 프리셋 선택
  const setPreset = useCallback(
    (sectionType: SelectableSectionType, presetId: string) => {
      dispatch({
        type: 'SET_PRESET',
        payload: { sectionType, presetId },
      })
    },
    []
  )

  // 초기화
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const contextValue = useMemo<SubwayBuilderContextValue>(
    () => ({
      state,
      setTemplate,
      setPreset,
      reset,
    }),
    [state, setTemplate, setPreset, reset]
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
