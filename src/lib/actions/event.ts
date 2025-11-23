'use server'

import { nanoid } from 'nanoid'
import { createClient } from '@/lib/supabase/server'
import { createEventSchema, type CreateEventInput } from '@/lib/validations/event'
import type { ApiResponse } from '@/types'

export interface CreateEventResult {
  id: string
  surveyUrl: string
}

export async function createEvent(
  input: CreateEventInput
): Promise<ApiResponse<CreateEventResult>> {
  // 1. 입력 검증
  const parsed = createEventSchema.safeParse(input)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]
    return {
      data: null,
      error: { message: firstError?.message || '입력값을 확인해주세요' },
    }
  }

  try {
    const supabase = await createClient()

    // 현재 로그인한 사용자 확인 (선택적)
    const { data: { user } } = await supabase.auth.getUser()

    // 2. 고유 survey URL 생성
    const surveyUrl = nanoid(10)

    // 3. 이벤트 생성 (Supabase에 저장)
    // id는 DB에서 자동 생성 (uuid)
    // user_id는 로그인 시 자동 할당, 비로그인 시 null
    const { data: insertedEvent, error: insertError } = await supabase
      .from('events')
      .insert({
        // 로그인 상태면 user.id 저장, 아니면 null (향후 claim 가능)
        user_id: user?.id || null,
        group_name: parsed.data.groupName,
        expected_members: parsed.data.expectedMembers || null,
        preferred_location: parsed.data.preferredLocation || null,
        budget_range: parsed.data.budgetRange || null,
        meeting_date: parsed.data.meetingDate || null,
        survey_url: surveyUrl,
        status: 'collecting',
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return {
        data: null,
        error: { message: '청모장 생성에 실패했습니다. 다시 시도해주세요.' },
      }
    }

    // 4. 결과 반환
    return {
      data: {
        id: insertedEvent.id,
        surveyUrl,
      },
      error: null,
    }
  } catch (error) {
    console.error('createEvent error:', error)
    return {
      data: null,
      error: { message: '청모장 생성에 실패했습니다. 다시 시도해주세요.' },
    }
  }
}

export async function getEvent(eventId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (error) {
    console.error('getEvent error:', error)
    return null
  }

  return data
}

// 이벤트 소유권 연결 (비회원으로 생성 후 로그인 시 연결)
export async function claimEvent(eventId: string): Promise<ApiResponse<boolean>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return {
        data: null,
        error: { message: '로그인이 필요합니다.' },
      }
    }

    const { error } = await supabase
      .from('events')
      .update({ user_id: user.id })
      .eq('id', eventId)
      .is('user_id', null) // user_id가 null인 경우에만 업데이트

    if (error) {
      console.error('claimEvent error:', error)
      return {
        data: null,
        error: { message: '청모장 연결에 실패했습니다.' },
      }
    }

    return {
      data: true,
      error: null,
    }
  } catch (error) {
    console.error('claimEvent error:', error)
    return {
      data: null,
      error: { message: '청모장 연결에 실패했습니다.' },
    }
  }
}
