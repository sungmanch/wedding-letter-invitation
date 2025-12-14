'use client'

/**
 * useLettyConversation - Letty와의 대화 상태 관리 훅
 * Stage 2: mood → color → generating → complete (기본 정보는 Form에서 받음)
 */

import { useState, useCallback, useRef } from 'react'
import type { ChatMessage } from '../components/MessageBubble'

// ============================================
// Types
// ============================================

export type ConversationStep = 'mood' | 'color' | 'generating' | 'complete'

export interface InitialData {
  groomName: string
  brideName: string
  weddingDate: string
  weddingTime: string
  venueName: string
}

export interface CollectedData {
  // 커플 정보 (Form에서 전달)
  groomName: string
  brideName: string
  weddingDate: string
  weddingTime: string
  venueName: string
  // 스타일 (대화에서 수집)
  moods: string[]
  color: string | null
  customColor: string
}

export interface ConversationState {
  messages: ChatMessage[]
  currentStep: ConversationStep
  isTyping: boolean
  collectedData: CollectedData
}

// ============================================
// Constants - 자연어 파싱용 키워드
// ============================================

const MOOD_KEYWORDS: Record<string, string[]> = {
  romantic: ['로맨틱', '낭만', '사랑스러운', '달달', '러블리', '감성적', '드라마틱', '서정적', '몽환'],
  elegant: ['우아', '고급', '세련', '클래식', '품격', '격조', '고상', '정제된', '기품'],
  minimal: ['미니멀', '심플', '깔끔', '단순', '간결', '절제', '군더더기 없는', '모던한'],
  modern: ['모던', '현대적', '트렌디', '세련된', '도시적', '컨템포러리', '쿨한'],
  warm: ['따뜻', '포근', '아늑', '온화', '정감', '훈훈', '편안한', '다정한'],
  luxury: ['럭셔리', '화려', '프리미엄', '고급스러운', '호화로운', '오페라', '샴페인', '글래머러스'],
}

const COLOR_KEYWORDS: Record<string, string[]> = {
  'white-gold': ['화이트', '골드', '금색', '흰', '하얀', '금빛', '황금', '샴페인', '아이보리'],
  'blush-pink': ['핑크', '분홍', '로즈', '연분홍', '살구', '코랄', '피치', '복숭아'],
  'deep-navy': ['네이비', '남색', '블루', '파란', '진청', '인디고', '미드나잇', '청색'],
  'natural-green': ['그린', '초록', '녹색', '자연', '숲', '올리브', '민트', '에메랄드', '세이지'],
  'terracotta': ['테라코타', '브라운', '갈색', '베이지', '흙빛', '카멜', '탄', '앰버', '오렌지'],
  'burgundy': ['버건디', '와인', '보르도', '마룬', '진홍', '레드', '빨간'],
  'lavender': ['라벤더', '보라', '퍼플', '바이올렛', '라일락', '자주'],
  'charcoal': ['차콜', '그레이', '회색', '진회색', '모노톤', '블랙', '검정'],
}

const SKIP_PATTERNS = ['맡길게', '맡겨', '알아서', '추천', '골라줘', '니가', '네가', '레티가', 'letty']

// ============================================
// Constants - 타이핑 딜레이
// ============================================

const TYPING_DELAYS = {
  short: 800,
  medium: 1200,
  long: 1600,
}

// ============================================
// Constants - 피드백 메시지
// ============================================

interface DetailedFeedback {
  quick: string
  description: string
}

const MOOD_FEEDBACK: Record<string, DetailedFeedback> = {
  romantic: {
    quick: '로맨틱한 분위기, 정말 좋아요! 💕',
    description: '부드러운 곡선과 따뜻한 톤으로 사랑스러운 느낌을 담아드릴게요.',
  },
  elegant: {
    quick: '우아하고 세련된 느낌이에요 ✨',
    description: '절제된 아름다움으로 품격 있는 청첩장을 만들어드릴게요.',
  },
  minimal: {
    quick: '심플한 아름다움이네요! 🤍',
    description: '불필요한 장식을 덜어내고 본질에 집중한 디자인을 만들어드릴게요.',
  },
  modern: {
    quick: '모던하고 트렌디한 스타일이죠! 🖤',
    description: '세련되고 동시대적인 감각으로 트렌디한 청첩장을 만들어드릴게요.',
  },
  warm: {
    quick: '따뜻하고 포근한 느낌이에요 🧡',
    description: '마음이 편안해지는 따뜻한 색감으로 정감 있는 청첩장을 만들어드릴게요.',
  },
  luxury: {
    quick: '럭셔리한 스타일! 멋져요 ✨',
    description: '화려하면서도 품격 있는 프리미엄 청첩장을 만들어드릴게요.',
  },
}

const COLOR_FEEDBACK: Record<string, DetailedFeedback> = {
  'white-gold': {
    quick: '화이트 & 골드! 고급스러운 선택이에요 ✨',
    description: '순백의 배경에 골드 포인트는 클래식하면서도 럭셔리한 느낌을 줘요.',
  },
  'blush-pink': {
    quick: '블러쉬 핑크! 사랑스러운 색이에요 💗',
    description: '은은한 핑크빛이 로맨틱한 무드를 완성해줘요.',
  },
  'deep-navy': {
    quick: '딥 네이비! 세련된 느낌이네요 💙',
    description: '깊이 있는 네이비는 신뢰감과 세련됨을 동시에 전달해요.',
  },
  'natural-green': {
    quick: '내추럴 그린! 자연스러운 아름다움이에요 🌿',
    description: '생명력 있는 그린은 새로운 시작을 상징해요.',
  },
  'terracotta': {
    quick: '테라코타! 따뜻하고 트렌디해요 🧡',
    description: '흙빛 테라코타는 빈티지하면서도 요즘 트렌드에 딱 맞는 색이에요.',
  },
  'burgundy': {
    quick: '버건디! 깊이 있고 우아한 색이에요 🍷',
    description: '와인빛 버건디는 고급스러우면서도 열정적인 느낌을 줘요.',
  },
  'lavender': {
    quick: '라벤더! 부드럽고 신비로운 색이에요 💜',
    description: '은은한 라벤더는 로맨틱하면서도 세련된 느낌을 줘요.',
  },
  'charcoal': {
    quick: '차콜! 모던하고 시크한 선택이에요 🖤',
    description: '깊은 차콜은 세련되고 도시적인 느낌을 줘요.',
  },
}

// ============================================
// Utility Functions
// ============================================

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isSkipInput(input: string): boolean {
  const normalized = input.toLowerCase()
  return SKIP_PATTERNS.some((pattern) => normalized.includes(pattern))
}

function parseMoods(input: string): string[] {
  const normalized = input.toLowerCase()
  const moods: string[] = []

  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      moods.push(mood)
    }
  }

  return moods
}

function parseColor(input: string): { preset: string | null; custom: string } {
  const normalized = input.toLowerCase()

  for (const [color, keywords] of Object.entries(COLOR_KEYWORDS)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return { preset: color, custom: '' }
    }
  }

  return { preset: null, custom: input.trim() }
}

// ============================================
// Hook
// ============================================

export interface UseLettyConversationOptions {
  onGenerate?: (data: CollectedData) => Promise<void>
  initialData?: InitialData
}

export function useLettyConversation(options: UseLettyConversationOptions = {}) {
  const { onGenerate, initialData } = options

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentStep, setCurrentStep] = useState<ConversationStep>('mood')
  const [isTyping, setIsTyping] = useState(false)
  const [collectedData, setCollectedData] = useState<CollectedData>({
    groomName: initialData?.groomName || '',
    brideName: initialData?.brideName || '',
    weddingDate: initialData?.weddingDate || '',
    weddingTime: initialData?.weddingTime || '',
    venueName: initialData?.venueName || '',
    moods: [],
    color: null,
    customColor: '',
  })

  const isProcessingRef = useRef(false)

  // 메시지 추가
  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
    return newMessage
  }, [])

  // Letty 메시지 전송 (타이핑 딜레이 포함)
  const sendLettyMessage = useCallback(
    async (content: string, delay: number = TYPING_DELAYS.medium) => {
      setIsTyping(true)
      await sleep(delay)
      setIsTyping(false)
      addMessage({ role: 'assistant', content })
    },
    [addMessage]
  )

  // 연속 메시지 전송
  const sendLettyMessages = useCallback(
    async (msgList: { content: string; delay?: number }[]) => {
      for (const msg of msgList) {
        await sendLettyMessage(msg.content, msg.delay ?? TYPING_DELAYS.medium)
      }
    },
    [sendLettyMessage]
  )

  // 대화 시작 - Form에서 받은 데이터로 인사
  const startConversation = useCallback(async () => {
    if (isProcessingRef.current) return
    isProcessingRef.current = true

    const groomName = initialData?.groomName || '신랑'
    const brideName = initialData?.brideName || '신부'

    await sendLettyMessages([
      {
        content: `${groomName}님과 ${brideName}님, 반가워요! ✨\n이제 청첩장 스타일을 정해볼까요?`,
        delay: TYPING_DELAYS.long,
      },
      {
        content: '어떤 분위기가 좋을까요? 💭\n\n로맨틱, 우아한, 미니멀, 모던, 따뜻한, 럭셔리...\n자유롭게 말씀해주세요!',
        delay: TYPING_DELAYS.medium,
      },
    ])

    setCurrentStep('mood')
    isProcessingRef.current = false
  }, [initialData, sendLettyMessages])

  // 사용자 입력 처리
  const handleUserInput = useCallback(
    async (input: string) => {
      if (isProcessingRef.current || !input.trim()) return
      isProcessingRef.current = true

      addMessage({ role: 'user', content: input.trim() })

      const isSkip = isSkipInput(input)

      switch (currentStep) {
        // Step 1: 분위기
        case 'mood': {
          const moods = isSkip ? [] : parseMoods(input)
          setCollectedData((prev) => ({ ...prev, moods }))

          if (moods.length > 0 && MOOD_FEEDBACK[moods[0]]) {
            const feedback = MOOD_FEEDBACK[moods[0]]
            await sendLettyMessages([
              { content: feedback.quick, delay: TYPING_DELAYS.short },
              { content: feedback.description, delay: TYPING_DELAYS.medium },
            ])
          } else if (isSkip) {
            await sendLettyMessage('알겠어요! 제가 어울리는 분위기를 골라볼게요 😊', TYPING_DELAYS.medium)
          } else {
            await sendLettyMessage('좋아요! 그 느낌으로 만들어볼게요 ✨', TYPING_DELAYS.medium)
          }

          await sendLettyMessage(
            '색상은 어떤 게 좋을까요? 🎨\n\n화이트&골드, 블러쉬 핑크, 네이비, 그린...\n원하시는 색을 말씀해주세요!',
            TYPING_DELAYS.medium
          )

          setCurrentStep('color')
          break
        }

        // Step 2: 색상
        case 'color': {
          let color: string | null = null
          let customColor = ''

          if (!isSkip) {
            const parsed = parseColor(input)
            color = parsed.preset
            customColor = parsed.custom
          }

          const updatedData = {
            ...collectedData,
            color,
            customColor,
          }
          setCollectedData(updatedData)

          if (color && COLOR_FEEDBACK[color]) {
            const feedback = COLOR_FEEDBACK[color]
            await sendLettyMessages([
              { content: feedback.quick, delay: TYPING_DELAYS.short },
              { content: feedback.description, delay: TYPING_DELAYS.medium },
            ])
          } else if (isSkip) {
            await sendLettyMessage('알겠어요! 분위기에 맞게 제가 골라볼게요 😊', TYPING_DELAYS.medium)
          } else if (customColor) {
            await sendLettyMessage(`${customColor}! 좋은 선택이에요 🎨`, TYPING_DELAYS.medium)
          }

          await sendLettyMessage('그럼 지금 바로 디자인 시작할게요!\n잠시만 기다려주세요... ⏳', TYPING_DELAYS.medium)

          setCurrentStep('generating')

          // AI 생성
          if (onGenerate) {
            try {
              await onGenerate(updatedData)
              await sendLettyMessage(
                '완성했어요! 🎉\n오른쪽 미리보기를 확인해주세요.\n\n마음에 드시면 "이 디자인으로 시작" 버튼을 눌러주세요!',
                TYPING_DELAYS.long
              )
              setCurrentStep('complete')
            } catch (error) {
              console.error('Generation failed:', error)
              await sendLettyMessage(
                '앗, 문제가 생겼어요 😢\n다시 시도해볼까요?',
                TYPING_DELAYS.medium
              )
              setCurrentStep('mood')
            }
          }
          break
        }

        default:
          break
      }

      isProcessingRef.current = false
    },
    [currentStep, collectedData, addMessage, sendLettyMessages, sendLettyMessage, onGenerate]
  )

  // 대화 리셋
  const resetConversation = useCallback(() => {
    setMessages([])
    setCurrentStep('mood')
    setIsTyping(false)
    setCollectedData({
      groomName: initialData?.groomName || '',
      brideName: initialData?.brideName || '',
      weddingDate: initialData?.weddingDate || '',
      weddingTime: initialData?.weddingTime || '',
      venueName: initialData?.venueName || '',
      moods: [],
      color: null,
      customColor: '',
    })
    isProcessingRef.current = false
  }, [initialData])

  return {
    messages,
    currentStep,
    isTyping,
    collectedData,
    startConversation,
    handleUserInput,
    resetConversation,
    isInputDisabled: isTyping || currentStep === 'generating' || currentStep === 'complete',
  }
}
