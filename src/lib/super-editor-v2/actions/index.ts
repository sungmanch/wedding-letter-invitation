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

// Geocode
export { geocodeAddress, type GeocodeResult } from './geocode'

// Branch CRUD
export {
  createBranch,
  getBranch,
  getPublishedBranch,
  listBranches,
  listAllBranches,
  deleteBranch,
  updateBranch,
  updateBranchBlocks,
  updateBranchStyle,
  updateBranchOgMetadata,
  getBranchParentData,
  getBranchParentDocument,
  type BranchWithData,
} from './branch'
