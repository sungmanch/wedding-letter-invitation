/**
 * Guestbook Section - EditorSchema Fields
 * 축하 메시지 / 방명록
 */

import type { EditorSection } from '../../schema/editor'

export const guestbookEditorSection: EditorSection = {
  id: 'guestbook',
  title: '축하 메시지',
  description: '방명록 설정',
  icon: 'message-square',
  order: 6,
  fields: [
    {
      id: 'guestbook-enabled',
      type: 'switch',
      label: '방명록 활성화',
      description: '방문자가 축하 메시지를 남길 수 있습니다',
      dataPath: 'guestbook.enabled',
      defaultValue: true,
      order: 0,
    },
    {
      id: 'guestbook-cta-text',
      type: 'text',
      label: 'CTA 버튼 텍스트',
      description: '방명록 작성 버튼에 표시될 문구',
      dataPath: 'guestbook.ctaText',
      placeholder: '축하 메시지 남기기',
      defaultValue: '축하 메시지 남기기',
      order: 1,
      conditions: [
        { field: 'guestbook.enabled', operator: 'equals', value: true },
      ],
    },
  ],
}
