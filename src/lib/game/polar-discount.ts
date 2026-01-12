/**
 * Polar.sh Discount Integration
 *
 * 메모리 게임 할인코드를 Polar.sh와 연동합니다.
 * - 게임 완료 시 Polar.sh에 할인 코드 생성
 * - 체크아웃 시 할인 코드 적용
 */

import { Polar } from '@polar-sh/sdk'

// ============================================
// SDK Initialization
// ============================================

// Polar SDK 인스턴스 (lazy initialization으로 env 로드 타이밍 문제 해결)
let polarInstance: Polar | null = null

function getPolarClient(): Polar {
  if (!polarInstance) {
    const token = process.env.POLAR_ACCESS_TOKEN
    console.log('[Polar] Initializing SDK...')
    console.log('[Polar] Token exists:', !!token)
    console.log('[Polar] Product ID:', process.env.POLAR_PRODUCT_ID || '(not set)')

    if (!token) {
      throw new Error('POLAR_ACCESS_TOKEN is not configured')
    }
    polarInstance = new Polar({ accessToken: token })
  }
  return polarInstance
}

function getProductId(): string {
  return process.env.POLAR_PRODUCT_ID || ''
}

// ============================================
// Error Handling
// ============================================

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error)
  }
  return 'Unknown error'
}

// ============================================
// Types
// ============================================

export interface CreatePolarDiscountParams {
  code: string
  discountPercent: number // 10 = 10%
  expiresAt: Date
  name?: string
}

export type CreatePolarDiscountResult =
  | { success: true; polarDiscountId: string }
  | { success: false; error: string }

/**
 * Polar.sh에 할인 코드 생성
 */
export async function createPolarDiscount(
  params: CreatePolarDiscountParams
): Promise<CreatePolarDiscountResult> {
  const { code, discountPercent, expiresAt, name } = params

  try {
    const polar = getPolarClient()
    const productId = getProductId()

    // 할인율을 basis points로 변환 (10% = 1000 basis points)
    const basisPoints = discountPercent * 100
    const discountName = name || `메모리게임 ${discountPercent}% 할인`

    // 상세 로깅
    console.log('[Polar] Creating discount:', {
      code,
      name: discountName,
      basisPoints,
      duration: 'once',
      maxRedemptions: 1,
      endsAt: expiresAt.toISOString(),
      productId: productId || '(none)',
    })

    const createParams: Parameters<typeof polar.discounts.create>[0] = {
      name: discountName,
      code,
      type: 'percentage',
      basisPoints,
      duration: 'once',
      maxRedemptions: 1,
      endsAt: expiresAt,
    }

    // 상품 ID가 있으면 추가
    if (productId) {
      createParams.products = [productId]
    }

    const discount = await polar.discounts.create(createParams)

    console.log('[Polar] Discount created successfully:', discount.id)

    return {
      success: true,
      polarDiscountId: discount.id,
    }
  } catch (error) {
    console.error('[Polar] Discount creation failed:', error)
    return {
      success: false,
      error: extractErrorMessage(error),
    }
  }
}

/**
 * Polar.sh에서 할인 코드 삭제
 */
export async function deletePolarDiscount(
  discountId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const polar = getPolarClient()
    await polar.discounts.delete({ id: discountId })
    return { success: true }
  } catch (error) {
    console.error('[Polar] Discount deletion failed:', error)
    return { success: false, error: extractErrorMessage(error) }
  }
}

/**
 * Polar.sh에서 할인 코드 조회
 */
export async function getPolarDiscount(discountId: string) {
  try {
    const polar = getPolarClient()
    const discount = await polar.discounts.get({ id: discountId })
    return { success: true as const, discount }
  } catch (error) {
    console.error('[Polar] Discount fetch failed:', error)
    return { success: false as const, error: extractErrorMessage(error) }
  }
}

/**
 * 체크아웃 URL에 할인코드 추가
 */
export function buildCheckoutUrlWithDiscount(
  baseCheckoutUrl: string,
  discountCode: string,
  metadata?: Record<string, string>
): string {
  const url = new URL(baseCheckoutUrl)

  // 할인 코드 추가
  url.searchParams.set('discount_code', discountCode)

  // 메타데이터 추가
  if (metadata) {
    url.searchParams.set('metadata', JSON.stringify(metadata))
  }

  return url.toString()
}
