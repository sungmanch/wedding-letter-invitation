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
                      content: 'LOCATION',
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
          path: 'venue',
          type: 'location',
          required: true,
          description: '주소 (좌표 자동 변환)',
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
                      content: 'LOCATION',
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
          path: 'venue',
          type: 'location',
          required: true,
          description: '주소 (좌표 자동 변환)',
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

    // ============================================
    // With Transport Variant (샘플 5.png 참고)
    // ============================================
    {
      id: 'with-transport',
      name: '교통 안내 포함',
      description: '지도와 교통 안내 정보를 함께 표시',
      tags: ['detailed', 'informative', 'practical'],
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
              // 섹션 타이틀 (영문)
              {
                id: 'venue-section-title',
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
                  content: 'LOCATION',
                  as: 'h2',
                },
              },
              // 예식장 정보 카드
              {
                id: 'venue-info',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.xs',
                },
                style: {
                  alignItems: 'center',
                },
                children: [
                  {
                    id: 'venue-name',
                    type: 'text',
                    tokenStyle: {
                      fontFamily: '$token.typography.headingLg.fontFamily',
                      fontSize: '$token.typography.headingLg.fontSize',
                      fontWeight: '$token.typography.headingLg.fontWeight',
                      color: '$token.colors.text.primary',
                    },
                    style: {
                      textAlign: 'center',
                    },
                    props: {
                      content: '{{venue.name}} {{venue.hall}}',
                      as: 'h3',
                    },
                  },
                  {
                    id: 'venue-address-text',
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
                      content: '{{venue.tel}}',
                      as: 'p',
                    },
                  },
                ],
              },
              // 지도/전화 버튼
              {
                id: 'venue-action-buttons',
                type: 'row',
                tokenStyle: {
                  gap: '$token.spacing.sm',
                },
                style: {
                  justifyContent: 'center',
                },
                children: [
                  {
                    id: 'venue-map-btn',
                    type: 'button',
                    tokenStyle: {
                      borderColor: '$token.colors.border',
                      borderRadius: '$token.borders.radiusFull',
                    },
                    props: {
                      label: '지도',
                      icon: 'map-pin',
                      variant: 'outline',
                      size: 'sm',
                      action: {
                        type: 'link',
                        value: 'https://m.map.naver.com/map.naver?lat={{venue.lat}}&lng={{venue.lng}}',
                      },
                    },
                  },
                  {
                    id: 'venue-call-btn',
                    type: 'button',
                    tokenStyle: {
                      borderColor: '$token.colors.border',
                      borderRadius: '$token.borders.radiusFull',
                    },
                    props: {
                      label: '전화',
                      icon: 'phone',
                      variant: 'outline',
                      size: 'sm',
                      action: {
                        type: 'tel',
                        value: '{{venue.tel}}',
                      },
                    },
                  },
                ],
              },
              // 지도 임베드
              {
                id: 'venue-map',
                type: 'map-embed',
                tokenStyle: {
                  borderRadius: '$token.borders.radiusMd',
                },
                style: {
                  height: '240px',
                  overflow: 'hidden',
                },
                props: {
                  lat: '{{venue.lat}}',
                  lng: '{{venue.lng}}',
                  address: '{{venue.address}}',
                  name: '{{venue.name}}',
                  zoom: 16,
                  provider: 'naver',
                  showMarker: true,
                },
              },
              // 네비게이션 버튼
              {
                id: 'venue-navigation',
                type: 'row',
                tokenStyle: {
                  gap: '$token.spacing.md',
                },
                style: {
                  justifyContent: 'center',
                },
                children: [
                  {
                    id: 'nav-tmap',
                    type: 'button',
                    props: {
                      label: '티맵',
                      icon: 'navigation',
                      variant: 'ghost',
                      size: 'sm',
                      action: {
                        type: 'navigation',
                        provider: 'tmap',
                        address: '{{venue.address}}',
                        lat: '{{venue.lat}}',
                        lng: '{{venue.lng}}',
                      },
                    },
                  },
                  {
                    id: 'nav-kakao',
                    type: 'button',
                    props: {
                      label: '카카오내비',
                      icon: 'navigation',
                      variant: 'ghost',
                      size: 'sm',
                      action: {
                        type: 'navigation',
                        provider: 'kakao',
                        address: '{{venue.address}}',
                        lat: '{{venue.lat}}',
                        lng: '{{venue.lng}}',
                      },
                    },
                  },
                  {
                    id: 'nav-naver',
                    type: 'button',
                    props: {
                      label: '네이버 지도',
                      icon: 'navigation',
                      variant: 'ghost',
                      size: 'sm',
                      action: {
                        type: 'navigation',
                        provider: 'naver',
                        address: '{{venue.address}}',
                        lat: '{{venue.lat}}',
                        lng: '{{venue.lng}}',
                      },
                    },
                  },
                ],
              },
              // 교통 안내
              {
                id: 'transport-info',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                  padding: '$token.spacing.lg',
                  backgroundColor: '$token.colors.surface',
                  borderRadius: '$token.borders.radiusMd',
                },
                children: [
                  // 버스 안내
                  {
                    id: 'transport-bus',
                    type: 'conditional',
                    props: {
                      condition: '{{venue.transport.bus}}',
                    },
                    children: [
                      {
                        id: 'bus-section',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                        },
                        children: [
                          {
                            id: 'bus-title',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.headingSm.fontFamily',
                              fontSize: '$token.typography.headingSm.fontSize',
                              fontWeight: '$token.typography.headingSm.fontWeight',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '버스 안내',
                              as: 'h4',
                            },
                          },
                          {
                            id: 'bus-content',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodySm.fontFamily',
                              fontSize: '$token.typography.bodySm.fontSize',
                              color: '$token.colors.text.secondary',
                            },
                            style: {
                              whiteSpace: 'pre-line',
                            },
                            props: {
                              content: '{{venue.transport.bus}}',
                              as: 'p',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  // 자가용 안내
                  {
                    id: 'transport-car',
                    type: 'conditional',
                    props: {
                      condition: '{{venue.transport.car}}',
                    },
                    children: [
                      {
                        id: 'car-section',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                        },
                        children: [
                          {
                            id: 'car-title',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.headingSm.fontFamily',
                              fontSize: '$token.typography.headingSm.fontSize',
                              fontWeight: '$token.typography.headingSm.fontWeight',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '자가용 안내',
                              as: 'h4',
                            },
                          },
                          {
                            id: 'car-content',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodySm.fontFamily',
                              fontSize: '$token.typography.bodySm.fontSize',
                              color: '$token.colors.text.secondary',
                            },
                            style: {
                              whiteSpace: 'pre-line',
                            },
                            props: {
                              content: '{{venue.transport.car}}',
                              as: 'p',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  // 지하철 안내
                  {
                    id: 'transport-subway',
                    type: 'conditional',
                    props: {
                      condition: '{{venue.transport.subway}}',
                    },
                    children: [
                      {
                        id: 'subway-section',
                        type: 'column',
                        tokenStyle: {
                          gap: '$token.spacing.xs',
                        },
                        children: [
                          {
                            id: 'subway-title',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.headingSm.fontFamily',
                              fontSize: '$token.typography.headingSm.fontSize',
                              fontWeight: '$token.typography.headingSm.fontWeight',
                              color: '$token.colors.text.primary',
                            },
                            props: {
                              content: '지하철 안내',
                              as: 'h4',
                            },
                          },
                          {
                            id: 'subway-content',
                            type: 'text',
                            tokenStyle: {
                              fontFamily: '$token.typography.bodySm.fontFamily',
                              fontSize: '$token.typography.bodySm.fontSize',
                              color: '$token.colors.text.secondary',
                            },
                            style: {
                              whiteSpace: 'pre-line',
                            },
                            props: {
                              content: '{{venue.transport.subway}}',
                              as: 'p',
                            },
                          },
                        ],
                      },
                    ],
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
          path: 'venue',
          type: 'location',
          required: true,
          description: '주소 (좌표 자동 변환)',
        },
        {
          id: 'venue-tel',
          path: 'venue.tel',
          type: 'phone',
          required: false,
          description: '전화번호',
        },
        {
          id: 'transport-bus',
          path: 'venue.transport.bus',
          type: 'text',
          required: false,
          description: '버스 안내',
        },
        {
          id: 'transport-car',
          path: 'venue.transport.car',
          type: 'text',
          required: false,
          description: '자가용 안내',
        },
        {
          id: 'transport-subway',
          path: 'venue.transport.subway',
          type: 'text',
          required: false,
          description: '지하철 안내',
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
  ],
}
