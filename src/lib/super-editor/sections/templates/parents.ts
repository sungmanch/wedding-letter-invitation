/**
 * Parents Section - 기본 템플릿
 * 혼주 소개 (편부모/보호자 등 동적 지원)
 */

import type { Screen } from '../../schema/layout'

export const parentsTemplate: Screen = {
  id: 'parents',
  name: '혼주 소개',
  type: 'content',
  sectionType: 'parents',
  root: {
    id: 'parents-root',
    type: 'container',
    style: {
      padding: 24,
      backgroundColor: '#faf5f0',
    },
    children: [
      {
        id: 'parents-title',
        type: 'text',
        props: {
          content: '혼주 소개',
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
        id: 'parents-row',
        type: 'row',
        style: {
          justifyContent: 'center',
          gap: 32,
        },
        children: [
          // 신랑측
          {
            id: 'parents-groom',
            type: 'column',
            style: {
              alignItems: 'center',
              flex: 1,
            },
            children: [
              {
                id: 'groom-side-label',
                type: 'text',
                props: {
                  content: '신랑측',
                  as: 'p',
                },
                style: {
                  fontSize: 14,
                  color: '#888',
                  marginBottom: 12,
                },
              },
              {
                id: 'groom-parents-list',
                type: 'repeat',
                props: {
                  items: '{{parents.groom.members}}',
                  as: 'member',
                },
                children: [
                  {
                    id: 'groom-member-item',
                    type: 'conditional',
                    props: {
                      condition: '{{member.enabled}}',
                    },
                    children: [
                      {
                        id: 'groom-member-row',
                        type: 'row',
                        style: {
                          justifyContent: 'center',
                          gap: 8,
                          marginBottom: 8,
                        },
                        children: [
                          {
                            id: 'groom-member-relation',
                            type: 'text',
                            props: {
                              content: '{{member.relation}}',
                              as: 'span',
                            },
                            style: {
                              fontSize: 14,
                              color: '#666',
                            },
                          },
                          {
                            id: 'groom-member-name',
                            type: 'text',
                            props: {
                              content: '{{member.name}}',
                              as: 'span',
                            },
                            style: {
                              fontSize: 16,
                              fontWeight: 600,
                              color: '#333',
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
          // 신부측
          {
            id: 'parents-bride',
            type: 'column',
            style: {
              alignItems: 'center',
              flex: 1,
            },
            children: [
              {
                id: 'bride-side-label',
                type: 'text',
                props: {
                  content: '신부측',
                  as: 'p',
                },
                style: {
                  fontSize: 14,
                  color: '#888',
                  marginBottom: 12,
                },
              },
              {
                id: 'bride-parents-list',
                type: 'repeat',
                props: {
                  items: '{{parents.bride.members}}',
                  as: 'member',
                },
                children: [
                  {
                    id: 'bride-member-item',
                    type: 'conditional',
                    props: {
                      condition: '{{member.enabled}}',
                    },
                    children: [
                      {
                        id: 'bride-member-row',
                        type: 'row',
                        style: {
                          justifyContent: 'center',
                          gap: 8,
                          marginBottom: 8,
                        },
                        children: [
                          {
                            id: 'bride-member-relation',
                            type: 'text',
                            props: {
                              content: '{{member.relation}}',
                              as: 'span',
                            },
                            style: {
                              fontSize: 14,
                              color: '#666',
                            },
                          },
                          {
                            id: 'bride-member-name',
                            type: 'text',
                            props: {
                              content: '{{member.name}}',
                              as: 'span',
                            },
                            style: {
                              fontSize: 16,
                              fontWeight: 600,
                              color: '#333',
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
    ],
  },
}
