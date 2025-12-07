/**
 * Super Editor - Editor Generator
 * Layout에서 EditorSection을 자동 생성하는 유틸리티
 */

import type { EditorSection, EditorField } from '../schema/editor'
import type { LayoutSchema } from '../schema/layout'
import type { VariableDeclaration, SectionGroupMeta } from '../schema/variables'
import type { SectionScreen } from '../skeletons/types'
import { SECTION_GROUP_META, getSectionGroupId, getSectionGroupMeta } from '../schema/variables'
import { extractVariablesFromLayout, extractVariablesFromSections } from './variable-extractor'
import { pathsToDeclarations, declarationToField } from './slot-to-field'

// ============================================
// Generator Options
// ============================================

export interface EditorGeneratorOptions {
  /** Layout 스키마 (변수 추출 소스) */
  layout?: LayoutSchema
  /** 섹션 스크린 배열 (layout 대신 사용 가능) */
  screens?: SectionScreen[]
  /** AI/Skeleton이 제공한 변수 선언 */
  declarations?: VariableDeclaration[]
  /** 표준 변수 폴백 사용 여부 (기본: true) */
  fallbackToStandard?: boolean
  /** 알 수 없는 변수 휴리스틱 추론 (기본: true) */
  inferUnknown?: boolean
  /** 섹션 그룹화 활성화 (기본: true) */
  groupBySection?: boolean
}

// ============================================
// Editor Generation
// ============================================

/**
 * Layout + 변수 선언에서 EditorSection 자동 생성
 */
export function generateEditorSectionsFromLayout(
  options: EditorGeneratorOptions
): EditorSection[] {
  const {
    layout,
    screens,
    declarations = [],
    fallbackToStandard = true,
    inferUnknown = true,
    groupBySection = true,
  } = options

  // 1. 변수 경로 추출
  let usedPaths: string[] = []
  if (layout) {
    usedPaths = extractVariablesFromLayout(layout)
  } else if (screens) {
    usedPaths = extractVariablesFromSections(screens)
  }

  if (usedPaths.length === 0) {
    return []
  }

  // 2. 경로를 VariableDeclaration으로 변환
  const resolvedDeclarations = pathsToDeclarations(
    usedPaths,
    fallbackToStandard || inferUnknown ? declarations : undefined
  )

  // 폴백 비활성화 시 제공된 선언만 사용
  const finalDeclarations = fallbackToStandard || inferUnknown
    ? resolvedDeclarations
    : declarations.filter((d) => usedPaths.includes(d.path))

  if (finalDeclarations.length === 0) {
    return []
  }

  // 3. 섹션 그룹화
  if (groupBySection) {
    return groupDeclarationsIntoSections(finalDeclarations)
  }

  // 그룹화 비활성화 시 단일 섹션 생성
  return [
    {
      id: 'all-fields',
      title: '모든 필드',
      icon: 'edit',
      order: 0,
      fields: finalDeclarations.map((d, i) => declarationToField(d, i + 1)),
    },
  ]
}

/**
 * VariableDeclaration을 섹션별로 그룹화하여 EditorSection[] 생성
 */
function groupDeclarationsIntoSections(
  declarations: VariableDeclaration[]
): EditorSection[] {
  // 섹션 그룹별로 분류
  const groups = new Map<string, VariableDeclaration[]>()

  for (const decl of declarations) {
    const groupId = getSectionGroupId(decl.path)
    const existing = groups.get(groupId) || []
    existing.push(decl)
    groups.set(groupId, existing)
  }

  // EditorSection 생성
  const sections: EditorSection[] = []

  groups.forEach((groupDecls, groupId) => {
    const meta = getSectionGroupMeta(groupDecls[0].path)

    // 표준 그룹은 meta.id 사용, 비표준은 원래 groupId 사용 (중복 키 방지)
    const isStandardGroup = groupId in SECTION_GROUP_META
    const sectionId = isStandardGroup ? meta.id : groupId

    // 그룹 내 선언을 EditorField로 변환
    const fields: EditorField[] = groupDecls.map((decl, index) =>
      declarationToField(decl, index + 1)
    )

    sections.push({
      id: sectionId,
      title: isStandardGroup ? meta.title : groupId,
      icon: meta.icon,
      order: meta.order,
      fields,
    })
  })

  // order 기준 정렬
  sections.sort((a, b) => a.order - b.order)

  return sections
}

// ============================================
// Merge with Existing Sections
// ============================================

/**
 * 기존 EditorSection에 새 필드 병합
 */
export function mergeEditorSections(
  existingSections: EditorSection[],
  newSections: EditorSection[]
): EditorSection[] {
  const merged = new Map<string, EditorSection>()

  // 기존 섹션 등록
  for (const section of existingSections) {
    merged.set(section.id, { ...section, fields: [...section.fields] })
  }

  // 새 섹션 병합
  for (const newSection of newSections) {
    const existing = merged.get(newSection.id)

    if (existing) {
      // 기존 섹션에 새 필드 추가 (중복 제거)
      const existingDataPaths = new Set(existing.fields.map((f) => f.dataPath))

      for (const field of newSection.fields) {
        if (!existingDataPaths.has(field.dataPath)) {
          existing.fields.push(field)
        }
      }

      // order 재정렬
      existing.fields = existing.fields.map((f, i) => ({ ...f, order: i + 1 }))
    } else {
      // 새 섹션 추가
      merged.set(newSection.id, { ...newSection })
    }
  }

  // 배열로 변환 후 정렬
  return Array.from(merged.values()).sort((a, b) => a.order - b.order)
}

// ============================================
// Custom Section Generation
// ============================================

/**
 * 커스텀 변수만 별도 섹션으로 생성
 */
export function generateCustomSection(
  customDeclarations: VariableDeclaration[]
): EditorSection | null {
  if (customDeclarations.length === 0) {
    return null
  }

  const customMeta = SECTION_GROUP_META.custom

  return {
    id: customMeta.id,
    title: customMeta.title,
    icon: customMeta.icon,
    order: customMeta.order,
    fields: customDeclarations.map((decl, index) =>
      declarationToField(decl, index + 1)
    ),
  }
}

// ============================================
// Compatibility Wrapper
// ============================================

/**
 * 기존 generateEditorSections와 호환되는 래퍼
 * Layout이 제공되면 새 방식, 아니면 기존 방식 사용
 */
export function generateEditorSectionsCompat(
  options: EditorGeneratorOptions | null,
  legacyFallback?: () => EditorSection[]
): EditorSection[] {
  // 새 방식: layout 또는 screens가 제공됨
  if (options && (options.layout || options.screens)) {
    return generateEditorSectionsFromLayout(options)
  }

  // 레거시 폴백
  if (legacyFallback) {
    return legacyFallback()
  }

  return []
}
