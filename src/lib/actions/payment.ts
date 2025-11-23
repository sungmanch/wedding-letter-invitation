'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import type { ApiResponse } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface PaymentRequestData {
  id: string
  userId: string
  amount: number
  depositName: string | null
  depositAt: string | null
  status: string
  requestedAt: string
  approvedAt: string | null
  notificationSent: boolean
  userEmail?: string
}

/**
 * 사용자가 "입금 완료" 버튼을 클릭했을 때 결제 요청 생성
 * 사용자별로 한 번만 결제하면 모든 모임의 편지 열람 가능
 */
export async function createPaymentRequest(
  userName: string,
  depositName: string
): Promise<ApiResponse<{ id: string; depositName: string }>> {
  try {
    const supabase = await createClient()

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        data: null,
        error: { message: '로그인이 필요합니다.' },
      }
    }

    // 이미 결제 요청이 있는지 확인 (사용자별)
    const { data: existingRequest } = await supabase
      .from('payment_requests')
      .select('id, status, deposit_name')
      .eq('user_id', user.id)
      .in('status', ['pending', 'approved'])
      .single()

    if (existingRequest) {
      if (existingRequest.status === 'approved') {
        return {
          data: null,
          error: { message: '이미 결제가 승인되었습니다.' },
        }
      }
      // pending 상태인 경우 기존 요청 정보 반환
      return {
        data: {
          id: existingRequest.id,
          depositName: existingRequest.deposit_name || '',
        },
        error: null,
      }
    }

    // 입금자명 중복 체크 및 재생성 (최대 5번 시도)
    let finalDepositName = depositName
    let attempts = 0
    const maxAttempts = 5

    while (attempts < maxAttempts) {
      const { data: duplicate } = await supabase
        .from('payment_requests')
        .select('id')
        .eq('deposit_name', finalDepositName)
        .single()

      if (!duplicate) {
        // 중복 없음 - 사용 가능
        break
      }

      // 중복 발견 - 새로운 번호로 재생성
      attempts++
      const randomNum = Math.floor(Math.random() * 900) + 100 // 100-999
      finalDepositName = `${userName}${randomNum}`
    }

    if (attempts === maxAttempts) {
      return {
        data: null,
        error: { message: '입금자명 생성에 실패했습니다. 다시 시도해주세요.' },
      }
    }

    // 결제 요청 생성
    const { data: paymentRequest, error: insertError } = await supabase
      .from('payment_requests')
      .insert({
        user_id: user.id,
        amount: 9900,
        deposit_name: finalDepositName,
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
        depositName: paymentRequest.deposit_name || finalDepositName,
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
 * 결제 상태 확인 (폴링용) - 사용자별로 확인
 */
export async function getPaymentStatus(): Promise<
  ApiResponse<{ status: string; isApproved: boolean }>
> {
  try {
    const supabase = await createClient()

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        data: null,
        error: { message: '로그인이 필요합니다.' },
      }
    }

    // 사용자의 결제 요청 상태 확인
    const { data: paymentRequest } = await supabase
      .from('payment_requests')
      .select('status')
      .eq('user_id', user.id)
      .order('requested_at', { ascending: false })
      .limit(1)
      .single()

    return {
      data: {
        status: paymentRequest?.status || 'none',
        isApproved: paymentRequest?.status === 'approved',
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
 * 사용자의 결제 승인 여부 확인 (편지함 접근 시)
 */
export async function checkUserPaymentApproved(): Promise<
  ApiResponse<{ isApproved: boolean }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        data: { isApproved: false },
        error: null,
      }
    }

    const { data: paymentRequest } = await supabase
      .from('payment_requests')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .single()

    return {
      data: {
        isApproved: !!paymentRequest,
      },
      error: null,
    }
  } catch (error) {
    console.error('Check user payment error:', error)
    return {
      data: { isApproved: false },
      error: null,
    }
  }
}

/**
 * 관리자가 결제를 승인
 * 승인되면 해당 사용자가 만든 모든 모임의 편지 열람 가능
 */
export async function approvePayment(
  paymentId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    // Use admin client for admin-only operations
    const supabase = createAdminClient()

    // 결제 요청 정보 가져오기
    const { data: paymentRequest, error: fetchError } = await supabase
      .from('payment_requests')
      .select('id, user_id, status')
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

    const now = new Date().toISOString()

    // 결제 승인
    const { error: approveError } = await supabase
      .from('payment_requests')
      .update({
        status: 'approved',
        approved_at: now,
        approved_by: null, // Admin password auth, no user session
      })
      .eq('id', paymentId)

    if (approveError) {
      console.error('Payment approve error:', approveError)
      return {
        data: null,
        error: { message: '결제 승인에 실패했습니다.' },
      }
    }

    // 사용자에게 알림 발송
    await sendPaymentApprovalNotification(paymentRequest.user_id)

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
    // Use admin client for admin-only operations
    const supabase = createAdminClient()

    // pending 상태인 결제 요청 가져오기
    const { data: payments, error: fetchError } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })

    if (fetchError) {
      console.error('Fetch pending payments error:', fetchError)
      return {
        data: null,
        error: { message: '결제 요청 목록을 가져오는데 실패했습니다.' },
      }
    }

    // 각 결제 요청에 대해 사용자 이메일 가져오기
    const paymentData: PaymentRequestData[] = []

    for (const payment of payments || []) {
      const { data: { user: requestUser } } = await supabase.auth.admin.getUserById(payment.user_id)

      paymentData.push({
        id: payment.id,
        userId: payment.user_id,
        amount: payment.amount,
        depositName: payment.deposit_name,
        depositAt: payment.deposit_at,
        status: payment.status,
        requestedAt: payment.requested_at,
        approvedAt: payment.approved_at,
        notificationSent: payment.notification_sent,
        userEmail: requestUser?.email,
      })
    }

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
async function sendPaymentApprovalNotification(userId: string) {
  try {
    // Use admin client for admin API calls
    const supabase = createAdminClient()

    // 사용자 정보 가져오기
    const { data: { user } } = await supabase.auth.admin.getUserById(userId)

    if (!user?.email) {
      console.log('No user email found')
      return
    }

    // 사용자가 만든 모임 목록 가져오기
    const { data: events } = await supabase
      .from('events')
      .select('id, group_name')
      .eq('user_id', userId)

    // 이메일 발송
    await resend.emails.send({
      from: 'Wedding Letter <noreply@weddingletter.com>',
      to: user.email,
      subject: '편지함이 열렸습니다! 💌',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ec4899;">결제가 승인되었습니다!</h2>
          <p>안녕하세요,</p>
          <p>결제가 승인되어 모든 청모장의 편지함이 열렸습니다.</p>
          ${
            events && events.length > 0
              ? `
          <p><strong>열람 가능한 모임:</strong></p>
          <ul>
            ${events.map((event) => `<li>${event.group_name}</li>`).join('')}
          </ul>
          `
              : ''
          }
          <p>이제 친구들이 보낸 따뜻한 편지를 읽어보실 수 있습니다.</p>
          <p style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}"
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
      .eq('user_id', userId)

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
    // Use admin client for admin-only operations
    const supabase = createAdminClient()

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
