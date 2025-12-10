import type {
  ImageSource,
  Position,
  KropperOptions,
  KropperState,
  KropperInstance,
} from './types';
import { CROP_SHAPES, type CropShape } from './shapes';

const DEFAULT_OPTIONS: Required<Omit<KropperOptions, 'customShapePath'>> & {
  customShapePath?: (width: number, height: number) => Path2D;
} = {
  aspectRatio: 1,
  minZoom: 0.5,
  maxZoom: 3,
  initialZoom: 1,
  showGrid: true,
  gridLines: 3,
  shape: 'rectangle',
  customShapePath: undefined,
};

export function createKropper(
  canvas: HTMLCanvasElement,
  options: KropperOptions = {}
): KropperInstance {
  // undefined 값을 제거하고 기본값과 병합
  const filteredOptions = Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined)
  );
  const opts = { ...DEFAULT_OPTIONS, ...filteredOptions };
  const ctx = canvas.getContext('2d');

  let imageEl: HTMLImageElement | null = null;
  let position: Position = { x: 0, y: 0 };
  let zoom = opts.initialZoom;
  let isDragging = false;
  let dragStart: Position = { x: 0, y: 0 };
  let lastPosition: Position = { x: 0, y: 0 };
  let currentShape: string = opts.shape;

  // Touch handling
  let lastTouchDistance = 0;
  let lastTouchCenter: Position = { x: 0, y: 0 };

  function getShapePath(): Path2D {
    // Custom path takes priority
    if (opts.customShapePath) {
      return opts.customShapePath(canvas.width, canvas.height);
    }

    // Use preset shape
    const shape: CropShape | undefined = CROP_SHAPES[currentShape];
    if (shape) {
      return shape.path(canvas.width, canvas.height);
    }

    // Fallback to rectangle
    const path = new Path2D();
    path.rect(0, 0, canvas.width, canvas.height);
    return path;
  }

  function getImageDimensions() {
    if (!imageEl) return { width: 0, height: 0 };

    const canvasRatio = canvas.width / canvas.height;
    const imageRatio = imageEl.naturalWidth / imageEl.naturalHeight;

    let width: number;
    let height: number;

    if (imageRatio > canvasRatio) {
      height = canvas.height * zoom;
      width = height * imageRatio;
    } else {
      width = canvas.width * zoom;
      height = width / imageRatio;
    }

    return { width, height };
  }

  function draw() {
    if (!ctx || !imageEl) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { width, height } = getImageDimensions();
    const x = (canvas.width - width) / 2 + position.x;
    const y = (canvas.height - height) / 2 + position.y;

    // Apply shape clipping
    ctx.save();
    const clipPath = getShapePath();
    ctx.clip(clipPath);

    ctx.drawImage(imageEl, x, y, width, height);

    ctx.restore();
  }

  function constrainPosition() {
    if (!imageEl) return;

    const { width, height } = getImageDimensions();
    const maxX = Math.max(0, (width - canvas.width) / 2);
    const maxY = Math.max(0, (height - canvas.height) / 2);

    position.x = Math.max(-maxX, Math.min(maxX, position.x));
    position.y = Math.max(-maxY, Math.min(maxY, position.y));
  }

  // Mouse handlers
  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
    lastPosition = { ...position };
    canvas.style.cursor = 'grabbing';
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;

    position = {
      x: lastPosition.x + (e.clientX - dragStart.x),
      y: lastPosition.y + (e.clientY - dragStart.y),
    };

    constrainPosition();
    requestAnimationFrame(draw);
  }

  function handleMouseUp() {
    isDragging = false;
    canvas.style.cursor = 'grab';
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(opts.minZoom, Math.min(opts.maxZoom, zoom + delta));

    if (newZoom !== zoom) {
      zoom = newZoom;
      constrainPosition();
      requestAnimationFrame(draw);
    }
  }

  // Touch handlers
  function getTouchDistance(touches: TouchList): number {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getTouchCenter(touches: TouchList): Position {
    if (touches.length < 2) {
      return { x: touches[0].clientX, y: touches[0].clientY };
    }
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  }

  function handleTouchStart(e: TouchEvent) {
    e.preventDefault();

    if (e.touches.length === 1) {
      isDragging = true;
      dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastPosition = { ...position };
    } else if (e.touches.length === 2) {
      lastTouchDistance = getTouchDistance(e.touches);
      lastTouchCenter = getTouchCenter(e.touches);
    }
  }

  function handleTouchMove(e: TouchEvent) {
    e.preventDefault();

    if (e.touches.length === 1 && isDragging) {
      position = {
        x: lastPosition.x + (e.touches[0].clientX - dragStart.x),
        y: lastPosition.y + (e.touches[0].clientY - dragStart.y),
      };
      constrainPosition();
      requestAnimationFrame(draw);
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const currentDistance = getTouchDistance(e.touches);
      const currentCenter = getTouchCenter(e.touches);

      if (lastTouchDistance > 0) {
        const scale = currentDistance / lastTouchDistance;
        const newZoom = Math.max(
          opts.minZoom,
          Math.min(opts.maxZoom, zoom * scale)
        );

        if (newZoom !== zoom) {
          zoom = newZoom;
          constrainPosition();
          requestAnimationFrame(draw);
        }
      }

      // Pan while pinching
      position = {
        x: position.x + (currentCenter.x - lastTouchCenter.x),
        y: position.y + (currentCenter.y - lastTouchCenter.y),
      };

      lastTouchDistance = currentDistance;
      lastTouchCenter = currentCenter;
      constrainPosition();
      requestAnimationFrame(draw);
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    if (e.touches.length === 0) {
      isDragging = false;
      lastTouchDistance = 0;
    } else if (e.touches.length === 1) {
      isDragging = true;
      dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastPosition = { ...position };
      lastTouchDistance = 0;
    }
  }

  function attachListeners() {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    canvas.style.cursor = 'grab';
    canvas.style.touchAction = 'none';
  }

  function detachListeners() {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    canvas.removeEventListener('mouseleave', handleMouseUp);
    canvas.removeEventListener('wheel', handleWheel);

    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
    canvas.removeEventListener('touchcancel', handleTouchEnd);
  }

  async function setImage(src: ImageSource): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof src === 'string') {
        const img = new Image();
        // data URL이나 blob URL은 crossOrigin 설정하면 안 됨
        if (!src.startsWith('data:') && !src.startsWith('blob:')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => {
          imageEl = img;
          position = { x: 0, y: 0 };
          zoom = opts.initialZoom;
          requestAnimationFrame(draw);
          resolve();
        };
        img.onerror = (e) => {
          console.error('Kropper: Failed to load image', e);
          reject(e);
        };
        img.src = src;
      } else {
        imageEl = src;
        position = { x: 0, y: 0 };
        zoom = opts.initialZoom;
        requestAnimationFrame(draw);
        resolve();
      }
    });
  }

  async function crop(type = 'image/png'): Promise<Blob | null> {
    if (!ctx || !imageEl) return null;

    // Create a temporary canvas for the cropped result
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return null;

    const { width, height } = getImageDimensions();
    const x = (canvas.width - width) / 2 + position.x;
    const y = (canvas.height - height) / 2 + position.y;

    // Apply shape clipping to temp canvas
    const clipPath = getShapePath();
    tempCtx.clip(clipPath);

    tempCtx.drawImage(imageEl, x, y, width, height);

    return new Promise((resolve) => {
      tempCanvas.toBlob((blob) => resolve(blob), type, 0.9);
    });
  }

  function reset() {
    position = { x: 0, y: 0 };
    zoom = opts.initialZoom;
    requestAnimationFrame(draw);
  }

  function setZoom(newZoom: number) {
    zoom = Math.max(opts.minZoom, Math.min(opts.maxZoom, newZoom));
    constrainPosition();
    requestAnimationFrame(draw);
  }

  function setShape(shape: string) {
    currentShape = shape;
    requestAnimationFrame(draw);
  }

  function getState(): KropperState {
    return {
      position: { ...position },
      zoom,
      isDragging,
    };
  }

  function destroy() {
    detachListeners();
    imageEl = null;
  }

  // Initialize
  attachListeners();

  return {
    setImage,
    crop,
    reset,
    setZoom,
    setShape,
    getState,
    destroy,
  };
}
