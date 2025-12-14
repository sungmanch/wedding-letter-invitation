import type { Filter, FilterType } from './types';

function applyPixelManipulation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  transform: (r: number, g: number, b: number, a: number) => [number, number, number, number]
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = transform(data[i], data[i + 1], data[i + 2], data[i + 3]);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  }

  ctx.putImageData(imageData, 0, 0);
}

export const FILTERS: Record<FilterType, Filter> = {
  none: {
    name: '원본',
    type: 'none',
    apply: () => {},
  },

  bright: {
    name: '화사하게',
    type: 'bright',
    apply: (ctx, width, height) => {
      applyPixelManipulation(ctx, width, height, (r, g, b, a) => [
        Math.min(255, r + 30),
        Math.min(255, g + 30),
        Math.min(255, b + 30),
        a,
      ]);
    },
  },

  grayscale: {
    name: '흑백',
    type: 'grayscale',
    apply: (ctx, width, height) => {
      applyPixelManipulation(ctx, width, height, (r, g, b, a) => {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        return [gray, gray, gray, a];
      });
    },
  },

  sepia: {
    name: '세피아',
    type: 'sepia',
    apply: (ctx, width, height) => {
      applyPixelManipulation(ctx, width, height, (r, g, b, a) => [
        Math.min(255, r * 0.393 + g * 0.769 + b * 0.189),
        Math.min(255, r * 0.349 + g * 0.686 + b * 0.168),
        Math.min(255, r * 0.272 + g * 0.534 + b * 0.131),
        a,
      ]);
    },
  },

  contrast: {
    name: '명암 강조',
    type: 'contrast',
    apply: (ctx, width, height) => {
      const factor = 1.3;
      applyPixelManipulation(ctx, width, height, (r, g, b, a) => [
        Math.min(255, Math.max(0, factor * (r - 128) + 128)),
        Math.min(255, Math.max(0, factor * (g - 128) + 128)),
        Math.min(255, Math.max(0, factor * (b - 128) + 128)),
        a,
      ]);
    },
  },

  warm: {
    name: '따뜻하게',
    type: 'warm',
    apply: (ctx, width, height) => {
      applyPixelManipulation(ctx, width, height, (r, g, b, a) => [
        Math.min(255, r + 20),
        Math.min(255, g + 10),
        Math.max(0, b - 10),
        a,
      ]);
    },
  },

  cool: {
    name: '차갑게',
    type: 'cool',
    apply: (ctx, width, height) => {
      applyPixelManipulation(ctx, width, height, (r, g, b, a) => [
        Math.max(0, r - 10),
        Math.min(255, g + 5),
        Math.min(255, b + 20),
        a,
      ]);
    },
  },

  vintage: {
    name: '빈티지',
    type: 'vintage',
    apply: (ctx, width, height) => {
      // Apply sepia + reduced contrast + slight vignette effect
      applyPixelManipulation(ctx, width, height, (r, g, b, a) => {
        // Sepia
        let nr = r * 0.393 + g * 0.769 + b * 0.189;
        let ng = r * 0.349 + g * 0.686 + b * 0.168;
        let nb = r * 0.272 + g * 0.534 + b * 0.131;

        // Reduce contrast
        const factor = 0.9;
        nr = factor * (nr - 128) + 128;
        ng = factor * (ng - 128) + 128;
        nb = factor * (nb - 128) + 128;

        return [
          Math.min(255, Math.max(0, nr)),
          Math.min(255, Math.max(0, ng)),
          Math.min(255, Math.max(0, nb)),
          a,
        ];
      });
    },
  },
};

export const FILTER_LIST = Object.values(FILTERS);

export function applyFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filterType: FilterType
) {
  const filter = FILTERS[filterType];
  if (filter) {
    filter.apply(ctx, width, height);
  }
}
