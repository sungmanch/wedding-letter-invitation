'use client';

import {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { useCamera } from './useCamera';
import { FILTER_LIST, applyFilter } from './filters';
import { loadImage } from './frames';
import type { FilterType, CustomFrame } from './types';

// 9:16 비율 (인스타그램 스토리)
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;
const PREVIEW_SCALE = 0.3; // 프리뷰용 스케일

export type PhotoBoothModalProps = {
  isOpen: boolean;
  onClose: () => void;
  frames: CustomFrame[];
  title?: string;
  onCapture?: (dataUrl: string) => void;
};

export function PhotoBoothModal({
  isOpen,
  onClose,
  frames,
  title = 'Wedding Day',
  onCapture,
}: PhotoBoothModalProps) {
  const { videoRef, state: cameraState, startCamera, stopCamera } = useCamera();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(0);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [frameImages, setFrameImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const selectedFrame = frames.length > 0 ? frames[selectedFrameIndex] : null;

  // 모달 열릴 때 카메라 시작
  useEffect(() => {
    if (isOpen) {
      startCamera('user');
      document.body.style.overflow = 'hidden';
    } else {
      stopCamera();
      document.body.style.overflow = '';
      setCapturedImage(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, startCamera, stopCamera]);

  // 프레임 이미지들 미리 로드
  useEffect(() => {
    const loadFrameImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      for (const frame of frames) {
        if (frame.groomImage?.croppedUrl) {
          try {
            const img = await loadImage(frame.groomImage.croppedUrl);
            imageMap.set(`${frame.id}-groom`, img);
          } catch (e) {
            console.error('Failed to load groom image:', e);
          }
        }
        if (frame.brideImage?.croppedUrl) {
          try {
            const img = await loadImage(frame.brideImage.croppedUrl);
            imageMap.set(`${frame.id}-bride`, img);
          } catch (e) {
            console.error('Failed to load bride image:', e);
          }
        }
      }
      setFrameImages(imageMap);
    };
    if (frames.length > 0) {
      loadFrameImages();
    }
  }, [frames]);

  // 실시간 프리뷰 렌더링
  useEffect(() => {
    if (!isOpen || capturedImage) return;
    if (!previewCanvasRef.current || !videoRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      // 9:16 비율 프리뷰
      const previewWidth = CANVAS_WIDTH * PREVIEW_SCALE;
      const previewHeight = CANVAS_HEIGHT * PREVIEW_SCALE;
      if (canvas.width !== previewWidth || canvas.height !== previewHeight) {
        canvas.width = previewWidth;
        canvas.height = previewHeight;
      }

      // 비디오를 9:16에 맞춰 그리기 (cover)
      const videoAspect = video.videoWidth / video.videoHeight;
      const canvasAspect = canvas.width / canvas.height;

      let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;

      if (videoAspect > canvasAspect) {
        sw = video.videoHeight * canvasAspect;
        sx = (video.videoWidth - sw) / 2;
      } else {
        sh = video.videoWidth / canvasAspect;
        sy = (video.videoHeight - sh) / 2;
      }

      // 전면 카메라 미러링
      ctx.save();
      if (cameraState.facing === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // 필터 적용
      if (selectedFilter !== 'none') {
        applyFilter(ctx, canvas.width, canvas.height, selectedFilter);
      }

      // 프레임 오버레이 그리기
      if (selectedFrame) {
        const groomImg = frameImages.get(`${selectedFrame.id}-groom`);
        const brideImg = frameImages.get(`${selectedFrame.id}-bride`);

        if (groomImg && selectedFrame.groomImage) {
          const pos = selectedFrame.groomImage.position;
          // 프레임 에디터 좌표(기준: 540x960)를 프리뷰 좌표로 변환
          const scale = previewWidth / 540;
          ctx.save();
          ctx.translate((pos.x + pos.width / 2) * scale, (pos.y + pos.height / 2) * scale);
          ctx.rotate((pos.rotation * Math.PI) / 180);
          ctx.drawImage(groomImg, (-pos.width / 2) * scale, (-pos.height / 2) * scale, pos.width * scale, pos.height * scale);
          ctx.restore();
        }

        if (brideImg && selectedFrame.brideImage) {
          const pos = selectedFrame.brideImage.position;
          const scale = previewWidth / 540;
          ctx.save();
          ctx.translate((pos.x + pos.width / 2) * scale, (pos.y + pos.height / 2) * scale);
          ctx.rotate((pos.rotation * Math.PI) / 180);
          ctx.drawImage(brideImg, (-pos.width / 2) * scale, (-pos.height / 2) * scale, pos.width * scale, pos.height * scale);
          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isOpen, capturedImage, cameraState.facing, selectedFilter, selectedFrame, frameImages]);

  // 촬영
  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !cameraState.isStreaming) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 고해상도 캡처 (1080x1920)
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // 비디오 그리기
    const videoAspect = video.videoWidth / video.videoHeight;
    const canvasAspect = canvas.width / canvas.height;

    let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;

    if (videoAspect > canvasAspect) {
      sw = video.videoHeight * canvasAspect;
      sx = (video.videoWidth - sw) / 2;
    } else {
      sh = video.videoWidth / canvasAspect;
      sy = (video.videoHeight - sh) / 2;
    }

    ctx.save();
    if (cameraState.facing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 필터 적용
    if (selectedFilter !== 'none') {
      applyFilter(ctx, canvas.width, canvas.height, selectedFilter);
    }

    // 프레임 오버레이 그리기
    if (selectedFrame) {
      const groomImg = frameImages.get(`${selectedFrame.id}-groom`);
      const brideImg = frameImages.get(`${selectedFrame.id}-bride`);

      // 프레임 에디터 좌표(기준: 540x960)를 고해상도(1080x1920)로 변환
      const scale = CANVAS_WIDTH / 540;

      if (groomImg && selectedFrame.groomImage) {
        const pos = selectedFrame.groomImage.position;
        ctx.save();
        ctx.translate((pos.x + pos.width / 2) * scale, (pos.y + pos.height / 2) * scale);
        ctx.rotate((pos.rotation * Math.PI) / 180);
        ctx.drawImage(groomImg, (-pos.width / 2) * scale, (-pos.height / 2) * scale, pos.width * scale, pos.height * scale);
        ctx.restore();
      }

      if (brideImg && selectedFrame.brideImage) {
        const pos = selectedFrame.brideImage.position;
        ctx.save();
        ctx.translate((pos.x + pos.width / 2) * scale, (pos.y + pos.height / 2) * scale);
        ctx.rotate((pos.rotation * Math.PI) / 180);
        ctx.drawImage(brideImg, (-pos.width / 2) * scale, (-pos.height / 2) * scale, pos.width * scale, pos.height * scale);
        ctx.restore();
      }
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    onCapture?.(dataUrl);
  }, [cameraState, selectedFilter, selectedFrame, frameImages, onCapture]);

  // 다시 찍기
  const handleRetake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  // 다운로드
  const handleDownload = useCallback(() => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.download = `photobooth-${Date.now()}.jpg`;
    link.href = capturedImage;
    link.click();
  }, [capturedImage]);

  // 프레임 변경 (좌우)
  const handlePrevFrame = useCallback(() => {
    setSelectedFrameIndex((prev) => (prev > 0 ? prev - 1 : frames.length - 1));
  }, [frames.length]);

  const handleNextFrame = useCallback(() => {
    setSelectedFrameIndex((prev) => (prev < frames.length - 1 ? prev + 1 : 0));
  }, [frames.length]);

  if (!isOpen) return null;

  const modalContent = (
    <div style={styles.overlay}>
      {/* 헤더 */}
      <div style={styles.header}>
        <button onClick={onClose} style={styles.closeButton}>
          ✕
        </button>
        <div style={styles.headerSpacer} />
        <button
          onClick={() => setShowFilterPopover(!showFilterPopover)}
          style={styles.filterButton}
        >
          필터 {selectedFilter !== 'none' && '✓'}
        </button>

        {/* 필터 팝오버 */}
        {showFilterPopover && (
          <div style={styles.filterPopover}>
            {FILTER_LIST.map((filter) => (
              <button
                key={filter.type}
                onClick={() => {
                  setSelectedFilter(filter.type);
                  setShowFilterPopover(false);
                }}
                style={{
                  ...styles.filterOption,
                  ...(selectedFilter === filter.type ? styles.filterOptionActive : {}),
                }}
              >
                {filter.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 카메라 뷰 */}
      <div style={styles.cameraContainer}>
        {/* Hidden video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ display: 'none' }}
        />

        {/* 프리뷰 또는 캡처 이미지 */}
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" style={styles.capturedImage} />
        ) : (
          <canvas ref={previewCanvasRef} style={styles.previewCanvas} />
        )}

        {/* 캡처용 히든 캔버스 */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* 하단 컨트롤 */}
      <div style={styles.footer}>
        {capturedImage ? (
          // 캡처 후 액션
          <div style={styles.capturedActions}>
            <button onClick={handleRetake} style={styles.actionButton}>
              다시 찍기
            </button>
            <button onClick={handleDownload} style={styles.downloadButton}>
              저장하기
            </button>
          </div>
        ) : (
          // 촬영 모드
          <div style={styles.captureControls}>
            {/* 왼쪽 프레임 */}
            <button
              onClick={handlePrevFrame}
              style={styles.framePreviewButton}
              disabled={frames.length <= 1}
            >
              {frames.length > 1 && selectedFrameIndex > 0 ? (
                <FrameThumbnail frame={frames[selectedFrameIndex - 1]} size={48} />
              ) : frames.length > 1 ? (
                <FrameThumbnail frame={frames[frames.length - 1]} size={48} />
              ) : null}
            </button>

            {/* 촬영 버튼 (가운데) */}
            <button onClick={handleCapture} style={styles.captureButton}>
              <div style={styles.captureButtonInner}>
                {selectedFrame && (
                  <FrameThumbnail frame={selectedFrame} size={56} />
                )}
              </div>
            </button>

            {/* 오른쪽 프레임 */}
            <button
              onClick={handleNextFrame}
              style={styles.framePreviewButton}
              disabled={frames.length <= 1}
            >
              {frames.length > 1 && selectedFrameIndex < frames.length - 1 ? (
                <FrameThumbnail frame={frames[selectedFrameIndex + 1]} size={48} />
              ) : frames.length > 1 ? (
                <FrameThumbnail frame={frames[0]} size={48} />
              ) : null}
            </button>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {cameraState.error && (
        <div style={styles.error}>{cameraState.error}</div>
      )}
    </div>
  );

  // Portal로 body에 렌더링
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

// 프레임 썸네일 컴포넌트
function FrameThumbnail({ frame, size }: { frame: CustomFrame; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size * (16 / 9),
        backgroundColor: frame.backgroundColor || '#f5f5f5',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {frame.groomImage?.croppedUrl && (
        <img
          src={frame.groomImage.croppedUrl}
          alt=""
          style={{
            position: 'absolute',
            left: `${(frame.groomImage.position.x / 540) * 100}%`,
            top: `${(frame.groomImage.position.y / 960) * 100}%`,
            width: `${(frame.groomImage.position.width / 540) * 100}%`,
            height: 'auto',
            pointerEvents: 'none',
          }}
        />
      )}
      {frame.brideImage?.croppedUrl && (
        <img
          src={frame.brideImage.croppedUrl}
          alt=""
          style={{
            position: 'absolute',
            left: `${(frame.brideImage.position.x / 540) * 100}%`,
            top: `${(frame.brideImage.position.y / 960) * 100}%`,
            width: `${(frame.brideImage.position.width / 540) * 100}%`,
            height: 'auto',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    paddingTop: 'max(12px, env(safe-area-inset-top))',
    position: 'relative',
  },
  closeButton: {
    width: 40,
    height: 40,
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    color: 'white',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  filterButton: {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    color: 'white',
    fontSize: 14,
    cursor: 'pointer',
  },
  filterPopover: {
    position: 'absolute',
    top: '100%',
    right: 16,
    backgroundColor: 'rgba(30,30,30,0.95)',
    borderRadius: 12,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 120,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  filterOption: {
    padding: '10px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 14,
    cursor: 'pointer',
    textAlign: 'left',
    borderRadius: 8,
  },
  filterOptionActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cameraContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewCanvas: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  capturedImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  footer: {
    padding: '16px',
    paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
  },
  captureControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  framePreviewButton: {
    width: 56,
    height: 56,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    border: '4px solid white',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  capturedActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    padding: '14px 28px',
    border: '1px solid rgba(255,255,255,0.3)',
    backgroundColor: 'transparent',
    borderRadius: 28,
    color: 'white',
    fontSize: 16,
    cursor: 'pointer',
  },
  downloadButton: {
    padding: '14px 28px',
    border: 'none',
    backgroundColor: 'white',
    borderRadius: 28,
    color: '#000',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
  error: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    padding: '12px 16px',
    backgroundColor: 'rgba(255,0,0,0.8)',
    borderRadius: 8,
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
};
