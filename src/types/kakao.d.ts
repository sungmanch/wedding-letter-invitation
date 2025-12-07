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

interface KakaoNaviOptions {
  name: string
  x: number
  y: number
  coordType?: 'wgs84' | 'katec'
}

interface KakaoNavi {
  start: (options: KakaoNaviOptions) => void
}

interface Kakao {
  init: (appKey: string) => void
  isInitialized: () => boolean
  Share: KakaoShare
  Navi?: KakaoNavi
}

declare global {
  interface Window {
    Kakao: Kakao
  }
}

export {}
