import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { guestbookMessages } from '@/lib/db/super-editor-schema'
import { eq, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

// ============================================
// Constants
// ============================================

const COOKIE_ID_NAME = 'guestbook_visitor_id'
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
// POST: 메시지 작성
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invitationId, name, message } = body

    // 유효성 검사
    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '이름을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: '이름은 50자 이내로 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: '메시지를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: '메시지는 500자 이내로 입력해주세요.' },
        { status: 400 }
      )
    }

    // cookieId 가져오기 또는 생성
    const cookieId = await getOrCreateCookieId()

    // 메시지 저장
    const [newMessage] = await db
      .insert(guestbookMessages)
      .values({
        invitationId,
        cookieId,
        name: name.trim(),
        message: message.trim(),
      })
      .returning()

    // 응답에 쿠키 설정
    const response = NextResponse.json({
      success: true,
      message: newMessage,
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
    console.error('Guestbook POST Error:', error)
    return NextResponse.json(
      { error: '메시지 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// ============================================
// GET: 메시지 목록 조회
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const invitationId = searchParams.get('invitationId')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId가 필요합니다.' },
        { status: 400 }
      )
    }

    // 메시지 조회 (최신순)
    const messages = await db
      .select()
      .from(guestbookMessages)
      .where(eq(guestbookMessages.invitationId, invitationId))
      .orderBy(desc(guestbookMessages.createdAt))
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        limit,
        offset,
        hasMore: messages.length === limit,
      },
    })
  } catch (error) {
    console.error('Guestbook GET Error:', error)
    return NextResponse.json(
      { error: '메시지 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
