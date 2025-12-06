#!/usr/bin/env python3
"""
이미지 워터마크 제거 스크립트
다양한 인페인팅 알고리즘을 지원합니다.

사용법:
    # 마우스로 영역 선택 (기본: LaMa 딥러닝 모델)
    python remove_watermark.py input.png --select

    # 영역 직접 지정
    python remove_watermark.py input.png --x 10 --y 10 --width 200 --height 50

    # 알고리즘 선택
    python remove_watermark.py input.png --select --method lama      # 최고 품질 (딥러닝)
    python remove_watermark.py input.png --select --method opencv    # 빠름 (전통적)

    # 미리보기
    python remove_watermark.py input.png --select --preview

필요 패키지:
    pip install opencv-python numpy torch torchvision simple-lama-inpainting
"""

import argparse
import cv2
import numpy as np
from pathlib import Path
import sys


# ============================================================
# 마스크 생성
# ============================================================

def create_mask(image_shape, x, y, width, height, feather=0):
    """워터마크 영역을 마스킹하는 마스크 생성"""
    mask = np.zeros((image_shape[0], image_shape[1]), dtype=np.uint8)

    # 워터마크 영역을 흰색으로 표시
    cv2.rectangle(mask, (x, y), (x + width, y + height), 255, -1)

    # 경계를 부드럽게 (페더링) - LaMa에서는 보통 불필요
    if feather > 0:
        mask = cv2.GaussianBlur(mask, (feather * 2 + 1, feather * 2 + 1), 0)

    return mask


# ============================================================
# 인페인팅 방법들
# ============================================================

def inpaint_opencv(image, mask, method='ns', radius=5):
    """OpenCV 전통적 인페인팅 (빠르지만 품질 낮음)"""
    # 마스크 이진화
    _, binary_mask = cv2.threshold(mask, 127, 255, cv2.THRESH_BINARY)

    if method == 'telea':
        return cv2.inpaint(image, binary_mask, inpaintRadius=radius, flags=cv2.INPAINT_TELEA)
    else:  # ns (Navier-Stokes)
        return cv2.inpaint(image, binary_mask, inpaintRadius=radius, flags=cv2.INPAINT_NS)


def get_device():
    """사용 가능한 디바이스 반환 (MPS > CUDA > CPU)"""
    import torch
    if torch.backends.mps.is_available():
        return torch.device("mps")
    elif torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")


def inpaint_lama(image, mask):
    """LaMa (Large Mask Inpainting) - 최고 품질 딥러닝 모델"""
    try:
        import torch
        from PIL import Image
    except ImportError:
        print("필요한 패키지가 설치되지 않았습니다.")
        print("설치: pip install torch torchvision pillow")
        print("OpenCV 방식으로 대체합니다...")
        return inpaint_opencv(image, mask)

    try:
        from simple_lama_inpainting import SimpleLama
        from simple_lama_inpainting.models.model import get_model_path
    except ImportError:
        print("LaMa 패키지가 설치되지 않았습니다.")
        print("설치: pip install simple-lama-inpainting")
        print("OpenCV 방식으로 대체합니다...")
        return inpaint_opencv(image, mask)

    # 디바이스 설정
    device = get_device()
    print(f"디바이스: {device}")

    # 모델 로드 (CPU/MPS로 강제 매핑)
    model_path = get_model_path()
    model = torch.jit.load(model_path, map_location=device)
    model.eval()
    model.to(device)

    # SimpleLama는 RGB 이미지와 이진 마스크를 기대
    # OpenCV는 BGR이므로 변환
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # 마스크 이진화 (0 or 255)
    _, binary_mask = cv2.threshold(mask, 127, 255, cv2.THRESH_BINARY)

    # PIL Image로 변환
    pil_image = Image.fromarray(image_rgb)
    pil_mask = Image.fromarray(binary_mask)

    # 이미지 전처리
    pil_image = pil_image.convert("RGB")
    pil_mask = pil_mask.convert("L")

    # 텐서 변환
    image_tensor = torch.from_numpy(np.array(pil_image)).permute(2, 0, 1).unsqueeze(0).float() / 255.0
    mask_tensor = torch.from_numpy(np.array(pil_mask)).unsqueeze(0).unsqueeze(0).float() / 255.0

    # 디바이스로 이동
    image_tensor = image_tensor.to(device)
    mask_tensor = mask_tensor.to(device)

    # 인페인팅 실행
    with torch.no_grad():
        result_tensor = model(image_tensor, mask_tensor)

    # 결과 변환
    result_np = (result_tensor.squeeze().permute(1, 2, 0).cpu().numpy() * 255).astype(np.uint8)
    result_bgr = cv2.cvtColor(result_np, cv2.COLOR_RGB2BGR)

    return result_bgr


def inpaint_with_method(image, mask, method='lama', opencv_radius=5):
    """통합 인페인팅 함수"""
    if method == 'lama':
        return inpaint_lama(image, mask)
    elif method == 'opencv' or method == 'ns':
        return inpaint_opencv(image, mask, method='ns', radius=opencv_radius)
    elif method == 'telea':
        return inpaint_opencv(image, mask, method='telea', radius=opencv_radius)
    else:
        print(f"알 수 없는 방법: {method}, LaMa로 대체")
        return inpaint_lama(image, mask)


# ============================================================
# UI 함수들
# ============================================================

def detect_watermark_region(image):
    """이미지를 표시하고 사용자가 워터마크 영역을 선택하도록 함"""
    print("=" * 50)
    print("마우스로 워터마크 영역을 드래그하여 선택하세요.")
    print("Enter/Space: 확정 | C: 취소")
    print("=" * 50)

    # 이미지가 너무 크면 리사이즈
    display_image = image.copy()
    scale = 1.0
    max_dim = 1200
    if max(image.shape[:2]) > max_dim:
        scale = max_dim / max(image.shape[:2])
        display_image = cv2.resize(image, None, fx=scale, fy=scale)

    # ROI 선택
    roi = cv2.selectROI("Select Watermark Region",
                        display_image, fromCenter=False, showCrosshair=True)
    cv2.destroyAllWindows()

    if roi == (0, 0, 0, 0):
        print("선택이 취소되었습니다.")
        return None

    # 원본 크기로 좌표 변환
    x, y, w, h = [int(v / scale) for v in roi]
    print(f"선택된 영역: ({x}, {y}) ~ ({x+w}, {y+h})")

    return x, y, w, h


def detect_multiple_regions(image):
    """여러 워터마크 영역을 선택"""
    regions = []
    print("=" * 50)
    print("여러 영역 선택 모드")
    print("각 영역을 드래그로 선택 후 Enter")
    print("모든 선택 완료 시 ESC 또는 빈 영역 선택")
    print("=" * 50)

    display_image = image.copy()
    scale = 1.0
    max_dim = 1200
    if max(image.shape[:2]) > max_dim:
        scale = max_dim / max(image.shape[:2])
        display_image = cv2.resize(image, None, fx=scale, fy=scale)

    while True:
        # 이미 선택된 영역 표시
        temp_display = display_image.copy()
        for rx, ry, rw, rh in regions:
            sx, sy = int(rx * scale), int(ry * scale)
            sw, sh = int(rw * scale), int(rh * scale)
            cv2.rectangle(temp_display, (sx, sy), (sx + sw, sy + sh), (0, 255, 0), 2)

        roi = cv2.selectROI(f"Select Region #{len(regions)+1} (ESC to finish)",
                            temp_display, fromCenter=False)

        if roi == (0, 0, 0, 0):
            break

        x, y, w, h = [int(v / scale) for v in roi]
        regions.append((x, y, w, h))
        print(f"영역 #{len(regions)} 추가: ({x}, {y}) ~ ({x+w}, {y+h})")

    cv2.destroyAllWindows()
    return regions


def show_preview(original, result, x, y, width, height):
    """원본과 결과를 나란히 미리보기"""
    # 원본에 워터마크 영역 표시
    preview_original = original.copy()
    cv2.rectangle(preview_original, (x, y), (x + width, y + height), (0, 0, 255), 2)
    cv2.putText(preview_original, "Original", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    cv2.putText(result, "Result", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # 나란히 배치
    combined = np.hstack([preview_original, result])

    # 리사이즈 (너무 크면)
    max_width = 1600
    if combined.shape[1] > max_width:
        scale = max_width / combined.shape[1]
        combined = cv2.resize(combined, None, fx=scale, fy=scale)

    cv2.imshow('Preview - Press any key to close', combined)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# ============================================================
# 메인 처리 함수
# ============================================================

def process_image(input_path, output_path, x, y, width, height,
                  method='lama', preview=False, feather=0, opencv_radius=5):
    """이미지에서 워터마크 제거"""
    image = cv2.imread(input_path)

    if image is None:
        raise ValueError(f"이미지를 열 수 없습니다: {input_path}")

    print(f"이미지 크기: {image.shape[1]}x{image.shape[0]}")
    print(f"워터마크 영역: ({x}, {y}) ~ ({x+width}, {y+height})")
    print(f"인페인팅 방법: {method}")

    # 마스크 생성
    mask = create_mask(image.shape, x, y, width, height, feather=feather)

    # 워터마크 제거
    print("처리 중...")
    result = inpaint_with_method(image, mask, method, opencv_radius)

    if preview:
        show_preview(image, result, x, y, width, height)
        return None

    # 저장
    cv2.imwrite(output_path, result)
    print(f"✓ 완료! 저장됨: {output_path}")

    return output_path


def process_multiple_regions(input_path, output_path, regions,
                             method='lama', feather=0, opencv_radius=5):
    """여러 영역의 워터마크 제거"""
    image = cv2.imread(input_path)

    if image is None:
        raise ValueError(f"이미지를 열 수 없습니다: {input_path}")

    print(f"이미지 크기: {image.shape[1]}x{image.shape[0]}")
    print(f"처리할 영역 수: {len(regions)}")
    print(f"인페인팅 방법: {method}")

    # 모든 영역을 포함하는 마스크 생성
    mask = np.zeros((image.shape[0], image.shape[1]), dtype=np.uint8)

    for x, y, w, h in regions:
        region_mask = create_mask(image.shape, x, y, w, h, feather=feather)
        mask = cv2.bitwise_or(mask, region_mask)

    # 워터마크 제거
    print("처리 중...")
    result = inpaint_with_method(image, mask, method, opencv_radius)

    # 저장
    cv2.imwrite(output_path, result)
    print(f"✓ 완료! 저장됨: {output_path}")

    return output_path


def main():
    parser = argparse.ArgumentParser(
        description='이미지에서 워터마크 제거 (LaMa 딥러닝 기본)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
예시:
  %(prog)s image.png --select                    # 마우스로 선택, LaMa로 제거
  %(prog)s image.png --select --method opencv    # 빠른 OpenCV 방식
  %(prog)s image.png --x 100 --y 50 --width 200 --height 30
  %(prog)s image.png --multi                     # 여러 영역 선택

알고리즘:
  lama   : 딥러닝 기반, 최고 품질 (기본값)
  opencv : OpenCV Navier-Stokes, 빠름
  telea  : OpenCV Telea, 가장 빠름
        """
    )
    parser.add_argument('input', help='입력 이미지 파일 경로')
    parser.add_argument('output', nargs='?', help='출력 이미지 파일 경로')
    parser.add_argument('--x', type=int, help='워터마크 X 좌표')
    parser.add_argument('--y', type=int, help='워터마크 Y 좌표')
    parser.add_argument('--width', type=int, help='워터마크 너비')
    parser.add_argument('--height', type=int, help='워터마크 높이')
    parser.add_argument('--method', choices=['lama', 'opencv', 'telea'], default='lama',
                        help='인페인팅 방법 (기본: lama)')
    parser.add_argument('--radius', type=int, default=5,
                        help='OpenCV 인페인팅 반경 (기본: 5)')
    parser.add_argument('--feather', type=int, default=0,
                        help='마스크 경계 페더링 (기본: 0)')
    parser.add_argument('--select', action='store_true',
                        help='마우스로 워터마크 영역 선택')
    parser.add_argument('--multi', action='store_true',
                        help='여러 영역 선택 모드')
    parser.add_argument('--preview', action='store_true',
                        help='처리 결과 미리보기 (저장 안함)')

    args = parser.parse_args()

    # 이미지 로드
    image = cv2.imread(args.input)
    if image is None:
        print(f"오류: 이미지를 열 수 없습니다: {args.input}")
        sys.exit(1)

    # 영역 선택
    if args.multi:
        regions = detect_multiple_regions(image)
        if not regions:
            print("선택된 영역이 없습니다.")
            return

        # 출력 파일명
        if not args.output:
            input_path = Path(args.input)
            args.output = str(input_path.parent / (input_path.stem + '_no_watermark' + input_path.suffix))

        process_multiple_regions(
            args.input, args.output, regions,
            method=args.method,
            feather=args.feather,
            opencv_radius=args.radius
        )

    elif args.select:
        result = detect_watermark_region(image)
        if result is None:
            return
        x, y, width, height = result

        # 출력 파일명
        if not args.output and not args.preview:
            input_path = Path(args.input)
            args.output = str(input_path.parent / (input_path.stem + '_no_watermark' + input_path.suffix))

        process_image(
            args.input, args.output,
            x, y, width, height,
            method=args.method,
            preview=args.preview,
            feather=args.feather,
            opencv_radius=args.radius
        )

    elif all([args.x is not None, args.y is not None, args.width, args.height]):
        x, y, width, height = args.x, args.y, args.width, args.height

        # 출력 파일명
        if not args.output and not args.preview:
            input_path = Path(args.input)
            args.output = str(input_path.parent / (input_path.stem + '_no_watermark' + input_path.suffix))

        process_image(
            args.input, args.output,
            x, y, width, height,
            method=args.method,
            preview=args.preview,
            feather=args.feather,
            opencv_radius=args.radius
        )

    else:
        print("워터마크 영역을 지정해주세요:")
        print("  --select              마우스로 단일 영역 선택")
        print("  --multi               마우스로 여러 영역 선택")
        print("  --x --y --width --height  좌표로 직접 지정")
        sys.exit(1)


if __name__ == '__main__':
    main()
