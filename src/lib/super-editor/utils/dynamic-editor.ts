/**
 * 동적 에디터 필드 생성 (레거시)
 *
 * @deprecated
 * 이 모듈은 레거시 호환성을 위해 유지됩니다.
 * 새 코드에서는 `utils/editor-generator.ts`의 `generateEditorSectionsFromLayout`을 사용하세요.
 *
 * 마이그레이션 가이드:
 * - generateEditorSections(enabledSections) → generateEditorSectionsFromLayout({ layout })
 * - 기존: 섹션 타입 기반 정적 매핑
 * - 신규: Layout에서 변수 추출 → 자동 에디터 생성
 */

import type { EditorSection, EditorField } from '../schema/editor'
import type { SectionType } from '../skeletons/types'

// ============================================
// 필드 정의
// ============================================

const INTRO_FIELDS: EditorField[] = [
  {
    id: 'intro-message',
    type: 'text',
    label: '인트로 문구',
    dataPath: 'intro.message',
    required: false,
    order: 1,
    placeholder: '저희 두 사람이 사랑으로 하나가 됩니다',
    helpText: '인트로 화면에 표시되는 짧은 문구입니다',
  },
]

const COUPLE_FIELDS: EditorField[] = [
  {
    id: 'groom-name',
    type: 'text',
    label: '신랑 이름',
    dataPath: 'couple.groom.name',
    required: true,
    order: 1,
    placeholder: '홍길동',
  },
  {
    id: 'bride-name',
    type: 'text',
    label: '신부 이름',
    dataPath: 'couple.bride.name',
    required: true,
    order: 2,
    placeholder: '김영희',
  },
]

const WEDDING_FIELDS: EditorField[] = [
  {
    id: 'wedding-date',
    type: 'date',
    label: '예식 날짜',
    dataPath: 'wedding.date',
    required: true,
    order: 1,
  },
  {
    id: 'wedding-time',
    type: 'time',
    label: '예식 시간',
    dataPath: 'wedding.time',
    required: true,
    order: 2,
  },
]

const VENUE_FIELDS: EditorField[] = [
  {
    id: 'venue-name',
    type: 'text',
    label: '예식장 이름',
    dataPath: 'venue.name',
    required: true,
    order: 1,
    placeholder: '그랜드 웨딩홀',
  },
  {
    id: 'venue-hall',
    type: 'text',
    label: '홀 이름',
    dataPath: 'venue.hall',
    required: false,
    order: 2,
    placeholder: '3층 그랜드볼룸',
  },
  {
    id: 'venue-address',
    type: 'text',
    label: '주소',
    dataPath: 'venue.address',
    required: true,
    order: 3,
    placeholder: '서울특별시 강남구 테헤란로 123',
  },
  {
    id: 'venue-tel',
    type: 'phone',
    label: '전화번호',
    dataPath: 'venue.tel',
    required: false,
    order: 4,
    placeholder: '02-1234-5678',
  },
  {
    id: 'venue-naver-url',
    type: 'url',
    label: '네이버 지도 URL',
    dataPath: 'venue.naverUrl',
    required: false,
    order: 5,
    placeholder: 'https://naver.me/...',
    helpText: '네이버 지도에서 공유 링크를 복사해주세요',
  },
  {
    id: 'venue-kakao-url',
    type: 'url',
    label: '카카오맵 URL',
    dataPath: 'venue.kakaoUrl',
    required: false,
    order: 6,
    placeholder: 'https://kko.to/...',
    helpText: '카카오맵에서 공유 링크를 복사해주세요',
  },
  {
    id: 'venue-tmap-url',
    type: 'url',
    label: 'T맵 URL',
    dataPath: 'venue.tmapUrl',
    required: false,
    order: 7,
    placeholder: 'https://tmap.life/...',
    helpText: 'T맵에서 공유 링크를 복사해주세요',
  },
  {
    id: 'venue-location',
    type: 'location',
    label: '예식장 위치',
    dataPath: 'venue.location',
    required: false,
    order: 8,
    mapProvider: 'kakao',
    searchEnabled: true,
    helpText: '지도에서 예식장 위치를 선택하세요 (위도/경도 자동 설정)',
  },
]

const TRANSPORTATION_FIELDS: EditorField[] = [
  {
    id: 'transport-bus',
    type: 'textarea',
    label: '버스',
    dataPath: 'venue.transportation.bus',
    required: false,
    order: 1,
    rows: 2,
    placeholder: '146, 341, 360번 예식장 앞 하차',
  },
  {
    id: 'transport-subway',
    type: 'textarea',
    label: '지하철',
    dataPath: 'venue.transportation.subway',
    required: false,
    order: 2,
    rows: 2,
    placeholder: '2호선 강남역 3번 출구 도보 5분',
  },
  {
    id: 'transport-shuttle',
    type: 'textarea',
    label: '셔틀버스',
    dataPath: 'venue.transportation.shuttle',
    required: false,
    order: 3,
    rows: 2,
    placeholder: '강남역 3번 출구 앞 10분 간격 운행',
  },
  {
    id: 'transport-parking',
    type: 'textarea',
    label: '주차 안내',
    dataPath: 'venue.transportation.parking',
    required: false,
    order: 4,
    rows: 2,
    placeholder: '건물 지하 1~3층 무료 주차 (3시간)',
  },
]

const PHOTO_FIELDS: EditorField[] = [
  {
    id: 'main-photo',
    type: 'image',
    label: '대표 사진',
    dataPath: 'photos.main',
    required: false,
    order: 1,
    aspectRatio: '3:4',
    helpText: '인트로 화면에 표시되는 메인 사진입니다',
  },
]

const GALLERY_FIELDS: EditorField[] = [
  {
    id: 'gallery-photos',
    type: 'imageList',
    label: '갤러리 사진',
    dataPath: 'photos.gallery',
    required: false,
    order: 1,
    maxItems: 20,
    helpText: '최대 20장까지 업로드 가능합니다',
  },
]

const GREETING_FIELDS: EditorField[] = [
  {
    id: 'greeting-title',
    type: 'text',
    label: '인사말 제목',
    dataPath: 'greeting.title',
    required: false,
    order: 1,
    placeholder: '저희 결혼합니다',
  },
  {
    id: 'greeting-content',
    type: 'textarea',
    label: '인사말',
    dataPath: 'greeting.content',
    required: false,
    order: 2,
    rows: 5,
    placeholder: '서로를 향한 마음을 모아\n평생을 함께하고자 합니다.\n\n귀한 걸음 하시어\n저희의 새 출발을 축복해 주시면\n더없는 기쁨이 되겠습니다.',
  },
]

const PARENTS_FIELDS: EditorField[] = [
  {
    id: 'groom-father-name',
    type: 'text',
    label: '신랑 아버지',
    dataPath: 'parents.groom.father.name',
    required: false,
    order: 1,
    placeholder: '홍판서',
  },
  {
    id: 'groom-father-status',
    type: 'select',
    label: '신랑 아버지 표기',
    dataPath: 'parents.groom.father.status',
    required: false,
    order: 2,
    options: [
      { value: '', label: '표기 없음' },
      { value: 'deceased', label: '故' },
    ],
  },
  {
    id: 'groom-mother-name',
    type: 'text',
    label: '신랑 어머니',
    dataPath: 'parents.groom.mother.name',
    required: false,
    order: 3,
    placeholder: '이순신',
  },
  {
    id: 'groom-mother-status',
    type: 'select',
    label: '신랑 어머니 표기',
    dataPath: 'parents.groom.mother.status',
    required: false,
    order: 4,
    options: [
      { value: '', label: '표기 없음' },
      { value: 'deceased', label: '故' },
    ],
  },
  {
    id: 'bride-father-name',
    type: 'text',
    label: '신부 아버지',
    dataPath: 'parents.bride.father.name',
    required: false,
    order: 5,
    placeholder: '김철수',
  },
  {
    id: 'bride-father-status',
    type: 'select',
    label: '신부 아버지 표기',
    dataPath: 'parents.bride.father.status',
    required: false,
    order: 6,
    options: [
      { value: '', label: '표기 없음' },
      { value: 'deceased', label: '故' },
    ],
  },
  {
    id: 'bride-mother-name',
    type: 'text',
    label: '신부 어머니',
    dataPath: 'parents.bride.mother.name',
    required: false,
    order: 7,
    placeholder: '박영숙',
  },
  {
    id: 'bride-mother-status',
    type: 'select',
    label: '신부 어머니 표기',
    dataPath: 'parents.bride.mother.status',
    required: false,
    order: 8,
    options: [
      { value: '', label: '표기 없음' },
      { value: 'deceased', label: '故' },
    ],
  },
]

// 계좌 반복 필드를 위한 서브 필드 정의
const ACCOUNT_SUBFIELDS: EditorField[] = [
  {
    id: 'account-relation',
    type: 'select',
    label: '관계',
    dataPath: 'relation',
    required: true,
    order: 1,
    options: [
      { value: 'self', label: '본인' },
      { value: 'father', label: '아버지' },
      { value: 'mother', label: '어머니' },
    ],
  },
  {
    id: 'account-bank',
    type: 'text',
    label: '은행',
    dataPath: 'bank',
    required: true,
    order: 2,
    placeholder: '국민은행',
  },
  {
    id: 'account-number',
    type: 'text',
    label: '계좌번호',
    dataPath: 'number',
    required: true,
    order: 3,
    placeholder: '123-456-789012',
  },
  {
    id: 'account-holder',
    type: 'text',
    label: '예금주',
    dataPath: 'holder',
    required: true,
    order: 4,
    placeholder: '홍길동',
  },
]

const BGM_FIELDS: EditorField[] = [
  {
    id: 'bgm-track',
    type: 'select',
    label: 'BGM 선택',
    dataPath: 'bgm.trackId',
    required: false,
    order: 1,
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
  {
    id: 'bgm-title',
    type: 'text',
    label: '곡 제목',
    dataPath: 'bgm.title',
    required: false,
    order: 2,
    placeholder: '곡 제목',
    helpText: '선택한 프리셋의 제목을 직접 수정할 수 있습니다',
  },
  {
    id: 'bgm-artist',
    type: 'text',
    label: '아티스트',
    dataPath: 'bgm.artist',
    required: false,
    order: 3,
    placeholder: '아티스트명',
  },
]

const ACCOUNTS_FIELDS: EditorField[] = [
  {
    id: 'groom-accounts',
    type: 'repeater',
    label: '신랑측 계좌',
    dataPath: 'accounts.groom',
    required: false,
    order: 1,
    minItems: 0,
    maxItems: 3,
    itemLabel: '계좌',
    fields: ACCOUNT_SUBFIELDS,
    helpText: '최대 3개까지 추가 가능 (본인, 아버지, 어머니)',
  },
  {
    id: 'bride-accounts',
    type: 'repeater',
    label: '신부측 계좌',
    dataPath: 'accounts.bride',
    required: false,
    order: 2,
    minItems: 0,
    maxItems: 3,
    itemLabel: '계좌',
    fields: ACCOUNT_SUBFIELDS,
    helpText: '최대 3개까지 추가 가능 (본인, 아버지, 어머니)',
  },
]

// ============================================
// 섹션 정의
// ============================================

const EDITOR_SECTIONS: Record<string, EditorSection> = {
  intro: {
    id: 'intro',
    title: '인트로',
    icon: 'sparkles',
    order: 0,
    fields: INTRO_FIELDS,
  },
  couple: {
    id: 'couple',
    title: '신랑/신부 정보',
    icon: 'heart',
    order: 1,
    fields: COUPLE_FIELDS,
  },
  wedding: {
    id: 'wedding',
    title: '예식 정보',
    icon: 'calendar',
    order: 2,
    fields: WEDDING_FIELDS,
  },
  venue: {
    id: 'venue',
    title: '예식장 정보',
    icon: 'map-pin',
    order: 3,
    fields: VENUE_FIELDS,
  },
  transportation: {
    id: 'transportation',
    title: '교통 안내',
    icon: 'car',
    order: 4,
    fields: TRANSPORTATION_FIELDS,
  },
  photos: {
    id: 'photos',
    title: '대표 사진',
    icon: 'image',
    order: 5,
    fields: PHOTO_FIELDS,
  },
  gallery: {
    id: 'gallery',
    title: '갤러리',
    icon: 'images',
    order: 6,
    fields: GALLERY_FIELDS,
  },
  greeting: {
    id: 'greeting',
    title: '인사말',
    icon: 'message-square',
    order: 7,
    fields: GREETING_FIELDS,
  },
  parents: {
    id: 'parents',
    title: '혼주 정보',
    icon: 'users',
    order: 8,
    fields: PARENTS_FIELDS,
  },
  accounts: {
    id: 'accounts',
    title: '축의금 계좌',
    icon: 'credit-card',
    order: 9,
    fields: ACCOUNTS_FIELDS,
  },
  bgm: {
    id: 'bgm',
    title: '배경음악',
    icon: 'music',
    order: 10,
    fields: BGM_FIELDS,
  },
}

// 섹션 타입별 필요한 에디터 섹션 매핑
// EditorSection ID는 variables.ts의 SECTION_GROUP_META와 일치해야 함
export const SECTION_TYPE_TO_EDITOR_SECTIONS: Record<SectionType, string[]> = {
  intro: ['intro', 'couple', 'wedding', 'photos'],
  greeting: ['greeting'],
  contact: ['couple'], // 연락처는 couple 섹션의 전화번호 사용
  venue: ['venue'],
  date: ['wedding'],
  gallery: ['photos'], // photos.gallery 경로의 에디터 섹션 ID는 'photos'
  parents: ['parents'],
  accounts: ['accounts'],
  guestbook: [], // 방명록은 사용자 입력 받는 섹션이므로 에디터 필드 없음
  music: ['bgm'], // BGM 설정
}

// ============================================
// 동적 에디터 생성 함수
// ============================================

/**
 * 활성화된 섹션들에 필요한 에디터 섹션 생성
 * @deprecated `editor-generator.ts`의 `generateEditorSectionsFromLayout`을 사용하세요.
 */
export function generateEditorSections(
  enabledSections: SectionType[]
): EditorSection[] {
  // 필요한 에디터 섹션 ID 수집 (중복 제거)
  const neededSectionIds = new Set<string>()

  for (const sectionType of enabledSections) {
    const editorSectionIds = SECTION_TYPE_TO_EDITOR_SECTIONS[sectionType] || []
    for (const id of editorSectionIds) {
      neededSectionIds.add(id)
    }
  }

  // 인사말은 항상 포함 (선택적)
  neededSectionIds.add('greeting')

  // 섹션 객체 배열 생성
  const sections: EditorSection[] = []
  for (const id of neededSectionIds) {
    const section = EDITOR_SECTIONS[id]
    if (section) {
      sections.push({ ...section })
    }
  }

  // order 기준 정렬
  sections.sort((a, b) => a.order - b.order)

  return sections
}

/**
 * 모든 에디터 섹션 반환
 */
export function getAllEditorSections(): EditorSection[] {
  return Object.values(EDITOR_SECTIONS).sort((a, b) => a.order - b.order)
}

/**
 * 기본 에디터 섹션 생성 (모든 섹션 활성화 기준)
 */
export function getDefaultEditorSections(): EditorSection[] {
  const allSections: SectionType[] = ['intro', 'venue', 'date', 'gallery', 'parents', 'accounts', 'guestbook']
  return generateEditorSections(allSections)
}
