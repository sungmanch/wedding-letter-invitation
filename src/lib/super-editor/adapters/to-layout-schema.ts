/**
 * Super Editor - Layout Schema Adapters
 * 다양한 데이터 소스를 LayoutSchema로 변환하는 어댑터
 */

import type { LayoutSchema, Screen } from '../schema/layout'
import type { IntroGenerationResult } from '../services/generation-service'
import type { SectionScreen } from '../skeletons/types'
import type { PrimitiveNode } from '../schema/primitives'

/**
 * SectionScreen을 Screen으로 변환
 */
function sectionScreenToScreen(sectionScreen: SectionScreen): Screen {
  return {
    id: sectionScreen.id,
    name: sectionScreen.name,
    type: sectionScreen.type === 'intro' ? 'intro' : 'content',
    sectionType: sectionScreen.sectionType,
    root: sectionScreen.root as PrimitiveNode,
  }
}

/**
 * IntroGenerationResult를 intro-only LayoutSchema로 변환
 */
export function introResultToLayout(result: IntroGenerationResult): LayoutSchema {
  return {
    version: '1.0',
    meta: {
      id: `intro-${result.introScreen.id}`,
      name: result.introScreen.name || 'Intro',
      category: 'scroll',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    screens: [sectionScreenToScreen(result.introScreen)],
  }
}

/**
 * 템플릿의 LayoutSchema에서 intro-only LayoutSchema 추출
 */
export function extractIntroLayout(layout: LayoutSchema): LayoutSchema {
  const introScreen = layout.screens.find(s => s.sectionType === 'intro')

  return {
    version: '1.0',
    meta: {
      ...layout.meta,
      id: `intro-${layout.meta.id}`,
      name: `${layout.meta.name} - Intro`,
    },
    screens: introScreen ? [introScreen] : [],
  }
}

/**
 * 단일 Screen을 LayoutSchema로 래핑
 */
export function screenToLayout(screen: Screen, baseMeta?: Partial<LayoutSchema['meta']>): LayoutSchema {
  return {
    version: '1.0',
    meta: {
      id: baseMeta?.id || `screen-${screen.id}`,
      name: baseMeta?.name || screen.name || 'Single Screen',
      category: baseMeta?.category || 'scroll',
      createdAt: baseMeta?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    screens: [screen],
  }
}
