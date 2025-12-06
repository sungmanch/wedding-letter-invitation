/**
 * Super Editor - Venue Section Skeleton
 * 예식장 위치 섹션
 */

import type { SectionSkeleton } from '../types'

export const venueSkeleton: SectionSkeleton = {
  sectionType: 'venue',
  name: '오시는 길',
  description: '예식장 위치와 지도, 교통 정보를 표시합니다.',
  defaultVariant: 'map-focus',
  variants: [
    // ============================================
    // Map Focus Variant
    // ============================================
    {
      id: 'map-focus',
      name: '지도 중심',
      description: '지도를 크게 보여주는 레이아웃',
      tags: ['minimal', 'modern', 'clean'],
      structure: {
        id: 'venue-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'venue-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'venue-header',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  {
                    id: 'venue-title',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayMd.fontFamily',
                      fontSize: '$token.typography.displayMd.fontSize',
                      fontWeight: '$token.typography.displayMd.fontWeight',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '오시는 길',
                      as: 'h2',
                    },
                  },
                  {
                    id: 'venue-name',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingMd.fontFamily',
                      fontSize: '$token.typography.headingMd.fontSize',
                      color: '$token.colors.brand',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{venue.name}}',
                      as: 'p',
                    },
                  },
                  {
                    id: 'venue-hall',
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
                      content: '{{venue.hall}}',
                      as: 'p',
                    },
                  },
                ],
              },
              {
                id: 'venue-map',
                type: 'map-embed',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusMd',
                },
                style: {
                  height: '280px',
                  overflow: 'hidden',
                },
                props: {
                  lat: '{{venue.lat}}',
                  lng: '{{venue.lng}}',
                  address: '{{venue.address}}',
                  name: '{{venue.name}}',
                  zoom: 16,
                  provider: 'kakao',
                  showMarker: true,
                  navigationButtons: ['kakao', 'naver', 'tmap'],
                },
              },
              {
                id: 'venue-address',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.xs',
                  padding: '$token.spacing.md',
                  backgroundColor: '$token.colors.surface',
                  borderRadius: '$token.borders.radiusMd',
                },
                children: [
                  {
                    id: 'venue-address-text',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      fontSize: '$token.typography.bodyMd.fontSize',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{venue.address}}',
                      as: 'p',
                    },
                  },
                  {
                    id: 'venue-tel',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodySm.fontFamily',
                      fontSize: '$token.typography.bodySm.fontSize',
                      color: '$token.colors.text.muted',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: 'TEL. {{venue.tel}}',
                      as: 'p',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'venue-name',
          path: 'venue.name',
          type: 'text',
          required: true,
          description: '예식장 이름',
        },
        {
          id: 'venue-hall',
          path: 'venue.hall',
          type: 'text',
          required: false,
          description: '홀 이름',
        },
        {
          id: 'venue-address',
          path: 'venue.address',
          type: 'location',
          required: true,
          description: '주소',
        },
        {
          id: 'venue-lat',
          path: 'venue.lat',
          type: 'text',
          required: true,
          description: '위도',
        },
        {
          id: 'venue-lng',
          path: 'venue.lng',
          type: 'text',
          required: true,
          description: '경도',
        },
        {
          id: 'venue-tel',
          path: 'venue.tel',
          type: 'phone',
          required: false,
          description: '전화번호',
        },
      ],
      options: {
        animations: [
          { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
          { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'inView', duration: 500 },
          { id: 'slide-up', name: '슬라이드 업', preset: 'slide-up', trigger: 'inView', duration: 500 },
        ],
      },
    },

    // ============================================
    // Info Focus Variant
    // ============================================
    {
      id: 'info-focus',
      name: '정보 중심',
      description: '교통 정보를 상세하게 보여주는 레이아웃',
      tags: ['detailed', 'practical', 'informative'],
      structure: {
        id: 'venue-root',
        type: 'container',
        tokenStyle: {
          backgroundColor: '$token.colors.background',
          padding: '$token.spacing.section',
        },
        children: [
          {
            id: 'venue-content',
            type: 'column',
            tokenStyle: {
              gap: '$token.spacing.lg',
            },
            children: [
              {
                id: 'venue-header',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.xs',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  {
                    id: 'venue-title',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.displayMd.fontFamily',
                      fontSize: '$token.typography.displayMd.fontSize',
                      fontWeight: '$token.typography.displayMd.fontWeight',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '오시는 길',
                      as: 'h2',
                    },
                  },
                ],
              },
              {
                id: 'venue-info-card',
                type: 'column',
                tokenStyle: {
                  padding: '$token.spacing.lg',
                  backgroundColor: '$token.colors.surface',
                  borderRadius: '$token.borders.radiusMd',
                  gap: '$token.spacing.md',
                },
                children: [
                  {
                    id: 'venue-name',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingLg.fontFamily',
                      fontSize: '$token.typography.headingLg.fontSize',
                      fontWeight: '$token.typography.headingLg.fontWeight',
                      color: '$token.colors.brand',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{venue.name}}',
                      as: 'h3',
                    },
                  },
                  {
                    id: 'venue-hall',
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
                      content: '{{venue.hall}}',
                      as: 'p',
                    },
                  },
                  {
                    id: 'venue-divider',
                    type: 'divider',
                    tokenStyle: {
                      backgroundColor: '$token.colors.divider',
                    },
                    props: {
                      thickness: 1,
                    },
                  },
                  {
                    id: 'venue-address-text',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodyMd.fontFamily',
                      fontSize: '$token.typography.bodyMd.fontSize',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{venue.address}}',
                      as: 'p',
                    },
                  },
                  {
                    id: 'venue-tel',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.bodySm.fontFamily',
                      fontSize: '$token.typography.bodySm.fontSize',
                      color: '$token.colors.text.muted',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: 'TEL. {{venue.tel}}',
                      as: 'p',
                    },
                  },
                ],
              },
              {
                id: 'venue-map',
                type: 'map-embed',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusMd',
                },
                style: {
                  height: '200px',
                  overflow: 'hidden',
                },
                props: {
                  lat: '{{venue.lat}}',
                  lng: '{{venue.lng}}',
                  address: '{{venue.address}}',
                  name: '{{venue.name}}',
                  zoom: 15,
                  provider: 'kakao',
                  showMarker: true,
                  navigationButtons: ['kakao', 'naver', 'tmap'],
                },
              },
            ],
          },
        ],
      },
      slots: [
        {
          id: 'venue-name',
          path: 'venue.name',
          type: 'text',
          required: true,
          description: '예식장 이름',
        },
        {
          id: 'venue-hall',
          path: 'venue.hall',
          type: 'text',
          required: false,
          description: '홀 이름',
        },
        {
          id: 'venue-address',
          path: 'venue.address',
          type: 'location',
          required: true,
          description: '주소',
        },
        {
          id: 'venue-lat',
          path: 'venue.lat',
          type: 'text',
          required: true,
          description: '위도',
        },
        {
          id: 'venue-lng',
          path: 'venue.lng',
          type: 'text',
          required: true,
          description: '경도',
        },
        {
          id: 'venue-tel',
          path: 'venue.tel',
          type: 'phone',
          required: false,
          description: '전화번호',
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
