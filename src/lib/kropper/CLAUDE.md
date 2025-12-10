# Kropper - 이미지 크로퍼 라이브러리

Canvas 기반 이미지 크롭 라이브러리. 다양한 모양(원형, 하트, 별 등)으로 이미지를 자를 수 있습니다.

## 기본 사용법

### 1. ImageCropper 컴포넌트 (권장)

```tsx
import { ImageCropper, ImageCropperRef } from '@/lib/kropper';

const cropperRef = useRef<ImageCropperRef>(null);

<ImageCropper
  ref={cropperRef}
  src="/image.jpg"
  width={300}
  height={300}
  shape="heart"           // 크롭 모양
  showShapeBorder={true}  // 모양 테두리 표시
  showGrid={false}        // 3분할 그리드
  onCrop={(blob) => console.log(blob)}
/>

// 크롭 실행
const blob = await cropperRef.current?.crop('image/png');
```

### 2. useKropper 훅

```tsx
import { useKropper } from '@/lib/kropper';

const { canvasRef, setImage, crop, setZoom, setShape } = useKropper({
  shape: 'circle',
  minZoom: 0.5,
  maxZoom: 3,
});

<canvas ref={canvasRef} width={300} height={300} />

// 이미지 로드
await setImage('/photo.jpg');

// 모양 변경
setShape('star');

// 크롭
const blob = await crop('image/png');
```

## 지원 모양 (Shape Presets)

| 키 | 이름 | 설명 |
|---|---|---|
| `rectangle` | 사각형 | 기본값 |
| `circle` | 원형 | 프로필 사진용 |
| `ellipse` | 타원 | 가로 타원 |
| `ellipseVertical` | 세로 타원 | 세로로 길쭉한 타원 |
| `heart` | 하트 | 베지어 커브 하트 |
| `star` | 별 | 5각 별 |
| `car` | 자동차 | 자동차 실루엣 |
| `rabbit` | 토끼 | 토끼 얼굴 |
| `roundedRect` | 둥근 사각형 | 모서리 둥근 사각형 |
| `hexagon` | 육각형 | 정육각형 |

## ShapeSelector 컴포넌트

모양 선택 UI를 빠르게 구현:

```tsx
import { ShapeSelector } from '@/lib/kropper';

const [shape, setShape] = useState('circle');

<ShapeSelector
  value={shape}
  onChange={setShape}
  shapes={['circle', 'heart', 'star']} // 표시할 모양만 선택
/>
```

## 커스텀 모양 추가

### 방법 1: createCustomShape 사용

```tsx
import { createCustomShape } from '@/lib/kropper';

const diamond = createCustomShape(
  '다이아몬드',
  'M50 0 L100 50 L50 100 L0 50 Z', // SVG path
  100, 100 // viewBox 크기
);

<ImageCropper customShapePath={diamond.path} />
```

### 방법 2: Path2D 직접 생성

```tsx
const trianglePath = (w: number, h: number) => {
  const path = new Path2D();
  path.moveTo(w / 2, 0);
  path.lineTo(w, h);
  path.lineTo(0, h);
  path.closePath();
  return path;
};

<ImageCropper customShapePath={trianglePath} />
```

## Props 레퍼런스

### ImageCropperProps

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `src` | `string` | - | 이미지 URL |
| `width` | `number` | 300 | 캔버스 너비 |
| `height` | `number` | 300 | 캔버스 높이 |
| `shape` | `CropShapeType` | `'rectangle'` | 크롭 모양 |
| `showShapeBorder` | `boolean` | `true` | 모양 테두리 표시 |
| `showGrid` | `boolean` | `false` | 3분할 그리드 표시 |
| `gridLines` | `number` | 3 | 그리드 라인 수 |
| `minZoom` | `number` | 0.5 | 최소 줌 |
| `maxZoom` | `number` | 3 | 최대 줌 |
| `initialZoom` | `number` | 1 | 초기 줌 |
| `customShapePath` | `(w, h) => Path2D` | - | 커스텀 모양 |
| `onCrop` | `(blob) => void` | - | 크롭 완료 콜백 |
| `onZoomChange` | `(zoom) => void` | - | 줌 변경 콜백 |
| `onShapeChange` | `(shape) => void` | - | 모양 변경 콜백 |

### ImageCropperRef 메서드

| 메서드 | 설명 |
|--------|------|
| `crop(type?)` | 이미지 크롭 후 Blob 반환 |
| `reset()` | 위치/줌 초기화 |
| `setZoom(zoom)` | 줌 레벨 설정 |
| `setShape(shape)` | 크롭 모양 변경 |
| `setImage(src)` | 이미지 변경 |

## 인터랙션

- **마우스 드래그**: 이미지 이동
- **마우스 휠**: 줌 인/아웃
- **터치 드래그**: 이미지 이동 (모바일)
- **핀치 줌**: 줌 인/아웃 (모바일)

## 파일 구조

```
src/lib/kropper/
├── index.ts           # 모듈 export
├── types.ts           # 타입 정의
├── core.ts            # 핵심 크로퍼 로직
├── shapes.ts          # 모양 프리셋 + 커스텀 모양 유틸
├── useKropper.ts      # React 훅
├── ImageCropper.tsx   # React 컴포넌트
└── CLAUDE.md          # 이 문서
```
