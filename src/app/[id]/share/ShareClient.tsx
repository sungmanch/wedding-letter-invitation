'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Copy, Check, Link2, Eye, Mail } from 'lucide-react'
import type { Invitation } from '@/lib/db/invitation-schema'

interface ShareClientProps {
  invitation: Invitation
  shareUrl: string
}

export function ShareClient({ invitation, shareUrl }: ShareClientProps) {
  const [copied, setCopied] = React.useState(false)
  const [kakaoReady, setKakaoReady] = React.useState(false)

  // Initialize Kakao SDK
  React.useEffect(() => {
    const loadKakao = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
        if (kakaoKey) {
          window.Kakao.init(kakaoKey)
          setKakaoReady(true)
        }
      } else if (window.Kakao?.isInitialized()) {
        setKakaoReady(true)
      }
    }

    // Check if Kakao is already loaded
    if (window.Kakao) {
      loadKakao()
    } else {
      // Load Kakao SDK script
      const script = document.createElement('script')
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js'
      script.integrity = 'sha384-6MFdIr0zOira1CHQkedUqJVql0YtcZA1P0nbPrQYJXVJZUkTk/oX4U9GhLkGL5av'
      script.crossOrigin = 'anonymous'
      script.onload = loadKakao
      document.head.appendChild(script)
    }
  }, [])

  const handleKakaoShare = () => {
    if (!kakaoReady || !window.Kakao) {
      alert('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    const weddingDate = new Date(invitation.weddingDate)
    const formattedDate = weddingDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다`,
        description: `${formattedDate} ${invitation.venueName}`,
        imageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/og-wedding.png`,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '청첩장 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    })
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const weddingDate = new Date(invitation.weddingDate)
  const formattedDate = weddingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBFC] lg:max-w-2xl lg:mx-auto lg:shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              href={`/${invitation.id}/preview`}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-charcoal" />
            </Link>
            <span className="ml-2 font-medium text-charcoal">공유하기</span>
          </div>
          <Link
            href={`/${invitation.id}`}
            className="flex items-center gap-1 text-sm text-[#D4768A] font-medium"
          >
            <Eye className="h-4 w-4" />
            청첩장 보기
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        {/* Invitation Preview Card */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm text-center">
          <div className="text-4xl mb-4">💌</div>
          <h1 className="text-xl font-bold text-charcoal mb-2">
            {invitation.groomName} ♥ {invitation.brideName}
          </h1>
          <p className="text-gray-500">
            {formattedDate}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {invitation.venueName}
          </p>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          {/* Kakao Share */}
          <button
            onClick={handleKakaoShare}
            className="w-full flex items-center gap-4 bg-[#FEE500] text-[#3C1E1E] rounded-2xl p-4 hover:bg-[#FADA00] transition-colors"
          >
            <div className="w-12 h-12 bg-[#3C1E1E] rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-[#FEE500]" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">카카오톡으로 공유</p>
              <p className="text-sm opacity-80">친구에게 청첩장 보내기</p>
            </div>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {copied ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <Link2 className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-charcoal">
                {copied ? '복사됨!' : '링크 복사'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {shareUrl}
              </p>
            </div>
            <Copy className="h-5 w-5 text-gray-400" />
          </button>

          {/* SMS Share */}
          <a
            href={`sms:?body=${encodeURIComponent(`${invitation.groomName} ♥ ${invitation.brideName} 결혼합니다\n\n${formattedDate}\n${invitation.venueName}\n\n청첩장 보기: ${shareUrl}`)}`}
            className="w-full flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-charcoal">문자로 보내기</p>
              <p className="text-sm text-gray-500">SMS로 청첩장 공유</p>
            </div>
          </a>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h2 className="font-medium text-charcoal mb-4">바로가기</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/${invitation.id}/messages`}
              className="bg-white rounded-xl p-4 text-center hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <span className="text-2xl block mb-2">💌</span>
              <span className="text-sm font-medium text-charcoal">축하 메시지</span>
            </Link>
            <Link
              href={`/${invitation.id}/edit`}
              className="bg-white rounded-xl p-4 text-center hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <span className="text-2xl block mb-2">✏️</span>
              <span className="text-sm font-medium text-charcoal">수정하기</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
