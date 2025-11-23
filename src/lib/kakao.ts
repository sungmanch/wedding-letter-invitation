const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
const DEFAULT_SHARE_IMAGE = `${BASE_URL}/og-image.jpg`

/**
 * Kakao SDK 초기화
 */
export function initKakao(): boolean {
  if (typeof window === 'undefined') return false
  if (!window.Kakao) return false
  if (!KAKAO_APP_KEY) {
    console.error('NEXT_PUBLIC_KAKAO_APP_KEY is not set')
    return false
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_APP_KEY)
  }

  return window.Kakao.isInitialized()
}

interface ShareToKakaoParams {
  title: string
  description: string
  url: string
  imageUrl?: string
  buttonText?: string
}

/**
 * 카카오톡으로 링크 공유
 */
export function shareToKakao({
  title,
  description,
  url,
  imageUrl,
  buttonText = '자세히 보기',
}: ShareToKakaoParams): boolean {
  if (!initKakao()) {
    console.error('Kakao SDK is not initialized')
    return false
  }

  try {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description,
        imageUrl: imageUrl || DEFAULT_SHARE_IMAGE,
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
      buttons: [
        {
          title: buttonText,
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      ],
    })
    return true
  } catch (error) {
    console.error('Failed to share to Kakao:', error)
    return false
  }
}
