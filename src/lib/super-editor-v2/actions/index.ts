/**
 * Super Editor v2 - Server Actions
 */

// Document CRUD & Snapshots
export {
  createDocument,
  getDocument,
  getPublishedDocument,
  listDocuments,
  deleteDocument,
  updateBlocks,
  updateStyle,
  updateAnimation,
  updateWeddingData,
  updateOgMetadata,
  createSnapshot,
  listSnapshots,
  restoreSnapshot,
} from './document'

// AI Edit
export {
  applyAIEdit,
  undoLastAIEdit,
  getDocumentContextForAI,
  type AIEditRequest,
  type AIEditResponse,
  type JSONPatch,
} from './ai-edit'
