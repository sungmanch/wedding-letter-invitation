'use client'

import * as React from 'react'
import Image from 'next/image'
import type { IntroConfig, ColorPalette, FontSet } from '@/lib/themes/schema'

interface IntroPreviewProps {
  intro: IntroConfig
  colors: ColorPalette
  fonts: FontSet
  groomName: string
  brideName: string
  weddingDate: string
  venueName?: string
  userImageUrl?: string
  isCompact?: boolean
}

/**
 * Static preview version of intro for TemplateCard
 * Shows the final state of the intro without animations
 */
export function IntroPreview({
  intro,
  colors,
  fonts,
  groomName,
  brideName,
  weddingDate,
  venueName,
  userImageUrl,
  isCompact,
}: IntroPreviewProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  const dateFormatted = formatDate(weddingDate)

  // Render based on intro type
  switch (intro.type) {
    case 'cinematic':
      return <CinematicPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
        venueName={venueName}
        userImageUrl={userImageUrl}
      />

    case 'exhibition':
      return <ExhibitionPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
        userImageUrl={userImageUrl}
      />

    case 'magazine':
      return <MagazinePreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
        userImageUrl={userImageUrl}
      />

    case 'chat':
      return <ChatPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
        userImageUrl={userImageUrl}
        isCompact={isCompact}
      />

    case 'gothic-romance':
      return <GothicRomancePreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
        userImageUrl={userImageUrl}
      />

    case 'old-money':
      return <OldMoneyPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
        userImageUrl={userImageUrl}
      />

    case 'monogram':
      return <MonogramPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
        userImageUrl={userImageUrl}
      />

    case 'jewel-velvet':
      return <JewelVelvetPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
        userImageUrl={userImageUrl}
      />

    default:
      return <DefaultPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
      />
  }
}

// ============================================
// Individual Preview Components
// ============================================

interface PreviewProps {
  colors: ColorPalette
  fonts: FontSet
  groomName: string
  brideName: string
  dateFormatted: string
  venueName?: string
  userImageUrl?: string
  intro?: IntroConfig
  isCompact?: boolean
}

// Cinematic (화양연화) Preview
function CinematicPreview({ colors, fonts, groomName, brideName, dateFormatted, venueName, userImageUrl }: PreviewProps) {
  const wkwColors = {
    red: '#8B2635',
    gold: '#C9A962',
    cream: '#F5E6D3',
    teal: '#1A4D4D',
  }

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Background Image with flicker effect */}
      {userImageUrl && (
        <div className="absolute inset-0 cinematic-flicker">
          <Image
            src={userImageUrl}
            alt="Preview"
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.7) contrast(1.2) saturate(1.1)' }}
          />
        </div>
      )}

      {/* Red/Teal Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(139,38,53,0.4) 0%, rgba(180,60,60,0.3) 30%, rgba(26,77,77,0.2) 70%, rgba(0,0,0,0.6) 100%)`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Gold Highlight Layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, rgba(201, 169, 98, 0.15) 0%, transparent 50%)`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Film Grain Overlay */}
      <div className="absolute inset-0 cinematic-grain pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-3 py-4">
        {/* Top */}
        <div className="flex justify-between items-start">
          <div
            className="text-[6px] tracking-widest opacity-60"
            style={{
              writingMode: 'vertical-rl',
              color: wkwColors.cream,
              fontFamily: fonts.body.family,
            }}
          >
            우리의 시작
          </div>
          <div
            className="text-[5px] tracking-[0.2em] uppercase opacity-50"
            style={{ color: wkwColors.cream }}
          >
            Wedding
          </div>
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col justify-center items-center text-center -mt-4">
          <div
            className="w-px h-6 mb-3"
            style={{ background: `linear-gradient(to bottom, transparent, ${wkwColors.gold}99, transparent)` }}
          />
          <h1
            className="text-lg font-light tracking-[0.15em] cinematic-text-glow"
            style={{ color: wkwColors.cream, fontFamily: fonts.title.family }}
          >
            {groomName}
          </h1>
          <p className="text-xs my-1" style={{ color: `${wkwColors.gold}cc` }}>&</p>
          <h1
            className="text-lg font-light tracking-[0.15em] cinematic-text-glow"
            style={{ color: wkwColors.cream, fontFamily: fonts.title.family }}
          >
            {brideName}
          </h1>
          <div className="flex items-center gap-2 my-3">
            <div className="w-6 h-px" style={{ background: `linear-gradient(to right, transparent, ${wkwColors.gold}80)` }} />
            <div className="w-1 h-1 rotate-45" style={{ backgroundColor: `${wkwColors.gold}99` }} />
            <div className="w-6 h-px" style={{ background: `linear-gradient(to left, transparent, ${wkwColors.gold}80)` }} />
          </div>
          <p className="text-[8px] tracking-[0.2em]" style={{ color: `${wkwColors.cream}e6` }}>
            {dateFormatted}
          </p>
        </div>

        {/* Bottom */}
        <div className="border-t pt-2" style={{ borderColor: `${wkwColors.gold}33` }}>
          <p className="text-[5px] tracking-[0.3em] uppercase mb-1" style={{ color: `${wkwColors.cream}66` }}>
            Location
          </p>
          {venueName && (
            <p className="text-[7px] tracking-wider" style={{ color: `${wkwColors.cream}e6` }}>
              {venueName}
            </p>
          )}
        </div>
      </div>

      {/* Film frame edges */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 z-20"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 z-20"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}
      />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes cinematicGrain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }

        .cinematic-grain::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          width: 200%;
          height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.15;
          pointer-events: none;
          animation: cinematicGrain 0.5s steps(10) infinite;
          z-index: 50;
        }

        @keyframes cinematicFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.98; }
          75% { opacity: 0.99; }
        }

        .cinematic-flicker {
          animation: cinematicFlicker 0.15s infinite;
        }

        .cinematic-text-glow {
          text-shadow:
            0 0 40px rgba(220, 38, 38, 0.3),
            0 0 80px rgba(220, 38, 38, 0.2);
        }
      `}</style>
    </div>
  )
}

// Exhibition Preview - Gallery style like HTML template
function ExhibitionPreview({ colors, fonts, groomName, brideName, dateFormatted, userImageUrl }: PreviewProps) {
  return (
    <div className="absolute inset-0 bg-gray-900">
      {/* Gallery Background */}
      <div className="absolute inset-0">
        <Image
          src="/examples/images/gallery.png"
          alt="Gallery Background"
          fill
          className="object-cover"
        />
      </div>

      {/* Main Photo Frame - centered */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: '15%' }}>
        <div
          className="relative overflow-hidden"
          style={{
            width: '55%',
            aspectRatio: '3/4',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4), 0 15px 30px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.25)',
          }}
        >
          {userImageUrl ? (
            <Image
              src={userImageUrl}
              alt="Couple Photo"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Photo</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Wedding Info - Museum Placard Style */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div
          className="px-4 py-3 text-center rounded-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          {/* Names */}
          <h1
            className="text-sm tracking-wide font-light italic"
            style={{ color: '#1f2937', fontFamily: fonts.title.family }}
          >
            {groomName} <span className="text-gray-400 mx-0.5">&</span> {brideName}
          </h1>

          {/* Divider */}
          <div className="w-6 h-px bg-gray-300 mx-auto my-1.5" />

          {/* Date */}
          <p className="text-gray-700 text-[7px] tracking-[0.15em] uppercase font-medium">
            {dateFormatted}
          </p>
        </div>
      </div>
    </div>
  )
}

// Magazine Preview
function MagazinePreview({ colors, fonts, groomName, brideName, dateFormatted, userImageUrl }: PreviewProps) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: colors.background }}>
      {userImageUrl && (
        <Image src={userImageUrl} alt="Preview" fill className="object-cover opacity-30" />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
        <p className="text-[6px] tracking-[0.4em] uppercase mb-2" style={{ color: colors.textMuted }}>
          Special Issue
        </p>
        <h1
          className="text-2xl font-bold uppercase tracking-tight leading-none"
          style={{ color: colors.text, fontFamily: fonts.title.family }}
        >
          {groomName}
        </h1>
        <p className="text-xs my-1" style={{ color: colors.accent }}>&</p>
        <h1
          className="text-2xl font-bold uppercase tracking-tight leading-none"
          style={{ color: colors.text, fontFamily: fonts.title.family }}
        >
          {brideName}
        </h1>
        <div className="mt-3 w-8 h-px" style={{ backgroundColor: colors.accent }} />
        <p className="text-[7px] mt-2" style={{ color: colors.textMuted }}>
          {dateFormatted}
        </p>
      </div>
    </div>
  )
}

// Chat Preview with Animation (Interview style - Full conversation)
function ChatPreview({ groomName, brideName, dateFormatted, isCompact }: PreviewProps) {
  const [visibleMessages, setVisibleMessages] = React.useState(0)
  const [showTyping, setShowTyping] = React.useState(false)
  const [typingPosition, setTypingPosition] = React.useState<'left' | 'right'>('left')

  // 크기 클래스 조건부 설정
  const bubblePadding = isCompact ? 'px-2 py-1' : 'px-3.5 py-2'
  const textSize = isCompact ? 'text-[10px]' : 'text-sm'
  const tagSize = isCompact ? 'text-[7px]' : 'text-[10px]'
  const dotSize = isCompact ? 'w-1.5 h-1.5' : 'w-2 h-2'
  const containerGap = isCompact ? 'gap-1' : 'gap-2'
  const dateBadgeSize = isCompact ? 'text-[9px] px-2 py-0.5' : 'text-xs px-3 py-1'

  // 전체 대화 메시지 (HTML 템플릿 기반)
  const messages: { type: 'interviewer' | 'groom' | 'bride' | 'both'; text: string }[] = [
    { type: 'interviewer', text: '어떻게 만나셨어요?' },
    { type: 'groom', text: '친구 소개로 만났어요 🌸' },
    { type: 'bride', text: '첫인상이 차가웠는데 알고보니 긴장한 거였대요 ㅋㅋ' },
    { type: 'groom', text: '너무 예뻐서 말이 안 나왔어요 😅' },
    { type: 'interviewer', text: '기억에 남는 순간은?' },
    { type: 'bride', text: '제주도 첫 여행! 비가 엄청 왔는데...' },
    { type: 'groom', text: '호텔에서 라면 끓여먹었어요 🍜' },
    { type: 'both', text: '비 오면 그때 생각나요 ☔' },
    { type: 'interviewer', text: '프로포즈는요? 💍' },
    { type: 'groom', text: '크리스마스에 준비했어요...' },
    { type: 'groom', text: '"나랑 결혼해줄래?" 💍' },
    { type: 'bride', text: '당연히 "응!!!" 🥹💕' },
    { type: 'both', text: '저희 결혼합니다! 🎊' },
  ]

  const totalMessages = messages.length

  // 메시지 타입에 따른 위치 결정
  const getPosition = (type: string): 'left' | 'right' => {
    return type === 'interviewer' ? 'left' : 'right'
  }

  React.useEffect(() => {
    const showNextMessage = () => {
      if (visibleMessages < totalMessages) {
        setTypingPosition(getPosition(messages[visibleMessages].type))
        setShowTyping(true)
        setTimeout(() => {
          setShowTyping(false)
          setVisibleMessages(prev => prev + 1)
        }, 400)
      }
    }

    if (visibleMessages === 0) {
      setTypingPosition('left')
      setShowTyping(true)
      const timer = setTimeout(() => {
        setShowTyping(false)
        setVisibleMessages(1)
      }, 400)
      return () => clearTimeout(timer)
    }

    if (visibleMessages < totalMessages) {
      const timer = setTimeout(showNextMessage, 600)
      return () => clearTimeout(timer)
    }

    const resetTimer = setTimeout(() => setVisibleMessages(0), 1500)
    return () => clearTimeout(resetTimer)
  }, [visibleMessages, totalMessages])

  // 태그 색상
  const getTagStyle = (type: string) => {
    switch (type) {
      case 'groom': return 'bg-blue-500/20 text-blue-600'
      case 'bride': return 'bg-pink-500/20 text-pink-600'
      case 'both': return 'bg-purple-500/20 text-purple-600'
      default: return ''
    }
  }

  const getTagName = (type: string) => {
    switch (type) {
      case 'groom': return groomName
      case 'bride': return brideName
      case 'both': return '함께'
      default: return ''
    }
  }

  // 보이는 메시지만 필터링 (최근 7개만 표시)
  const visibleMessagesList = messages.slice(0, visibleMessages).slice(-7)

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #9BBBD4 0%, #7BA3C7 100%)' }}>
      {/* Chat bubbles - 헤더 제거, 전체 파란 배경 */}
      <div className={`flex-1 flex flex-col justify-end p-3 ${containerGap} overflow-hidden`}>
        {visibleMessagesList.map((msg, idx) => (
          <div
            key={`${visibleMessages}-${idx}`}
            className={`flex animate-slideIn ${
              msg.type === 'interviewer' ? 'justify-start' : 'justify-end'
            }`}
          >
            {msg.type === 'interviewer' ? (
              <div className={`${bubblePadding} ${textSize} bg-white text-gray-800 shadow-sm max-w-[85%]`} style={{ borderRadius: '4px 16px 16px 16px' }}>
                {msg.text}
              </div>
            ) : (
              <div className="flex flex-col items-end max-w-[85%]">
                <span className={`${tagSize} px-2 py-0.5 rounded-full mb-1 font-medium ${getTagStyle(msg.type)}`}>
                  {getTagName(msg.type)}
                </span>
                <div className={`${bubblePadding} ${textSize} bg-[#FEE500] text-[#3C1E1E] shadow-sm`} style={{ borderRadius: '16px 4px 16px 16px' }}>
                  {msg.text}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {showTyping && (
          <div className={`flex ${typingPosition === 'left' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`${bubblePadding} flex gap-1 shadow-sm`}
              style={{
                backgroundColor: typingPosition === 'left' ? '#FFFFFF' : '#FEE500',
                borderRadius: typingPosition === 'left' ? '4px 16px 16px 16px' : '16px 4px 16px 16px'
              }}
            >
              <span className={`${dotSize} rounded-full animate-bounce`} style={{ backgroundColor: typingPosition === 'left' ? '#9CA3AF' : '#3C1E1E', animationDelay: '0ms' }} />
              <span className={`${dotSize} rounded-full animate-bounce`} style={{ backgroundColor: typingPosition === 'left' ? '#9CA3AF' : '#3C1E1E', animationDelay: '150ms' }} />
              <span className={`${dotSize} rounded-full animate-bounce`} style={{ backgroundColor: typingPosition === 'left' ? '#9CA3AF' : '#3C1E1E', animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Date badge */}
      <div className="px-3 py-2 flex justify-center flex-shrink-0">
        <span className={`${dateBadgeSize} rounded-full bg-white/90 text-gray-600 shadow-sm font-medium`}>
          {dateFormatted}
        </span>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

// Gothic Romance Preview - Dark, moody jewel tones with Victorian elegance
function GothicRomancePreview({ colors, fonts, groomName, brideName, dateFormatted, userImageUrl }: PreviewProps) {
  const gothicColors = {
    burgundy: '#722F37',
    emerald: '#2F4538',
    gold: '#C9A962',
    cream: '#F5E6D3',
    dark: '#0D0D0D',
  }

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: gothicColors.dark }}>
      {/* Background Image with dark overlay */}
      {userImageUrl && (
        <div className="absolute inset-0">
          <Image
            src={userImageUrl}
            alt="Preview"
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.4) contrast(1.1) saturate(0.9)' }}
          />
        </div>
      )}

      {/* Gradient Overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            rgba(114, 47, 55, 0.4) 0%,
            rgba(13, 13, 13, 0.6) 40%,
            rgba(47, 69, 56, 0.3) 70%,
            rgba(13, 13, 13, 0.8) 100%)`,
        }}
      />

      {/* Gold accent gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, rgba(201, 169, 98, 0.1) 0%, transparent 60%)`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Strong Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        {/* Top ornament */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${gothicColors.gold}80)` }} />
            <div className="w-1.5 h-1.5 rotate-45 border" style={{ borderColor: gothicColors.gold }} />
            <div className="w-8 h-px" style={{ background: `linear-gradient(to left, transparent, ${gothicColors.gold}80)` }} />
          </div>
        </div>

        {/* Names */}
        <h1
          className="text-xl font-light tracking-[0.15em] italic"
          style={{
            color: gothicColors.cream,
            fontFamily: fonts.title.family,
            textShadow: `0 2px 20px rgba(114, 47, 55, 0.5)`,
          }}
        >
          {groomName}
        </h1>

        <div className="my-2 flex items-center gap-2">
          <div className="w-4 h-px" style={{ backgroundColor: `${gothicColors.gold}66` }} />
          <span className="text-xs" style={{ color: gothicColors.gold }}>&</span>
          <div className="w-4 h-px" style={{ backgroundColor: `${gothicColors.gold}66` }} />
        </div>

        <h1
          className="text-xl font-light tracking-[0.15em] italic"
          style={{
            color: gothicColors.cream,
            fontFamily: fonts.title.family,
            textShadow: `0 2px 20px rgba(114, 47, 55, 0.5)`,
          }}
        >
          {brideName}
        </h1>

        {/* Bottom ornament & date */}
        <div className="mt-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-px" style={{ background: `linear-gradient(to right, transparent, ${gothicColors.gold}60)` }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `${gothicColors.gold}80` }} />
            <div className="w-6 h-px" style={{ background: `linear-gradient(to left, transparent, ${gothicColors.gold}60)` }} />
          </div>
          <p
            className="text-[9px] tracking-[0.2em] uppercase"
            style={{ color: `${gothicColors.cream}cc` }}
          >
            {dateFormatted}
          </p>
        </div>
      </div>

      {/* Corner ornaments */}
      <div className="absolute top-3 left-3 w-6 h-6">
        <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, ${gothicColors.gold}60, transparent)` }} />
        <div className="absolute top-0 left-0 h-full w-px" style={{ background: `linear-gradient(to bottom, ${gothicColors.gold}60, transparent)` }} />
      </div>
      <div className="absolute top-3 right-3 w-6 h-6">
        <div className="absolute top-0 right-0 w-full h-px" style={{ background: `linear-gradient(to left, ${gothicColors.gold}60, transparent)` }} />
        <div className="absolute top-0 right-0 h-full w-px" style={{ background: `linear-gradient(to bottom, ${gothicColors.gold}60, transparent)` }} />
      </div>
      <div className="absolute bottom-3 left-3 w-6 h-6">
        <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, ${gothicColors.gold}60, transparent)` }} />
        <div className="absolute bottom-0 left-0 h-full w-px" style={{ background: `linear-gradient(to top, ${gothicColors.gold}60, transparent)` }} />
      </div>
      <div className="absolute bottom-3 right-3 w-6 h-6">
        <div className="absolute bottom-0 right-0 w-full h-px" style={{ background: `linear-gradient(to left, ${gothicColors.gold}60, transparent)` }} />
        <div className="absolute bottom-0 right-0 h-full w-px" style={{ background: `linear-gradient(to top, ${gothicColors.gold}60, transparent)` }} />
      </div>
    </div>
  )
}

// Old Money Preview - Quiet Luxury with letterpress texture
function OldMoneyPreview({ colors, fonts, groomName, brideName, dateFormatted, userImageUrl }: PreviewProps) {
  const oldMoneyColors = {
    ivory: '#FAF8F5',
    charcoal: '#2C2C2C',
    warmGray: '#8A8580',
    border: '#D4D0C8',
  }

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: oldMoneyColors.ivory }}>
      {/* Cotton paper texture - subtle letterpress feel */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* User image - larger portion with elegant fade */}
      {userImageUrl && (
        <div className="absolute top-0 left-0 right-0 h-[65%]">
          <Image
            src={userImageUrl}
            alt="Preview"
            fill
            className="object-cover"
            style={{
              filter: 'brightness(1.05) contrast(0.92) saturate(0.7) sepia(0.15)',
            }}
          />
          {/* Ivory tone overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(250, 248, 240, 0.15)',
              mixBlendMode: 'overlay',
            }}
          />
          {/* Smooth fade to ivory */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 70%, ${oldMoneyColors.ivory} 100%)`,
            }}
          />
        </div>
      )}

      {/* Content - compact typography, bottom portion */}
      <div className="relative z-10 h-full flex flex-col justify-end items-center text-center px-8 pb-4">
        {/* Names with refined typography */}
        <h1
          className="text-lg tracking-[0.25em] font-normal uppercase"
          style={{
            color: oldMoneyColors.charcoal,
            fontFamily: 'Cormorant Garamond, serif',
          }}
        >
          {groomName}
        </h1>

        <span
          className="text-[10px] my-2 tracking-[0.3em] uppercase"
          style={{
            color: oldMoneyColors.warmGray,
            fontFamily: 'Cormorant Garamond, serif',
          }}
        >
          and
        </span>

        <h1
          className="text-lg tracking-[0.25em] font-normal uppercase"
          style={{
            color: oldMoneyColors.charcoal,
            fontFamily: 'Cormorant Garamond, serif',
          }}
        >
          {brideName}
        </h1>

        {/* Thin divider line */}
        <div
          className="w-10 h-px mt-4 mb-3"
          style={{ backgroundColor: oldMoneyColors.border }}
        />

        {/* Date - formal style */}
        <p
          className="text-[8px] tracking-[0.2em] uppercase"
          style={{
            color: oldMoneyColors.warmGray,
            fontFamily: 'Cormorant Garamond, serif',
          }}
        >
          {dateFormatted}
        </p>
      </div>

    </div>
  )
}

// Monogram Preview - Royal emblem with navy and gold
function MonogramPreview({ colors, fonts, groomName, brideName, dateFormatted, userImageUrl }: PreviewProps) {
  const monoColors = {
    navy: '#1A3A5C',
    gold: '#C5A572',
    goldLight: '#D4BC8E',
    cream: '#F8F5F0',
  }

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: monoColors.navy }}>
      {/* Subtle damask pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23C5A572' fill-opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px',
        }}
      />

      {/* User image with navy overlay */}
      {userImageUrl && (
        <div className="absolute inset-0">
          <Image
            src={userImageUrl}
            alt="Preview"
            fill
            className="object-cover"
            style={{
              filter: 'brightness(0.4) contrast(1.1) saturate(0.6)',
            }}
          />
          {/* Navy tint overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${monoColors.navy}dd 0%, ${monoColors.navy}cc 50%, ${monoColors.navy}ee 100%)`,
              mixBlendMode: 'multiply',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        {/* Names */}
        <h1
          className="text-base tracking-[0.2em] font-normal uppercase"
          style={{
            color: monoColors.cream,
            fontFamily: 'Cormorant Garamond, serif',
          }}
        >
          {groomName}
        </h1>

        <div className="my-2 flex items-center gap-3">
          <div
            className="w-6 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${monoColors.gold})`,
            }}
          />
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{
              color: monoColors.gold,
              fontFamily: 'Cormorant Garamond, serif',
            }}
          >
            and
          </span>
          <div
            className="w-6 h-px"
            style={{
              background: `linear-gradient(to left, transparent, ${monoColors.gold})`,
            }}
          />
        </div>

        <h1
          className="text-base tracking-[0.2em] font-normal uppercase"
          style={{
            color: monoColors.cream,
            fontFamily: 'Cormorant Garamond, serif',
          }}
        >
          {brideName}
        </h1>

        {/* Date with decorative line */}
        <div className="mt-4 flex flex-col items-center">
          <div
            className="w-12 h-px mb-3"
            style={{
              background: `linear-gradient(to right, transparent, ${monoColors.gold}80, transparent)`,
            }}
          />
          <p
            className="text-[8px] tracking-[0.2em] uppercase"
            style={{
              color: `${monoColors.cream}cc`,
              fontFamily: 'Cormorant Garamond, serif',
            }}
          >
            {dateFormatted}
          </p>
        </div>
      </div>

    </div>
  )
}

// Jewel Velvet Preview - Opera curtain velvet with jewel glow
function JewelVelvetPreview({ colors, fonts, groomName, brideName, dateFormatted, userImageUrl }: PreviewProps) {
  const jewelColors = {
    emerald: '#1B3D2F',
    burgundy: '#5C1E28',
    gold: '#D4AF72',
    cream: '#F5EDE3',
    dark: '#0A0A0A',
  }

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: jewelColors.dark }}>
      {/* Opera curtain velvet gradient - smooth transition */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg,
            ${jewelColors.emerald} 0%,
            ${jewelColors.dark} 35%,
            ${jewelColors.dark} 65%,
            ${jewelColors.burgundy} 100%)`,
        }}
      />

      {/* Velvet texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='velvet'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23velvet)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* User image with rich color overlay */}
      {userImageUrl && (
        <div className="absolute inset-0">
          <Image
            src={userImageUrl}
            alt="Preview"
            fill
            className="object-cover"
            style={{
              filter: 'brightness(0.35) contrast(1.15) saturate(0.7)',
            }}
          />
          {/* Jewel tone color wash */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg,
                rgba(27, 61, 47, 0.75) 0%,
                rgba(10, 10, 10, 0.6) 50%,
                rgba(92, 30, 40, 0.75) 100%)`,
              mixBlendMode: 'multiply',
            }}
          />
        </div>
      )}

      {/* Central jewel glow effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 50%,
            rgba(212, 175, 114, 0.12) 0%,
            transparent 50%)`,
        }}
      />

      {/* Soft vignette - like opera curtain edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 100% at 50% 50%,
            transparent 40%,
            rgba(10, 10, 10, 0.6) 100%)`,
        }}
      />

      {/* Subtle curtain fold highlights */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(255, 255, 255, 0.1) 2px,
            transparent 4px,
            transparent 40px
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        {/* Elegant curved ornament */}
        <div className="mb-5">
          <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
            <path
              d="M0 8C10 8 15 2 30 2C45 2 50 8 60 8"
              stroke={jewelColors.gold}
              strokeWidth="0.5"
              strokeOpacity="0.6"
            />
            <circle cx="30" cy="2" r="2" fill={jewelColors.gold} fillOpacity="0.4" />
            <path
              d="M20 8C25 8 27 5 30 5C33 5 35 8 40 8"
              stroke={jewelColors.gold}
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
          </svg>
        </div>

        {/* Names with gold shimmer */}
        <h1
          className="text-lg tracking-[0.2em] font-light uppercase"
          style={{
            color: jewelColors.cream,
            fontFamily: 'Nanum Myeongjo, serif',
            textShadow: `0 0 30px rgba(212, 175, 114, 0.3), 0 2px 10px rgba(0, 0, 0, 0.5)`,
          }}
        >
          {groomName}
        </h1>

        <div className="my-3 flex items-center gap-3">
          <div
            className="w-8 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${jewelColors.gold}50)`,
            }}
          />
          <span
            className="text-[10px] tracking-widest uppercase"
            style={{
              color: jewelColors.gold,
              fontFamily: 'Cormorant Garamond, serif',
            }}
          >
            and
          </span>
          <div
            className="w-8 h-px"
            style={{
              background: `linear-gradient(to left, transparent, ${jewelColors.gold}50)`,
            }}
          />
        </div>

        <h1
          className="text-lg tracking-[0.2em] font-light uppercase"
          style={{
            color: jewelColors.cream,
            fontFamily: 'Nanum Myeongjo, serif',
            textShadow: `0 0 30px rgba(212, 175, 114, 0.3), 0 2px 10px rgba(0, 0, 0, 0.5)`,
          }}
        >
          {brideName}
        </h1>

        {/* Elegant bottom ornament */}
        <div className="mt-5 flex flex-col items-center">
          <svg width="40" height="10" viewBox="0 0 40 10" fill="none">
            <path
              d="M0 5C8 5 12 8 20 8C28 8 32 5 40 5"
              stroke={jewelColors.gold}
              strokeWidth="0.5"
              strokeOpacity="0.5"
            />
            <circle cx="20" cy="8" r="1.5" fill={jewelColors.gold} fillOpacity="0.4" />
          </svg>

          <p
            className="text-[8px] tracking-[0.25em] uppercase mt-3"
            style={{
              color: `${jewelColors.cream}bb`,
              fontFamily: 'Cormorant Garamond, serif',
            }}
          >
            {dateFormatted}
          </p>
        </div>
      </div>

      {/* Soft corner glows instead of hard lines */}
      <div
        className="absolute top-0 left-0 w-20 h-20"
        style={{
          background: `radial-gradient(ellipse at top left, ${jewelColors.gold}10 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-0 right-0 w-20 h-20"
        style={{
          background: `radial-gradient(ellipse at top right, ${jewelColors.gold}10 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-20 h-20"
        style={{
          background: `radial-gradient(ellipse at bottom left, ${jewelColors.gold}10 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-20 h-20"
        style={{
          background: `radial-gradient(ellipse at bottom right, ${jewelColors.gold}10 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

// Default Preview (fallback)
function DefaultPreview({ colors, fonts, groomName, brideName, dateFormatted }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: colors.background }}>
      <div className="text-center px-4">
        <h1 className="text-lg font-semibold" style={{ color: colors.text, fontFamily: fonts.title.family }}>
          {groomName}
          <span className="mx-2" style={{ color: colors.accent }}>♥</span>
          {brideName}
        </h1>
        <p className="text-[8px] mt-2" style={{ color: colors.textMuted }}>
          {dateFormatted}
        </p>
      </div>
    </div>
  )
}
