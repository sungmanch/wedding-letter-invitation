/**
 * Calendar Block - Handwritten Countdown Preset
 *
 * 손글씨 스타일의 날짜와 D-day 카운트다운
 * 왼쪽 세로 "WEDDING DAY" 라벨이 특징
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 1. 세로 WEDDING DAY 텍스트 (왼쪽 장식 - absolute)
  // Note: writingMode는 렌더러에서 'vertical-rl'로 처리 필요
  {
    id: 'vertical-label',
    type: 'text',
    layoutMode: 'absolute',
    x: 3,
    y: 10,
    width: 6,
    height: 50,
    zIndex: 0,
    value: 'WEDDING DAY',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--accent-default)',
        textAlign: 'center',
        letterSpacing: 0.3,
      },
    },
  },
  // 2. 날짜 (2026년 3월 22일)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'wedding.dateDisplay',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-display)',
        fontSize: 28,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // 3. 시간 (토요일 낮 1시 50분)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'wedding.timeDisplay',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // 4. 커플 이름 + D-day 메시지
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'text',
      format: '{couple.groom.name} ♥ {couple.bride.name}의 결혼식이 {wedding.dday}일 남았습니다.',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 5. 구분선
  {
    type: 'divider',
    zIndex: 1,
    sizing: {
      width: { type: 'fill' },
      height: { type: 'fixed', value: 1, unit: 'px' },
    },
    props: { type: 'divider', dividerStyle: 'solid' },
    style: {
      background: 'var(--border-default)',
    },
  },
  // 6. 주간 달력 그룹
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'vertical',
        gap: 8,
        alignItems: 'center',
      },
    },
    children: [
      // 요일 헤더
      {
        id: 'weekday-row',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: {
            direction: 'horizontal',
            gap: 0,
            alignItems: 'center',
            justifyContent: 'space-around',
          },
        },
        children: [
          {
            id: 'wd-1',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            value: '금',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'wd-2',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            value: '토',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'wd-3',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            value: '일',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--accent-default)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'wd-4',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            value: '월',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'wd-5',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            value: '화',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 400,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
        ],
      },
      // 날짜 숫자 + 하트 마커
      {
        id: 'date-row',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: {
            direction: 'horizontal',
            gap: 0,
            alignItems: 'center',
            justifyContent: 'space-around',
          },
        },
        children: [
          {
            id: 'day-1',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            value: '20',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 400,
                color: 'var(--fg-default)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'day-2',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            value: '21',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 400,
                color: 'var(--fg-default)',
                textAlign: 'center',
              },
            },
          },
          // 중앙 - 하트 + 날짜
          {
            id: 'day-center',
            type: 'group',
            zIndex: 2,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            props: {
              type: 'group',
              layout: {
                direction: 'vertical',
                gap: 0,
                alignItems: 'center',
                justifyContent: 'center',
              },
            },
            children: [
              {
                id: 'heart-marker',
                type: 'icon',
                zIndex: 1,
                sizing: {
                  width: { type: 'fixed', value: 45, unit: 'px' },
                  height: { type: 'fixed', value: 45, unit: 'px' },
                },
                props: { type: 'icon', icon: 'heart-filled', size: 45, color: 'var(--accent-default)' },
              },
              {
                id: 'day-3',
                type: 'text',
                zIndex: 2,
                sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
                binding: 'wedding.day',
                props: { type: 'text' },
                style: {
                  text: {
                    fontFamily: 'var(--font-display)',
                    fontSize: 28,
                    fontWeight: 500,
                    color: 'var(--fg-inverse)',
                    textAlign: 'center',
                  },
                },
              },
            ],
          },
          {
            id: 'day-4',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            value: '23',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 400,
                color: 'var(--fg-default)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'day-5',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            value: '24',
            props: { type: 'text' },
            style: {
              text: {
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 400,
                color: 'var(--fg-default)',
                textAlign: 'center',
              },
            },
          },
        ],
      },
    ],
  },
  // 7. 구분선
  {
    type: 'divider',
    zIndex: 1,
    sizing: {
      width: { type: 'fill' },
      height: { type: 'fixed', value: 1, unit: 'px' },
    },
    props: { type: 'divider', dividerStyle: 'solid' },
    style: {
      background: 'var(--border-default)',
    },
  },
  // 8. 카운트다운 (손글씨 스타일)
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    children: [
      {
        id: 'cd-days',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        binding: 'countdown.days',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
        },
      },
      {
        id: 'cd-sep1',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        value: ':',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
        },
      },
      {
        id: 'cd-hours',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        binding: 'countdown.hours',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
        },
      },
      {
        id: 'cd-sep2',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        value: ':',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
        },
      },
      {
        id: 'cd-minutes',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        binding: 'countdown.minutes',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
        },
      },
      {
        id: 'cd-sep3',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        value: ':',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--fg-default)',
            textAlign: 'center',
          },
        },
      },
      {
        id: 'cd-seconds',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        binding: 'countdown.seconds',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 400,
            color: 'var(--fg-muted)',
            textAlign: 'center',
          },
        },
      },
    ],
  },
  // 9. 카운트다운 라벨
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    children: [
      {
        id: 'lbl-days',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        value: 'DAYS',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 500,
            color: 'var(--fg-muted)',
            textAlign: 'center',
            letterSpacing: 0.1,
          },
        },
      },
      {
        id: 'lbl-hours',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        value: 'HOURS',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 500,
            color: 'var(--fg-muted)',
            textAlign: 'center',
            letterSpacing: 0.1,
          },
        },
      },
      {
        id: 'lbl-minutes',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        value: 'MINUTES',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 500,
            color: 'var(--fg-muted)',
            textAlign: 'center',
            letterSpacing: 0.1,
          },
        },
      },
      {
        id: 'lbl-seconds',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        value: 'SECONDS',
        props: { type: 'text' },
        style: {
          text: {
            fontFamily: 'var(--font-body)',
            fontSize: 10,
            fontWeight: 500,
            color: 'var(--fg-muted)',
            textAlign: 'center',
            letterSpacing: 0.1,
          },
        },
      },
    ],
  },
]

export const CALENDAR_HANDWRITTEN_COUNTDOWN: BlockPreset = {
  id: 'calendar-handwritten-countdown',
  blockType: 'calendar',
  variant: 'handwritten-countdown',
  name: 'Handwritten Countdown',
  nameKo: '손글씨 카운트다운',
  description: '손글씨 스타일의 날짜와 D-day 카운트다운, 왼쪽 세로 WEDDING DAY 라벨이 특징',
  tags: ['handwritten', 'romantic', 'natural', 'countdown', 'heart', 'auto-layout'],
  complexity: 'medium',
  bindings: [
    'wedding.date',
    'wedding.dateDisplay',
    'wedding.timeDisplay',
    'wedding.day',
    'wedding.dday',
    'countdown.days',
    'countdown.hours',
    'countdown.minutes',
    'countdown.seconds',
    'couple.groom.name',
    'couple.bride.name',
  ],
  defaultHeight: HUG_HEIGHT,
  layout: AUTO_LAYOUT_VERTICAL,
  defaultElements: ELEMENTS,
  specialComponents: ['icon', 'countdown', 'group', 'vertical-text'],
  recommendedAnimations: ['fade-in', 'stagger-fade-up', 'number-flip'],
  recommendedThemes: ['natural-handwritten', 'natural-witty', 'romantic-soft'],
  aiHints: {
    mood: ['romantic', 'natural', 'warm', 'handwritten'],
    style: ['vertical-label', 'heart-marker', 'inline-countdown', 'auto-layout'],
    useCase: ['wedding-date', 'countdown', 'calendar'],
  },
}
