'use client'

/**
 * useLettyConversation - Letty와의 대화 상태 관리 훅
 * 자연어 파싱, 타이핑 딜레이, 메시지 시퀀스 관리
 */

import { useState, useCallback, useRef } from 'react'
import type { ChatMessage } from '../components/MessageBubble'

// ============================================
// Types
// ============================================

export type ConversationStep =
  | 'greeting'        // 초기 인사
  | 'names'           // 신랑/신부 이름
  | 'date'            // 결혼 날짜
  | 'time'            // 결혼 시간
  | 'venue'           // 장소명
  | 'groom_parents'   // 신랑측 부모님 (선택)
  | 'bride_parents'   // 신부측 부모님 (선택)
  | 'mood'            // 분위기 질문
  | 'color'           // 색상 질문
  | 'generating'      // 생성 중
  | 'complete'        // 완료

export interface CollectedData {
  // 커플 정보
  groomName: string
  brideName: string
  // 결혼 일시
  weddingDate: string      // YYYY-MM-DD
  weddingTime: string      // HH:mm
  // 장소
  venueName: string
  // 부모님 이름
  groomFatherName: string
  groomMotherName: string
  brideFatherName: string
  brideMotherName: string
  // 스타일
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
// Constants - 새로운 단계 건너뛰기 패턴
// ============================================

const PARENTS_SKIP_PATTERNS = ['나중에', '건너뛰', '스킵', '다음', '패스', '넘어가']

// ============================================
// Utility Functions - 이름 파싱
// ============================================

/**
 * 신랑/신부 이름을 자연어에서 파싱
 * 예: "김민수, 이영희", "김민수랑 이영희", "신랑 김민수 신부 이영희"
 */
function parseNames(input: string): { groom: string; bride: string } | null {
  const normalized = input.trim()

  // 패턴 1: "신랑 OOO 신부 OOO" 또는 "신랑 OOO, 신부 OOO"
  const rolePattern = /신랑\s*[:]?\s*([가-힣a-zA-Z]{2,10})\s*[,.]?\s*신부\s*[:]?\s*([가-힣a-zA-Z]{2,10})/
  let match = normalized.match(rolePattern)
  if (match) {
    return { groom: match[1], bride: match[2] }
  }

  // 패턴 2: 쉼표로 구분 "김민수, 이영희"
  const commaPattern = /^([가-힣a-zA-Z]{2,10})\s*[,，]\s*([가-힣a-zA-Z]{2,10})$/
  match = normalized.match(commaPattern)
  if (match) {
    return { groom: match[1], bride: match[2] }
  }

  // 패턴 3: 한글 접속사 "김민수랑 이영희", "김민수와 이영희", "김민수 그리고 이영희"
  const connectorPattern = /^([가-힣a-zA-Z]{2,10})\s*(?:랑|와|과|그리고|&)\s*([가-힣a-zA-Z]{2,10})$/
  match = normalized.match(connectorPattern)
  if (match) {
    return { groom: match[1], bride: match[2] }
  }

  // 패턴 4: 공백으로만 구분 "김민수 이영희"
  const spacePattern = /^([가-힣a-zA-Z]{2,10})\s+([가-힣a-zA-Z]{2,10})$/
  match = normalized.match(spacePattern)
  if (match) {
    return { groom: match[1], bride: match[2] }
  }

  return null
}

// ============================================
// Utility Functions - 날짜 파싱
// ============================================

/**
 * 결혼 날짜를 자연어에서 파싱하여 YYYY-MM-DD 형식으로 변환
 * 예: "2025년 3월 15일", "3월 15일", "2025-03-15", "25년 3월 15일"
 */
function parseDate(input: string): string | null {
  const normalized = input.trim()
  const currentYear = new Date().getFullYear()

  // 패턴 1: 2025년 3월 15일
  let match = normalized.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
  if (match) {
    const [, year, month, day] = match
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // 패턴 2: 25년 3월 15일 (2자리 연도)
  match = normalized.match(/(\d{2})년\s*(\d{1,2})월\s*(\d{1,2})일/)
  if (match) {
    const [, shortYear, month, day] = match
    const year = 2000 + parseInt(shortYear, 10)
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // 패턴 3: 3월 15일 (연도 없음 - 올해 또는 내년으로 추정)
  match = normalized.match(/(\d{1,2})월\s*(\d{1,2})일/)
  if (match) {
    const [, month, day] = match
    const monthNum = parseInt(month, 10)
    const dayNum = parseInt(day, 10)
    const currentMonth = new Date().getMonth() + 1

    // 이미 지난 달이면 내년으로
    const year = monthNum < currentMonth ? currentYear + 1 : currentYear
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // 패턴 4: 2025-03-15 (ISO 형식)
  match = normalized.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    return match[0]
  }

  // 패턴 5: 2025.03.15 또는 2025/03/15
  match = normalized.match(/(\d{4})[./](\d{1,2})[./](\d{1,2})/)
  if (match) {
    const [, year, month, day] = match
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  return null
}

/**
 * 날짜를 한글 형식으로 변환
 * "2025-03-15" -> "2025년 3월 15일 토요일"
 */
function formatDateKorean(dateStr: string): string {
  const date = new Date(dateStr)
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = weekdays[date.getDay()]
  return `${year}년 ${month}월 ${day}일 ${weekday}`
}

// ============================================
// Utility Functions - 시간 파싱
// ============================================

/**
 * 결혼 시간을 자연어에서 파싱하여 HH:mm 형식으로 변환
 * 예: "오후 2시", "14시 30분", "2:30", "낮 12시"
 */
function parseTime(input: string): string | null {
  const normalized = input.trim()

  // 패턴 1: 오전/오후 X시 Y분
  let match = normalized.match(/(오전|오후|낮|저녁)\s*(\d{1,2})시(?:\s*(\d{1,2})분)?/)
  if (match) {
    const [, period, hourStr, minStr] = match
    let hour = parseInt(hourStr, 10)
    const min = minStr ? parseInt(minStr, 10) : 0

    if (period === '오후' && hour !== 12) {
      hour += 12
    } else if (period === '오전' && hour === 12) {
      hour = 0
    } else if (period === '낮' && hour === 12) {
      // 낮 12시 그대로
    } else if (period === '저녁' && hour < 12) {
      hour += 12
    }

    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
  }

  // 패턴 2: X시 Y분 (24시간 형식)
  match = normalized.match(/(\d{1,2})시(?:\s*(\d{1,2})분)?/)
  if (match) {
    const [, hourStr, minStr] = match
    const hour = parseInt(hourStr, 10)
    const min = minStr ? parseInt(minStr, 10) : 0
    return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
  }

  // 패턴 3: HH:mm 형식
  match = normalized.match(/(\d{1,2}):(\d{2})/)
  if (match) {
    const [, hourStr, minStr] = match
    return `${hourStr.padStart(2, '0')}:${minStr}`
  }

  return null
}

/**
 * 시간을 한글 형식으로 변환
 * "14:30" -> "오후 2시 30분"
 */
function formatTimeKorean(timeStr: string): string {
  const [hourStr, minStr] = timeStr.split(':')
  const hour = parseInt(hourStr, 10)
  const min = parseInt(minStr, 10)

  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour

  if (min === 0) {
    return `${period} ${displayHour}시`
  }
  return `${period} ${displayHour}시 ${min}분`
}

// ============================================
// Utility Functions - 부모님 이름 파싱
// ============================================

/**
 * 부모님 이름을 파싱
 * 예: "김철수, 박영희" -> { father: "김철수", mother: "박영희" }
 * 예: "아버지 김철수 어머니 박영희"
 */
function parseParentsNames(input: string): { father: string; mother: string } | null {
  const normalized = input.trim()

  // 패턴 1: 아버지/어머니 라벨 있는 경우
  const rolePattern = /아버(?:지|님)\s*[:]?\s*([가-힣a-zA-Z]{2,10})\s*[,.]?\s*어머(?:니|님)\s*[:]?\s*([가-힣a-zA-Z]{2,10})/
  let match = normalized.match(rolePattern)
  if (match) {
    return { father: match[1], mother: match[2] }
  }

  // 패턴 2: 쉼표로 구분 (아버지, 어머니 순서 가정)
  const commaPattern = /^([가-힣a-zA-Z]{2,10})\s*[,，]\s*([가-힣a-zA-Z]{2,10})$/
  match = normalized.match(commaPattern)
  if (match) {
    return { father: match[1], mother: match[2] }
  }

  // 패턴 3: 접속사로 구분
  const connectorPattern = /^([가-힣a-zA-Z]{2,10})\s*(?:랑|와|과|&)\s*([가-힣a-zA-Z]{2,10})$/
  match = normalized.match(connectorPattern)
  if (match) {
    return { father: match[1], mother: match[2] }
  }

  return null
}

/**
 * 부모님 건너뛰기 여부 확인
 */
function isParentsSkip(input: string): boolean {
  const normalized = input.toLowerCase()
  return PARENTS_SKIP_PATTERNS.some(pattern => normalized.includes(pattern))
}

// ============================================
// Constants - 타이핑 딜레이
// ============================================

const TYPING_DELAYS = {
  short: 1000,   // 짧은 응답 (확인)
  medium: 1500,  // 일반 응답
  long: 2000,    // 긴 응답/설명
}

// ============================================
// Constants - 피드백 메시지 (상세 설명 포함)
// ============================================

interface DetailedFeedback {
  quick: string           // 짧은 피드백 (첫 번째 메시지)
  description: string     // 상세 설명 (두 번째 메시지)
  style?: string         // 스타일 힌트 (선택적, 세 번째 메시지)
}

const MOOD_DETAILED_FEEDBACK: Record<string, DetailedFeedback> = {
  romantic: {
    quick: '로맨틱한 분위기, 정말 좋아요! 💕',
    description: '부드러운 곡선과 따뜻한 톤으로\n사랑스러운 느낌을 담아드릴게요.\n핑크, 코랄 계열의 색감이 잘 어울려요.',
    style: '명조체 폰트와 플로럴 장식으로\n클래식하면서도 로맨틱한 무드를 연출할게요.',
  },
  elegant: {
    quick: '우아하고 세련된 느낌이에요 ✨',
    description: '절제된 아름다움으로\n품격 있는 청첩장을 만들어드릴게요.\n골드, 아이보리, 퍼플 계열이 잘 어울려요.',
    style: '세리프 폰트와 여백의 미로\n고급스러운 분위기를 연출할게요.',
  },
  minimal: {
    quick: '심플한 아름다움이네요! 🤍',
    description: '불필요한 장식을 덜어내고\n본질에 집중한 디자인을 만들어드릴게요.\n화이트, 그레이, 블랙 계열이 잘 어울려요.',
    style: '산세리프 폰트와 넓은 여백으로\n모던하고 깔끔한 느낌을 줄게요.',
  },
  modern: {
    quick: '모던하고 트렌디한 스타일이죠! 🖤',
    description: '세련되고 동시대적인 감각으로\n트렌디한 청첩장을 만들어드릴게요.\n네이비, 블루, 모노톤이 잘 어울려요.',
    style: '기하학적인 요소와 대담한 타이포그래피로\n시선을 사로잡는 디자인을 할게요.',
  },
  warm: {
    quick: '따뜻하고 포근한 느낌이에요 🧡',
    description: '마음이 편안해지는 따뜻한 색감으로\n정감 있는 청첩장을 만들어드릴게요.\n오렌지, 베이지, 브라운 계열이 잘 어울려요.',
    style: '부드러운 곡선과 따뜻한 일러스트로\n감성적인 분위기를 연출할게요.',
  },
  luxury: {
    quick: '럭셔리한 스타일! 멋져요 ✨',
    description: '화려하면서도 품격 있는\n프리미엄 청첩장을 만들어드릴게요.\n골드, 버건디, 블랙 계열이 잘 어울려요.',
    style: '골드 악센트와 우아한 서체로\n특별한 날의 격을 높여드릴게요.',
  },
}

const COLOR_DETAILED_FEEDBACK: Record<string, DetailedFeedback> = {
  'white-gold': {
    quick: '화이트 & 골드! 고급스러운 선택이에요 ✨',
    description: '순백의 배경에 골드 포인트는\n클래식하면서도 럭셔리한 느낌을 줘요.\n웨딩의 정통성과 품격을 담은 조합이에요.',
    style: '골드 테두리와 세리프 폰트로\n시간이 지나도 아름다운 디자인을 만들게요.',
  },
  'blush-pink': {
    quick: '블러쉬 핑크! 사랑스러운 색이에요 💗',
    description: '은은한 핑크빛이 로맨틱한 무드를\n완성해줘요. 부드럽고 여성스러운 느낌이에요.\n봄 웨딩이나 가든 웨딩에 특히 잘 어울려요.',
    style: '플로럴 패턴과 곡선 요소로\n사랑스러운 분위기를 강조할게요.',
  },
  'deep-navy': {
    quick: '딥 네이비! 세련된 느낌이네요 💙',
    description: '깊이 있는 네이비는 신뢰감과\n세련됨을 동시에 전달해요.\n밤 예식이나 호텔 웨딩에 완벽한 선택이에요.',
    style: '실버나 화이트 포인트로\n차분하면서도 격조 있는 디자인을 만들게요.',
  },
  'natural-green': {
    quick: '내추럴 그린! 자연스러운 아름다움이에요 🌿',
    description: '생명력 있는 그린은 새로운 시작을\n상징해요. 가든이나 야외 웨딩에 딱이에요.\n자연 친화적이고 신선한 느낌을 줘요.',
    style: '보태니컬 요소와 자연스러운 질감으로\n편안하면서도 스타일리시한 디자인을 할게요.',
  },
  'terracotta': {
    quick: '테라코타! 따뜻하고 트렌디해요 🧡',
    description: '흙빛 테라코타는 빈티지하면서도\n요즘 트렌드에 딱 맞는 색이에요.\n가을 웨딩이나 야외 웨딩에 잘 어울려요.',
    style: '자연스러운 텍스처와 워밍 톤으로\n편안하면서도 세련된 분위기를 만들게요.',
  },
  'burgundy': {
    quick: '버건디! 깊이 있고 우아한 색이에요 🍷',
    description: '와인빛 버건디는 고급스러우면서도\n열정적인 느낌을 줘요.\n가을/겨울 웨딩이나 호텔 웨딩에 완벽해요.',
    style: '골드 악센트와 세리프 폰트로\n깊이 있는 우아함을 표현할게요.',
  },
  'lavender': {
    quick: '라벤더! 부드럽고 신비로운 색이에요 💜',
    description: '은은한 라벤더는 로맨틱하면서도\n세련된 느낌을 줘요.\n몽환적이고 드림같은 분위기를 연출해요.',
    style: '부드러운 그라디언트와 우아한 폰트로\n동화 같은 느낌을 담아드릴게요.',
  },
  'charcoal': {
    quick: '차콜! 모던하고 시크한 선택이에요 🖤',
    description: '깊은 차콜은 세련되고 도시적인\n느낌을 줘요. 미니멀하면서도 임팩트 있죠.\n모던한 호텔 웨딩에 잘 어울려요.',
    style: '산세리프 폰트와 화이트 포인트로\n시크하고 현대적인 디자인을 만들게요.',
  },
}

// ============================================
// Utility Functions
// ============================================

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function isSkipInput(input: string): boolean {
  const normalized = input.toLowerCase()
  return SKIP_PATTERNS.some(pattern => normalized.includes(pattern))
}

function parseMoods(input: string): string[] {
  const normalized = input.toLowerCase()
  const moods: string[] = []

  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      moods.push(mood)
    }
  }

  return moods
}

function parseColor(input: string): { preset: string | null; custom: string } {
  const normalized = input.toLowerCase()

  for (const [color, keywords] of Object.entries(COLOR_KEYWORDS)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return { preset: color, custom: '' }
    }
  }

  // 매칭되는 프리셋이 없으면 커스텀 색상으로 처리
  return { preset: null, custom: input.trim() }
}

/**
 * 분위기 피드백 메시지들 반환 (여러 메시지)
 */
function getMoodFeedbackMessages(moods: string[]): { content: string; delay?: number }[] {
  if (moods.length === 0) {
    return [
      { content: '알겠어요! 제가 어울리는 분위기를 골라볼게요 😊', delay: TYPING_DELAYS.medium },
      { content: '여러 스타일을 조합해서\n두 분에게 딱 맞는 디자인을 찾아드릴게요.', delay: TYPING_DELAYS.long },
    ]
  }

  const messages: { content: string; delay?: number }[] = []

  if (moods.length === 1) {
    const feedback = MOOD_DETAILED_FEEDBACK[moods[0]]
    if (feedback) {
      messages.push({ content: feedback.quick, delay: TYPING_DELAYS.medium })
      messages.push({ content: feedback.description, delay: TYPING_DELAYS.long })
      if (feedback.style) {
        messages.push({ content: feedback.style, delay: TYPING_DELAYS.long })
      }
    } else {
      messages.push({ content: `${moods[0]} 분위기, 좋아요! ✨`, delay: TYPING_DELAYS.medium })
    }
  } else {
    // 여러 개 선택된 경우
    const moodLabels = moods.map(m => {
      const labels: Record<string, string> = {
        romantic: '로맨틱',
        elegant: '우아한',
        minimal: '미니멀',
        modern: '모던',
        warm: '따뜻한',
        luxury: '럭셔리',
      }
      return labels[m] || m
    })

    messages.push({
      content: `${moodLabels.join(' + ')} 조합이요! 💕\n정말 멋진 선택이에요.`,
      delay: TYPING_DELAYS.medium,
    })

    // 조합에 대한 설명 추가
    const combinationDescriptions: Record<string, string> = {
      'romantic+elegant': '로맨틱하면서도 우아한 분위기로\n클래식한 아름다움을 담아드릴게요.\n핑크와 골드가 조화롭게 어우러질 거예요.',
      'elegant+luxury': '품격 있고 럭셔리한 느낌으로\n프리미엄 웨딩의 격을 담아드릴게요.\n골드와 딥한 컬러가 잘 어울려요.',
      'minimal+modern': '심플하면서도 모던한 스타일로\n세련된 트렌디함을 담아드릴게요.\n깔끔한 레이아웃이 돋보일 거예요.',
      'warm+romantic': '따뜻하고 로맨틱한 분위기로\n정감 있는 사랑스러움을 담아드릴게요.\n오렌지와 핑크 톤이 조화로울 거예요.',
    }

    // 조합 키 생성 (정렬해서 순서 무관하게)
    const sortedMoods = [...moods].sort()
    const comboKey = sortedMoods.slice(0, 2).join('+')

    if (combinationDescriptions[comboKey]) {
      messages.push({ content: combinationDescriptions[comboKey], delay: TYPING_DELAYS.long })
    } else {
      // 기본 조합 설명
      messages.push({
        content: '서로 다른 매력을 가진 분위기들이네요.\n두 가지를 조화롭게 녹여낼게요!',
        delay: TYPING_DELAYS.long,
      })
    }
  }

  return messages
}

/**
 * 색상 피드백 메시지들 반환 (여러 메시지)
 */
function getColorFeedbackMessages(color: string | null, customColor: string): { content: string; delay?: number }[] {
  if (!color && !customColor) {
    return [
      { content: '알겠어요! 제가 분위기에 맞게 골라볼게요 😊', delay: TYPING_DELAYS.medium },
      { content: '앞서 말씀해주신 분위기에\n가장 잘 어울리는 색감을 찾아드릴게요.', delay: TYPING_DELAYS.long },
    ]
  }

  const messages: { content: string; delay?: number }[] = []

  if (color) {
    const feedback = COLOR_DETAILED_FEEDBACK[color]
    if (feedback) {
      messages.push({ content: feedback.quick, delay: TYPING_DELAYS.medium })
      messages.push({ content: feedback.description, delay: TYPING_DELAYS.long })
      if (feedback.style) {
        messages.push({ content: feedback.style, delay: TYPING_DELAYS.long })
      }
    } else {
      messages.push({ content: `${color}! 좋은 선택이에요 🎨`, delay: TYPING_DELAYS.medium })
    }
  } else if (customColor) {
    messages.push({
      content: `${customColor}! 좋은 선택이에요 🎨`,
      delay: TYPING_DELAYS.medium,
    })
    messages.push({
      content: `${customColor} 색상을 메인으로\n조화로운 팔레트를 구성해드릴게요.\n톤온톤으로 세련되게 표현할게요.`,
      delay: TYPING_DELAYS.long,
    })
  }

  return messages
}

/**
 * 생성 전 요약 메시지 생성
 */
function buildSummaryMessage(data: CollectedData): string | null {
  const parts: string[] = []

  // 분위기 라벨
  const moodLabels: Record<string, string> = {
    romantic: '로맨틱',
    elegant: '우아한',
    minimal: '미니멀',
    modern: '모던',
    warm: '따뜻한',
    luxury: '럭셔리',
  }

  // 색상 라벨
  const colorLabels: Record<string, string> = {
    'white-gold': '화이트 & 골드',
    'blush-pink': '블러쉬 핑크',
    'deep-navy': '딥 네이비',
    'natural-green': '내추럴 그린',
    'terracotta': '테라코타',
    'burgundy': '버건디',
    'lavender': '라벤더',
    'charcoal': '차콜',
  }

  // 커플 정보
  if (data.groomName && data.brideName) {
    parts.push(`✦ 신랑 · 신부: ${data.groomName} & ${data.brideName}`)
  }

  // 날짜/시간/장소
  if (data.weddingDate) {
    const dateKorean = formatDateKorean(data.weddingDate)
    const timeKorean = data.weddingTime ? formatTimeKorean(data.weddingTime) : ''
    parts.push(`✦ 일시: ${dateKorean}${timeKorean ? ` ${timeKorean}` : ''}`)
  }

  if (data.venueName) {
    parts.push(`✦ 장소: ${data.venueName}`)
  }

  // 분위기
  if (data.moods.length > 0) {
    const labels = data.moods.map(m => moodLabels[m] || m)
    parts.push(`✦ 분위기: ${labels.join(', ')}`)
  }

  // 색상
  if (data.color) {
    parts.push(`✦ 색상: ${colorLabels[data.color] || data.color}`)
  } else if (data.customColor) {
    parts.push(`✦ 색상: ${data.customColor}`)
  }

  // 아무것도 선택하지 않은 경우
  if (parts.length === 0) {
    return null
  }

  return `정리해볼게요!\n\n${parts.join('\n')}\n\n이 느낌으로 만들어드릴게요 ✨`
}

// ============================================
// Hook
// ============================================

export interface UseLettyConversationOptions {
  onGenerate?: (data: CollectedData) => Promise<void>
}

export function useLettyConversation(options: UseLettyConversationOptions = {}) {
  const { onGenerate } = options

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting')
  const [isTyping, setIsTyping] = useState(false)
  const [collectedData, setCollectedData] = useState<CollectedData>({
    groomName: '',
    brideName: '',
    weddingDate: '',
    weddingTime: '',
    venueName: '',
    groomFatherName: '',
    groomMotherName: '',
    brideFatherName: '',
    brideMotherName: '',
    moods: [],
    color: null,
    customColor: '',
  })

  // 메시지 시퀀스 진행 중인지 추적
  const isProcessingRef = useRef(false)

  // 메시지 추가
  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }, [])

  // Letty 메시지 전송 (타이핑 딜레이 포함)
  const sendLettyMessage = useCallback(async (content: string, delay: number = TYPING_DELAYS.medium) => {
    setIsTyping(true)
    await sleep(delay)
    setIsTyping(false)
    addMessage({ role: 'assistant', content })
  }, [addMessage])

  // 연속 메시지 전송
  const sendLettyMessages = useCallback(async (msgList: { content: string; delay?: number }[]) => {
    for (const msg of msgList) {
      await sendLettyMessage(msg.content, msg.delay ?? TYPING_DELAYS.medium)
    }
  }, [sendLettyMessage])

  // 초기 인사 시퀀스 - 이름부터 질문
  const startConversation = useCallback(async () => {
    if (isProcessingRef.current) return
    isProcessingRef.current = true

    await sendLettyMessages([
      { content: '안녕하세요! 청첩장 디자인을 도와드릴 Letty예요 ✨', delay: TYPING_DELAYS.long },
      {
        content: '먼저, 결혼하시는 두 분의 성함을 알려주세요!\n신랑님, 신부님 순서로요 💒\n\n예: 김민수, 이영희',
        delay: TYPING_DELAYS.medium,
      },
    ])

    setCurrentStep('names')
    isProcessingRef.current = false
  }, [sendLettyMessages])

  // 사용자 입력 처리
  const handleUserInput = useCallback(async (input: string) => {
    if (isProcessingRef.current || !input.trim()) return
    isProcessingRef.current = true

    // 사용자 메시지 추가
    addMessage({ role: 'user', content: input.trim() })

    const isSkip = isSkipInput(input)

    switch (currentStep) {
      // Step 1: 신랑/신부 이름
      case 'names': {
        const names = parseNames(input)
        if (!names) {
          await sendLettyMessage(
            '두 분의 성함을 함께 알려주세요!\n예: 김민수, 이영희 또는 김민수랑 이영희',
            TYPING_DELAYS.medium
          )
          isProcessingRef.current = false
          return
        }

        setCollectedData(prev => ({
          ...prev,
          groomName: names.groom,
          brideName: names.bride,
        }))

        await sendLettyMessages([
          { content: `${names.groom}님과 ${names.bride}님! 아름다운 이름이네요 💕`, delay: TYPING_DELAYS.medium },
          {
            content: '결혼식 날짜는 언제인가요? 📅\n\n예: 2025년 5월 24일',
            delay: TYPING_DELAYS.medium,
          },
        ])

        setCurrentStep('date')
        break
      }

      // Step 2: 결혼 날짜
      case 'date': {
        const dateStr = parseDate(input)
        if (!dateStr) {
          await sendLettyMessage(
            '날짜 형식을 확인해주세요!\n예: 2025년 5월 24일 또는 5월 24일',
            TYPING_DELAYS.medium
          )
          isProcessingRef.current = false
          return
        }

        setCollectedData(prev => ({ ...prev, weddingDate: dateStr }))

        const dateKorean = formatDateKorean(dateStr)
        await sendLettyMessages([
          { content: `${dateKorean}! 정말 설레는 날이네요 🎊`, delay: TYPING_DELAYS.medium },
          {
            content: '예식 시간은 몇 시인가요? ⏰\n\n예: 오후 2시 또는 14시 30분',
            delay: TYPING_DELAYS.medium,
          },
        ])

        setCurrentStep('time')
        break
      }

      // Step 3: 결혼 시간
      case 'time': {
        const timeStr = parseTime(input)
        if (!timeStr) {
          await sendLettyMessage(
            '시간 형식을 확인해주세요!\n예: 오후 2시 또는 14:30',
            TYPING_DELAYS.medium
          )
          isProcessingRef.current = false
          return
        }

        setCollectedData(prev => ({ ...prev, weddingTime: timeStr }))

        const timeKorean = formatTimeKorean(timeStr)
        await sendLettyMessages([
          { content: `${timeKorean}이요! 알겠습니다 ✨`, delay: TYPING_DELAYS.medium },
          {
            content: '예식 장소는 어디인가요? 🏛️\n장소 이름만 알려주세요!\n\n예: 그랜드 웨딩홀',
            delay: TYPING_DELAYS.medium,
          },
        ])

        setCurrentStep('venue')
        break
      }

      // Step 4: 장소명
      case 'venue': {
        const venueName = input.trim()
        if (venueName.length < 2) {
          await sendLettyMessage(
            '장소 이름을 알려주세요!\n예: 더채플앳청담, 그랜드 인터컨티넨탈',
            TYPING_DELAYS.medium
          )
          isProcessingRef.current = false
          return
        }

        setCollectedData(prev => ({ ...prev, venueName }))

        await sendLettyMessages([
          { content: `${venueName}! 좋은 장소네요 🌟`, delay: TYPING_DELAYS.medium },
          {
            content: '신랑측 혼주 (부모님) 성함을 알려주세요 🙏\n\n예: 아버지 김철수, 어머니 박영희\n\n(나중에 입력하시려면 "나중에"라고 해주세요)',
            delay: TYPING_DELAYS.medium,
          },
        ])

        setCurrentStep('groom_parents')
        break
      }

      // Step 5: 신랑측 부모님 이름 (선택)
      case 'groom_parents': {
        if (isParentsSkip(input)) {
          await sendLettyMessages([
            { content: '알겠어요! 나중에 편집 페이지에서 추가하시면 돼요 👍', delay: TYPING_DELAYS.medium },
            {
              content: '이제 청첩장 분위기를 정해볼까요? 🎨\n로맨틱, 우아한, 미니멀, 모던, 따뜻한, 럭셔리...\n원하시는 느낌을 말씀해주세요! 💭',
              delay: TYPING_DELAYS.long,
            },
          ])

          setCurrentStep('mood')
        } else {
          const groomParents = parseParentsNames(input)
          if (groomParents) {
            setCollectedData(prev => ({
              ...prev,
              groomFatherName: groomParents.father,
              groomMotherName: groomParents.mother,
            }))

            await sendLettyMessages([
              { content: `신랑측 혼주님 성함 확인했어요! 👨‍👩‍👦`, delay: TYPING_DELAYS.medium },
              {
                content: '이제 신부측 부모님 성함을 알려주세요!\n\n예: 아버지 이철수, 어머니 김영희\n\n(건너뛰시려면 "나중에"라고 해주세요)',
                delay: TYPING_DELAYS.medium,
              },
            ])

            setCurrentStep('bride_parents')
          } else {
            await sendLettyMessage(
              '아버지, 어머니 성함을 함께 알려주세요!\n예: 아버지 김철수, 어머니 박영희\n\n(건너뛰시려면 "나중에"라고 해주세요)',
              TYPING_DELAYS.medium
            )
          }
        }
        break
      }

      // Step 6: 신부측 부모님 이름 (선택)
      case 'bride_parents': {
        if (isParentsSkip(input)) {
          await sendLettyMessages([
            { content: '알겠어요! 나중에 편집 페이지에서 추가하시면 돼요 👍', delay: TYPING_DELAYS.medium },
            {
              content: '이제 청첩장 분위기를 정해볼까요? 🎨\n로맨틱, 우아한, 미니멀, 모던, 따뜻한, 럭셔리...\n원하시는 느낌을 말씀해주세요! 💭',
              delay: TYPING_DELAYS.long,
            },
          ])

          setCurrentStep('mood')
        } else {
          const brideParents = parseParentsNames(input)
          if (brideParents) {
            setCollectedData(prev => ({
              ...prev,
              brideFatherName: brideParents.father,
              brideMotherName: brideParents.mother,
            }))

            await sendLettyMessages([
              { content: `신부측 혼주님 성함도 확인했어요! 👨‍👩‍👧`, delay: TYPING_DELAYS.medium },
              {
                content: '이제 청첩장 분위기를 정해볼까요? 🎨\n로맨틱, 우아한, 미니멀, 모던, 따뜻한, 럭셔리...\n원하시는 느낌을 말씀해주세요! 💭',
                delay: TYPING_DELAYS.long,
              },
            ])

            setCurrentStep('mood')
          } else {
            await sendLettyMessage(
              '아버지, 어머니 성함을 함께 알려주세요!\n예: 아버지 이철수, 어머니 김영희\n\n(건너뛰시려면 "나중에"라고 해주세요)',
              TYPING_DELAYS.medium
            )
          }
        }
        break
      }

      // Step 6: 분위기
      case 'mood': {
        const moods = isSkip ? [] : parseMoods(input)
        setCollectedData(prev => ({ ...prev, moods }))

        // 분위기에 대한 상세 피드백 메시지들
        const moodFeedbackMessages = getMoodFeedbackMessages(moods)
        await sendLettyMessages([
          ...moodFeedbackMessages,
          {
            content: '색상은 어떤 게 좋을까요?\n화이트&골드, 블러쉬 핑크, 네이비 같은 느낌도 좋고,\n원하시는 색을 직접 말씀해주셔도 돼요 🎨',
            delay: TYPING_DELAYS.medium,
          },
        ])

        setCurrentStep('color')
        break
      }

      // Step 7: 색상
      case 'color': {
        let color: string | null = null
        let customColor = ''

        if (!isSkip) {
          const parsed = parseColor(input)
          color = parsed.preset
          customColor = parsed.custom
        }

        setCollectedData(prev => ({ ...prev, color, customColor }))

        // 색상에 대한 상세 피드백 메시지들
        const colorFeedbackMessages = getColorFeedbackMessages(color, customColor)

        // 생성 전 요약 메시지 추가
        const updatedData = { ...collectedData, color, customColor }
        const summaryMessage = buildSummaryMessage(updatedData)

        await sendLettyMessages([
          ...colorFeedbackMessages,
          ...(summaryMessage ? [{ content: summaryMessage, delay: TYPING_DELAYS.long }] : []),
          {
            content: '그럼 지금 바로 디자인 시작할게요!\n잠시만 기다려주세요... ⏳',
            delay: TYPING_DELAYS.medium,
          },
        ])

        setCurrentStep('generating')

        // AI 생성 시작
        if (onGenerate) {
          try {
            await onGenerate(updatedData)
            await sendLettyMessage(
              '완성했어요! 🎉\n오른쪽 미리보기를 확인해주세요.\n마음에 드시면 \'이 디자인으로 시작\' 버튼을 눌러주세요!',
              TYPING_DELAYS.long
            )
            setCurrentStep('complete')
          } catch (error) {
            console.error('Generation failed:', error)
            await sendLettyMessage(
              '앗, 문제가 생겼어요 😢\n다시 시도해볼까요? 처음부터 다시 시작해주세요.',
              TYPING_DELAYS.medium
            )
          }
        }
        break
      }

      default:
        // complete 상태에서는 추가 입력 무시
        break
    }

    isProcessingRef.current = false
  }, [currentStep, collectedData, addMessage, sendLettyMessages, sendLettyMessage, onGenerate])

  // 대화 리셋
  const resetConversation = useCallback(() => {
    setMessages([])
    setCurrentStep('greeting')
    setIsTyping(false)
    setCollectedData({
      groomName: '',
      brideName: '',
      weddingDate: '',
      weddingTime: '',
      venueName: '',
      groomFatherName: '',
      groomMotherName: '',
      brideFatherName: '',
      brideMotherName: '',
      moods: [],
      color: null,
      customColor: '',
    })
    isProcessingRef.current = false
  }, [])

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
