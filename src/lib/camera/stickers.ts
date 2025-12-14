import type { Sticker, PlacedSticker } from './types';

export const DEFAULT_STICKERS: Sticker[] = [
  // 일반 스티커
  { id: 'heart-red', name: '빨간 하트', emoji: '❤️', category: 'general' },
  { id: 'heart-pink', name: '핑크 하트', emoji: '💕', category: 'general' },
  { id: 'star', name: '별', emoji: '⭐', category: 'general' },
  { id: 'sparkle', name: '반짝이', emoji: '✨', category: 'general' },
  { id: 'party', name: '파티', emoji: '🎉', category: 'general' },
  { id: 'ring', name: '반지', emoji: '💍', category: 'general' },
  { id: 'kiss', name: '키스', emoji: '💋', category: 'general' },
  { id: 'flower', name: '꽃', emoji: '🌸', category: 'general' },
  { id: 'champagne', name: '샴페인', emoji: '🍾', category: 'general' },
  { id: 'cake', name: '케이크', emoji: '🎂', category: 'general' },
  { id: 'balloon', name: '풍선', emoji: '🎈', category: 'general' },
  { id: 'crown', name: '왕관', emoji: '👑', category: 'general' },

  // 얼굴 추적 스티커 (이미지 기반)
  {
    id: 'sunglasses',
    name: '선글라스',
    imageUrl: '/stickers/sunglasses.png',
    category: 'face-tracking',
  },
  {
    id: 'tiara',
    name: '티아라',
    imageUrl: '/stickers/tiara.png',
    category: 'face-tracking',
  },
  {
    id: 'bunny-ears',
    name: '토끼 귀',
    imageUrl: '/stickers/bunny-ears.png',
    category: 'face-tracking',
  },
];

export function createPlacedSticker(
  sticker: Sticker,
  x: number,
  y: number,
  size = 80
): PlacedSticker {
  return {
    id: `${sticker.id}-${Date.now()}`,
    sticker,
    x,
    y,
    width: size,
    height: size,
    rotation: 0,
  };
}

export function drawSticker(
  ctx: CanvasRenderingContext2D,
  placed: PlacedSticker,
  stickerImages: Map<string, HTMLImageElement>
) {
  ctx.save();

  // Move to sticker center for rotation
  const centerX = placed.x + placed.width / 2;
  const centerY = placed.y + placed.height / 2;

  ctx.translate(centerX, centerY);
  ctx.rotate((placed.rotation * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);

  if (placed.sticker.emoji) {
    // Draw emoji
    ctx.font = `${placed.width}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(placed.sticker.emoji, centerX, centerY);
  } else if (placed.sticker.imageUrl) {
    // Draw image sticker
    const img = stickerImages.get(placed.sticker.id);
    if (img) {
      ctx.drawImage(img, placed.x, placed.y, placed.width, placed.height);
    }
  }

  ctx.restore();
}

export function drawAllStickers(
  ctx: CanvasRenderingContext2D,
  stickers: PlacedSticker[],
  stickerImages: Map<string, HTMLImageElement>
) {
  stickers.forEach((placed) => {
    drawSticker(ctx, placed, stickerImages);
  });
}

export function hitTestSticker(
  x: number,
  y: number,
  stickers: PlacedSticker[]
): PlacedSticker | null {
  // Check from top (last) to bottom (first) for proper z-ordering
  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];
    if (x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height) {
      return s;
    }
  }
  return null;
}

export function moveSticker(
  sticker: PlacedSticker,
  dx: number,
  dy: number
): PlacedSticker {
  return {
    ...sticker,
    x: sticker.x + dx,
    y: sticker.y + dy,
  };
}

export function resizeSticker(
  sticker: PlacedSticker,
  scale: number
): PlacedSticker {
  const newWidth = sticker.width * scale;
  const newHeight = sticker.height * scale;
  const dx = (sticker.width - newWidth) / 2;
  const dy = (sticker.height - newHeight) / 2;

  return {
    ...sticker,
    x: sticker.x + dx,
    y: sticker.y + dy,
    width: newWidth,
    height: newHeight,
  };
}

export function rotateSticker(
  sticker: PlacedSticker,
  degrees: number
): PlacedSticker {
  return {
    ...sticker,
    rotation: (sticker.rotation + degrees) % 360,
  };
}
