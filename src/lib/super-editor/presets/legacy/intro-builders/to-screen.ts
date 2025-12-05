/**
 * Legacy Intro Builder to Screen Adapter
 * PrimitiveNode 기반 인트로 빌더를 렌더링 가능한 형태로 변환
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { LegacyTemplatePreset } from '../types'
import type { IntroBuilderData, IntroBuilderResult } from './types'

import { buildIntroFromPreset } from './index'

/**
 * 레거시 인트로 빌드 결과
 */
export interface LegacyIntroResult {
  presetId: string
  presetName: string
  presetNameKo: string
  root: PrimitiveNode
  additionalStyles?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
}

/**
 * 레거시 프리셋을 인트로 결과로 변환
 */
export function buildLegacyIntro(
  preset: LegacyTemplatePreset,
  data: IntroBuilderData
): LegacyIntroResult {
  const result = buildIntroFromPreset(preset, data)

  return {
    presetId: preset.id,
    presetName: preset.name,
    presetNameKo: preset.nameKo,
    root: result.root,
    additionalStyles: result.additionalStyles,
    colors: {
      primary: preset.defaultColors.primary,
      secondary: preset.defaultColors.secondary,
      accent: preset.defaultColors.accent,
      background: preset.defaultColors.background,
      text: preset.defaultColors.text,
    },
  }
}

/**
 * 모든 레거시 프리셋의 미리보기 정보
 */
export interface LegacyPresetPreview {
  id: string
  name: string
  nameKo: string
  category: string
  description: string
  descriptionKo: string
  mood: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  introType: string
}

/**
 * 템플릿 선택용 프리셋 목록 가져오기
 */
export function getLegacyPresetPreviews(
  presets: Record<string, LegacyTemplatePreset>
): LegacyPresetPreview[] {
  return Object.values(presets).map((preset) => ({
    id: preset.id,
    name: preset.name,
    nameKo: preset.nameKo,
    category: preset.category,
    description: preset.description,
    descriptionKo: preset.descriptionKo,
    mood: preset.preview.mood,
    colors: {
      primary: preset.defaultColors.primary,
      secondary: preset.defaultColors.secondary,
      accent: preset.defaultColors.accent,
      background: preset.defaultColors.background,
    },
    introType: preset.intro.type,
  }))
}
