/**
 * Super Editor Templates
 * 사전 정의된 청첩장 템플릿 모음
 */

export * from './kakao-chat'

// Template registry for easy access
import { kakaoTemplate } from './kakao-chat'

export const templates = {
  'kakao-chat': kakaoTemplate,
} as const

export type TemplateId = keyof typeof templates

export function getTemplate(id: TemplateId) {
  return templates[id]
}

export function getAllTemplates() {
  return Object.entries(templates).map(([id, template]) => ({
    id,
    name: template.layout.meta.name,
    category: template.layout.meta.category,
    ...template,
  }))
}
