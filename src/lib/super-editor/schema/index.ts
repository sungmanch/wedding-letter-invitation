/**
 * Super Editor - Schema Exports
 */

// Primitives
export * from './primitives'

// Layout Schema
export * from './layout'

// Style Schema
export * from './style'

// Editor Schema
export * from './editor'

// User Data Schema
export * from './user-data'

// ============================================
// Combined Template Type
// ============================================

import type { LayoutSchema } from './layout'
import type { StyleSchema } from './style'
import type { EditorSchema } from './editor'
import type { UserData } from './user-data'

/**
 * 전체 템플릿 구조
 * DB에 저장되는 단위
 */
export interface SuperEditorTemplate {
  id: string
  name: string
  description?: string
  thumbnail?: string
  category: string
  tags?: string[]
  // LLM 생성 스키마
  layout: LayoutSchema
  style: StyleSchema
  editor: EditorSchema
  // 메타데이터
  version: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  status: 'draft' | 'published' | 'archived'
  // 통계
  usageCount?: number
  rating?: number
}

/**
 * 빌드된 초대장 구조
 */
export interface SuperEditorInvitation {
  id: string
  templateId: string
  userId: string
  // 사용자 데이터
  userData: UserData
  // 빌드 결과
  buildResult?: BuildResult
  // 메타데이터
  createdAt: string
  updatedAt: string
  publishedAt?: string
  status: 'draft' | 'building' | 'published' | 'error'
}

/**
 * 빌드 결과
 */
export interface BuildResult {
  html: string
  css?: string
  js?: string
  assets?: BuildAsset[]
  buildTime: number
  version: string
  hash: string
}

export interface BuildAsset {
  type: 'image' | 'font' | 'video' | 'audio'
  originalUrl: string
  optimizedUrl: string
  size: number
}

// ============================================
// Schema Validators
// ============================================

/**
 * 스키마 버전 호환성 체크
 */
export function isCompatibleVersion(
  schemaVersion: string,
  minVersion: string
): boolean {
  const [schemaMajor] = schemaVersion.split('.').map(Number)
  const [minMajor] = minVersion.split('.').map(Number)
  return schemaMajor >= minMajor
}

/**
 * 템플릿 유효성 검사 (기본)
 */
export function validateTemplate(template: SuperEditorTemplate): string[] {
  const errors: string[] = []

  if (!template.id) errors.push('Template ID is required')
  if (!template.name) errors.push('Template name is required')
  if (!template.layout) errors.push('Layout schema is required')
  if (!template.style) errors.push('Style schema is required')
  if (!template.editor) errors.push('Editor schema is required')

  if (template.layout && !template.layout.screens?.length) {
    errors.push('At least one screen is required in layout')
  }

  if (template.editor && !template.editor.sections?.length) {
    errors.push('At least one section is required in editor')
  }

  return errors
}
