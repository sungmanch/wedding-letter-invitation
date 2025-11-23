interface KakaoShareButton {
  title: string
  link: {
    mobileWebUrl: string
    webUrl: string
  }
}

interface KakaoShareContent {
  title: string
  description: string
  imageUrl?: string
  link: {
    mobileWebUrl: string
    webUrl: string
  }
}

interface KakaoFeedTemplate {
  objectType: 'feed'
  content: KakaoShareContent
  buttons?: KakaoShareButton[]
}

interface KakaoShare {
  sendDefault: (template: KakaoFeedTemplate) => void
}

interface Kakao {
  init: (appKey: string) => void
  isInitialized: () => boolean
  Share: KakaoShare
}

declare global {
  interface Window {
    Kakao: Kakao
  }
}

export {}
