/**
 * Venue Section - 기본 템플릿
 * 예식장 위치, 지도, 교통편 안내
 */

import type { Screen } from '../../schema/layout'

export const venueTemplate: Screen = {
  id: 'venue',
  name: '오시는 길',
  type: 'content',
  sectionType: 'venue',
  root: {
    id: 'venue-root',
    type: 'container',
    style: {
      padding: 24,
      backgroundColor: '#fff',
    },
    children: [
      {
        id: 'venue-title',
        type: 'text',
        props: {
          content: '오시는 길',
          as: 'h2',
        },
        style: {
          fontSize: 24,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 24,
          color: '#333',
        },
      },
      {
        id: 'venue-info',
        type: 'column',
        style: {
          alignItems: 'center',
          marginBottom: 20,
        },
        children: [
          {
            id: 'venue-name',
            type: 'text',
            props: {
              content: '{{venue.name}}',
              as: 'p',
            },
            style: {
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 8,
            },
          },
          {
            id: 'venue-hall',
            type: 'text',
            props: {
              content: '{{venue.hall}}',
              as: 'p',
            },
            style: {
              fontSize: 14,
              color: '#666',
              marginBottom: 4,
            },
          },
          {
            id: 'venue-address',
            type: 'text',
            props: {
              content: '{{venue.address}}',
              as: 'p',
            },
            style: {
              fontSize: 14,
              color: '#666',
            },
          },
        ],
      },
      {
        id: 'venue-map',
        type: 'map-embed',
        props: {
          lat: '{{venue.coordinates.lat}}',
          lng: '{{venue.coordinates.lng}}',
          zoom: 16,
          provider: 'kakao',
        },
        style: {
          width: '100%',
          height: 200,
          borderRadius: 12,
          marginBottom: 20,
        },
      },
      {
        id: 'venue-buttons',
        type: 'row',
        style: {
          justifyContent: 'center',
          gap: 12,
          marginBottom: 24,
        },
        children: [
          {
            id: 'venue-naver-btn',
            type: 'button',
            props: {
              label: '네이버 지도',
              variant: 'outline',
              action: {
                type: 'openUrl',
                url: 'https://map.naver.com/v5/search/{{venue.address}}',
              },
            },
            style: {
              padding: '10px 16px',
              fontSize: 14,
              borderRadius: 8,
            },
          },
          {
            id: 'venue-kakao-btn',
            type: 'button',
            props: {
              label: '카카오맵',
              variant: 'outline',
              action: {
                type: 'openUrl',
                url: 'https://map.kakao.com/link/search/{{venue.address}}',
              },
            },
            style: {
              padding: '10px 16px',
              fontSize: 14,
              borderRadius: 8,
            },
          },
        ],
      },
      {
        id: 'venue-transport',
        type: 'column',
        style: {
          gap: 16,
        },
        children: [
          {
            id: 'transport-car',
            type: 'conditional',
            props: {
              condition: '{{venue.transport.car}}',
            },
            children: [
              {
                id: 'transport-car-content',
                type: 'column',
                style: {
                  padding: 16,
                  backgroundColor: '#f8f8f8',
                  borderRadius: 8,
                },
                children: [
                  {
                    id: 'transport-car-title',
                    type: 'text',
                    props: {
                      content: '자가용',
                      as: 'h4',
                    },
                    style: {
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 8,
                    },
                  },
                  {
                    id: 'transport-car-desc',
                    type: 'text',
                    props: {
                      content: '{{venue.transport.car}}',
                      as: 'p',
                    },
                    style: {
                      fontSize: 13,
                      color: '#666',
                      lineHeight: 1.6,
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'transport-subway',
            type: 'conditional',
            props: {
              condition: '{{venue.transport.subway}}',
            },
            children: [
              {
                id: 'transport-subway-content',
                type: 'column',
                style: {
                  padding: 16,
                  backgroundColor: '#f8f8f8',
                  borderRadius: 8,
                },
                children: [
                  {
                    id: 'transport-subway-title',
                    type: 'text',
                    props: {
                      content: '지하철',
                      as: 'h4',
                    },
                    style: {
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 8,
                    },
                  },
                  {
                    id: 'transport-subway-desc',
                    type: 'text',
                    props: {
                      content: '{{venue.transport.subway}}',
                      as: 'p',
                    },
                    style: {
                      fontSize: 13,
                      color: '#666',
                      lineHeight: 1.6,
                    },
                  },
                ],
              },
            ],
          },
          {
            id: 'transport-bus',
            type: 'conditional',
            props: {
              condition: '{{venue.transport.bus}}',
            },
            children: [
              {
                id: 'transport-bus-content',
                type: 'column',
                style: {
                  padding: 16,
                  backgroundColor: '#f8f8f8',
                  borderRadius: 8,
                },
                children: [
                  {
                    id: 'transport-bus-title',
                    type: 'text',
                    props: {
                      content: '버스',
                      as: 'h4',
                    },
                    style: {
                      fontSize: 14,
                      fontWeight: 600,
                      marginBottom: 8,
                    },
                  },
                  {
                    id: 'transport-bus-desc',
                    type: 'text',
                    props: {
                      content: '{{venue.transport.bus}}',
                      as: 'p',
                    },
                    style: {
                      fontSize: 13,
                      color: '#666',
                      lineHeight: 1.6,
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
}
