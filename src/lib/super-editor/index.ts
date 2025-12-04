/**
 * Super Editor
 * LLM 기반 동적 청첩장 에디터 시스템
 *
 * 구성:
 * - 28개 Primitives (기본 블록)
 * - 30+ Animation Presets
 * - 15+ Transition Presets
 * - Schema Types (Layout, Style, Editor, UserData)
 */

// Schema Types
export * from './schema'

// Animation Presets
export * from './animations'

// Primitive Renderers
export * from './primitives'

// Re-export key types for convenience
export type {
  PrimitiveType,
  PrimitiveNode,
  CSSProperties,
  AnimationPreset,
  TransitionPreset,
  EasingType,
} from './schema/primitives'

export type {
  LayoutSchema,
  Screen,
  ScreenType,
} from './schema/layout'

export type {
  StyleSchema,
  ThemeConfig,
  ColorPalette,
} from './schema/style'

export type {
  EditorSchema,
  EditorSection,
  EditorField,
  FieldType,
} from './schema/editor'

export type {
  UserData,
  WeddingInvitationData,
} from './schema/user-data'

export type {
  SuperEditorTemplate,
  SuperEditorInvitation,
  BuildResult,
} from './schema'
