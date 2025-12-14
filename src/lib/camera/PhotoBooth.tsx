'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { PhotoBoothModal } from './PhotoBoothModal';
import type { CustomFrame } from './types';

export type PhotoBoothRef = {
  open: () => void;
  close: () => void;
};

export type PhotoBoothProps = {
  title?: string;
  frames?: CustomFrame[];
  onCapture?: (dataUrl: string) => void;
  className?: string;
};

export const PhotoBooth = forwardRef<PhotoBoothRef, PhotoBoothProps>(
  function PhotoBooth(
    {
      title = "Wedding Day",
      frames = [],
      onCapture,
      className,
    },
    ref
  ) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastCapturedImage, setLastCapturedImage] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      open: () => setIsModalOpen(true),
      close: () => setIsModalOpen(false),
    }), []);

    const handleCapture = (dataUrl: string) => {
      setLastCapturedImage(dataUrl);
      onCapture?.(dataUrl);
    };

    // 현재 선택된 프레임 (첫 번째)
    const previewFrame = frames.length > 0 ? frames[0] : null;

    return (
      <>
        <div className={className} style={styles.container}>
          {/* 타이틀 */}
          <h2 style={styles.title}>Photo Booth</h2>
          <p style={styles.subtitle}>특별한 순간을 함께 기록하세요</p>

          {/* 프리뷰 영역 */}
          <div style={styles.previewContainer}>
            {lastCapturedImage ? (
              // 마지막 촬영 이미지
              <img
                src={lastCapturedImage}
                alt="Last captured"
                style={styles.previewImage}
              />
            ) : (
              // 플레이스홀더
              <div style={styles.placeholder}>
                <div style={styles.placeholderIcon}>📸</div>
                {previewFrame && (
                  <div style={styles.framePreview}>
                    {previewFrame.groomImage?.croppedUrl && (
                      <img
                        src={previewFrame.groomImage.croppedUrl}
                        alt=""
                        style={styles.framePreviewImage}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 촬영 버튼 */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={styles.captureButton}
          >
            {lastCapturedImage ? '다시 촬영하기' : '촬영하기'}
          </button>
        </div>

        {/* 풀스크린 모달 */}
        <PhotoBoothModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          frames={frames}
          title={title}
          onCapture={handleCapture}
        />
      </>
    );
  }
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px',
    fontFamily: 'system-ui, sans-serif',
  },
  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '24px',
    fontWeight: 400,
    margin: '0 0 8px 0',
    color: 'var(--color-text-primary, #333)',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--color-text-secondary, #666)',
    margin: '0 0 20px 0',
    textAlign: 'center',
  },
  previewContainer: {
    width: '100%',
    maxWidth: '280px',
    aspectRatio: '9/16',
    backgroundColor: 'var(--color-surface, #f5f5f5)',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    position: 'relative',
  },
  placeholderIcon: {
    fontSize: '48px',
  },
  framePreview: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    opacity: 0.5,
  },
  framePreviewImage: {
    width: '60px',
    height: 'auto',
    borderRadius: '4px',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  captureButton: {
    padding: '14px 32px',
    border: 'none',
    borderRadius: '28px',
    backgroundColor: 'var(--color-accent, #1a1a1a)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.2s, opacity 0.2s',
  },
};
