/**
 * Super Editor v2 - Block Preset Types
 *
 * 블록 프리셋 공통 타입 정의
 */

import type { BlockType, VariablePath, Element, BlockLayout, SizeMode } from '../../schema/types'

/**
 * Preset element definition - simplified Element for preset defaults
 * id is auto-generated when applying preset
 * children are also PresetElement for nested Group structures
 */
export type PresetElement = Omit<Element, 'id' | 'children'> & {
  id?: string
  children?: PresetElement[] // 재귀적 정의 for Group children
}

// ============================================
// Modal Types (for blocks with popup UI)
// ============================================

export interface ModalPreset {
  /** Modal container style */
  style: {
    background: string
    borderRadius: number
    padding: number
  }

  /** Modal header configuration */
  header: {
    title: string
    subtitle?: string
    showCloseButton: boolean
    style: {
      text: {
        fontFamily: string
        fontSize: string
        fontWeight: number
        color: string
      }
      subtitleText?: {
        fontFamily: string
        fontSize: string
        fontWeight: number
        color: string
      }
    }
  }

  /** Modal form sections */
  sections: ModalSection[]

  /** Submit button configuration */
  submitButton: {
    label: string
    style: {
      background: string
      color: string
      fontFamily: string
      fontSize: string
      fontWeight: number
      borderRadius: number
      padding: string
    }
  }
}

export type ModalSection =
  | ToggleSectionConfig
  | TabSectionConfig
  | TextInputSectionConfig
  | TextareaSectionConfig
  | RadioSectionConfig
  | CheckboxSectionConfig

interface BaseSectionConfig {
  id: string
  label?: string
  required?: boolean
}

export interface ToggleSectionConfig extends BaseSectionConfig {
  type: 'toggle'
  options: { value: string; label: string; icon?: string }[]
  style: {
    activeBackground: string
    activeColor: string
    inactiveBackground: string
    inactiveColor: string
    borderColor: string
  }
}

export interface TabSectionConfig extends BaseSectionConfig {
  type: 'tab'
  options: { value: string; label: string; icon?: string }[]
  style: {
    activeBackground: string
    activeBorderColor: string
    inactiveBorderColor: string
  }
}

export interface TextInputSectionConfig extends BaseSectionConfig {
  type: 'text-input'
  placeholder?: string
  style: {
    labelColor: string
    inputBorderColor: string
    placeholderColor: string
  }
}

export interface TextareaSectionConfig extends BaseSectionConfig {
  type: 'textarea'
  placeholder?: string
  maxLength?: number
  style: {
    labelColor: string
    inputBorderColor: string
    placeholderColor: string
  }
}

export interface RadioSectionConfig extends BaseSectionConfig {
  type: 'radio'
  options: { value: string; label: string }[]
  style: {
    activeColor: string
    inactiveColor: string
  }
}

export interface CheckboxSectionConfig extends BaseSectionConfig {
  type: 'checkbox'
  description?: string
  style: {
    labelColor: string
    descriptionColor: string
    checkboxColor: string
  }
}

/**
 * Block variant preset - defines a specific design variant for a block type
 * Migrated from super-editor/skeletons system
 */
export interface BlockPreset {
  /** Unique identifier: `${blockType}-${variant}` */
  id: string

  /** Block type this preset applies to */
  blockType: BlockType

  /** Variant name (e.g., 'countdown', 'calendar', 'letterpress') */
  variant: string

  /** Display name in English */
  name: string

  /** Display name in Korean */
  nameKo: string

  /** Description of this variant */
  description: string

  /** Design intent tags for AI matching */
  tags: readonly string[]

  /** Complexity level for AI understanding */
  complexity: 'low' | 'medium' | 'high'

  /** Required data bindings */
  bindings: readonly VariablePath[]

  /** Default block height in vh or SizeMode */
  defaultHeight?: number | SizeMode

  /** Block layout configuration (auto-layout support) */
  layout?: BlockLayout

  /** Default elements for this preset */
  defaultElements?: PresetElement[]

  /** Special components used in this variant */
  specialComponents?: readonly string[]

  /** Recommended animation preset IDs */
  recommendedAnimations?: readonly string[]

  /** Recommended theme preset IDs */
  recommendedThemes?: readonly string[]

  /** AI prompt hints for generation */
  aiHints?: {
    mood: readonly string[]
    style: readonly string[]
    useCase: readonly string[]
  }

  /** Related preset IDs (same style family) */
  relatedPresets?: readonly string[]

  /** Modal configuration (for blocks with popup UI like RSVP) */
  modal?: ModalPreset
}
