/**
 * Super Editor v2 - Block Preset Types
 *
 * 블록 프리셋 공통 타입 정의
 */

import type { BlockType, VariablePath, Element } from '../../schema/types'

/**
 * Preset element definition - simplified Element for preset defaults
 * id is auto-generated when applying preset
 */
export type PresetElement = Omit<Element, 'id'> & { id?: string }

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

  /** Default block height in vh */
  defaultHeight?: number

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
}
