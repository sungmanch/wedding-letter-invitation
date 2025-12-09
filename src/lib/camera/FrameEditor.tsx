'use client';

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useFrameEditor } from './useFrameEditor';
import { ImageCropper, ImageCropperRef } from '../kropper';
import type { CustomFrame, PersonImage } from './types';

export type FrameEditorRef = {
  getFrame: () => CustomFrame;
  reset: () => void;
};

export type FrameEditorProps = {
  initialFrame?: CustomFrame;
  onSave?: (frame: CustomFrame) => void;
  onCancel?: () => void;
  className?: string;
};

export const FrameEditor = forwardRef<FrameEditorRef, FrameEditorProps>(
  function FrameEditor({ initialFrame, onSave, onCancel, className }, ref) {
    const {
      state,
      nextStep,
      prevStep,
      setGroomImage,
      setBrideImage,
      setGroomCroppedImage,
      setBrideCroppedImage,
      updateGroomPosition,
      updateBridePosition,
      setFrameName,
      setBackgroundColor,
      reset,
      canGoNext,
      getStepInfo,
      getCurrentStepIndex,
      getTotalSteps,
    } = useFrameEditor(initialFrame);

    const cropperRef = useRef<ImageCropperRef>(null);
    const [dragTarget, setDragTarget] = useState<'groom' | 'bride' | null>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const stepInfo = getStepInfo();
    const currentStep = getCurrentStepIndex();
    const totalSteps = getTotalSteps();

    useImperativeHandle(
      ref,
      () => ({
        getFrame: () => state.frame,
        reset,
      }),
      [state.frame, reset]
    );

    const handleFileUpload = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>, type: 'groom' | 'bride') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (type === 'groom') {
            setGroomImage(dataUrl);
          } else {
            setBrideImage(dataUrl);
          }
          nextStep();
        };
        reader.readAsDataURL(file);
      },
      [setGroomImage, setBrideImage, nextStep]
    );

    const handleCrop = useCallback(async () => {
      if (!cropperRef.current) return;

      const blob = await cropperRef.current.crop('image/png');
      if (!blob) return;

      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      if (state.step === 'groom-crop') {
        setGroomCroppedImage(dataUrl);
      } else if (state.step === 'bride-crop') {
        setBrideCroppedImage(dataUrl);
      }

      nextStep();
    }, [state.step, setGroomCroppedImage, setBrideCroppedImage, nextStep]);

    const handleSave = useCallback(() => {
      onSave?.(state.frame);
    }, [state.frame, onSave]);

    // Drag handlers for arrange step
    const handlePointerDown = useCallback(
      (e: React.PointerEvent, target: 'groom' | 'bride') => {
        setDragTarget(target);
        setDragStart({ x: e.clientX, y: e.clientY });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      },
      []
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!dragTarget) return;

        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;

        if (dragTarget === 'groom' && state.frame.groomImage) {
          updateGroomPosition({
            x: state.frame.groomImage.position.x + dx,
            y: state.frame.groomImage.position.y + dy,
          });
        } else if (dragTarget === 'bride' && state.frame.brideImage) {
          updateBridePosition({
            x: state.frame.brideImage.position.x + dx,
            y: state.frame.brideImage.position.y + dy,
          });
        }

        setDragStart({ x: e.clientX, y: e.clientY });
      },
      [dragTarget, dragStart, state.frame, updateGroomPosition, updateBridePosition]
    );

    const handlePointerUp = useCallback(() => {
      setDragTarget(null);
    }, []);

    const renderStepContent = () => {
      switch (state.step) {
        case 'groom-upload':
        case 'bride-upload':
          return (
            <UploadStep
              personType={stepInfo.personType!}
              onUpload={(e) =>
                handleFileUpload(e, stepInfo.personType as 'groom' | 'bride')
              }
            />
          );

        case 'groom-crop':
          return (
            <CropStep
              ref={cropperRef}
              imageUrl={state.frame.groomImage?.originalUrl || ''}
              onCrop={handleCrop}
            />
          );

        case 'bride-crop':
          return (
            <CropStep
              ref={cropperRef}
              imageUrl={state.frame.brideImage?.originalUrl || ''}
              onCrop={handleCrop}
            />
          );

        case 'arrange':
          return (
            <ArrangeStep
              frame={state.frame}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onBackgroundChange={setBackgroundColor}
            />
          );

        case 'name':
          return (
            <NameStep
              name={state.frame.name}
              onChange={setFrameName}
            />
          );

        case 'complete':
          return <CompleteStep frame={state.frame} />;

        default:
          return null;
      }
    };

    return (
      <div className={className} style={styles.container}>
        {/* Progress */}
        <div style={styles.progress}>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressBar,
                width: `${(currentStep / totalSteps) * 100}%`,
              }}
            />
          </div>
          <span style={styles.progressText}>
            {currentStep + 1} / {totalSteps + 1}
          </span>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>{stepInfo.title}</h2>
          <p style={styles.description}>{stepInfo.description}</p>
        </div>

        {/* Content */}
        <div style={styles.content}>{renderStepContent()}</div>

        {/* Footer */}
        <div style={styles.footer}>
          {state.step !== 'groom-upload' && state.step !== 'complete' && (
            <button onClick={prevStep} style={styles.secondaryButton}>
              이전
            </button>
          )}

          {state.step === 'groom-upload' && onCancel && (
            <button onClick={onCancel} style={styles.secondaryButton}>
              취소
            </button>
          )}

          {state.step === 'complete' ? (
            <button onClick={handleSave} style={styles.primaryButton}>
              저장하기
            </button>
          ) : state.step === 'groom-crop' || state.step === 'bride-crop' ? (
            <button onClick={handleCrop} style={styles.primaryButton}>
              자르기
            </button>
          ) : state.step !== 'groom-upload' && state.step !== 'bride-upload' ? (
            <button
              onClick={nextStep}
              disabled={!canGoNext()}
              style={{
                ...styles.primaryButton,
                opacity: canGoNext() ? 1 : 0.5,
              }}
            >
              다음
            </button>
          ) : null}
        </div>

        {/* Error */}
        {state.error && <div style={styles.error}>{state.error}</div>}
      </div>
    );
  }
);

// Sub-components
function UploadStep({
  personType,
  onUpload,
}: {
  personType: 'groom' | 'bride';
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const label = personType === 'groom' ? '신랑' : '신부';

  return (
    <div style={styles.uploadContainer}>
      <div
        style={styles.uploadArea}
        onClick={() => inputRef.current?.click()}
      >
        <span style={styles.uploadIcon}>📷</span>
        <p style={styles.uploadText}>{label} 사진을 선택해주세요</p>
        <p style={styles.uploadHint}>배경이 제거된 PNG 이미지를 권장합니다</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
}

const CropStep = forwardRef<
  ImageCropperRef,
  { imageUrl: string; onCrop: () => void }
>(function CropStep({ imageUrl }, ref) {
  return (
    <div style={styles.cropContainer}>
      <ImageCropper
        ref={ref}
        src={imageUrl}
        width={300}
        height={300}
        shape="square"
        showShapeBorder={true}
        minZoom={0.3}
        maxZoom={3}
      />
      <p style={styles.cropHint}>드래그하여 위치 조정, 휠로 확대/축소</p>
    </div>
  );
});

function ArrangeStep({
  frame,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onBackgroundChange,
}: {
  frame: CustomFrame;
  onPointerDown: (e: React.PointerEvent, target: 'groom' | 'bride') => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onBackgroundChange: (color: string) => void;
}) {
  const backgroundColors = [
    '#ffffff',
    '#f5f5f5',
    '#fef3e2',
    '#e8f5e9',
    '#e3f2fd',
    '#fce4ec',
    '#f3e5f5',
    '#1a1a1a',
  ];

  return (
    <div style={styles.arrangeContainer}>
      {/* Preview Canvas */}
      <div
        style={{
          ...styles.arrangePreview,
          backgroundColor: frame.backgroundColor,
        }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {frame.groomImage?.croppedUrl && (
          <img
            src={frame.groomImage.croppedUrl}
            alt="신랑"
            style={{
              ...styles.arrangeImage,
              left: frame.groomImage.position.x,
              top: frame.groomImage.position.y,
              width: frame.groomImage.position.width,
              height: frame.groomImage.position.height,
              transform: `rotate(${frame.groomImage.position.rotation}deg)`,
            }}
            onPointerDown={(e) => onPointerDown(e, 'groom')}
          />
        )}
        {frame.brideImage?.croppedUrl && (
          <img
            src={frame.brideImage.croppedUrl}
            alt="신부"
            style={{
              ...styles.arrangeImage,
              left: frame.brideImage.position.x,
              top: frame.brideImage.position.y,
              width: frame.brideImage.position.width,
              height: frame.brideImage.position.height,
              transform: `rotate(${frame.brideImage.position.rotation}deg)`,
            }}
            onPointerDown={(e) => onPointerDown(e, 'bride')}
          />
        )}
      </div>

      {/* Background Color Picker */}
      <div style={styles.colorPicker}>
        <span style={styles.colorLabel}>배경색</span>
        <div style={styles.colorGrid}>
          {backgroundColors.map((color) => (
            <button
              key={color}
              onClick={() => onBackgroundChange(color)}
              style={{
                ...styles.colorButton,
                backgroundColor: color,
                border:
                  frame.backgroundColor === color
                    ? '2px solid #3b82f6'
                    : '1px solid #e0e0e0',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NameStep({
  name,
  onChange,
}: {
  name: string;
  onChange: (name: string) => void;
}) {
  return (
    <div style={styles.nameContainer}>
      <input
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder="프레임 이름을 입력하세요"
        style={styles.nameInput}
      />
    </div>
  );
}

function CompleteStep({ frame }: { frame: CustomFrame }) {
  return (
    <div style={styles.completeContainer}>
      <div
        style={{
          ...styles.completePreview,
          backgroundColor: frame.backgroundColor,
        }}
      >
        {frame.groomImage?.croppedUrl && (
          <img
            src={frame.groomImage.croppedUrl}
            alt="신랑"
            style={{
              ...styles.completeImage,
              left: frame.groomImage.position.x * 0.5,
              top: frame.groomImage.position.y * 0.5,
              width: frame.groomImage.position.width * 0.5,
              height: frame.groomImage.position.height * 0.5,
            }}
          />
        )}
        {frame.brideImage?.croppedUrl && (
          <img
            src={frame.brideImage.croppedUrl}
            alt="신부"
            style={{
              ...styles.completeImage,
              left: frame.brideImage.position.x * 0.5,
              top: frame.brideImage.position.y * 0.5,
              width: frame.brideImage.position.width * 0.5,
              height: frame.brideImage.position.height * 0.5,
            }}
          />
        )}
      </div>
      <h3 style={styles.completeName}>{frame.name}</h3>
      <p style={styles.completeText}>프레임이 준비되었습니다!</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, sans-serif',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  progressTrack: {
    flex: 1,
    height: '4px',
    backgroundColor: '#e0e0e0',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '14px',
    color: '#666',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    margin: '0 0 8px 0',
  },
  description: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  content: {
    flex: 1,
    minHeight: '300px',
  },
  footer: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  primaryButton: {
    flex: 1,
    padding: '14px 24px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#1a1a1a',
    color: 'white',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '14px 24px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    backgroundColor: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center',
  },
  // Upload Step
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  uploadArea: {
    width: '100%',
    padding: '48px 24px',
    border: '2px dashed #e0e0e0',
    borderRadius: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  uploadIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  uploadText: {
    fontSize: '16px',
    fontWeight: 500,
    margin: '0 0 8px 0',
  },
  uploadHint: {
    fontSize: '13px',
    color: '#888',
    margin: 0,
  },
  // Crop Step
  cropContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cropHint: {
    marginTop: '12px',
    fontSize: '13px',
    color: '#666',
  },
  // Arrange Step
  arrangeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  arrangePreview: {
    position: 'relative',
    width: '300px',
    height: '300px',
    margin: '0 auto',
    borderRadius: '12px',
    overflow: 'hidden',
    touchAction: 'none',
  },
  arrangeImage: {
    position: 'absolute',
    objectFit: 'contain',
    cursor: 'move',
    touchAction: 'none',
  },
  colorPicker: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  colorLabel: {
    fontSize: '14px',
    color: '#666',
  },
  colorGrid: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: 0,
  },
  // Name Step
  nameContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 0',
  },
  nameInput: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    textAlign: 'center',
    outline: 'none',
  },
  // Complete Step
  completeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
  },
  completePreview: {
    position: 'relative',
    width: '200px',
    height: '200px',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  completeImage: {
    position: 'absolute',
    objectFit: 'contain',
  },
  completeName: {
    fontSize: '18px',
    fontWeight: 600,
    margin: '0 0 8px 0',
  },
  completeText: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
};
