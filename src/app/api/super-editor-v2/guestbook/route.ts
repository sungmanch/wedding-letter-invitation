import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { guestbookMessagesV2, editorDocumentsV2 } from '@/lib/super-editor-v2/schema/db-schema'
import { eq, desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'

// ============================================
// POST: 방명록 메시지 작성
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, name, message, cookieId } = body

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

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: '메시지를 입력해주세요.' },
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
        cookieId: cookieId || null,
      })
      .returning()

    return NextResponse.json({
      success: true,
      message: newMessage,
    })
  } catch (error) {
    console.error('Guestbook POST Error:', error)
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
  } catch (error) {
    console.error('Guestbook GET Error:', error)
    return NextResponse.json(
      { error: '방명록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
