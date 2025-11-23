'use server'

import { createClient } from '@/lib/supabase/server'
import {
  surveyResponseSchema,
  letterSchema,
  type SurveyResponseInput,
  type LetterInput,
} from '@/lib/validations/survey'
import type { ApiResponse } from '@/types'

export interface SubmitSurveyResult {
  responseId: string
}

export interface EventInfo {
  id: string
  groupName: string
}

export async function getEventBySurveyUrl(
  surveyUrl: string
): Promise<ApiResponse<EventInfo>> {
  try {
    const supabase = await createClient()

    const { data: event, error } = await supabase
      .from('events')
      .select('id, group_name')
      .eq('survey_url', surveyUrl)
      .single()

    if (error || !event) {
      return {
        data: null,
        error: { message: '청모장을 찾을 수 없습니다.' },
      }
    }

    return {
      data: {
        id: event.id,
        groupName: event.group_name,
      },
      error: null,
    }
  } catch (error) {
    console.error('getEventBySurveyUrl error:', error)
    return {
      data: null,
      error: { message: '청모장을 찾을 수 없습니다.' },
    }
  }
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
    const supabase = await createClient()

    // 2. 설문 응답을 Supabase DB에 저장
    const { data: surveyResponse, error: surveyError } = await supabase
      .from('survey_responses')
      .insert({
        event_id: eventId,
        guest_name: surveyParsed.data.guestName,
        food_types: surveyParsed.data.foodTypes,
        atmospheres: surveyParsed.data.atmospheres,
        price_range: surveyParsed.data.priceRange || null,
        dietary_restriction: surveyParsed.data.dietaryRestriction || null,
        allergy_info: surveyParsed.data.allergyInfo || null,
        disliked_foods: surveyParsed.data.dislikedFoods || null,
        preferred_location: surveyParsed.data.preferredLocation || null,
      })
      .select('id')
      .single()

    if (surveyError) {
      console.error('Survey insert error:', surveyError)
      return {
        data: null,
        error: { message: '설문 응답 저장에 실패했습니다. 다시 시도해주세요.' },
      }
    }

    // 3. 편지를 Supabase DB에 저장 (있는 경우)
    if (letterInput?.content) {
      const { error: letterError } = await supabase
        .from('letters')
        .insert({
          event_id: eventId,
          survey_response_id: surveyResponse.id,
          guest_name: surveyParsed.data.guestName,
          content: letterInput.content,
          stickers: letterInput.stickers || null,
        })

      if (letterError) {
        console.error('Letter insert error:', letterError)
        // 편지 저장 실패는 치명적이지 않으므로 계속 진행
      }
    }

    return {
      data: { responseId: surveyResponse.id },
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
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('getResponses error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('getResponses error:', error)
    return []
  }
}

export async function getLetters(eventId: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('getLetters error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('getLetters error:', error)
    return []
  }
}
