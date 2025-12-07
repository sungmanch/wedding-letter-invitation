/**
 * Super Editor - Font Presets
 * 청첩장용 폰트 프리셋 정의
 */

// ============================================
// Types
// ============================================

export type FontCategory =
  | 'serif-ko' // 한글 세리프 (명조)
  | 'sans-ko' // 한글 산세리프 (고딕)
  | 'handwriting-ko' // 한글 손글씨
  | 'serif-en' // 영문 세리프
  | 'sans-en' // 영문 산세리프
  | 'display-en' // 영문 디스플레이/장식

export type FontSource =
  | 'google' // Google Fonts
  | 'cdn' // 기타 CDN (jsdelivr, cdnjs 등)
  | 'fontface' // @font-face CSS (projectnoonnu 등)
  | 'local' // 로컬 호스팅 (public/fonts/)

export interface FontWeight {
  value: number
  label: string
}

export interface FontPreset {
  id: string
  family: string // CSS font-family 값
  label: string // UI 표시명
  labelEn?: string // 영문 표시명
  category: FontCategory
  source: FontSource

  // 폰트 로드 정보
  googleFontsId?: string // Google Fonts ID (예: 'Noto+Serif+KR')
  cdnUrl?: string // CDN URL (@import 또는 <link>)
  fontFace?: {
    // @font-face 정의 (projectnoonnu 등)
    src: string // woff/woff2 URL
    format: 'woff' | 'woff2'
  }
  localFiles?: {
    // 로컬 파일 경로 (public/fonts/ 기준)
    weight: number
    style: 'normal' | 'italic'
    path: string
  }[]

  // 폰트 속성
  weights: FontWeight[] // 지원 굵기
  defaultWeight: number // 기본 굵기
  fallback: string // 폴백 폰트

  // 메타데이터
  license: string // 라이선스 (예: 'OFL', 'Apache 2.0', 'Commercial')
  description?: string // 폰트 설명
  recommended?: ('title' | 'body' | 'accent')[] // 추천 용도
}

// ============================================
// Font Presets
// ============================================

export const FONT_PRESETS: FontPreset[] = [
  // ============================================
  // 한글 산세리프 (고딕)
  // ============================================
  {
    id: 'pretendard',
    family: 'Pretendard',
    label: 'Pretendard',
    labelEn: 'Pretendard',
    category: 'sans-ko',
    source: 'cdn',
    cdnUrl:
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    license: 'OFL',
    description: '모던하고 깔끔한 산세리프. 가독성이 뛰어남',
    recommended: ['body'],
  },
  {
    id: 'noto-sans-kr',
    family: 'Noto Sans KR',
    label: '노토 산스',
    labelEn: 'Noto Sans KR',
    category: 'sans-ko',
    source: 'google',
    googleFontsId: 'Noto+Sans+KR',
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 700, label: '굵게' },
    ],
    defaultWeight: 400,
    fallback: 'sans-serif',
    license: 'OFL',
    description: '구글이 만든 범용 산세리프',
    recommended: ['body'],
  },
  {
    id: 'nanum-gothic',
    family: 'Nanum Gothic',
    label: '나눔고딕',
    labelEn: 'Nanum Gothic',
    category: 'sans-ko',
    source: 'google',
    googleFontsId: 'Nanum+Gothic',
    weights: [
      { value: 400, label: '보통' },
      { value: 700, label: '굵게' },
      { value: 800, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'sans-serif',
    license: 'OFL',
    description: '네이버의 대표 고딕체',
    recommended: ['body'],
  },
  {
    id: 'gowun-dodum',
    family: 'Gowun Dodum',
    label: '고운돋움',
    labelEn: 'Gowun Dodum',
    category: 'sans-ko',
    source: 'google',
    googleFontsId: 'Gowun+Dodum',
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'sans-serif',
    license: 'OFL',
    description: '부드럽고 단정한 돋움체',
    recommended: ['body'],
  },

  // ============================================
  // 한글 세리프 (명조)
  // ============================================
  {
    id: 'noto-serif-kr',
    family: 'Noto Serif KR',
    label: '노토 세리프',
    labelEn: 'Noto Serif KR',
    category: 'serif-ko',
    source: 'google',
    googleFontsId: 'Noto+Serif+KR',
    weights: [
      { value: 200, label: '아주 얇게' },
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '격조 있는 명조체. 청첩장에 적합',
    recommended: ['title', 'body'],
  },
  {
    id: 'nanum-myeongjo',
    family: 'Nanum Myeongjo',
    label: '나눔명조',
    labelEn: 'Nanum Myeongjo',
    category: 'serif-ko',
    source: 'google',
    googleFontsId: 'Nanum+Myeongjo',
    weights: [
      { value: 400, label: '보통' },
      { value: 700, label: '굵게' },
      { value: 800, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '클래식한 명조체',
    recommended: ['title'],
  },
  {
    id: 'gowun-batang',
    family: 'Gowun Batang',
    label: '고운바탕',
    labelEn: 'Gowun Batang',
    category: 'serif-ko',
    source: 'google',
    googleFontsId: 'Gowun+Batang',
    weights: [
      { value: 400, label: '보통' },
      { value: 700, label: '굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '우아한 바탕체',
    recommended: ['title', 'body'],
  },
  {
    id: 'hahmlet',
    family: 'Hahmlet',
    label: '함렛',
    labelEn: 'Hahmlet',
    category: 'serif-ko',
    source: 'google',
    googleFontsId: 'Hahmlet',
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '현대적 감각의 명조체',
    recommended: ['title'],
  },

  // ============================================
  // 한글 손글씨/캘리그라피
  // ============================================
  {
    id: 'nanum-pen',
    family: 'Nanum Pen Script',
    label: '나눔펜스크립트',
    labelEn: 'Nanum Pen Script',
    category: 'handwriting-ko',
    source: 'google',
    googleFontsId: 'Nanum+Pen+Script',
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '자연스러운 펜글씨체',
    recommended: ['accent'],
  },
  {
    id: 'nanum-brush',
    family: 'Nanum Brush Script',
    label: '나눔붓글씨',
    labelEn: 'Nanum Brush Script',
    category: 'handwriting-ko',
    source: 'google',
    googleFontsId: 'Nanum+Brush+Script',
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '감성적인 붓글씨체',
    recommended: ['accent'],
  },
  {
    id: 'gaegu',
    family: 'Gaegu',
    label: '개구',
    labelEn: 'Gaegu',
    category: 'handwriting-ko',
    source: 'google',
    googleFontsId: 'Gaegu',
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 700, label: '굵게' },
    ],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '친근한 손글씨체',
    recommended: ['accent'],
  },
  {
    id: 'cute-font',
    family: 'Cute Font',
    label: '큐트폰트',
    labelEn: 'Cute Font',
    category: 'handwriting-ko',
    source: 'google',
    googleFontsId: 'Cute+Font',
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '귀여운 손글씨체',
    recommended: ['accent'],
  },
  {
    id: 'hi-melody',
    family: 'Hi Melody',
    label: '하이멜로디',
    labelEn: 'Hi Melody',
    category: 'handwriting-ko',
    source: 'google',
    googleFontsId: 'Hi+Melody',
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '발랄한 손글씨체',
    recommended: ['accent'],
  },
  {
    id: 'poor-story',
    family: 'Poor Story',
    label: '푸어스토리',
    labelEn: 'Poor Story',
    category: 'handwriting-ko',
    source: 'google',
    googleFontsId: 'Poor+Story',
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '소박한 손글씨체',
    recommended: ['accent'],
  },

  // ============================================
  // 영문 세리프
  // ============================================
  {
    id: 'playfair-display',
    family: 'Playfair Display',
    label: 'Playfair Display',
    labelEn: 'Playfair Display',
    category: 'serif-en',
    source: 'google',
    googleFontsId: 'Playfair+Display',
    weights: [
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '우아한 디스플레이 세리프',
    recommended: ['title'],
  },
  {
    id: 'cormorant-garamond',
    family: 'Cormorant Garamond',
    label: 'Cormorant Garamond',
    labelEn: 'Cormorant Garamond',
    category: 'serif-en',
    source: 'google',
    googleFontsId: 'Cormorant+Garamond',
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '클래식하고 럭셔리한 세리프',
    recommended: ['title'],
  },
  {
    id: 'crimson-pro',
    family: 'Crimson Pro',
    label: 'Crimson Pro',
    labelEn: 'Crimson Pro',
    category: 'serif-en',
    source: 'google',
    googleFontsId: 'Crimson+Pro',
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '우아한 텍스트 세리프',
    recommended: ['title', 'body'],
  },
  {
    id: 'eb-garamond',
    family: 'EB Garamond',
    label: 'EB Garamond',
    labelEn: 'EB Garamond',
    category: 'serif-en',
    source: 'google',
    googleFontsId: 'EB+Garamond',
    weights: [
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '전통적인 Garamond 스타일',
    recommended: ['title', 'body'],
  },
  {
    id: 'libre-baskerville',
    family: 'Libre Baskerville',
    label: 'Libre Baskerville',
    labelEn: 'Libre Baskerville',
    category: 'serif-en',
    source: 'google',
    googleFontsId: 'Libre+Baskerville',
    weights: [
      { value: 400, label: '보통' },
      { value: 700, label: '굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '웹 최적화된 Baskerville',
    recommended: ['body'],
  },

  // ============================================
  // 영문 산세리프
  // ============================================
  {
    id: 'inter',
    family: 'Inter',
    label: 'Inter',
    labelEn: 'Inter',
    category: 'sans-en',
    source: 'google',
    googleFontsId: 'Inter',
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'sans-serif',
    license: 'OFL',
    description: '모던하고 가독성 좋은 산세리프',
    recommended: ['body'],
  },
  {
    id: 'poppins',
    family: 'Poppins',
    label: 'Poppins',
    labelEn: 'Poppins',
    category: 'sans-en',
    source: 'google',
    googleFontsId: 'Poppins',
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'sans-serif',
    license: 'OFL',
    description: '기하학적 산세리프',
    recommended: ['title', 'body'],
  },
  {
    id: 'lato',
    family: 'Lato',
    label: 'Lato',
    labelEn: 'Lato',
    category: 'sans-en',
    source: 'google',
    googleFontsId: 'Lato',
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 700, label: '굵게' },
      { value: 900, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'sans-serif',
    license: 'OFL',
    description: '따뜻하고 안정적인 산세리프',
    recommended: ['body'],
  },
  {
    id: 'montserrat',
    family: 'Montserrat',
    label: 'Montserrat',
    labelEn: 'Montserrat',
    category: 'sans-en',
    source: 'google',
    googleFontsId: 'Montserrat',
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'sans-serif',
    license: 'OFL',
    description: '모던하고 세련된 산세리프',
    recommended: ['title'],
  },

  // ============================================
  // 영문 디스플레이/장식
  // ============================================
  {
    id: 'cinzel',
    family: 'Cinzel',
    label: 'Cinzel',
    labelEn: 'Cinzel',
    category: 'display-en',
    source: 'google',
    googleFontsId: 'Cinzel',
    weights: [
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '로마 대문자 스타일. 격조 있는 타이틀용',
    recommended: ['title'],
  },
  {
    id: 'great-vibes',
    family: 'Great Vibes',
    label: 'Great Vibes',
    labelEn: 'Great Vibes',
    category: 'display-en',
    source: 'google',
    googleFontsId: 'Great+Vibes',
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '우아한 스크립트체. 청첩장 타이틀에 적합',
    recommended: ['title', 'accent'],
  },
  {
    id: 'dancing-script',
    family: 'Dancing Script',
    label: 'Dancing Script',
    labelEn: 'Dancing Script',
    category: 'display-en',
    source: 'google',
    googleFontsId: 'Dancing+Script',
    weights: [
      { value: 400, label: '보통' },
      { value: 500, label: '중간' },
      { value: 600, label: '굵게' },
      { value: 700, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '경쾌한 스크립트체',
    recommended: ['accent'],
  },
  {
    id: 'alex-brush',
    family: 'Alex Brush',
    label: 'Alex Brush',
    labelEn: 'Alex Brush',
    category: 'display-en',
    source: 'google',
    googleFontsId: 'Alex+Brush',
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '브러시 스크립트체',
    recommended: ['accent'],
  },
  {
    id: 'parisienne',
    family: 'Parisienne',
    label: 'Parisienne',
    labelEn: 'Parisienne',
    category: 'display-en',
    source: 'google',
    googleFontsId: 'Parisienne',
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '파리지앵 스타일 스크립트',
    recommended: ['title', 'accent'],
  },
  {
    id: 'tangerine',
    family: 'Tangerine',
    label: 'Tangerine',
    labelEn: 'Tangerine',
    category: 'display-en',
    source: 'google',
    googleFontsId: 'Tangerine',
    weights: [
      { value: 400, label: '보통' },
      { value: 700, label: '굵게' },
    ],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '캘리그래피 스타일 스크립트',
    recommended: ['title', 'accent'],
  },

  // ============================================
  // 한글 손글씨 (projectnoonnu)
  // ============================================
  {
    id: 'school-safety-bookmark',
    family: 'SchoolSafetyBookmark',
    label: '학교안심 책갈피',
    labelEn: 'School Safety Bookmark',
    category: 'handwriting-ko',
    source: 'fontface',
    fontFace: {
      src: 'https://cdn.jsdelivr.net/gh/projectnoonnu/2510-1@1.0/HakgyoansimChaekgalpiR.woff2',
      format: 'woff2',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '학교안심 책갈피체. 따뜻한 손글씨',
    recommended: ['accent'],
  },
  {
    id: 'daeam-lee-taejun',
    family: 'DaeAmLeeTaeJun',
    label: '대암 이태준체',
    labelEn: 'DaeAm Lee TaeJun',
    category: 'handwriting-ko',
    source: 'fontface',
    fontFace: {
      src: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2312-1@1.1/DAEAM_LEE_TAE_JOON.woff2',
      format: 'woff2',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '문학적인 감성의 손글씨체',
    recommended: ['title', 'accent'],
  },
  {
    id: 'gabia-sai',
    family: 'GabiaSai',
    label: '가비아 사이체',
    labelEn: 'Gabia Sai',
    category: 'handwriting-ko',
    source: 'fontface',
    fontFace: {
      src: 'https://cdn.jsdelivr.net/gh/projectnoonnu/2510-1@1.0/GabiaSai-Regular.woff2',
      format: 'woff2',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '자연스러운 필기체 손글씨',
    recommended: ['accent'],
  },
  {
    id: 'noh-haechan',
    family: 'NohHaeChan',
    label: '노회찬체',
    labelEn: 'Noh HaeChan',
    category: 'handwriting-ko',
    source: 'fontface',
    fontFace: {
      src: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/ROEHOE-CHAN.woff',
      format: 'woff',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '진정성 있는 손글씨체',
    recommended: ['accent'],
  },
  {
    id: 'gyeombalbal',
    family: 'Gyeombalbal',
    label: '귀염발랄체',
    labelEn: 'Gyeombalbal',
    category: 'handwriting-ko',
    source: 'fontface',
    fontFace: {
      src: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/insungitCutelivelyjisu.woff2',
      format: 'woff2',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '귀엽고 발랄한 손글씨체',
    recommended: ['accent'],
  },
  {
    id: 'ongleip-study-well',
    family: 'OngleipStudyWell',
    label: '온글잎 공부잘하자나',
    labelEn: 'Ongleip Study Well',
    category: 'handwriting-ko',
    source: 'fontface',
    fontFace: {
      src: 'https://cdn.jsdelivr.net/gh/projectnoonnu/2411-3@1.0/Ownglyph_StudyHard-Rg.woff2',
      format: 'woff2',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '정성스러운 필기체',
    recommended: ['accent'],
  },
  {
    id: 'yoon-cho-woosan',
    family: 'YoonChoWooSan',
    label: '윤초록우산어린이 만세',
    labelEn: 'Yoon Cho WooSan',
    category: 'handwriting-ko',
    source: 'fontface',
    fontFace: {
      src: 'https://cdn.jsdelivr.net/gh/projectnoonnu/2408@1.0/YoonChildfundkoreaManSeh.woff2',
      format: 'woff2',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'OFL',
    description: '순수하고 밝은 손글씨체',
    recommended: ['accent'],
  },

  // ============================================
  // 한글 고딕 (projectnoonnu)
  // ============================================
  {
    id: 'gamulchi-free-gothic',
    family: 'GamulchiFreeGothic',
    label: '가물치 무료고딕',
    labelEn: 'Gamulchi Free Gothic',
    category: 'sans-ko',
    source: 'fontface',
    fontFace: {
      src: 'https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/AssacomFreeGothicTTF-Regular.woff2',
      format: 'woff2',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'sans-serif',
    license: 'OFL',
    description: '깔끔한 무료 고딕체',
    recommended: ['body'],
  },
  {
    id: 'cafe24-simple',
    family: 'Cafe24Simple',
    label: '카페24 심플해',
    labelEn: 'Cafe24 Simple',
    category: 'sans-ko',
    source: 'fontface',
    fontFace: {
      src: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.1/Cafe24Simplehae.woff',
      format: 'woff',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'sans-serif',
    license: 'OFL',
    description: '심플하고 모던한 고딕체',
    recommended: ['body'],
  },
  {
    id: 'joseon-gane-gothic',
    family: 'JoseonGaneGothic',
    label: '조선가는고딕',
    labelEn: 'Joseon Gane Gothic',
    category: 'sans-ko',
    source: 'fontface',
    fontFace: {
      src: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunSg.woff',
      format: 'woff',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'sans-serif',
    license: 'OFL',
    description: '가늘고 세련된 고딕체',
    recommended: ['body'],
  },

  // ============================================
  // 영문 디스플레이 (Self-hosted - Supabase)
  // ============================================
  {
    id: 'lt-museum',
    family: 'LTMuseum',
    label: 'LT Museum',
    labelEn: 'LT Museum',
    category: 'serif-en',
    source: 'fontface',
    fontFace: {
      src: 'https://jtfqjfpvwikcvtoigufi.supabase.co/storage/v1/object/public/webfont/lt-museum/LTMuseum-Medium.woff2',
      format: 'woff2',
    },
    weights: [
      { value: 300, label: '얇게' },
      { value: 400, label: '보통' },
      { value: 700, label: '굵게' },
      { value: 900, label: '매우 굵게' },
    ],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'OFL',
    description: '클래식 박물관 스타일 세리프. 격조 있는 타이틀용',
    recommended: ['title'],
  },
  {
    id: 'high-summit',
    family: 'HighSummit',
    label: 'High Summit',
    labelEn: 'High Summit',
    category: 'display-en',
    source: 'fontface',
    fontFace: {
      src: 'https://jtfqjfpvwikcvtoigufi.supabase.co/storage/v1/object/public/webfont/high-summit/HighSummit.woff2',
      format: 'woff2',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'serif',
    license: 'Free',
    description: '자연스러운 손글씨 디스플레이 폰트',
    recommended: ['title', 'accent'],
  },
  {
    id: 'high-empathy',
    family: 'HighEmpathy',
    label: 'High Empathy',
    labelEn: 'High Empathy',
    category: 'display-en',
    source: 'fontface',
    fontFace: {
      src: 'https://jtfqjfpvwikcvtoigufi.supabase.co/storage/v1/object/public/webfont/high-empathy/HighEmpathy.woff2',
      format: 'woff2',
    },
    weights: [{ value: 400, label: '보통' }],
    defaultWeight: 400,
    fallback: 'cursive',
    license: 'Free',
    description: '감성적인 손글씨 스크립트체',
    recommended: ['accent'],
  },
]

// ============================================
// Helper Functions
// ============================================

/** ID로 폰트 프리셋 찾기 */
export function getFontById(id: string): FontPreset | undefined {
  return FONT_PRESETS.find((f) => f.id === id)
}

/** family 이름으로 폰트 프리셋 찾기 */
export function getFontByFamily(family: string): FontPreset | undefined {
  return FONT_PRESETS.find((f) => f.family === family)
}

/** 카테고리별 폰트 목록 */
export function getFontsByCategory(category: FontCategory): FontPreset[] {
  return FONT_PRESETS.filter((f) => f.category === category)
}

/** 추천 용도별 폰트 목록 */
export function getFontsForUsage(usage: 'title' | 'body' | 'accent'): FontPreset[] {
  return FONT_PRESETS.filter((f) => f.recommended?.includes(usage))
}

/** StyleEditor용 옵션 목록 (카테고리별 그룹화) */
export function getFontOptionsGrouped(): {
  category: string
  label: string
  fonts: FontPreset[]
}[] {
  return [
    { category: 'serif-ko', label: '한글 명조', fonts: getFontsByCategory('serif-ko') },
    { category: 'sans-ko', label: '한글 고딕', fonts: getFontsByCategory('sans-ko') },
    {
      category: 'handwriting-ko',
      label: '한글 손글씨',
      fonts: getFontsByCategory('handwriting-ko'),
    },
    { category: 'serif-en', label: '영문 세리프', fonts: getFontsByCategory('serif-en') },
    { category: 'sans-en', label: '영문 산세리프', fonts: getFontsByCategory('sans-en') },
    { category: 'display-en', label: '영문 디스플레이', fonts: getFontsByCategory('display-en') },
  ]
}

/** 폰트 CSS font-family 값 생성 */
export function buildFontFamily(preset: FontPreset): string {
  return `"${preset.family}", ${preset.fallback}`
}
