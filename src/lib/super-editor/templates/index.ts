/**
 * Super Editor Templates
 * 사전 정의된 청첩장 템플릿 모음
 */

export * from './kakao-chat'
export * from './wkw-film'
export * from './gallery-museum'
export * from './kakao-interview'

// Template registry for easy access
import { kakaoTemplate } from './kakao-chat'
import { wkwFilmTemplate } from './wkw-film'
import { galleryMuseumTemplate } from './gallery-museum'
import { kakaoInterviewTemplate } from './kakao-interview'

export const templates = {
  'kakao-chat': kakaoTemplate,
  'wkw-film': wkwFilmTemplate,
  'gallery-museum': galleryMuseumTemplate,
  'kakao-interview': kakaoInterviewTemplate,
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
