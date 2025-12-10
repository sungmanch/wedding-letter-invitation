export { PhotoBooth } from './PhotoBooth';
export type { PhotoBoothRef, PhotoBoothProps } from './PhotoBooth';

export { PhotoBoothModal } from './PhotoBoothModal';
export type { PhotoBoothModalProps } from './PhotoBoothModal';

export { FrameEditor } from './FrameEditor';
export type { FrameEditorRef, FrameEditorProps } from './FrameEditor';

export { useCamera } from './useCamera';
export { useFrameEditor, FRAME_CANVAS_WIDTH, FRAME_CANVAS_HEIGHT } from './useFrameEditor';

export { FILTERS, FILTER_LIST, applyFilter } from './filters';
export { DEFAULT_FRAMES, drawFrameOverlay, drawTextOverlay, loadImage } from './frames';
export {
  DEFAULT_STICKERS,
  createPlacedSticker,
  drawSticker,
  drawAllStickers,
  hitTestSticker,
  moveSticker,
  resizeSticker,
  rotateSticker,
} from './stickers';

export type {
  CameraFacing,
  CameraState,
  FilterType,
  Filter,
  Frame,
  Sticker,
  PlacedSticker,
  FrameOverlay,
  PhotoBoothState,
  // Frame Editor types
  PersonType,
  PersonImage,
  CustomFrame,
  FrameEditorStep,
  FrameEditorState,
} from './types';
