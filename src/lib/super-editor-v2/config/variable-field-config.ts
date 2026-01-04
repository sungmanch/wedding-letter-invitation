/**
 * Variable Field Configuration
 *
 * 편집기 필드 설정 및 변수 매핑 상수
 * - 필드 타입, 라벨, placeholder 정의
 * - 숨김 필드 및 파생 필드 매핑
 */

import type { VariablePath, BlockType } from '../schema/types'

// ============================================
// Types
// ============================================

export interface FieldConfig {
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'date'
    | 'time'
    | 'phone'
    | 'image'
    | 'gallery'
    | 'location'
    | 'notice-items'
    | 'string-list'
    | 'checkbox'
    | 'bgm-selector'
  placeholder?: string
}

// ============================================
// Computed Field Mapping
// ============================================

/**
 * Computed field → Source field 매핑
 * 자동 계산 필드를 편집하면 실제로 소스 필드를 수정해야 함
 */
export const COMPUTED_TO_SOURCE: Record<string, VariablePath> = {
  'wedding.timeDisplay': 'wedding.time',
  'wedding.dateDisplay': 'wedding.date',
}

/**
 * 바인딩 경로가 computed field면 source field로 변환
 */
export function getEditableBinding(binding: VariablePath): VariablePath {
  return (COMPUTED_TO_SOURCE[binding] as VariablePath) || binding
}

// ============================================
// Hidden Variable Paths
// ============================================

/**
 * 자동 계산되는 필드 (편집기에서 숨김)
 */
export const HIDDEN_VARIABLE_PATHS: Set<string> = new Set([
  // 날짜/시간 파생 필드
  'wedding.dateDisplay',
  'wedding.timeDisplay',
  'wedding.dday',
  'wedding.month',
  'wedding.day',
  'wedding.weekday',
  'wedding.dateDot',
  'wedding.dateMonthDay',
  'wedding.year',
  // 캘린더 파생 필드 (전후 요일/일)
  'wedding.weekdayMinus2',
  'wedding.weekdayMinus1',
  'wedding.weekdayPlus1',
  'wedding.weekdayPlus2',
  'wedding.dayMinus2',
  'wedding.dayMinus1',
  'wedding.dayPlus1',
  'wedding.dayPlus2',
  // 카운트다운 (실시간 계산)
  'countdown.days',
  'countdown.hours',
  'countdown.minutes',
  'countdown.seconds',
  // 복합 객체 필드 (JSON 형태로 표시되므로 숨김)
  'venue',
  // 자동 생성 필드 (지도 검색 시 자동 생성됨)
  'venue.naverUrl',
  'venue.kakaoUrl',
  'venue.tmapUrl',
  'venue.lat',
  'venue.lng',
  // 불필요한 필드
  'custom.navGuide',
])

/**
 * 자동 계산 필드 → 입력 필드 매핑 (표시용 바인딩 대신 입력용 바인딩 표시)
 */
export const DERIVED_TO_INPUT_MAP: Record<string, VariablePath> = {
  'wedding.dateDisplay': 'wedding.date',
  'wedding.timeDisplay': 'wedding.time',
  'wedding.dday': 'wedding.date',
  'wedding.month': 'wedding.date',
  'wedding.day': 'wedding.date',
  'wedding.weekday': 'wedding.date',
  'wedding.dateDot': 'wedding.date',
  'wedding.dateMonthDay': 'wedding.date',
  'wedding.year': 'wedding.date',
  // 캘린더 전후 요일/일
  'wedding.weekdayMinus2': 'wedding.date',
  'wedding.weekdayMinus1': 'wedding.date',
  'wedding.weekdayPlus1': 'wedding.date',
  'wedding.weekdayPlus2': 'wedding.date',
  'wedding.dayMinus2': 'wedding.date',
  'wedding.dayMinus1': 'wedding.date',
  'wedding.dayPlus1': 'wedding.date',
  'wedding.dayPlus2': 'wedding.date',
  // 카운트다운
  'countdown.days': 'wedding.date',
  'countdown.hours': 'wedding.date',
  'countdown.minutes': 'wedding.date',
  'countdown.seconds': 'wedding.date',
}

// ============================================
// Variable Field Configuration
// ============================================

export const VARIABLE_FIELD_CONFIG: Partial<Record<VariablePath, FieldConfig>> = {
  // 커플 정보 (신규)
  'couple.groom.name': { label: '신랑 이름', type: 'text', placeholder: '홍길동' },
  'couple.groom.phone': { label: '신랑 연락처', type: 'phone' },
  'couple.groom.baptismalName': { label: '신랑 세례명', type: 'text', placeholder: '미카엘' },
  'couple.groom.photo': { label: '신랑 사진', type: 'image' },
  'couple.groom.birthDate': { label: '신랑 생일', type: 'date' },
  'couple.groom.intro': { label: '신랑 직업', type: 'text', placeholder: '소프트웨어 엔지니어' },
  'couple.groom.mbti': { label: '신랑 MBTI', type: 'text', placeholder: 'ISTP' },
  'couple.groom.tags': { label: '신랑 태그', type: 'string-list', placeholder: '캠핑' },
  'couple.bride.name': { label: '신부 이름', type: 'text', placeholder: '김영희' },
  'couple.bride.phone': { label: '신부 연락처', type: 'phone' },
  'couple.bride.baptismalName': { label: '신부 세례명', type: 'text', placeholder: '마리아' },
  'couple.bride.photo': { label: '신부 사진', type: 'image' },
  'couple.bride.birthDate': { label: '신부 생일', type: 'date' },
  'couple.bride.intro': { label: '신부 직업', type: 'text', placeholder: '그래픽 디자이너' },
  'couple.bride.mbti': { label: '신부 MBTI', type: 'text', placeholder: 'ENFP' },
  'couple.bride.tags': { label: '신부 태그', type: 'string-list', placeholder: '러닝' },

  // 혼주 정보 (신규)
  'parents.groom.birthOrder': { label: '신랑 서열', type: 'text', placeholder: '장남' },
  'parents.groom.father.name': { label: '신랑 아버지 성함', type: 'text' },
  'parents.groom.father.phone': { label: '신랑 아버지 연락처', type: 'phone' },
  'parents.groom.father.baptismalName': { label: '신랑 아버지 세례명', type: 'text' },
  'parents.groom.mother.name': { label: '신랑 어머니 성함', type: 'text' },
  'parents.groom.mother.phone': { label: '신랑 어머니 연락처', type: 'phone' },
  'parents.groom.mother.baptismalName': { label: '신랑 어머니 세례명', type: 'text' },
  'parents.bride.birthOrder': { label: '신부 서열', type: 'text', placeholder: '차녀' },
  'parents.bride.father.name': { label: '신부 아버지 성함', type: 'text' },
  'parents.bride.father.phone': { label: '신부 아버지 연락처', type: 'phone' },
  'parents.bride.father.baptismalName': { label: '신부 아버지 세례명', type: 'text' },
  'parents.bride.mother.name': { label: '신부 어머니 성함', type: 'text' },
  'parents.bride.mother.phone': { label: '신부 어머니 연락처', type: 'phone' },
  'parents.bride.mother.baptismalName': { label: '신부 어머니 세례명', type: 'text' },

  // 신랑 정보 (레거시)
  'groom.name': { label: '신랑 이름', type: 'text', placeholder: '홍길동' },
  'groom.nameEn': { label: '신랑 영문 이름', type: 'text', placeholder: 'Gildong' },
  'groom.phone': { label: '신랑 연락처', type: 'phone' },
  'groom.fatherName': { label: '신랑 아버지 성함', type: 'text' },
  'groom.motherName': { label: '신랑 어머니 성함', type: 'text' },
  'groom.fatherPhone': { label: '신랑 아버지 연락처', type: 'phone' },
  'groom.motherPhone': { label: '신랑 어머니 연락처', type: 'phone' },

  // 신부 정보 (레거시)
  'bride.name': { label: '신부 이름', type: 'text', placeholder: '김영희' },
  'bride.nameEn': { label: '신부 영문 이름', type: 'text', placeholder: 'Younghee' },
  'bride.phone': { label: '신부 연락처', type: 'phone' },
  'bride.fatherName': { label: '신부 아버지 성함', type: 'text' },
  'bride.motherName': { label: '신부 어머니 성함', type: 'text' },
  'bride.fatherPhone': { label: '신부 아버지 연락처', type: 'phone' },
  'bride.motherPhone': { label: '신부 어머니 연락처', type: 'phone' },

  // 예식 정보
  'wedding.date': { label: '예식 날짜', type: 'date' },
  'wedding.time': { label: '예식 시간', type: 'time' },
  'wedding.timeDisplay': { label: '예식 시간', type: 'time' },

  // 예식장 정보
  'venue.name': { label: '예식장 이름', type: 'text', placeholder: '○○웨딩홀' },
  'venue.hall': { label: '홀 이름', type: 'text', placeholder: '그랜드홀' },
  'venue.floor': { label: '층', type: 'text', placeholder: '5층' },
  'venue.address': { label: '주소', type: 'location' },
  'venue.addressDetail': { label: '상세 주소', type: 'text' },
  'venue.phone': { label: '예식장 연락처', type: 'phone' },
  'venue.parkingInfo': { label: '주차 안내', type: 'textarea' },
  'venue.transportInfo': { label: '교통 안내', type: 'textarea' },

  // 교통 정보 (리스트)
  'venue.transportation.subway': {
    label: '지하철',
    type: 'string-list',
    placeholder: '2호선 삼성역 5번출구 10분 거리',
  },
  'venue.transportation.bus': {
    label: '버스',
    type: 'string-list',
    placeholder: '삼성역 5번출구 앞 정류장',
  },
  'venue.transportation.shuttle': {
    label: '셔틀버스',
    type: 'string-list',
    placeholder: '삼성역 5번출구 앞 (10시부터 20분 간격)',
  },
  'venue.transportation.parking': {
    label: '주차',
    type: 'string-list',
    placeholder: '지하 1~3층 주차장 이용',
  },
  'venue.transportation.etc': {
    label: '전세 버스',
    type: 'string-list',
    placeholder: '출발 일시: 3월 22일 오전 9시',
  },

  // 사진
  'photos.main': { label: '메인 사진', type: 'image' },
  'photos.gallery': { label: '갤러리 사진', type: 'gallery' },

  // 엔딩
  'ending.photo': { label: '엔딩 사진', type: 'image' },

  // 인사말
  'greeting.title': { label: '인사말 제목', type: 'text' },
  'greeting.content': { label: '인사말 내용', type: 'textarea', placeholder: '저희 두 사람이...' },

  // 공지사항
  'notice.sectionTitle': { label: '섹션 제목', type: 'text', placeholder: 'NOTICE' },
  'notice.title': { label: '공지 제목', type: 'text', placeholder: '포토부스 안내' },
  'notice.description': {
    label: '공지 설명',
    type: 'textarea',
    placeholder: '저희 두 사람의 결혼식을\n기억하실 수 있도록...',
  },
  'notice.items': { label: '공지 항목', type: 'notice-items' },

  // 음악
  'music.url': { label: '배경음악', type: 'bgm-selector' },
  'music.autoPlay': { label: '자동 재생', type: 'checkbox' },

  // RSVP
  'rsvp.title': { label: 'RSVP 제목', type: 'text' },
  'rsvp.titleEn': { label: 'RSVP 영문 제목', type: 'text', placeholder: 'RSVP' },
  'rsvp.description': { label: 'RSVP 설명', type: 'textarea' },
  'rsvp.deadline': { label: 'RSVP 마감일', type: 'date' },

  // 커플 정보 확장
  'couple.groom.nameEn': { label: '신랑 영문 이름', type: 'text', placeholder: 'Minjun' },
  'couple.groom.job': { label: '신랑 직업', type: 'text', placeholder: '소프트웨어 엔지니어' },
  'couple.bride.nameEn': { label: '신부 영문 이름', type: 'text', placeholder: 'Seoyeon' },
  'couple.bride.job': { label: '신부 직업', type: 'text', placeholder: 'UX 디자이너' },
  'couple.photo': { label: '커플 사진', type: 'image' },
  'couple.photos': { label: '커플 사진들', type: 'gallery' },

  // 계좌 섹션
  'accounts.title': { label: '축의금 제목', type: 'text', placeholder: '마음 전하실 곳' },
  'accounts.titleEn': { label: '축의금 영문 제목', type: 'text', placeholder: 'GIFT' },
  'accounts.description': { label: '축의금 안내', type: 'textarea', placeholder: '축하의 마음을 전해 주시면...' },

  // 예식장 정보 확장
  'venue.tel': { label: '예식장 전화번호', type: 'phone' },

  // 오시는길 섹션
  'location.title': { label: '오시는길 제목', type: 'text', placeholder: '오시는길' },
  'location.titleEn': { label: '오시는길 영문 제목', type: 'text', placeholder: 'LOCATION' },

  // 인트로/엔딩
  'intro.message': { label: '인트로 메시지', type: 'textarea' },
  'ending.message': { label: '엔딩 메시지', type: 'textarea' },

  // 연락처 설정
  'contact.showParents': { label: '혼주 연락처 표시', type: 'checkbox' },

  // 갤러리
  'gallery.effect': { label: '갤러리 효과', type: 'text' },

  // 방명록
  'guestbook.title': { label: '방명록 제목', type: 'text' },
  'guestbook.placeholder': { label: '방명록 안내문', type: 'text' },

  // BGM
  'bgm.trackId': { label: 'BGM 트랙', type: 'bgm-selector' },
  'bgm.title': { label: 'BGM 제목', type: 'text' },
  'bgm.artist': { label: 'BGM 아티스트', type: 'text' },

  // 영상
  'video.type': { label: '영상 타입', type: 'text' },
  'video.url': { label: '영상 URL', type: 'text' },
  'video.title': { label: '영상 제목', type: 'text' },

  // 인터뷰
  'interview.title': { label: '인터뷰 제목', type: 'text' },
  'interview.subtitle': { label: '인터뷰 부제', type: 'text' },
  'interview.items': { label: '인터뷰 항목', type: 'notice-items' },

  // 타임라인
  'timeline.title': { label: '타임라인 제목', type: 'text' },
  'timeline.subtitle': { label: '타임라인 부제', type: 'text' },
  'timeline.items': { label: '타임라인 항목', type: 'notice-items' },

  // 혼주 상태
  'parents.deceasedIcon': { label: '별세 표시 아이콘', type: 'text' },
  'parents.groom.father.status': { label: '신랑 아버지 상태', type: 'text' },
  'parents.groom.mother.status': { label: '신랑 어머니 상태', type: 'text' },
  'parents.bride.father.status': { label: '신부 아버지 상태', type: 'text' },
  'parents.bride.mother.status': { label: '신부 어머니 상태', type: 'text' },

  // 카카오페이
  'accounts.kakaopay.groom': { label: '신랑측 카카오페이', type: 'text' },
  'accounts.kakaopay.bride': { label: '신부측 카카오페이', type: 'text' },

  // 엔딩 인용문 (custom.* - 프리셋 특화 필드)
  'custom.quoteText': { label: '인용문', type: 'textarea', placeholder: '"우리는 매일 시간을 여행한다..."' },
  'custom.quoteSource': { label: '인용문 출처', type: 'text', placeholder: '- 영화 「어바웃 타임」 중' },
}

// ============================================
// Block Type Icons
// ============================================

export const BLOCK_TYPE_ICONS: Record<BlockType, string> = {
  hero: '🖼️',
  'greeting-parents': '💌',
  profile: '👤',
  calendar: '📅',
  gallery: '🎨',
  rsvp: '✅',
  location: '📍',
  notice: '📢',
  account: '💳',
  message: '💬',
  wreath: '💐',
  ending: '🎬',
  contact: '📞',
  music: '🎵',
  loading: '⏳',
  custom: '🔧',
  interview: '🎤',
}

// ============================================
// Shared Field Paths (공유 데이터 - DataTab 상단 고정)
// ============================================

/**
 * 공유 필드 경로 (DataTab 상단에 별도 섹션으로 표시되는 필드들)
 * 블록별 데이터 섹션에서는 제외됨
 */
export const SHARED_FIELD_PATHS: Set<string> = new Set([
  // 신랑/신부 정보
  'couple.groom.name',
  'couple.groom.nameEn',
  'couple.groom.phone',
  'couple.groom.baptismalName',
  'couple.bride.name',
  'couple.bride.nameEn',
  'couple.bride.phone',
  'couple.bride.baptismalName',
  // 혼주 정보
  'parents.groom.birthOrder',
  'parents.bride.birthOrder',
  'parents.groom.father.name',
  'parents.groom.father.phone',
  'parents.groom.father.baptismalName',
  'parents.groom.father.status',
  'parents.groom.mother.name',
  'parents.groom.mother.phone',
  'parents.groom.mother.baptismalName',
  'parents.groom.mother.status',
  'parents.bride.father.name',
  'parents.bride.father.phone',
  'parents.bride.father.baptismalName',
  'parents.bride.father.status',
  'parents.bride.mother.name',
  'parents.bride.mother.phone',
  'parents.bride.mother.baptismalName',
  'parents.bride.mother.status',
  // 예식 정보
  'wedding.date',
  'wedding.time',
  // 예식장 정보
  'venue.name',
  'venue.hall',
  'venue.address',
  'venue.tel',
])

/**
 * 주어진 필드 경로가 공유 필드인지 확인
 */
export function isSharedField(path: string): boolean {
  return SHARED_FIELD_PATHS.has(path)
}
