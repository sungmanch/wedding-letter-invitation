/**
 * Memory Game Hook
 *
 * 메모리 카드 게임 상태 관리
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  selectRandomPresets,
  createGameCards,
  shuffleCards,
  type GameCard,
} from '@/lib/game/preset-selector'
import { calculateScore, type ScoreResult } from '@/lib/game/score-calculator'
import { useGameTimer } from './useGameTimer'

interface CardState {
  card: GameCard
  status: 'hidden' | 'revealed' | 'matched'
  isWrong: boolean  // 틀렸을 때 흔들림 애니메이션용
}

type GamePhase = 'idle' | 'preview' | 'playing' | 'finished'

export interface UseMemoryGameReturn {
  cards: CardState[]
  phase: GamePhase
  mistakes: number
  matchedPairs: number
  totalPairs: number
  elapsedTime: number
  scoreResult: ScoreResult | null

  startGame: () => void
  selectCard: (cardId: number) => void
  resetGame: () => void
}

export function useMemoryGame(): UseMemoryGameReturn {
  const [cards, setCards] = useState<CardState[]>([])
  const [phase, setPhase] = useState<GamePhase>('idle')
  const [mistakes, setMistakes] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [totalPairs, setTotalPairs] = useState(0)
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)

  const timer = useGameTimer()
  const selectedCardsRef = useRef<number[]>([])
  const isProcessingRef = useRef(false)

  // 게임 시작
  const startGame = useCallback(() => {
    // 1. 랜덤 프리셋 선택
    const presets = selectRandomPresets()

    // 2. 카드 생성 (각 프리셋 2장씩)
    const gameCards = createGameCards(presets)

    // 3. 셔플
    const shuffled = shuffleCards(gameCards)

    // 4. CardState 초기화 (모두 revealed 상태로 미리보기)
    const initialCards: CardState[] = shuffled.map((card) => ({
      card,
      status: 'revealed',
      isWrong: false,
    }))

    setCards(initialCards)
    setPhase('preview')
    setMistakes(0)
    setMatchedPairs(0)
    setTotalPairs(presets.length)
    setScoreResult(null)
    timer.reset()

    // 5초 후 카드 뒤집고 플레이 시작
    setTimeout(() => {
      setCards((prev) =>
        prev.map((cs) => ({
          ...cs,
          status: 'hidden',
        }))
      )
      setPhase('playing')
      timer.start()
    }, 5000)
  }, [timer])

  // 카드 선택
  const selectCard = useCallback(
    (cardId: number) => {
      if (phase !== 'playing') return
      if (isProcessingRef.current) return

      const selectedCard = cards.find((cs) => cs.card.id === cardId)
      if (!selectedCard) return
      if (selectedCard.status !== 'hidden') return

      // 카드 공개
      setCards((prev) =>
        prev.map((cs) =>
          cs.card.id === cardId
            ? { ...cs, status: 'revealed' as const }
            : cs
        )
      )

      selectedCardsRef.current.push(cardId)

      // 2장 선택 시 매칭 판정
      if (selectedCardsRef.current.length === 2) {
        isProcessingRef.current = true

        const [firstId, secondId] = selectedCardsRef.current
        const firstCard = cards.find((cs) => cs.card.id === firstId)
        const secondCard = cards.find((cs) => cs.card.id === secondId)

        if (!firstCard || !secondCard) {
          isProcessingRef.current = false
          selectedCardsRef.current = []
          return
        }

        const isMatch = firstCard.card.pairId === secondCard.card.pairId

        if (isMatch) {
          // 매칭 성공
          setCards((prev) =>
            prev.map((cs) =>
              cs.card.id === firstId || cs.card.id === secondId
                ? { ...cs, status: 'matched' as const }
                : cs
            )
          )
          setMatchedPairs((prev) => prev + 1)
          isProcessingRef.current = false
          selectedCardsRef.current = []
        } else {
          // 매칭 실패 - 흔들림 애니메이션 후 1초 뒤 뒤집기
          setCards((prev) =>
            prev.map((cs) =>
              cs.card.id === firstId || cs.card.id === secondId
                ? { ...cs, isWrong: true }
                : cs
            )
          )
          setMistakes((prev) => prev + 1)

          setTimeout(() => {
            setCards((prev) =>
              prev.map((cs) =>
                cs.card.id === firstId || cs.card.id === secondId
                  ? { ...cs, status: 'hidden' as const, isWrong: false }
                  : cs
              )
            )
            isProcessingRef.current = false
            selectedCardsRef.current = []
          }, 1000)
        }
      }
    },
    [phase, cards]
  )

  // 게임 종료 체크
  useEffect(() => {
    if (phase === 'playing' && matchedPairs === totalPairs && totalPairs > 0) {
      const finalTime = timer.stop()
      const result = calculateScore(finalTime, mistakes)
      setScoreResult(result)
      setPhase('finished')
    }
  }, [phase, matchedPairs, totalPairs, mistakes, timer])

  // 게임 리셋
  const resetGame = useCallback(() => {
    setCards([])
    setPhase('idle')
    setMistakes(0)
    setMatchedPairs(0)
    setTotalPairs(0)
    setScoreResult(null)
    timer.reset()
    selectedCardsRef.current = []
    isProcessingRef.current = false
  }, [timer])

  return {
    cards,
    phase,
    mistakes,
    matchedPairs,
    totalPairs,
    elapsedTime: timer.elapsedTime,
    scoreResult,

    startGame,
    selectCard,
    resetGame,
  }
}
