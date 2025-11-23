'use client'

import Script from 'next/script'

export function KakaoScript() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.7/kakao.min.js"
      integrity="sha384-tJkjbtDbvoxO+diRuDtwRO9JXR7pjWnfjfRn5ePUpl7e7RJCxKCwwnfqUAdXh53p"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.Kakao && !window.Kakao.isInitialized() && process.env.NEXT_PUBLIC_KAKAO_APP_KEY) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY)
        }
      }}
    />
  )
}
