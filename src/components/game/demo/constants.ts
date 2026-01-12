/**
 * Demo Animation Constants
 */

// Demo card section data
export const DEMO_SECTIONS = {
  gallery: {
    type: 'gallery' as const,
    name: '갤러리',
    color: 'var(--wkw-gold)',
  },
  calendar: {
    type: 'calendar' as const,
    name: '캘린더',
    color: 'var(--blush-400)',
  },
  profile: {
    type: 'profile' as const,
    name: '프로필',
    color: 'var(--warm-500)',
  },
  location: {
    type: 'location' as const,
    name: '오시는 길',
    color: 'var(--blush-500)',
  },
} as const

// Card configuration for demo (4 cards in 2x2 grid)
export interface DemoCardConfig {
  id: number
  sectionKey: keyof typeof DEMO_SECTIONS
  position: { col: number; row: number }
}

// Card layout: 4 cards arranged as 2x2
// Cards 0 & 1 will MATCH (both gallery)
// Cards 2 & 3 will NOT match (calendar vs profile)
export const DEMO_CARDS: DemoCardConfig[] = [
  { id: 0, sectionKey: 'gallery', position: { col: 0, row: 0 } },
  { id: 1, sectionKey: 'gallery', position: { col: 1, row: 0 } },   // Matches card 0
  { id: 2, sectionKey: 'calendar', position: { col: 2, row: 0 } },
  { id: 3, sectionKey: 'profile', position: { col: 3, row: 0 } },   // Different from card 2
]

// Card dimensions (px)
export const CARD_SIZE = {
  width: 44,
  height: 66,
  gap: 8,
}

// Animation timeline (ms)
export const TIMING = {
  // Phase 1: Match success
  cursorAppear: 0,
  tapFirst: 500,
  flipFirst: 1000,
  tapSecond: 1500,
  flipSecond: 2000,
  matchSuccess: 2300,
  matchHold: 3500,

  // Phase 2: Mismatch failure
  tapThird: 4000,
  flipThird: 4500,
  tapFourth: 5000,
  flipFourth: 5500,
  mismatchFail: 5800,
  flipBack: 6500,

  // Loop reset
  loopReset: 7500,
  loopTotal: 8000,
}

// Animation phases
export type DemoPhase =
  | 'idle'
  | 'tap-first'
  | 'flip-first'
  | 'tap-second'
  | 'flip-second'
  | 'match-success'
  | 'tap-third'
  | 'flip-third'
  | 'tap-fourth'
  | 'flip-fourth'
  | 'mismatch-fail'
  | 'flip-back'
  | 'loop-reset'
