'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { CameraFacing, CameraState } from './types';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<CameraState>({
    isStreaming: false,
    isCaptured: false,
    facing: 'user',
    error: null,
  });

  const startCamera = useCallback(async (facing: CameraFacing = 'user') => {
    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState((prev) => ({
        ...prev,
        isStreaming: true,
        isCaptured: false,
        facing,
        error: null,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '카메라를 시작할 수 없습니다';
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        error: message,
      }));
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setState((prev) => ({
      ...prev,
      isStreaming: false,
    }));
  }, []);

  const switchCamera = useCallback(async () => {
    const newFacing = state.facing === 'user' ? 'environment' : 'user';
    await startCamera(newFacing);
  }, [state.facing, startCamera]);

  const capture = useCallback(
    (
      canvas: HTMLCanvasElement,
      options?: {
        filter?: (
          ctx: CanvasRenderingContext2D,
          width: number,
          height: number
        ) => void;
      }
    ): string | null => {
      const video = videoRef.current;
      if (!video || !state.isStreaming) return null;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Flip horizontally for front camera
      if (state.facing === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Reset transform
      if (state.facing === 'user') {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }

      // Apply filter if provided
      if (options?.filter) {
        options.filter(ctx, canvas.width, canvas.height);
      }

      setState((prev) => ({
        ...prev,
        isCaptured: true,
      }));

      return canvas.toDataURL('image/jpeg', 0.9);
    },
    [state.isStreaming, state.facing]
  );

  const retake = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isCaptured: false,
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    state,
    startCamera,
    stopCamera,
    switchCamera,
    capture,
    retake,
  };
}
