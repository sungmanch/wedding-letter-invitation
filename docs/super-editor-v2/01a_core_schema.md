# Super Editor v2 - 코어 스키마

> **목표**: AI 기반 청첩장 에디터를 위한 핵심 데이터 구조
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
  'groom.fatherPhone': { type: 'phone', label: '신랑 아버지 연락처' },
  'groom.motherPhone': { type: 'phone', label: '신랑 어머니 연락처' },
  'groom.phone': { type: 'phone', label: '신랑 연락처' },
  'groom.account': { type: 'account', label: '신랑 계좌' },

  // 신부 정보
  'bride.name': { type: 'text', label: '신부 이름' },
  'bride.nameEn': { type: 'text', label: '신부 영문명' },
  'bride.fatherName': { type: 'text', label: '신부 아버지' },
  'bride.motherName': { type: 'text', label: '신부 어머니' },
  'bride.fatherPhone': { type: 'phone', label: '신부 아버지 연락처' },
  'bride.motherPhone': { type: 'phone', label: '신부 어머니 연락처' },
  'bride.phone': { type: 'phone', label: '신부 연락처' },
  'bride.account': { type: 'account', label: '신부 계좌' },

  // 예식 정보
  'wedding.date': { type: 'date', label: '예식 날짜' },
  'wedding.time': { type: 'time', label: '예식 시간' },
  'wedding.dateDisplay': { type: 'text', label: '날짜 표시 (한글)' },
  'wedding.dday': { type: 'number', label: 'D-day' },

  // 예식장 정보
  'venue.name': { type: 'text', label: '예식장명' },
  'venue.hall': { type: 'text', label: '홀' },
  'venue.floor': { type: 'text', label: '층' },
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

  // 전역 스타일 시스템 (3-Level 하이브리드)
  style: StyleSystem  // → 01b_style_system.md 참조

  // 전역 애니메이션 설정
  animation: GlobalAnimation  // → 02a_triggers_actions.md 참조

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
  // ─── 핵심 섹션 ───
  | 'hero'              // 메인 히어로 (메인 사진, 이름, 날짜)
  | 'greeting'          // 인사말
  | 'calendar'          // 달력/D-day
  | 'gallery'           // 포토 갤러리
  | 'location'          // 예식장 정보 + 지도
  | 'parents'           // 혼주 소개
  | 'contact'           // 연락처
  | 'account'           // 축의금 계좌
  | 'message'           // 축하 메시지/방명록
  | 'rsvp'              // 참석 여부
  // ─── 확장 섹션 ───
  | 'loading'           // 로딩 화면
  | 'quote'             // 글귀
  | 'profile'           // 프로필형 소개
  | 'parents-contact'   // 혼주 연락처
  | 'timeline'          // 타임라인/스토리
  | 'video'             // 영상
  | 'interview'         // 웨딩 인터뷰
  | 'transport'         // 교통수단
  | 'notice'            // 안내사항
  | 'announcement'      // 안내문
  | 'flower-gift'       // 화환 보내기
  | 'together-time'     // 함께한 시간
  | 'dday'              // D-DAY 카운트다운
  | 'guest-snap'        // 게스트스냅
  | 'ending'            // 엔딩 크레딧
  | 'music'             // BGM 컨트롤
  | 'custom'            // 사용자 정의 블록
```

### 4.2 AI 맥락 이해 방식

AI는 Block의 `type`과 각 Element의 `binding`을 통해 맥락을 파악:

```
Block(type: 'hero')의 elements:
├── Element(binding: 'photos.main') → "메인 사진"
├── Element(binding: 'groom.name') → "신랑 이름"
├── Element(binding: 'bride.name') → "신부 이름"
└── Element(binding: 'wedding.dateDisplay') → "예식 날짜"

→ AI 이해: "이 블록은 메인 사진 위에 신랑신부 이름과 날짜를 보여주는 히어로"
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
  rotation?: number // degrees (기본값: 0)

  // z-index
  zIndex: number

  // 변수 바인딩 (AI가 의미 파악)
  binding?: VariablePath  // 'groom.name', 'photos.main' 등

  // 바인딩 없을 때 직접 값
  value?: string | number

  // 타입별 추가 속성
  props: ElementProps

  // 요소별 스타일
  style?: ElementStyle  // → 01b_style_system.md 참조

  // 요소별 애니메이션
  animation?: ElementAnimationConfig  // → 02a_triggers_actions.md 참조
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
  zoom?: number
  showMarker?: boolean
}

interface CalendarProps {
  type: 'calendar'
  showDday?: boolean
  highlightColor?: string
}
```

---

## 6. 정형 데이터 (WeddingData)

변수 바인딩의 실제 값을 저장.

```typescript
interface WeddingData {
  groom: {
    name: string
    nameEn?: string
    fatherName?: string
    motherName?: string
    fatherPhone?: string
    motherPhone?: string
    phone?: string
    account?: {
      bank: string
      number: string
      holder: string
    }
  }

  bride: {
    name: string
    nameEn?: string
    fatherName?: string
    motherName?: string
    fatherPhone?: string
    motherPhone?: string
    phone?: string
    account?: {
      bank: string
      number: string
      holder: string
    }
  }

  wedding: {
    date: string          // ISO 8601: '2025-03-15'
    time: string          // 'HH:mm': '14:00'
    dateDisplay?: string  // 표시용 (computed)
  }

  venue: {
    name: string
    hall?: string
    floor?: string
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

  photos: {
    main?: PhotoData
    gallery: PhotoData[]
  }

  greeting?: {
    title?: string
    content: string
  }

  additionalAccounts?: {
    side: 'groom' | 'bride'
    relation: string
    bank: string
    number: string
    holder: string
  }[]

  music?: {
    url: string
    title?: string
    artist?: string
    autoPlay: boolean
  }

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

## 7. 편집 UX 흐름

### 7.1 블록 선택 + 프롬프트 방식

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

### 7.2 AI 수정 예시

**사용자 요청**: "신랑 이름을 왼쪽에, 신부 이름을 오른쪽에 배치해줘"

**AI 출력 (JSON Patch 형식)**:
```json
{
  "analysis": {
    "intent": "신랑/신부 이름 좌우 배치",
    "affectedProperties": ["elements[0].x", "elements[0].style", "elements[2].x", "elements[2].style"],
    "approach": "groom.name 왼쪽, bride.name 오른쪽으로 위치 및 정렬 변경"
  },
  "patches": [
    { "op": "replace", "path": "/blocks/0/elements/0/x", "value": 10 },
    { "op": "replace", "path": "/blocks/0/elements/0/style/text/textAlign", "value": "left" },
    { "op": "replace", "path": "/blocks/0/elements/2/x", "value": 90 },
    { "op": "replace", "path": "/blocks/0/elements/2/style/text/textAlign", "value": "right" }
  ],
  "explanation": "신랑 이름을 왼쪽 정렬, 신부 이름을 오른쪽 정렬로 배치했습니다."
}
```

---

## 8. 관련 문서

| 문서 | 내용 |
|------|------|
| [01b_style_system.md](./01b_style_system.md) | 3-Level 스타일 시스템, 시맨틱 토큰 |
| [02a_triggers_actions.md](./02a_triggers_actions.md) | 애니메이션 트리거, 액션 타입 |
| [03_variables.md](./03_variables.md) | 변수 타입, Computed 필드 |
| [04a_layout_tabs.md](./04a_layout_tabs.md) | 에디터 레이아웃 |
