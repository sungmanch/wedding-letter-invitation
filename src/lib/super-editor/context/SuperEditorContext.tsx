/* eslint-disable react-hooks/purity */
'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { format, parseISO, differenceInDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { LayoutSchema } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { UserData } from '../schema/user-data'
import type { PrimitiveNode } from '../schema/primitives'

// ============================================
// State Types
// ============================================

export interface SuperEditorState {
  // 스키마 데이터
  layout: LayoutSchema | null
  style: StyleSchema | null
  // editor는 더 이상 저장하지 않음 (Layout의 {{변수}}에서 동적 생성)
  userData: UserData | null

  // UI 상태
  selectedNodeId: string | null
  selectedFieldId: string | null
  activeScreenIndex: number
  mode: 'edit' | 'preview'

  // 히스토리
  history: HistoryEntry[]
  historyIndex: number

  // 로딩/에러 상태
  loading: boolean
  error: string | null
  dirty: boolean
}

export interface HistoryEntry {
  userData: UserData
  timestamp: number
  description: string
}

// ============================================
// Action Types
// ============================================

export type SuperEditorAction =
  | { type: 'SET_TEMPLATE'; layout: LayoutSchema; style: StyleSchema }
  | { type: 'SET_USER_DATA'; userData: UserData }
  | { type: 'SET_STYLE'; style: StyleSchema }
  | { type: 'UPDATE_FIELD'; fieldPath: string; value: unknown }
  | { type: 'SELECT_NODE'; nodeId: string | null }
  | { type: 'SELECT_FIELD'; fieldId: string | null }
  | { type: 'SET_ACTIVE_SCREEN'; index: number }
  | { type: 'SET_MODE'; mode: 'edit' | 'preview' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' }

// ============================================
// Initial State
// ============================================

const initialState: SuperEditorState = {
  layout: null,
  style: null,
  userData: null,
  selectedNodeId: null,
  selectedFieldId: null,
  activeScreenIndex: 0,
  mode: 'edit',
  history: [],
  historyIndex: -1,
  loading: false,
  error: null,
  dirty: false,
}

// ============================================
// Reducer
// ============================================

/**
 * 경로 문자열을 파싱해서 배열로 변환
 * 'accounts.groom[0].bank' → ['accounts', 'groom', 0, 'bank']
 */
function parsePath(path: string): (string | number)[] {
  const result: (string | number)[] = []
  const regex = /([^.\[\]]+)|\[(\d+)\]/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(path)) !== null) {
    if (match[1] !== undefined) {
      result.push(match[1])
    } else if (match[2] !== undefined) {
      result.push(parseInt(match[2], 10))
    }
  }

  return result
}

function setValueByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const parts = parsePath(path)
  const result = JSON.parse(JSON.stringify(obj)) // deep clone
  let current: unknown = result

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    const nextPart = parts[i + 1]

    if (typeof part === 'number') {
      // 현재 파트가 배열 인덱스
      const arr = current as unknown[]
      if (!arr[part]) {
        arr[part] = typeof nextPart === 'number' ? [] : {}
      }
      current = arr[part]
    } else {
      // 현재 파트가 객체 키
      const obj = current as Record<string, unknown>
      if (!obj[part]) {
        obj[part] = typeof nextPart === 'number' ? [] : {}
      }
      current = obj[part]
    }
  }

  // 마지막 파트에 값 설정
  const lastPart = parts[parts.length - 1]
  if (typeof lastPart === 'number') {
    (current as unknown[])[lastPart] = value
  } else {
    (current as Record<string, unknown>)[lastPart] = value
  }

  return result
}

/**
 * 데이터에서 값을 path로 가져오기
 */
function getValueByPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return current
}

/**
 * wedding.date 또는 wedding.time 변경 시 파생 필드 자동 계산
 */
function computeDerivedFields(
  data: Record<string, unknown>,
  fieldPath: string,
  value: unknown
): Record<string, unknown> {
  let result = data

  // wedding.date 변경 시 날짜 관련 파생 필드 계산
  if (fieldPath === 'wedding.date' && typeof value === 'string' && value) {
    try {
      const date = parseISO(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // 한글 날짜 표시 (2025년 3월 15일 토요일)
      const dateDisplay = format(date, 'yyyy년 M월 d일 EEEE', { locale: ko })
      result = setValueByPath(result, 'wedding.dateDisplay', dateDisplay)

      // 영문 날짜 표시 (Saturday, March 15, 2025)
      const dateEn = format(date, 'EEEE, MMMM d, yyyy')
      result = setValueByPath(result, 'wedding.dateEn', dateEn)

      // Calendar variant용 파생 필드
      result = setValueByPath(result, 'wedding.month', format(date, 'yyyy년 M월', { locale: ko }))
      result = setValueByPath(result, 'wedding.day', format(date, 'd'))
      result = setValueByPath(result, 'wedding.weekday', format(date, 'EEEE', { locale: ko }))

      // Typography Bold variant용 파생 필드
      result = setValueByPath(result, 'wedding.monthDay', format(date, 'MM/dd')) // 05/30
      result = setValueByPath(result, 'wedding.year', format(date, 'yyyy')) // 2025
      result = setValueByPath(result, 'wedding.monthNameEn', format(date, 'MMMM').toUpperCase()) // SEPTEMBER

      // Save The Date variant용 파생 필드
      result = setValueByPath(result, 'wedding.dateFormatted', format(date, 'yyyy. MM. dd')) // 2025. 06. 21
      result = setValueByPath(result, 'wedding.dayOfWeek', format(date, 'EEEE').toUpperCase()) // SATURDAY

      // Photo Overlay variant용 파생 필드 (2자리 패딩)
      result = setValueByPath(result, 'wedding.monthPadded', format(date, 'MM')) // 04, 06, 12
      result = setValueByPath(result, 'wedding.dayPadded', format(date, 'dd')) // 04, 15, 31
      result = setValueByPath(result, 'wedding.yearShort', format(date, 'yy')) // 24, 25, 26

      // 계절 + 시간대 계산
      const month = date.getMonth() + 1
      let season = ''
      if (month >= 3 && month <= 5) season = 'SPRING'
      else if (month >= 6 && month <= 8) season = 'SUMMER'
      else if (month >= 9 && month <= 11) season = 'AUTUMN'
      else season = 'WINTER'
      result = setValueByPath(result, 'wedding.season', season)

      // D-Day 계산
      const dday = differenceInDays(date, today)
      result = setValueByPath(result, 'wedding.dday', dday)
      result = setValueByPath(result, 'countdown.days', dday)
    } catch (e) {
      console.error('Failed to compute date derived fields:', e)
    }
  }

  // wedding.time 변경 시 시간 관련 파생 필드 계산
  if (fieldPath === 'wedding.time' && typeof value === 'string' && value) {
    try {
      const [hours, minutes] = value.split(':').map(Number)
      const period = hours >= 12 ? '오후' : '오전'
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours

      // 한글 시간 표시 (오후 2시)
      const timeDisplay = minutes === 0
        ? `${period} ${displayHours}시`
        : `${period} ${displayHours}시 ${minutes}분`
      result = setValueByPath(result, 'wedding.timeDisplay', timeDisplay)

      // 영문 시간 표시 (PM 2:00)
      const periodEn = hours >= 12 ? 'PM' : 'AM'
      const timeEn = `${periodEn} ${displayHours}:${minutes.toString().padStart(2, '0')}`
      result = setValueByPath(result, 'wedding.timeEn', timeEn)

      // 24시간 형식 시간 (14:00)
      result = setValueByPath(result, 'wedding.time24h', value)

      // 시/분 분리 (Typography Bold용 깜빡이는 콜론)
      result = setValueByPath(result, 'wedding.hours', hours.toString().padStart(2, '0'))
      result = setValueByPath(result, 'wedding.minutes', minutes.toString().padStart(2, '0'))

      // 12시간 형식 시간 (2PM, 6PM)
      const time12h = minutes === 0
        ? `${displayHours}${periodEn}`
        : `${displayHours}:${minutes.toString().padStart(2, '0')}${periodEn}`
      result = setValueByPath(result, 'wedding.time12h', time12h)

      // Save The Date variant용 - 시간대 (NIGHT, AFTERNOON 등)
      let timeOfDay = ''
      if (hours >= 6 && hours < 12) timeOfDay = 'MORNING'
      else if (hours >= 12 && hours < 17) timeOfDay = 'AFTERNOON'
      else if (hours >= 17 && hours < 21) timeOfDay = 'EVENING'
      else timeOfDay = 'NIGHT'
      result = setValueByPath(result, 'wedding.timeOfDay', timeOfDay)

      // seasonTime은 season + timeOfDay 조합 (예: SUMMER NIGHT)
      // season은 date에서 계산되므로 여기서는 timeOfDay만 저장
    } catch (e) {
      console.error('Failed to compute time derived fields:', e)
    }
  }

  return result
}

/**
 * 초기 데이터 로드 시 모든 파생 필드 계산
 */
function computeAllDerivedFields(data: Record<string, unknown>): Record<string, unknown> {
  let result = data

  // wedding.date에서 파생 필드 계산
  const weddingDate = getValueByPath(data, 'wedding.date')
  if (weddingDate && typeof weddingDate === 'string') {
    result = computeDerivedFields(result, 'wedding.date', weddingDate)
  }

  // wedding.time에서 파생 필드 계산
  const weddingTime = getValueByPath(data, 'wedding.time')
  if (weddingTime && typeof weddingTime === 'string') {
    result = computeDerivedFields(result, 'wedding.time', weddingTime)
  }

  return result
}

function superEditorReducer(
  state: SuperEditorState,
  action: SuperEditorAction
): SuperEditorState {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return {
        ...state,
        layout: action.layout,
        style: action.style,
        loading: false,
        error: null,
      }

    case 'SET_USER_DATA': {
      // 초기 데이터 로드 시 파생 필드 계산
      const computedData = computeAllDerivedFields(
        action.userData.data as Record<string, unknown>
      )
      const userDataWithDerived: UserData = {
        ...action.userData,
        data: computedData,
      }
      return {
        ...state,
        userData: userDataWithDerived,
        history: [
          {
            userData: userDataWithDerived,
            timestamp: Date.now(),
            description: 'Initial load',
          },
        ],
        historyIndex: 0,
        dirty: false,
      }
    }

    case 'SET_STYLE':
      return {
        ...state,
        style: action.style,
        dirty: true,
      }

    case 'UPDATE_FIELD': {
      if (!state.userData) return state

      // 먼저 기본 필드 업데이트
      let newData = setValueByPath(
        state.userData.data as Record<string, unknown>,
        action.fieldPath,
        action.value
      )

      // 파생 필드 자동 계산 (wedding.date → dateDisplay 등)
      newData = computeDerivedFields(newData, action.fieldPath, action.value)

      const newUserData: UserData = {
        ...state.userData,
        data: newData,
      }

      // 히스토리에 추가 (현재 위치 이후 삭제)
      const newHistory = [
        ...state.history.slice(0, state.historyIndex + 1),
        {
          userData: newUserData,
          timestamp: Date.now(),
          description: `Update ${action.fieldPath}`,
        },
      ]

      return {
        ...state,
        userData: newUserData,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        dirty: true,
      }
    }

    case 'SELECT_NODE':
      return {
        ...state,
        selectedNodeId: action.nodeId,
      }

    case 'SELECT_FIELD':
      return {
        ...state,
        selectedFieldId: action.fieldId,
      }

    case 'SET_ACTIVE_SCREEN':
      return {
        ...state,
        activeScreenIndex: action.index,
      }

    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
        selectedNodeId: action.mode === 'preview' ? null : state.selectedNodeId,
      }

    case 'UNDO':
      if (state.historyIndex <= 0) return state
      return {
        ...state,
        userData: state.history[state.historyIndex - 1].userData,
        historyIndex: state.historyIndex - 1,
        dirty: true,
      }

    case 'REDO':
      if (state.historyIndex >= state.history.length - 1) return state
      return {
        ...state,
        userData: state.history[state.historyIndex + 1].userData,
        historyIndex: state.historyIndex + 1,
        dirty: true,
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        loading: false,
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

// ============================================
// Context
// ============================================

interface SuperEditorContextValue {
  state: SuperEditorState
  dispatch: React.Dispatch<SuperEditorAction>
  // 청첩장 ID (이미지 업로드 등에 사용)
  invitationId: string | undefined
  // 편의 함수들
  setTemplate: (layout: LayoutSchema, style: StyleSchema) => void
  setUserData: (userData: UserData) => void
  setStyle: (style: StyleSchema) => void
  updateField: (fieldPath: string, value: unknown) => void
  selectNode: (nodeId: string | null) => void
  selectField: (fieldId: string | null) => void
  setActiveScreen: (index: number) => void
  setMode: (mode: 'edit' | 'preview') => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  // 데이터 접근
  getFieldValue: (fieldPath: string) => unknown
  getCurrentScreen: () => PrimitiveNode | null
}

const SuperEditorContext = createContext<SuperEditorContextValue | null>(null)

// ============================================
// Provider
// ============================================

interface SuperEditorProviderProps {
  children: ReactNode
  invitationId?: string
  initialTemplate?: {
    layout: LayoutSchema
    style: StyleSchema
  }
  initialUserData?: UserData
}

export function SuperEditorProvider({
  children,
  invitationId,
  initialTemplate,
  initialUserData,
}: SuperEditorProviderProps) {
  const [state, dispatch] = useReducer(superEditorReducer, {
    ...initialState,
    layout: initialTemplate?.layout || null,
    style: initialTemplate?.style || null,
    userData: initialUserData || null,
    history: initialUserData
      ? [{ userData: initialUserData, timestamp: Date.now(), description: 'Initial' }]
      : [],
    historyIndex: initialUserData ? 0 : -1,
  })

  // 편의 함수들
  const setTemplate = useCallback(
    (layout: LayoutSchema, style: StyleSchema) => {
      dispatch({ type: 'SET_TEMPLATE', layout, style })
    },
    []
  )

  const setUserData = useCallback((userData: UserData) => {
    dispatch({ type: 'SET_USER_DATA', userData })
  }, [])

  const setStyle = useCallback((style: StyleSchema) => {
    dispatch({ type: 'SET_STYLE', style })
  }, [])

  const updateField = useCallback((fieldPath: string, value: unknown) => {
    dispatch({ type: 'UPDATE_FIELD', fieldPath, value })
  }, [])

  const selectNode = useCallback((nodeId: string | null) => {
    dispatch({ type: 'SELECT_NODE', nodeId })
  }, [])

  const selectField = useCallback((fieldId: string | null) => {
    dispatch({ type: 'SELECT_FIELD', fieldId })
  }, [])

  const setActiveScreen = useCallback((index: number) => {
    dispatch({ type: 'SET_ACTIVE_SCREEN', index })
  }, [])

  const setMode = useCallback((mode: 'edit' | 'preview') => {
    dispatch({ type: 'SET_MODE', mode })
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [])

  const getFieldValue = useCallback(
    (fieldPath: string): unknown => {
      if (!state.userData?.data) return undefined

      const parts = parsePath(fieldPath)
      let current: unknown = state.userData.data

      for (const part of parts) {
        if (current === null || current === undefined) return undefined
        if (typeof part === 'number') {
          // 배열 인덱스
          if (Array.isArray(current)) {
            current = current[part]
          } else {
            return undefined
          }
        } else {
          // 객체 키
          if (typeof current === 'object') {
            current = (current as Record<string, unknown>)[part]
          } else {
            return undefined
          }
        }
      }

      return current
    },
    [state.userData]
  )

  const getCurrentScreen = useCallback((): PrimitiveNode | null => {
    if (!state.layout?.screens) return null
    const screen = state.layout.screens[state.activeScreenIndex]
    return screen?.root || null
  }, [state.layout, state.activeScreenIndex])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      invitationId,
      setTemplate,
      setUserData,
      setStyle,
      updateField,
      selectNode,
      selectField,
      setActiveScreen,
      setMode,
      undo,
      redo,
      canUndo: state.historyIndex > 0,
      canRedo: state.historyIndex < state.history.length - 1,
      getFieldValue,
      getCurrentScreen,
    }),
    [
      state,
      invitationId,
      setTemplate,
      setUserData,
      setStyle,
      updateField,
      selectNode,
      selectField,
      setActiveScreen,
      setMode,
      undo,
      redo,
      getFieldValue,
      getCurrentScreen,
    ]
  )

  return (
    <SuperEditorContext.Provider value={value}>
      {children}
    </SuperEditorContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useSuperEditor() {
  const context = useContext(SuperEditorContext)
  if (!context) {
    throw new Error('useSuperEditor must be used within a SuperEditorProvider')
  }
  return context
}

// ============================================
// Selector Hooks
// ============================================

export function useSuperEditorState() {
  const { state } = useSuperEditor()
  return state
}

export function useSuperEditorLayout() {
  const { state } = useSuperEditor()
  return state.layout
}

export function useSuperEditorStyle() {
  const { state } = useSuperEditor()
  return state.style
}

export function useSuperEditorUserData() {
  const { state } = useSuperEditor()
  return state.userData
}

export function useSelectedNode() {
  const { state } = useSuperEditor()
  return state.selectedNodeId
}

export function useEditorMode() {
  const { state, setMode } = useSuperEditor()
  return { mode: state.mode, setMode }
}
