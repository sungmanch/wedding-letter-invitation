# Camera - 포토부스 라이브러리

웨딩 청첩장용 포토부스 카메라 기능. 게스트가 호스트 사진과 함께 사진을 찍고, 필터/스티커를 적용할 수 있습니다.

## 기본 사용법

```tsx
import { PhotoBooth, PhotoBoothRef } from '@/lib/camera';

const photoBoothRef = useRef<PhotoBoothRef>(null);

<PhotoBooth
  ref={photoBoothRef}
  title="Hyewon & Myeongjin's Wedding Day"
  hostImageUrl="/images/couple.jpg"
  hostPosition="left"
  onCapture={(dataUrl) => console.log('Captured!', dataUrl)}
/>

// 외부에서 제어
photoBoothRef.current?.capture();
photoBoothRef.current?.download();
photoBoothRef.current?.retake();
```

## 기능

### 1. 카메라
- 전/후면 카메라 전환
- 촬영 / 다시찍기
- 다운로드 (JPEG)

### 2. 필터 (Filter)
| 타입 | 이름 | 설명 |
|------|------|------|
| `none` | 원본 | 필터 없음 |
| `bright` | 화사하게 | 밝기 +30 |
| `grayscale` | 흑백 | Grayscale 변환 |
| `sepia` | 세피아 | 세피아 톤 |
| `contrast` | 명암 강조 | 대비 1.3배 |
| `warm` | 따뜻하게 | R+20, B-10 |
| `cool` | 차갑게 | R-10, B+20 |
| `vintage` | 빈티지 | 세피아 + 낮은 대비 |

### 3. 프레임 (Frame)
호스트 사진을 오버레이하여 게스트와 함께 찍는 효과:

```tsx
<PhotoBooth
  hostImageUrl="/images/couple.jpg"
  hostPosition="left"  // 'left' | 'right' | 'bottom' | 'top'
/>
```

### 4. 스티커 (Sticker)

**일반 스티커** (이모지 기반):
- ❤️ 빨간 하트
- 💕 핑크 하트
- ⭐ 별
- ✨ 반짝이
- 🎉 파티
- 💍 반지
- 💋 키스
- 🌸 꽃
- 등등...

**스티커 조작**:
- 드래그로 위치 이동
- 탭하여 선택 후 삭제

## Props

### PhotoBoothProps

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `title` | `string` | `"Wedding Day"` | 사진에 표시될 타이틀 |
| `hostImageUrl` | `string` | - | 호스트 사진 URL |
| `hostPosition` | `'left' \| 'right' \| 'bottom' \| 'top'` | `'left'` | 호스트 사진 위치 |
| `onCapture` | `(dataUrl: string) => void` | - | 촬영 완료 콜백 |
| `className` | `string` | - | 컨테이너 클래스 |

### PhotoBoothRef 메서드

| 메서드 | 설명 |
|--------|------|
| `capture()` | 사진 촬영, dataUrl 반환 |
| `download()` | JPEG로 다운로드 |
| `retake()` | 다시 촬영 모드로 전환 |

## 개별 훅/유틸 사용

### useCamera 훅

```tsx
import { useCamera } from '@/lib/camera';

const {
  videoRef,
  state,          // { isStreaming, isCaptured, facing, error }
  startCamera,    // (facing?: 'user' | 'environment') => Promise<void>
  stopCamera,     // () => void
  switchCamera,   // () => Promise<void>
  capture,        // (canvas, options?) => string | null
  retake,         // () => void
} = useCamera();
```

### 필터 적용

```tsx
import { applyFilter, FILTERS } from '@/lib/camera';

// 캔버스에 필터 적용
applyFilter(ctx, width, height, 'grayscale');

// 필터 목록
Object.keys(FILTERS); // ['none', 'bright', 'grayscale', ...]
```

### 스티커 유틸

```tsx
import {
  createPlacedSticker,
  moveSticker,
  resizeSticker,
  rotateSticker,
  hitTestSticker,
} from '@/lib/camera';

// 스티커 생성
const placed = createPlacedSticker(sticker, x, y, size);

// 이동/크기/회전
const moved = moveSticker(placed, dx, dy);
const resized = resizeSticker(placed, 1.2);  // 20% 확대
const rotated = rotateSticker(placed, 15);   // 15도 회전

// 클릭 위치에 스티커가 있는지 확인
const hit = hitTestSticker(x, y, stickers);
```

## 파일 구조

```
src/lib/camera/
├── index.ts           # 모듈 export
├── types.ts           # 타입 정의
├── useCamera.ts       # 카메라 훅
├── filters.ts         # 필터 프리셋 & 적용 함수
├── frames.ts          # 프레임/호스트 이미지 오버레이
├── stickers.ts        # 스티커 시스템
├── PhotoBooth.tsx     # 메인 컴포넌트
└── CLAUDE.md          # 이 문서
```

## 커스터마이징

### 커스텀 필터 추가

```tsx
import type { Filter } from '@/lib/camera';

const myFilter: Filter = {
  name: '내 필터',
  type: 'custom' as any,
  apply: (ctx, width, height) => {
    // ImageData 조작
    const imageData = ctx.getImageData(0, 0, width, height);
    // ... 픽셀 처리
    ctx.putImageData(imageData, 0, 0);
  },
};
```

### 커스텀 스티커 추가

```tsx
import type { Sticker } from '@/lib/camera';

const customStickers: Sticker[] = [
  { id: 'custom-1', name: '커스텀', emoji: '🎀', category: 'general' },
  { id: 'custom-2', name: '이미지 스티커', imageUrl: '/stickers/custom.png', category: 'general' },
];
```
