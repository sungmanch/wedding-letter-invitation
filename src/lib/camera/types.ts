export type CameraFacing = 'user' | 'environment';

export type CameraState = {
  isStreaming: boolean;
  isCaptured: boolean;
  facing: CameraFacing;
  error: string | null;
};

export type FilterType =
  | 'none'
  | 'bright'
  | 'grayscale'
  | 'sepia'
  | 'contrast'
  | 'warm'
  | 'cool'
  | 'vintage';

export type Filter = {
  name: string;
  type: FilterType;
  apply: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
};

export type Frame = {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl?: string;
};

export type Sticker = {
  id: string;
  name: string;
  emoji?: string;
  imageUrl?: string;
  category: 'general' | 'face-tracking';
};

export type PlacedSticker = {
  id: string;
  sticker: Sticker;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export type FrameOverlay = {
  id: string;
  frame: Frame;
  hostImageUrl?: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  opacity: number;
};

export type PhotoBoothState = {
  camera: CameraState;
  filter: FilterType;
  frame: FrameOverlay | null;
  stickers: PlacedSticker[];
  capturedImage: string | null;
};
