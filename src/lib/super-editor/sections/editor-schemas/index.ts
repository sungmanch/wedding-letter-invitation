/**
 * Section EditorSchemas - Export
 */

export { introEditorSection } from './intro'
export { greetingEditorSection } from './greeting'
export { contactEditorSection } from './contact'
export { venueEditorSection } from './venue'
export { dateEditorSection } from './date'
export { galleryEditorSection } from './gallery'
export { parentsEditorSection } from './parents'
export { accountsEditorSection } from './accounts'
export { guestbookEditorSection } from './guestbook'
export { musicEditorSection } from './music'

import type { EditorSection } from '../../schema/editor'
import type { SectionType } from '../../schema/section-types'
import { introEditorSection } from './intro'
import { greetingEditorSection } from './greeting'
import { contactEditorSection } from './contact'
import { venueEditorSection } from './venue'
import { dateEditorSection } from './date'
import { galleryEditorSection } from './gallery'
import { parentsEditorSection } from './parents'
import { accountsEditorSection } from './accounts'
import { guestbookEditorSection } from './guestbook'
import { musicEditorSection } from './music'

/**
 * 섹션 타입별 EditorSection 맵
 */
export const SECTION_EDITOR_SCHEMAS: Record<SectionType, EditorSection> = {
  intro: introEditorSection,
  greeting: greetingEditorSection,
  contact: contactEditorSection,
  venue: venueEditorSection,
  date: dateEditorSection,
  gallery: galleryEditorSection,
  parents: parentsEditorSection,
  accounts: accountsEditorSection,
  guestbook: guestbookEditorSection,
  music: musicEditorSection,
}

/**
 * 섹션 타입으로 EditorSection 가져오기
 */
export function getSectionEditorSchema(sectionType: SectionType): EditorSection {
  return SECTION_EDITOR_SCHEMAS[sectionType]
}

/**
 * 모든 섹션의 EditorSection 배열 가져오기
 */
export function getAllSectionEditorSchemas(): EditorSection[] {
  return Object.values(SECTION_EDITOR_SCHEMAS)
}
