# Auto Layout 요소 템플릿

> **Auto Layout 요소는 x, y 좌표를 사용하지 않습니다!**

## 기본 구조

```yaml
element:
  type: text | image | shape | button | icon | divider | group
  layoutMode: auto  # ⚠️ 필수!

  # ─── 크기 설정 (SizeMode) ───
  sizing:
    width:
      type: fill | hug | fixed | fill-portion
      value: 200        # fixed, fill-portion일 때만
      unit: px | vh | vw | %  # fixed일 때만
    height:
      type: hug | fill | fixed
      value: 100
      unit: px

  # ─── 제약 조건 (선택) ───
  constraints:
    minWidth: 100    # px
    maxWidth: 300    # px
    minHeight: 50    # px
    maxHeight: 200   # px

  # ─── 자기 정렬 (부모 Auto Layout 내에서) ───
  alignSelf: start | center | end | stretch

  zIndex: 1  # 콘텐츠는 1 이상

  # 데이터 바인딩
  binding: couple.groom.name  # VariablePath
  # 또는 직접 값
  value: "정적 텍스트"

  # 타입별 props
  props:
    type: text | image | button | group
```

## Text 요소

```typescript
{
  id: 'title-text',
  type: 'text',
  layoutMode: 'auto',
  sizing: {
    width: { type: 'fill' },
    height: { type: 'hug' },
  },
  zIndex: 1,
  binding: 'greeting.title',
  props: {
    type: 'text',
    format: '{groom.name} ♥ {bride.name}',  // 템플릿 문자열 (선택)
  },
  style: {
    text: {
      fontFamily: 'var(--font-heading)',
      fontSize: 24,
      fontWeight: 600,
      color: 'var(--fg-emphasis)',
      textAlign: 'center',
      lineHeight: 1.6,
      letterSpacing: 0.05,
    },
  },
}
```

## Image 요소

```typescript
{
  id: 'main-photo',
  type: 'image',
  layoutMode: 'auto',
  sizing: {
    width: { type: 'fill' },
    height: { type: 'fixed', value: 300, unit: 'px' },
  },
  zIndex: 1,
  binding: 'couple.photo',
  props: {
    type: 'image',
    objectFit: 'cover',        // cover | contain | fill
    overlay: 'rgba(0,0,0,0.3)', // 선택
  },
}
```

## Button 요소

```typescript
{
  id: 'rsvp-button',
  type: 'button',
  layoutMode: 'auto',
  sizing: {
    width: { type: 'hug' },
    height: { type: 'hug' },
  },
  zIndex: 1,
  props: {
    type: 'button',
    label: '참석 의사 전달하기',
    action: 'rsvp-modal',  // link | phone | map | copy | share | contact-modal | rsvp-modal | show-block
  },
  style: {
    text: {
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      color: 'var(--fg-on-accent)',
    },
    background: 'var(--accent-default)',
  },
}
```

## Divider 요소

```typescript
{
  id: 'section-divider',
  type: 'divider',
  layoutMode: 'auto',
  sizing: {
    width: { type: 'fixed', value: 60, unit: 'px' },
    height: { type: 'fixed', value: 1, unit: 'px' },
  },
  zIndex: 1,
  style: {
    background: 'var(--border-default)',
  },
}
```

## 분석 표 형식

```
| # | 요소 타입 | layoutMode | sizing | 바인딩 경로 | 스타일 |
|---|----------|------------|--------|-------------|--------|
| 1 | text     | auto       | width: fill, height: hug | greeting.title | heading 역할 |
| 2 | text     | auto       | height: hug, constraints: { minHeight: 100 } | greeting.content | body 역할 |
| 3 | group    | auto       | height: hug | - | 가로 배치 그룹 |
```
