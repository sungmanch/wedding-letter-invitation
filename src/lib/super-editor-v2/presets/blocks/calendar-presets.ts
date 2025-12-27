/**
 * Super Editor v2 - Calendar Block Presets
 *
 * date skeleton → calendar block 마이그레이션
 * 10개 variants
 */

import type { BlockPreset, PresetElement } from './types'

// ============================================
// Calendar Preset IDs
// ============================================

export type CalendarPresetId = 'calendar-korean-countdown-box'

// ============================================
// Default Elements
// ============================================

const KOREAN_COUNTDOWN_BOX_ELEMENTS: PresetElement[] = [
  // Wedding Day Title (script font)
  {
    type: 'text',
    x: 20,
    y: 2,
    width: 60,
    height: 4,
    zIndex: 1,
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
  // Full Date Display (Korean)
  {
    type: 'text',
    x: 5,
    y: 7,
    width: 90,
    height: 5,
    zIndex: 1,
    binding: 'wedding.dateDisplay',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 20,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // Month Divider Left
  {
    type: 'divider',
    x: 10,
    y: 15.5,
    width: 30,
    height: 0.3,
    zIndex: 1,
    props: { type: 'divider', dividerStyle: 'solid' },
    style: {
      background: 'var(--border-default)',
    },
  },
  // Month Title
  {
    type: 'text',
    x: 40,
    y: 14,
    width: 20,
    height: 4,
    zIndex: 2,
    binding: 'wedding.month',
    props: { type: 'text', format: '{wedding.month}월' },
    style: {
      text: {
        fontSize: 16,
        fontWeight: 500,
        color: 'var(--fg-default)',
        textAlign: 'center',
      },
    },
  },
  // Month Divider Right
  {
    type: 'divider',
    x: 60,
    y: 15.5,
    width: 30,
    height: 0.3,
    zIndex: 1,
    props: { type: 'divider', dividerStyle: 'solid' },
    style: {
      background: 'var(--border-default)',
    },
  },
  // Calendar Grid with Heart Marker
  {
    type: 'calendar',
    x: 5,
    y: 20,
    width: 90,
    height: 40,
    zIndex: 1,
    binding: 'wedding.date',
    props: {
      type: 'calendar',
      showDday: false,
      highlightColor: '#EF90CB',
      markerType: 'heart',
    },
  },
  // Calendar Bottom Divider
  {
    type: 'divider',
    x: 10,
    y: 62,
    width: 80,
    height: 0.3,
    zIndex: 1,
    props: { type: 'divider', dividerStyle: 'solid' },
    style: {
      background: 'var(--border-default)',
    },
  },
  // Line 1: Couple Names with Heart
  // Groom Name
  {
    type: 'text',
    x: 18,
    y: 66,
    width: 15,
    height: 4,
    zIndex: 1,
    binding: 'couple.groom.name',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'right',
      },
    },
  },
  // Heart Icon (heart1.svg)
  {
    type: 'shape',
    x: 34,
    y: 66.3,
    width: 4,
    height: 3.5,
    zIndex: 1,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: '#EF90CB',
      svgPath: 'M15.8428 5.40345V4.80053C15.8864 4.75879 15.9321 4.71473 15.9974 4.65212C15.9669 4.59183 15.9342 4.52458 15.8537 4.36457V3.95644C15.7971 3.90543 15.7645 3.8776 15.7166 3.83586V3.37208C15.6708 3.32106 15.6295 3.27468 15.562 3.19816V2.848C15.5054 2.79698 15.4728 2.76916 15.4336 2.73437V2.36798C15.4684 2.3332 15.5119 2.28914 15.5642 2.24044C15.3857 2.08971 15.205 1.93898 15.0265 1.78825C15.0722 1.57027 14.8872 1.42418 14.8371 1.22476C14.6869 1.2178 14.5345 1.21084 14.3843 1.20389C14.1492 1.02301 14.1209 0.689085 13.7487 0.598647C13.7117 0.624155 13.6572 0.654301 13.6093 0.691404C13.5571 0.730826 13.5114 0.777204 13.4461 0.832858H12.5862C12.5536 0.805031 12.5209 0.777204 12.4861 0.744739C12.4556 0.758653 12.423 0.772566 12.3925 0.791117C12.3729 0.802712 12.3598 0.818944 12.3185 0.853728H11.3084C11.2997 1.0091 11.291 1.14591 11.2823 1.28273C11.217 1.3407 11.1517 1.39636 11.0885 1.45433C11.0428 1.45433 10.9971 1.45433 10.9492 1.45433C10.3506 1.98304 9.75411 2.51639 9.14676 3.03815C9.02921 3.13786 8.98132 3.26077 8.90295 3.37439C8.8137 3.50425 8.7854 3.66426 8.61996 3.76165C8.48935 3.83818 8.38921 3.95644 8.27602 4.05848C8.33697 4.21616 8.0801 4.26718 8.1171 4.43182C8.12581 4.47356 7.9952 4.54081 7.92772 4.59878C7.83411 4.42486 7.67302 4.26718 7.69261 4.0492C7.59683 3.96572 7.47493 4.03065 7.36608 4.00514C7.25289 3.93325 7.3269 3.77093 7.17452 3.71064C7.03955 3.6573 7.0352 3.5228 6.98078 3.42077C6.91765 3.40686 6.85452 3.39063 6.79139 3.37671C6.75874 3.2283 6.66513 3.09149 6.58241 2.96858C6.48227 2.82017 6.40826 2.66712 6.33642 2.50944C6.26894 2.36566 6.02295 2.32392 6.05996 2.1245C5.91193 1.95753 5.65506 1.86246 5.62241 1.61665C5.44173 1.4636 5.25887 1.31056 5.09778 1.17374C5.09343 1.10185 5.09125 1.06243 5.0869 1.00214C4.80391 1.0462 4.74948 0.705317 4.47085 0.72155C4.34676 0.545312 4.10948 0.50589 3.94187 0.380669C3.75901 0.243852 3.55221 0.132544 3.33887 -0.00195312H3.08418C3.00581 0.148777 2.92744 0.304144 2.83819 0.478063H2.27003C2.15901 0.605604 2.22214 0.730826 2.20255 0.846772C2.2918 0.869961 2.41588 0.788799 2.46595 0.918658C2.34404 0.954215 2.25624 0.930253 2.20255 0.846772H2.0001C1.95003 0.886193 1.90214 0.925615 1.85642 0.962718C1.80635 0.925615 1.75846 0.888512 1.69098 0.839815C1.67139 0.91402 1.65615 0.969674 1.63874 1.03924C1.56037 1.11345 1.46676 1.19925 1.37751 1.28273V1.47752C1.32091 1.61202 1.19248 1.70941 1.0684 1.77898C0.942137 1.85086 0.783226 1.87869 0.691797 2.00391V2.36103C0.643906 2.4074 0.598192 2.45146 0.552478 2.4932C0.552478 2.5535 0.552478 2.61379 0.552478 2.68336C0.430573 2.89438 0.304314 3.11236 0.134519 3.40454V4.19297C0.0779199 4.24399 0.0452668 4.27182 0.00825999 4.30428V5.15532C0.0430899 5.19011 0.0888042 5.23417 0.134519 5.27823C0.0909811 5.31997 0.0474437 5.36403 0.00390625 5.40577V5.7652C0.0539743 5.8139 0.0975117 5.85796 0.138872 5.89738V6.22898C0.164995 6.26145 0.204178 6.30551 0.2586 6.37276C0.332614 6.53276 0.184587 6.75538 0.347852 6.9177C0.47411 7.04292 0.323906 7.25163 0.54377 7.33511V7.69686C0.591661 7.74324 0.637376 7.7873 0.685267 7.836V8.07021C0.733158 8.11658 0.778872 8.16064 0.826763 8.2047V8.43891C0.874655 8.48761 0.920369 8.53167 0.961729 8.57109C0.961729 8.67776 0.961729 8.7798 0.961729 8.87951C1.09016 9.09749 1.2186 9.31315 1.36663 9.56359C1.37316 9.65635 1.38187 9.79316 1.39057 9.92302C1.47329 9.94158 1.53642 9.95549 1.59955 9.9694C1.7171 10.0946 1.60173 10.243 1.70622 10.4378C1.74758 10.5004 1.83248 10.6326 1.92608 10.7764V11.0755C2.11112 11.1984 2.05887 11.3863 2.06323 11.5602C2.24826 11.6947 2.19384 11.8825 2.20037 12.0564C2.42241 12.1724 2.23738 12.4553 2.4703 12.5643C2.41806 12.7034 2.62921 12.7521 2.60962 12.8773C2.59003 13.0095 2.64227 13.1069 2.74894 13.1904C2.66622 13.3875 2.89261 13.5058 2.90567 13.6797C3.11901 13.7632 2.96445 13.9719 3.09289 14.0994C3.21479 14.2223 3.26921 14.3962 3.34976 14.5493C3.42159 14.6838 3.4869 14.8252 3.57833 14.9504C3.66976 15.078 3.70459 15.231 3.82649 15.347C3.91357 15.4305 3.79384 15.5789 3.92663 15.6739C4.02676 15.7458 3.9854 15.9058 4.12472 15.9638C4.07248 16.1029 4.27275 16.1516 4.2684 16.2769C4.25969 16.4601 4.49479 16.3487 4.5601 16.4624C4.59928 16.5319 4.68418 16.5783 4.74948 16.6363H4.89533C4.9367 16.7151 4.98023 16.7963 5.02595 16.8798C5.06731 16.8427 5.09996 16.8149 5.13697 16.7824C5.28064 16.7963 5.30894 16.9401 5.53316 16.9934H5.87275C5.93588 16.9238 6.0186 16.8288 6.08391 16.7569C6.17316 16.7569 6.21887 16.7569 6.26459 16.7569C6.3952 16.6433 6.54105 16.5389 6.64989 16.4114C6.76527 16.2745 6.98513 16.3001 7.08527 16.1563C7.23112 15.9429 7.51846 15.8942 7.71656 15.7342C7.91901 15.5696 7.99738 15.34 8.19329 15.1731C8.70486 14.7371 9.20336 14.2895 9.70622 13.8443C9.78676 13.7724 9.86078 13.6936 9.95221 13.6333C10.0175 13.5892 10.1111 13.58 10.183 13.5429C10.2396 13.5127 10.2809 13.4594 10.331 13.4176C10.331 13.3365 10.331 13.2553 10.331 13.1765C10.2853 13.1324 10.2417 13.0907 10.1982 13.0466C10.3484 12.9469 10.6096 12.9585 10.6074 12.7173C10.8055 12.4993 11.0123 12.293 11.2801 12.1399C11.3345 12.1098 11.4151 12.1028 11.4477 12.0611C11.6502 11.8129 12.0072 11.7411 12.227 11.5092C12.4469 11.2773 12.7081 11.0755 12.9519 10.8622C13.0651 10.7625 13.1783 10.6628 13.2937 10.5607C13.4874 10.3891 13.6725 10.2059 13.8815 10.0482C14.0708 9.90447 14.0861 9.65171 14.3234 9.54736V9.28764C14.6194 9.12763 14.6455 8.80299 14.848 8.57805C14.8959 8.52471 14.8785 8.42732 14.9002 8.29514C14.9547 8.24644 15.0809 8.17688 15.1353 8.07716C15.181 7.98904 15.1919 7.89165 15.2942 7.83368V7.46961C15.4488 7.39772 15.414 7.22612 15.5315 7.12873C15.6447 7.03365 15.4836 6.83886 15.6948 6.75538V6.30319C15.7949 6.17101 15.8254 6.04579 15.8624 5.91361C15.8951 5.79071 16.0126 5.68172 15.9821 5.52635C15.943 5.48693 15.8972 5.44287 15.8493 5.39649L15.8428 5.40345Z',
      svgViewBox: '0 0 16 17',
    },
  },
  // Bride Name + "의 결혼식이 "
  {
    type: 'text',
    x: 39,
    y: 66,
    width: 22,
    height: 4,
    zIndex: 1,
    props: {
      type: 'text',
      format: '{couple.bride.name}의 결혼식이 ',
    },
    style: {
      text: {
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'left',
      },
    },
  },
  // D-day Count (Pink) - same line as couple names
  {
    type: 'text',
    x: 61,
    y: 66,
    width: 12,
    height: 4,
    zIndex: 1,
    binding: 'wedding.dday',
    props: { type: 'text', format: '{wedding.dday}일' },
    style: {
      text: {
        fontSize: 14,
        fontWeight: 500,
        color: '#EF90CB',
        textAlign: 'left',
      },
    },
  },
  // "남았습니다." - same line as couple names
  {
    type: 'text',
    x: 73,
    y: 66,
    width: 17,
    height: 4,
    zIndex: 1,
    value: '남았습니다.',
    props: { type: 'text' },
    style: {
      text: {
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'left',
      },
    },
  },
  // Countdown Label - DAYS
  {
    type: 'text',
    x: 8,
    y: 72,
    width: 18,
    height: 3,
    zIndex: 2,
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
  // Countdown Box - Days
  {
    type: 'text',
    x: 8,
    y: 75,
    width: 18,
    height: 10,
    zIndex: 1,
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
  // Countdown Label - HOURS
  {
    type: 'text',
    x: 30,
    y: 72,
    width: 18,
    height: 3,
    zIndex: 2,
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
  // Countdown Box - Hours
  {
    type: 'text',
    x: 30,
    y: 75,
    width: 18,
    height: 10,
    zIndex: 1,
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
  // Countdown Label - MINUTES
  {
    type: 'text',
    x: 52,
    y: 72,
    width: 18,
    height: 3,
    zIndex: 2,
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
  // Countdown Box - Minutes
  {
    type: 'text',
    x: 52,
    y: 75,
    width: 18,
    height: 10,
    zIndex: 1,
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
  // Countdown Label - SECONDS
  {
    type: 'text',
    x: 74,
    y: 72,
    width: 18,
    height: 3,
    zIndex: 2,
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
  // Countdown Box - Seconds
  {
    type: 'text',
    x: 74,
    y: 75,
    width: 18,
    height: 10,
    zIndex: 1,
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
]

// ============================================
// Calendar Block Presets
// ============================================

export const CALENDAR_PRESETS: Record<CalendarPresetId, BlockPreset> = {
  'calendar-korean-countdown-box': {
    id: 'calendar-korean-countdown-box',
    blockType: 'calendar',
    variant: 'korean-countdown-box',
    name: 'Korean Countdown Box',
    nameKo: '한글 카운트다운 박스',
    description:
      '한글 전체 날짜 표기와 4칸 박스형 카운트다운, 커플 이름과 D-day 메시지가 포함된 따뜻한 캘린더',
    tags: ['korean', 'countdown', 'warm', 'romantic', 'box-style'],
    complexity: 'medium',
    bindings: [
      'wedding.date',
      'wedding.dateDisplay',
      'wedding.month',
      'wedding.dday',
      'countdown.days',
      'countdown.hours',
      'countdown.minutes',
      'countdown.seconds',
      'couple.groom.name',
      'couple.bride.name',
    ],
    defaultHeight: 90,
    defaultElements: KOREAN_COUNTDOWN_BOX_ELEMENTS,
    specialComponents: ['calendar', 'countdown'],
    recommendedAnimations: ['fade-in', 'stagger-fade-up', 'number-flip'],
    recommendedThemes: ['classic-ivory', 'romantic-blush', 'cinematic-warm'],
    aiHints: {
      mood: ['warm', 'romantic', 'elegant'],
      style: ['korean-style', 'box-countdown', 'full-date'],
      useCase: ['한글 청첩장', '카운트다운 강조', 'D-day 표시'],
    },
  },
}

// ============================================
// Helper Functions
// ============================================

export function getCalendarPreset(id: CalendarPresetId): BlockPreset {
  return CALENDAR_PRESETS[id]
}

export function getCalendarPresetIds(): CalendarPresetId[] {
  return Object.keys(CALENDAR_PRESETS) as CalendarPresetId[]
}

export function getCalendarPresetsByComplexity(
  complexity: 'low' | 'medium' | 'high'
): BlockPreset[] {
  return Object.values(CALENDAR_PRESETS).filter((p) => p.complexity === complexity)
}
