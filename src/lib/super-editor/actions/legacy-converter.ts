/**
 * Legacy Converter Adapter
 * PredefinedTemplatePreset만으로 IntroGenerationResult를 생성하는 래퍼
 */

import type { PredefinedTemplatePreset } from '../presets/legacy/types'
import type { IntroGenerationResult } from '../services/generation-service'
import type { IntroBuilderData } from '../presets/legacy/intro-builders/types'
import {
  buildLegacyIntro,
  convertLegacyToIntroResult as originalConvertLegacyToIntroResult,
} from '../presets/legacy/intro-builders/to-screen'

// ============================================
// Default Data for Preview
// ============================================

/**
 * 인트로 빌드용 기본 데이터
 * 실제 사용자 데이터는 UserData에서 별도 관리
 */
const DEFAULT_INTRO_DATA: IntroBuilderData = {
  groomName: '신랑',
  brideName: '신부',
  weddingDate: getDefaultWeddingDate(),
  mainImage: '',
}

function getDefaultWeddingDate(): string {
  const date = new Date()
  date.setMonth(date.getMonth() + 3)
  return date.toISOString().split('T')[0]
}

// ============================================
// Converter Function
// ============================================

/**
 * PredefinedTemplatePreset에서 IntroGenerationResult 생성
 *
 * 기존 convertLegacyToIntroResult는 (LegacyIntroResult, PredefinedTemplatePreset)을 받지만
 * 이 함수는 PredefinedTemplatePreset만 받아서 기본 데이터로 LegacyIntroResult를 먼저 생성
 *
 * @param preset - 사전 정의된 템플릿 프리셋
 * @param customData - 선택적 커스텀 데이터 (기본값 오버라이드)
 * @returns IntroGenerationResult (style, tokens, cssVariables, introScreen)
 */
export function convertLegacyToIntroResult(
  preset: PredefinedTemplatePreset,
  customData?: Partial<IntroBuilderData>
): IntroGenerationResult {
  // 1. 인트로 빌드 데이터 준비
  const builderData: IntroBuilderData = {
    ...DEFAULT_INTRO_DATA,
    ...customData,
  }

  // 2. LegacyIntroResult 생성
  const legacyResult = buildLegacyIntro(preset, builderData)

  // 3. IntroGenerationResult로 변환
  return originalConvertLegacyToIntroResult(legacyResult, preset)
}

// ============================================
// Re-exports for convenience
// ============================================

export { buildLegacyIntro } from '../presets/legacy/intro-builders/to-screen'
export type { LegacyIntroResult } from '../presets/legacy/intro-builders/to-screen'
