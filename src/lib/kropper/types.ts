export type ImageSource = string | HTMLImageElement;

export type Position = {
  x: number;
  y: number;
};

export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type KropperOptions = {
  aspectRatio?: number;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  showGrid?: boolean;
  gridLines?: number;
  shape?: string;
  customShapePath?: (width: number, height: number) => Path2D;
};

export type KropperState = {
  position: Position;
  zoom: number;
  isDragging: boolean;
};

export type KropperInstance = {
  setImage: (src: ImageSource) => Promise<void>;
  crop: (type?: string) => Promise<Blob | null>;
  reset: () => void;
  setZoom: (zoom: number) => void;
  setShape: (shape: string) => void;
  getState: () => KropperState;
  destroy: () => void;
};
