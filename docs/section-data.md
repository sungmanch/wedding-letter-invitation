# Section Data Definition

**Version:** 1.0
**Last Updated:** 2025-12-14
**Author:** BMad + Claude

---

## 1. 섹션 개요

### 총 섹션 구성: 14개

| 구분 | 개수 | 섹션 목록 |
|------|------|----------|
| **MVP** | 12개 | intro, greeting, date, gallery, venue, parents, contact, accounts, guestbook, music, rsvp, notice |
| **Post-MVP** | 2개 | video, ending |

### 섹션 순서 기본값 (sectionOrder)

```typescript
const DEFAULT_SECTION_ORDER = [
  'intro',      // 1. 인트로
  'greeting',   // 2. 인사말
  'date',       // 3. 예식 일시
  'gallery',    // 4. 갤러리
  'venue',      // 5. 오시는 길
  'parents',    // 6. 혼주 정보
  'contact',    // 7. 연락처
  'accounts',   // 8. 축의금 계좌
  'notice',     // 9. 공지사항
  'rsvp',       // 10. 참석 여부
  'guestbook',  // 11. 방명록
  'music',      // 12. 배경음악 (FAB)
]
```

---

## 2. 섹션별 데이터 정의

### 2.1 Intro (인트로)

**목적:** 청첩장 첫인상, 커플 대표 이미지와 기본 정보 표시

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `photos.main` | image | ✅ | - | 메인 사진 (3:4 비율) |
| `couple.groom.name` | text | ✅ | - | 신랑 이름 |
| `couple.bride.name` | text | ✅ | - | 신부 이름 |
| `wedding.date` | date | ✅ | - | 결혼 날짜 (ISO 형식) |
| `intro.message` | text | ❌ | "저희 두 사람이 사랑으로 하나가 됩니다" | 인트로 문구 |

**Variants:**
- `minimal` - 최소한의 정보만 표시
- `elegant` - 우아한 레이아웃
- `romantic` - 로맨틱한 분위기

**스타일 프리셋:** Cinematic, Exhibition, Magazine, Gothic Romance, Old Money, Monogram, Jewel Velvet, Custom

---

### 2.2 Greeting (인사말)

**목적:** 신랑/신부의 인사말 메시지

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `greeting.title` | text | ❌ | "저희 결혼합니다" | 인사말 제목 |
| `greeting.content` | textarea | ❌ | (5줄 기본 템플릿) | 인사말 내용 |

**Variants:**
- `simple` - 텍스트만 표시
- `elegant` - 카드 형태, 신랑·신부 이름 포함

---

### 2.3 Date (예식 일시)

**목적:** 결혼식 날짜/시간 및 D-day 카운트다운

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `wedding.date` | date | ✅ | - | 예식 날짜 |
| `wedding.time` | time | ✅ | "14:00" | 예식 시간 |
| `wedding.dateDisplay` | text | 자동 | - | 한글 표시 (2025년 3월 15일 토요일) |
| `wedding.timeDisplay` | text | 자동 | - | 한글 시간 (오후 2시) |
| `wedding.dday` | number | 자동 | - | D-day 계산값 |
| `countdown.days` | number | 자동 | - | 남은 일수 |
| `countdown.hours` | number | 자동 | - | 남은 시간 |
| `countdown.minutes` | number | 자동 | - | 남은 분 |
| `countdown.seconds` | number | 자동 | - | 남은 초 |

**Variants:**
- `countdown` - 카운트다운 강조
- `calendar` - 달력 형태 표시

---

### 2.4 Gallery (갤러리)

**목적:** 웨딩 사진 갤러리

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `photos.gallery` | images | ❌ | - | 갤러리 이미지 (최대 40장) |
| `gallery.effect` | select | ❌ | "slide" | 캐러셀 전환 효과 |

**gallery.effect 옵션:**
- `slide` - 슬라이드
- `fade` - 페이드
- `coverflow` - 커버플로우
- `cards` - 카드 스택
- `cube` - 큐브

**Variants:**
- `grid` - 3열 그리드 (간격 있음)
- `grid-seamless` - 3열 그리드 (여백 없음, 인스타그램 스타일)
- `masonry` - 2열 메이슨리
- `carousel` - 4:3 캐러셀 (자동재생 4초)
- `vertical-swipe` - 3:4 세로 스와이프

---

### 2.5 Venue (오시는 길)

**목적:** 예식장 위치, 지도, 교통 정보

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `venue.name` | text | ✅ | "그랜드 웨딩홀" | 예식장 이름 |
| `venue.hall` | text | ❌ | "3층 그랜드볼룸" | 홀 이름 |
| `venue.address` | text | 자동 | - | 주소 (LocationField에서 자동 채움) |
| `venue.lat` | number | 자동 | - | 위도 |
| `venue.lng` | number | 자동 | - | 경도 |
| `venue.tel` | phone | ❌ | - | 예식장 전화번호 |
| `venue.naverUrl` | url | ❌ | - | 네이버 지도 공유 링크 |
| `venue.kakaoUrl` | url | ❌ | - | 카카오맵 공유 링크 |
| `venue.tmapUrl` | url | ❌ | - | T맵 공유 링크 |
| `venue.transportation.bus` | textarea | ❌ | - | 버스 정보 |
| `venue.transportation.subway` | textarea | ❌ | - | 지하철 정보 |
| `venue.transportation.shuttle` | textarea | ❌ | - | 셔틀버스 정보 |
| `venue.transportation.parking` | textarea | ❌ | - | 주차 안내 |

**Variants:**
- `map-focus` - 지도 중심 레이아웃

---

### 2.6 Parents (혼주 정보)

**목적:** 양가 혼주님 정보

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `parents.deceasedIcon` | select | ❌ | "故" | 고인 표시 (故/고/✿) |
| `parents.groom.father.name` | text | ❌ | - | 신랑 아버지 이름 |
| `parents.groom.father.status` | select | ❌ | "" | 신랑 아버지 상태 (표기 없음/故) |
| `parents.groom.father.baptismalName` | text | ❌ | - | 신랑 아버지 세례명 |
| `parents.groom.father.phone` | phone | ❌ | - | 신랑 아버지 연락처 |
| `parents.groom.mother.name` | text | ❌ | - | 신랑 어머니 이름 |
| `parents.groom.mother.status` | select | ❌ | "" | 신랑 어머니 상태 |
| `parents.groom.mother.baptismalName` | text | ❌ | - | 신랑 어머니 세례명 |
| `parents.groom.mother.phone` | phone | ❌ | - | 신랑 어머니 연락처 |
| `parents.bride.father.name` | text | ❌ | - | 신부 아버지 이름 |
| `parents.bride.father.status` | select | ❌ | "" | 신부 아버지 상태 |
| `parents.bride.father.baptismalName` | text | ❌ | - | 신부 아버지 세례명 |
| `parents.bride.father.phone` | phone | ❌ | - | 신부 아버지 연락처 |
| `parents.bride.mother.name` | text | ❌ | - | 신부 어머니 이름 |
| `parents.bride.mother.status` | select | ❌ | "" | 신부 어머니 상태 |
| `parents.bride.mother.baptismalName` | text | ❌ | - | 신부 어머니 세례명 |
| `parents.bride.mother.phone` | phone | ❌ | - | 신부 어머니 연락처 |

**Variants:**
- `traditional` - 전통적 레이아웃

---

### 2.7 Contact (연락처)

**목적:** 신랑/신부 및 혼주 연락처

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `couple.groom.name` | text | ✅ | - | 신랑 이름 |
| `couple.groom.phone` | phone | ❌ | - | 신랑 연락처 |
| `couple.bride.name` | text | ✅ | - | 신부 이름 |
| `couple.bride.phone` | phone | ❌ | - | 신부 연락처 |
| `contact.showParents` | boolean | ❌ | false | 혼주 연락처 표시 여부 |

**혼주 연락처:** `parents.*.*.phone` 필드 참조 (Parents 섹션에서 정의)

**Variants:**
- `icon-buttons` - 아이콘 버튼 (전화/SMS)

---

### 2.8 Accounts (축의금 계좌)

**목적:** 축의금 계좌 정보

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `accounts.groom` | repeater | ❌ | - | 신랑측 계좌 (최대 3개) |
| `accounts.bride` | repeater | ❌ | - | 신부측 계좌 (최대 3개) |
| `accounts.kakaopay.groom` | text | ❌ | - | 신랑측 카카오페이 계좌번호 |
| `accounts.kakaopay.bride` | text | ❌ | - | 신부측 카카오페이 계좌번호 |

**accounts.groom / accounts.bride 하위 필드:**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `relation` | select | ✅ | 관계 (본인/아버지/어머니) |
| `bank` | text | ✅ | 은행명 |
| `number` | text | ✅ | 계좌번호 |
| `holder` | text | ✅ | 예금주 |

**Variants:**
- `tabs` - 탭 형태 (신랑측/신부측)

---

### 2.9 Guestbook (방명록)

**목적:** 게스트 축하 메시지

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `guestbook.messages` | - | 자동 | - | DB에서 조회 (에디터 입력 불필요) |

**Variants:**
- `fab` - 플로팅 버튼 (스크롤 후 표시)
- `block` - 인라인 블록 형태

---

### 2.10 Music (배경음악)

**목적:** BGM 플레이어

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `bgm.trackId` | select | ❌ | "romantic-piano-01" | BGM 프리셋 ID |
| `bgm.title` | text | ❌ | - | 곡 제목 |
| `bgm.artist` | text | ❌ | - | 아티스트명 |

**bgm.trackId 옵션:**
- `romantic-piano-01` - 로맨틱 피아노 1
- `romantic-piano-02` - 로맨틱 피아노 2
- `elegant-orchestra-01` - 우아한 오케스트라
- `playful-acoustic-01` - 경쾌한 어쿠스틱
- `emotional-ballad-01` - 감동적인 발라드
- `classical-canon` - 클래식 - 캐논

**Variants:**
- `fab` - 플로팅 플레이어 (우측 하단)
- `inline` - 인라인 플레이어

---

### 2.11 RSVP (참석여부) 🆕

**목적:** 하객 참석 여부 수집 및 관리

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `rsvp.title` | text | ❌ | "참석 여부를 알려주세요" | RSVP 제목 |
| `rsvp.description` | textarea | ❌ | - | 안내 문구 |
| `rsvp.showGuestCount` | boolean | ❌ | true | 동행인 수 입력 받기 |
| `rsvp.showMeal` | boolean | ❌ | false | 식사 여부 입력 받기 |
| `rsvp.showMessage` | boolean | ❌ | true | 메시지 입력란 표시 |
| `rsvp.deadline` | date | ❌ | - | 마감일 |

**DB 테이블 (rsvp_responses):**

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid | PK |
| `invitation_id` | uuid | FK → superEditorInvitations |
| `guest_name` | text | 하객 이름 |
| `guest_phone` | text | 하객 연락처 |
| `attending` | text | 참석 여부 (yes/no/maybe) |
| `guest_count` | integer | 동행인 수 |
| `meal_option` | text | 식사 옵션 |
| `side` | text | 신랑측/신부측 (groom/bride) |
| `message` | text | 메시지 |
| `submitted_at` | timestamp | 제출 시간 |

**Variants:**
- `popup` - 팝업 형태
- `inline` - 인라인 폼

---

### 2.12 Notice (공지사항) 🆕

**목적:** 셔틀버스, 주차, 식사 등 안내사항

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `notice.items` | repeater | ❌ | - | 공지사항 목록 |

**notice.items 하위 필드:**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | text | ✅ | 공지 제목 (예: "셔틀버스 안내") |
| `content` | textarea | ✅ | 공지 내용 |
| `icon` | select | ❌ | 아이콘 (bus/car/utensils/info/gift/clock) |

**Variants:**
- `list` - 목록형 (아이콘 + 제목 + 내용)
- `accordion` - 접기형 (클릭 시 펼침)
- `card` - 카드형 (그리드 배치)

---

### 2.13 Video (동영상) - Post-MVP

**목적:** 웨딩 영상 임베드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `video.type` | select | ❌ | "youtube" | 영상 타입 (youtube/vimeo) |
| `video.url` | url | ❌ | - | YouTube/Vimeo URL |
| `video.title` | text | ❌ | - | 영상 제목 |
| `video.autoplay` | boolean | ❌ | false | 자동 재생 |
| `video.muted` | boolean | ❌ | true | 음소거 시작 |

---

### 2.14 Ending (엔딩) - Post-MVP

**목적:** 청첩장 마무리 글귀 + 감사 인사

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `ending.message` | textarea | ❌ | "와주셔서 감사합니다" | 엔딩 메시지 |
| `ending.photo` | image | ❌ | - | 엔딩 사진 |
| `ending.showCredit` | boolean | ❌ | true | "Made with Maison de Letter" 표시 |

---

## 3. 데이터 수집 시점

| 시점 | 수집 데이터 |
|------|------------|
| **Stage 1 (폼)** | `couple.groom.name`, `couple.bride.name`, `wedding.date`, `wedding.time`, `venue.name` |
| **Stage 2 (AI 채팅)** | 분위기 선호, 색상 선호 → AI가 스타일 생성 |
| **Edit (편집 페이지)** | 그 외 모든 상세 정보 |

---

## 4. 자동 계산 필드 (__HIDDEN__)

에디터에서 숨김 처리되며 시스템이 자동으로 계산하는 필드:

| 필드 | 계산 방식 |
|------|----------|
| `wedding.dateDisplay` | `wedding.date` → "2025년 3월 15일 토요일" |
| `wedding.timeDisplay` | `wedding.time` → "오후 2시" |
| `wedding.dateEn` | `wedding.date` → "March 15, 2025" |
| `wedding.timeEn` | `wedding.time` → "2:00 PM" |
| `wedding.dday` | 현재 날짜 기준 D-day 계산 |
| `wedding.month` | `wedding.date` → "3" |
| `wedding.day` | `wedding.date` → "15" |
| `wedding.weekday` | `wedding.date` → "토" |
| `countdown.days` | 실시간 카운트다운 |
| `countdown.hours` | 실시간 카운트다운 |
| `countdown.minutes` | 실시간 카운트다운 |
| `countdown.seconds` | 실시간 카운트다운 |
| `venue.address` | LocationField에서 주소 검색 시 자동 채움 |
| `venue.lat` | LocationField에서 주소 검색 시 자동 채움 |
| `venue.lng` | LocationField에서 주소 검색 시 자동 채움 |
| `guestbook.messages` | DB에서 조회 |

---

## 5. 경쟁사 대비 차별점

| 기능 | 데어무드 | 투아워게스트 | Maison de Letter |
|------|----------|--------------|------------------|
| 인트로 스타일 | 애니메이션 선택 | 커버 템플릿 | **7개 프리셋 + AI 커스텀** |
| 갤러리 | 40장 | 60장 | **40장** |
| 디자인 시스템 | 템플릿 기반 | 템플릿 기반 | **60-30-10 토큰 시스템** |
| AI 생성 | ❌ | ❌ | **✅ Gemini 기반** |
| 실시간 편집 | 제한적 | 제한적 | **✅ 3탭 실시간 프리뷰** |
| 세례명 지원 | ✅ | ❌ | **✅** |
| RSVP | ✅ 카톡알림 | ✅ 동행인수 | **✅ MVP** |
| 공지사항 | ✅ 분리/그룹형 | ✅ | **✅ MVP** |

---

## 6. 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 2025-12-14 | 1.0 | 초기 작성 - 14개 섹션 정의, 경쟁사 분석 기반 | BMad + Claude |
