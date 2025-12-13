# Super Editor v2 - 데이터 스키마 설계

> **목표**: AI 기반 청첩장 에디터를 위한 유연하고 확장 가능한 데이터 구조
> **핵심 원칙**: 변수 바인딩 기반의 단일 Block 시스템 + AI 맥락 이해

---

## 1. 설계 요구사항

### 1.1 핵심 결정사항

| 항목 | 결정 |
|------|------|
| **Block 정의** | 페이지 구성의 최소 단위 (의미적 컨테이너) |
| **레이아웃** | AI가 생성하거나 사용자가 프롬프트로 수정 |
| **변수 시스템** | 코드로 관리되는 AVAILABLE_VARIABLES |
| **AI 맥락 이해** | 변수 바인딩으로 요소의 의미 파악 |
| **편집 UX** | 블록 선택 → 프롬프트 입력 → AI가 해당 블록만 수정 |
| **좌표 시스템** | 뷰포트 상대 좌표 (vw/vh, 390px 기준) |
| **저장 방식** | Postgres JSONB |

### 1.2 콘텐츠 범위

| 카테고리 | 데이터 |
|---------|--------|
| 인물 | 신랑명, 신부명, 혼주 정보 (4명) |
| 일시 | 날짜, 시간, D-day |
| 장소 | 예식장명, 주소, 층/홀, 지도 좌표 |
| 사진 | 메인 사진, 갤러리 (20-60장) |
| 텍스트 | 인사말, 커스텀 문구들 |
| 연락처 | 신랑/신부/혼주 전화번호 |
| 계좌 | 신랑/신부측 각 1-3개 |
| 기타 | 음악, 방명록 설정 등 |

---

## 2. 사용 가능한 변수 (AVAILABLE_VARIABLES)

코드로 관리되는 변수 목록. AI와 에디터가 이 목록을 참조하여 요소의 의미를 파악.

```typescript
const AVAILABLE_VARIABLES = {
  // 신랑 정보
  'groom.name': { type: 'text', label: '신랑 이름' },
  'groom.nameEn': { type: 'text', label: '신랑 영문명' },
  'groom.fatherName': { type: 'text', label: '신랑 아버지' },
  'groom.motherName': { type: 'text', label: '신랑 어머니' },
  'groom.phone': { type: 'phone', label: '신랑 연락처' },
  'groom.account': { type: 'account', label: '신랑 계좌' },

  // 신부 정보
  'bride.name': { type: 'text', label: '신부 이름' },
  'bride.nameEn': { type: 'text', label: '신부 영문명' },
  'bride.fatherName': { type: 'text', label: '신부 아버지' },
  'bride.motherName': { type: 'text', label: '신부 어머니' },
  'bride.phone': { type: 'phone', label: '신부 연락처' },
  'bride.account': { type: 'account', label: '신부 계좌' },

  // 예식 정보
  'wedding.date': { type: 'date', label: '예식 날짜' },
  'wedding.time': { type: 'time', label: '예식 시간' },
  'wedding.dateDisplay': { type: 'text', label: '날짜 표시 (한글)' },
  'wedding.dday': { type: 'number', label: 'D-day' },

  // 예식장 정보
  'venue.name': { type: 'text', label: '예식장명' },
  'venue.hall': { type: 'text', label: '층/홀' },
  'venue.address': { type: 'text', label: '주소' },
  'venue.addressDetail': { type: 'text', label: '상세 주소' },
  'venue.coordinates': { type: 'coordinates', label: '지도 좌표' },
  'venue.phone': { type: 'phone', label: '예식장 연락처' },
  'venue.parkingInfo': { type: 'text', label: '주차 안내' },
  'venue.transportInfo': { type: 'text', label: '교통 안내' },

  // 사진
  'photos.main': { type: 'image', label: '메인 사진' },
  'photos.gallery': { type: 'image[]', label: '갤러리' },

  // 인사말
  'greeting.title': { type: 'text', label: '인사말 제목' },
  'greeting.content': { type: 'longtext', label: '인사말 내용' },

  // 음악
  'music.url': { type: 'url', label: '음악 URL' },
  'music.title': { type: 'text', label: '음악 제목' },
  'music.artist': { type: 'text', label: '아티스트' },
} as const

type VariablePath = keyof typeof AVAILABLE_VARIABLES
```

---

## 3. 최상위 문서 구조

```typescript
interface EditorDocument {
  id: string
  version: number  // 스키마 버전

  // 메타데이터
  meta: {
    title: string
    createdAt: string
    updatedAt: string
  }

  // 전역 스타일 토큰
  style: GlobalStyle

  // 전역 애니메이션 설정
  animation: GlobalAnimation

  // 블록 목록 (순서대로)
  blocks: Block[]

  // 정형 데이터 (변수 값)
  data: WeddingData
}
```

---

## 4. 블록 시스템

### 4.1 Block 정의

**Block = 페이지 구성의 최소 단위 (의미적 컨테이너)**

- `type`: 블록의 의미적 역할 (AI 맥락 이해용)
- `elements`: 변수 바인딩된 요소들
- 레이아웃은 고정되지 않음 - AI가 생성하거나 프롬프트로 수정

```typescript
interface Block {
  id: string

  // 의미적 타입 (AI 맥락 이해용)
  type: BlockType

  // 블록 활성화 여부
  enabled: boolean

  // 블록 높이 (vh 단위)
  height: number

  // 요소들 (변수 바인딩 포함)
  elements: Element[]

  // 블록 레벨 스타일 오버라이드
  style?: BlockStyleOverride

  // 블록 레벨 애니메이션
  animation?: BlockAnimationConfig
}

type BlockType =
  | 'intro'      // 인트로 (메인 사진, 이름, 날짜)
  | 'greeting'   // 인사말
  | 'gallery'    // 포토 갤러리
  | 'venue'      // 예식장 정보 + 지도
  | 'calendar'   // 달력/D-day
  | 'parents'    // 혼주 소개
  | 'accounts'   // 축의금 계좌
  | 'contact'    // 연락처
  | 'guestbook'  // 방명록
  | 'music'      // BGM 컨트롤
  | 'custom'     // 사용자 정의 블록
```

### 4.2 AI 맥락 이해 방식

AI는 Block의 `type`과 각 Element의 `binding`을 통해 맥락을 파악:

```
Block(type: 'intro')의 elements:
├── Element(binding: 'photos.main') → "메인 사진"
├── Element(binding: 'groom.name') → "신랑 이름"
├── Element(binding: 'bride.name') → "신부 이름"
└── Element(binding: 'wedding.dateDisplay') → "예식 날짜"

→ AI 이해: "이 블록은 메인 사진 위에 신랑신부 이름과 날짜를 보여주는 인트로"
```

---

## 5. 요소 시스템 (Element)

### 5.1 Element 구조

```typescript
interface Element {
  id: string
  type: ElementType

  // 위치/크기 (vw/vh 기준, 뷰포트 상대 좌표)
  x: number       // vw
  y: number       // vh (블록 내 상대 위치)
  width: number   // vw
  height: number  // vh
  rotation: number // degrees

  // z-index
  zIndex: number

  // 변수 바인딩 (AI가 의미 파악)
  binding?: VariablePath  // 'groom.name', 'photos.main' 등

  // 바인딩 없을 때 직접 값
  value?: string | number

  // 타입별 추가 속성
  props: ElementProps

  // 요소별 스타일
  style?: ElementStyle

  // 요소별 애니메이션
  animation?: ElementAnimationConfig
}

type ElementType = 'text' | 'image' | 'shape' | 'button' | 'icon' | 'divider' | 'map' | 'calendar'
```

### 5.2 타입별 Props

```typescript
type ElementProps =
  | TextProps
  | ImageProps
  | ShapeProps
  | ButtonProps
  | IconProps
  | DividerProps
  | MapProps
  | CalendarProps

interface TextProps {
  type: 'text'
  // binding 또는 value로 내용 결정
  format?: string  // 포맷팅 (e.g., '{groom.name} ♥ {bride.name}')
}

interface ImageProps {
  type: 'image'
  objectFit: 'cover' | 'contain' | 'fill'
  overlay?: string  // 이미지 위 오버레이 색상
}

interface ShapeProps {
  type: 'shape'
  shape: 'rectangle' | 'circle' | 'line' | 'heart' | 'custom'
  fill?: string
  stroke?: string
  strokeWidth?: number
  svgPath?: string  // custom shape용
}

interface ButtonProps {
  type: 'button'
  label: string
  action: 'link' | 'phone' | 'map' | 'copy' | 'share'
  // binding으로 action value 결정 (e.g., binding: 'groom.phone')
}

interface IconProps {
  type: 'icon'
  icon: string  // 아이콘 ID
  size: number
  color?: string
}

interface DividerProps {
  type: 'divider'
  dividerStyle: 'solid' | 'dashed' | 'dotted' | 'ornament'
  ornamentId?: string
}

interface MapProps {
  type: 'map'
  // binding: 'venue.coordinates'로 좌표 참조
  zoom?: number
  showMarker?: boolean
}

interface CalendarProps {
  type: 'calendar'
  // binding: 'wedding.date'로 날짜 참조
  showDday?: boolean
  highlightColor?: string
}
```

---

## 6. 편집 UX 흐름

### 6.1 블록 선택 + 프롬프트 방식

```
1. 사용자가 블록 선택 (탭 또는 클릭)
   → 해당 블록만 하이라이트, 다른 블록은 dimmed

2. 프롬프트 입력
   "배경을 더 어둡게 하고, 이름을 중앙에 크게"

3. AI가 해당 블록의 elements만 수정
   → 다른 블록에 영향 없음
   → 변수 바인딩은 유지, 위치/스타일만 변경

4. 결과 미리보기 → 확정 또는 재시도
```

### 6.2 AI 수정 예시

**사용자 요청**: "신랑 이름을 왼쪽에, 신부 이름을 오른쪽에 배치해줘"

**AI 동작**:
```json
// Before
{
  "id": "elem-1",
  "type": "text",
  "binding": "groom.name",
  "x": 50, "y": 40,
  "style": { "text": { "textAlign": "center" } }
}

// After
{
  "id": "elem-1",
  "type": "text",
  "binding": "groom.name",  // 바인딩 유지
  "x": 10, "y": 40,         // 위치만 변경
  "style": { "text": { "textAlign": "left" } }
}
```

---

## 7. 스타일 시스템

### 7.1 전역 스타일 (GlobalStyle)

```typescript
interface GlobalStyle {
  // 색상 토큰
  colors: {
    primary: string      // 주 강조색
    secondary: string    // 보조색
    background: string   // 배경색 (60%)
    surface: string      // 카드/섹션 배경 (30%)
    accent: string       // 포인트색 (10%)
    text: {
      primary: string    // 제목
      secondary: string  // 본문
      muted: string      // 보조 텍스트
    }
  }

  // 폰트 토큰
  fonts: {
    heading: FontConfig   // 제목용
    body: FontConfig      // 본문용
    accent?: FontConfig   // 강조용 (선택)
  }

  // 간격 토큰
  spacing: {
    section: number      // 섹션 간 간격 (vh)
    element: number      // 요소 간 간격 (vw)
  }

  // 테두리/그림자
  effects: {
    borderRadius: number
    shadow: 'none' | 'subtle' | 'medium' | 'strong'
  }
}

interface FontConfig {
  family: string
  weight: number
  size: number        // 기본 크기 (vw)
  lineHeight: number
  letterSpacing: number
}
```

### 7.2 블록 스타일 오버라이드

```typescript
interface BlockStyleOverride {
  // 전역 토큰 오버라이드
  colors?: Partial<GlobalStyle['colors']>
  fonts?: Partial<GlobalStyle['fonts']>

  // 블록 전용 스타일
  background?: {
    type: 'color' | 'gradient' | 'image'
    value: string
    overlay?: string  // 이미지 위 오버레이
  }

  padding?: {
    top: number
    bottom: number
  }
}
```

### 7.3 요소 스타일

```typescript
interface ElementStyle {
  // 텍스트 스타일 (TextElement용)
  text?: {
    fontFamily?: string
    fontSize?: number
    fontWeight?: number
    color?: string
    textAlign?: 'left' | 'center' | 'right'
    lineHeight?: number
    letterSpacing?: number
  }

  // 배경
  background?: string

  // 테두리
  border?: {
    width: number
    color: string
    style: 'solid' | 'dashed'
    radius: number
  }

  // 그림자
  shadow?: string

  // 투명도
  opacity?: number
}
```

---

## 8. 애니메이션 시스템 (요약)

> **상세 문서**: [02_animation_system.md](./02_animation_system.md)

### 8.1 설계 원칙

| 원칙 | 설명 |
|------|------|
| **트리거 중심** | 모든 애니메이션은 트리거(scroll, gesture, event, state, time)에서 시작 |
| **상태 머신** | 조건부 전환과 복잡한 흐름 지원 (grid → shaking → expanded 등) |
| **합성 가능** | 작은 액션을 조합해 복잡한 애니메이션 생성 (sequence, timeline) |
| **제스처 네이티브** | tap, swipe, pinch, drag 등 터치 인터랙션 1급 지원 |

### 8.2 계층 구조

| 레벨 | 저장 위치 | 내용 |
|-----|----------|------|
| **전역 설정** | `document.animation` | mood, speed, easingPresets, sharedState |
| **Floating 요소** | `document.floatingElements` | 블록 독립적 고정 요소 |
| **블록 설정** | `block.animation` | entrance, scroll, interactions, stateMachine |
| **요소 설정** | `element.animation` | entrance, hover, loop, interactions, stateMachine |

### 8.3 트리거 타입

```typescript
type Trigger =
  | ScrollTrigger    // 스크롤 위치/진행률
  | GestureTrigger   // tap, swipe, pinch, drag, hover
  | EventTrigger     // click, form-submit, animation-end 등
  | StateTrigger     // 상태 머신 전이
  | TimeTrigger      // 시간 기반 (delay, repeat)
```

### 8.4 액션 타입

```typescript
type AnimationAction =
  | TweenAction      // 단일 속성 변환
  | SequenceAction   // 순차 실행
  | TimelineAction   // 병렬 + 타이밍 제어
  | SpringAction     // 물리 기반 스프링
  | PathAction       // SVG 경로 따라 이동
  | MorphAction      // SVG 형태 변환
  | StaggerAction    // 여러 요소 순차 애니메이션
  | SetAction        // 즉시 값 설정
```

### 8.5 지원 시나리오

| 시나리오 | 구현 방식 |
|---------|----------|
| 스크롤 reveal (blur 해제) | ScrollTrigger + TweenAction |
| 갤러리 탭 → 확대 | GestureTrigger + StateMachine + SequenceAction |
| Parallax 효과 | ScrollTrigger (scrub) + 다른 to 값 |
| 병렬 애니메이션 | TimelineAction (at: 0) |
| 종이비행기 여정 | FloatingElement + StateMachine + PathAction + MorphAction |
| 폼 제출 트리거 | EventTrigger (form-submit) |

### 8.6 Floating 요소

블록에 속하지 않는 독립적 고정 요소:

```typescript
interface FloatingElement {
  id: string
  type: 'svg' | 'image' | 'lottie' | 'text' | 'html'
  position: 'fixed' | 'absolute' | 'sticky'
  anchor: { x: number | string, y: number | string }
  scrollRange?: { start: string, end: string }
  stateMachine?: AnimationStateMachine
}
```

### 8.7 AI 통합

AI가 수정 시 맥락을 완전히 이해하기 위한 컨텍스트 주입:

```typescript
interface AIAnimationContext {
  selection: { type, id, path }
  semantic: { role, animationSummary, relatedElements }
  modifiable: { properties, constraints }
  history: { action, before, after }[]
}
```

> 상세 구현은 [02_animation_system.md](./02_animation_system.md) 참조

---

## 9. 정형 데이터 (WeddingData)

변수 바인딩의 실제 값을 저장.

```typescript
interface WeddingData {
  // 신랑 정보
  groom: {
    name: string
    nameEn?: string
    fatherName?: string
    motherName?: string
    phone?: string
    accountBank?: string
    accountNumber?: string
    accountHolder?: string
  }

  // 신부 정보
  bride: {
    name: string
    nameEn?: string
    fatherName?: string
    motherName?: string
    phone?: string
    accountBank?: string
    accountNumber?: string
    accountHolder?: string
  }

  // 예식 정보
  wedding: {
    date: string          // ISO 8601: '2025-03-15'
    time: string          // 'HH:mm': '14:00'
    dateDisplay?: string  // 표시용: '2025년 3월 15일 토요일 오후 2시'
  }

  // 예식장 정보
  venue: {
    name: string
    hall?: string
    address: string
    addressDetail?: string
    coordinates?: {
      lat: number
      lng: number
    }
    phone?: string
    parkingInfo?: string
    transportInfo?: string
  }

  // 사진
  photos: {
    main?: PhotoData
    gallery: PhotoData[]
  }

  // 인사말
  greeting?: {
    title?: string
    content: string
  }

  // 추가 계좌
  additionalAccounts?: {
    side: 'groom' | 'bride'
    relation: string
    bank: string
    number: string
    holder: string
  }[]

  // 음악
  music?: {
    url: string
    title?: string
    artist?: string
    autoPlay: boolean
  }

  // 방명록 설정
  guestbook?: {
    enabled: boolean
    requirePassword: boolean
  }
}

interface PhotoData {
  id: string
  url: string
  thumbnailUrl?: string
  alt?: string
  width?: number
  height?: number
}
```

---

## 10. AI 통합 시나리오

### 10.1 전체 청첩장 생성

```
사용자: "영화같은 느낌의 청첩장 만들어줘"

→ AI가 mood='cinematic' 매칭
→ 블록 구성 + 각 블록 내 elements 배치:

Block(type: 'intro')
├── Element(type: 'image', binding: 'photos.main', style: fullscreen)
├── Element(type: 'text', binding: 'groom.name', x: 30, y: 45)
├── Element(type: 'text', value: '♥', x: 50, y: 45)
├── Element(type: 'text', binding: 'bride.name', x: 70, y: 45)
└── Element(type: 'text', binding: 'wedding.dateDisplay', x: 50, y: 60)

Block(type: 'gallery')
└── ... (filmstrip 스타일 구성)
```

### 10.2 블록 단위 수정

```
사용자: (intro 블록 선택 후)
        "이름을 세로로 배치하고, 폰트를 더 크게"

→ AI가 intro 블록의 elements만 수정:
  - groom.name: x:50, y:35 → x:50, y:30, fontSize: 8vw
  - bride.name: x:50, y:50 (세로 배치)
  - 다른 블록은 변경 없음
```

### 10.3 요소 추가

```
사용자: (intro 블록 선택 후)
        "하트 아이콘 추가해줘"

→ AI가 새 Element 추가:
{
  "id": "elem-new-1",
  "type": "icon",
  "props": { "type": "icon", "icon": "heart", "size": 24 },
  "x": 50, "y": 42,
  "animation": { "loop": { "preset": "pulse" } }
}
```

---

## 11. 저장 예시 (전체 문서)

```json
{
  "id": "doc-abc123",
  "version": 2,
  "meta": {
    "title": "철수 ♥ 영희 결혼합니다",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T12:30:00Z"
  },
  "style": {
    "colors": {
      "primary": "#8B7355",
      "secondary": "#D4C5B5",
      "background": "#FDFBF7",
      "surface": "#F5F0E8",
      "accent": "#C9A962",
      "text": {
        "primary": "#2C2C2C",
        "secondary": "#5C5C5C",
        "muted": "#9C9C9C"
      }
    },
    "fonts": {
      "heading": {
        "family": "Playfair Display",
        "weight": 600,
        "size": 6,
        "lineHeight": 1.3,
        "letterSpacing": 0.02
      },
      "body": {
        "family": "Pretendard",
        "weight": 400,
        "size": 4,
        "lineHeight": 1.6,
        "letterSpacing": 0
      }
    },
    "spacing": { "section": 8, "element": 4 },
    "effects": { "borderRadius": 8, "shadow": "subtle" }
  },
  "animation": {
    "mood": "cinematic",
    "speed": 1,
    "scrollBehavior": "smooth"
  },
  "blocks": [
    {
      "id": "block-intro",
      "type": "intro",
      "enabled": true,
      "height": 100,
      "elements": [
        {
          "id": "elem-bg",
          "type": "image",
          "binding": "photos.main",
          "x": 0, "y": 0,
          "width": 100, "height": 100,
          "zIndex": 0,
          "props": { "type": "image", "objectFit": "cover", "overlay": "rgba(0,0,0,0.3)" }
        },
        {
          "id": "elem-groom",
          "type": "text",
          "binding": "groom.name",
          "x": 30, "y": 45,
          "width": 20, "height": 10,
          "zIndex": 1,
          "props": { "type": "text" },
          "style": { "text": { "fontSize": 6, "color": "#fff", "textAlign": "center" } }
        },
        {
          "id": "elem-heart",
          "type": "icon",
          "x": 50, "y": 45,
          "width": 5, "height": 5,
          "zIndex": 1,
          "props": { "type": "icon", "icon": "heart", "size": 24, "color": "#fff" }
        },
        {
          "id": "elem-bride",
          "type": "text",
          "binding": "bride.name",
          "x": 70, "y": 45,
          "width": 20, "height": 10,
          "zIndex": 1,
          "props": { "type": "text" },
          "style": { "text": { "fontSize": 6, "color": "#fff", "textAlign": "center" } }
        },
        {
          "id": "elem-date",
          "type": "text",
          "binding": "wedding.dateDisplay",
          "x": 50, "y": 60,
          "width": 80, "height": 8,
          "zIndex": 1,
          "props": { "type": "text" },
          "style": { "text": { "fontSize": 4, "color": "#fff", "textAlign": "center" } }
        }
      ],
      "animation": {
        "entrance": { "preset": "cinematic-fade", "duration": 1200 }
      }
    },
    {
      "id": "block-greeting",
      "type": "greeting",
      "enabled": true,
      "height": 60,
      "elements": [
        {
          "id": "elem-greeting-title",
          "type": "text",
          "binding": "greeting.title",
          "x": 50, "y": 20,
          "width": 80, "height": 10,
          "zIndex": 1,
          "props": { "type": "text" },
          "style": { "text": { "fontSize": 5, "textAlign": "center" } }
        },
        {
          "id": "elem-greeting-content",
          "type": "text",
          "binding": "greeting.content",
          "x": 50, "y": 40,
          "width": 80, "height": 30,
          "zIndex": 1,
          "props": { "type": "text" },
          "style": { "text": { "fontSize": 3.5, "textAlign": "center", "lineHeight": 1.8 } }
        }
      ],
      "animation": {
        "entrance": { "preset": "slide-up" }
      }
    }
  ],
  "data": {
    "groom": {
      "name": "김철수",
      "fatherName": "김아버지",
      "motherName": "김어머니"
    },
    "bride": {
      "name": "이영희",
      "fatherName": "이아버지",
      "motherName": "이어머니"
    },
    "wedding": {
      "date": "2025-03-15",
      "time": "14:00",
      "dateDisplay": "2025년 3월 15일 토요일 오후 2시"
    },
    "venue": {
      "name": "더채플앳청담",
      "hall": "5층 그랜드홀",
      "address": "서울시 강남구 청담동 123-45",
      "coordinates": { "lat": 37.5234, "lng": 127.0456 }
    },
    "photos": {
      "main": { "id": "photo-main", "url": "https://..." },
      "gallery": [
        { "id": "photo-1", "url": "https://..." },
        { "id": "photo-2", "url": "https://..." }
      ]
    },
    "greeting": {
      "title": "소중한 분들을 초대합니다",
      "content": "서로 다른 길을 걸어온 저희 두 사람이..."
    }
  }
}
```

---

## 12. 다음 단계

- [x] `02_animation_system.md` - 완전 유연한 애니메이션 시스템 (트리거, 상태 머신, AI 통합)
- [ ] `03_variables.md` - 변수 시스템 상세 정의 (타입, 유효성 검사, 포맷팅)
- [ ] `04_editor_ui.md` - 에디터 UI 컴포넌트 설계 (블록 선택, 프롬프트 입력)
- [ ] `05_renderer.md` - 렌더링 시스템 + 애니메이션 런타임
- [ ] `06_ai_prompts.md` - AI 프롬프트 템플릿 + 맥락 주입 + 테스트 케이스
