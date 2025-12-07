/**
 * Template Preview Data
 * 템플릿별 기본 프리뷰 이미지 및 데이터 상수
 * 공통 모듈로 추출하여 여러 곳에서 사용
 */

// ============================================
// 템플릿 ID별 기본 프리뷰 이미지 매핑
// ============================================

export const TEMPLATE_DEFAULT_IMAGES: Record<string, string> = {
  cinematic: '/examples/images/example_wedding_image2.png',
  exhibition: '/examples/images/example_wedding_image3.png',
  magazine: '/examples/images/example_wedding_image4.png',
  chat: '/examples/images/example_wedding_image5.png',
  'gothic-romance': '/examples/images/example_wedding_image6.png',
  'old-money': '/examples/images/example_wedding_image7.png',
  monogram: '/examples/images/example_wedding_image8.png',
  'jewel-velvet': '/examples/images/example_wedding_image9.png',
}

// ============================================
// 템플릿 ID별 미리보기 데이터
// ============================================

export interface TemplatePreviewData {
  groomName: string
  brideName: string
  weddingDate: string
  venueName: string
}

export const TEMPLATE_PREVIEW_DATA: Record<string, TemplatePreviewData> = {
  cinematic: {
    groomName: '준혁',
    brideName: '서연',
    weddingDate: '2025-06-14',
    venueName: '아트리움',
  },
  exhibition: {
    groomName: 'Daniel',
    brideName: 'Emily',
    weddingDate: '2025-09-20',
    venueName: 'Gallery K',
  },
  magazine: {
    groomName: '도윤',
    brideName: '서아',
    weddingDate: '2025-03-08',
    venueName: '라비에벨',
  },
  chat: {
    groomName: '민재',
    brideName: '하늘',
    weddingDate: '2025-11-22',
    venueName: '루나웨딩홀',
  },
  'gothic-romance': {
    groomName: '시우',
    brideName: '예린',
    weddingDate: '2025-10-31',
    venueName: '더채플 강남',
  },
  'old-money': {
    groomName: 'William',
    brideName: 'Charlotte',
    weddingDate: '2025-04-19',
    venueName: 'The Ritz',
  },
  monogram: {
    groomName: '현우',
    brideName: '지은',
    weddingDate: '2025-08-16',
    venueName: '그랜드하얏트',
  },
  'jewel-velvet': {
    groomName: '태민',
    brideName: '소희',
    weddingDate: '2025-12-24',
    venueName: '노블발렌티',
  },
}

// ============================================
// 기본값
// ============================================

export const DEFAULT_PREVIEW_DATA: TemplatePreviewData = {
  groomName: '민수',
  brideName: '수진',
  weddingDate: '2025-05-24',
  venueName: '더채플 청담',
}

// 템플릿별 데이터 조회 (fallback 포함)
export function getTemplatePreviewData(templateId: string): TemplatePreviewData {
  return TEMPLATE_PREVIEW_DATA[templateId] ?? DEFAULT_PREVIEW_DATA
}

// 템플릿별 기본 이미지 조회 (fallback 포함)
export function getTemplateDefaultImage(templateId: string): string | undefined {
  return TEMPLATE_DEFAULT_IMAGES[templateId]
}
