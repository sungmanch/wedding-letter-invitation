/**
 * Calendar Block - Week Strip Preset
 *
 * 주간 달력 스트립과 D-day 카운트다운을 함께 보여주는 레이아웃 (Auto Layout)
 */

import type { BlockPreset, PresetElement } from '../types'
import { AUTO_LAYOUT_VERTICAL, HUG_HEIGHT } from './_shared'

const ELEMENTS: PresetElement[] = [
  // 1. Wedding Day Title
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    value: 'WEDDING DAY',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        letterSpacing: 0.2,
      },
    },
  },
  // 2. Full Date Display (Korean with time)
  {
    type: 'text',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    binding: 'wedding.dateDisplay',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 24,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // 3. Week Strip Calendar (주간 스트립)
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
    style: {
      border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 0 },
    },
    children: [
      // 요일 헤더 Row
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
        style: {
          border: { width: 0, color: 'transparent', style: 'solid', radius: 0 },
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
              text: { fontSize: 12, fontWeight: 400, color: 'var(--fg-muted)', textAlign: 'center' },
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
              text: { fontSize: 12, fontWeight: 400, color: 'var(--fg-muted)', textAlign: 'center' },
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
                fontSize: 12,
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
              text: { fontSize: 12, fontWeight: 400, color: 'var(--fg-muted)', textAlign: 'center' },
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
              text: { fontSize: 12, fontWeight: 400, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
        ],
      },
      // 날짜 숫자 Row (가운데 하트 마커)
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
              text: { fontSize: 24, fontWeight: 400, color: 'var(--fg-default)', textAlign: 'center' },
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
              text: { fontSize: 24, fontWeight: 400, color: 'var(--fg-default)', textAlign: 'center' },
            },
          },
          // 중앙 - 하트 마커 + 날짜
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
                  width: { type: 'fixed', value: 35, unit: 'px' },
                  height: { type: 'fixed', value: 35, unit: 'px' },
                },
                props: { type: 'icon', icon: 'calendar1', size: 35 },
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
                    fontSize: 24,
                    fontWeight: 500,
                    color: 'var(--fg-default)',
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
              text: { fontSize: 24, fontWeight: 400, color: 'var(--fg-default)', textAlign: 'center' },
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
              text: { fontSize: 24, fontWeight: 400, color: 'var(--fg-default)', textAlign: 'center' },
            },
          },
        ],
      },
    ],
  },
  // 4. D-day Message
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
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 5. Countdown Boxes Group
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 8,
        alignItems: 'start',
        justifyContent: 'center',
      },
    },
    children: [
      // DAYS
      {
        id: 'countdown-days',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
        },
        children: [
          {
            id: 'label-days',
            type: 'text',
            zIndex: 2,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            value: 'DAYS',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 10,
                fontWeight: 500,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'value-days',
            type: 'text',
            zIndex: 1,
            sizing: {
              width: { type: 'fill' },
              height: { type: 'fixed', value: 60, unit: 'px' },
            },
            binding: 'countdown.days',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 32,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'center',
              },
              background: 'var(--bg-card)',
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
            },
          },
        ],
      },
      // HOURS
      {
        id: 'countdown-hours',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
        },
        children: [
          {
            id: 'label-hours',
            type: 'text',
            zIndex: 2,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            value: 'HOURS',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 10,
                fontWeight: 500,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'value-hours',
            type: 'text',
            zIndex: 1,
            sizing: {
              width: { type: 'fill' },
              height: { type: 'fixed', value: 60, unit: 'px' },
            },
            binding: 'countdown.hours',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 32,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'center',
              },
              background: 'var(--bg-card)',
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
            },
          },
        ],
      },
      // MINUTES
      {
        id: 'countdown-minutes',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
        },
        children: [
          {
            id: 'label-minutes',
            type: 'text',
            zIndex: 2,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            value: 'MINUTES',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 10,
                fontWeight: 500,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'value-minutes',
            type: 'text',
            zIndex: 1,
            sizing: {
              width: { type: 'fill' },
              height: { type: 'fixed', value: 60, unit: 'px' },
            },
            binding: 'countdown.minutes',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 32,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'center',
              },
              background: 'var(--bg-card)',
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
            },
          },
        ],
      },
      // SECONDS
      {
        id: 'countdown-seconds',
        type: 'group',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 70, unit: 'px' }, height: { type: 'hug' } },
        props: {
          type: 'group',
          layout: { direction: 'vertical', gap: 4, alignItems: 'center' },
        },
        children: [
          {
            id: 'label-seconds',
            type: 'text',
            zIndex: 2,
            sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
            value: 'SECONDS',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 10,
                fontWeight: 500,
                color: 'var(--fg-muted)',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'value-seconds',
            type: 'text',
            zIndex: 1,
            sizing: {
              width: { type: 'fill' },
              height: { type: 'fixed', value: 60, unit: 'px' },
            },
            binding: 'countdown.seconds',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 32,
                fontWeight: 600,
                color: 'var(--fg-default)',
                textAlign: 'center',
              },
              background: 'var(--bg-card)',
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 8 },
            },
          },
        ],
      },
    ],
  },
]

export const CALENDAR_WEEK_STRIP: BlockPreset = {
  id: 'calendar-week-strip',
  blockType: 'calendar',
  variant: 'week-strip',
  name: 'Week Strip',
  nameKo: '주간 스트립',
  description: '주간 달력 스트립과 D-day 카운트다운을 함께 보여주는 레이아웃',
  tags: ['modern', 'clean', 'countdown', 'heart', 'minimal', 'auto-layout'],
  complexity: 'medium',
  bindings: [
    'wedding.date',
    'wedding.dateDisplay',
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
  specialComponents: ['icon', 'countdown', 'group'],
  recommendedAnimations: ['fade-in', 'stagger-fade-up', 'number-flip'],
  recommendedThemes: ['minimal-light', 'romantic-blush', 'modern-mono'],
  aiHints: {
    mood: ['romantic', 'modern', 'clean'],
    style: ['card', 'grid', 'centered', 'auto-layout'],
    useCase: ['wedding-date', 'countdown', 'calendar'],
  },
}
