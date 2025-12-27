# 타이포그래피 시스템 참조

## 3-Family 폰트 구조

```
display: 히어로/인트로용 (예술적, 장식적)
heading: 섹션 제목용 (명조/세리프 계열)
body: 섹션 본문용 (고딕/산세리프 계열)
```

## 타이포그래피 프리셋 ID

```typescript
type TypographyPresetId =
  // 클래식/우아
  | 'classic-elegant'      // Playfair + Noto Serif
  | 'classic-traditional'  // Cinzel + Nanum Myeongjo
  | 'classic-romantic'     // Cormorant + Gowun Batang
  // 모던/미니멀
  | 'modern-minimal'       // Montserrat + Pretendard
  | 'modern-clean'         // Inter + Noto Sans
  | 'modern-geometric'     // Poppins + Pretendard
  // 로맨틱/감성
  | 'romantic-script'      // Great Vibes + Gowun Batang
  | 'romantic-italian'     // Italianno + Noto Serif
  | 'romantic-soft'        // Pinyon Script + Hahmlet
  // 내추럴/손글씨
  | 'natural-handwritten'  // High Summit + 마포금빛나루
  | 'natural-brush'        // Alex Brush + 나눔붓글씨
  | 'natural-warm'         // Dancing Script + 고운돋움
  | 'natural-witty'
```

## 타입 스케일 (px)

| 이름 | px | 용도 |
|------|-----|------|
| xs | 12 | 캡션, 주석 |
| sm | 14 | 보조 텍스트 |
| base | 16 | 본문 기본 |
| lg | 18 | 본문 강조 |
| xl | 20 | 소제목 |
| 2xl | 24 | 섹션 제목 |
| 3xl | 30 | 블록 제목 |
| 4xl | 36 | 히어로 제목 |

## 요소 역할별 권장 조합

| 역할 | color | fontFamily | fontSize |
|------|-------|------------|----------|
| 메인 제목 | fg-emphasis | heading | 30~36 |
| 부제목 | fg-default | heading | 20~24 |
| 본문 | fg-default | body | 16~18 |
| 캡션/설명 | fg-muted | body | 14~16 |
| 날짜/숫자 | fg-default | display | 20~24 |
| 버튼 텍스트 | fg-on-accent | body | 16 |

## 스타일에서 사용 예시

```typescript
// ❌ 하드코딩
fontFamily: 'Noto Serif KR'

// ✅ 시맨틱 토큰
fontFamily: 'var(--font-heading)'  // 제목
fontFamily: 'var(--font-body)'     // 본문
fontFamily: 'var(--font-display)'  // 히어로

// fontSize는 px 숫자로 (렌더링 시 rem 변환)
fontSize: 24  // ✅
fontSize: 'var(--text-2xl)'  // ❌ CSS 변수 미지원
```
