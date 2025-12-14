/**
 * Boarding Pass Intro Builder
 * Letterpress embossed ticket style - Travel theme wedding invitation
 * 레터프레스 엠보싱 효과 + 티켓 모양 + 바코드 장식
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { IntroBuilder, IntroBuilderResult, IntroBuilderContext } from './types'
import { uid, formatDate, withOpacity } from './types'

// Boarding Pass 고유 색상
const BP_COLORS = {
  surface: '#FFFFFF',
  background: '#FAF8F5',
  primary: '#C4A4A4',       // 로즈 핑크 (레터프레스 잉크)
  text: '#8B7676',          // 따뜻한 그레이
  textMuted: '#B8A8A8',     // 연한 로즈 그레이
  accent: '#D4B5B5',        // 밝은 로즈
}

export const buildBoardingPassIntro: IntroBuilder = (ctx: IntroBuilderContext): IntroBuilderResult => {
  const { data } = ctx
  const { groomName, brideName, weddingDate, venueName } = data

  // 데이터 바인딩 표현식인지 확인
  const isBinding = (val: string) => val.startsWith('{{')

  // 날짜 파싱
  const dateInfo = isBinding(weddingDate)
    ? { month: 'MAR', day: '15', year: '2025', dayOfWeek: 'Saturday', time: '18:30pm' }
    : parseDateInfo(weddingDate)

  // 장소 코드 생성
  const venueCode = venueName && !isBinding(venueName)
    ? venueName.slice(0, 3).toUpperCase()
    : 'WED'

  const root: PrimitiveNode = {
    id: uid('bp-root'),
    type: 'fullscreen',
    style: {
      backgroundColor: BP_COLORS.background,
      backgroundImage: `
        radial-gradient(ellipse at 20% 30%, ${withOpacity(BP_COLORS.surface, 0.4)} 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, ${withOpacity(BP_COLORS.surface, 0.3)} 0%, transparent 50%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    },
    children: [
      createTicketContainer(groomName, brideName, dateInfo, venueCode, venueName || ''),
    ],
  }

  return { root }
}

/**
 * 날짜 정보 파싱
 */
function parseDateInfo(dateStr: string) {
  const date = new Date(dateStr)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'

  return {
    month: monthNames[date.getMonth()],
    day: date.getDate().toString(),
    year: date.getFullYear().toString(),
    dayOfWeek: dayNames[date.getDay()],
    time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${ampm}`,
  }
}

/**
 * 메인 티켓 컨테이너
 */
function createTicketContainer(
  groomName: string,
  brideName: string,
  dateInfo: { month: string; day: string; year: string; dayOfWeek: string; time: string },
  venueCode: string,
  venueName: string
): PrimitiveNode {
  return {
    id: uid('ticket-container'),
    type: 'container',
    style: {
      width: '100%',
      maxWidth: '360px',
      position: 'relative',
    },
    children: [
      createTicketMain(groomName, brideName, dateInfo, venueCode, venueName),
      createLeftNotch(),
      createRightNotch(),
      createDashedLine(),
      createWelcomeStamp(),
    ],
  }
}

/**
 * 티켓 메인 카드
 */
function createTicketMain(
  groomName: string,
  brideName: string,
  dateInfo: { month: string; day: string; year: string; dayOfWeek: string; time: string },
  venueCode: string,
  venueName: string
): PrimitiveNode {
  return {
    id: uid('ticket-main'),
    type: 'container',
    style: {
      backgroundColor: BP_COLORS.surface,
      borderRadius: '16px',
      boxShadow: `
        0 2px 8px ${withOpacity(BP_COLORS.text, 0.06)},
        0 8px 24px ${withOpacity(BP_COLORS.text, 0.05)},
        inset 0 1px 0 rgba(255,255,255,0.8)
      `,
      overflow: 'visible',
    },
    children: [
      // Upper Section - Header & Names
      createUpperSection(groomName, brideName),
      // Lower Section - Flight Info
      createLowerSection(dateInfo, venueCode, venueName),
    ],
  }
}

/**
 * 상단 섹션 (헤더 + 이름)
 */
function createUpperSection(groomName: string, brideName: string): PrimitiveNode {
  return {
    id: uid('upper-section'),
    type: 'container',
    style: {
      padding: '24px 24px 64px 24px',
    },
    children: [
      createFirstClassBadge(),
      createBoardingPassTitle(),
      createNamesSection(groomName, brideName),
    ],
  }
}

/**
 * First Class 뱃지
 */
function createFirstClassBadge(): PrimitiveNode {
  return {
    id: uid('first-class'),
    type: 'text',
    style: {
      fontSize: '10px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: BP_COLORS.textMuted,
      textShadow: '0 1px 0 rgba(255,255,255,0.8)',
      marginBottom: '16px',
      textAlign: 'center',
    },
    props: {
      content: '✦✦ First Class Ticket ✦✦',
    },
  }
}

/**
 * BOARDING PASS 타이틀
 */
function createBoardingPassTitle(): PrimitiveNode {
  return {
    id: uid('bp-title'),
    type: 'text',
    style: {
      fontSize: '20px',
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      color: BP_COLORS.primary,
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 500,
      textAlign: 'center',
      marginBottom: '24px',
      // 레터프레스 엠보싱 효과
      textShadow: `
        0 1px 1px rgba(255,255,255,0.9),
        0 -1px 1px ${withOpacity(BP_COLORS.primary, 0.2)}
      `,
    },
    props: {
      content: 'Boarding Pass',
      as: 'h2',
    },
  }
}

/**
 * 이름 섹션
 */
function createNamesSection(groomName: string, brideName: string): PrimitiveNode {
  return {
    id: uid('names-section'),
    type: 'column',
    style: {
      alignItems: 'center',
      gap: '8px',
    },
    children: [
      // Invitation text
      {
        id: uid('invite-text'),
        type: 'text',
        style: {
          fontSize: '10px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: BP_COLORS.textMuted,
          marginBottom: '8px',
        },
        props: {
          content: 'You are cordially invited to the wedding of',
        },
      },
      // Groom
      createNameLabel('Groom'),
      createNameText(groomName),
      // Heart
      {
        id: uid('heart'),
        type: 'text',
        style: {
          fontSize: '24px',
          color: BP_COLORS.accent,
          margin: '8px 0',
        },
        props: {
          content: '♥',
        },
      },
      // Bride
      createNameLabel('Bride'),
      createNameText(brideName),
    ],
  }
}

/**
 * 이름 라벨 (Groom/Bride)
 */
function createNameLabel(label: string): PrimitiveNode {
  return {
    id: uid(`label-${label.toLowerCase()}`),
    type: 'text',
    style: {
      fontSize: '9px',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: BP_COLORS.textMuted,
    },
    props: {
      content: label,
    },
  }
}

/**
 * 이름 텍스트 (레터프레스 효과)
 */
function createNameText(name: string): PrimitiveNode {
  return {
    id: uid('name-text'),
    type: 'text',
    style: {
      fontSize: '28px',
      fontFamily: 'Cormorant Garamond, serif',
      fontWeight: 500,
      letterSpacing: '0.08em',
      color: BP_COLORS.primary,
      // 깊은 레터프레스 효과
      textShadow: `
        0 2px 2px rgba(255,255,255,0.95),
        0 -1px 1px ${withOpacity(BP_COLORS.primary, 0.15)},
        1px 1px 0 rgba(255,255,255,0.5)
      `,
    },
    props: {
      content: name,
      as: 'h1',
    },
  }
}

/**
 * 하단 섹션 (날짜/시간/장소 + 바코드)
 */
function createLowerSection(
  dateInfo: { month: string; day: string; year: string; dayOfWeek: string; time: string },
  venueCode: string,
  venueName: string
): PrimitiveNode {
  return {
    id: uid('lower-section'),
    type: 'container',
    style: {
      padding: '48px 24px 24px 24px',
    },
    children: [
      createFlightInfoGrid(dateInfo, venueCode),
      venueName ? createVenueInfo(venueName) : null,
      createBarcode(dateInfo),
    ].filter(Boolean) as PrimitiveNode[],
  }
}

/**
 * 날짜/시간/목적지 그리드
 */
function createFlightInfoGrid(
  dateInfo: { month: string; day: string; year: string; dayOfWeek: string; time: string },
  venueCode: string
): PrimitiveNode {
  return {
    id: uid('flight-info'),
    type: 'row',
    style: {
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    children: [
      createInfoColumn('Date', `${dateInfo.month} ${dateInfo.day}th`, dateInfo.year),
      createInfoColumn('Time', dateInfo.time, dateInfo.dayOfWeek),
      createInfoColumn('Destination', venueCode, 'Seoul'),
    ],
  }
}

/**
 * 정보 컬럼 (라벨 + 값 + 서브)
 */
function createInfoColumn(label: string, value: string, sub: string): PrimitiveNode {
  return {
    id: uid(`info-${label.toLowerCase()}`),
    type: 'column',
    style: {
      alignItems: 'center',
      flex: 1,
    },
    children: [
      {
        id: uid('col-label'),
        type: 'text',
        style: {
          fontSize: '9px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: BP_COLORS.textMuted,
          marginBottom: '4px',
        },
        props: { content: label },
      },
      {
        id: uid('col-value'),
        type: 'text',
        style: {
          fontSize: '18px',
          fontFamily: 'Cormorant Garamond, serif',
          fontWeight: 500,
          color: BP_COLORS.primary,
          textShadow: '0 1px 0 rgba(255,255,255,0.8)',
        },
        props: { content: value },
      },
      {
        id: uid('col-sub'),
        type: 'text',
        style: {
          fontSize: '10px',
          color: BP_COLORS.textMuted,
        },
        props: { content: sub },
      },
    ],
  }
}

/**
 * 장소 정보
 */
function createVenueInfo(venueName: string): PrimitiveNode {
  return {
    id: uid('venue-info'),
    type: 'column',
    style: {
      alignItems: 'center',
      marginBottom: '16px',
    },
    children: [
      {
        id: uid('venue-label'),
        type: 'text',
        style: {
          fontSize: '9px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: BP_COLORS.textMuted,
          marginBottom: '4px',
        },
        props: { content: 'Venue' },
      },
      {
        id: uid('venue-name'),
        type: 'text',
        style: {
          fontSize: '14px',
          color: BP_COLORS.text,
        },
        props: { content: venueName },
      },
    ],
  }
}

/**
 * 바코드 섹션
 */
function createBarcode(
  dateInfo: { month: string; day: string; year: string }
): PrimitiveNode {
  // 바코드 높이 패턴 생성
  const heights = Array.from({ length: 30 }, (_, i) => 20 + ((i * 11 + 5) % 24))

  return {
    id: uid('barcode-section'),
    type: 'column',
    style: {
      alignItems: 'center',
      marginTop: '16px',
    },
    children: [
      // 바코드 바
      {
        id: uid('barcode-bars'),
        type: 'row',
        style: {
          gap: '1px',
          opacity: 0.6,
        },
        children: heights.map((h, i) => ({
          id: uid(`bar-${i}`),
          type: 'container',
          style: {
            width: '2px',
            height: `${h}px`,
            backgroundColor: BP_COLORS.primary,
          },
        })),
      },
      // 바코드 번호
      {
        id: uid('barcode-number'),
        type: 'text',
        style: {
          fontSize: '8px',
          letterSpacing: '0.3em',
          fontFamily: 'monospace',
          color: BP_COLORS.text,
          opacity: 0.4,
          marginTop: '8px',
        },
        props: {
          content: `${dateInfo.year}${dateInfo.month.toUpperCase()} • WEDDING`,
        },
      },
    ],
  }
}

/**
 * 왼쪽 노치
 */
function createLeftNotch(): PrimitiveNode {
  return {
    id: uid('left-notch'),
    type: 'container',
    style: {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: BP_COLORS.background,
    },
  }
}

/**
 * 오른쪽 노치
 */
function createRightNotch(): PrimitiveNode {
  return {
    id: uid('right-notch'),
    type: 'container',
    style: {
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translate(50%, -50%)',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: BP_COLORS.background,
    },
  }
}

/**
 * 점선 구분선
 */
function createDashedLine(): PrimitiveNode {
  return {
    id: uid('dashed-line'),
    type: 'container',
    style: {
      position: 'absolute',
      left: '24px',
      right: '24px',
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: `2px dashed ${withOpacity(BP_COLORS.textMuted, 0.3)}`,
    },
  }
}

/**
 * Welcome 스탬프
 */
function createWelcomeStamp(): PrimitiveNode {
  return {
    id: uid('welcome-stamp'),
    type: 'container',
    style: {
      position: 'absolute',
      bottom: '-8px',
      right: '-8px',
      width: '80px',
      height: '80px',
      opacity: 0.2,
      transform: 'rotate(-15deg)',
    },
    children: [
      {
        id: uid('stamp-circle'),
        type: 'container',
        style: {
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: `3px dashed ${BP_COLORS.primary}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
        children: [
          {
            id: uid('stamp-welcome'),
            type: 'text',
            style: {
              fontSize: '10px',
              fontWeight: 700,
              color: BP_COLORS.primary,
              fontFamily: 'Cormorant Garamond, serif',
            },
            props: { content: 'WELCOME' },
          },
          {
            id: uid('stamp-to'),
            type: 'text',
            style: {
              fontSize: '8px',
              color: BP_COLORS.primary,
            },
            props: { content: 'TO OUR' },
          },
          {
            id: uid('stamp-wedding'),
            type: 'text',
            style: {
              fontSize: '8px',
              color: BP_COLORS.primary,
            },
            props: { content: 'WEDDING' },
          },
        ],
      },
    ],
  }
}
