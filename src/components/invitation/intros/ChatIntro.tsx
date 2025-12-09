'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { IntroProps } from './types'

/**
 * ChatIntro - Messenger/KakaoTalk style
 * Features: Chat bubbles, typing indicator, profile images
 */
export function ChatIntro({
  config,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  images,
}: IntroProps) {
  const [messages, setMessages] = React.useState<number[]>([])
  const [isTyping, setIsTyping] = React.useState(false)
  const platform = config.settings?.platform || 'kakao'

  const chatMessages = [
    { sender: 'groom', text: '우리 결혼해요! 💍' },
    { sender: 'bride', text: '네! 좋아요 ❤️' },
    { sender: 'bot', text: '축하드립니다! 🎉' },
  ]

  // 채팅 메시지 애니메이션 - 마운트 시 한 번만 실행 (chatMessages는 컴포넌트 내 상수)
  React.useEffect(() => {
    let currentIndex = 0
    const showNextMessage = () => {
      if (currentIndex < chatMessages.length) {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages(prev => [...prev, currentIndex])
          currentIndex++
          if (currentIndex < chatMessages.length) {
            setTimeout(showNextMessage, 500)
          }
        }, 800)
      }
    }
    setTimeout(showNextMessage, 500)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getBubbleStyle = (sender: string) => {
    if (sender === 'groom' || sender === 'bride') {
      return {
        backgroundColor: platform === 'kakao' ? colors.primary : colors.accent,
        color: platform === 'kakao' ? colors.secondary : '#FFFFFF',
        alignSelf: sender === 'groom' ? 'flex-end' : 'flex-start',
        borderRadius: sender === 'groom'
          ? '20px 20px 4px 20px'
          : '20px 20px 20px 4px',
      }
    }
    return {
      backgroundColor: colors.surface,
      color: colors.text,
      alignSelf: 'flex-start',
      borderRadius: '20px 20px 20px 4px',
    }
  }

  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Chat Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: `${colors.text}10` }}
      >
        <div className="flex -space-x-2">
          {images?.[0] ? (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <Image src={images[0]} alt="Profile" width={40} height={40} className="object-cover" />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
              style={{ backgroundColor: colors.accent, color: '#FFF' }}
            >
              {groomName[0]}
            </div>
          )}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 border-white"
            style={{ backgroundColor: colors.primary, color: colors.secondary }}
          >
            {brideName[0]}
          </div>
        </div>
        <div>
          <p className="font-medium" style={{ color: colors.text }}>
            {groomName} & {brideName}
          </p>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            결혼 준비중...
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col justify-end p-4 gap-3">
        {/* Date Divider */}
        <div className="flex items-center justify-center my-4">
          <span
            className="px-3 py-1 rounded-full text-xs"
            style={{ backgroundColor: `${colors.text}10`, color: colors.textMuted }}
          >
            {new Date(weddingDate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Messages */}
        {messages.map((index) => {
          const msg = chatMessages[index]
          return (
            <div
              key={index}
              className={cn(
                'flex gap-2 items-end animate-slide-up',
                msg.sender === 'groom' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {msg.sender !== 'groom' && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0"
                  style={{
                    backgroundColor: msg.sender === 'bride' ? colors.primary : colors.secondary,
                    color: msg.sender === 'bride' ? colors.secondary : colors.text,
                  }}
                >
                  {msg.sender === 'bride' ? brideName[0] : '🤖'}
                </div>
              )}
              <div
                className="px-4 py-2 max-w-[70%]"
                style={getBubbleStyle(msg.sender)}
              >
                <p className="text-sm" style={{ fontFamily: fonts.body.family }}>
                  {msg.text}
                </p>
              </div>
            </div>
          )
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2 items-end">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: colors.secondary, color: colors.text }}
            >
              ...
            </div>
            <div
              className="px-4 py-3 rounded-2xl"
              style={{ backgroundColor: colors.surface }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: colors.textMuted,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area (decorative) */}
      <div
        className="px-4 py-3 border-t"
        style={{ borderColor: `${colors.text}10` }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ backgroundColor: colors.surface }}
        >
          <span className="text-sm" style={{ color: colors.textMuted }}>
            메시지를 입력하세요...
          </span>
        </div>
      </div>
    </div>
  )
}
