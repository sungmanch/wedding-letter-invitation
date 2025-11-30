'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Phone, Copy, Check, MapPin, Calendar, Clock } from 'lucide-react'
import type { Invitation, InvitationDesign, InvitationPhoto } from '@/lib/db/invitation-schema'
import type { ScreenStructure, ScreenSection } from '@/lib/actions/ai-design'
import type { InvitationThemeData, ColorPalette, FontSet, IntroConfig } from '@/lib/themes/schema'
import { IntroRenderer, IntroPreview } from './intros'

interface InvitationViewerProps {
  invitation: Invitation
  design?: InvitationDesign | null
  photos?: InvitationPhoto[]
  isPreview?: boolean
  className?: string
}

// ScreenStructure 여부 확인
function isScreenStructure(data: unknown): data is ScreenStructure {
  return (
    typeof data === 'object' &&
    data !== null &&
    'sections' in data &&
    'theme' in data &&
    Array.isArray((data as ScreenStructure).sections)
  )
}

// InvitationThemeData 여부 확인 (템플릿 기반 테마)
function isThemeData(data: unknown): data is InvitationThemeData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'templateId' in data &&
    'intro' in data &&
    'colors' in data
  )
}

export function InvitationViewer({
  invitation,
  design,
  photos = [],
  isPreview = false,
  className,
}: InvitationViewerProps) {
  // 인트로 완료 상태
  const [introCompleted, setIntroCompleted] = React.useState(false)

  // 새로운 ScreenStructure 형식인지 확인
  const designData = design?.designData
  const isNewFormat = isScreenStructure(designData)
  const hasThemeData = isThemeData(designData)

  // 새 형식이면 ScreenStructure 사용, 아니면 레거시 형식 사용
  const screenStructure = isNewFormat ? (designData as ScreenStructure) : null
  const themeData = hasThemeData ? (designData as InvitationThemeData) : null

  // 색상 추출 (우선순위: themeData > screenStructure > legacy > default)
  const colors: ColorPalette = themeData?.colors ?? screenStructure?.theme.colors ?? {
    primary: (designData as { colors?: { primary?: string } })?.colors?.primary ?? '#D4768A',
    secondary: (designData as { colors?: { secondary?: string } })?.colors?.secondary ?? '#D4AF37',
    background: (designData as { colors?: { background?: string } })?.colors?.background ?? '#FFFBFC',
    text: (designData as { colors?: { text?: string } })?.colors?.text ?? '#1F2937',
    accent: '#D4768A',
  }

  // 폰트 추출
  const fonts: FontSet = themeData?.fonts ?? {
    title: {
      family: screenStructure?.theme.fonts?.title ?? (designData as { fonts?: { title?: string } })?.fonts?.title ?? 'Noto Serif KR',
      weight: 600,
    },
    body: {
      family: screenStructure?.theme.fonts?.body ?? (designData as { fonts?: { body?: string } })?.fonts?.body ?? 'Pretendard',
      weight: 400,
    },
  }

  // 인트로 설정 추출
  const introConfig: IntroConfig | null = themeData?.intro ?? null

  // 인트로용 이미지 URL 목록
  const introImages = themeData?.images?.intro ?? photos.slice(0, 3).map(p => p.url)

  const globalEffects = screenStructure?.globalEffects ?? {
    useMagicScroll: false,
    scrollIndicator: true,
    backgroundMusic: false,
    snowEffect: false,
    petalEffect: false,
  }

  // 인트로 완료 핸들러
  const handleIntroComplete = React.useCallback(() => {
    setIntroCompleted(true)
  }, [])

  // 레거시 decorations
  const decorations = !isNewFormat
    ? ((designData as { decorations?: string[] })?.decorations ?? [])
    : []

  // D-Day calculation
  const weddingDate = new Date(invitation.weddingDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffTime = weddingDate.getTime() - today.getTime()
  const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Format date
  const formattedDate = weddingDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  // Format time
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const period = hours < 12 ? '오전' : '오후'
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    return `${period} ${displayHour}시 ${minutes > 0 ? `${minutes}분` : ''}`
  }

  // 섹션 렌더러
  const renderSection = (section: ScreenSection) => {
    const sectionStyle = {
      backgroundColor: section.style?.backgroundColor || colors.background,
      color: section.style?.textColor || colors.text,
    }

    const getPadding = () => {
      switch (section.style?.padding) {
        case 'large': return 'py-16 px-6'
        case 'small': return 'py-4 px-4'
        default: return 'py-8 px-6'
      }
    }

    const getLayoutClass = () => {
      switch (section.layout) {
        case 'fullscreen': return 'min-h-screen flex flex-col justify-center'
        case 'left-aligned': return 'text-left'
        case 'right-aligned': return 'text-right'
        case 'split': return 'grid grid-cols-2 gap-4'
        default: return 'text-center'
      }
    }

    const getAnimation = () => {
      if (!section.animation) return ''
      switch (section.animation.type) {
        case 'fade': return 'animate-fade-in'
        case 'slide-up': return 'animate-slide-up'
        case 'scale': return 'animate-scale-in'
        default: return ''
      }
    }

    switch (section.type) {
      case 'hero':
        return (
          <section
            key={section.id}
            className={cn('relative', getPadding(), getLayoutClass(), getAnimation())}
            style={sectionStyle}
          >
            {section.content?.showDecorations && section.content?.decorationType === 'floral' && (
              <div className="text-4xl mb-4">🌸✨🌸</div>
            )}
            {section.content?.showDecorations && section.content?.decorationType === 'botanical' && (
              <div className="text-4xl mb-4">🌿🍃🌿</div>
            )}
            <h1
              className={cn(
                'font-semibold mb-2',
                section.content?.titleSize === 'xlarge' ? 'text-4xl' :
                section.content?.titleSize === 'large' ? 'text-3xl' :
                section.content?.titleSize === 'small' ? 'text-xl' : 'text-2xl'
              )}
              style={{ fontFamily: fonts.title.family }}
            >
              {invitation.groomName}
              <span className="mx-3" style={{ color: colors.primary }}>♥</span>
              {invitation.brideName}
            </h1>
            <div
              className="inline-block px-4 py-1 rounded-full text-sm font-medium mt-4"
              style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
            >
              {dDay === 0 ? 'D-Day' : dDay > 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`}
            </div>
            {section.content?.showDecorations && section.content?.decorationType === 'minimal-line' && (
              <div className="w-16 h-0.5 mx-auto mt-6" style={{ backgroundColor: colors.primary }} />
            )}
          </section>
        )

      case 'greeting':
        return (
          <section
            key={section.id}
            className={cn(getPadding(), getLayoutClass(), getAnimation())}
            style={sectionStyle}
          >
            <p className="text-lg leading-relaxed" style={{ fontFamily: fonts.body.family }}>
              서로를 향한 사랑과 믿음으로<br />
              새로운 인생을 시작하려 합니다.<br /><br />
              소중한 분들을 모시고<br />
              사랑의 약속을 나누고자 합니다.
            </p>
          </section>
        )

      case 'calendar':
        return (
          <section
            key={section.id}
            className={cn(getPadding(), getLayoutClass(), getAnimation())}
            style={sectionStyle}
          >
            <div className="w-16 h-0.5 mx-auto mb-6" style={{ backgroundColor: colors.secondary || colors.primary }} />
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-5 w-5" style={{ color: colors.primary }} />
              <span className="text-lg">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" style={{ color: colors.primary }} />
              <span className="text-lg">{formatTime(invitation.weddingTime)}</span>
            </div>
          </section>
        )

      case 'gallery':
        if (photos.length === 0) return null
        return (
          <section key={section.id} className={cn('py-8', getAnimation())}>
            <PhotoGallery photos={photos} fullscreen={section.layout === 'fullscreen'} />
          </section>
        )

      case 'location':
        return (
          <section
            key={section.id}
            className={cn(getPadding(), getAnimation())}
            style={sectionStyle}
          >
            <h2 className="text-lg font-medium mb-6 text-center" style={{ fontFamily: fonts.title.family }}>
              오시는 길
            </h2>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                <div>
                  <p className="font-medium">{invitation.venueName}</p>
                  <p className="text-sm text-gray-500 mt-1">{invitation.venueAddress}</p>
                  {invitation.venueDetail && (
                    <p className="text-sm text-gray-400 mt-1">{invitation.venueDetail}</p>
                  )}
                </div>
              </div>
              <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">지도 영역</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 py-3 rounded-xl text-sm font-medium bg-gray-100 text-charcoal hover:bg-gray-200 transition-colors"
                  onClick={() => window.open(`https://map.kakao.com/link/search/${encodeURIComponent(invitation.venueAddress)}`, '_blank')}
                >
                  카카오맵
                </button>
                <button
                  className="flex-1 py-3 rounded-xl text-sm font-medium bg-gray-100 text-charcoal hover:bg-gray-200 transition-colors"
                  onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(invitation.venueAddress)}`, '_blank')}
                >
                  네이버지도
                </button>
              </div>
            </div>
          </section>
        )

      case 'parents':
        return (
          <section
            key={section.id}
            className={cn(getPadding(), 'text-center', getAnimation())}
            style={sectionStyle}
          >
            <h2 className="text-lg font-medium mb-6" style={{ fontFamily: fonts.title.family }}>
              혼주 소개
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-2">신랑측</p>
                <p>
                  {invitation.groomFatherName && (
                    <span className="block">{invitation.groomFatherName} · {invitation.groomMotherName}</span>
                  )}
                  <span className="font-medium">의 아들 {invitation.groomName}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">신부측</p>
                <p>
                  {invitation.brideFatherName && (
                    <span className="block">{invitation.brideFatherName} · {invitation.brideMotherName}</span>
                  )}
                  <span className="font-medium">의 딸 {invitation.brideName}</span>
                </p>
              </div>
            </div>
          </section>
        )

      case 'account':
        return <AccountSection key={section.id} invitation={invitation} colors={colors} fonts={fonts} />

      case 'message':
        return (
          <section
            key={section.id}
            className={cn(getPadding(), 'text-center', getAnimation())}
            style={sectionStyle}
          >
            <h2 className="text-lg font-medium mb-6" style={{ fontFamily: fonts.title.family }}>
              축하 메시지
            </h2>
            <p className="text-sm text-gray-500">
              축하 메시지를 남겨주세요
            </p>
          </section>
        )

      case 'closing':
        return (
          <footer
            key={section.id}
            className={cn(getPadding(), 'text-center', getAnimation())}
            style={sectionStyle}
          >
            <p className="text-xs text-gray-400">Made with 청모장</p>
          </footer>
        )

      default:
        return null
    }
  }

  // 인트로가 있고 아직 완료되지 않은 경우 (실제 뷰어에서만 인트로만 렌더링)
  if (introConfig && !introCompleted && !isPreview) {
    return (
      <IntroRenderer
        intro={introConfig}
        colors={colors}
        fonts={fonts}
        groomName={invitation.groomName}
        brideName={invitation.brideName}
        weddingDate={invitation.weddingDate}
        venueName={invitation.venueName}
        images={introImages}
        onComplete={handleIntroComplete}
      />
    )
  }

  // 프리뷰용 Intro 섹션 컴포넌트
  // CSS 변수 --preview-screen-height가 있으면 사용, 없으면 100vh 사용
  const PreviewIntroSection = introConfig ? (
    <div
      className="relative w-full"
      style={{ height: 'var(--preview-screen-height, 100vh)' }}
    >
      <IntroPreview
        intro={introConfig}
        colors={colors}
        fonts={fonts}
        groomName={invitation.groomName}
        brideName={invitation.brideName}
        weddingDate={invitation.weddingDate}
        venueName={invitation.venueName}
        userImageUrl={introImages[0]}
      />
    </div>
  ) : null

  // 새 형식이면 sections 기반 렌더링
  if (isNewFormat && screenStructure) {
    return (
      <div
        className={cn('min-h-screen', className)}
        style={{ backgroundColor: colors.background }}
      >
        {globalEffects.petalEffect && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {/* 꽃잎 효과 - CSS 애니메이션으로 구현 가능 */}
          </div>
        )}
        {/* 프리뷰 모드에서는 Intro를 첫 섹션으로 표시 */}
        {isPreview && PreviewIntroSection}
        {screenStructure.sections.map(renderSection)}
      </div>
    )
  }

  // 레거시 형식 렌더링
  return (
    <div
      className={cn('min-h-screen', className)}
      style={{ backgroundColor: colors.background }}
    >
      {/* 프리뷰 모드에서는 Intro를 첫 섹션으로 표시 */}
      {isPreview && PreviewIntroSection}

      {/* Hero Section */}
      <section className="relative py-16 px-6 text-center">
        {/* Top Decoration */}
        {decorations.includes('floral_top') && (
          <div className="text-4xl mb-4">🌸✨🌸</div>
        )}

        {/* Names */}
        <h1
          className="text-3xl font-semibold mb-2"
          style={{ color: colors.text, fontFamily: fonts.title.family }}
        >
          {invitation.groomName}
          <span className="mx-3" style={{ color: colors.primary }}>
            ♥
          </span>
          {invitation.brideName}
        </h1>

        {/* D-Day Badge */}
        <div
          className="inline-block px-4 py-1 rounded-full text-sm font-medium mt-4"
          style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
        >
          {dDay === 0 ? 'D-Day' : dDay > 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`}
        </div>
      </section>

      {/* Date & Time Section */}
      <section className="py-8 px-6 text-center">
        <div
          className="w-16 h-0.5 mx-auto mb-6"
          style={{ backgroundColor: colors.secondary }}
        />
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="h-5 w-5" style={{ color: colors.primary }} />
          <span className="text-lg" style={{ color: colors.text }}>
            {formattedDate}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-5 w-5" style={{ color: colors.primary }} />
          <span className="text-lg" style={{ color: colors.text }}>
            {formatTime(invitation.weddingTime)}
          </span>
        </div>
      </section>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <section className="py-8">
          <PhotoGallery photos={photos} />
        </section>
      )}

      {/* Parents Section */}
      <section className="py-8 px-6 text-center">
        <h2
          className="text-lg font-medium mb-6"
          style={{ color: colors.text, fontFamily: fonts.title.family }}
        >
          혼주 소개
        </h2>
        <div className="grid grid-cols-2 gap-8">
          {/* Groom Side */}
          <div>
            <p className="text-sm text-gray-500 mb-2">신랑측</p>
            <p style={{ color: colors.text }}>
              {invitation.groomFatherName && (
                <span className="block">{invitation.groomFatherName} · {invitation.groomMotherName}</span>
              )}
              <span className="font-medium">의 아들 {invitation.groomName}</span>
            </p>
          </div>
          {/* Bride Side */}
          <div>
            <p className="text-sm text-gray-500 mb-2">신부측</p>
            <p style={{ color: colors.text }}>
              {invitation.brideFatherName && (
                <span className="block">{invitation.brideFatherName} · {invitation.brideMotherName}</span>
              )}
              <span className="font-medium">의 딸 {invitation.brideName}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-8 px-6">
        <h2
          className="text-lg font-medium mb-6 text-center"
          style={{ color: colors.text, fontFamily: fonts.title.family }}
        >
          오시는 길
        </h2>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
            <div>
              <p className="font-medium" style={{ color: colors.text }}>
                {invitation.venueName}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {invitation.venueAddress}
              </p>
              {invitation.venueDetail && (
                <p className="text-sm text-gray-400 mt-1">
                  {invitation.venueDetail}
                </p>
              )}
            </div>
          </div>

          {/* Map Placeholder - 카카오맵 연동 필요 */}
          <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
            <span className="text-gray-400">지도 영역</span>
          </div>

          {/* Map Actions */}
          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-gray-100 text-charcoal hover:bg-gray-200 transition-colors"
              onClick={() => {
                const encodedAddress = encodeURIComponent(invitation.venueAddress)
                window.open(`https://map.kakao.com/link/search/${encodedAddress}`, '_blank')
              }}
            >
              카카오맵
            </button>
            <button
              className="flex-1 py-3 rounded-xl text-sm font-medium bg-gray-100 text-charcoal hover:bg-gray-200 transition-colors"
              onClick={() => {
                const encodedAddress = encodeURIComponent(invitation.venueAddress)
                window.open(`https://map.naver.com/v5/search/${encodedAddress}`, '_blank')
              }}
            >
              네이버지도
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection invitation={invitation} colors={colors} fonts={fonts} />

      {/* Account Section */}
      <AccountSection invitation={invitation} colors={colors} fonts={fonts} />

      {/* Watermark */}
      <footer className="py-8 px-6 text-center">
        <p className="text-xs text-gray-400">
          Made with 청모장
        </p>
      </footer>
    </div>
  )
}

// Photo Gallery Component
function PhotoGallery({ photos, fullscreen = false }: { photos: InvitationPhoto[]; fullscreen?: boolean }) {
  const sortedPhotos = [...photos].sort((a, b) => a.displayOrder - b.displayOrder)

  if (sortedPhotos.length === 0) return null

  if (fullscreen) {
    return (
      <div className="space-y-4">
        {sortedPhotos.map((photo) => (
          <div key={photo.id} className="relative w-full aspect-[3/4]">
            <Image
              src={photo.url}
              alt="Wedding photo"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 px-6" style={{ width: 'max-content' }}>
        {sortedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="relative w-64 aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0"
          >
            <Image
              src={photo.url}
              alt="Wedding photo"
              fill
              className="object-cover"
              sizes="256px"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Contact Section Component
function ContactSection({
  invitation,
  colors,
  fonts,
}: {
  invitation: Invitation
  colors: ColorPalette
  fonts: FontSet
}) {
  const hasGroomContact = invitation.groomPhone || invitation.groomFatherPhone || invitation.groomMotherPhone
  const hasBrideContact = invitation.bridePhone || invitation.brideFatherPhone || invitation.brideMotherPhone

  if (!hasGroomContact && !hasBrideContact) return null

  return (
    <section className="py-8 px-6">
      <h2
        className="text-lg font-medium mb-6 text-center"
        style={{ color: colors.text, fontFamily: fonts.title.family }}
      >
        연락처
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Groom Side */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-3 text-center">신랑측</p>
          <div className="space-y-3">
            {invitation.groomPhone && (
              <ContactItem
                label={invitation.groomName}
                phone={invitation.groomPhone}
                colors={colors}
              />
            )}
            {invitation.groomFatherPhone && (
              <ContactItem
                label={`아버지 ${invitation.groomFatherName || ''}`}
                phone={invitation.groomFatherPhone}
                colors={colors}
              />
            )}
            {invitation.groomMotherPhone && (
              <ContactItem
                label={`어머니 ${invitation.groomMotherName || ''}`}
                phone={invitation.groomMotherPhone}
                colors={colors}
              />
            )}
          </div>
        </div>

        {/* Bride Side */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 mb-3 text-center">신부측</p>
          <div className="space-y-3">
            {invitation.bridePhone && (
              <ContactItem
                label={invitation.brideName}
                phone={invitation.bridePhone}
                colors={colors}
              />
            )}
            {invitation.brideFatherPhone && (
              <ContactItem
                label={`아버지 ${invitation.brideFatherName || ''}`}
                phone={invitation.brideFatherPhone}
                colors={colors}
              />
            )}
            {invitation.brideMotherPhone && (
              <ContactItem
                label={`어머니 ${invitation.brideMotherName || ''}`}
                phone={invitation.brideMotherPhone}
                colors={colors}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactItem({
  label,
  phone,
  colors,
}: {
  label: string
  phone: string
  colors: { primary: string }
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 truncate flex-1">{label}</span>
      <a
        href={`tel:${phone}`}
        className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
        style={{ backgroundColor: `${colors.primary}20` }}
      >
        <Phone className="h-4 w-4" style={{ color: colors.primary }} />
      </a>
    </div>
  )
}

// Account Section Component
function AccountSection({
  invitation,
  colors,
  fonts,
}: {
  invitation: Invitation
  colors: ColorPalette
  fonts: FontSet
}) {
  const hasGroomAccount = invitation.groomBank && invitation.groomAccount
  const hasBrideAccount = invitation.brideBank && invitation.brideAccount

  if (!hasGroomAccount && !hasBrideAccount) return null

  return (
    <section className="py-8 px-6">
      <h2
        className="text-lg font-medium mb-6 text-center"
        style={{ color: colors.text, fontFamily: fonts.title.family }}
      >
        마음 전하실 곳
      </h2>
      <div className="space-y-4">
        {hasGroomAccount && (
          <AccountCard
            side="신랑측"
            bank={invitation.groomBank!}
            account={invitation.groomAccount!}
            holder={invitation.groomAccountHolder || invitation.groomName}
            colors={colors}
          />
        )}
        {hasBrideAccount && (
          <AccountCard
            side="신부측"
            bank={invitation.brideBank!}
            account={invitation.brideAccount!}
            holder={invitation.brideAccountHolder || invitation.brideName}
            colors={colors}
          />
        )}
      </div>
    </section>
  )
}

function AccountCard({
  side,
  bank,
  account,
  holder,
  colors,
}: {
  side: string
  bank: string
  account: string
  holder: string
  colors: { primary: string }
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = account
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-2">{side}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-charcoal">
            {bank} {account}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            예금주: {holder}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center w-12 h-12 rounded-full transition-colors"
          style={{ backgroundColor: copied ? `${colors.primary}` : `${colors.primary}20` }}
        >
          {copied ? (
            <Check className="h-5 w-5 text-white" />
          ) : (
            <Copy className="h-5 w-5" style={{ color: colors.primary }} />
          )}
        </button>
      </div>
    </div>
  )
}
