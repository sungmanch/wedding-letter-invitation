/**
 * Greeting Section EditorSection
 * 인사말 섹션 에디터 스키마
 */

import type { EditorSection } from '../../schema/editor'

export const greetingEditorSection: EditorSection = {
  id: 'greeting',
  title: '인사말',
  icon: 'message-square',
  order: 2,
  fields: [
    {
      id: 'greeting-title',
      type: 'text',
      label: '인사말 제목',
      dataPath: 'greeting.title',
      required: false,
      order: 1,
      placeholder: '저희 결혼합니다',
    },
    {
      id: 'greeting-content',
      type: 'textarea',
      label: '인사말',
      dataPath: 'greeting.content',
      required: false,
      order: 2,
      rows: 5,
      placeholder: '서로를 향한 마음을 모아\n평생을 함께하고자 합니다.\n\n귀한 걸음 하시어\n저희의 새 출발을 축복해 주시면\n더없는 기쁨이 되겠습니다.',
    },
  ],
}
