/**
 * Super Editor - PhotoBooth Section Skeleton
 * 포토부스 섹션 - 게스트가 호스트와 함께 사진을 찍을 수 있는 기능
 */

import type { SectionSkeleton } from '../types'

export const photoboothSkeleton: SectionSkeleton = {
  sectionType: 'photobooth',
  name: '포토부스',
  description: '게스트가 호스트(신랑/신부)와 함께 사진을 찍을 수 있는 포토부스입니다.',
  defaultVariant: 'default',
  variants: [
    // ============================================
    // Default Variant
    // ============================================
    {
      id: 'default',
      name: '기본',
      description: '기본 포토부스 레이아웃',
      tags: ['interactive', 'playful', 'modern'],
      structure: {
        id: 'photobooth-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'photobooth-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              // 타이틀
              {
                id: 'photobooth-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.sectionTitle.fontFamily',
                  fontSize: '$token.typography.sectionTitle.fontSize',
                  fontWeight: '$token.typography.sectionTitle.fontWeight',
                  letterSpacing: '$token.typography.sectionTitle.letterSpacing',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                  textTransform: 'uppercase',
                },
                props: {
                  content: 'Photo Booth',
                  as: 'h2',
                },
              },
              // 설명
              {
                id: 'photobooth-description',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodyMd.fontFamily',
                  fontSize: '$token.typography.bodyMd.fontSize',
                  color: '$token.colors.text.secondary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '{{photobooth.description}}',
                  as: 'p',
                },
              },
              // 포토부스 컴포넌트
              {
                id: 'photobooth-camera',
                type: 'photobooth',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusLg',
                },
                props: {
                  title: '{{photobooth.title}}',
                  frames: '{{photobooth.frames}}',
                  defaultFrameIndex: 0,
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'photobooth-title',
          path: 'photobooth.title',
          type: 'text',
          required: false,
          description: '포토부스 타이틀 (사진에 표시)',
          defaultValue: "Our Wedding Day",
        },
        {
          id: 'photobooth-description',
          path: 'photobooth.description',
          type: 'text',
          required: false,
          description: '포토부스 설명 문구',
          defaultValue: '신랑 신부와 함께 특별한 추억을 남겨보세요',
        },
        {
          id: 'photobooth-frames',
          path: 'photobooth.frames',
          type: 'frames',
          required: true,
          description: '포토부스 프레임 목록',
          defaultValue: [],
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Minimal Variant
    // ============================================
    {
      id: 'minimal',
      name: '미니멀',
      description: '간결한 디자인의 포토부스',
      tags: ['minimal', 'clean', 'modern'],
      structure: {
        id: 'photobooth-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'photobooth-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.md',
            },
            children: [
              {
                id: 'photobooth-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.headingMd.fontFamily',
                  fontSize: '$token.typography.headingMd.fontSize',
                  fontWeight: '$token.typography.headingMd.fontWeight',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '📸 포토부스',
                  as: 'h2',
                },
              },
              {
                id: 'photobooth-camera',
                type: 'photobooth',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusMd',
                },
                props: {
                  title: '{{photobooth.title}}',
                  frames: '{{photobooth.frames}}',
                  defaultFrameIndex: 0,
                  compact: true,
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'photobooth-title',
          path: 'photobooth.title',
          type: 'text',
          required: false,
          description: '포토부스 타이틀 (사진에 표시)',
          defaultValue: "Wedding Day",
        },
        {
          id: 'photobooth-frames',
          path: 'photobooth.frames',
          type: 'frames',
          required: true,
          description: '포토부스 프레임 목록',
          defaultValue: [],
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Elegant Variant
    // ============================================
    {
      id: 'elegant',
      name: '우아한',
      description: '고급스러운 디자인의 포토부스',
      tags: ['elegant', 'luxury', 'romantic'],
      structure: {
        id: 'photobooth-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.surface',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'photobooth-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              // 장식선
              {
                id: 'photobooth-divider-top',
                type: 'divider',
                tokenStyle: {
                  backgroundColor: '$token.colors.accent',
                },
                style: {
                  width: '60px',
                  height: '2px',
                  margin: '0 auto',
                },
              },
              // 타이틀
              {
                id: 'photobooth-title',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.displayMd.fontFamily',
                  fontSize: '$token.typography.displayMd.fontSize',
                  fontWeight: '$token.typography.displayMd.fontWeight',
                  letterSpacing: '$token.typography.displayMd.letterSpacing',
                  color: '$token.colors.text.primary',
                },
                style: {
                  textAlign: 'center',
                  fontStyle: 'italic',
                },
                props: {
                  content: 'Photo Booth',
                  as: 'h2',
                },
              },
              // 설명
              {
                id: 'photobooth-description',
                type: 'text',
                tokenStyle: {
                  fontFamily: '$token.typography.bodyMd.fontFamily',
                  fontSize: '$token.typography.bodyMd.fontSize',
                  color: '$token.colors.text.secondary',
                },
                style: {
                  textAlign: 'center',
                },
                props: {
                  content: '{{photobooth.description}}',
                  as: 'p',
                },
              },
              // 포토부스
              {
                id: 'photobooth-camera',
                type: 'photobooth',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusLg',
                },
                style: {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                },
                props: {
                  title: '{{photobooth.title}}',
                  frames: '{{photobooth.frames}}',
                  defaultFrameIndex: 0,
                },
              },
              // 장식선
              {
                id: 'photobooth-divider-bottom',
                type: 'divider',
                tokenStyle: {
                  backgroundColor: '$token.colors.accent',
                },
                style: {
                  width: '60px',
                  height: '2px',
                  margin: '0 auto',
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'photobooth-title',
          path: 'photobooth.title',
          type: 'text',
          required: false,
          description: '포토부스 타이틀 (사진에 표시)',
          defaultValue: "Our Special Day",
        },
        {
          id: 'photobooth-description',
          path: 'photobooth.description',
          type: 'text',
          required: false,
          description: '포토부스 설명 문구',
          defaultValue: '소중한 순간을 함께 기록해주세요',
        },
        {
          id: 'photobooth-frames',
          path: 'photobooth.frames',
          type: 'frames',
          required: true,
          description: '포토부스 프레임 목록',
          defaultValue: [],
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 600 },
          { id: 'scale', name: '스케일 인', preset: 'scale-in', trigger: 'inView', duration: 600 },
        ],
      },
    },
  ],
}
