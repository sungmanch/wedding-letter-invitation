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

    case 'keynote':
      return <KeynotePreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
        intro={intro}
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

    case 'vinyl':
      return <VinylPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
      />

    case 'chat':
      return <ChatPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
      />

    case 'glassmorphism':
      return <GlassmorphismPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
      />

    case 'passport':
      return <PassportPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
      />

    case 'pixel':
      return <PixelPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
        intro={intro}
      />

    case 'typography':
      return <TypographyPreview
        colors={colors}
        fonts={fonts}
        groomName={groomName}
        brideName={brideName}
        dateFormatted={dateFormatted}
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
      {/* Background Image */}
      {userImageUrl && (
        <div className="absolute inset-0">
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

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />

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
            className="text-lg font-light tracking-[0.15em]"
            style={{ color: wkwColors.cream, fontFamily: fonts.title.family }}
          >
            {groomName}
          </h1>
          <p className="text-xs my-1" style={{ color: `${wkwColors.gold}cc` }}>&</p>
          <h1
            className="text-lg font-light tracking-[0.15em]"
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
    </div>
  )
}

// Keynote Preview
function KeynotePreview({ colors, fonts, groomName, brideName, dateFormatted, intro }: PreviewProps) {
  const stickyTexts = intro?.settings?.stickyTexts || ['우리의 사랑']

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: colors.background }}>
      <div className="text-center px-4">
        <p className="text-[8px] tracking-wider mb-2" style={{ color: colors.textMuted }}>
          {stickyTexts[0]}
        </p>
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: colors.text, fontFamily: fonts.title.family }}
        >
          {groomName}
        </h1>
        <p className="text-sm my-1" style={{ color: colors.accent }}>&</p>
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: colors.text, fontFamily: fonts.title.family }}
        >
          {brideName}
        </h1>
        <p className="text-[8px] mt-3" style={{ color: colors.textMuted }}>
          {dateFormatted}
        </p>
      </div>
    </div>
  )
}

// Exhibition Preview
function ExhibitionPreview({ colors, fonts, groomName, brideName, dateFormatted, userImageUrl }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
      <div className="w-4/5 aspect-[3/4] border-4 flex items-center justify-center" style={{ borderColor: colors.text }}>
        {userImageUrl ? (
          <Image src={userImageUrl} alt="Preview" fill className="object-cover" />
        ) : (
          <div className="text-center p-2">
            <p className="text-[6px] tracking-[0.3em] uppercase mb-2" style={{ color: colors.textMuted }}>
              Wedding Exhibition
            </p>
            <h1 className="text-sm font-medium" style={{ color: colors.text, fontFamily: fonts.title.family }}>
              {groomName} & {brideName}
            </h1>
            <p className="text-[7px] mt-2" style={{ color: colors.textMuted }}>
              {dateFormatted}
            </p>
          </div>
        )}
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

// Vinyl Preview
function VinylPreview({ colors, fonts, groomName, brideName, dateFormatted }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
      {/* Vinyl Record */}
      <div
        className="w-3/4 aspect-square rounded-full relative"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        {/* Grooves */}
        <div className="absolute inset-2 rounded-full border border-gray-700" />
        <div className="absolute inset-4 rounded-full border border-gray-700" />
        <div className="absolute inset-6 rounded-full border border-gray-700" />

        {/* Center Label */}
        <div
          className="absolute inset-0 m-auto w-1/3 aspect-square rounded-full flex flex-col items-center justify-center"
          style={{ backgroundColor: colors.accent }}
        >
          <p className="text-[6px] font-bold text-white">{groomName}</p>
          <p className="text-[5px] text-white/70">&</p>
          <p className="text-[6px] font-bold text-white">{brideName}</p>
        </div>
      </div>

      {/* Date below */}
      <p
        className="absolute bottom-3 text-[7px]"
        style={{ color: colors.textMuted }}
      >
        {dateFormatted}
      </p>
    </div>
  )
}

// Chat Preview
function ChatPreview({ colors, fonts, groomName, brideName, dateFormatted }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: `${colors.text}10` }}>
        <div className="flex -space-x-1">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] text-white" style={{ backgroundColor: colors.accent }}>
            {groomName[0]}
          </div>
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] border border-white" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
            {brideName[0]}
          </div>
        </div>
        <p className="text-[8px] font-medium" style={{ color: colors.text }}>
          {groomName} & {brideName}
        </p>
      </div>

      {/* Chat bubbles */}
      <div className="flex-1 flex flex-col justify-end p-2 gap-1">
        <div className="flex justify-end">
          <div className="px-2 py-1 rounded-xl text-[7px]" style={{ backgroundColor: colors.primary, color: colors.secondary }}>
            우리 결혼해요! 💍
          </div>
        </div>
        <div className="flex">
          <div className="px-2 py-1 rounded-xl text-[7px]" style={{ backgroundColor: colors.surface, color: colors.text }}>
            네! 좋아요 ❤️
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="px-3 py-2 text-center">
        <span className="text-[6px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.text}10`, color: colors.textMuted }}>
          {dateFormatted}
        </span>
      </div>
    </div>
  )
}

// Glassmorphism Preview
function GlassmorphismPreview({ colors, fonts, groomName, brideName, dateFormatted }: PreviewProps) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: colors.background }}>
      {/* Aurora Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(168,85,247,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.3) 0%, transparent 60%)
          `,
        }}
      />

      {/* Glass Card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-4/5 px-4 py-6 rounded-2xl text-center"
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <p className="text-[6px] tracking-[0.2em] uppercase mb-2" style={{ color: colors.textMuted }}>
            Wedding
          </p>
          <h1 className="text-base font-semibold" style={{ color: colors.text, fontFamily: fonts.title.family }}>
            {groomName}
          </h1>
          <p className="text-sm my-1" style={{ color: colors.accent }}>♥</p>
          <h1 className="text-base font-semibold" style={{ color: colors.text, fontFamily: fonts.title.family }}>
            {brideName}
          </h1>
          <p className="text-[7px] mt-2" style={{ color: colors.textMuted }}>
            {dateFormatted}
          </p>
        </div>
      </div>

      {/* Floating objects */}
      <div className="absolute top-4 left-4 text-lg">💕</div>
      <div className="absolute bottom-6 right-4 text-lg">💍</div>
    </div>
  )
}

// Passport Preview
function PassportPreview({ colors, fonts, groomName, brideName, dateFormatted }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
      <div
        className="w-4/5 aspect-[3/4] rounded-lg shadow-lg p-3"
        style={{ backgroundColor: '#1E3A5F' }}
      >
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full border flex items-center justify-center mb-2" style={{ borderColor: colors.secondary }}>
            <span className="text-sm">✈️</span>
          </div>
          <p className="text-[8px] tracking-[0.15em] mb-1" style={{ color: colors.secondary }}>
            PASSPORT
          </p>
          <p className="text-[5px] tracking-wider" style={{ color: `${colors.secondary}80` }}>
            WEDDING JOURNEY
          </p>
          <div className="mt-3 text-[7px]" style={{ color: colors.secondary }}>
            {groomName} & {brideName}
          </div>
          <p className="text-[6px] mt-1" style={{ color: `${colors.secondary}80` }}>
            {dateFormatted}
          </p>
        </div>
      </div>
    </div>
  )
}

// Pixel Preview
function PixelPreview({ colors, fonts, groomName, brideName, intro }: PreviewProps) {
  const gameTitle = intro?.settings?.gameTitle || 'WEDDING QUEST'

  // Simple pixel heart
  const PixelHeart = () => (
    <div className="grid grid-cols-7 gap-px">
      {[
        [0,1,1,0,1,1,0],
        [1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1],
        [0,1,1,1,1,1,0],
        [0,0,1,1,1,0,0],
        [0,0,0,1,0,0,0],
      ].flat().map((filled, i) => (
        <div
          key={i}
          className="w-1 h-1"
          style={{ backgroundColor: filled ? colors.accent : 'transparent' }}
        />
      ))}
    </div>
  )

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: colors.background }}>
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${colors.text} 0px, ${colors.text} 1px, transparent 1px, transparent 3px)`,
        }}
      />

      {/* Game Title */}
      <h1
        className="text-sm tracking-wider mb-4"
        style={{ color: colors.text, textShadow: `2px 2px 0 ${colors.secondary}` }}
      >
        {gameTitle}
      </h1>

      {/* Characters and Heart */}
      <div className="flex items-center gap-3 mb-4">
        <p className="text-[8px]" style={{ color: colors.text }}>{groomName}</p>
        <PixelHeart />
        <p className="text-[8px]" style={{ color: colors.text }}>{brideName}</p>
      </div>

      {/* Press Start */}
      <p className="text-[7px] tracking-[0.2em]" style={{ color: colors.text }}>
        ▶ PRESS START
      </p>
    </div>
  )
}

// Typography Preview
function TypographyPreview({ colors, fonts, groomName, brideName, dateFormatted }: PreviewProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: colors.background }}>
      <div className="text-center px-4">
        <h1
          className="text-3xl font-bold tracking-tighter leading-none"
          style={{ color: colors.text, fontFamily: fonts.title.family }}
        >
          WE
        </h1>
        <h1
          className="text-3xl font-bold tracking-tighter leading-none -mt-1"
          style={{ color: colors.text, fontFamily: fonts.title.family }}
        >
          ARE
        </h1>
        <p
          className="text-[8px] tracking-[0.2em] mt-1"
          style={{ color: colors.textMuted }}
        >
          GETTING MARRIED
        </p>
        <div className="w-12 h-px mx-auto my-3" style={{ backgroundColor: colors.text }} />
        <p className="text-sm" style={{ color: colors.text }}>
          {groomName}
          <span className="mx-1 text-xs" style={{ color: colors.accent }}>&</span>
          {brideName}
        </p>
        <p className="text-[7px] mt-2 font-mono" style={{ color: colors.textMuted }}>
          {dateFormatted.replace(/-/g, '.')}
        </p>
      </div>

      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-l border-t opacity-30" style={{ borderColor: colors.text }} />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b opacity-30" style={{ borderColor: colors.text }} />
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
