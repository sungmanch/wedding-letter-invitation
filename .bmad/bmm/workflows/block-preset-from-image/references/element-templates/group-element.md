# Group 요소 템플릿 (중첩 레이아웃)

> 여러 요소를 수평/수직으로 그룹화할 때 사용

## 기본 구조

```yaml
element:
  type: group
  layoutMode: auto
  sizing:
    width: { type: fill }
    height: { type: hug }
  zIndex: 1

  props:
    type: group
    layout:
      direction: vertical | horizontal
      gap: 16
      alignItems: start | center | end | stretch
      justifyContent: start | center | end | space-between | space-around
      reverse: true  # 시각적 순서 반전 (좌우 교차 배치 시)

  children:
    - { ... }  # 자식 요소들
```

## 가로 배치 그룹 (부모 정보)

```typescript
{
  id: 'parents-row',
  type: 'group',
  layoutMode: 'auto',
  sizing: {
    width: { type: 'fill' },
    height: { type: 'hug' },
  },
  zIndex: 1,
  props: {
    type: 'group',
    layout: {
      direction: 'horizontal',
      gap: 24,
      alignItems: 'start',
      justifyContent: 'center',
    },
  },
  children: [
    {
      id: 'groom-parents',
      type: 'group',
      layoutMode: 'auto',
      sizing: { height: { type: 'hug' } },
      props: {
        type: 'group',
        layout: { direction: 'vertical', gap: 8, alignItems: 'center' },
      },
      children: [
        { type: 'text', binding: 'parents.groom.father.name', ... },
        { type: 'text', binding: 'parents.groom.mother.name', ... },
      ],
    },
    {
      id: 'bride-parents',
      type: 'group',
      layoutMode: 'auto',
      sizing: { height: { type: 'hug' } },
      props: {
        type: 'group',
        layout: { direction: 'vertical', gap: 8, alignItems: 'center' },
      },
      children: [
        { type: 'text', binding: 'parents.bride.father.name', ... },
        { type: 'text', binding: 'parents.bride.mother.name', ... },
      ],
    },
  ],
}
```

## 카운트다운 그룹

```typescript
{
  id: 'countdown-group',
  type: 'group',
  layoutMode: 'auto',
  sizing: {
    width: { type: 'fill' },
    height: { type: 'hug' },
  },
  zIndex: 1,
  props: {
    type: 'group',
    layout: {
      direction: 'horizontal',
      gap: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  children: [
    {
      id: 'days-unit',
      type: 'group',
      layoutMode: 'auto',
      props: {
        type: 'group',
        layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
      },
      children: [
        { type: 'text', binding: 'countdown.days', style: { text: { fontSize: 32 } } },
        { type: 'text', value: '일', style: { text: { fontSize: 14 } } },
      ],
    },
    // hours, minutes, seconds 동일 구조...
  ],
}
```

## 좌우 교차 배치 (reverse 활용)

```typescript
// 신랑 정보 (왼쪽 사진 - 오른쪽 텍스트)
{
  id: 'groom-profile',
  type: 'group',
  props: {
    type: 'group',
    layout: {
      direction: 'horizontal',
      gap: 20,
      alignItems: 'center',
    },
  },
  children: [
    { type: 'image', binding: 'couple.groom.photo', ... },
    { type: 'text', binding: 'couple.groom.name', ... },
  ],
}

// 신부 정보 (오른쪽 사진 - 왼쪽 텍스트) - reverse 사용
{
  id: 'bride-profile',
  type: 'group',
  props: {
    type: 'group',
    layout: {
      direction: 'horizontal',
      gap: 20,
      alignItems: 'center',
      reverse: true,  // 시각적 순서 반전
    },
  },
  children: [
    { type: 'image', binding: 'couple.bride.photo', ... },
    { type: 'text', binding: 'couple.bride.name', ... },
  ],
}
```

## 중첩 레이아웃 권장 패턴

| 패턴 | 부모 direction | 자식 구조 |
|------|---------------|----------|
| 카드 그리드 | horizontal | 각 카드는 vertical group |
| 프로필 행 | horizontal | 사진 + 텍스트 group |
| 정보 리스트 | vertical | 각 항목은 horizontal group |
| 카운트다운 | horizontal | 숫자 + 단위 vertical group |
