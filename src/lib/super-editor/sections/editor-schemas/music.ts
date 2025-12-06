/**
 * Music Section - EditorSchema Fields
 * 배경음악 설정
 */

import type { EditorSection } from '../../schema/editor'

export const musicEditorSection: EditorSection = {
  id: 'music',
  title: '배경음악',
  description: 'BGM 설정',
  icon: 'music',
  order: 7,
  fields: [
    {
      id: 'bgm-enabled',
      type: 'switch',
      label: '배경음악 사용',
      dataPath: 'bgm.enabled',
      defaultValue: false,
      order: 0,
    },
    {
      id: 'bgm-preset',
      type: 'select',
      label: '음악 선택',
      description: 'DB에서 프리셋 음악을 선택합니다',
      dataPath: 'bgm.presetId',
      options: [], // 런타임에 DB에서 로드
      searchable: true,
      order: 1,
      conditions: [
        { field: 'bgm.enabled', operator: 'equals', value: true },
      ],
    },
    {
      id: 'bgm-autoplay',
      type: 'switch',
      label: '자동 재생',
      description: '페이지 로드 시 자동으로 음악을 재생합니다 (모바일에서는 제한될 수 있음)',
      dataPath: 'bgm.autoplay',
      defaultValue: false,
      order: 2,
      conditions: [
        { field: 'bgm.enabled', operator: 'equals', value: true },
      ],
    },
  ],
}
