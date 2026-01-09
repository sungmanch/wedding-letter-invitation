import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { guestbookMessagesV2, editorDocumentsV2 } from '@/lib/super-editor-v2/schema/db-schema'
import { eq, desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'

// ============================================
// POST: 방명록 메시지 작성
// ============================================

const COOKIE_NAME = 'guestbook_visitor_id'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, name, message } = body

    // cookieId: body > 쿠키 > 신규 발급
    const existingCookieId = request.cookies.get(COOKIE_NAME)?.value
    const cookieId = body.cookieId || existingCookieId
    const isNewCookie = !cookieId
    const finalCookieId = cookieId || crypto.randomUUID()

    // 유효성 검사
    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId가 필요합니다.' },
        { status: 400 }
      )
    }

    // 문서 존재 및 발행 여부 확인 (발행된 문서에만 방명록 작성 가능)
    const [doc] = await db
      .select({ userId: editorDocumentsV2.userId, isPaid: editorDocumentsV2.isPaid })
      .from(editorDocumentsV2)
      .where(eq(editorDocumentsV2.id, documentId))
      .limit(1)

    if (!doc) {
      return NextResponse.json(
        { error: '문서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (!doc.isPaid) {
      return NextResponse.json(
        { error: '발행된 청첩장에만 방명록을 남길 수 있습니다.' },
        { status: 403 }
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

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: '메시지를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: '메시지는 1000자 이내로 입력해주세요.' },
        { status: 400 }
      )
    }

    // 새 메시지 저장
    const [newMessage] = await db
      .insert(guestbookMessagesV2)
      .values({
        documentId,
        name: name.trim(),
        message: message.trim(),
        cookieId: finalCookieId,
      })
      .returning()

    const response = NextResponse.json({
      success: true,
      message: newMessage,
      cookieId: finalCookieId,
    })

    // 새 쿠키 발급 시 1년 유효기간으로 설정
    if (isNewCookie) {
      response.cookies.set(COOKIE_NAME, finalCookieId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ONE_YEAR_SECONDS,
        path: '/',
      })
    }

    return response
  } catch {
    return NextResponse.json(
      { error: '방명록 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// ============================================
// GET: 방명록 목록 조회 (문서 소유자용)
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId가 필요합니다.' },
        { status: 400 }
      )
    }

    // 인증 확인 - 문서 소유자만 조회 가능
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // 문서 소유권 확인
    const [document] = await db
      .select({ userId: editorDocumentsV2.userId })
      .from(editorDocumentsV2)
      .where(eq(editorDocumentsV2.id, documentId))
      .limit(1)

    if (!document) {
      return NextResponse.json(
        { error: '문서를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (document.userId !== user.id) {
      return NextResponse.json(
        { error: '이 문서의 방명록을 조회할 권한이 없습니다.' },
        { status: 403 }
      )
    }

    // 방명록 조회 (최신순)
    const messages = await db
      .select()
      .from(guestbookMessagesV2)
      .where(eq(guestbookMessagesV2.documentId, documentId))
      .orderBy(desc(guestbookMessagesV2.createdAt))
      .limit(limit)
      .offset(offset)

    // 전체 개수 조회
    const allMessages = await db
      .select()
      .from(guestbookMessagesV2)
      .where(eq(guestbookMessagesV2.documentId, documentId))

    return NextResponse.json({
      success: true,
      messages,
      stats: {
        total: allMessages.length,
      },
      pagination: {
        limit,
        offset,
        hasMore: messages.length === limit,
      },
    })
  } catch {
    return NextResponse.json(
      { error: '방명록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
