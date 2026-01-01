# Absolute to Auto Layout 변환 체크리스트

## 핵심 원칙

```
1. 블록 레벨: layout.mode → 'auto' (Hero 제외)
2. 요소 레벨: 장식 요소는 layoutMode: 'absolute' 유지
```

## 변환 전 확인

- [ ] 대상 프리셋 파일 백업 또는 git commit
- [ ] `_shared.ts`에 `AUTO_LAYOUT_VERTICAL`, `HUG_HEIGHT` 상수 존재 확인
- [ ] 현재 absolute 요소 목록 파악
- [ ] 각 요소를 콘텐츠 vs 장식으로 분류

## 블록 레벨 변환

- [ ] `layout.mode` → `'auto'` 변경
- [ ] `layout.direction` → `'vertical'` 추가
- [ ] `layout.gap` → 적절한 값 설정 (16~32px)
- [ ] `layout.padding` → 설정
- [ ] `layout.alignItems` → `'center'` (중앙 정렬 시)
- [ ] `defaultHeight` → `{ type: 'hug' }` 변경

## 콘텐츠 요소 변환 (zIndex >= 1, 바인딩 있음)

- [ ] `layoutMode: 'absolute'` 제거
- [ ] `x`, `y` 속성 제거
- [ ] `width` → `sizing.width` 변환
  - 고정값: `{ type: 'fixed', value: N, unit: 'px' | '%' }`
  - 100%: `{ type: 'fill' }`
- [ ] `height` → `sizing.height` 변환
  - 텍스트: `{ type: 'hug' }` (대부분)
  - 고정: `{ type: 'fixed', value: N, unit: 'px' }`
- [ ] 중앙 정렬이면 `alignSelf: 'center'` 추가

## 장식 요소 유지 (zIndex = 0, 바인딩 없음)

- [ ] `layoutMode: 'absolute'` **유지** ✅
- [ ] `x`, `y`, `width`, `height` **유지** ✅
- [ ] `zIndex: 0` 또는 음수로 배경 레이어 유지

## 태그 업데이트

- [ ] `tags`에 `'auto-layout'` 추가

## 검증

- [ ] `npx tsc --noEmit` 성공
- [ ] import 경로 올바름
- [ ] 타입 정의 일치

## 시각적 검증 (프리뷰)

- [ ] 요소들이 올바르게 세로 정렬됨
- [ ] 텍스트가 컨테이너 내에서 줄바꿈됨
- [ ] 장식 요소가 올바른 위치에 표시됨 (유지 시)
- [ ] 블록 높이가 콘텐츠에 맞게 조절됨
- [ ] 모바일/데스크탑 반응형 확인

## 변환 완료 후

- [ ] git commit 생성
- [ ] 변환 결과 문서화 (CLAUDE.md 또는 PR)
