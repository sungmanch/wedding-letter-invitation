'use client'

import Script from 'next/script'

// Clarity 글로벌 타입 선언
declare global {
  interface Window {
    clarity?: (command: string, ...args: string[]) => void
  }
}

export function ClarityScript() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

  if (!clarityId) {
    return null
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
      }}
    />
  )
}

/**
 * Clarity 유저 매핑 함수
 * @param userId - 유저 고유 ID (Supabase user.id)
 * @param customSessionId - (선택) 커스텀 세션 ID
 * @param customPageId - (선택) 커스텀 페이지 ID
 * @param friendlyName - (선택) 유저 이름/이메일 등 식별 가능한 이름
 */
export function identifyClarity(
  userId: string,
  customSessionId?: string,
  customPageId?: string,
  friendlyName?: string
) {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('identify', userId, customSessionId || '', customPageId || '', friendlyName || '')
  }
}

/**
 * Clarity 커스텀 태그 설정 함수
 * @param key - 태그 키
 * @param value - 태그 값
 */
export function setClarityTag(key: string, value: string) {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('set', key, value)
  }
}
