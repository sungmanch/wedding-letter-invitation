/**
 * Calendar Block - Heart Strip Countdown Preset
 *
 * 5일 주간 스트립 캘린더와 하트 마커, 인라인 D-day 메시지,
 * 테두리만 있는 카운트다운 박스를 조합한 로맨틱 캘린더 (Auto Layout)
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
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        letterSpacing: 0.15,
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
  // 3. Week Strip Calendar (5일 스트립) - border 없음, divider 사용
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'vertical',
        gap: 0,
        alignItems: 'center',
      },
    },
    style: {
      padding: { top: 0, bottom: 0, left: 16, right: 16 },
    },
    children: [
      // Divider 1 - 요일 위
      {
        id: 'divider-top',
        type: 'divider',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 1, unit: 'px' } },
        props: { type: 'divider', dividerStyle: 'solid' },
        style: {
          background: 'var(--border-default)',
        },
      },
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
          padding: { top: 12, bottom: 12, left: 0, right: 0 },
        },
        children: [
          {
            id: 'wd-1',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            binding: 'wedding.weekdayMinus2',
            props: { type: 'text' },
            style: {
              text: { fontSize: 14, fontWeight: 400, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'wd-2',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            binding: 'wedding.weekdayMinus1',
            props: { type: 'text' },
            style: {
              text: { fontSize: 14, fontWeight: 400, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'wd-3',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            binding: 'wedding.weekday',
            props: { type: 'text' },
            style: {
              text: {
                fontSize: 14,
                fontWeight: 500,
                color: '#EF90CB',
                textAlign: 'center',
              },
            },
          },
          {
            id: 'wd-4',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            binding: 'wedding.weekdayPlus1',
            props: { type: 'text' },
            style: {
              text: { fontSize: 14, fontWeight: 400, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'wd-5',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            binding: 'wedding.weekdayPlus2',
            props: { type: 'text' },
            style: {
              text: { fontSize: 14, fontWeight: 400, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
        ],
      },
      // Divider 2 - 요일과 날짜 사이
      {
        id: 'divider-middle',
        type: 'divider',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 1, unit: 'px' } },
        props: { type: 'divider', dividerStyle: 'solid' },
        style: {
          background: 'var(--border-default)',
        },
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
        style: {
          padding: { top: 12, bottom: 12, left: 0, right: 0 },
        },
        children: [
          {
            id: 'day-1',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            binding: 'wedding.dayMinus2',
            props: { type: 'text' },
            style: {
              text: { fontSize: 28, fontWeight: 400, color: 'var(--fg-default)', textAlign: 'center' },
            },
          },
          {
            id: 'day-2',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            binding: 'wedding.dayMinus1',
            props: { type: 'text' },
            style: {
              text: { fontSize: 28, fontWeight: 400, color: 'var(--fg-default)', textAlign: 'center' },
            },
          },
          // 중앙 - 하트 마커 오버레이 + 날짜
          {
            id: 'day-center',
            type: 'group',
            zIndex: 2,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'fixed', value: 48, unit: 'px' } },
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
              // 하트 마커 (absolute로 배경처럼 깔림) - calendar1.svg 사용
              {
                id: 'heart-marker',
                type: 'icon',
                layoutMode: 'absolute',
                x: 50,
                y: 50,
                width: 100,
                height: 100,
                zIndex: 0,
                props: { type: 'icon', icon: 'calendar1', size: 44, color: '#EF90CB' },
              },
              // 날짜 (하트 위에 표시) - 흰색 텍스트
              {
                id: 'day-3',
                type: 'text',
                zIndex: 2,
                sizing: { width: { type: 'fill' }, height: { type: 'fill' } },
                binding: 'wedding.day',
                props: { type: 'text' },
                style: {
                  text: {
                    fontSize: 28,
                    fontWeight: 600,
                    color: '#FFFFFF',
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
            binding: 'wedding.dayPlus1',
            props: { type: 'text' },
            style: {
              text: { fontSize: 28, fontWeight: 400, color: 'var(--fg-default)', textAlign: 'center' },
            },
          },
          {
            id: 'day-5',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fixed', value: 50, unit: 'px' }, height: { type: 'hug' } },
            binding: 'wedding.dayPlus2',
            props: { type: 'text' },
            style: {
              text: { fontSize: 28, fontWeight: 400, color: 'var(--fg-default)', textAlign: 'center' },
            },
          },
        ],
      },
      // Divider 3 - 날짜 아래
      {
        id: 'divider-bottom',
        type: 'divider',
        zIndex: 1,
        sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 1, unit: 'px' } },
        props: { type: 'divider', dividerStyle: 'solid' },
        style: {
          background: 'var(--border-default)',
        },
      },
    ],
  },
  // 4. D-day Message Group (인라인: 신랑 ♡ 신부의 결혼식이 N일 남았습니다.)
  {
    type: 'group',
    zIndex: 1,
    sizing: { width: { type: 'fill' }, height: { type: 'hug' } },
    props: {
      type: 'group',
      layout: {
        direction: 'horizontal',
        gap: 0,
        alignItems: 'center',
        justifyContent: 'center',
        wrap: true,
      },
    },
    children: [
      // 신랑 이름
      {
        id: 'dday-groom-name',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        binding: 'couple.groom.name',
        props: { type: 'text' },
        style: {
          text: { fontSize: 14, fontWeight: 400, color: 'var(--fg-default)', lineHeight: 1.6 },
        },
      },
      // 하트 아이콘 (외곽선 스타일)
      {
        id: 'dday-heart-icon',
        type: 'icon',
        zIndex: 1,
        sizing: { width: { type: 'fixed', value: 20, unit: 'px' }, height: { type: 'fixed', value: 20, unit: 'px' } },
        props: {
          type: 'icon',
          icon: 'heart-outline',
          size: 16,
          color: '#EF90CB',
        },
      },
      // 신부 이름 + "의 결혼식이"
      {
        id: 'dday-bride-text',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        props: { type: 'text', format: '{couple.bride.name}의 결혼식이 ' },
        style: {
          text: { fontSize: 14, fontWeight: 400, color: 'var(--fg-default)', lineHeight: 1.6 },
        },
      },
      // D-day 숫자 (강조 색상)
      {
        id: 'dday-number',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        binding: 'wedding.dday',
        props: { type: 'text' },
        style: {
          text: { fontSize: 14, fontWeight: 600, color: '#EF90CB', lineHeight: 1.6 },
        },
      },
      // "일 남았습니다."
      {
        id: 'dday-suffix',
        type: 'text',
        zIndex: 1,
        sizing: { width: { type: 'hug' }, height: { type: 'hug' } },
        value: '일 남았습니다.',
        props: { type: 'text' },
        style: {
          text: { fontSize: 14, fontWeight: 400, color: 'var(--fg-default)', lineHeight: 1.6 },
        },
      },
    ],
  },
  // 5. Countdown Boxes Group (DAYS, HOURS, MINUTES, SECONDS) - 테두리만, 배경 없음
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
      // Days Box
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
              text: { fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'value-days',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 60, unit: 'px' } },
            binding: 'countdown.days',
            props: { type: 'text' },
            style: {
              text: { fontSize: 32, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'center' },
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 4 },
            },
          },
        ],
      },
      // Hours Box
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
              text: { fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'value-hours',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 60, unit: 'px' } },
            binding: 'countdown.hours',
            props: { type: 'text' },
            style: {
              text: { fontSize: 32, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'center' },
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 4 },
            },
          },
        ],
      },
      // Minutes Box
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
              text: { fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'value-minutes',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 60, unit: 'px' } },
            binding: 'countdown.minutes',
            props: { type: 'text' },
            style: {
              text: { fontSize: 32, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'center' },
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 4 },
            },
          },
        ],
      },
      // Seconds Box
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
              text: { fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)', textAlign: 'center' },
            },
          },
          {
            id: 'value-seconds',
            type: 'text',
            zIndex: 1,
            sizing: { width: { type: 'fill' }, height: { type: 'fixed', value: 60, unit: 'px' } },
            binding: 'countdown.seconds',
            props: { type: 'text' },
            style: {
              text: { fontSize: 32, fontWeight: 600, color: 'var(--fg-default)', textAlign: 'center' },
              border: { width: 1, color: 'var(--border-default)', style: 'solid', radius: 4 },
            },
          },
        ],
      },
    ],
  },
]

export const CALENDAR_HEART_STRIP_COUNTDOWN: BlockPreset = {
  id: 'calendar-heart-strip-countdown',
  blockType: 'calendar',
  variant: 'heart-strip-countdown',
  name: 'Heart Strip Countdown',
  nameKo: '하트 스트립 카운트다운',
  description:
    '5일 주간 스트립 캘린더와 하트 마커, 인라인 D-day 메시지, 테두리만 있는 카운트다운 박스를 조합한 로맨틱 캘린더 (Auto Layout)',
  tags: ['romantic', 'heart', 'countdown', 'strip', 'minimal-border', 'auto-layout'],
  complexity: 'medium',
  bindings: [
    'wedding.date',
    'wedding.dateDisplay',
    'wedding.day',
    'wedding.dday',
    'wedding.weekday',
    'wedding.weekdayMinus2',
    'wedding.weekdayMinus1',
    'wedding.weekdayPlus1',
    'wedding.weekdayPlus2',
    'wedding.dayMinus2',
    'wedding.dayMinus1',
    'wedding.dayPlus1',
    'wedding.dayPlus2',
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
  recommendedThemes: ['simple-pink', 'romantic-blush', 'classic-ivory'],
  aiHints: {
    mood: ['romantic', 'warm', 'elegant'],
    style: ['strip-calendar', 'heart-marker', 'inline-dday', 'border-only-countdown', 'auto-layout'],
    useCase: ['한글 청첩장', '카운트다운 강조', 'D-day 표시', '로맨틱 스타일'],
  },
}
