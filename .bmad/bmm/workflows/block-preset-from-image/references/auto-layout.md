# Auto Layout 참조

## SizeMode 타입

```typescript
type SizeMode =
  | { type: 'fixed'; value: number; unit?: 'px' | 'vh' | 'vw' | '%' }
  | { type: 'hug' }                         // fit-content (콘텐츠에 맞춤)
  | { type: 'fill' }                        // 100% (부모 채우기)
  | { type: 'fill-portion'; value: number } // flex 비율
```

## 블록 유형별 권장 레이아웃

| 블록 타입 | layout.mode | height | 이유 |
|----------|-------------|--------|------|
| `hero` | **absolute** | 100 (vh) | 배경 이미지 중심 |
| `greeting-parents` | auto | hug | 인사말 길이 가변 |
| `profile` | auto | hug | 정보 그룹 중첩 |
| `calendar` | auto | hug | 카운트다운 그룹 |
| `rsvp` | auto | hug | 폼 요소 나열 |
| `notice` | auto | hug | 안내 항목 가변 |
| `gallery` | absolute | 80 (vh) | 캐러셀/그리드 |
| `location` | absolute | 60 (vh) | 지도 배치 |

## z-index 규칙

| 요소 유형 | layoutMode | zIndex |
|----------|------------|--------|
| 배경 장식 | absolute | 0 |
| 콘텐츠 | auto | 1+ |
| 전경 장식 | absolute | 10+ |

## Auto Layout 블록 기본 설정

```yaml
layout:
  mode: 'auto'
  direction: 'vertical'  # 대부분의 경우
  gap: 16~32             # 요소 간 간격 (px)
  padding:
    top: 40~60
    right: 20~40
    bottom: 40~60
    left: 20~40
  alignItems: 'center'   # 가로 중앙 정렬 시

height:
  type: 'hug'            # 콘텐츠에 맞게 자동 조절
```

## 좌표 시스템 (Absolute 전용)

- `x`: 왼쪽 상단 기준 vw% (0 = 왼쪽 끝)
- `y`: 왼쪽 상단 기준 vh% (0 = 위쪽 끝, 블록 내 상대)
- **중앙 정렬 공식**: `x = (100 - width) / 2`
