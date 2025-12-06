/**
 * Section Templates - 기본 템플릿 Export
 */

export { introTemplate } from './intro'
export { greetingTemplate } from './greeting'
export { venueTemplate } from './venue'
export { dateTemplate } from './date'
export { galleryTemplate } from './gallery'
export { parentsTemplate } from './parents'
export { accountsTemplate } from './accounts'
export { guestbookTemplate } from './guestbook'
export { musicTemplate } from './music'

import type { Screen } from '../../schema/layout'
import type { SectionType } from '../../schema/section-types'
import { introTemplate } from './intro'
import { greetingTemplate } from './greeting'
import { venueTemplate } from './venue'
import { dateTemplate } from './date'
import { galleryTemplate } from './gallery'
import { parentsTemplate } from './parents'
import { accountsTemplate } from './accounts'
import { guestbookTemplate } from './guestbook'
import { musicTemplate } from './music'

/**
 * 섹션 타입별 기본 템플릿 맵
 */
export const SECTION_TEMPLATES: Record<SectionType, Screen> = {
  intro: introTemplate,
  greeting: greetingTemplate,
  venue: venueTemplate,
  date: dateTemplate,
  gallery: galleryTemplate,
  parents: parentsTemplate,
  accounts: accountsTemplate,
  guestbook: guestbookTemplate,
  music: musicTemplate,
}

/**
 * 섹션 타입으로 기본 템플릿 가져오기
 */
export function getSectionTemplate(sectionType: SectionType): Screen {
  return SECTION_TEMPLATES[sectionType]
}

/**
 * 모든 섹션의 기본 템플릿 배열 가져오기
 */
export function getAllSectionTemplates(): Screen[] {
  return Object.values(SECTION_TEMPLATES)
}
