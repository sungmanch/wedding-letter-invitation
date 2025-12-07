'use client'

/**
 * Super Editor - Event Context
 * 이벤트 핸들링 시스템
 */

import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react'

// ============================================
// Event Types
// ============================================

export type EventType =
  | 'click'
  | 'scroll'
  | 'enter-viewport'
  | 'leave-viewport'
  | 'hover'
  | 'focus'
  | 'blur'
  | 'change'
  | 'submit'

export interface EventAction {
  type: EventActionType
  payload?: Record<string, unknown>
}

export type EventActionType =
  | 'navigate'      // 페이지 이동
  | 'scroll-to'     // 특정 요소로 스크롤
  | 'open-modal'    // 모달 열기
  | 'close-modal'   // 모달 닫기
  | 'copy'          // 클립보드 복사
  | 'share'         // 공유하기
  | 'call'          // 전화걸기
  | 'sms'           // 문자보내기
  | 'map'           // 지도 열기
  | 'kakao-navi'    // 카카오내비 실행
  | 'play-audio'    // 오디오 재생
  | 'pause-audio'   // 오디오 일시정지
  | 'toggle-audio'  // 오디오 토글
  | 'emit'          // 커스텀 이벤트 발생
  | 'set-state'     // 상태 변경
  | 'analytics'     // 분석 이벤트

export interface NodeEventHandler {
  event: EventType
  action: EventAction
  // 조건부 실행
  condition?: string
  // 지연 실행 (ms)
  delay?: number
  // 한 번만 실행
  once?: boolean
}

// ============================================
// Context Type
// ============================================

interface EventContextValue {
  // 이벤트 실행
  executeAction: (action: EventAction) => void
  // 커스텀 이벤트 핸들러 등록
  registerHandler: (eventName: string, handler: () => void) => void
  // 커스텀 이벤트 핸들러 해제
  unregisterHandler: (eventName: string) => void
  // 노드 이벤트 핸들러 생성
  createEventHandlers: (
    nodeId: string,
    events: NodeEventHandler[] | undefined
  ) => Record<string, (e?: React.SyntheticEvent) => void>
  // 모달 상태
  openModals: Set<string>
  openModal: (id: string) => void
  closeModal: (id: string) => void
  // 오디오 컨트롤
  playAudio: (id?: string) => void
  pauseAudio: (id?: string) => void
  toggleAudio: (id?: string) => void
}

// ============================================
// Context
// ============================================

const EventContext = createContext<EventContextValue | null>(null)

// ============================================
// Provider
// ============================================

interface EventProviderProps {
  children: ReactNode
  // 외부 이벤트 핸들러
  onAnalytics?: (eventName: string, data?: Record<string, unknown>) => void
  onCustomEvent?: (eventName: string, data?: Record<string, unknown>) => void
}

export function EventProvider({
  children,
  onAnalytics,
  onCustomEvent,
}: EventProviderProps) {
  // 커스텀 핸들러 저장소
  const handlersRef = useMemo(() => new Map<string, () => void>(), [])

  // 모달 상태 (실제 상태 관리는 외부에서 처리)
  const openModals = useMemo(() => new Set<string>(), [])

  // 상태 변경 함수 (실제 구현은 외부에서)
  const setOpenModals = useCallback((_updater: (prev: Set<string>) => Set<string>) => {
    // 추후 상태 관리 연동
  }, [])

  // 액션 실행
  const executeAction = useCallback((action: EventAction) => {
    switch (action.type) {
      case 'navigate':
        const url = action.payload?.url as string
        const target = (action.payload?.target as string) || '_self'
        if (url) {
          window.open(url, target)
        }
        break

      case 'scroll-to':
        const elementId = action.payload?.target as string
        const behavior = (action.payload?.behavior as ScrollBehavior) || 'smooth'
        if (elementId) {
          const element = document.getElementById(elementId)
          element?.scrollIntoView({ behavior })
        }
        break

      case 'open-modal':
        const modalId = action.payload?.id as string
        if (modalId) {
          setOpenModals(prev => new Set(prev).add(modalId))
        }
        break

      case 'close-modal':
        const closeId = action.payload?.id as string
        if (closeId) {
          setOpenModals(prev => {
            const next = new Set(prev)
            next.delete(closeId)
            return next
          })
        }
        break

      case 'copy':
        const text = action.payload?.text as string
        const toast = action.payload?.toast as string
        if (text) {
          navigator.clipboard.writeText(text).then(() => {
            if (toast) {
              // 간단한 토스트 (추후 개선)
              alert(toast)
            }
          })
        }
        break

      case 'share':
        const shareData = {
          title: action.payload?.title as string,
          text: action.payload?.text as string,
          url: action.payload?.url as string || window.location.href,
        }
        if (navigator.share) {
          navigator.share(shareData)
        } else {
          // 폴백: URL 복사
          navigator.clipboard.writeText(shareData.url)
        }
        break

      case 'call':
        const phone = action.payload?.phone as string
        if (phone) {
          window.location.href = `tel:${phone}`
        }
        break

      case 'sms':
        const smsPhone = action.payload?.phone as string
        const body = action.payload?.body as string
        if (smsPhone) {
          const smsUrl = body
            ? `sms:${smsPhone}?body=${encodeURIComponent(body)}`
            : `sms:${smsPhone}`
          window.location.href = smsUrl
        }
        break

      case 'map':
        const address = action.payload?.address as string
        const provider = (action.payload?.provider as string) || 'kakao'
        if (address) {
          const mapUrls: Record<string, string> = {
            kakao: `https://map.kakao.com/link/search/${encodeURIComponent(address)}`,
            naver: `https://map.naver.com/search/${encodeURIComponent(address)}`,
            tmap: `https://tmap.life/search?query=${encodeURIComponent(address)}`,
            google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
          }
          window.open(mapUrls[provider] || mapUrls.kakao, '_blank')
        }
        break

      case 'play-audio':
      case 'pause-audio':
      case 'toggle-audio':
        const audioId = action.payload?.id as string
        const audio = audioId
          ? document.getElementById(`${audioId}-audio`) as HTMLAudioElement
          : document.querySelector('audio') as HTMLAudioElement
        if (audio) {
          if (action.type === 'play-audio') audio.play()
          else if (action.type === 'pause-audio') audio.pause()
          else audio.paused ? audio.play() : audio.pause()
        }
        break

      case 'emit':
        const eventName = action.payload?.event as string
        if (eventName) {
          const handler = handlersRef.get(eventName)
          handler?.()
          onCustomEvent?.(eventName, action.payload)
        }
        break

      case 'set-state':
        // 추후 구현: 상태 관리 연동
        console.log('set-state:', action.payload)
        break

      case 'analytics':
        const analyticsEvent = action.payload?.event as string
        if (analyticsEvent) {
          onAnalytics?.(analyticsEvent, action.payload)
        }
        break
    }
  }, [onAnalytics, onCustomEvent, handlersRef, setOpenModals])

  // 커스텀 핸들러 등록/해제
  const registerHandler = useCallback((eventName: string, handler: () => void) => {
    handlersRef.set(eventName, handler)
  }, [handlersRef])

  const unregisterHandler = useCallback((eventName: string) => {
    handlersRef.delete(eventName)
  }, [handlersRef])

  // 노드 이벤트 핸들러 생성
  const createEventHandlers = useCallback((
    nodeId: string,
    events: NodeEventHandler[] | undefined
  ): Record<string, (e?: React.SyntheticEvent) => void> => {
    if (!events || events.length === 0) return {}

    const handlers: Record<string, (e?: React.SyntheticEvent) => void> = {}
    const executedOnce = new Set<string>()

    for (const eventConfig of events) {
      const reactEventName = eventTypeToReactEvent(eventConfig.event)
      if (!reactEventName) continue

      const key = `${nodeId}-${eventConfig.event}`

      handlers[reactEventName] = (e?: React.SyntheticEvent) => {
        e?.stopPropagation()

        // once 체크
        if (eventConfig.once && executedOnce.has(key)) return
        if (eventConfig.once) executedOnce.add(key)

        // 지연 실행
        const execute = () => executeAction(eventConfig.action)

        if (eventConfig.delay) {
          setTimeout(execute, eventConfig.delay)
        } else {
          execute()
        }
      }
    }

    return handlers
  }, [executeAction])

  // 모달/오디오 컨트롤
  const openModal = useCallback((id: string) => {
    executeAction({ type: 'open-modal', payload: { id } })
  }, [executeAction])

  const closeModal = useCallback((id: string) => {
    executeAction({ type: 'close-modal', payload: { id } })
  }, [executeAction])

  const playAudio = useCallback((id?: string) => {
    executeAction({ type: 'play-audio', payload: { id } })
  }, [executeAction])

  const pauseAudio = useCallback((id?: string) => {
    executeAction({ type: 'pause-audio', payload: { id } })
  }, [executeAction])

  const toggleAudio = useCallback((id?: string) => {
    executeAction({ type: 'toggle-audio', payload: { id } })
  }, [executeAction])

  const value = useMemo<EventContextValue>(() => ({
    executeAction,
    registerHandler,
    unregisterHandler,
    createEventHandlers,
    openModals,
    openModal,
    closeModal,
    playAudio,
    pauseAudio,
    toggleAudio,
  }), [
    executeAction,
    registerHandler,
    unregisterHandler,
    createEventHandlers,
    openModals,
    openModal,
    closeModal,
    playAudio,
    pauseAudio,
    toggleAudio,
  ])

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}

// ============================================
// Hook
// ============================================

export function useEvents(): EventContextValue {
  const context = useContext(EventContext)

  if (!context) {
    // 컨텍스트 없이 사용 시 기본 구현 반환
    return {
      executeAction: () => {},
      registerHandler: () => {},
      unregisterHandler: () => {},
      createEventHandlers: () => ({}),
      openModals: new Set(),
      openModal: () => {},
      closeModal: () => {},
      playAudio: () => {},
      pauseAudio: () => {},
      toggleAudio: () => {},
    }
  }

  return context
}

// ============================================
// Helper Functions
// ============================================

/**
 * EventType을 React 이벤트 이름으로 변환
 */
function eventTypeToReactEvent(eventType: EventType): string | null {
  const mapping: Record<EventType, string> = {
    'click': 'onClick',
    'scroll': 'onScroll',
    'enter-viewport': 'onMouseEnter', // IntersectionObserver로 대체 필요
    'leave-viewport': 'onMouseLeave',
    'hover': 'onMouseEnter',
    'focus': 'onFocus',
    'blur': 'onBlur',
    'change': 'onChange',
    'submit': 'onSubmit',
  }
  return mapping[eventType] || null
}
