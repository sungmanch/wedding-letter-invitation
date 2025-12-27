/**
 * Super Editor v2 - Utilities
 *
 * 유틸리티 함수 모음
 */

// Binding Resolver
export {
  resolveBinding,
} from './binding-resolver'

// Interpolation
export {
  interpolate,
} from './interpolate'

// Document Adapter
export {
  toEditorDocument,
  toDbUpdatePayload,
} from './document-adapter'

// Element ID System
export {
  // ID 생성/변환
  getDisplayId,
  bindingToId,
  idToBinding,
  slugify,
  // ID 파싱/검색
  extractElementIds,
  findElementById,
  findElementByBinding,
  // 클립보드
  copyIdToClipboard,
  // 단위 변환
  pxToVw,
  vwToPx,
  pxToVh,
  vhToPx,
  pxToPercent,
  percentToPx,
  // 상수
  BINDING_TO_ID,
  ID_TO_BINDING,
} from './element-id'

// Size Resolution (Auto Layout)
export {
  resolveBlockHeightNumber,
  resolveBlockHeightStyle,
  isAutoLayoutBlock,
  hasAbsolutePosition,
  getElementPosition,
  resolveSizeMode,
  isAutoLayoutElement,
  getAutoLayoutElementStyle,
} from './size-resolver'

// Color Generator (1컬러 시스템)
export {
  generateColorSet,
  deriveFgEmphasis,
  hexToHSL,
  hslToHex,
  SIMPLE_COLOR_PRESETS,
  type SimpleColorSet,
  type HSL,
} from './color-generator'
