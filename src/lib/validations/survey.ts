import { z } from 'zod'

export const surveyResponseSchema = z.object({
  guestName: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(100, '이름은 100자 이내로 입력해주세요'),
  foodTypes: z
    .array(z.string())
    .min(1, '음식 종류를 1개 이상 선택해주세요'),
  atmospheres: z
    .array(z.string())
    .min(1, '분위기를 1개 이상 선택해주세요'),
  priceRange: z.string().optional(),
  dietaryRestriction: z.string().optional(),
  allergyInfo: z.string().optional(),
  dislikedFoods: z.string().optional(),
  preferredLocation: z.string().optional(),
})

export const letterSchema = z.object({
  content: z
    .string()
    .max(300, '편지는 300자 이내로 작성해주세요')
    .optional(),
  stickers: z.array(z.string()).optional(),
})

export type SurveyResponseInput = z.infer<typeof surveyResponseSchema>
export type LetterInput = z.infer<typeof letterSchema>

// 음식 종류 옵션
export const foodTypeOptions = [
  { value: '한식', label: '한식', emoji: '🍚' },
  { value: '중식', label: '중식', emoji: '🥟' },
  { value: '일식', label: '일식', emoji: '🍣' },
  { value: '양식', label: '양식', emoji: '🍝' },
  { value: '아시안', label: '아시안', emoji: '🍜' },
  { value: '고기/BBQ', label: '고기/BBQ', emoji: '🥩' },
  { value: '해산물', label: '해산물', emoji: '🦐' },
  { value: '브런치/카페', label: '브런치/카페', emoji: '🥪' },
]

// 분위기 옵션
export const atmosphereOptions = [
  { value: '캐주얼', label: '캐주얼', emoji: '😊' },
  { value: '프라이빗', label: '프라이빗', emoji: '🤫' },
  { value: '로맨틱', label: '로맨틱', emoji: '💕' },
  { value: '트렌디', label: '트렌디', emoji: '✨' },
  { value: '전통적', label: '전통적', emoji: '🏮' },
  { value: '뷰맛집', label: '뷰맛집', emoji: '🌃' },
]

// 가격대 옵션
export const priceRangeOptions = [
  { value: '1만원 이하', label: '1만원 이하' },
  { value: '1-2만원', label: '1-2만원' },
  { value: '2-3만원', label: '2-3만원' },
  { value: '3-5만원', label: '3-5만원' },
  { value: '5만원 이상', label: '5만원 이상' },
]

// 식이 제한 옵션
export const dietaryOptions = [
  { value: '없음', label: '없음' },
  { value: '채식', label: '채식' },
  { value: '비건', label: '비건' },
  { value: '할랄', label: '할랄' },
  { value: '글루텐프리', label: '글루텐프리' },
  { value: '기타', label: '기타' },
]

// 스티커 옵션
export const stickerOptions = [
  '💕', '🎉', '💐', '🥂', '💍', '👰', '🎊', '✨',
  '💝', '🌸', '🎀', '💖', '🦋', '🌹', '💒', '🤍',
]
