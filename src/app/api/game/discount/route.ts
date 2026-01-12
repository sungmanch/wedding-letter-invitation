import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { db } from '@/lib/db'
import { gameDiscountCodes } from '@/lib/db/game-schema'
import { eq, and } from 'drizzle-orm'

// 할인코드 생성 API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { score, grade, discountPercent } = body

    // 유효성 검사
    if (typeof score !== 'number' || !grade || typeof discountPercent !== 'number') {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      )
    }

    // B등급 미만은 할인코드 없음
    if (discountPercent <= 0) {
      return NextResponse.json(
        { error: 'No discount available for this grade' },
        { status: 400 }
      )
    }

    // 할인코드 생성 (고유한 코드 보장)
    let code: string
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      code = `WEDDING-${nanoid(6).toUpperCase()}`

      // 코드 중복 확인
      const existing = await db.query.gameDiscountCodes.findFirst({
        where: eq(gameDiscountCodes.code, code),
      })

      if (!existing) {
        break
      }
      attempts++
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Failed to generate unique code' },
        { status: 500 }
      )
    }

    // 만료일 계산 (7일 후)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // DB에 저장
    const [inserted] = await db.insert(gameDiscountCodes).values({
      code: code!,
      discountPercent,
      score,
      grade,
      expiresAt,
      userId: null, // 비로그인 사용자
      used: false,
    }).returning()

    return NextResponse.json({
      code: inserted.code,
      discountPercent: inserted.discountPercent,
      grade: inserted.grade,
      expiresAt: inserted.expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('Error creating discount code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 할인코드 검증 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Code parameter is required' },
        { status: 400 }
      )
    }

    // DB에서 코드 검증
    const discount = await db.query.gameDiscountCodes.findFirst({
      where: eq(gameDiscountCodes.code, code),
    })

    if (!discount) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid code',
      })
    }

    // 만료 확인
    if (new Date() > discount.expiresAt) {
      return NextResponse.json({
        valid: false,
        error: 'Expired code',
      })
    }

    // 사용 여부 확인
    if (discount.used) {
      return NextResponse.json({
        valid: false,
        error: 'Code already used',
      })
    }

    return NextResponse.json({
      valid: true,
      discountPercent: discount.discountPercent,
      grade: discount.grade,
      score: discount.score,
      expiresAt: discount.expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('Error validating discount code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 할인코드 사용 처리 API
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, userId } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      )
    }

    // DB에서 코드 조회
    const discount = await db.query.gameDiscountCodes.findFirst({
      where: eq(gameDiscountCodes.code, code),
    })

    if (!discount) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 404 }
      )
    }

    // 만료 확인
    if (new Date() > discount.expiresAt) {
      return NextResponse.json(
        { error: 'Expired code' },
        { status: 400 }
      )
    }

    // 이미 사용됨
    if (discount.used) {
      return NextResponse.json(
        { error: 'Code already used' },
        { status: 400 }
      )
    }

    // 사용 처리
    const [updated] = await db
      .update(gameDiscountCodes)
      .set({
        used: true,
        usedAt: new Date(),
        userId: userId || null,
      })
      .where(eq(gameDiscountCodes.code, code))
      .returning()

    return NextResponse.json({
      success: true,
      discountPercent: updated.discountPercent,
    })
  } catch (error) {
    console.error('Error using discount code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
