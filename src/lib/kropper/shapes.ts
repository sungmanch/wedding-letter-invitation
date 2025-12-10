export type CropShape = {
  name: string;
  path: (width: number, height: number) => Path2D;
  viewBox?: string;
};

// Helper to create Path2D from SVG path string
function svgPathToPath2D(
  svgPath: string,
  width: number,
  height: number,
  viewBoxWidth = 100,
  viewBoxHeight = 100
): Path2D {
  const scaleX = width / viewBoxWidth;
  const scaleY = height / viewBoxHeight;

  const path = new Path2D();
  const scaledPath = svgPath
    .replace(/([0-9.]+)/g, (match, num, offset, str) => {
      // Determine if this is an X or Y coordinate based on command context
      const beforeMatch = str.substring(0, offset);
      const lastCommand = beforeMatch.match(/[A-Za-z][^A-Za-z]*$/)?.[0] || '';
      const numsInCommand = lastCommand.match(/[0-9.-]+/g) || [];
      const isYCoord = numsInCommand.length % 2 === 1;
      const scale = isYCoord ? scaleY : scaleX;
      return String(parseFloat(num) * scale);
    });

  path.addPath(new Path2D(scaledPath));
  return path;
}

// Preset shapes
export const CROP_SHAPES: Record<string, CropShape> = {
  rectangle: {
    name: '사각형',
    path: (w, h) => {
      const path = new Path2D();
      path.rect(0, 0, w, h);
      return path;
    },
  },

  circle: {
    name: '원형',
    path: (w, h) => {
      const path = new Path2D();
      const radius = Math.min(w, h) / 2;
      path.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
      return path;
    },
  },

  ellipse: {
    name: '타원',
    path: (w, h) => {
      const path = new Path2D();
      path.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      return path;
    },
  },

  ellipseVertical: {
    name: '세로 타원',
    path: (w, h) => {
      const path = new Path2D();
      // 세로로 길쭉한 타원 (가로 70%, 세로 100%)
      path.ellipse(w / 2, h / 2, w * 0.35, h / 2, 0, 0, Math.PI * 2);
      return path;
    },
  },

  heart: {
    name: '하트',
    path: (w, h) => {
      const path = new Path2D();
      const scale = Math.min(w, h);
      const offsetX = (w - scale) / 2;
      const offsetY = (h - scale) / 2;

      // Heart shape using bezier curves
      path.moveTo(offsetX + scale * 0.5, offsetY + scale * 0.25);
      path.bezierCurveTo(
        offsetX + scale * 0.5, offsetY + scale * 0.1,
        offsetX + scale * 0.25, offsetY,
        offsetX + scale * 0.1, offsetY + scale * 0.2
      );
      path.bezierCurveTo(
        offsetX, offsetY + scale * 0.4,
        offsetX + scale * 0.1, offsetY + scale * 0.6,
        offsetX + scale * 0.5, offsetY + scale * 0.9
      );
      path.bezierCurveTo(
        offsetX + scale * 0.9, offsetY + scale * 0.6,
        offsetX + scale, offsetY + scale * 0.4,
        offsetX + scale * 0.9, offsetY + scale * 0.2
      );
      path.bezierCurveTo(
        offsetX + scale * 0.75, offsetY,
        offsetX + scale * 0.5, offsetY + scale * 0.1,
        offsetX + scale * 0.5, offsetY + scale * 0.25
      );
      path.closePath();
      return path;
    },
  },

  star: {
    name: '별',
    path: (w, h) => {
      const path = new Path2D();
      const cx = w / 2;
      const cy = h / 2;
      const outerRadius = Math.min(w, h) / 2;
      const innerRadius = outerRadius * 0.4;
      const points = 5;

      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        if (i === 0) {
          path.moveTo(x, y);
        } else {
          path.lineTo(x, y);
        }
      }
      path.closePath();
      return path;
    },
  },

  car: {
    name: '자동차',
    path: (w, h) => {
      const path = new Path2D();
      const scale = Math.min(w, h);
      const offsetX = (w - scale) / 2;
      const offsetY = (h - scale) / 2 + scale * 0.1;

      // Simple car silhouette
      path.moveTo(offsetX + scale * 0.1, offsetY + scale * 0.6);
      // Bottom left to wheel
      path.lineTo(offsetX + scale * 0.15, offsetY + scale * 0.7);
      // Front wheel arch
      path.arc(
        offsetX + scale * 0.25, offsetY + scale * 0.7,
        scale * 0.1, Math.PI, 0, true
      );
      // Bottom between wheels
      path.lineTo(offsetX + scale * 0.65, offsetY + scale * 0.7);
      // Rear wheel arch
      path.arc(
        offsetX + scale * 0.75, offsetY + scale * 0.7,
        scale * 0.1, Math.PI, 0, true
      );
      // Bottom right
      path.lineTo(offsetX + scale * 0.9, offsetY + scale * 0.6);
      // Rear
      path.lineTo(offsetX + scale * 0.9, offsetY + scale * 0.45);
      // Rear window
      path.lineTo(offsetX + scale * 0.75, offsetY + scale * 0.3);
      // Roof
      path.lineTo(offsetX + scale * 0.4, offsetY + scale * 0.3);
      // Front window
      path.lineTo(offsetX + scale * 0.2, offsetY + scale * 0.45);
      // Hood
      path.lineTo(offsetX + scale * 0.1, offsetY + scale * 0.5);
      path.closePath();
      return path;
    },
  },

  rabbit: {
    name: '토끼',
    path: (w, h) => {
      const path = new Path2D();
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h);

      // Head (main circle)
      path.arc(cx, cy + scale * 0.15, scale * 0.3, 0, Math.PI * 2);

      // Left ear
      path.moveTo(cx - scale * 0.15, cy - scale * 0.1);
      path.ellipse(
        cx - scale * 0.15, cy - scale * 0.3,
        scale * 0.08, scale * 0.2,
        -0.2, 0, Math.PI * 2
      );

      // Right ear
      path.moveTo(cx + scale * 0.15, cy - scale * 0.1);
      path.ellipse(
        cx + scale * 0.15, cy - scale * 0.3,
        scale * 0.08, scale * 0.2,
        0.2, 0, Math.PI * 2
      );

      return path;
    },
  },

  roundedRect: {
    name: '둥근 사각형',
    path: (w, h) => {
      const path = new Path2D();
      const radius = Math.min(w, h) * 0.15;
      path.roundRect(0, 0, w, h, radius);
      return path;
    },
  },

  hexagon: {
    name: '육각형',
    path: (w, h) => {
      const path = new Path2D();
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) / 2;

      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        if (i === 0) {
          path.moveTo(x, y);
        } else {
          path.lineTo(x, y);
        }
      }
      path.closePath();
      return path;
    },
  },
};

export type CropShapeType = keyof typeof CROP_SHAPES;

// Create custom shape from SVG path
export function createCustomShape(
  name: string,
  svgPath: string,
  viewBoxWidth = 100,
  viewBoxHeight = 100
): CropShape {
  return {
    name,
    path: (w, h) => svgPathToPath2D(svgPath, w, h, viewBoxWidth, viewBoxHeight),
    viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
  };
}
