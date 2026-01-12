'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { DEMO_CARDS, CARD_SIZE, TIMING, type DemoPhase } from './constants'

interface DemoState {
  phase: DemoPhase
  flippedCards: number[]
  matchedCards: number[]
  wrongCards: number[]
  cursorTarget: number | null
  isTapping: boolean
}

const initialState: DemoState = {
  phase: 'idle',
  flippedCards: [],
  matchedCards: [],
  wrongCards: [],
  cursorTarget: null,
  isTapping: false,
}

// Calculate cursor position based on card index
function getCardCenterPosition(cardIndex: number) {
  const card = DEMO_CARDS[cardIndex]
  if (!card) return { x: 0, y: 0 }

  const x = card.position.col * (CARD_SIZE.width + CARD_SIZE.gap) + CARD_SIZE.width / 2
  const y = card.position.row * (CARD_SIZE.height + CARD_SIZE.gap) + CARD_SIZE.height / 2

  return { x, y }
}

export function useDemoAnimation(isVisible: boolean) {
  const [state, setState] = useState<DemoState>(initialState)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const isRunningRef = useRef(false)

  // Clear all timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  // Schedule a state update with timeout
  const scheduleUpdate = useCallback((delay: number, update: Partial<DemoState>) => {
    const timeout = setTimeout(() => {
      setState(prev => ({ ...prev, ...update }))
    }, delay)
    timeoutsRef.current.push(timeout)
  }, [])

  // Run the demo animation sequence
  const runSequence = useCallback(() => {
    if (isRunningRef.current) return
    isRunningRef.current = true

    // Reset to initial state
    setState(initialState)

    // Phase 1: Match success (cards 0 and 1)
    scheduleUpdate(TIMING.tapFirst, {
      phase: 'tap-first',
      cursorTarget: 0,
      isTapping: false,
    })

    scheduleUpdate(TIMING.flipFirst - 100, { isTapping: true })
    scheduleUpdate(TIMING.flipFirst, {
      phase: 'flip-first',
      flippedCards: [0],
      isTapping: false,
    })

    scheduleUpdate(TIMING.tapSecond, {
      phase: 'tap-second',
      cursorTarget: 1,
    })

    scheduleUpdate(TIMING.flipSecond - 100, { isTapping: true })
    scheduleUpdate(TIMING.flipSecond, {
      phase: 'flip-second',
      flippedCards: [0, 1],
      isTapping: false,
    })

    scheduleUpdate(TIMING.matchSuccess, {
      phase: 'match-success',
      matchedCards: [0, 1],
      cursorTarget: null,
    })

    // Phase 2: Mismatch failure (cards 2 and 3)
    scheduleUpdate(TIMING.tapThird, {
      phase: 'tap-third',
      cursorTarget: 2,
    })

    scheduleUpdate(TIMING.flipThird - 100, { isTapping: true })
    scheduleUpdate(TIMING.flipThird, {
      phase: 'flip-third',
      flippedCards: [0, 1, 2],
      isTapping: false,
    })

    scheduleUpdate(TIMING.tapFourth, {
      phase: 'tap-fourth',
      cursorTarget: 3,
    })

    scheduleUpdate(TIMING.flipFourth - 100, { isTapping: true })
    scheduleUpdate(TIMING.flipFourth, {
      phase: 'flip-fourth',
      flippedCards: [0, 1, 2, 3],
      isTapping: false,
    })

    scheduleUpdate(TIMING.mismatchFail, {
      phase: 'mismatch-fail',
      wrongCards: [2, 3],
      cursorTarget: null,
    })

    scheduleUpdate(TIMING.flipBack, {
      phase: 'flip-back',
      flippedCards: [0, 1], // Only matched cards stay flipped
      wrongCards: [],
    })

    scheduleUpdate(TIMING.loopReset, {
      phase: 'loop-reset',
    })

    // Loop restart
    const loopTimeout = setTimeout(() => {
      isRunningRef.current = false
      runSequence()
    }, TIMING.loopTotal)
    timeoutsRef.current.push(loopTimeout)
  }, [scheduleUpdate])

  // Start/stop animation based on visibility
  useEffect(() => {
    if (isVisible) {
      runSequence()
    } else {
      clearAllTimeouts()
      isRunningRef.current = false
      setState(initialState)
    }

    return () => {
      clearAllTimeouts()
      isRunningRef.current = false
    }
  }, [isVisible, runSequence, clearAllTimeouts])

  // Calculate cursor position
  const cursorPosition = state.cursorTarget !== null
    ? getCardCenterPosition(state.cursorTarget)
    : { x: 0, y: 0 }

  return {
    phase: state.phase,
    flippedCards: state.flippedCards,
    matchedCards: state.matchedCards,
    wrongCards: state.wrongCards,
    cursorPosition,
    isTapping: state.isTapping,
    showCursor: state.cursorTarget !== null,
  }
}
