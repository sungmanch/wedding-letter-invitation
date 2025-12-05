/**
 * Accounts Section - EditorSchema Fields
 * 축의금 계좌 정보 (최대 6개)
 */

import type { EditorSection } from '../../schema/editor'

/**
 * 계좌 정보 필드 그룹 생성 헬퍼
 */
function createAccountGroup(
  id: string,
  label: string,
  dataPath: string,
  order: number
) {
  return {
    id,
    type: 'group' as const,
    label,
    dataPath,
    layout: 'vertical' as const,
    collapsible: true,
    collapsed: true,
    order,
    fields: [
      {
        id: `${id}-enabled`,
        type: 'switch' as const,
        label: '표시',
        dataPath: `${dataPath}.enabled`,
        defaultValue: false,
        order: 0,
      },
      {
        id: `${id}-name`,
        type: 'text' as const,
        label: '예금주',
        dataPath: `${dataPath}.name`,
        placeholder: '예금주명을 입력하세요',
        order: 1,
        conditions: [
          { field: `${dataPath}.enabled`, operator: 'equals' as const, value: true },
        ],
      },
      {
        id: `${id}-accounts`,
        type: 'repeater' as const,
        label: '계좌 목록',
        dataPath: `${dataPath}.accounts`,
        itemLabel: '{{bank}} {{number}}',
        maxItems: 2,
        addLabel: '계좌 추가',
        order: 2,
        conditions: [
          { field: `${dataPath}.enabled`, operator: 'equals' as const, value: true },
        ],
        fields: [
          {
            id: `${id}-bank`,
            type: 'select' as const,
            label: '은행',
            dataPath: 'bank',
            options: [
              { value: '국민은행', label: '국민은행' },
              { value: '신한은행', label: '신한은행' },
              { value: '우리은행', label: '우리은행' },
              { value: '하나은행', label: '하나은행' },
              { value: 'NH농협', label: 'NH농협' },
              { value: '기업은행', label: '기업은행' },
              { value: 'SC제일은행', label: 'SC제일은행' },
              { value: '씨티은행', label: '씨티은행' },
              { value: '카카오뱅크', label: '카카오뱅크' },
              { value: '토스뱅크', label: '토스뱅크' },
              { value: '케이뱅크', label: '케이뱅크' },
              { value: '새마을금고', label: '새마을금고' },
              { value: '우체국', label: '우체국' },
              { value: '수협', label: '수협' },
              { value: '신협', label: '신협' },
            ],
            searchable: true,
            required: true,
            order: 0,
          },
          {
            id: `${id}-number`,
            type: 'text' as const,
            label: '계좌번호',
            dataPath: 'number',
            placeholder: '- 없이 입력하세요',
            required: true,
            order: 1,
          },
        ],
      },
    ],
  }
}

export const accountsEditorSection: EditorSection = {
  id: 'accounts',
  title: '마음 전하실 곳',
  description: '축의금 계좌 정보 (최대 6개)',
  icon: 'credit-card',
  order: 5,
  fields: [
    // 신랑측
    {
      id: 'accounts-groom-section',
      type: 'group',
      label: '신랑측 계좌',
      dataPath: 'accounts',
      layout: 'vertical',
      order: 0,
      fields: [
        createAccountGroup('groom', '신랑', 'accounts.groom', 0),
        createAccountGroup('groom-father', '신랑 아버지', 'accounts.groomFather', 1),
        createAccountGroup('groom-mother', '신랑 어머니', 'accounts.groomMother', 2),
      ],
    },
    // 신부측
    {
      id: 'accounts-bride-section',
      type: 'group',
      label: '신부측 계좌',
      dataPath: 'accounts',
      layout: 'vertical',
      order: 1,
      fields: [
        createAccountGroup('bride', '신부', 'accounts.bride', 0),
        createAccountGroup('bride-father', '신부 아버지', 'accounts.brideFather', 1),
        createAccountGroup('bride-mother', '신부 어머니', 'accounts.brideMother', 2),
      ],
    },
  ],
}
