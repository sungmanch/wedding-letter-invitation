/**
 * Music Section - 기본 템플릿
 * 배경음악 FAB (플로팅 버튼)
 */

import type { Screen } from '../../schema/layout'

export const musicTemplate: Screen = {
  id: 'music',
  name: '배경음악',
  type: 'custom',
  sectionType: 'music',
  root: {
    id: 'music-root',
    type: 'conditional',
    props: {
      condition: '{{bgm.enabled}}',
    },
    children: [
      {
        id: 'music-fab',
        type: 'container',
        style: {
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        },
        children: [
          {
            id: 'bgm-player',
            type: 'bgm-player',
            props: {
              presetId: '{{bgm.presetId}}',
              autoplay: '{{bgm.autoplay}}',
              variant: 'fab',
            },
            style: {
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
        ],
      },
    ],
  },
}
