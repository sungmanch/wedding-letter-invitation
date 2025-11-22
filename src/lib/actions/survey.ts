'use server'

import { nanoid } from 'nanoid'
import {
  surveyResponseSchema,
  letterSchema,
  type SurveyResponseInput,
  type LetterInput,
} from '@/lib/validations/survey'
import type { ApiResponse } from '@/types'

// 임시 저장소
const tempResponses = new Map<string, {
  id: string
  eventId: string
  guestName: string
  foodTypes: string[]
  atmospheres: string[]
  priceRange: string | null
  dietaryRestriction: string | null
  allergyInfo: string | null
  dislikedFoods: string | null
  preferredLocation: string | null
  createdAt: Date
}>()

const tempLetters = new Map<string, {
  id: string
  eventId: string
  surveyResponseId: string
  guestName: string
  content: string | null
  stickers: string[] | null
  createdAt: Date
}>()

export interface SubmitSurveyResult {
  responseId: string
}

export async function submitSurvey(
  eventId: string,
  surveyInput: SurveyResponseInput,
  letterInput?: LetterInput
): Promise<ApiResponse<SubmitSurveyResult>> {
  // 1. 입력 검증
  const surveyParsed = surveyResponseSchema.safeParse(surveyInput)
  if (!surveyParsed.success) {
    const firstError = surveyParsed.error.issues[0]
    return {
      data: null,
      error: { message: firstError?.message || '입력값을 확인해주세요' },
    }
  }

  if (letterInput) {
    const letterParsed = letterSchema.safeParse(letterInput)
    if (!letterParsed.success) {
      const firstError = letterParsed.error.issues[0]
      return {
        data: null,
        error: { message: firstError?.message || '편지 내용을 확인해주세요' },
      }
    }
  }

  try {
    // 2. 설문 응답 저장
    const responseId = nanoid(12)
    const response = {
      id: responseId,
      eventId,
      guestName: surveyParsed.data.guestName,
      foodTypes: surveyParsed.data.foodTypes,
      atmospheres: surveyParsed.data.atmospheres,
      priceRange: surveyParsed.data.priceRange || null,
      dietaryRestriction: surveyParsed.data.dietaryRestriction || null,
      allergyInfo: surveyParsed.data.allergyInfo || null,
      dislikedFoods: surveyParsed.data.dislikedFoods || null,
      preferredLocation: surveyParsed.data.preferredLocation || null,
      createdAt: new Date(),
    }
    tempResponses.set(responseId, response)

    // 3. 편지 저장 (있는 경우)
    if (letterInput?.content) {
      const letterId = nanoid(12)
      const letter = {
        id: letterId,
        eventId,
        surveyResponseId: responseId,
        guestName: surveyParsed.data.guestName,
        content: letterInput.content,
        stickers: letterInput.stickers || null,
        createdAt: new Date(),
      }
      tempLetters.set(letterId, letter)
    }

    return {
      data: { responseId },
      error: null,
    }
  } catch (error) {
    console.error('submitSurvey error:', error)
    return {
      data: null,
      error: { message: '설문 제출에 실패했습니다. 다시 시도해주세요.' },
    }
  }
}

export async function getResponses(eventId: string) {
  // TODO: Supabase 연결 후 실제 DB에서 조회
  return Array.from(tempResponses.values()).filter(r => r.eventId === eventId)
}

export async function getLetters(eventId: string) {
  // TODO: Supabase 연결 후 실제 DB에서 조회
  return Array.from(tempLetters.values()).filter(l => l.eventId === eventId)
}
