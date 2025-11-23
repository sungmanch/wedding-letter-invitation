'use server'

import { createClient } from '@/lib/supabase/server'
import type { ApiResponse } from '@/types'

export interface InvitationData {
  id: string
  groupName: string
  meetingDate: string | null
  meetingTime: string | null
  additionalMessage: string | null
  selectedRestaurant: {
    id: string
    name: string
    location: string
    category: string
  } | null
}

export interface UpdateInvitationInput {
  meetingDate?: string
  meetingTime?: string
  additionalMessage?: string
}

export async function getInvitationData(
  eventId: string
): Promise<ApiResponse<InvitationData>> {
  try {
    const supabase = await createClient()

    // Fetch event with selected restaurant
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select(`
        id,
        group_name,
        meeting_date,
        meeting_time,
        additional_message,
        selected_restaurant_id
      `)
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return {
        data: null,
        error: { message: '청모장을 찾을 수 없습니다.' },
      }
    }

    // Fetch selected restaurant if exists
    let selectedRestaurant = null
    if (event.selected_restaurant_id) {
      const { data: restaurant } = await supabase
        .from('restaurant_recommendations')
        .select('id, name, location, category')
        .eq('id', event.selected_restaurant_id)
        .single()

      if (restaurant) {
        selectedRestaurant = {
          id: restaurant.id,
          name: restaurant.name,
          location: restaurant.location || '',
          category: restaurant.category || '',
        }
      }
    }

    return {
      data: {
        id: event.id,
        groupName: event.group_name,
        meetingDate: event.meeting_date,
        meetingTime: event.meeting_time,
        additionalMessage: event.additional_message,
        selectedRestaurant,
      },
      error: null,
    }
  } catch (error) {
    console.error('getInvitationData error:', error)
    return {
      data: null,
      error: { message: '청모장 정보를 불러오는데 실패했습니다.' },
    }
  }
}

export async function updateInvitation(
  eventId: string,
  input: UpdateInvitationInput
): Promise<ApiResponse<boolean>> {
  try {
    const supabase = await createClient()

    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        data: null,
        error: { message: '로그인이 필요합니다.' },
      }
    }

    const { data: event } = await supabase
      .from('events')
      .select('user_id')
      .eq('id', eventId)
      .single()

    if (!event || event.user_id !== user.id) {
      return {
        data: null,
        error: { message: '이 청모장을 수정할 권한이 없습니다.' },
      }
    }

    // Update invitation data
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (input.meetingDate !== undefined) {
      updateData.meeting_date = input.meetingDate || null
    }
    if (input.meetingTime !== undefined) {
      updateData.meeting_time = input.meetingTime || null
    }
    if (input.additionalMessage !== undefined) {
      updateData.additional_message = input.additionalMessage || null
    }

    const { error: updateError } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)

    if (updateError) {
      console.error('updateInvitation error:', updateError)
      return {
        data: null,
        error: { message: '청모장 업데이트에 실패했습니다.' },
      }
    }

    return {
      data: true,
      error: null,
    }
  } catch (error) {
    console.error('updateInvitation error:', error)
    return {
      data: null,
      error: { message: '청모장 업데이트에 실패했습니다.' },
    }
  }
}
