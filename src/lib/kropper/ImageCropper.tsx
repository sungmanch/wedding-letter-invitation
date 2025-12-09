'use client';

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import { createKropper } from './core';
import type { KropperOptions, KropperInstance } from './types';

export type ImageCropperRef = {
  crop: (type?: string) => Promise<Blob | null>;
  reset: () => void;
  setZoom: (zoom: number) => void;
  setImage: (src: string | HTMLImageElement) => Promise<void>;
};

export type ImageCropperProps = {
  src?: string;
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  gridLines?: number;
  onCrop?: (blob: Blob | null) => void;
  onZoomChange?: (zoom: number) => void;
} & KropperOptions;

export const ImageCropper = forwardRef<ImageCropperRef, ImageCropperProps>(
  function ImageCropper(
    {
      src,
      width = 300,
      height = 300,
      className,
      showGrid = true,
      gridLines = 3,
      aspectRatio,
      minZoom,
      maxZoom,
      initialZoom,
      onCrop,
      onZoomChange,
    },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const instanceRef = useRef<KropperInstance | null>(null);

    const options: KropperOptions = {
      aspectRatio,
      minZoom,
      maxZoom,
      initialZoom,
      showGrid,
      gridLines,
    };

    useEffect(() => {
      if (!canvasRef.current) return;

      instanceRef.current = createKropper(canvasRef.current, options);

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
        setImage: handleSetImage,
      }),
      [handleCrop, handleReset, handleSetZoom, handleSetImage]
    );

    return (
      <div className={className} style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            display: 'block',
            borderRadius: '8px',
          }}
        />
        {showGrid && (
          <GridOverlay width={width} height={height} lines={gridLines} />
        )}
      </div>
    );
  }
);

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
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {verticalLines}
      {horizontalLines}
    </div>
  );
}
