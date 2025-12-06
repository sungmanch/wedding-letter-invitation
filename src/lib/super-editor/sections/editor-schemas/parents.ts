/**
 * Parents Section - EditorSchema Fields
 * 혼주 소개 (편부모/보호자 등 동적 지원)
 */

import type { EditorSection } from '../../schema/editor'

export const parentsEditorSection: EditorSection = {
  id: 'parents',
  title: '혼주 소개',
  description: '양가 부모님/보호자 정보',
  icon: 'users',
  order: 4,
  fields: [
    {
      id: 'groom-parents',
      type: 'group',
      label: '신랑측',
      dataPath: 'parents.groom',
      layout: 'vertical',
      order: 0,
      fields: [
        {
          id: 'groom-parents-members',
          type: 'repeater',
          label: '신랑측 혼주',
          description: '부모님 또는 보호자 정보를 추가하세요',
          dataPath: 'parents.groom.members',
          itemLabel: '{{relation}} {{name}}',
          maxItems: 4,
          minItems: 0,
          sortable: true,
          addLabel: '혼주 추가',
          order: 0,
          fields: [
            {
              id: 'groom-member-enabled',
              type: 'switch',
              label: '표시',
              dataPath: 'enabled',
              defaultValue: true,
              order: 0,
            },
            {
              id: 'groom-member-relation',
              type: 'text',
              label: '관계',
              dataPath: 'relation',
              placeholder: '예) 아버지, 어머니, 삼촌',
              required: true,
              order: 1,
            },
            {
              id: 'groom-member-name',
              type: 'text',
              label: '이름',
              dataPath: 'name',
              placeholder: '이름을 입력하세요',
              required: true,
              order: 2,
            },
          ],
        },
      ],
    },
    {
      id: 'bride-parents',
      type: 'group',
      label: '신부측',
      dataPath: 'parents.bride',
      layout: 'vertical',
      order: 1,
      fields: [
        {
          id: 'bride-parents-members',
          type: 'repeater',
          label: '신부측 혼주',
          description: '부모님 또는 보호자 정보를 추가하세요',
          dataPath: 'parents.bride.members',
          itemLabel: '{{relation}} {{name}}',
          maxItems: 4,
          minItems: 0,
          sortable: true,
          addLabel: '혼주 추가',
          order: 0,
          fields: [
            {
              id: 'bride-member-enabled',
              type: 'switch',
              label: '표시',
              dataPath: 'enabled',
              defaultValue: true,
              order: 0,
            },
            {
              id: 'bride-member-relation',
              type: 'text',
              label: '관계',
              dataPath: 'relation',
              placeholder: '예) 아버지, 어머니, 이모',
              required: true,
              order: 1,
            },
            {
              id: 'bride-member-name',
              type: 'text',
              label: '이름',
              dataPath: 'name',
              placeholder: '이름을 입력하세요',
              required: true,
              order: 2,
            },
          ],
        },
      ],
    },
  ],
}
