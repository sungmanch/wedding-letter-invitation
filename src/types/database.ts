// Re-export all database types from schema
export type {
  Event,
  NewEvent,
  SurveyResponse,
  NewSurveyResponse,
  Letter,
  NewLetter,
  RestaurantRecommendation,
  NewRestaurantRecommendation,
  PaymentRequest,
  NewPaymentRequest,
} from '@/lib/db/schema'

// Event status types
export type EventStatus =
  | 'collecting' // 설문 수집 중
  | 'completed' // 설문 수집 완료
  | 'restaurant_selected' // 식당 선택 완료
  | 'shared' // 청모장 공유 완료

// Payment status types
export type PaymentStatus =
  | 'pending' // 결제 대기 중
  | 'requested' // 결제 확인 요청
  | 'approved' // 승인됨
  | 'rejected' // 거절됨

// Survey form data types
export interface SurveyFormData {
  guestName: string
  foodTypes: string[]
  atmospheres: string[]
  priceRange?: string
  dietaryRestriction?: string
  allergyInfo?: string
  dislikedFoods?: string
  preferredLocation?: string
}

// Letter form data types
export interface LetterFormData {
  content: string
  stickers?: string[]
}

// Event form data types
export interface EventFormData {
  groupName: string
  expectedMembers?: string
  preferredLocation?: string
  budgetRange?: string
}

// API Response type
export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: { message: string; code?: string } }

// Event with relations
export interface EventWithRelations {
  id: string
  userId: string | null
  groupName: string
  expectedMembers: string | null
  preferredLocation: string | null
  budgetRange: string | null
  surveyUrl: string | null
  status: string
  letterUnlockAt: Date | null
  letterUnlocked: boolean
  selectedRestaurantId: string | null
  meetingDate: Date | null
  meetingTime: string | null
  additionalMessage: string | null
  createdAt: Date
  updatedAt: Date
  surveyResponses?: SurveyResponseWithLetter[]
  letters?: LetterData[]
  restaurantRecommendations?: RestaurantData[]
}

export interface SurveyResponseWithLetter {
  id: string
  eventId: string
  guestName: string
  foodTypes: string[] | null
  atmospheres: string[] | null
  priceRange: string | null
  dietaryRestriction: string | null
  allergyInfo: string | null
  dislikedFoods: string | null
  preferredLocation: string | null
  createdAt: Date
  letter?: LetterData | null
}

export interface LetterData {
  id: string
  eventId: string
  surveyResponseId: string | null
  guestName: string
  content: string | null
  stickers: string[] | null
  isRead: boolean
  createdAt: Date
}

export interface RestaurantData {
  id: string
  eventId: string
  name: string
  category: string | null
  location: string | null
  priceRange: string | null
  imageUrl: string | null
  matchScore: number | null
  matchReasons: string[] | null
  createdAt: Date
}
