'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { sendRecommendationCompleteEmail } from '@/lib/email-notification'
import type { ApiResponse } from '@/types'
import type { RestaurantData } from '@/types/database'

export interface RestaurantInput {
  name: string
  category: string
  location: string
  priceRange: string
  imageUrl?: string
  mapUrl?: string
  matchScore: number
  matchReasons: string[]
}

export async function requestRecommendation(eventId: string): Promise<ApiResponse<boolean>> {
  try {
    const supabase = await createClient()

    // Get event info
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, group_name, status')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return {
        data: null,
        error: { message: '청모장을 찾을 수 없습니다.' },
      }
    }

    // Check if already requested
    if (event.status === 'pending') {
      return {
        data: null,
        error: { message: '이미 추천 요청이 진행 중입니다.' },
      }
    }

    // Count responses
    const { count: responseCount } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)

    if (!responseCount || responseCount < 3) {
      return {
        data: null,
        error: { message: '추천을 받으려면 최소 3명의 응답이 필요합니다.' },
      }
    }

    // Update status to pending
    const { error: updateError } = await supabase
      .from('events')
      .update({
        status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('Failed to update event status:', updateError)
      return {
        data: null,
        error: { message: '추천 요청에 실패했습니다.' },
      }
    }

    return {
      data: true,
      error: null,
    }
  } catch (error) {
    console.error('requestRecommendation error:', error)
    return {
      data: null,
      error: { message: '추천 요청에 실패했습니다.' },
    }
  }
}

export async function getPendingRequests(): Promise<
  ApiResponse<
    Array<{
      id: string
      groupName: string
      responseCount: number
      createdAt: string
    }>
  >
> {
  try {
    const supabase = await createClient()

    // Get events with pending status
    const { data: events, error } = await supabase
      .from('events')
      .select('id, group_name, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('getPendingRequests error:', error)
      return {
        data: null,
        error: { message: '요청 목록을 불러오지 못했습니다.' },
      }
    }

    // Get response counts for each event
    const eventsWithCounts = await Promise.all(
      (events || []).map(async (event) => {
        const { count } = await supabase
          .from('survey_responses')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', event.id)

        return {
          id: event.id,
          groupName: event.group_name,
          responseCount: count || 0,
          createdAt: event.created_at,
        }
      })
    )

    return {
      data: eventsWithCounts,
      error: null,
    }
  } catch (error) {
    console.error('getPendingRequests error:', error)
    return {
      data: null,
      error: { message: '요청 목록을 불러오지 못했습니다.' },
    }
  }
}

export async function addRestaurantRecommendations(
  eventId: string,
  restaurants: RestaurantInput[]
): Promise<ApiResponse<boolean>> {
  try {
    // Use admin client for admin-only operations (no user session required)
    const supabase = createAdminClient()

    // Insert recommendations
    const { error: insertError } = await supabase.from('restaurant_recommendations').insert(
      restaurants.map((r) => ({
        event_id: eventId,
        name: r.name,
        category: r.category,
        location: r.location,
        price_range: r.priceRange,
        image_url: r.imageUrl || null,
        map_url: r.mapUrl || null,
        match_score: r.matchScore,
        match_reasons: r.matchReasons,
      }))
    )

    if (insertError) {
      console.error('Failed to insert recommendations:', insertError)
      return {
        data: null,
        error: { message: '추천 저장에 실패했습니다.' },
      }
    }

    // Update event status to completed
    const { error: updateError } = await supabase
      .from('events')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('Failed to update event status:', updateError)
      // Don't return error, recommendations are saved
    }

    // Get event owner's email and send notification
    const { data: event } = await supabase
      .from('events')
      .select('user_id, group_name')
      .eq('id', eventId)
      .single()

    if (event?.user_id) {
      // Get user email from auth
      const {
        data: { user },
      } = await supabase.auth.admin.getUserById(event.user_id)

      if (user?.email) {
        // Send email notification (don't wait for it)
        await sendRecommendationCompleteEmail(user.email, eventId, event.group_name).catch(
          (error) => {
            console.error('Failed to send email notification:', error)
          }
        )
      }
    }

    return {
      data: true,
      error: null,
    }
  } catch (error) {
    console.error('addRestaurantRecommendations error:', error)
    return {
      data: null,
      error: { message: '추천 저장에 실패했습니다.' },
    }
  }
}

export async function getRecommendations(eventId: string): Promise<ApiResponse<RestaurantData[]>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('restaurant_recommendations')
      .select('*')
      .eq('event_id', eventId)
      .order('match_score', { ascending: false })

    if (error) {
      console.error('getRecommendations error:', error)
      return {
        data: null,
        error: { message: '추천 목록을 불러오지 못했습니다.' },
      }
    }

    const recommendations: RestaurantData[] = (data || []).map((r) => ({
      id: r.id,
      eventId: r.event_id,
      name: r.name,
      category: r.category,
      location: r.location,
      priceRange: r.price_range,
      imageUrl: r.image_url,
      mapUrl: r.map_url,
      matchScore: r.match_score,
      matchReasons: r.match_reasons,
      createdAt: new Date(r.created_at),
    }))

    return {
      data: recommendations,
      error: null,
    }
  } catch (error) {
    console.error('getRecommendations error:', error)
    return {
      data: null,
      error: { message: '추천 목록을 불러오지 못했습니다.' },
    }
  }
}

export async function selectRestaurant(
  eventId: string,
  restaurantId: string
): Promise<ApiResponse<boolean>> {
  try {
    const supabase = await createClient()

    // Verify ownership
    const {
      data: { user },
    } = await supabase.auth.getUser()
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

    // Update selected restaurant
    const { error: updateError } = await supabase
      .from('events')
      .update({
        selected_restaurant_id: restaurantId,
        status: 'restaurant_selected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId)

    if (updateError) {
      console.error('Failed to select restaurant:', updateError)
      return {
        data: null,
        error: { message: '식당 선택에 실패했습니다.' },
      }
    }

    return {
      data: true,
      error: null,
    }
  } catch (error) {
    console.error('selectRestaurant error:', error)
    return {
      data: null,
      error: { message: '식당 선택에 실패했습니다.' },
    }
  }
}

export async function getEventDetails(eventId: string): Promise<
  ApiResponse<{
    event: {
      id: string
      groupName: string
      responseCount: number
      createdAt: string
    }
    responses: Array<{
      guestName: string
      foodTypes: string[]
      atmospheres: string[]
      dietaryRestriction: string | null
      allergyInfo: string | null
      dislikedFoods: string | null
    }>
  }>
> {
  try {
    const supabase = await createClient()

    // Get event info
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, group_name, created_at')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return {
        data: null,
        error: { message: '청모장을 찾을 수 없습니다.' },
      }
    }

    // Get survey responses
    const { data: responses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('event_id', eventId)

    if (responsesError) {
      console.error('Failed to fetch responses:', responsesError)
      return {
        data: null,
        error: { message: '설문 응답을 불러오지 못했습니다.' },
      }
    }

    return {
      data: {
        event: {
          id: event.id,
          groupName: event.group_name,
          responseCount: responses?.length || 0,
          createdAt: event.created_at,
        },
        responses: (responses || []).map((r) => ({
          guestName: r.guest_name,
          foodTypes: r.food_types || [],
          atmospheres: r.atmospheres || [],
          dietaryRestriction: r.dietary_restriction,
          allergyInfo: r.allergy_info,
          dislikedFoods: r.disliked_foods,
        })),
      },
      error: null,
    }
  } catch (error) {
    console.error('getEventDetails error:', error)
    return {
      data: null,
      error: { message: '이벤트 정보를 불러오지 못했습니다.' },
    }
  }
}
