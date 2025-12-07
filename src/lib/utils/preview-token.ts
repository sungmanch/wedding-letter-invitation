/**
 * Preview Token Utility
 * 1시간 유효한 미리보기 공유 토큰 생성/검증
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

interface PreviewTokenPayload extends JWTPayload {
  invitationId: string
  ownerId: string
}

const SECRET = new TextEncoder().encode(
  process.env.PREVIEW_TOKEN_SECRET || 'fallback-secret-for-development-only'
)
const TOKEN_EXPIRY = '1h'
const ISSUER = 'wedding-letter-invitation'

/**
 * 미리보기 공유용 토큰 생성
 */
export async function generatePreviewToken(
  invitationId: string,
  ownerId: string
): Promise<string> {
  const token = await new SignJWT({ invitationId, ownerId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET)

  return token
}

/**
 * 미리보기 토큰 검증
 */
export async function verifyPreviewToken(token: string): Promise<{
  valid: boolean
  invitationId?: string
  ownerId?: string
  error?: 'expired' | 'invalid'
}> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
    })

    const { invitationId, ownerId } = payload as PreviewTokenPayload

    if (!invitationId || !ownerId) {
      return { valid: false, error: 'invalid' }
    }

    return {
      valid: true,
      invitationId,
      ownerId,
    }
  } catch (error) {
    // Check if error is due to expiration
    if (error instanceof Error && error.message.includes('exp')) {
      return { valid: false, error: 'expired' }
    }
    return { valid: false, error: 'invalid' }
  }
}

/**
 * 공유 가능한 미리보기 URL 생성
 */
export function getShareablePreviewUrl(
  invitationId: string,
  token: string
): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/se/${invitationId}/preview?token=${token}`
}
