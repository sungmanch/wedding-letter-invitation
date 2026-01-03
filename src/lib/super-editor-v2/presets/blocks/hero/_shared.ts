/**
 * Hero Block - Shared Configuration
 *
 * Hero 블록은 메인 사진 위에 텍스트를 오버레이하는 absolute 레이아웃을 사용합니다.
 * 다른 블록들과 달리 auto-layout이 아닌 absolute positioning 사용
 */

import type { SizeMode } from '../../../schema/types'

// Hero는 뷰포트 전체 높이 (100vh 풀스크린)
export const HERO_HEIGHT: SizeMode = { type: 'fixed', value: 100, unit: 'vh' }

// 텍스트 오버레이용 공통 스타일
export const OVERLAY_TEXT_SHADOW = '0 2px 8px rgba(0, 0, 0, 0.3)'
