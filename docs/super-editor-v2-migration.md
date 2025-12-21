# Super Editor v2 데이터 구조 마이그레이션

**Version:** 1.3
**Last Updated:** 2025-12-21
**Status:** 계획 단계

---

## 1. 개요

### 목적
`section-data.md v2.2` 스펙을 `super-editor-v2`에 반영하여 데이터 구조를 통일합니다.

### 결정 사항
- **영문 필드 제외**: 한국어/영어 이중 지원은 UX 복잡성으로 인해 제외
- **자동 계산 필드 확장**: countdown, 날짜 분해 필드 추가
- **섹션 데이터 구조 통일**: 13개 섹션 데이터 구조 완성
- **공유 필드 체계**: `couple.groom/bride`, `wedding.date`를 원본으로 정의하고 다른 섹션에서 참조

---

## 2. 현재 상태 분석

### 2.1 super-editor-v2 자동 계산 필드 (4개 구현됨)

```typescript
// binding-resolver.ts:115-149
const COMPUTED_FIELDS = [
  'wedding.dateDisplay',   // ✅ "2025년 3월 15일 토요일"
  'wedding.dday',          // ✅ "D-85" or "D-Day"
  'wedding.dayOfWeek',     // ✅ "토" (→ weekday로 rename 필요)
  'wedding.timeDisplay',   // ✅ "오후 2시"
]
```

### 2.2 super-editor-v2 WeddingData 현재 구조

```typescript
// schema/types.ts:798-836
interface WeddingData {
  groom: PersonInfo
  bride: PersonInfo
  wedding: { date, time, dateDisplay? }
  venue: VenueInfo
  photos: { main?, gallery[] }
  greeting?: { title?, content }
  additionalAccounts?: AccountInfo[]
  music?: { url, title?, artist?, autoPlay }
  guestbook?: { enabled, requirePassword }
  custom?: Record<string, string>
}
```

---

## 3. 마이그레이션 대상

### 3.1 자동 계산 필드 추가

| 필드 | 설명 | 작업 |
|------|------|------|
| `wedding.month` | "3" | 추가 |
| `wedding.day` | "15" | 추가 |
| `wedding.weekday` | "토" | rename (dayOfWeek → weekday) |
| `countdown.days` | 남은 일수 | 추가 |
| `countdown.hours` | 남은 시간 | 추가 |
| `countdown.minutes` | 남은 분 | 추가 |
| `countdown.seconds` | 남은 초 | 추가 (실시간 갱신) |

### 3.2 WeddingData 구조 (section-data.md 기준)

```typescript
interface WeddingData {
  // ═══════════════════════════════════════════════
  // 공유 필드 (원본 정의)
  // ═══════════════════════════════════════════════

  couple: {
    groom: PersonInfo      // ◆ 원본: intro
    bride: PersonInfo      // ◆ 원본: intro
    photo?: string         // 커플 대표 사진
    photos?: string[]      // 인터뷰 진입점용 카드 이미지들
  }

  wedding: {
    date: string           // ◆ 원본: intro (ISO 형식)
    time: string           // date 섹션
  }

  // ═══════════════════════════════════════════════
  // 혼주 정보 (greeting 섹션)
  // ═══════════════════════════════════════════════

  parents?: {
    deceasedIcon?: '故' | '고' | '✿'
    groom: { father?: ParentInfo; mother?: ParentInfo }
    bride: { father?: ParentInfo; mother?: ParentInfo }
  }

  // ═══════════════════════════════════════════════
  // 기타 공유 데이터
  // ═══════════════════════════════════════════════

  venue: VenueInfo
  photos: { main?: string; gallery?: string[] }

  // ═══════════════════════════════════════════════
  // 섹션별 설정
  // ═══════════════════════════════════════════════

  intro?: { message?: string }
  greeting?: { title?: string; content?: string }
  contact?: { showParents?: boolean }
  gallery?: { effect?: GalleryEffect }
  accounts?: AccountsConfig
  rsvp?: RsvpConfig
  notice?: { items?: NoticeItem[] }
  guestbook?: GuestbookConfig
  ending?: EndingConfig
  bgm?: { trackId?: string; title?: string; artist?: string }
  video?: VideoConfig

  // ═══════════════════════════════════════════════
  // 확장 섹션 (About Us, Interview, Timeline)
  // ═══════════════════════════════════════════════

  interview?: InterviewConfig    // Q&A 팝업
  timeline?: TimelineConfig      // 연애 스토리

  // 커스텀 변수 (AI 생성용)
  custom?: Record<string, string>
}

// ═══════════════════════════════════════════════
// 서브 타입
// ═══════════════════════════════════════════════

interface PersonInfo {
  name: string
  phone?: string
  intro?: string        // 소개글
  // 프로필 확장 (About Us)
  photo?: string        // 개인 사진
  birthDate?: string    // "1990-12-10"
  mbti?: string         // "ISTP"
  tags?: string[]       // ["캠핑", "러닝"]
}

interface ParentInfo {
  name?: string
  status?: '' | '故'
  baptismalName?: string
  phone?: string
}

// Q&A 인터뷰 (팝업)
interface InterviewConfig {
  title?: string        // "우리에게 물었습니다"
  subtitle?: string     // "결혼을 앞두고 저희 두 사람의 인터뷰를 준비했습니다"
  items: InterviewItem[]  // max 5
}

interface InterviewItem {
  question: string      // "첫인상은 어땠나요?"
  groomAnswer: string   // 신랑 답변
  brideAnswer: string   // 신부 답변
}

// 타임라인 (연애 스토리)
interface TimelineConfig {
  title?: string        // "우리의 이야기"
  subtitle?: string     // "처음 만난 순간부터 지금까지"
  items: TimelineItem[]
}

interface TimelineItem {
  date: string          // "14년 1월 16일" 또는 "연애 기간 11년"
  title: string         // "CGV 아르바이트"
  content?: string      // "같은 곳에서 함께 일하다..."
  image?: string
  type?: 'event' | 'milestone'  // milestone = 강조 표시
}

interface VenueInfo {
  name: string
  hall?: string
  address?: string      // ⚙️ 자동
  lat?: number          // ⚙️ 자동
  lng?: number          // ⚙️ 자동
  tel?: string
  naverUrl?: string
  kakaoUrl?: string
  tmapUrl?: string
  transportation?: {
    bus?: string
    subway?: string
    shuttle?: string
    parking?: string
    etc?: string
  }
}

interface AccountsConfig {
  groom?: AccountItem[]  // max 3
  bride?: AccountItem[]  // max 3
  kakaopay?: { groom?: string; bride?: string }
}

interface AccountItem {
  relation: string  // 본인 | 아버지 | 어머니
  bank: string
  number: string
  holder: string
}

interface RsvpConfig {
  title?: string
  description?: string
  showGuestCount?: boolean  // 기본: true
  showMeal?: boolean        // 기본: false
  showMessage?: boolean     // 기본: true
  showSide?: boolean
  showBusOption?: boolean
  deadline?: string
  privacyPolicyUrl?: string
  privacyPolicyText?: string
}

interface NoticeItem {
  title: string
  content: string
  icon?: 'bus' | 'car' | 'utensils' | 'info' | 'gift' | 'clock'
  image?: string
  imagePosition?: 'top' | 'bottom'
}

interface GuestbookConfig {
  title?: string
  placeholder?: string
  requireName?: boolean  // 기본: true
  maxLength?: number     // 기본: 500
}

interface EndingConfig {
  message?: string
  photo?: string
  showCredit?: boolean  // 기본: true
  wreath?: { enabled?: boolean; vendorUrl?: string; vendorName?: string }
  share?: { kakao?: boolean; link?: boolean; sms?: boolean }
}

interface VideoConfig {
  type?: 'youtube' | 'vimeo'
  url?: string
  title?: string
  autoplay?: boolean  // 기본: false
  muted?: boolean     // 기본: true
}

type GalleryEffect = 'slide' | 'fade' | 'coverflow' | 'cards' | 'cube'
```

### 3.3 자동 계산 필드 (__HIDDEN__)

에디터에서 숨김, 바인딩 시스템에서 런타임 계산:

| 필드 | 소스 | 결과 예시 |
|------|------|----------|
| `wedding.dateDisplay` | `wedding.date` | "2025년 3월 15일 토요일" |
| `wedding.timeDisplay` | `wedding.time` | "오후 2시" |
| `wedding.dday` | `wedding.date` | "D-85" |
| `wedding.month` | `wedding.date` | "3" |
| `wedding.day` | `wedding.date` | "15" |
| `wedding.weekday` | `wedding.date` | "토" |
| `countdown.days/hours/minutes/seconds` | `wedding.date` | 실시간 |

### 3.4 공유 필드 참조

| 원본 필드 | 정의 | 참조 섹션 |
|----------|------|----------|
| `couple.groom.name` | intro | greeting, date, couple |
| `couple.bride.name` | intro | greeting, date, couple |
| `wedding.date` | intro | date |

### 3.5 DB 스키마 변경 (rsvp_responses)

```typescript
// 추가 컬럼
{
  side: 'groom' | 'bride'  // 신랑측/신부측
  bus_required: boolean     // 버스 탑승 여부
  privacy_agreed: boolean   // 개인정보 동의 (필수)
}
```

---

## 4. 수정 파일 목록

| 우선순위 | 파일 | 작업 내용 |
|----------|------|----------|
| 🔴 P1 | `schema/types.ts` | WeddingData 인터페이스 확장 |
| 🔴 P1 | `schema/index.ts` | DEFAULT_WEDDING_DATA 업데이트 |
| 🟠 P2 | `utils/binding-resolver.ts` | COMPUTED_FIELDS 추가, VariablePath 확장 |
| 🟠 P2 | `schema/db-schema.ts` | rsvpResponsesV2 컬럼 추가 |
| 🟡 P3 | 렌더러/에디터 | 새 데이터 구조 반영 |

---

## 5. VariablePath 정의

```typescript
type VariablePath =
  // ─── 공유 필드 (◆ 원본) ───
  | 'couple.groom.name' | 'couple.groom.phone' | 'couple.groom.intro'
  | 'couple.groom.photo' | 'couple.groom.birthDate' | 'couple.groom.mbti' | 'couple.groom.tags'
  | 'couple.bride.name' | 'couple.bride.phone' | 'couple.bride.intro'
  | 'couple.bride.photo' | 'couple.bride.birthDate' | 'couple.bride.mbti' | 'couple.bride.tags'
  | 'couple.photo' | 'couple.photos'
  | 'wedding.date' | 'wedding.time'

  // ─── 자동 계산 (__HIDDEN__) ───
  | 'wedding.dateDisplay' | 'wedding.timeDisplay' | 'wedding.dday'
  | 'wedding.month' | 'wedding.day' | 'wedding.weekday'
  | 'countdown.days' | 'countdown.hours' | 'countdown.minutes' | 'countdown.seconds'

  // ─── 혼주 ───
  | 'parents.deceasedIcon'
  | 'parents.groom.father.name' | 'parents.groom.father.status' | 'parents.groom.father.phone'
  | 'parents.groom.mother.name' | 'parents.groom.mother.status' | 'parents.groom.mother.phone'
  | 'parents.bride.father.name' | 'parents.bride.father.status' | 'parents.bride.father.phone'
  | 'parents.bride.mother.name' | 'parents.bride.mother.status' | 'parents.bride.mother.phone'

  // ─── 장소 ───
  | 'venue.name' | 'venue.hall' | 'venue.address' | 'venue.tel'
  | 'venue.lat' | 'venue.lng'
  | 'venue.naverUrl' | 'venue.kakaoUrl' | 'venue.tmapUrl'
  | 'venue.transportation.bus' | 'venue.transportation.subway'
  | 'venue.transportation.shuttle' | 'venue.transportation.parking' | 'venue.transportation.etc'

  // ─── 사진 ───
  | 'photos.main' | 'photos.gallery'

  // ─── 섹션 설정 ───
  | 'intro.message'
  | 'greeting.title' | 'greeting.content'
  | 'contact.showParents'
  | 'gallery.effect'
  | 'accounts.groom' | 'accounts.bride' | 'accounts.kakaopay.groom' | 'accounts.kakaopay.bride'
  | 'rsvp.title' | 'rsvp.description' | 'rsvp.deadline'
  | 'notice.items'
  | 'guestbook.title' | 'guestbook.placeholder'
  | 'ending.message' | 'ending.photo'
  | 'bgm.trackId' | 'bgm.title' | 'bgm.artist'
  | 'video.type' | 'video.url' | 'video.title'

  // ─── 확장 섹션 ───
  | 'interview.title' | 'interview.subtitle' | 'interview.items'
  | 'timeline.title' | 'timeline.subtitle' | 'timeline.items'

  // ─── 커스텀 ───
  | `custom.${string}`
```

---

## 6. 섹션 ↔ 블록 매핑

| section-data.md | super-editor-v2 BlockType | 상태 |
|-----------------|---------------------------|------|
| intro | `hero` | ✅ |
| greeting | `greeting` | ✅ |
| date | `calendar` | ✅ |
| venue | `location` | ✅ |
| gallery | `gallery` | ✅ |
| accounts | `account` | ✅ |
| couple (About Us) | `profile` | ✅ 프로필 카드 |
| interview (Q&A) | `interview` | ✅ 팝업 형태 |
| timeline | `timeline` | 🆕 추가 필요 |
| rsvp | `rsvp` | ✅ |
| notice | `notice` | ✅ |
| guestbook | `message` | ✅ |
| ending | `ending` | ✅ |
| music | `music` | ✅ |
| video | `video` | ✅ |

---

## 7. 제외 항목 (영문 필드)

UX 복잡성으로 인해 다음 영문 필드들은 지원하지 않습니다:

- `*.nameEn` (이름 영문)
- `wedding.dateEn`, `wedding.timeEn`
- `venue.nameEn`, `venue.addressEn`
- `greeting.titleEn`, `greeting.contentEn`
- `couple.*.introEn`
- `couple.interview[].questionEn`, `answerEn`
- `rsvp.titleEn`, `rsvp.descriptionEn`
- `notice.items[].titleEn`, `contentEn`
- `ending.messageEn`

---

## 8. 마이그레이션 단계

### Phase 1: 타입 확장 (P1)
1. `schema/types.ts` - WeddingData 인터페이스 확장
2. `schema/index.ts` - DEFAULT_WEDDING_DATA 업데이트

### Phase 2: 바인딩 시스템 (P2)
1. `utils/binding-resolver.ts` - COMPUTED_FIELDS 추가
2. `utils/binding-resolver.ts` - VariablePath 타입 확장
3. `schema/db-schema.ts` - rsvp 컬럼 추가 + 마이그레이션

### Phase 3: UI 통합 (P3)
1. 에디터 필드 추가
2. 렌더러 컴포넌트 업데이트

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-12-21 | 1.3 | 확장 섹션 추가 (About Us, Interview, Timeline) |
| | | - `PersonInfo` 확장: photo, birthDate, mbti, tags |
| | | - `InterviewConfig` 추가: Q&A 팝업 (groomAnswer/brideAnswer 분리) |
| | | - `TimelineConfig` 추가: 연애 스토리 (event/milestone 구분) |
| | | - `couple.photos` 추가: 인터뷰 진입점 카드 이미지들 |
| 2025-12-21 | 1.2 | 구조 단순화 |
| | | - WeddingData 구조 정리 (서브 타입 분리) |
| | | - VariablePath 간결하게 재정의 |
| 2025-12-21 | 1.1 | section-data.md v2.2 기준 동기화 |
| | | - `groom/bride` → `couple.groom/couple.bride` 구조 통일 |
| 2025-12-21 | 1.0 | 초기 작성 - 마이그레이션 계획 수립 |
