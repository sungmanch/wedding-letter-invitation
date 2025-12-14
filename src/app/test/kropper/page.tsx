'use client';

import { useRef, useState } from 'react';
import {
  ImageCropper,
  ImageCropperRef,
  ShapeSelector,
  CROP_SHAPES,
  type CropShapeType,
} from '@/lib/kropper';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
];

export default function KropperTestPage() {
  const cropperRef = useRef<ImageCropperRef>(null);
  const [shape, setShape] = useState<CropShapeType>('circle');
  const [showGrid, setShowGrid] = useState(false);
  const [showShapeBorder, setShowShapeBorder] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const handleCrop = async () => {
    const blob = await cropperRef.current?.crop('image/png');
    if (blob) {
      const url = URL.createObjectURL(blob);
      setCroppedImage(url);
    }
  };

  const handleReset = () => {
    cropperRef.current?.reset();
    setZoom(1);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    cropperRef.current?.setZoom(newZoom);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImage(url);
      setSelectedImage(url);
    }
  };

  const handleShapeChange = (newShape: string) => {
    setShape(newShape as CropShapeType);
  };

  const currentImage = customImage || selectedImage;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Kropper 테스트</h1>
        <p className="text-gray-600 mb-8">이미지 크롭 라이브러리 테스트 페이지</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 크로퍼 영역 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">이미지 크로퍼</h2>

            <div className="flex justify-center mb-4">
              <ImageCropper
                ref={cropperRef}
                src={currentImage}
                width={300}
                height={300}
                shape={shape}
                showGrid={showGrid}
                showShapeBorder={showShapeBorder}
                minZoom={0.5}
                maxZoom={3}
                initialZoom={1}
                onZoomChange={setZoom}
              />
            </div>

            <p className="text-sm text-gray-500 text-center mb-4">
              드래그로 이동, 스크롤로 줌
            </p>

            {/* 줌 슬라이더 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                줌: {zoom.toFixed(2)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={handleZoomChange}
                className="w-full"
              />
            </div>

            {/* 버튼들 */}
            <div className="flex gap-2">
              <button
                onClick={handleCrop}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                크롭
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                리셋
              </button>
            </div>
          </div>

          {/* 설정 영역 */}
          <div className="space-y-6">
            {/* 이미지 선택 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">이미지 선택</h2>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {SAMPLE_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCustomImage(null);
                      setSelectedImage(img);
                    }}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === img && !customImage
                        ? 'border-blue-500'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Sample ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <label className="block">
                <span className="text-sm font-medium">직접 업로드</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>
            </div>

            {/* 모양 선택 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">크롭 모양</h2>
              <ShapeSelector
                value={shape}
                onChange={handleShapeChange}
                shapes={Object.keys(CROP_SHAPES) as CropShapeType[]}
              />
            </div>

            {/* 옵션 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">옵션</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded"
                  />
                  <span>그리드 표시</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showShapeBorder}
                    onChange={(e) => setShowShapeBorder(e.target.checked)}
                    className="rounded"
                  />
                  <span>모양 테두리 표시</span>
                </label>
              </div>
            </div>

            {/* 크롭 결과 */}
            {croppedImage && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">크롭 결과</h2>
                <div className="flex justify-center">
                  <img
                    src={croppedImage}
                    alt="Cropped"
                    className="max-w-full rounded-lg shadow"
                    style={{ background: 'repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50%/16px 16px' }}
                  />
                </div>
                <a
                  href={croppedImage}
                  download="cropped-image.png"
                  className="mt-4 block text-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  다운로드
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
