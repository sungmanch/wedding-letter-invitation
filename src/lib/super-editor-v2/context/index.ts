/**
 * Super Editor v2 - Context Exports
 */

// Document Context
export {
  DocumentProvider,
  useDocument,
  useDocumentData,
  useDocumentBlocks,
  useDocumentStyle,
  useViewport,
  type DocumentContextValue,
  type ViewportInfo,
} from './document-context'

// Animation Context
export {
  AnimationProvider,
  useAnimation,
  useAnimationState,
  useAnimationController,
  useCurrentState,
  useBlockVisibility,
  type AnimationContextValue,
  type AnimationState,
  type AnimationController,
} from './animation-context'

// Block Context
export {
  BlockProvider,
  useBlock,
  useBlockId,
  useBlockType,
  useBlockElements,
  useElement,
  useBlockEnabled,
  useBlockTokens,
  getDefaultBlockHeight,
  getBlockTypeLabel,
  type BlockContextValue,
} from './block-context'
