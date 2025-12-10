'use client';

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import { createKropper } from './core';
import { CROP_SHAPES, type CropShapeType } from './shapes';
import type { KropperOptions, KropperInstance } from './types';

export type ImageCropperRef = {
  crop: (type?: string) => Promise<Blob | null>;
  reset: () => void;
  setZoom: (zoom: number) => void;
  setShape: (shape: string) => void;
  setImage: (src: string | HTMLImageElement) => Promise<void>;
};

export type ImageCropperProps = {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  gridLines?: number;
  shape?: CropShapeType | string;
  showShapeBorder?: boolean;
  onCrop?: (blob: Blob | null) => void;
  onZoomChange?: (zoom: number) => void;
  onShapeChange?: (shape: string) => void;
} & Omit<KropperOptions, 'shape'>;

export const ImageCropper = forwardRef<ImageCropperRef, ImageCropperProps>(
  function ImageCropper(
    {
      src,
      width = 300,
      height = 300,
      className,
      showGrid = false,
      gridLines = 3,
      shape = 'rectangle',
      showShapeBorder = true,
      aspectRatio,
      minZoom,
      maxZoom,
      initialZoom,
      customShapePath,
      onCrop,
      onZoomChange,
      onShapeChange,
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const instanceRef = useRef<KropperInstance | null>(null);

    const options: KropperOptions = useMemo(
      () => ({
        aspectRatio,
        minZoom,
        maxZoom,
        initialZoom,
        showGrid,
        gridLines,
        shape,
        customShapePath,
      }),
      [
        aspectRatio,
        minZoom,
        maxZoom,
        initialZoom,
        showGrid,
        gridLines,
        shape,
        customShapePath,
      ]
    );

    useEffect(() => {
      if (!canvasRef.current) return;

      instanceRef.current = createKropper(canvasRef.current, options);

      // 마운트 시 src가 있으면 바로 이미지 로드
      if (src) {
        instanceRef.current.setImage(src);
      }

      return () => {
        instanceRef.current?.destroy();
        instanceRef.current = null;
      };
    }, []);

    useEffect(() => {
      if (src && instanceRef.current) {
        instanceRef.current.setImage(src);
      }
    }, [src]);

    useEffect(() => {
      if (instanceRef.current) {
        instanceRef.current.setShape(shape);
      }
    }, [shape]);

    const handleCrop = useCallback(
      async (type?: string) => {
        if (!instanceRef.current) return null;
        const blob = await instanceRef.current.crop(type);
        onCrop?.(blob);
        return blob;
      },
      [onCrop]
    );

    const handleReset = useCallback(() => {
      instanceRef.current?.reset();
    }, []);

    const handleSetZoom = useCallback(
      (zoom: number) => {
        instanceRef.current?.setZoom(zoom);
        onZoomChange?.(zoom);
      },
      [onZoomChange]
    );

    const handleSetShape = useCallback(
      (newShape: string) => {
        instanceRef.current?.setShape(newShape);
        onShapeChange?.(newShape);
      },
      [onShapeChange]
    );

    const handleSetImage = useCallback(
      async (imageSrc: string | HTMLImageElement) => {
        await instanceRef.current?.setImage(imageSrc);
      },
      []
    );

    useImperativeHandle(
      ref,
      () => ({
        crop: handleCrop,
        reset: handleReset,
        setZoom: handleSetZoom,
        setShape: handleSetShape,
        setImage: handleSetImage,
      }),
      [handleCrop, handleReset, handleSetZoom, handleSetShape, handleSetImage]
    );

    return (
      <div className={className} style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            display: 'block',
          }}
        />
        {showShapeBorder && shape !== 'rectangle' && (
          <ShapeBorderOverlay
            width={width}
            height={height}
            shape={shape}
            customShapePath={customShapePath}
          />
        )}
        {showGrid && (
          <GridOverlay width={width} height={height} lines={gridLines} />
        )}
      </div>
    );
  }
);

function ShapeBorderOverlay({
  width,
  height,
  shape,
  customShapePath,
}: {
  width: number;
  height: number;
  shape: string;
  customShapePath?: (w: number, h: number) => Path2D;
}) {
  const svgPath = useMemo(() => {
    // Generate SVG path string for the shape border
    const shapeConfig = CROP_SHAPES[shape];
    if (!shapeConfig && !customShapePath) return null;

    // For SVG, we need to convert Path2D to SVG path
    // Since we can't directly convert, we'll use CSS clip-path with SVG
    return null; // We'll use canvas-based overlay instead
  }, [shape, customShapePath]);

  // Use a canvas overlay for the shape border
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Get shape path
    let path: Path2D;
    if (customShapePath) {
      path = customShapePath(width, height);
    } else {
      const shapeConfig = CROP_SHAPES[shape];
      if (shapeConfig) {
        path = shapeConfig.path(width, height);
      } else {
        return;
      }
    }

    // Draw border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke(path);

    // Draw shadow for depth
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.stroke(path);
  }, [width, height, shape, customShapePath]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

function GridOverlay({
  width,
  height,
  lines,
}: {
  width: number;
  height: number;
  lines: number;
}) {
  const verticalLines = [];
  const horizontalLines = [];

  for (let i = 1; i < lines; i++) {
    const xPos = (width / lines) * i;
    const yPos = (height / lines) * i;

    verticalLines.push(
      <div
        key={`v-${i}`}
        style={{
          position: 'absolute',
          left: xPos,
          top: 0,
          width: 1,
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          pointerEvents: 'none',
        }}
      />
    );

    horizontalLines.push(
      <div
        key={`h-${i}`}
        style={{
          position: 'absolute',
          left: 0,
          top: yPos,
          width: '100%',
          height: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {verticalLines}
      {horizontalLines}
    </div>
  );
}

// Shape selector component for convenience
export function ShapeSelector({
  value,
  onChange,
  shapes = Object.keys(CROP_SHAPES) as CropShapeType[],
  className,
}: {
  value: string;
  onChange: (shape: string) => void;
  shapes?: CropShapeType[];
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
    >
      {shapes.map((shapeKey) => {
        const shape = CROP_SHAPES[shapeKey];
        if (!shape) return null;

        return (
          <button
            key={shapeKey}
            type="button"
            onClick={() => onChange(shapeKey)}
            style={{
              padding: '8px 12px',
              border: value === shapeKey ? '2px solid #3b82f6' : '1px solid #ccc',
              borderRadius: 8,
              background: value === shapeKey ? '#eff6ff' : 'white',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            {shape.name}
          </button>
        );
      })}
    </div>
  );
}
