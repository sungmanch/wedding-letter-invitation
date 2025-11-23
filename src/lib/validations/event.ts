import { z } from 'zod'

export const createEventSchema = z.object({
  groupName: z
    .string()
    .min(1, '그룹 이름을 입력해주세요')
    .max(100, '그룹 이름은 100자 이내로 입력해주세요'),
  expectedMembers: z.string().optional(),
  preferredLocation: z.string().optional(),
  budgetRange: z.string().optional(),
  meetingDate: z.string().optional(), // ISO date string (YYYY-MM-DD)
  invitationLink: z.string().url().optional().or(z.literal('')),
})

export type CreateEventInput = z.infer<typeof createEventSchema>

// 예상 인원 옵션 (카드형 선택)
export const expectedMembersOptions = [
  { value: '5명 이하', label: '5명 이하', icon: '👤' },
  { value: '6-10명', label: '6-10명', icon: '👥' },
  { value: '11-15명', label: '11-15명', icon: '👨‍👩‍👧' },
  { value: '16명 이상', label: '16명 이상', icon: '👨‍👩‍👧‍👦' },
]

// 예산 옵션 (리스트형 선택)
export const budgetRangeOptions = [
  { value: '3만원 이하', label: '3만원 이하', description: '캐주얼한 분위기', icon: '💰' },
  { value: '3-5만원', label: '3-5만원', description: '적당한 분위기', icon: '💵' },
  { value: '5-8만원', label: '5-8만원', description: '특별한 분위기', icon: '💎' },
  { value: '8만원 이상', label: '8만원 이상', description: '프리미엄 분위기', icon: '👑' },
]

// 지역 옵션 (리스트형 선택)
export const locationOptions = [
  { value: '강남구', label: '강남구', description: '역삼, 선사, 청담, 압구정', icon: '📍' },
  { value: '홍대/합정', label: '홍대/합정', description: '홍익대, 합정역, 상수역', icon: '📍' },
  { value: '이태원/한남', label: '이태원/한남', description: '이태원역, 한남동, 경리단길', icon: '📍' },
  { value: '기타 지역', label: '기타 지역', description: '직접 입력하기', icon: '📍' },
]
