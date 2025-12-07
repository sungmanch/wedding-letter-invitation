/**
 * Super Editor - Music Section Skeleton
 * 배경음악 섹션 (FAB 형태)
 */

import type { SectionSkeleton } from '../types'

export const musicSkeleton: SectionSkeleton = {
  sectionType: 'music',
  name: '배경음악',
  description: '배경음악 플레이어를 표시합니다.',
  defaultVariant: 'fab',
  variants: [
    // ============================================
    // FAB (Floating Action Button) Variant
    // ============================================
    {
      id: 'fab',
      name: 'FAB',
      description: '플로팅 버튼 형태의 음악 컨트롤',
      tags: ['minimal', 'modern', 'clean'],
      structure: {
        id: 'music-root',
        type: 'bgm-player',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          borderRadius: '$token.borders.radiusFull',
          boxShadow: '$token.shadows.md',
        },
        style: {
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        },
        props: {
          trackId: '{{bgm.trackId}}',
          autoplay: true,
          loop: true,
          volume: 0.5,
          fadeIn: 1000,
          fadeOut: 500,
          showControls: true,
          controlsPosition: 'bottom-right',
          controlsStyle: 'minimal',
        },
      },
      slots: [
        {
          id: 'bgm-track',
          path: 'bgm.trackId',
          type: 'text',
          required: false,
          description: 'BGM 프리셋 ID',
          defaultValue: 'romantic-piano-01',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'mount', duration: 300 },
        ],
        layouts: [
          { id: 'bottom-right', name: '우측 하단', props: { controlsPosition: 'bottom-right' } },
          { id: 'bottom-left', name: '좌측 하단', props: { controlsPosition: 'bottom-left' } },
          { id: 'top-right', name: '우측 상단', props: { controlsPosition: 'top-right' } },
          { id: 'top-left', name: '좌측 상단', props: { controlsPosition: 'top-left' } },
        ],
      },
    },

    // ============================================
    // Inline Variant
    // ============================================
    {
      id: 'inline',
      name: '인라인',
      description: '페이지에 포함된 음악 섹션',
      tags: ['elegant', 'visible', 'interactive'],
      structure: {
        id: 'music-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.lg',
        },
        children: [
          {
            id: 'music-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.md',
            },
            style: {
              alignItems: 'center',
            },
            children: [
              {
                id: 'music-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.headingSm.fontFamily',
                  fontSize: '$token.typography.headingSm.fontSize',
                  color: '$token.colors.text.secondary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '배경음악',
                  as: 'h3',
                },
              },
              {
                id: 'music-player',
                type: 'bgm-player',
                tokenStyle: {
                  backgroundColor: '$token.colors.background',
                  borderRadius: '$token.borders.radiusLg',
                  boxShadow: '$token.shadows.sm',
                  padding: '$token.spacing.md',
                },
                style: {
                  width: '100%',
                  maxWidth: '300px',
                },
                props: {
                  trackId: '{{bgm.trackId}}',
                  autoplay: false,
                  loop: true,
                  volume: 0.6,
                  fadeIn: 500,
                  showControls: true,
                  controlsStyle: 'vinyl',
                },
              },
              {
                id: 'music-track-name',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.caption.fontFamily',
                  fontSize: '$token.typography.caption.fontSize',
                  color: '$token.colors.text.muted',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '{{bgm.title}} - {{bgm.artist}}',
                  as: 'p',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'bgm-track',
          path: 'bgm.trackId',
          type: 'text',
          required: false,
          description: 'BGM 프리셋 ID',
          defaultValue: 'romantic-piano-01',
        },
        {
          id: 'bgm-title',
          path: 'bgm.title',
          type: 'text',
          required: false,
          description: '곡 제목',
        },
        {
          id: 'bgm-artist',
          path: 'bgm.artist',
          type: 'text',
          required: false,
          description: '아티스트',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
        ],
      },
    },
  ],
}
