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
    const { videoRef, state: cameraState, startCamera, stopCamera, switchCamera, retake } = useCamera();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

    // 부스 상태: idle(초기) -> camera(촬영중) -> captured(촬영완료)
    const [boothState, setBoothState] = useState<'idle' | 'camera' | 'captured'>('idle');
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
    const [activeStickers, setActiveStickers] = useState<Set<string>>(new Set());
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

    // 촬영하기 버튼 클릭 - 카메라 시작
    const handleStartCamera = useCallback(() => {
      startCamera('user');
      setBoothState('camera');
    }, [startCamera]);

    // 실시간 필터 프리뷰를 위한 캔버스 렌더링
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    // Draw video with filter + stickers continuously
    useEffect(() => {
      if (boothState !== 'camera') return;
      if (!previewCanvasRef.current || !videoRef.current) return;

      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const overlayCanvas = overlayCanvasRef.current;
      const overlayCtx = overlayCanvas?.getContext('2d');
      if (!ctx) return;

      let animationId: number;

      const draw = () => {
        const video = videoRef.current;
        if (!video || video.readyState < 2) {
          animationId = requestAnimationFrame(draw);
          return;
        }

        // 캔버스 크기 설정
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          if (overlayCanvas) {
            overlayCanvas.width = canvas.width;
            overlayCanvas.height = canvas.height;
          }
        }

        // 전면 카메라 미러링
        ctx.save();
        if (cameraState.facing === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // 필터 적용
        if (selectedFilter !== 'none') {
          applyFilter(ctx, canvas.width, canvas.height, selectedFilter);
        }

        // 오버레이 캔버스에 스티커 그리기
        if (overlayCtx) {
          overlayCtx.clearRect(0, 0, canvas.width, canvas.height);
          drawAllStickers(overlayCtx, stickers, new Map());
        }

        animationId = requestAnimationFrame(draw);
      };

      draw();

      return () => {
        cancelAnimationFrame(animationId);
      };
    }, [boothState, cameraState.facing, selectedFilter, stickers]);

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
      setBoothState('captured');
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
      setBoothState('camera');
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

    // 필터 토글 (같은 필터 누르면 끄기)
    const handleFilterToggle = useCallback((filterType: FilterType) => {
      setSelectedFilter((prev) => prev === filterType ? 'none' : filterType);
    }, []);

    // 스티커 토글 (같은 스티커 누르면 끄기, 왼쪽 위에 배치)
    const handleStickerToggle = useCallback((sticker: Sticker) => {
      const canvas = overlayCanvasRef.current;
      if (!canvas) return;

      setActiveStickers((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(sticker.id)) {
          // 스티커 끄기
          newSet.delete(sticker.id);
          setStickers((prevStickers) =>
            prevStickers.filter((s) => s.sticker.id !== sticker.id)
          );
        } else {
          // 스티커 켜기 - 왼쪽 위에 배치 (사람을 가리지 않도록)
          newSet.add(sticker.id);
          const placed = createPlacedSticker(
            sticker,
            30,  // 왼쪽 여백
            30,  // 위쪽 여백
            60   // 크기
          );
          setStickers((prevStickers) => [...prevStickers, placed]);
        }
        return newSet;
      });
    }, []);

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

    // 메인 액션 버튼 텍스트
    const mainButtonText = boothState === 'idle' ? '촬영하기' : boothState === 'camera' ? '사진 찍기' : '다시 찍기';
    const handleMainAction = boothState === 'idle' ? handleStartCamera : boothState === 'camera' ? handleCapture : handleRetake;

    return (
      <div className={className} style={styles.container}>
        {/* Header */}
        <h1 style={styles.title}>Photo Booth</h1>

        {/* Main Action Button */}
        <div style={styles.mainButtonContainer}>
          <button
            onClick={handleMainAction}
            style={styles.mainButton}
          >
            {mainButtonText}
          </button>
        </div>

        {/* Camera View - idle일 때는 플레이스홀더 표시 */}
        <div style={styles.cameraContainer}>
          {boothState === 'idle' ? (
            // 초기 상태 - 플레이스홀더
            <div style={styles.placeholder}>
              <div style={styles.placeholderIcon}>📸</div>
              <p style={styles.placeholderText}>버튼을 눌러 촬영을 시작하세요</p>
            </div>
          ) : (
            <>
              {/* Hidden video element for camera stream */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ display: 'none' }}
              />

              {/* Preview canvas with filter applied */}
              {boothState === 'camera' && (
                <canvas
                  ref={previewCanvasRef}
                  style={styles.video}
                />
              )}

              {boothState === 'captured' && capturedImage && (
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

              {/* Grid overlay - 카메라 모드일 때만 */}
              {boothState === 'camera' && (
                <div style={styles.gridOverlay}>
                  <div style={styles.gridLine} />
                  <div style={{ ...styles.gridLine, left: '66.67%' }} />
                  <div style={{ ...styles.gridLineH, top: '33.33%' }} />
                  <div style={{ ...styles.gridLineH, top: '66.67%' }} />
                </div>
              )}

              {/* Host image preview */}
              {hostImage && boothState === 'camera' && (
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
            </>
          )}
        </div>

        {/* Secondary Actions - captured 상태에서만 */}
        {boothState === 'captured' && (
          <div style={styles.secondaryActions}>
            <button onClick={handleDownload} style={styles.downloadButton}>
              📥 다운로드
            </button>
          </div>
        )}

        {/* Filter & Sticker Controls - camera 모드일 때만 */}
        {boothState === 'camera' && (
          <div style={styles.controlsContainer}>
            {/* Filter Section */}
            <div style={styles.controlSection}>
              <p style={styles.sectionLabel}>필터</p>
              <div style={styles.toggleGrid}>
                {FILTER_LIST.filter(f => f.type !== 'none').map((filter) => (
                  <button
                    key={filter.type}
                    onClick={() => handleFilterToggle(filter.type)}
                    style={{
                      ...styles.toggleButton,
                      ...(selectedFilter === filter.type
                        ? styles.toggleButtonActive
                        : {}),
                    }}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sticker Section */}
            <div style={styles.controlSection}>
              <p style={styles.sectionLabel}>스티커</p>
              <div style={styles.toggleGrid}>
                {generalStickers.map((sticker) => (
                  <button
                    key={sticker.id}
                    onClick={() => handleStickerToggle(sticker)}
                    style={{
                      ...styles.stickerToggleButton,
                      ...(activeStickers.has(sticker.id)
                        ? styles.toggleButtonActive
                        : {}),
                    }}
                  >
                    {sticker.emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

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
    backgroundColor: 'transparent',
    padding: '16px',
    fontFamily: 'system-ui, sans-serif',
  },
  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '28px',
    fontStyle: 'italic',
    fontWeight: 400,
    margin: '0 0 16px 0',
    color: 'var(--color-text-primary, #333)',
  },
  mainButtonContainer: {
    marginBottom: '16px',
  },
  mainButton: {
    padding: '14px 32px',
    border: 'none',
    borderRadius: '28px',
    backgroundColor: '#1a1a1a',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.2s, opacity 0.2s',
  },
  secondaryActions: {
    marginTop: '16px',
  },
  downloadButton: {
    padding: '12px 24px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    borderRadius: '24px',
    backgroundColor: 'white',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '12px',
  },
  placeholderIcon: {
    fontSize: '64px',
  },
  placeholderText: {
    fontSize: '14px',
    color: '#666',
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
  controlsContainer: {
    width: '100%',
    maxWidth: '400px',
    marginTop: '16px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  controlSection: {
    marginBottom: '16px',
  },
  sectionLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '10px',
  },
  toggleGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  toggleButton: {
    padding: '8px 14px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    borderRadius: '20px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    color: '#333',
    transition: 'all 0.2s',
  },
  toggleButtonActive: {
    borderColor: '#1a1a1a',
    backgroundColor: '#1a1a1a',
    color: 'white',
  },
  stickerToggleButton: {
    width: '44px',
    height: '44px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    borderRadius: '12px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
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
