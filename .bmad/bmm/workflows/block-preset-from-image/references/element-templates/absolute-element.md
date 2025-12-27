# Absolute 요소 템플릿

> **장식 요소 또는 Hero 블록에서만 사용!**

## 기본 구조

```yaml
element:
  type: image | shape | text
  layoutMode: absolute  # ⚠️ 명시 필수!

  # ─── 좌표 (vw/vh 기준) ───
  x: 10       # vw% (왼쪽 상단 기준)
  y: 5        # vh% (블록 내 상대)
  width: 8    # vw%
  height: 10  # vh%
  rotation: 0 # degrees

  zIndex: 0   # 장식은 0, 콘텐츠보다 뒤에

  # 데이터 바인딩 또는 직접 값
  value: '/decorations/sparkle.svg'

  props:
    type: image
    objectFit: contain
```

## 좌표 시스템

- `x`: 왼쪽 상단 기준 vw% (0 = 왼쪽 끝)
- `y`: 왼쪽 상단 기준 vh% (0 = 위쪽 끝, 블록 내 상대)
- **중앙 정렬 공식**: `x = (100 - width) / 2`

## 장식 이미지 예시

```typescript
{
  id: 'deco-sparkle-left',
  type: 'image',
  layoutMode: 'absolute',
  x: 10,
  y: 5,
  width: 8,
  height: 10,
  zIndex: 0,  // 콘텐츠보다 뒤에
  value: '/decorations/sparkle.svg',
  props: {
    type: 'image',
    objectFit: 'contain',
  },
}
```

## Hero 배경 이미지 예시

```typescript
{
  id: 'hero-bg',
  type: 'image',
  layoutMode: 'absolute',
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  zIndex: 0,
  binding: 'couple.photo',
  props: {
    type: 'image',
    objectFit: 'cover',
    overlay: 'rgba(0,0,0,0.3)',
  },
}
```

## Hero 텍스트 예시

```typescript
{
  id: 'hero-names',
  type: 'text',
  layoutMode: 'absolute',
  x: 15,       // (100 - 70) / 2 = 15 (가로 중앙)
  y: 40,
  width: 70,
  height: 10,
  zIndex: 2,
  props: {
    type: 'text',
    format: '{groom.name} ♥ {bride.name}',
  },
  style: {
    text: {
      fontFamily: 'var(--font-display)',
      fontSize: 36,
      fontWeight: 400,
      color: '#FFFFFF',
      textAlign: 'center',
    },
  },
}
```

## 분석 표 형식

```
| # | 요소 타입 | 위치 (x%, y%) | 크기 (w%, h%) | zIndex | 용도 |
|---|----------|---------------|---------------|--------|------|
| 1 | image    | (10, 5)       | (8, 10)       | 0      | 장식 (sparkle) |
| 2 | image    | (85, 8)       | (6, 8)        | 0      | 장식 (leaf) |
| 3 | image    | (0, 0)        | (100, 100)    | 0      | 배경 이미지 |
| 4 | text     | (15, 40)      | (70, 10)      | 2      | 커플 이름 |
```
