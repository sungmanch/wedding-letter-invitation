/**
 * Greeting Suggestions - 인사말/엔딩 추천 문구
 *
 * 에디터에서 textarea 필드에 "추천" 버튼을 표시하고
 * 클릭 시 카테고리별 추천 문구를 선택할 수 있도록 함
 */

// ============================================
// Types
// ============================================

export type SuggestionCategory = 'classic' | 'romantic' | 'modern' | 'humorous'
export type SuggestionType = 'greeting-title' | 'greeting-content' | 'ending-quote'

export interface GreetingSuggestion {
  id: string
  category: SuggestionCategory
  type: SuggestionType
  text: string
  source?: string // 인용문 출처 (영화, 책 등)
  tags: string[]
}

// ============================================
// Category Labels
// ============================================

export const CATEGORY_LABELS: Record<SuggestionCategory, string> = {
  classic: '클래식',
  romantic: '감성',
  modern: '모던',
  humorous: '유머',
}

// ============================================
// Suggestible Fields
// ============================================

/** 추천 기능이 활성화되는 필드 목록 */
export const SUGGESTIBLE_FIELDS = new Set([
  'greeting.title',
  'greeting.content',
  'custom.quoteText',
])

/** 필드별 추천 타입 매핑 */
export const FIELD_TO_SUGGESTION_TYPE: Record<string, SuggestionType> = {
  'greeting.title': 'greeting-title',
  'greeting.content': 'greeting-content',
  'custom.quoteText': 'ending-quote',
}

// ============================================
// Suggestion Data
// ============================================

export const GREETING_SUGGESTIONS: GreetingSuggestion[] = [
  // ==========================================
  // 인사말 제목 (greeting-title)
  // ==========================================
  {
    id: 'title-classic-1',
    category: 'classic',
    type: 'greeting-title',
    text: '소중한 분들을 초대합니다',
    tags: ['전통', '포멀'],
  },
  {
    id: 'title-classic-2',
    category: 'classic',
    type: 'greeting-title',
    text: '두 사람이 사랑으로 만나',
    tags: ['전통', '정중'],
  },
  {
    id: 'title-romantic-1',
    category: 'romantic',
    type: 'greeting-title',
    text: '사랑으로 하나 되는 날',
    tags: ['감성', '로맨틱'],
  },
  {
    id: 'title-romantic-2',
    category: 'romantic',
    type: 'greeting-title',
    text: '우리의 이야기가 시작됩니다',
    tags: ['감성', '스토리'],
  },
  {
    id: 'title-modern-1',
    category: 'modern',
    type: 'greeting-title',
    text: '함께해 주세요',
    tags: ['심플', '현대적'],
  },
  {
    id: 'title-modern-2',
    category: 'modern',
    type: 'greeting-title',
    text: 'We\'re Getting Married',
    tags: ['영문', '모던'],
  },
  {
    id: 'title-humorous-1',
    category: 'humorous',
    type: 'greeting-title',
    text: '드디어 결혼합니다!',
    tags: ['유머', '캐주얼'],
  },

  // ==========================================
  // 인사말 본문 (greeting-content)
  // ==========================================
  {
    id: 'content-classic-1',
    category: 'classic',
    type: 'greeting-content',
    text: `서로 다른 두 길을 걸어온 저희가
이제 하나의 길을 함께 걷고자 합니다.

귀한 걸음 하시어
저희의 앞날을 축복해 주시면
더없는 기쁨이 되겠습니다.`,
    tags: ['전통', '포멀'],
  },
  {
    id: 'content-classic-2',
    category: 'classic',
    type: 'greeting-content',
    text: `저희 두 사람이 사랑과 믿음으로
한 가정을 이루게 되었습니다.

바쁘시더라도 오셔서
축하해 주시면 감사하겠습니다.`,
    tags: ['전통', '간결'],
  },
  {
    id: 'content-classic-3',
    category: 'classic',
    type: 'greeting-content',
    text: `평생을 같이하고 싶은 사람을 만났습니다.

소중한 분들을 모시고
저희의 작은 약속을 함께 나누고 싶습니다.`,
    tags: ['전통', '따뜻함'],
  },
  {
    id: 'content-romantic-1',
    category: 'romantic',
    type: 'greeting-content',
    text: `오랜 기다림 끝에
서로에게 가장 소중한 사람을 만났습니다.

설레는 마음으로 첫 발을 내딛는 날,
함께해 주시면 큰 힘이 되겠습니다.`,
    tags: ['감성', '로맨틱'],
  },
  {
    id: 'content-romantic-2',
    category: 'romantic',
    type: 'greeting-content',
    text: `어느 날 문득, 곁에 있는 사람이
평생 함께하고 싶은 사람임을 알았습니다.

소중한 분들과 함께
그 마음을 나누고 싶습니다.`,
    tags: ['감성', '일상'],
  },
  {
    id: 'content-romantic-3',
    category: 'romantic',
    type: 'greeting-content',
    text: `수많은 우연과 필연이 모여
저희 둘을 이어주었습니다.

그 인연의 아름다움을
함께 축하해 주세요.`,
    tags: ['감성', '인연'],
  },
  {
    id: 'content-modern-1',
    category: 'modern',
    type: 'greeting-content',
    text: `저희 결혼합니다.

새로운 시작을 응원해 주세요.`,
    tags: ['심플', '간결'],
  },
  {
    id: 'content-modern-2',
    category: 'modern',
    type: 'greeting-content',
    text: `좋은 사람을 만나
좋은 날에 결혼합니다.

축하해 주시면 감사하겠습니다.`,
    tags: ['심플', '현대적'],
  },
  {
    id: 'content-humorous-1',
    category: 'humorous',
    type: 'greeting-content',
    text: `그 사람, 제가 데려가도 될까요?

허락해 주시면
맛있는 밥 대접하겠습니다.`,
    tags: ['유머', '캐주얼'],
  },
  {
    id: 'content-humorous-2',
    category: 'humorous',
    type: 'greeting-content',
    text: `솔로 탈출에 성공했습니다!

축하의 박수와 함께
따뜻한 밥 한 끼 함께해요.`,
    tags: ['유머', '친근'],
  },

  // ==========================================
  // 엔딩 인용문 (ending-quote)
  // ==========================================
  {
    id: 'quote-romantic-1',
    category: 'romantic',
    type: 'ending-quote',
    text: '"우리는 매일 시간을 여행한다.\n과거로, 미래로.\n가장 좋은 건 현재를 함께하는 것."',
    source: '영화 「어바웃 타임」',
    tags: ['영화', '감성'],
  },
  {
    id: 'quote-romantic-2',
    category: 'romantic',
    type: 'ending-quote',
    text: '"사랑한다는 건 오래 바라보는 것이 아니라\n함께 같은 곳을 바라보는 것이다."',
    source: '생텍쥐페리 「어린 왕자」',
    tags: ['문학', '명언'],
  },
  {
    id: 'quote-romantic-3',
    category: 'romantic',
    type: 'ending-quote',
    text: '"당신을 만나기 전에는\n나는 내가 누군지 몰랐어요."',
    source: '영화 「제리 맥과이어」',
    tags: ['영화', '로맨틱'],
  },
  {
    id: 'quote-romantic-4',
    category: 'romantic',
    type: 'ending-quote',
    text: '"사랑은 우연히 발견되고\n의도적으로 지켜지며\n선택으로 영원해진다."',
    tags: ['명언', '감성'],
  },
  {
    id: 'quote-classic-1',
    category: 'classic',
    type: 'ending-quote',
    text: '"사랑하면 알게 되고\n알면 보이나니\n그때 보이는 것은 전과 같지 않으리라."',
    source: '유한준 「나의 문화유산답사기」',
    tags: ['문학', '한국'],
  },
  {
    id: 'quote-classic-2',
    category: 'classic',
    type: 'ending-quote',
    text: '"행복은 혼자가 아닌\n함께일 때 비로소 완성된다."',
    tags: ['명언', '전통'],
  },
  {
    id: 'quote-modern-1',
    category: 'modern',
    type: 'ending-quote',
    text: '"Always better together."',
    tags: ['영문', '심플'],
  },
  {
    id: 'quote-modern-2',
    category: 'modern',
    type: 'ending-quote',
    text: '"The best thing to hold onto in life is each other."',
    source: 'Audrey Hepburn',
    tags: ['영문', '명언'],
  },
  {
    id: 'quote-modern-3',
    category: 'modern',
    type: 'ending-quote',
    text: '"감사합니다.\n행복하게 살겠습니다."',
    tags: ['심플', '감사'],
  },
  {
    id: 'quote-humorous-1',
    category: 'humorous',
    type: 'ending-quote',
    text: '"결혼은 눈을 크게 뜨고 들어가서\n반쯤 감고 살아야 한다."',
    source: 'Benjamin Franklin',
    tags: ['유머', '명언'],
  },
  {
    id: 'quote-humorous-2',
    category: 'humorous',
    type: 'ending-quote',
    text: '"축의금은 계좌로,\n축하는 마음으로,\n식사는 맛있게!"',
    tags: ['유머', '캐주얼'],
  },
]

// ============================================
// Helper Functions
// ============================================

/**
 * 특정 필드에 맞는 추천 문구 필터링
 */
export function getSuggestionsByField(binding: string): GreetingSuggestion[] {
  const type = FIELD_TO_SUGGESTION_TYPE[binding]
  if (!type) return []
  return GREETING_SUGGESTIONS.filter((s) => s.type === type)
}

/**
 * 카테고리별 필터링
 */
export function getSuggestionsByCategory(
  binding: string,
  category: SuggestionCategory | 'all'
): GreetingSuggestion[] {
  const suggestions = getSuggestionsByField(binding)
  if (category === 'all') return suggestions
  return suggestions.filter((s) => s.category === category)
}
