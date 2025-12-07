/**
 * Super Editor - Variable Extractor
 * Layout에서 {{path.to.data}} 변수를 추출하는 유틸리티
 */

import type { LayoutSchema, Screen } from '../schema/layout'
import type { PrimitiveNode } from '../schema/primitives'
import type { SkeletonNode, SectionScreen } from '../skeletons/types'
import type { SectionType } from '../schema/section-types'
import { isStandardVariable } from '../schema/variables'

// ============================================
// Variable Extraction
// ============================================

/** {{path.to.data}} 패턴 정규식 */
const BINDING_PATTERN = /\{\{([^}]+)\}\}/g

/**
 * 문자열에서 모든 변수 경로 추출
 */
export function extractVariablesFromString(value: string): string[] {
  if (!value || typeof value !== 'string' || !value.includes('{{')) {
    return []
  }

  const paths: string[] = []
  let match: RegExpExecArray | null

  // 정규식 상태 초기화
  BINDING_PATTERN.lastIndex = 0

  while ((match = BINDING_PATTERN.exec(value)) !== null) {
    const path = match[1].trim()
    // 포맷터 제거 (예: {{date | format}} -> date)
    const cleanPath = path.split('|')[0].trim()
    if (cleanPath && !paths.includes(cleanPath)) {
      paths.push(cleanPath)
    }
  }

  return paths
}

/**
 * 노드의 props에서 변수 추출
 */
function extractFromProps(props: Record<string, unknown> | undefined): string[] {
  if (!props) return []

  const paths: string[] = []

  for (const value of Object.values(props)) {
    if (typeof value === 'string') {
      paths.push(...extractVariablesFromString(value))
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') {
          paths.push(...extractVariablesFromString(item))
        }
      }
    }
  }

  return paths
}

/**
 * 노드 트리에서 모든 변수 추출 (재귀)
 */
export function extractVariablesFromNode(
  node: PrimitiveNode | SkeletonNode
): Set<string> {
  const variables = new Set<string>()

  function traverse(n: PrimitiveNode | SkeletonNode) {
    // props에서 추출
    const propsVars = extractFromProps(n.props as Record<string, unknown>)
    propsVars.forEach((v) => variables.add(v))

    // conditional 노드의 condition은 {{}} 없이 직접 경로로 되어 있음
    if (n.type === 'conditional' && n.props) {
      const props = n.props as { condition?: string }
      if (props.condition && typeof props.condition === 'string') {
        // {{}}로 감싸진 경우와 직접 경로인 경우 모두 처리
        if (props.condition.includes('{{')) {
          extractVariablesFromString(props.condition).forEach((v) => variables.add(v))
        } else {
          variables.add(props.condition)
        }
      }
    }

    // repeat 노드의 items 또는 dataPath도 직접 경로일 수 있음
    if (n.type === 'repeat' && n.props) {
      const props = n.props as { items?: string; dataPath?: string }
      // items 속성 처리
      if (props.items && typeof props.items === 'string') {
        if (props.items.includes('{{')) {
          extractVariablesFromString(props.items).forEach((v) => variables.add(v))
        } else {
          variables.add(props.items)
        }
      }
      // dataPath 속성 처리 (accounts 스켈레톤 등에서 사용)
      if (props.dataPath && typeof props.dataPath === 'string') {
        if (props.dataPath.includes('{{')) {
          extractVariablesFromString(props.dataPath).forEach((v) => variables.add(v))
        } else {
          variables.add(props.dataPath)
        }
      }
    }

    // tokenStyle에서 추출 (SkeletonNode에만 존재, 일반적으로 $token 참조이지만 혹시 모를 경우)
    if ('tokenStyle' in n && n.tokenStyle) {
      for (const value of Object.values(n.tokenStyle)) {
        if (typeof value === 'string' && value.includes('{{')) {
          extractVariablesFromString(value).forEach((v) => variables.add(v))
        }
      }
    }

    // 자식 노드 순회
    if (n.children && Array.isArray(n.children)) {
      for (const child of n.children) {
        traverse(child)
      }
    }
  }

  traverse(node)
  return variables
}

/**
 * Screen에서 모든 변수 추출
 */
export function extractVariablesFromScreen(
  screen: Screen | SectionScreen
): Set<string> {
  return extractVariablesFromNode(screen.root)
}

/**
 * LayoutSchema에서 모든 변수 추출
 */
export function extractVariablesFromLayout(layout: LayoutSchema): string[] {
  const variables = new Set<string>()

  for (const screen of layout.screens) {
    const screenVars = extractVariablesFromScreen(screen)
    screenVars.forEach((v) => variables.add(v))
  }

  return Array.from(variables)
}

/**
 * SectionScreen 배열에서 모든 변수 추출
 */
export function extractVariablesFromSections(
  sections: SectionScreen[]
): string[] {
  const variables = new Set<string>()

  for (const section of sections) {
    const sectionVars = extractVariablesFromScreen(section)
    sectionVars.forEach((v) => variables.add(v))
  }

  return Array.from(variables)
}

// ============================================
// Section-based Variable Extraction
// ============================================

/**
 * LayoutSchema에서 sectionType별로 변수 추출
 * 각 screen의 sectionType을 기준으로 해당 screen에서 사용하는 변수들을 그룹화
 */
export function extractVariablesBySectionType(
  layout: LayoutSchema
): Map<string, string[]> {
  const result = new Map<string, string[]>()

  for (const screen of layout.screens) {
    const sectionType =
      (screen as { sectionType?: string }).sectionType ?? screen.type
    if (!sectionType) continue

    const screenVars = Array.from(extractVariablesFromScreen(screen))
    const existing = result.get(sectionType) || []
    // 중복 제거하면서 병합
    result.set(sectionType, [...new Set([...existing, ...screenVars])])
  }

  return result
}

// ============================================
// Section Extraction
// ============================================

/**
 * LayoutSchema에서 존재하는 섹션 타입 추출
 */
export function extractSectionsFromLayout(layout: LayoutSchema): SectionType[] {
  const sections: SectionType[] = []

  for (const screen of layout.screens) {
    // sectionType이 있으면 사용, 없으면 type을 sectionType으로 간주
    const sectionType = (screen as { sectionType?: SectionType }).sectionType ?? screen.type
    if (sectionType && !sections.includes(sectionType as SectionType)) {
      sections.push(sectionType as SectionType)
    }
  }

  return sections
}

/**
 * LayoutSchema에서 순서 변경 가능한 섹션만 추출 (intro, music 제외)
 */
export function extractReorderableSections(layout: LayoutSchema): SectionType[] {
  const allSections = extractSectionsFromLayout(layout)
  return allSections.filter((s) => s !== 'intro' && s !== 'music')
}

// ============================================
// Variable Classification
// ============================================

export interface ClassifiedVariables {
  /** 표준 변수 (STANDARD_VARIABLE_PATHS에 정의됨) */
  standard: string[]
  /** 커스텀 변수 (표준에 없음) */
  custom: string[]
  /** 전체 변수 */
  all: string[]
}

/**
 * 변수를 표준/커스텀으로 분류
 */
export function classifyVariables(paths: string[]): ClassifiedVariables {
  const standard: string[] = []
  const custom: string[] = []

  for (const path of paths) {
    if (isStandardVariable(path)) {
      standard.push(path)
    } else {
      custom.push(path)
    }
  }

  return {
    standard,
    custom,
    all: paths,
  }
}

/**
 * Layout에서 변수를 추출하고 분류
 */
export function extractAndClassifyVariables(
  layout: LayoutSchema
): ClassifiedVariables {
  const paths = extractVariablesFromLayout(layout)
  return classifyVariables(paths)
}

// ============================================
// Variable Validation
// ============================================

export interface VariableValidationResult {
  /** 선언된 변수 중 Layout에서 사용되지 않는 것 */
  unusedDeclarations: string[]
  /** Layout에서 사용되지만 선언되지 않은 것 (커스텀이면서 선언 없음) */
  undeclaredVariables: string[]
  /** 유효한 변수 */
  validVariables: string[]
}

/**
 * 선언된 변수와 Layout에서 사용된 변수 검증
 */
export function validateVariables(
  declaredPaths: string[],
  usedPaths: string[]
): VariableValidationResult {
  const declaredSet = new Set(declaredPaths)
  const usedSet = new Set(usedPaths)

  const unusedDeclarations: string[] = []
  const undeclaredVariables: string[] = []
  const validVariables: string[] = []

  // 선언되었지만 사용되지 않은 변수
  for (const path of declaredPaths) {
    if (!usedSet.has(path)) {
      unusedDeclarations.push(path)
    }
  }

  // 사용되지만 선언되지 않은 커스텀 변수
  for (const path of usedPaths) {
    if (!declaredSet.has(path) && !isStandardVariable(path)) {
      undeclaredVariables.push(path)
    } else {
      validVariables.push(path)
    }
  }

  return {
    unusedDeclarations,
    undeclaredVariables,
    validVariables,
  }
}
