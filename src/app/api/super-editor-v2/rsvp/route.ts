import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { rsvpResponses } from '@/lib/db/super-editor-schema'
import { eq, desc, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

// ============================================
// Constants
// ============================================

const COOKIE_ID_NAME = 'rsvp_visitor_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1년

// ============================================
// Helper Functions
// ============================================

async function getOrCreateCookieId(): Promise<string> {
  const cookieStore = await cookies()
  const existingCookieId = cookieStore.get(COOKIE_ID_NAME)?.value

  return existingCookieId || uuidv4()
}

// ============================================
// POST: RSVP 제출
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      invitationId,
      side,
      name,
      phone,
      busOption,
      attendance,
      guestCount,
      message,
    } = body

    // 유효성 검사
    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '성함을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: '성함은 50자 이내로 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!attendance || !['yes', 'no'].includes(attendance)) {
      return NextResponse.json(
        { error: '참석 여부를 선택해주세요.' },
        { status: 400 }
      )
    }

    // cookieId 가져오기 또는 생성
    const cookieId = await getOrCreateCookieId()

    // 기존 응답 확인 (동일 청첩장 + 동일 쿠키)
    const existingResponse = await db
      .select()
      .from(rsvpResponses)
      .where(
        and(
          eq(rsvpResponses.invitationId, invitationId),
          eq(rsvpResponses.cookieId, cookieId)
        )
      )
      .limit(1)

    let rsvpResponse

    if (existingResponse.length > 0) {
      // 기존 응답 업데이트
      const [updated] = await db
        .update(rsvpResponses)
        .set({
          guestName: name.trim(),
          guestPhone: phone?.trim() || null,
          attending: attendance,
          side: side || null,
          guestCount: guestCount || 1,
          mealOption: busOption || null, // busOption을 mealOption 필드에 저장 (재활용)
          message: message?.trim() || null,
        })
        .where(eq(rsvpResponses.id, existingResponse[0].id))
        .returning()

      rsvpResponse = updated
    } else {
      // 새 응답 저장
      const [newResponse] = await db
        .insert(rsvpResponses)
        .values({
          invitationId,
          cookieId,
          guestName: name.trim(),
          guestPhone: phone?.trim() || null,
          attending: attendance,
          side: side || null,
          guestCount: guestCount || 1,
          mealOption: busOption || null,
          message: message?.trim() || null,
        })
        .returning()

      rsvpResponse = newResponse
    }

    // 응답에 쿠키 설정
    const response = NextResponse.json({
      success: true,
      rsvp: rsvpResponse,
      isUpdate: existingResponse.length > 0,
    })

    response.cookies.set(COOKIE_ID_NAME, cookieId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('RSVP POST Error:', error)
    return NextResponse.json(
      { error: 'RSVP 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// ============================================
// GET: RSVP 목록 조회 (관리자용)
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const invitationId = searchParams.get('invitationId')
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const side = searchParams.get('side') // 'groom' | 'bride' | null

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId가 필요합니다.' },
        { status: 400 }
      )
    }

    // 조건 빌드
    const conditions = [eq(rsvpResponses.invitationId, invitationId)]
    if (side && ['groom', 'bride'].includes(side)) {
      conditions.push(eq(rsvpResponses.side, side))
    }

    // RSVP 조회 (최신순)
    const responses = await db
      .select()
      .from(rsvpResponses)
      .where(and(...conditions))
      .orderBy(desc(rsvpResponses.submittedAt))
      .limit(limit)
      .offset(offset)

    // 통계 계산
    const allResponses = await db
      .select()
      .from(rsvpResponses)
      .where(eq(rsvpResponses.invitationId, invitationId))

    const stats = {
      total: allResponses.length,
      attending: allResponses.filter(r => r.attending === 'yes').length,
      notAttending: allResponses.filter(r => r.attending === 'no').length,
      groom: allResponses.filter(r => r.side === 'groom').length,
      bride: allResponses.filter(r => r.side === 'bride').length,
      totalGuests: allResponses
        .filter(r => r.attending === 'yes')
        .reduce((sum, r) => sum + (r.guestCount || 1), 0),
    }

    return NextResponse.json({
      success: true,
      responses,
      stats,
      pagination: {
        limit,
        offset,
        hasMore: responses.length === limit,
      },
    })
  } catch (error) {
    console.error('RSVP GET Error:', error)
    return NextResponse.json(
      { error: 'RSVP 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
