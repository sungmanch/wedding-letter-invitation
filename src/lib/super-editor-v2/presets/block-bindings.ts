/**
 * Super Editor v2 - Block Bindings
 *
 * 블록 타입별 데이터 바인딩 요구사항 정의
 * skeleton DataSlot → BlockDataBinding 마이그레이션
 */

import type { BlockType, VariablePath } from '../schema/types'

// ============================================
// Types
// ============================================

/**
 * Data binding requirement for a block type
 */
export interface BlockDataBinding {
  /** Variable path (e.g., 'couple.groom.name') */
  path: VariablePath

  /** Data type */
  type: 'text' | 'image' | 'images' | 'date' | 'time' | 'location' | 'phone' | 'account' | 'select'

  /** Whether this binding is required */
  required: boolean

  /** Description for editor UI */
  description: string

  /** Description in Korean */
  descriptionKo: string

  /** Default value if not provided */
  defaultValue?: unknown
}

// ============================================
// Calendar Block Bindings (from date skeleton)
// ============================================

const CALENDAR_BINDINGS: readonly BlockDataBinding[] = [
  {
    path: 'wedding.date',
    type: 'date',
    required: true,
    description: 'Wedding date',
    descriptionKo: '예식 날짜',
    defaultValue: '2025-03-15',
  },
  {
    path: 'wedding.time',
    type: 'time',
    required: true,
    description: 'Wedding time',
    descriptionKo: '예식 시간',
    defaultValue: '14:00',
  },
  {
    path: 'couple.groom.name',
    type: 'text',
    required: false,
    description: 'Groom name',
    descriptionKo: '신랑 이름',
    defaultValue: '신랑',
  },
  {
    path: 'couple.bride.name',
    type: 'text',
    required: false,
    description: 'Bride name',
    descriptionKo: '신부 이름',
    defaultValue: '신부',
  },
  {
    path: 'couple.photo',
    type: 'image',
    required: false,
    description: 'Couple photo',
    descriptionKo: '커플 사진',
    defaultValue: '/images/placeholder-couple.jpg',
  },
  {
    path: 'venue.name',
    type: 'text',
    required: false,
    description: 'Venue name',
    descriptionKo: '예식장 이름',
    defaultValue: '예식장',
  },
  {
    path: 'venue.hall',
    type: 'text',
    required: false,
    description: 'Hall name',
    descriptionKo: '홀 이름',
    defaultValue: '',
  },
]

// ============================================
// Block Bindings Registry
// ============================================

/**
 * Complete data requirements for each block type
 */
export const BLOCK_BINDINGS: Partial<Record<BlockType, readonly BlockDataBinding[]>> = {
  calendar: CALENDAR_BINDINGS,

  // Future block bindings:
  // hero: HERO_BINDINGS,
  // 'greeting-parents': GREETING_PARENTS_BINDINGS,
  // profile: PROFILE_BINDINGS,
  // gallery: GALLERY_BINDINGS,
  // rsvp: RSVP_BINDINGS,
  // location: LOCATION_BINDINGS,
  // notice: NOTICE_BINDINGS,
  // account: ACCOUNT_BINDINGS,
  // message: MESSAGE_BINDINGS,
  // ending: ENDING_BINDINGS,
  // music: MUSIC_BINDINGS,
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get required bindings for a block type
 */
export function getBlockBindings(blockType: BlockType): readonly BlockDataBinding[] {
  return BLOCK_BINDINGS[blockType] ?? []
}

/**
 * Get required variable paths for a block type
 */
export function getRequiredPaths(blockType: BlockType): readonly VariablePath[] {
  return getBlockBindings(blockType)
    .filter(b => b.required)
    .map(b => b.path)
}

/**
 * Get all variable paths for a block type (required + optional)
 */
export function getAllPaths(blockType: BlockType): readonly VariablePath[] {
  return getBlockBindings(blockType).map(b => b.path)
}

/**
 * Get binding info for a specific path
 */
export function getBindingInfo(
  blockType: BlockType,
  path: VariablePath
): BlockDataBinding | undefined {
  return getBlockBindings(blockType).find(b => b.path === path)
}

/**
 * Validate if all required bindings are satisfied
 */
export function validateBindings(
  blockType: BlockType,
  data: Record<string, unknown>
): { valid: boolean; missing: VariablePath[] } {
  const required = getRequiredPaths(blockType)
  const missing = required.filter(path => {
    const value = getNestedValue(data, path)
    return value === undefined || value === null || value === ''
  })
  return { valid: missing.length === 0, missing }
}

/**
 * Get default values for a block type
 */
export function getDefaultValues(
  blockType: BlockType
): Record<string, unknown> {
  const bindings = getBlockBindings(blockType)
  const defaults: Record<string, unknown> = {}

  for (const binding of bindings) {
    if (binding.defaultValue !== undefined) {
      setNestedValue(defaults, binding.path, binding.defaultValue)
    }
  }

  return defaults
}

// ============================================
// Internal Helpers
// ============================================

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current === null || current === undefined) return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!

  let current = obj
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }

  current[lastKey] = value
}
