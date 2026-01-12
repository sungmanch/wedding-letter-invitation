/**
 * Game Timer Hook
 *
 * 게임 시간 측정
 */

import { useState, useRef, useCallback } from 'react'

export interface UseGameTimerReturn {
  elapsedTime: number  // 밀리초
  isRunning: boolean
  start: () => void
  stop: () => number  // 최종 시간 반환
  reset: () => void
}

export function useGameTimer(): UseGameTimerReturn {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const start = useCallback(() => {
    if (isRunning) return

    startTimeRef.current = Date.now()
    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current)
    }, 100)
  }, [isRunning])

  const stop = useCallback(() => {
    if (!isRunning) return elapsedTime

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const finalTime = Date.now() - startTimeRef.current
    setElapsedTime(finalTime)
    setIsRunning(false)

    return finalTime
  }, [isRunning, elapsedTime])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setElapsedTime(0)
    setIsRunning(false)
    startTimeRef.current = 0
  }, [])

  return {
    elapsedTime,
    isRunning,
    start,
    stop,
    reset,
  }
}
