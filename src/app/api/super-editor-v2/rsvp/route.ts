import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rsvpResponsesV2 } from '@/lib/super-editor-v2/schema/db-schema'
import { eq, desc, and } from 'drizzle-orm'

// ============================================
// POST: RSVP 제출
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      documentId,
      side,
      name,
      phone,
      busRequired,
      attendance,
      guestCount,
      mealOption,
      note,
      privacyAgreed,
    } = body

    // 유효성 검사
    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId가 필요합니다.' },
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

    if (typeof attendance !== 'boolean') {
      return NextResponse.json(
        { error: '참석 여부를 선택해주세요.' },
        { status: 400 }
      )
    }

    // 새 응답 저장 (SE2에서는 중복 체크 없이 항상 새 응답)
    const [newResponse] = await db
      .insert(rsvpResponsesV2)
      .values({
        documentId,
        name: name.trim(),
        phone: phone?.trim() || null,
        attending: attendance,
        side: side || null,
        guestCount: guestCount || 1,
        mealOption: mealOption || null,
        busRequired: busRequired || null,
        privacyAgreed: privacyAgreed || false,
        note: note?.trim() || null,
      })
      .returning()

    return NextResponse.json({
      success: true,
      rsvp: newResponse,
    })
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
    const documentId = searchParams.get('documentId')
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const side = searchParams.get('side') // 'groom' | 'bride' | null

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId가 필요합니다.' },
        { status: 400 }
      )
    }

    // 조건 빌드
    const conditions = [eq(rsvpResponsesV2.documentId, documentId)]
    if (side && ['groom', 'bride'].includes(side)) {
      conditions.push(eq(rsvpResponsesV2.side, side))
    }

    // RSVP 조회 (최신순)
    const responses = await db
      .select()
      .from(rsvpResponsesV2)
      .where(and(...conditions))
      .orderBy(desc(rsvpResponsesV2.createdAt))
      .limit(limit)
      .offset(offset)

    // 통계 계산
    const allResponses = await db
      .select()
      .from(rsvpResponsesV2)
      .where(eq(rsvpResponsesV2.documentId, documentId))

    const stats = {
      total: allResponses.length,
      attending: allResponses.filter(r => r.attending === true).length,
      notAttending: allResponses.filter(r => r.attending === false).length,
      groom: allResponses.filter(r => r.side === 'groom').length,
      bride: allResponses.filter(r => r.side === 'bride').length,
      totalGuests: allResponses
        .filter(r => r.attending === true)
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
