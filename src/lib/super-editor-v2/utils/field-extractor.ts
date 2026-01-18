/**
 * Field Extractor Utility
 *
 * 블록에서 편집 가능한 필드를 추출하는 유틸리티
 */

import type { Block, Element, WeddingData, VariablePath } from '../schema/types'
import { resolveBinding, isCustomVariablePath, getCustomVariableKey } from './binding-resolver'
import { getBlockPreset } from '../presets/blocks'
import {
  HIDDEN_VARIABLE_PATHS,
  DERIVED_TO_INPUT_MAP,
  getEditableBinding,
} from '../config/variable-field-config'

// ============================================
// Types
// ============================================

export interface EditableField {
  elementId: string
  binding: VariablePath
  type: string
  value: unknown
}

// ============================================
// Format Variable Extraction
// ============================================

/**
 * format 문자열에서 변수 경로 추출
 * 예: '{parents.groom.father.name}·{parents.groom.mother.name}의 장남 {couple.groom.name}'
 *     → ['parents.groom.father.name', 'parents.groom.mother.name', 'couple.groom.name']
 */
export function extractFormatVariables(format: string): string[] {
  const regex = /\{([^}]+)\}/g
  const matches: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(format)) !== null) {
    matches.push(match[1])
  }

  return matches
}

// ============================================
// Field Extraction
// ============================================

/**
 * 블록에서 편집 가능한 필드 목록 추출
 *
 * @param block - 대상 블록
 * @param data - WeddingData (값 조회용)
 * @returns 편집 가능한 필드 배열
 */
export function extractEditableFields(block: Block, data: WeddingData): EditableField[] {
  const seenBindings = new Set<string>()
  const fields: EditableField[] = []

  // 바인딩 추가 헬퍼 함수
  const addBinding = (elementId: string, binding: VariablePath, type: string) => {
    // 자동 계산 필드는 대응 입력 필드로 변환
    let finalBinding: VariablePath = binding
    if (HIDDEN_VARIABLE_PATHS.has(binding)) {
      const inputBinding = DERIVED_TO_INPUT_MAP[binding]
      if (inputBinding) {
        finalBinding = inputBinding
      } else {
        return // 매핑 없으면 숨김
      }
    }

    // Computed field는 source field로 변환 (wedding.timeDisplay → wedding.time)
    finalBinding = getEditableBinding(finalBinding)

    // 커스텀 줄 인덱스 바인딩 통합: custom.heroQuote.0 → custom.heroQuote
    const customLineMatch = finalBinding.match(/^(custom\.\w+)\.\d+$/)
    if (customLineMatch) {
      finalBinding = customLineMatch[1] as VariablePath
    }

    // 같은 바인딩은 한 번만 표시
    if (seenBindings.has(finalBinding)) return
    seenBindings.add(finalBinding)

    // 값 조회 (배열 타입은 특별 처리)
    const value = getFieldValue(data, finalBinding)

    fields.push({
      elementId,
      binding: finalBinding,
      type,
      value,
    })
  }

  // 요소 트리 재귀 순회 함수 (Group children 포함)
  const processElementTree = (el: Element) => {
    // 1. 직접 바인딩된 요소
    if (el.binding) {
      addBinding(el.id, el.binding, el.type)
    }

    // 2. format 속성에서 변수 추출 (예: '{parents.groom.father.name}·{parents.groom.mother.name}의 장남 {couple.groom.name}')
    const props = el.props as { format?: string; action?: string }
    if (props.format) {
      const formatVars = extractFormatVariables(props.format)
      for (const varPath of formatVars) {
        addBinding(el.id, varPath as VariablePath, el.type)
      }
    }

    // 3. contact-modal 버튼이 있으면 전화번호 필드들 자동 추가
    if (el.type === 'button' && props.action === 'contact-modal') {
      // 신랑측 전화번호
      addBinding(el.id, 'couple.groom.phone', 'phone')
      addBinding(el.id, 'parents.groom.father.phone', 'phone')
      addBinding(el.id, 'parents.groom.mother.phone', 'phone')
      // 신부측 전화번호
      addBinding(el.id, 'couple.bride.phone', 'phone')
      addBinding(el.id, 'parents.bride.father.phone', 'phone')
      addBinding(el.id, 'parents.bride.mother.phone', 'phone')
    }

    // 4. Group children 재귀 처리
    if (el.children && el.children.length > 0) {
      for (const child of el.children) {
        processElementTree(child)
      }
    }
  }

  // 최상위 요소들 순회
  for (const el of block.elements ?? []) {
    processElementTree(el)
  }

  // 5. block.elements가 비어있고 presetId가 있으면 프리셋의 bindings 사용
  if (fields.length === 0 && block.presetId) {
    const preset = getBlockPreset(block.presetId)
    if (preset?.bindings) {
      for (const binding of preset.bindings) {
        addBinding(`preset-${binding}`, binding as VariablePath, 'text')
      }
    }
  }

  // 6. notice 블록은 items가 별도 컴포넌트(swiper)에서 렌더링되므로 필수 필드 강제 추가
  if (block.type === 'notice') {
    const noticeBindings: VariablePath[] = [
      'notice.sectionTitle',
      'notice.items',
    ]
    for (const binding of noticeBindings) {
      if (!seenBindings.has(binding)) {
        addBinding(`notice-${binding}`, binding, 'text')
      }
    }
  }

  // 7. music 블록은 FAB로 렌더링되므로 필수 필드 강제 추가
  if (block.type === 'music') {
    const musicBindings: VariablePath[] = ['music.url', 'music.autoPlay']
    for (const binding of musicBindings) {
      if (!seenBindings.has(binding)) {
        addBinding(`music-${binding}`, binding, 'text')
      }
    }
  }

  return fields
}

// ============================================
// Value Resolution
// ============================================

/**
 * 필드 값 조회 (배열 타입 특별 처리)
 */
function getFieldValue(data: WeddingData, binding: VariablePath): unknown {
  // gallery, notice.items, transportation 바인딩은 배열을 그대로 가져와야 함
  if (binding === 'photos.gallery') {
    return data.photos?.gallery ?? []
  }
  if (binding === 'notice.items') {
    return data.notice?.items ?? []
  }
  if (binding === 'venue.transportation.subway') {
    return data.venue?.transportation?.subway ?? []
  }
  if (binding === 'venue.transportation.bus') {
    return data.venue?.transportation?.bus ?? []
  }
  if (binding === 'venue.transportation.shuttle') {
    return data.venue?.transportation?.shuttle ?? []
  }
  if (binding === 'venue.transportation.parking') {
    return data.venue?.transportation?.parking ?? []
  }
  if (binding === 'venue.transportation.etc') {
    return data.venue?.transportation?.etc ?? []
  }
  if (isCustomVariablePath(binding)) {
    const key = getCustomVariableKey(binding)
    return key ? data.custom?.[key] ?? '' : ''
  }

  return resolveBinding(data, binding)
}

// ============================================
// Nested Value Setter
// ============================================

/**
 * 중첩된 객체에 값 설정 (immutable)
 */
export function setNestedValue<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.')

  function setAt(
    current: Record<string, unknown>,
    keyIndex: number
  ): Record<string, unknown> {
    const key = keys[keyIndex]

    if (keyIndex === keys.length - 1) {
      // 마지막 키: 값 설정
      return { ...current, [key]: value }
    }

    // 중간 키: 재귀적으로 처리
    const nextValue = current[key]
    const nextObj =
      typeof nextValue === 'object' && nextValue !== null
        ? (nextValue as Record<string, unknown>)
        : {}

    return {
      ...current,
      [key]: setAt(nextObj, keyIndex + 1),
    }
  }

  return setAt(obj as Record<string, unknown>, 0) as T
}

// ============================================
// Field Count Check
// ============================================

/**
 * 블록에 편집 가능한 필드가 있는지 확인
 */
export function hasEditableFields(block: Block, data: WeddingData): boolean {
  const fields = extractEditableFields(block, data)
  return fields.length > 0
}
