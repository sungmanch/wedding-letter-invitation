'use server'

import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import type { ApiResponse } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface PaymentRequestData {
  id: string
  eventId: string
  amount: number
  depositName: string | null
  depositAt: string | null
  status: string
  requestedAt: string
  approvedAt: string | null
  notificationSent: boolean
  eventName?: string
  userName?: string
}

/**
 * 사용자가 "입금 완료" 버튼을 클릭했을 때 결제 요청 생성
 */
export async function createPaymentRequest(
  eventId: string,
  userName: string
): Promise<ApiResponse<{ id: string; depositName: string }>> {
  try {
    const supabase = await createClient()

    // 이벤트 존재 확인
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, group_name')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return {
        data: null,
        error: { message: '이벤트를 찾을 수 없습니다.' },
      }
    }

    // 이미 결제 요청이 있는지 확인
    const { data: existingRequest } = await supabase
      .from('payment_requests')
      .select('id, status')
      .eq('event_id', eventId)
      .in('status', ['pending', 'approved'])
      .single()

    if (existingRequest) {
      if (existingRequest.status === 'approved') {
        return {
          data: null,
          error: { message: '이미 결제가 승인된 이벤트입니다.' },
        }
      }
      // pending 상태인 경우 기존 요청 정보 반환
      const { data: pendingRequest } = await supabase
        .from('payment_requests')
        .select('id, deposit_name')
        .eq('id', existingRequest.id)
        .single()

      return {
        data: {
          id: existingRequest.id,
          depositName: pendingRequest?.deposit_name || '',
        },
        error: null,
      }
    }

    // 입금자명 생성: WL-{eventId 앞 5자}-{userName}
    const depositName = `WL-${eventId.slice(0, 5)}-${userName}`

    // 결제 요청 생성
    const { data: paymentRequest, error: insertError } = await supabase
      .from('payment_requests')
      .insert({
        event_id: eventId,
        amount: 9900,
        deposit_name: depositName,
        deposit_at: new Date().toISOString(),
        status: 'pending',
      })
      .select('id, deposit_name')
      .single()

    if (insertError || !paymentRequest) {
      console.error('Payment request insert error:', insertError)
      return {
        data: null,
        error: { message: '결제 요청 생성에 실패했습니다.' },
      }
    }

    return {
      data: {
        id: paymentRequest.id,
        depositName: paymentRequest.deposit_name || depositName,
      },
      error: null,
    }
  } catch (error) {
    console.error('Create payment request error:', error)
    return {
      data: null,
      error: { message: '결제 요청 처리 중 오류가 발생했습니다.' },
    }
  }
}

/**
 * 결제 상태 확인 (폴링용)
 */
export async function getPaymentStatus(
  eventId: string
): Promise<ApiResponse<{ status: string; isUnlocked: boolean }>> {
  try {
    const supabase = await createClient()

    // 이벤트의 letter_unlocked 상태 확인
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('letter_unlocked')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return {
        data: null,
        error: { message: '이벤트를 찾을 수 없습니다.' },
      }
    }

    // 결제 요청 상태 확인
    const { data: paymentRequest } = await supabase
      .from('payment_requests')
      .select('status')
      .eq('event_id', eventId)
      .order('requested_at', { ascending: false })
      .limit(1)
      .single()

    return {
      data: {
        status: paymentRequest?.status || 'none',
        isUnlocked: event.letter_unlocked,
      },
      error: null,
    }
  } catch (error) {
    console.error('Get payment status error:', error)
    return {
      data: null,
      error: { message: '결제 상태 확인 중 오류가 발생했습니다.' },
    }
  }
}

/**
 * 관리자가 결제를 승인하고 편지를 열람 가능하게 함
 */
export async function approvePayment(
  paymentId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const supabase = await createClient()

    // 현재 로그인한 사용자 확인 (관리자 확인)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        data: null,
        error: { message: '로그인이 필요합니다.' },
      }
    }

    // 결제 요청 정보 가져오기
    const { data: paymentRequest, error: fetchError } = await supabase
      .from('payment_requests')
      .select('id, event_id, status')
      .eq('id', paymentId)
      .single()

    if (fetchError || !paymentRequest) {
      return {
        data: null,
        error: { message: '결제 요청을 찾을 수 없습니다.' },
      }
    }

    if (paymentRequest.status === 'approved') {
      return {
        data: null,
        error: { message: '이미 승인된 결제입니다.' },
      }
    }

    // 트랜잭션: payment_requests 승인 + events.letter_unlocked = true
    const now = new Date().toISOString()

    // 1. 결제 승인
    const { error: approveError } = await supabase
      .from('payment_requests')
      .update({
        status: 'approved',
        approved_at: now,
        approved_by: user.id,
      })
      .eq('id', paymentId)

    if (approveError) {
      console.error('Payment approve error:', approveError)
      return {
        data: null,
        error: { message: '결제 승인에 실패했습니다.' },
      }
    }

    // 2. 편지 열람 활성화
    const { error: unlockError } = await supabase
      .from('events')
      .update({
        letter_unlocked: true,
        updated_at: now,
      })
      .eq('id', paymentRequest.event_id)

    if (unlockError) {
      console.error('Letter unlock error:', unlockError)
      return {
        data: null,
        error: { message: '편지 잠금 해제에 실패했습니다.' },
      }
    }

    // 3. 사용자에게 알림 발송
    await sendPaymentApprovalNotification(paymentRequest.event_id)

    return {
      data: { success: true },
      error: null,
    }
  } catch (error) {
    console.error('Approve payment error:', error)
    return {
      data: null,
      error: { message: '결제 승인 처리 중 오류가 발생했습니다.' },
    }
  }
}

/**
 * 관리자 대시보드용: 대기중인 결제 요청 목록 가져오기
 */
export async function getPendingPayments(): Promise<
  ApiResponse<PaymentRequestData[]>
> {
  try {
    const supabase = await createClient()

    // 현재 로그인한 사용자 확인 (관리자 확인)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        data: null,
        error: { message: '로그인이 필요합니다.' },
      }
    }

    // pending 상태인 결제 요청 가져오기 (이벤트 정보 포함)
    const { data: payments, error: fetchError } = await supabase
      .from('payment_requests')
      .select(
        `
        id,
        event_id,
        amount,
        deposit_name,
        deposit_at,
        status,
        requested_at,
        approved_at,
        notification_sent,
        events (
          group_name,
          user_id
        )
      `
      )
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })

    if (fetchError) {
      console.error('Fetch pending payments error:', fetchError)
      return {
        data: null,
        error: { message: '결제 요청 목록을 가져오는데 실패했습니다.' },
      }
    }

    // 데이터 매핑
    const paymentData: PaymentRequestData[] = (payments || []).map((payment: any) => ({
      id: payment.id,
      eventId: payment.event_id,
      amount: payment.amount,
      depositName: payment.deposit_name,
      depositAt: payment.deposit_at,
      status: payment.status,
      requestedAt: payment.requested_at,
      approvedAt: payment.approved_at,
      notificationSent: payment.notification_sent,
      eventName: payment.events?.group_name,
    }))

    return {
      data: paymentData,
      error: null,
    }
  } catch (error) {
    console.error('Get pending payments error:', error)
    return {
      data: null,
      error: { message: '결제 요청 목록 조회 중 오류가 발생했습니다.' },
    }
  }
}

/**
 * 승인 완료 알림 발송
 */
async function sendPaymentApprovalNotification(eventId: string) {
  try {
    const supabase = await createClient()

    // 이벤트 정보와 사용자 이메일 가져오기
    const { data: event } = await supabase
      .from('events')
      .select(
        `
        id,
        group_name,
        user_id
      `
      )
      .eq('id', eventId)
      .single()

    if (!event || !event.user_id) {
      console.log('No user email for notification')
      return
    }

    // 사용자 이메일 가져오기
    const { data: { user } } = await supabase.auth.admin.getUserById(event.user_id)

    if (!user?.email) {
      console.log('No user email found')
      return
    }

    // 이메일 발송
    await resend.emails.send({
      from: 'Wedding Letter <noreply@weddingletter.com>',
      to: user.email,
      subject: '편지함이 열렸습니다! 💌',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ec4899;">결제가 승인되었습니다!</h2>
          <p>안녕하세요,</p>
          <p><strong>${event.group_name}</strong> 청모장의 편지함이 열렸습니다.</p>
          <p>이제 친구들이 보낸 따뜻한 편지를 읽어보실 수 있습니다.</p>
          <p style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/${eventId}/letters"
               style="background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              편지 읽으러 가기
            </a>
          </p>
          <p style="margin-top: 40px; color: #666; font-size: 14px;">
            감사합니다,<br>
            Wedding Letter 팀
          </p>
        </div>
      `,
    })

    // 알림 발송 기록
    await supabase
      .from('payment_requests')
      .update({ notification_sent: true })
      .eq('event_id', eventId)

    console.log('Payment approval notification sent to:', user.email)
  } catch (error) {
    console.error('Send notification error:', error)
    // 알림 실패는 전체 프로세스를 막지 않음
  }
}

/**
 * 결제 거절 (필요 시)
 */
export async function rejectPayment(
  paymentId: string,
  reason?: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('payment_requests')
      .update({
        status: 'rejected',
        // 거절 사유를 저장하려면 스키마에 reject_reason 필드 추가 필요
      })
      .eq('id', paymentId)

    if (error) {
      console.error('Payment reject error:', error)
      return {
        data: null,
        error: { message: '결제 거절 처리에 실패했습니다.' },
      }
    }

    return {
      data: { success: true },
      error: null,
    }
  } catch (error) {
    console.error('Reject payment error:', error)
    return {
      data: null,
      error: { message: '결제 거절 처리 중 오류가 발생했습니다.' },
    }
  }
}
