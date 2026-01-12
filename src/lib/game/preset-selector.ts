/**
 * Preset Selector for Memory Game
 *
 * 각 섹션 타입별로 랜덤 프리셋을 선택
 */

import type { BlockType } from '@/lib/super-editor-v2/schema/types'
import {
  getBlockPresetsByType,
  type BlockPreset,
} from '@/lib/super-editor-v2/presets/blocks'

// 게임에서 사용할 섹션 타입들 (14개)
export const GAME_SECTION_TYPES: BlockType[] = [
  'hero',
  'gallery',
  'greeting-parents',
  'profile',
  'calendar',
  'rsvp',
  'notice',
  'location',
  'account',
  'message',
  'contact',
  'interview',
  'ending',
  'wreath',
]

// 섹션 타입별 한글 이름
export const SECTION_TYPE_NAMES: Record<string, string> = {
  'hero': '히어로',
  'gallery': '갤러리',
  'greeting-parents': '인사말',
  'profile': '프로필',
  'calendar': '캘린더',
  'rsvp': 'RSVP',
  'notice': '공지사항',
  'location': '오시는 길',
  'account': '축의금',
  'message': '방명록',
  'contact': '연락처',
  'interview': '인터뷰',
  'ending': '엔딩',
  'wreath': '화환',
  'divider': '구분선',
  'music': '음악',
  'video': '동영상',
}

export interface GamePreset {
  sectionType: BlockType
  sectionName: string
  preset: BlockPreset
}

/**
 * 각 섹션 타입별로 랜덤 프리셋 1개씩 선택
 */
export function selectRandomPresets(): GamePreset[] {
  const result: GamePreset[] = []

  for (const sectionType of GAME_SECTION_TYPES) {
    const presets = getBlockPresetsByType(sectionType)

    if (presets.length === 0) {
      console.warn(`No presets found for section type: ${sectionType}`)
      continue
    }

    // 랜덤 프리셋 선택
    const randomIndex = Math.floor(Math.random() * presets.length)
    const selectedPreset = presets[randomIndex]

    result.push({
      sectionType,
      sectionName: SECTION_TYPE_NAMES[sectionType],
      preset: selectedPreset,
    })
  }

  return result
}

/**
 * 게임 카드 생성 (각 프리셋 2장씩)
 */
export interface GameCard {
  id: number
  pairId: number  // 같은 프리셋을 가진 카드는 같은 pairId
  gamePreset: GamePreset
}

export function createGameCards(presets: GamePreset[]): GameCard[] {
  const cards: GameCard[] = []

  presets.forEach((gamePreset, index) => {
    // 같은 프리셋으로 2장의 카드 생성
    cards.push({
      id: index * 2,
      pairId: index,
      gamePreset,
    })
    cards.push({
      id: index * 2 + 1,
      pairId: index,
      gamePreset,
    })
  })

  return cards
}

/**
 * 카드 배열 셔플 (Fisher-Yates)
 */
export function shuffleCards<T>(cards: T[]): T[] {
  const shuffled = [...cards]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}
