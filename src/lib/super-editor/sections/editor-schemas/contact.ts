/**
 * Contact Section EditorSection
 * 연락처 섹션 에디터 스키마
 */

import type { EditorSection } from '../../schema/editor'

export const contactEditorSection: EditorSection = {
  id: 'contact',
  title: '연락처',
  icon: 'phone',
  order: 3,
  fields: [
    {
      id: 'groom-phone',
      type: 'text',
      label: '신랑 전화번호',
      dataPath: 'couple.groom.phone',
      required: true,
      order: 1,
      placeholder: '010-1234-5678',
    },
    {
      id: 'bride-phone',
      type: 'text',
      label: '신부 전화번호',
      dataPath: 'couple.bride.phone',
      required: true,
      order: 2,
      placeholder: '010-1234-5678',
    },
  ],
}
