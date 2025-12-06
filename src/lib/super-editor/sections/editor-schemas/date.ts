/**
 * Date Section - EditorSchema Fields
 * 예식 날짜 및 시간
 */

import type { EditorSection } from '../../schema/editor'

export const dateEditorSection: EditorSection = {
  id: 'date',
  title: '예식 일시',
  description: '예식 날짜 및 시간 정보',
  icon: 'calendar',
  order: 2,
  fields: [
    {
      id: 'wedding-date',
      type: 'date',
      label: '예식 날짜',
      dataPath: 'wedding.date',
      required: true,
      order: 0,
    },
    {
      id: 'wedding-time',
      type: 'time',
      label: '예식 시간',
      dataPath: 'wedding.time',
      format: '12h',
      step: 30,
      required: true,
      order: 1,
    },
    {
      id: 'wedding-date-display',
      type: 'text',
      label: '날짜 표시 형식',
      description: '청첩장에 표시될 날짜 형식',
      dataPath: 'wedding.dateDisplay',
      placeholder: '예) 2025년 3월 15일 토요일',
      order: 2,
    },
    {
      id: 'wedding-time-display',
      type: 'text',
      label: '시간 표시 형식',
      description: '청첩장에 표시될 시간 형식',
      dataPath: 'wedding.timeDisplay',
      placeholder: '예) 오후 2시',
      order: 3,
    },
  ],
}
