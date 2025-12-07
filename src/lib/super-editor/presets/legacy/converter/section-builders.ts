/**
 * Section Builders
 * 레거시 섹션 정의를 PrimitiveNode 트리로 변환
 */

import type { PrimitiveNode } from '../../../schema/primitives'
import type { LegacySectionDefinition } from '../types'
import type { SectionBuilderContext, SectionBuilder } from './types'
import { LEGACY_LAYOUT_STYLES, LEGACY_PADDING_VALUES } from './types'
import { mapLegacyAnimation } from '../types'
import { introBuilders, resetIdCounter } from '../intro-builders'
import type { IntroBuilderData, IntroBuilderContext } from '../intro-builders/types'
import type { LegacyIntroType } from '../types'

// ============================================
// Helper Functions
// ============================================

function generateId(): string {
  return `node_${Math.random().toString(36).slice(2, 9)}`
}

function getPaddingStyle(padding?: string): Record<string, string> {
  const value = LEGACY_PADDING_VALUES[padding ?? 'medium'] ?? '24px'
  return { padding: value }
}

function getLayoutStyle(layout: string): Record<string, string | number> {
  return LEGACY_LAYOUT_STYLES[layout] ?? LEGACY_LAYOUT_STYLES['centered']
}

function buildAnimatedWrapper(
  children: PrimitiveNode[],
  animation: { type: string; trigger?: string; duration?: number; stagger?: number }
): PrimitiveNode {
  return {
    id: generateId(),
    type: 'animated',
    props: {
      animation: {
        preset: mapLegacyAnimation(animation.type),
        duration: animation.duration ?? 500,
      },
      trigger: animation.trigger === 'on-scroll' ? 'inView' : 'mount',
    },
    children,
  }
}

// ============================================
// Section Builders
// ============================================

/**
 * Hero / Intro 섹션 빌더
 *
 * preset.intro.type에 따라 적절한 인트로 빌더를 호출합니다.
 * - cinematic, exhibition, magazine 등 각각 고유한 스타일 적용
 * - 데이터 바인딩 표현식({{...}})을 사용하여 런타임에 값 치환
 */
export function buildHeroSection(ctx: SectionBuilderContext): PrimitiveNode {
  const { preset } = ctx
  const introType = preset.intro.type as LegacyIntroType

  // 인트로 빌더가 있으면 사용
  const introBuilder = introBuilders[introType]
  if (introBuilder) {
    // ID 카운터 리셋 (깨끗한 상태로 시작)
    resetIdCounter()

    // 데이터 바인딩 표현식 사용 (런타임에 실제 값으로 치환됨)
    const introData: IntroBuilderData = {
      groomName: '{{couple.groom.name}}',
      brideName: '{{couple.bride.name}}',
      weddingDate: '{{wedding.date}}',
      venueName: '{{venue.name}}',
      mainImage: '{{photos.main}}',
    }

    const introCtx: IntroBuilderContext = {
      preset,
      data: introData,
    }

    const result = introBuilder(introCtx)
    return result.root
  }

  // Fallback: 인트로 빌더가 없는 경우 기본 hero 섹션 생성
  return buildDefaultHeroSection(ctx)
}

/**
 * 기본 Hero 섹션 (인트로 빌더가 없는 경우 fallback)
 */
function buildDefaultHeroSection(ctx: SectionBuilderContext): PrimitiveNode {
  const { section, preset } = ctx
  const themeSpecific = section.content?.themeSpecific ?? {}

  const children: PrimitiveNode[] = []

  // 메인 이미지
  children.push({
    id: generateId(),
    type: 'image',
    props: {
      src: '{{photos.main}}',
      alt: 'Wedding Photo',
      aspectRatio: 'auto',
      objectFit: 'cover',
    },
    style: {
      width: '100%',
      height: section.layout === 'fullscreen' ? '100vh' : 'auto',
      objectFit: 'cover',
    },
  })

  // 오버레이 텍스트
  if (section.layout === 'overlay-text' || themeSpecific.showSubtitle) {
    children.push({
      id: generateId(),
      type: 'overlay',
      props: { position: 'center' },
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.3)',
      },
      children: [
        {
          id: generateId(),
          type: 'text',
          props: {
            content: '{{couple.groom.name}} & {{couple.bride.name}}',
            as: 'h1',
          },
          style: {
            fontSize: section.content?.titleSize === 'hero' ? '48px' : '36px',
            fontWeight: 700,
            color: section.style?.textColor ?? preset.defaultColors.text,
          },
        },
        {
          id: generateId(),
          type: 'text',
          props: {
            content: '{{wedding.dateDisplay}}',
            as: 'p',
          },
          style: {
            fontSize: '18px',
            marginTop: '16px',
            color: section.style?.textColor ?? preset.defaultColors.textMuted,
          },
        },
      ],
    })
  }

  const container: PrimitiveNode = {
    id: generateId(),
    type: section.layout === 'fullscreen' ? 'fullscreen' : 'container',
    style: {
      ...getLayoutStyle(section.layout),
      ...getPaddingStyle(section.style?.padding),
      backgroundColor: section.style?.backgroundColor ?? preset.defaultColors.background,
      position: 'relative',
      overflow: 'hidden',
    },
    children,
  }

  return buildAnimatedWrapper([container], section.animation)
}

/**
 * Greeting 섹션 빌더
 */
export function buildGreetingSection(ctx: SectionBuilderContext): PrimitiveNode {
  const { section, preset } = ctx

  const content: PrimitiveNode = {
    id: generateId(),
    type: 'container',
    style: {
      ...getLayoutStyle(section.layout),
      ...getPaddingStyle(section.style?.padding),
      backgroundColor: section.style?.backgroundColor ?? preset.defaultColors.background,
    },
    children: [
      {
        id: generateId(),
        type: 'text',
        props: {
          content: '{{greeting.title}}',
          as: 'h2',
        },
        style: {
          fontSize: '24px',
          fontWeight: 600,
          marginBottom: '24px',
          color: preset.defaultColors.text,
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: {
          content: '{{greeting.content}}',
          as: 'p',
          html: true,
        },
        style: {
          fontSize: '16px',
          lineHeight: 1.8,
          whiteSpace: 'pre-wrap',
          color: preset.defaultColors.text,
        },
      },
    ],
  }

  return buildAnimatedWrapper([content], section.animation)
}

/**
 * Gallery 섹션 빌더
 */
export function buildGallerySection(ctx: SectionBuilderContext): PrimitiveNode {
  const { section, preset } = ctx

  const galleryType = section.layout === 'carousel' ? 'carousel' :
    section.layout === 'masonry' ? 'masonry' :
    section.layout === 'grid' ? 'grid' : 'gallery'

  const content: PrimitiveNode = {
    id: generateId(),
    type: 'container',
    style: {
      ...getPaddingStyle(section.style?.padding),
      backgroundColor: section.style?.backgroundColor ?? preset.defaultColors.background,
    },
    children: [
      {
        id: generateId(),
        type: galleryType,
        props: {
          images: '{{photos.gallery}}',
          aspectRatio: '3:4',
          objectFit: 'cover',
          onClick: 'lightbox',
          columns: 2,
          gap: 8,
          showDots: galleryType === 'carousel',
          showArrows: galleryType === 'carousel',
        },
      },
    ],
  }

  return buildAnimatedWrapper([content], section.animation)
}

/**
 * Calendar / Date 섹션 빌더
 */
export function buildCalendarSection(ctx: SectionBuilderContext): PrimitiveNode {
  const { section, preset } = ctx

  const content: PrimitiveNode = {
    id: generateId(),
    type: 'container',
    style: {
      ...getLayoutStyle(section.layout),
      ...getPaddingStyle(section.style?.padding),
      backgroundColor: section.style?.backgroundColor ?? preset.defaultColors.background,
    },
    children: [
      {
        id: generateId(),
        type: 'text',
        props: { content: '예식 일시', as: 'h2' },
        style: {
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '24px',
          color: preset.defaultColors.text,
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: { content: '{{wedding.dateDisplay}}', as: 'p' },
        style: {
          fontSize: '24px',
          fontWeight: 700,
          color: preset.defaultColors.primary,
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: { content: '{{wedding.timeDisplay}}', as: 'p' },
        style: {
          fontSize: '18px',
          marginTop: '8px',
          color: preset.defaultColors.text,
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 24 },
      },
      {
        id: generateId(),
        type: 'text',
        props: { content: 'D-{{wedding.dday}}', as: 'p' },
        style: {
          fontSize: '16px',
          color: preset.defaultColors.accent,
        },
      },
    ],
  }

  return buildAnimatedWrapper([content], section.animation)
}

/**
 * Location / Venue 섹션 빌더
 */
export function buildLocationSection(ctx: SectionBuilderContext): PrimitiveNode {
  const { section, preset } = ctx

  const content: PrimitiveNode = {
    id: generateId(),
    type: 'container',
    style: {
      ...getLayoutStyle(section.layout),
      ...getPaddingStyle(section.style?.padding),
      backgroundColor: section.style?.backgroundColor ?? preset.defaultColors.background,
    },
    children: [
      {
        id: generateId(),
        type: 'text',
        props: { content: '오시는 길', as: 'h2' },
        style: {
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '16px',
          color: preset.defaultColors.text,
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: { content: '{{venue.name}}', as: 'p' },
        style: {
          fontSize: '18px',
          fontWeight: 600,
          color: preset.defaultColors.text,
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: { content: '{{venue.hall}}', as: 'p' },
        style: {
          fontSize: '14px',
          color: preset.defaultColors.textMuted,
          marginTop: '4px',
        },
      },
      {
        id: generateId(),
        type: 'spacer',
        props: { height: 16 },
      },
      {
        id: generateId(),
        type: 'map-embed',
        props: {
          lat: '{{venue.lat}}',
          lng: '{{venue.lng}}',
          address: '{{venue.address}}',
          name: '{{venue.name}}',
          zoom: 15,
          provider: 'kakao',
          height: 200,
          navigationButtons: ['kakao', 'naver', 'tmap'],
        },
        style: {
          borderRadius: '8px',
          overflow: 'hidden',
          marginTop: '16px',
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: { content: '{{venue.address}}', as: 'p' },
        style: {
          fontSize: '14px',
          color: preset.defaultColors.textMuted,
          marginTop: '12px',
        },
      },
    ],
  }

  return buildAnimatedWrapper([content], section.animation)
}

/**
 * Account 섹션 빌더
 */
export function buildAccountSection(ctx: SectionBuilderContext): PrimitiveNode {
  const { section, preset } = ctx

  const content: PrimitiveNode = {
    id: generateId(),
    type: 'container',
    style: {
      ...getLayoutStyle(section.layout),
      ...getPaddingStyle(section.style?.padding),
      backgroundColor: section.style?.backgroundColor ?? preset.defaultColors.background,
    },
    children: [
      {
        id: generateId(),
        type: 'text',
        props: { content: '마음 전하실 곳', as: 'h2' },
        style: {
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '24px',
          color: preset.defaultColors.text,
        },
      },
      // 신랑측 계좌
      {
        id: generateId(),
        type: 'container',
        style: {
          padding: '16px',
          backgroundColor: preset.defaultColors.surface,
          borderRadius: '8px',
          marginBottom: '12px',
        },
        children: [
          {
            id: generateId(),
            type: 'text',
            props: { content: '신랑측', as: 'h3' },
            style: {
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              color: preset.defaultColors.text,
            },
          },
          {
            id: generateId(),
            type: 'repeat',
            props: {
              dataPath: 'accounts.groom',
              as: 'account',
            },
            children: [
              {
                id: generateId(),
                type: 'row',
                props: { justify: 'between', align: 'center' },
                style: { marginBottom: '8px' },
                children: [
                  {
                    id: generateId(),
                    type: 'text',
                    props: { content: '{{account.bank}} {{account.number}}' },
                    style: { fontSize: '14px', color: preset.defaultColors.text },
                  },
                  {
                    id: generateId(),
                    type: 'button',
                    props: {
                      label: '복사',
                      variant: 'outline',
                      size: 'sm',
                      action: { type: 'copy', value: '{{account.number}}', toast: '계좌번호가 복사되었습니다' },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      // 신부측 계좌
      {
        id: generateId(),
        type: 'container',
        style: {
          padding: '16px',
          backgroundColor: preset.defaultColors.surface,
          borderRadius: '8px',
        },
        children: [
          {
            id: generateId(),
            type: 'text',
            props: { content: '신부측', as: 'h3' },
            style: {
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '12px',
              color: preset.defaultColors.text,
            },
          },
          {
            id: generateId(),
            type: 'repeat',
            props: {
              dataPath: 'accounts.bride',
              as: 'account',
            },
            children: [
              {
                id: generateId(),
                type: 'row',
                props: { justify: 'between', align: 'center' },
                style: { marginBottom: '8px' },
                children: [
                  {
                    id: generateId(),
                    type: 'text',
                    props: { content: '{{account.bank}} {{account.number}}' },
                    style: { fontSize: '14px', color: preset.defaultColors.text },
                  },
                  {
                    id: generateId(),
                    type: 'button',
                    props: {
                      label: '복사',
                      variant: 'outline',
                      size: 'sm',
                      action: { type: 'copy', value: '{{account.number}}', toast: '계좌번호가 복사되었습니다' },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  return buildAnimatedWrapper([content], section.animation)
}

/**
 * Message / Guestbook 섹션 빌더
 */
export function buildMessageSection(ctx: SectionBuilderContext): PrimitiveNode {
  const { section, preset } = ctx

  const content: PrimitiveNode = {
    id: generateId(),
    type: 'container',
    style: {
      ...getLayoutStyle(section.layout),
      ...getPaddingStyle(section.style?.padding),
      backgroundColor: section.style?.backgroundColor ?? preset.defaultColors.background,
    },
    children: [
      {
        id: generateId(),
        type: 'text',
        props: { content: '축하 메시지', as: 'h2' },
        style: {
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '24px',
          color: preset.defaultColors.text,
        },
      },
      {
        id: generateId(),
        type: 'button',
        props: {
          label: '축하 메시지 남기기',
          variant: 'primary',
          size: 'lg',
          action: { type: 'custom', handler: 'openGuestbook' },
        },
        style: {
          width: '100%',
          backgroundColor: preset.defaultColors.primary,
        },
      },
    ],
  }

  return buildAnimatedWrapper([content], section.animation)
}

/**
 * Closing 섹션 빌더
 */
export function buildClosingSection(ctx: SectionBuilderContext): PrimitiveNode {
  const { section, preset } = ctx

  const content: PrimitiveNode = {
    id: generateId(),
    type: 'container',
    style: {
      ...getLayoutStyle(section.layout),
      ...getPaddingStyle(section.style?.padding),
      backgroundColor: section.style?.backgroundColor ?? preset.defaultColors.background,
      minHeight: section.layout === 'fullscreen' ? '50vh' : 'auto',
    },
    children: [
      {
        id: generateId(),
        type: 'text',
        props: {
          content: '{{couple.groom.name}} ♥ {{couple.bride.name}}',
          as: 'h2',
        },
        style: {
          fontSize: '24px',
          fontWeight: 600,
          color: section.style?.textColor ?? preset.defaultColors.text,
        },
      },
      {
        id: generateId(),
        type: 'text',
        props: { content: '{{wedding.dateDisplay}}', as: 'p' },
        style: {
          fontSize: '16px',
          marginTop: '12px',
          color: section.style?.textColor ?? preset.defaultColors.textMuted,
        },
      },
    ],
  }

  return buildAnimatedWrapper([content], section.animation)
}

/**
 * Story 섹션 빌더 (vinyl, passport 등)
 */
export function buildStorySection(ctx: SectionBuilderContext): PrimitiveNode {
  const { section, preset } = ctx
  const themeSpecific = section.content?.themeSpecific ?? {}

  const content: PrimitiveNode = {
    id: generateId(),
    type: 'container',
    style: {
      ...getLayoutStyle(section.layout),
      ...getPaddingStyle(section.style?.padding),
      backgroundColor: section.style?.backgroundColor ?? preset.defaultColors.background,
    },
    children: [
      {
        id: generateId(),
        type: 'text',
        props: { content: 'Our Story', as: 'h2' },
        style: {
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '24px',
          color: preset.defaultColors.text,
        },
      },
      {
        id: generateId(),
        type: 'repeat',
        props: {
          dataPath: 'story',
          as: 'item',
        },
        children: [
          {
            id: generateId(),
            type: 'container',
            style: {
              padding: '16px',
              borderLeft: `2px solid ${preset.defaultColors.primary}`,
              marginBottom: '16px',
            },
            children: [
              {
                id: generateId(),
                type: 'text',
                props: { content: '{{item.date}}', as: 'span' },
                style: { fontSize: '12px', color: preset.defaultColors.textMuted },
              },
              {
                id: generateId(),
                type: 'text',
                props: { content: '{{item.title}}', as: 'h3' },
                style: { fontSize: '16px', fontWeight: 600, marginTop: '4px' },
              },
              {
                id: generateId(),
                type: 'text',
                props: { content: '{{item.content}}', as: 'p' },
                style: { fontSize: '14px', marginTop: '8px', color: preset.defaultColors.text },
              },
            ],
          },
        ],
      },
    ],
  }

  return buildAnimatedWrapper([content], section.animation)
}

/**
 * RSVP 섹션 빌더
 */
export function buildRsvpSection(ctx: SectionBuilderContext): PrimitiveNode {
  const { section, preset } = ctx

  const content: PrimitiveNode = {
    id: generateId(),
    type: 'container',
    style: {
      ...getLayoutStyle(section.layout),
      ...getPaddingStyle(section.style?.padding),
      backgroundColor: section.style?.backgroundColor ?? preset.defaultColors.background,
    },
    children: [
      {
        id: generateId(),
        type: 'text',
        props: { content: '참석 의사 전달', as: 'h2' },
        style: {
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '24px',
          color: preset.defaultColors.text,
        },
      },
      {
        id: generateId(),
        type: 'row',
        props: { gap: 12, justify: 'center' },
        children: [
          {
            id: generateId(),
            type: 'button',
            props: {
              label: '참석',
              variant: 'primary',
              action: { type: 'custom', handler: 'rsvpAttending' },
            },
          },
          {
            id: generateId(),
            type: 'button',
            props: {
              label: '불참',
              variant: 'outline',
              action: { type: 'custom', handler: 'rsvpNotAttending' },
            },
          },
        ],
      },
    ],
  }

  return buildAnimatedWrapper([content], section.animation)
}

// ============================================
// Section Builder Registry
// ============================================

export const sectionBuilders: Record<string, SectionBuilder> = {
  'hero': buildHeroSection,
  'greeting': buildGreetingSection,
  'gallery': buildGallerySection,
  'calendar': buildCalendarSection,
  'location': buildLocationSection,
  'account': buildAccountSection,
  'message': buildMessageSection,
  'closing': buildClosingSection,
  'story': buildStorySection,
  'interview': buildStorySection, // 인터뷰도 스토리와 유사
  'rsvp': buildRsvpSection,
  'quest': buildRsvpSection, // 퀘스트도 RSVP와 유사
}

/**
 * 섹션 빌더 가져오기
 */
export function getSectionBuilder(sectionType: string): SectionBuilder | undefined {
  return sectionBuilders[sectionType]
}

/**
 * 섹션을 PrimitiveNode로 변환
 */
export function buildSection(ctx: SectionBuilderContext): PrimitiveNode {
  const builder = getSectionBuilder(ctx.section.type)

  if (!builder) {
    // 기본 컨테이너로 폴백
    return {
      id: generateId(),
      type: 'container',
      style: {
        padding: '24px',
        textAlign: 'center',
      },
      children: [
        {
          id: generateId(),
          type: 'text',
          props: { content: `[${ctx.section.type}]`, as: 'p' },
          style: { color: '#999' },
        },
      ],
    }
  }

  return builder(ctx)
}
