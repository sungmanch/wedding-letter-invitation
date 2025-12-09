'use client';

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useCamera } from './useCamera';
import { FILTERS, FILTER_LIST, applyFilter } from './filters';
import { drawFrameOverlay, drawTextOverlay, loadImage } from './frames';
import {
  DEFAULT_STICKERS,
  createPlacedSticker,
  drawAllStickers,
  hitTestSticker,
  moveSticker,
} from './stickers';
import type {
  FilterType,
  PlacedSticker,
  Sticker,
  FrameOverlay,
} from './types';

export type PhotoBoothRef = {
  capture: () => string | null;
  download: () => void;
  retake: () => void;
};

export type PhotoBoothProps = {
  title?: string;
  hostImageUrl?: string;
  hostPosition?: 'left' | 'right' | 'bottom';
  onCapture?: (dataUrl: string) => void;
  className?: string;
};

export const PhotoBooth = forwardRef<PhotoBoothRef, PhotoBoothProps>(
  function PhotoBooth(
    {
      title = "Wedding Day",
      hostImageUrl,
      hostPosition = 'left',
      onCapture,
      className,
    },
    ref
  ) {
    const { videoRef, state: cameraState, startCamera, switchCamera, retake } = useCamera();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

    const [activeTab, setActiveTab] = useState<'filter' | 'sticker'>('filter');
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
    const [stickers, setStickers] = useState<PlacedSticker[]>([]);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [hostImage, setHostImage] = useState<HTMLImageElement | null>(null);

    // Sticker interaction state
    const [selectedSticker, setSelectedSticker] = useState<PlacedSticker | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });

    // Load host image
    useEffect(() => {
      if (hostImageUrl) {
        loadImage(hostImageUrl).then(setHostImage).catch(console.error);
      }
    }, [hostImageUrl]);

    // Start camera on mount
    useEffect(() => {
      startCamera('user');
    }, [startCamera]);

    // Draw overlay (stickers + frame) continuously
    useEffect(() => {
      if (!overlayCanvasRef.current || !videoRef.current) return;

      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationId: number;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw stickers
        drawAllStickers(ctx, stickers, new Map());

        animationId = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        cancelAnimationFrame(animationId);
      };
    }, [stickers]);

    const handleCapture = useCallback(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !cameraState.isStreaming) return null;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Set canvas size
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Flip for front camera
      ctx.save();
      if (cameraState.facing === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Apply filter
      applyFilter(ctx, canvas.width, canvas.height, selectedFilter);

      // Draw host image overlay
      if (hostImage) {
        const overlay: FrameOverlay = {
          id: 'host',
          frame: { id: 'host', name: 'Host', imageUrl: '' },
          hostImageUrl,
          position: hostPosition,
          opacity: 1,
        };
        drawFrameOverlay(ctx, canvas.width, canvas.height, overlay, hostImage);
      }

      // Draw stickers
      drawAllStickers(ctx, stickers, new Map());

      // Draw title text
      if (title) {
        drawTextOverlay(ctx, canvas.width, canvas.height, title, {
          position: 'bottom',
          offsetY: 50,
        });
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      onCapture?.(dataUrl);

      return dataUrl;
    }, [
      cameraState,
      selectedFilter,
      hostImage,
      hostImageUrl,
      hostPosition,
      stickers,
      title,
      onCapture,
    ]);

    const handleRetake = useCallback(() => {
      setCapturedImage(null);
      retake();
    }, [retake]);

    const handleDownload = useCallback(() => {
      if (!capturedImage) {
        handleCapture();
      }
      const image = capturedImage || canvasRef.current?.toDataURL('image/jpeg', 0.9);
      if (!image) return;

      const link = document.createElement('a');
      link.download = `photobooth-${Date.now()}.jpg`;
      link.href = image;
      link.click();
    }, [capturedImage, handleCapture]);

    const handleAddSticker = useCallback((sticker: Sticker) => {
      const canvas = overlayCanvasRef.current;
      if (!canvas) return;

      const placed = createPlacedSticker(
        sticker,
        canvas.width / 2 - 40,
        canvas.height / 2 - 40,
        80
      );
      setStickers((prev) => [...prev, placed]);
    }, []);

    const handleDeleteSticker = useCallback(() => {
      if (!selectedSticker) return;
      setStickers((prev) => prev.filter((s) => s.id !== selectedSticker.id));
      setSelectedSticker(null);
    }, [selectedSticker]);

    // Pointer handlers for sticker manipulation
    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = overlayCanvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

        const hit = hitTestSticker(x, y, stickers);
        setSelectedSticker(hit);

        if (hit) {
          setIsDragging(true);
          dragStartRef.current = { x, y };
          (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
        }
      },
      [stickers]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDragging || !selectedSticker) return;

        const canvas = overlayCanvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
        const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

        const dx = x - dragStartRef.current.x;
        const dy = y - dragStartRef.current.y;

        setStickers((prev) =>
          prev.map((s) =>
            s.id === selectedSticker.id ? moveSticker(s, dx, dy) : s
          )
        );

        dragStartRef.current = { x, y };
      },
      [isDragging, selectedSticker]
    );

    const handlePointerUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        capture: handleCapture,
        download: handleDownload,
        retake: handleRetake,
      }),
      [handleCapture, handleDownload, handleRetake]
    );

    const generalStickers = DEFAULT_STICKERS.filter(
      (s) => s.category === 'general'
    );
    const faceStickers = DEFAULT_STICKERS.filter(
      (s) => s.category === 'face-tracking'
    );

    return (
      <div className={className} style={styles.container}>
        {/* Header */}
        <h1 style={styles.title}>Photo Booth</h1>

        {/* Top Toolbar */}
        <div style={styles.toolbar}>
          <button
            onClick={switchCamera}
            style={styles.toolButton}
            disabled={!!capturedImage}
          >
            <span style={styles.icon}>↺</span> 후면
          </button>

          <button
            onClick={capturedImage ? handleRetake : handleCapture}
            style={styles.captureButton}
          >
            <span style={styles.cameraIcon}>📷</span>
          </button>

          <button onClick={handleDownload} style={styles.toolButton}>
            다운로드
          </button>
        </div>

        {/* Camera View */}
        <div style={styles.cameraContainer}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              ...styles.video,
              display: capturedImage ? 'none' : 'block',
              transform: cameraState.facing === 'user' ? 'scaleX(-1)' : 'none',
            }}
          />

          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              style={styles.capturedImage}
            />
          )}

          {/* Overlay canvas for stickers */}
          <canvas
            ref={overlayCanvasRef}
            width={640}
            height={480}
            style={styles.overlayCanvas}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Grid overlay */}
          <div style={styles.gridOverlay}>
            <div style={styles.gridLine} />
            <div style={{ ...styles.gridLine, left: '66.67%' }} />
            <div style={{ ...styles.gridLineH, top: '33.33%' }} />
            <div style={{ ...styles.gridLineH, top: '66.67%' }} />
          </div>

          {/* Host image preview */}
          {hostImage && !capturedImage && (
            <div
              style={{
                ...styles.hostPreview,
                [hostPosition]: 20,
                bottom: 20,
              }}
            >
              <img
                src={hostImageUrl}
                alt="Host"
                style={styles.hostPreviewImage}
              />
            </div>
          )}
        </div>

        {/* Tab Buttons */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('filter')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'filter' ? styles.tabButtonActive : {}),
            }}
          >
            Filter & Frame
          </button>
          <button
            onClick={() => setActiveTab('sticker')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'sticker' ? styles.tabButtonActive : {}),
            }}
          >
            Sticker
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {activeTab === 'filter' && (
            <div style={styles.filterGrid}>
              {FILTER_LIST.map((filter) => (
                <button
                  key={filter.type}
                  onClick={() => setSelectedFilter(filter.type)}
                  style={{
                    ...styles.filterButton,
                    ...(selectedFilter === filter.type
                      ? styles.filterButtonActive
                      : {}),
                  }}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'sticker' && (
            <div>
              <p style={styles.stickerLabel}>일반 스티커</p>
              <div style={styles.stickerGrid}>
                {generalStickers.map((sticker) => (
                  <button
                    key={sticker.id}
                    onClick={() => handleAddSticker(sticker)}
                    style={styles.stickerButton}
                  >
                    {sticker.emoji}
                  </button>
                ))}
              </div>

              {selectedSticker && (
                <button onClick={handleDeleteSticker} style={styles.deleteButton}>
                  선택한 스티커 삭제
                </button>
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {cameraState.error && (
          <div style={styles.error}>{cameraState.error}</div>
        )}
      </div>
    );
  }
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    minHeight: '100vh',
    padding: '16px',
    fontFamily: 'system-ui, sans-serif',
  },
  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '48px',
    fontStyle: 'italic',
    fontWeight: 400,
    margin: '0 0 16px 0',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  toolButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    border: '1px solid #e0e0e0',
    borderRadius: '24px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
  },
  captureButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '40px',
    border: 'none',
    borderRadius: '24px',
    backgroundColor: '#1a1a1a',
    cursor: 'pointer',
  },
  icon: {
    fontSize: '16px',
  },
  cameraIcon: {
    fontSize: '20px',
    filter: 'grayscale(1) brightness(10)',
  },
  cameraContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    aspectRatio: '3/4',
    backgroundColor: '#000',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlayCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    touchAction: 'none',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  gridLine: {
    position: 'absolute',
    left: '33.33%',
    top: 0,
    width: '1px',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  hostPreview: {
    position: 'absolute',
    width: '30%',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  hostPreviewImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  tabContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '400px',
    marginTop: '16px',
    gap: '8px',
  },
  tabButton: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '24px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  tabButtonActive: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    border: '1px solid #1a1a1a',
  },
  tabContent: {
    width: '100%',
    maxWidth: '400px',
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  filterButton: {
    padding: '10px 8px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '12px',
  },
  filterButtonActive: {
    borderColor: '#1a1a1a',
    backgroundColor: '#f5f5f5',
  },
  stickerLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },
  stickerGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  stickerButton: {
    width: '48px',
    height: '48px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    marginTop: '16px',
    padding: '10px 16px',
    border: '1px solid #ff4444',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#ff4444',
    cursor: 'pointer',
    fontSize: '14px',
  },
  error: {
    marginTop: '16px',
    padding: '12px 16px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '8px',
    fontSize: '14px',
  },
};
