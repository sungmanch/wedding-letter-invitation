import type { Frame, FrameOverlay } from './types';

export const DEFAULT_FRAMES: Frame[] = [
  {
    id: 'wedding-classic',
    name: '웨딩 클래식',
    imageUrl: '/frames/wedding-classic.png',
  },
  {
    id: 'photo-strip',
    name: '포토 스트립',
    imageUrl: '/frames/photo-strip.png',
  },
  {
    id: 'polaroid',
    name: '폴라로이드',
    imageUrl: '/frames/polaroid.png',
  },
];

export function drawFrameOverlay(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  overlay: FrameOverlay,
  hostImage?: HTMLImageElement
) {
  if (!hostImage) return;

  const { position, opacity } = overlay;

  ctx.save();
  ctx.globalAlpha = opacity;

  let dx = 0;
  let dy = 0;
  let dw = 0;
  let dh = 0;

  // Calculate host image position based on overlay position
  switch (position) {
    case 'left':
      dw = canvasWidth * 0.35;
      dh = (hostImage.height / hostImage.width) * dw;
      dx = 20;
      dy = canvasHeight - dh - 20;
      break;
    case 'right':
      dw = canvasWidth * 0.35;
      dh = (hostImage.height / hostImage.width) * dw;
      dx = canvasWidth - dw - 20;
      dy = canvasHeight - dh - 20;
      break;
    case 'bottom':
      dw = canvasWidth * 0.4;
      dh = (hostImage.height / hostImage.width) * dw;
      dx = (canvasWidth - dw) / 2;
      dy = canvasHeight - dh - 20;
      break;
    case 'top':
      dw = canvasWidth * 0.4;
      dh = (hostImage.height / hostImage.width) * dw;
      dx = (canvasWidth - dw) / 2;
      dy = 20;
      break;
  }

  // Draw rounded rectangle clip for host image
  const radius = 12;
  ctx.beginPath();
  ctx.roundRect(dx, dy, dw, dh, radius);
  ctx.clip();

  ctx.drawImage(hostImage, dx, dy, dw, dh);

  ctx.restore();
}

export function drawTextOverlay(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  text: string,
  options: {
    font?: string;
    color?: string;
    position?: 'top' | 'bottom';
    offsetY?: number;
  } = {}
) {
  const {
    font = 'italic 32px "Playfair Display", serif',
    color = 'rgba(255, 255, 255, 0.9)',
    position = 'bottom',
    offsetY = 40,
  } = options;

  ctx.save();

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Add shadow for better visibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  const y = position === 'bottom' ? canvasHeight - offsetY : offsetY;
  ctx.fillText(text, canvasWidth / 2, y);

  ctx.restore();
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
