/**
 * Super Editor - Variable Declaration Schema
 * 동적 에디터 자동 생성을 위한 변수 선언 타입
 */

import type { FieldType } from './editor'

// ============================================
// Variable Types
// ============================================

export type VariableType =
  | 'text'
  | 'textarea'
  | 'image'
  | 'images'
  | 'date'
  | 'time'
  | 'datetime'
  | 'number'
  | 'select'
  | 'phone'
  | 'url'
  | 'location'
  | 'account'
  | 'repeater'

// ============================================
// Variable Declaration
// ============================================

export interface VariableDeclaration {
  /** 고유 식별자 (path 기반 자동 생성 가능) */
  id: string
  /** 데이터 바인딩 경로 (예: "couple.groom.name") */
  path: string
  /** 변수 타입 */
  type: VariableType
  /** 에디터 라벨 (한글) */
  label: string
  /** 상세 설명 */
  description?: string
  /** 필수 여부 */
  required: boolean
  /** 기본값 */
  defaultValue?: unknown
  /** 플레이스홀더 텍스트 */
  placeholder?: string
  /** 도움말 텍스트 */
  helpText?: string
  /** 그룹 내 정렬 순서 (낮을수록 위) */
  order?: number

  // ============================================
  // 타입별 속성
  // ============================================

  /** select 타입용 옵션 */
  options?: { value: string; label: string }[]
  /** image 타입용 종횡비 */
  aspectRatio?: string
  /** text/textarea 최대 길이 */
  maxLength?: number
  /** textarea 행 수 */
  rows?: number
  /** number 최소값 */
  min?: number
  /** number 최대값 */
  max?: number
  /** images/repeater 최대 항목 수 */
  maxItems?: number
  /** repeater 최소 항목 수 */
  minItems?: number
  /** repeater 하위 필드 */
  fields?: VariableDeclaration[]
  /** repeater 항목 라벨 */
  itemLabel?: string
}

// ============================================
// Variables Schema (AI 출력용)
// ============================================

export interface VariablesSchema {
  declarations: VariableDeclaration[]
}

// ============================================
// Variable Type to Editor Field Type Mapping
// ============================================

export const VARIABLE_TYPE_TO_FIELD_TYPE: Record<VariableType, FieldType> = {
  text: 'text',
  textarea: 'textarea',
  image: 'image',
  images: 'imageList',
  date: 'date',
  time: 'time',
  datetime: 'datetime',
  number: 'number',
  select: 'select',
  phone: 'phone',
  url: 'url',
  location: 'location',
  account: 'account',
  repeater: 'repeater',
}

// ============================================
// Standard Variable Paths
// AI가 선언하지 않아도 자동 인식되는 표준 변수
// ============================================

export const STANDARD_VARIABLE_PATHS: Record<string, Partial<VariableDeclaration>> = {
  // Intro
  'intro.message': {
    type: 'text',
    label: '인트로 문구',
    required: false,
    placeholder: '저희 두 사람이 사랑으로 하나가 됩니다',
    helpText: '인트로 화면에 표시되는 짧은 문구입니다',
  },

  // Couple - Groom
  'couple.groom.name': {
    type: 'text',
    label: '신랑 이름',
    required: true,
    placeholder: '홍길동',
  },
  'couple.groom.phone': {
    type: 'phone',
    label: '신랑 연락처',
    required: false,
  },

  // Couple - Bride
  'couple.bride.name': {
    type: 'text',
    label: '신부 이름',
    required: true,
    placeholder: '김영희',
  },
  'couple.bride.phone': {
    type: 'phone',
    label: '신부 연락처',
    required: false,
  },

  // Wedding
  'wedding.date': {
    type: 'date',
    label: '예식 날짜',
    required: true,
    defaultValue: '2025-03-15',
    order: 1,
  },
  'wedding.time': {
    type: 'time',
    label: '예식 시간',
    required: true,
    defaultValue: '14:00',
    order: 2,
  },
  // 화면 표시용 날짜/시간 (파생 필드 - wedding.date/time에서 자동 계산)
  'wedding.dateDisplay': {
    type: 'text',
    label: '예식 날짜 표시',
    required: false,
    description: '__HIDDEN__', // 자동 계산
  },
  'wedding.timeDisplay': {
    type: 'text',
    label: '예식 시간 표시',
    required: false,
    description: '__HIDDEN__', // 자동 계산
  },
  'wedding.dateEn': {
    type: 'text',
    label: '예식 날짜 (영문)',
    required: false,
    description: '__HIDDEN__', // 자동 계산
  },
  'wedding.timeEn': {
    type: 'text',
    label: '예식 시간 (영문)',
    required: false,
    description: '__HIDDEN__', // 자동 계산
  },
  'wedding.dday': {
    type: 'number',
    label: 'D-Day',
    required: false,
    description: '__HIDDEN__', // 자동 계산
  },
  // Calendar variant용 파생 필드 (wedding.date에서 자동 계산)
  'wedding.month': {
    type: 'text',
    label: '예식 월',
    required: false,
    description: '__HIDDEN__',
  },
  'wedding.day': {
    type: 'text',
    label: '예식 일',
    required: false,
    description: '__HIDDEN__',
  },
  'wedding.weekday': {
    type: 'text',
    label: '예식 요일',
    required: false,
    description: '__HIDDEN__',
  },

  // Countdown (자동 계산값 - 에디터에서 숨김)
  'countdown.days': {
    type: 'number',
    label: 'D-Day',
    required: false,
    description: '__HIDDEN__',
  },
  'countdown.hours': {
    type: 'number',
    label: '시간',
    required: false,
    description: '__HIDDEN__',
  },
  'countdown.minutes': {
    type: 'number',
    label: '분',
    required: false,
    description: '__HIDDEN__',
  },
  'countdown.seconds': {
    type: 'number',
    label: '초',
    required: false,
    description: '__HIDDEN__',
  },

  // Venue
  venue: {
    type: 'location',
    label: '주소',
    required: true,
    helpText: '주소 검색 버튼을 클릭하여 주소를 입력하세요',
  },
  'venue.name': {
    type: 'text',
    label: '예식장 이름',
    required: true,
    placeholder: '그랜드 웨딩홀',
    defaultValue: '그랜드 웨딩홀',
  },
  'venue.hall': {
    type: 'text',
    label: '홀 이름',
    required: false,
    placeholder: '3층 그랜드볼룸',
    defaultValue: '3층 그랜드볼룸',
  },
  'venue.address': {
    type: 'text',
    label: '주소',
    required: false,
    description: '__HIDDEN__', // LocationField(venue)에서 자동 채움
  },
  'venue.tel': {
    type: 'phone',
    label: '전화번호',
    required: false,
    placeholder: '02-1234-5678',
  },
  'venue.naverUrl': {
    type: 'url',
    label: '네이버 지도 URL',
    required: false,
    placeholder: 'https://naver.me/...',
    helpText: '네이버 지도에서 공유 링크를 복사해주세요',
  },
  'venue.kakaoUrl': {
    type: 'url',
    label: '카카오맵 URL',
    required: false,
    placeholder: 'https://kko.to/...',
    helpText: '카카오맵에서 공유 링크를 복사해주세요',
  },
  'venue.tmapUrl': {
    type: 'url',
    label: 'T맵 URL',
    required: false,
    placeholder: 'https://tmap.life/...',
    helpText: 'T맵에서 공유 링크를 복사해주세요',
  },
  'venue.location': {
    type: 'location',
    label: '예식장 위치',
    required: false,
    helpText: '지도에서 예식장 위치를 선택하세요 (위도/경도 자동 설정)',
  },

  // Venue - Coordinates (Hidden - 주소 검색으로 자동 설정됨)
  'venue.lat': {
    type: 'number',
    label: '위도',
    required: false,
    description: '__HIDDEN__', // 에디터에서 숨김 처리
  },
  'venue.lng': {
    type: 'number',
    label: '경도',
    required: false,
    description: '__HIDDEN__', // 에디터에서 숨김 처리
  },

  // Venue - Transportation
  'venue.transportation.bus': {
    type: 'textarea',
    label: '버스',
    required: false,
    rows: 2,
    placeholder: '146, 341, 360번 예식장 앞 하차',
  },
  'venue.transportation.subway': {
    type: 'textarea',
    label: '지하철',
    required: false,
    rows: 2,
    placeholder: '2호선 강남역 3번 출구 도보 5분',
  },
  'venue.transportation.shuttle': {
    type: 'textarea',
    label: '셔틀버스',
    required: false,
    rows: 2,
    placeholder: '강남역 3번 출구 앞 10분 간격 운행',
  },
  'venue.transportation.parking': {
    type: 'textarea',
    label: '주차 안내',
    required: false,
    rows: 2,
    placeholder: '건물 지하 1~3층 무료 주차 (3시간)',
  },

  // Photos
  'photos.main': {
    type: 'image',
    label: '대표 사진',
    required: false,
    aspectRatio: '3:4',
    helpText: '인트로 화면에 표시되는 메인 사진입니다',
  },
  'photos.gallery': {
    type: 'images',
    label: '갤러리 사진',
    required: false,
    maxItems: 40,
    helpText: '최대 40장까지 업로드 가능합니다',
  },

  // Gallery Settings
  'gallery.effect': {
    type: 'select',
    label: '갤러리 효과',
    required: false,
    defaultValue: 'slide',
    options: [
      { value: 'slide', label: '슬라이드' },
      { value: 'fade', label: '페이드' },
      { value: 'coverflow', label: '커버플로우' },
      { value: 'cards', label: '카드 스택' },
      { value: 'cube', label: '큐브' },
    ],
    helpText: '캐러셀 갤러리의 전환 효과',
  },

  // Greeting
  'greeting.title': {
    type: 'text',
    label: '인사말 제목',
    required: false,
    placeholder: '저희 결혼합니다',
  },
  'greeting.content': {
    type: 'textarea',
    label: '인사말',
    required: false,
    rows: 5,
    placeholder:
      '서로를 향한 마음을 모아\n평생을 함께하고자 합니다.\n\n귀한 걸음 하시어\n저희의 새 출발을 축복해 주시면\n더없는 기쁨이 되겠습니다.',
  },

  // Parents - Deceased Icon (order: 0 = 제일 위)
  'parents.deceasedIcon': {
    type: 'select',
    label: '고인 표시',
    required: false,
    defaultValue: '故',
    options: [
      { value: '고', label: '고 (한글)' },
      { value: '故', label: '故 (한문)' },
      { value: '✿', label: '✿ (백합 꽃)' },
    ],
    helpText: '고인을 나타내는 표시 방식을 선택하세요',
    order: 0,
  },

  // Parents - Groom
  'parents.groom.father.name': {
    type: 'text',
    label: '신랑 아버지',
    required: false,
    placeholder: '홍판서',
  },
  'parents.groom.father.status': {
    type: 'select',
    label: '신랑 아버지 표기',
    required: false,
    options: [
      { value: '', label: '표기 없음' },
      { value: 'deceased', label: '故' },
    ],
  },
  'parents.groom.father.baptismalName': {
    type: 'text',
    label: '신랑 아버지 세례명',
    required: false,
    placeholder: '베드로',
    helpText: '천주교 결혼식인 경우 입력하세요',
  },
  'parents.groom.father.phone': {
    type: 'phone',
    label: '신랑 아버지 연락처',
    required: false,
  },
  'parents.groom.mother.name': {
    type: 'text',
    label: '신랑 어머니',
    required: false,
    placeholder: '이순신',
  },
  'parents.groom.mother.status': {
    type: 'select',
    label: '신랑 어머니 표기',
    required: false,
    options: [
      { value: '', label: '표기 없음' },
      { value: 'deceased', label: '故' },
    ],
  },
  'parents.groom.mother.baptismalName': {
    type: 'text',
    label: '신랑 어머니 세례명',
    required: false,
    placeholder: '마리아',
    helpText: '천주교 결혼식인 경우 입력하세요',
  },
  'parents.groom.mother.phone': {
    type: 'phone',
    label: '신랑 어머니 연락처',
    required: false,
  },

  // Parents - Bride
  'parents.bride.father.name': {
    type: 'text',
    label: '신부 아버지',
    required: false,
    placeholder: '김철수',
  },
  'parents.bride.father.status': {
    type: 'select',
    label: '신부 아버지 표기',
    required: false,
    options: [
      { value: '', label: '표기 없음' },
      { value: 'deceased', label: '故' },
    ],
  },
  'parents.bride.father.baptismalName': {
    type: 'text',
    label: '신부 아버지 세례명',
    required: false,
    placeholder: '요셉',
    helpText: '천주교 결혼식인 경우 입력하세요',
  },
  'parents.bride.father.phone': {
    type: 'phone',
    label: '신부 아버지 연락처',
    required: false,
  },
  'parents.bride.mother.name': {
    type: 'text',
    label: '신부 어머니',
    required: false,
    placeholder: '박영숙',
  },
  'parents.bride.mother.status': {
    type: 'select',
    label: '신부 어머니 표기',
    required: false,
    options: [
      { value: '', label: '표기 없음' },
      { value: 'deceased', label: '故' },
    ],
  },
  'parents.bride.mother.baptismalName': {
    type: 'text',
    label: '신부 어머니 세례명',
    required: false,
    placeholder: '안나',
    helpText: '천주교 결혼식인 경우 입력하세요',
  },
  'parents.bride.mother.phone': {
    type: 'phone',
    label: '신부 어머니 연락처',
    required: false,
  },

  // Contact - Show Parents Toggle
  'contact.showParents': {
    type: 'select',
    label: '혼주 연락처 표시',
    required: false,
    defaultValue: 'false',
    options: [
      { value: 'false', label: '표시 안 함' },
      { value: 'true', label: '표시' },
    ],
    helpText: '연락처 섹션에 혼주 연락처를 함께 표시합니다',
  },

  // Accounts
  'accounts.groom': {
    type: 'repeater',
    label: '신랑측 계좌',
    required: false,
    minItems: 0,
    maxItems: 3,
    itemLabel: '계좌',
    helpText: '최대 3개까지 추가 가능 (본인, 아버지, 어머니)',
    fields: [
      {
        id: 'relation',
        path: 'relation',
        type: 'select',
        label: '관계',
        required: true,
        options: [
          { value: 'self', label: '본인' },
          { value: 'father', label: '아버지' },
          { value: 'mother', label: '어머니' },
        ],
      },
      {
        id: 'bank',
        path: 'bank',
        type: 'text',
        label: '은행',
        required: true,
        placeholder: '국민은행',
      },
      {
        id: 'number',
        path: 'number',
        type: 'text',
        label: '계좌번호',
        required: true,
        placeholder: '123-456-789012',
      },
      {
        id: 'holder',
        path: 'holder',
        type: 'text',
        label: '예금주',
        required: true,
        placeholder: '홍길동',
      },
    ],
  },
  'accounts.bride': {
    type: 'repeater',
    label: '신부측 계좌',
    required: false,
    minItems: 0,
    maxItems: 3,
    itemLabel: '계좌',
    helpText: '최대 3개까지 추가 가능 (본인, 아버지, 어머니)',
    fields: [
      {
        id: 'relation',
        path: 'relation',
        type: 'select',
        label: '관계',
        required: true,
        options: [
          { value: 'self', label: '본인' },
          { value: 'father', label: '아버지' },
          { value: 'mother', label: '어머니' },
        ],
      },
      {
        id: 'bank',
        path: 'bank',
        type: 'text',
        label: '은행',
        required: true,
        placeholder: '국민은행',
      },
      {
        id: 'number',
        path: 'number',
        type: 'text',
        label: '계좌번호',
        required: true,
        placeholder: '123-456-789012',
      },
      {
        id: 'holder',
        path: 'holder',
        type: 'text',
        label: '예금주',
        required: true,
        placeholder: '김영희',
      },
    ],
  },

  // Accounts - KakaoPay
  'accounts.kakaopay.groom': {
    type: 'text',
    label: '신랑측 카카오페이 계좌',
    required: false,
    placeholder: '3333-01-1234567',
    helpText: '카카오페이 송금용 계좌번호',
  },
  'accounts.kakaopay.bride': {
    type: 'text',
    label: '신부측 카카오페이 계좌',
    required: false,
    placeholder: '3333-01-7654321',
    helpText: '카카오페이 송금용 계좌번호',
  },

  // Guestbook (DB에서 가져오는 데이터 - 에디터에서 숨김)
  'guestbook.messages': {
    type: 'text',
    label: '방명록 메시지',
    required: false,
    description: '__HIDDEN__', // DB에서 조회, 에디터 입력 불필요
  },

  // RSVP (참석여부)
  'rsvp.title': {
    type: 'text',
    label: 'RSVP 제목',
    required: false,
    defaultValue: '참석 여부를 알려주세요',
    placeholder: '참석 여부를 알려주세요',
  },
  'rsvp.description': {
    type: 'textarea',
    label: 'RSVP 안내 문구',
    required: false,
    rows: 3,
    placeholder: '참석 여부를 미리 알려주시면 준비에 큰 도움이 됩니다.',
  },
  'rsvp.showGuestCount': {
    type: 'select',
    label: '동행인 수 입력',
    required: false,
    defaultValue: 'true',
    options: [
      { value: 'true', label: '받기' },
      { value: 'false', label: '받지 않기' },
    ],
  },
  'rsvp.showMeal': {
    type: 'select',
    label: '식사 여부 입력',
    required: false,
    defaultValue: 'false',
    options: [
      { value: 'true', label: '받기' },
      { value: 'false', label: '받지 않기' },
    ],
  },
  'rsvp.showMessage': {
    type: 'select',
    label: '메시지 입력란',
    required: false,
    defaultValue: 'true',
    options: [
      { value: 'true', label: '표시' },
      { value: 'false', label: '숨기기' },
    ],
  },
  'rsvp.deadline': {
    type: 'date',
    label: 'RSVP 마감일',
    required: false,
    helpText: '마감일 이후에는 참석 여부를 받지 않습니다',
  },

  // Notice (공지사항)
  'notice.items': {
    type: 'repeater',
    label: '공지사항',
    required: false,
    minItems: 0,
    maxItems: 10,
    itemLabel: '공지',
    helpText: '셔틀버스, 주차, 식사 등 안내사항을 추가하세요',
    fields: [
      {
        id: 'icon',
        path: 'icon',
        type: 'select',
        label: '아이콘',
        required: false,
        options: [
          { value: 'info', label: '정보 (i)' },
          { value: 'bus', label: '버스' },
          { value: 'car', label: '자동차/주차' },
          { value: 'utensils', label: '식사' },
          { value: 'gift', label: '선물/화환' },
          { value: 'clock', label: '시간' },
        ],
      },
      {
        id: 'title',
        path: 'title',
        type: 'text',
        label: '제목',
        required: true,
        placeholder: '셔틀버스 안내',
      },
      {
        id: 'content',
        path: 'content',
        type: 'textarea',
        label: '내용',
        required: true,
        rows: 3,
        placeholder: '강남역 3번 출구에서 10분 간격으로 운행합니다.',
      },
    ],
  },

  // BGM
  'bgm.trackId': {
    type: 'select',
    label: 'BGM 선택',
    required: false,
    options: [
      { value: 'romantic-piano-01', label: '로맨틱 피아노 1' },
      { value: 'romantic-piano-02', label: '로맨틱 피아노 2' },
      { value: 'elegant-orchestra-01', label: '우아한 오케스트라' },
      { value: 'playful-acoustic-01', label: '경쾌한 어쿠스틱' },
      { value: 'emotional-ballad-01', label: '감동적인 발라드' },
      { value: 'classical-canon', label: '클래식 - 캐논' },
    ],
    helpText: '청첩장 배경음악을 선택하세요',
  },
  'bgm.title': {
    type: 'text',
    label: '곡 제목',
    required: false,
    placeholder: '곡 제목',
    helpText: '선택한 프리셋의 제목을 직접 수정할 수 있습니다',
  },
  'bgm.artist': {
    type: 'text',
    label: '아티스트',
    required: false,
    placeholder: '아티스트명',
  },
}

// ============================================
// Section Grouping Metadata
// ============================================

export interface SectionGroupMeta {
  id: string
  title: string
  icon: string
  order: number
}

export const SECTION_GROUP_META: Record<string, SectionGroupMeta> = {
  intro: { id: 'intro', title: '인트로', icon: 'sparkles', order: 0 },
  couple: { id: 'couple', title: '신랑/신부 정보', icon: 'heart', order: 1 },
  wedding: { id: 'wedding', title: '예식 정보', icon: 'calendar', order: 2 },
  venue: { id: 'venue', title: '예식장 정보', icon: 'map-pin', order: 3 },
  photos: { id: 'photos', title: '사진', icon: 'image', order: 5 },
  greeting: { id: 'greeting', title: '인사말', icon: 'message-square', order: 7 },
  parents: { id: 'parents', title: '혼주 정보', icon: 'users', order: 8 },
  contact: { id: 'contact', title: '연락처', icon: 'phone', order: 8.5 },
  accounts: { id: 'accounts', title: '축의금 계좌', icon: 'credit-card', order: 9 },
  rsvp: { id: 'rsvp', title: '참석 여부', icon: 'check-circle', order: 9.5 },
  notice: { id: 'notice', title: '공지사항', icon: 'bell', order: 9.7 },
  guestbook: { id: 'guestbook', title: '방명록', icon: 'book-open', order: 9.8 },
  bgm: { id: 'bgm', title: '배경음악', icon: 'music', order: 10 },
  custom: { id: 'custom', title: '추가 설정', icon: 'settings', order: 100 },
}

// ============================================
// Utility Functions
// ============================================

/**
 * 표준 변수 경로인지 확인
 */
export function isStandardVariable(path: string): boolean {
  return path in STANDARD_VARIABLE_PATHS
}

/**
 * 경로에서 섹션 그룹 ID 추출 (첫 번째 세그먼트)
 */
export function getSectionGroupId(path: string): string {
  return path.split('.')[0]
}

/**
 * 경로에서 섹션 그룹 메타데이터 가져오기
 */
export function getSectionGroupMeta(path: string): SectionGroupMeta {
  const groupId = getSectionGroupId(path)
  return SECTION_GROUP_META[groupId] || SECTION_GROUP_META.custom
}
