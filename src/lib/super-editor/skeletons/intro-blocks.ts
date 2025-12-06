/**
 * Super Editor - Intro Building Blocks
 * 컴포저블 인트로 섹션 빌딩 블록
 *
 * AI가 블록을 조합하여 다양한 인트로 디자인을 생성할 수 있습니다.
 */

import type { SkeletonNode } from './types'

// ============================================
// Block Types
// ============================================

/**
 * 이미지 레이아웃 블록
 * 메인 사진을 어떻게 배치할지 결정
 */
export type ImageLayoutBlock =
  | 'fullscreen-bg' // 전체 화면 배경
  | 'centered' // 중앙 정렬 (80% 너비)
  | 'circular' // 원형 프레임
  | 'polaroid' // 폴라로이드 프레임
  | 'split-left' // 좌측 절반
  | 'card' // 카드 안에 이미지

/**
 * 텍스트 레이아웃 블록
 * 이름/날짜 텍스트를 어떻게 배치할지 결정
 */
export type TextLayoutBlock =
  | 'bottom-overlay' // 하단 오버레이 (배경 위)
  | 'center' // 중앙 정렬
  | 'below-image' // 이미지 아래
  | 'side-right' // 우측 사이드
  | 'stacked-vertical' // 이름 세로 배치 (groom / & / bride)
  | 'inside-card' // 카드 내부

/**
 * 텍스트 스타일 블록
 * 텍스트의 시각적 스타일
 */
export type TextStyleBlock =
  | 'elegant' // 세리프, 우아함
  | 'modern' // 산세리프, 깔끔
  | 'typewriter' // 모노스페이스, 빈티지
  | 'editorial' // 큰 타이포, 잡지 스타일

/**
 * 장식 요소 블록
 */
export type DecorationBlock =
  | 'none' // 없음
  | 'divider-line' // 구분선
  | 'label-text' // 라벨 텍스트 (Wedding Invitation 등)
  | 'scroll-hint' // 스크롤 힌트 (Scroll down ↓)
  | 'ampersand' // & 기호 강조

/**
 * 색상 테마 블록
 */
export type ColorThemeBlock =
  | 'light' // 밝은 배경, 어두운 텍스트
  | 'dark' // 어두운 배경, 밝은 텍스트
  | 'overlay' // 이미지 위 반투명 오버레이
  | 'warm' // 따뜻한 톤 (베이지, 크림)

// ============================================
// Block Composition
// ============================================

/**
 * 인트로 블록 조합
 */
export interface IntroBlockComposition {
  imageLayout: ImageLayoutBlock
  textLayout: TextLayoutBlock
  textStyle: TextStyleBlock
  decoration: DecorationBlock[]
  colorTheme: ColorThemeBlock
}

/**
 * 기존 variant를 블록 조합으로 매핑
 */
export const VARIANT_TO_BLOCKS: Record<string, IntroBlockComposition> = {
  minimal: {
    imageLayout: 'centered',
    textLayout: 'below-image',
    textStyle: 'modern',
    decoration: ['none'],
    colorTheme: 'light',
  },
  elegant: {
    imageLayout: 'fullscreen-bg',
    textLayout: 'bottom-overlay',
    textStyle: 'elegant',
    decoration: ['label-text', 'divider-line'],
    colorTheme: 'overlay',
  },
  romantic: {
    imageLayout: 'circular',
    textLayout: 'below-image',
    textStyle: 'elegant',
    decoration: ['none'],
    colorTheme: 'warm',
  },
  cinematic: {
    imageLayout: 'fullscreen-bg',
    textLayout: 'stacked-vertical',
    textStyle: 'modern',
    decoration: ['label-text', 'ampersand'],
    colorTheme: 'dark',
  },
  polaroid: {
    imageLayout: 'polaroid',
    textLayout: 'below-image',
    textStyle: 'modern',
    decoration: ['label-text'],
    colorTheme: 'light',
  },
  split: {
    imageLayout: 'split-left',
    textLayout: 'side-right',
    textStyle: 'modern',
    decoration: ['label-text', 'divider-line'],
    colorTheme: 'light',
  },
  magazine: {
    imageLayout: 'fullscreen-bg',
    textLayout: 'bottom-overlay',
    textStyle: 'editorial',
    decoration: ['label-text'],
    colorTheme: 'overlay',
  },
  typewriter: {
    imageLayout: 'card',
    textLayout: 'inside-card',
    textStyle: 'typewriter',
    decoration: ['label-text', 'divider-line'],
    colorTheme: 'warm',
  },
  floating: {
    imageLayout: 'card',
    textLayout: 'inside-card',
    textStyle: 'modern',
    decoration: ['scroll-hint'],
    colorTheme: 'light',
  },
}

// ============================================
// Block Descriptions (for AI prompt)
// ============================================

export const IMAGE_LAYOUT_DESCRIPTIONS: Record<ImageLayoutBlock, string> = {
  'fullscreen-bg': '사진이 전체 화면 배경으로 깔림, 임팩트 있는 첫인상',
  centered: '사진이 중앙에 적당한 크기로 배치, 여백의 미학',
  circular: '원형 프레임 안에 사진, 부드럽고 친근한 느낌',
  polaroid: '폴라로이드 사진처럼 흰 테두리와 약간 기울어진 배치',
  'split-left': '화면 좌측 절반을 사진이 차지, 모던한 분할 레이아웃',
  card: '카드 컨테이너 안에 사진, 떠있는 느낌',
}

export const TEXT_LAYOUT_DESCRIPTIONS: Record<TextLayoutBlock, string> = {
  'bottom-overlay': '화면 하단에 텍스트가 이미지 위에 오버레이',
  center: '화면 중앙에 텍스트 배치',
  'below-image': '이미지 아래에 텍스트가 순차적으로 배치',
  'side-right': '이미지 옆 우측에 텍스트 배치 (분할 레이아웃용)',
  'stacked-vertical': '신랑/신부 이름이 세로로 크게 배치, 영화 크레딧 스타일',
  'inside-card': '카드 내부에 이미지와 함께 텍스트 배치',
}

export const TEXT_STYLE_DESCRIPTIONS: Record<TextStyleBlock, string> = {
  elegant: '세리프 폰트, 우아하고 클래식한 느낌',
  modern: '산세리프 폰트, 깔끔하고 현대적인 느낌',
  typewriter: '모노스페이스 폰트, 빈티지하고 문학적인 느낌',
  editorial: '큰 타이포그래피, 잡지 헤드라인 스타일',
}

export const DECORATION_DESCRIPTIONS: Record<DecorationBlock, string> = {
  none: '장식 없이 깔끔하게',
  'divider-line': '섹션 구분을 위한 가는 선',
  'label-text': 'Wedding Invitation 같은 작은 라벨 텍스트',
  'scroll-hint': 'Scroll down ↓ 같은 스크롤 유도 텍스트',
  ampersand: '& 기호를 강조하여 두 사람을 연결',
}

export const COLOR_THEME_DESCRIPTIONS: Record<ColorThemeBlock, string> = {
  light: '밝은 배경에 어두운 텍스트, 깔끔하고 밝은 느낌',
  dark: '어두운 배경에 밝은 텍스트, 드라마틱하고 시네마틱',
  overlay: '이미지 위에 반투명 오버레이, 사진과 텍스트 조화',
  warm: '베이지/크림 톤 배경, 따뜻하고 포근한 느낌',
}

// ============================================
// Utility Functions
// ============================================

/**
 * 블록 조합의 호환성 검증
 */
export function validateBlockComposition(
  composition: IntroBlockComposition
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = []

  // fullscreen-bg는 bottom-overlay나 center와 잘 어울림
  if (
    composition.imageLayout === 'fullscreen-bg' &&
    !['bottom-overlay', 'center', 'stacked-vertical'].includes(composition.textLayout)
  ) {
    warnings.push('fullscreen-bg는 bottom-overlay, center, stacked-vertical과 잘 어울립니다')
  }

  // circular는 below-image와 잘 어울림
  if (composition.imageLayout === 'circular' && composition.textLayout !== 'below-image') {
    warnings.push('circular 이미지는 below-image 텍스트 레이아웃과 잘 어울립니다')
  }

  // split-left는 side-right와 함께 사용
  if (composition.imageLayout === 'split-left' && composition.textLayout !== 'side-right') {
    warnings.push('split-left는 side-right 텍스트 레이아웃과 함께 사용해야 합니다')
  }

  // dark 테마는 fullscreen-bg와 잘 어울림
  if (
    composition.colorTheme === 'dark' &&
    !['fullscreen-bg'].includes(composition.imageLayout)
  ) {
    warnings.push('dark 테마는 fullscreen-bg와 함께 사용할 때 효과적입니다')
  }

  return {
    valid: warnings.length === 0,
    warnings,
  }
}

/**
 * 추천 블록 조합 생성
 */
export function suggestBlockCombinations(mood: string[]): IntroBlockComposition[] {
  const suggestions: IntroBlockComposition[] = []

  if (mood.includes('modern') || mood.includes('minimal')) {
    suggestions.push({
      imageLayout: 'centered',
      textLayout: 'below-image',
      textStyle: 'modern',
      decoration: ['none'],
      colorTheme: 'light',
    })
  }

  if (mood.includes('elegant') || mood.includes('luxury')) {
    suggestions.push({
      imageLayout: 'fullscreen-bg',
      textLayout: 'bottom-overlay',
      textStyle: 'elegant',
      decoration: ['label-text', 'divider-line'],
      colorTheme: 'overlay',
    })
  }

  if (mood.includes('romantic') || mood.includes('warm')) {
    suggestions.push({
      imageLayout: 'circular',
      textLayout: 'below-image',
      textStyle: 'elegant',
      decoration: ['none'],
      colorTheme: 'warm',
    })
  }

  if (mood.includes('dramatic') || mood.includes('cinematic')) {
    suggestions.push({
      imageLayout: 'fullscreen-bg',
      textLayout: 'stacked-vertical',
      textStyle: 'modern',
      decoration: ['label-text', 'ampersand'],
      colorTheme: 'dark',
    })
  }

  if (mood.includes('retro') || mood.includes('vintage')) {
    suggestions.push({
      imageLayout: 'polaroid',
      textLayout: 'below-image',
      textStyle: 'typewriter',
      decoration: ['label-text'],
      colorTheme: 'warm',
    })
  }

  if (mood.includes('trendy') || mood.includes('fashion')) {
    suggestions.push({
      imageLayout: 'fullscreen-bg',
      textLayout: 'bottom-overlay',
      textStyle: 'editorial',
      decoration: ['label-text'],
      colorTheme: 'overlay',
    })
  }

  return suggestions
}
