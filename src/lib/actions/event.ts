'use server'

import { nanoid } from 'nanoid'
import { createEventSchema, type CreateEventInput } from '@/lib/validations/event'
import type { ApiResponse } from '@/types'

// 임시 저장소 (Supabase 연결 전까지 사용)
// 실제로는 DB에 저장하지만, 환경 변수 없이도 테스트할 수 있도록 함
const tempEvents = new Map<string, {
  id: string
  groupName: string
  expectedMembers: string | null
  preferredLocation: string | null
  budgetRange: string | null
  surveyUrl: string
  status: string
  createdAt: Date
}>()

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
    // 2. 고유 ID 생성
    const eventId = nanoid(12)
    const surveyUrl = nanoid(10)

    // 3. 이벤트 생성 (임시 저장소에 저장)
    // TODO: Supabase 연결 후 실제 DB에 저장
    const newEvent = {
      id: eventId,
      groupName: parsed.data.groupName,
      expectedMembers: parsed.data.expectedMembers || null,
      preferredLocation: parsed.data.preferredLocation || null,
      budgetRange: parsed.data.budgetRange || null,
      surveyUrl,
      status: 'collecting',
      createdAt: new Date(),
    }

    tempEvents.set(eventId, newEvent)

    // 4. 결과 반환
    return {
      data: {
        id: eventId,
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
  // TODO: Supabase 연결 후 실제 DB에서 조회
  return tempEvents.get(eventId) || null
}
