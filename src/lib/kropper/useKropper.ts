'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { createKropper } from './core';
import type { KropperOptions, KropperInstance, KropperState } from './types';

export function useKropper(options: KropperOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<KropperInstance | null>(null);
  const [state, setState] = useState<KropperState>({
    position: { x: 0, y: 0 },
    zoom: options.initialZoom ?? 1,
    isDragging: false,
  });
  const [isReady, setIsReady] = useState(false);

  const initialize = useCallback(() => {
    if (!canvasRef.current || instanceRef.current) return;

    instanceRef.current = createKropper(canvasRef.current, options);
    setIsReady(true);
  }, [options]);

  const setImage = useCallback(async (src: string | HTMLImageElement) => {
    if (!instanceRef.current) {
      initialize();
    }
    if (instanceRef.current) {
      await instanceRef.current.setImage(src);
      setState(instanceRef.current.getState());
    }
  }, [initialize]);

  const crop = useCallback(async (type?: string) => {
    if (!instanceRef.current) return null;
    return instanceRef.current.crop(type);
  }, []);

  const reset = useCallback(() => {
    if (!instanceRef.current) return;
    instanceRef.current.reset();
    setState(instanceRef.current.getState());
  }, []);

  const setZoom = useCallback((zoom: number) => {
    if (!instanceRef.current) return;
    instanceRef.current.setZoom(zoom);
    setState(instanceRef.current.getState());
  }, []);

  const setShape = useCallback((shape: string) => {
    if (!instanceRef.current) return;
    instanceRef.current.setShape(shape);
  }, []);

  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, []);

  return {
    canvasRef,
    state,
    isReady,
    initialize,
    setImage,
    crop,
    reset,
    setZoom,
    setShape,
  };
}
