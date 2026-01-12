import { NextRequest, NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { gameDiscountCodes } from '@/lib/db/game-schema'
import { createPolarDiscount } from '@/lib/game/polar-discount'

// Polar.sh는 하이픈/언더스코어를 지원하지 않음 - 영숫자만 사용
const generateCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6)

// ============================================
// Response Helpers
// ============================================

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

function badRequest(message: string): NextResponse {
  return errorResponse(message, 400)
}

function serverError(message: string): NextResponse {
  return errorResponse(message, 500)
}

// ============================================
// Validation Helpers
// ============================================

type DiscountCodeValidation =
  | { valid: false; error: string }
  | { valid: true; discount: typeof gameDiscountCodes.$inferSelect }

async function validateDiscountCode(code: string): Promise<DiscountCodeValidation> {
  const discount = await db.query.gameDiscountCodes.findFirst({
    where: eq(gameDiscountCodes.code, code),
  })

  if (!discount) {
    return { valid: false, error: 'Invalid code' }
  }

  if (new Date() > discount.expiresAt) {
    return { valid: false, error: 'Expired code' }
  }

  if (discount.used) {
    return { valid: false, error: 'Code already used' }
  }

  return { valid: true, discount }
}

// ============================================
// API Handlers
// ============================================

// 할인코드 생성 API
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { score, grade, discountPercent } = body

    // 유효성 검사
    if (typeof score !== 'number' || !grade || typeof discountPercent !== 'number') {
      return badRequest('Invalid parameters')
    }

    // B등급 미만은 할인코드 없음
    if (discountPercent <= 0) {
      return badRequest('No discount available for this grade')
    }

    // 할인코드 생성 (고유한 코드 보장)
    let code: string = ''
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      code = `WEDDING${generateCode()}`

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
      return serverError('Failed to generate unique code')
    }

    // 만료일 계산 (7일 후)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Polar.sh에 할인 코드 생성
    let polarDiscountId: string | null = null
    let polarSyncStatus: 'pending' | 'synced' | 'failed' = 'pending'
    let polarSyncError: string | null = null

    const polarResult = await createPolarDiscount({
      code,
      discountPercent,
      expiresAt,
      name: `메모리게임 ${grade}등급 ${discountPercent}% 할인`,
    })

    if (polarResult.success) {
      polarDiscountId = polarResult.polarDiscountId
      polarSyncStatus = 'synced'
    } else {
      // Polar 연동 실패해도 로컬 코드는 생성 (graceful degradation)
      polarSyncStatus = 'failed'
      polarSyncError = polarResult.error
      console.warn('Polar discount sync failed, continuing with local code:', polarResult.error)
    }

    // DB에 저장
    const [inserted] = await db.insert(gameDiscountCodes).values({
      code,
      discountPercent,
      score,
      grade,
      expiresAt,
      userId: null, // 비로그인 사용자
      used: false,
      polarDiscountId,
      polarSyncStatus,
      polarSyncError,
    }).returning()

    return NextResponse.json({
      code: inserted.code,
      discountPercent: inserted.discountPercent,
      grade: inserted.grade,
      expiresAt: inserted.expiresAt.toISOString(),
      polarSynced: polarSyncStatus === 'synced',
    })
  } catch (error) {
    console.error('Error creating discount code:', error)
    return serverError('Internal server error')
  }
}

// 할인코드 검증 API
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return badRequest('Code parameter is required')
    }

    const validation = await validateDiscountCode(code)

    if (!validation.valid) {
      return NextResponse.json({ valid: false, error: validation.error })
    }

    const { discount } = validation
    return NextResponse.json({
      valid: true,
      discountPercent: discount.discountPercent,
      grade: discount.grade,
      score: discount.score,
      expiresAt: discount.expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('Error validating discount code:', error)
    return serverError('Internal server error')
  }
}

// 할인코드 사용 처리 API
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { code, userId } = body

    if (!code) {
      return badRequest('Code is required')
    }

    const validation = await validateDiscountCode(code)

    if (!validation.valid) {
      const status = validation.error === 'Invalid code' ? 404 : 400
      return errorResponse(validation.error, status)
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
    return serverError('Internal server error')
  }
}
