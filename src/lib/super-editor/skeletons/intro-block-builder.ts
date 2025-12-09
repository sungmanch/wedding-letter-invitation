/**
 * Super Editor - Intro Block Builder
 * 블록 조합을 SkeletonNode 구조로 변환
 */

import type { SkeletonNode, DataSlot, AnimationOption } from './types'
import type {
  IntroBlockComposition,
  TextStyleBlock,
  ColorThemeBlock,
} from './intro-blocks'

// ============================================
// Style Mappings
// ============================================

const TEXT_STYLE_TOKENS: Record<
  TextStyleBlock,
  { fontFamily: string; nameSize: string; dateSize: string }
> = {
  elegant: {
    fontFamily: '$token.typography.displayLg.fontFamily',
    nameSize: '$token.typography.displayLg.fontSize',
    dateSize: '$token.typography.bodyLg.fontSize',
  },
  modern: {
    fontFamily: '$token.typography.displayLg.fontFamily',
    nameSize: '$token.typography.displayLg.fontSize',
    dateSize: '$token.typography.bodyMd.fontSize',
  },
  typewriter: {
    fontFamily: '"Courier New", monospace',
    nameSize: '20px',
    dateSize: '14px',
  },
  editorial: {
    fontFamily: '$token.typography.displayLg.fontFamily',
    nameSize: '42px',
    dateSize: '14px',
  },
}

const COLOR_THEME_STYLES: Record<
  ColorThemeBlock,
  { bg: string; textPrimary: string; textSecondary: string }
> = {
  light: {
    bg: '$token.colors.background',
    textPrimary: '$token.colors.text.primary',
    textSecondary: '$token.colors.text.secondary',
  },
  dark: {
    bg: '#000000',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.7)',
  },
  overlay: {
    bg: '$token.colors.background',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.8)',
  },
  warm: {
    bg: '#FDF8F3',
    textPrimary: '#333333',
    textSecondary: '#666666',
  },
}

// ============================================
// Image Layout Builders
// ============================================

function buildFullscreenBgImage(): SkeletonNode {
  return {
    id: 'intro-bg-image',
    type: 'image',
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
    },
    props: {
      src: '{{photos.main}}',
      objectFit: 'cover',
    },
  }
}

function buildCenteredImage(): SkeletonNode {
  return {
    id: 'intro-image',
    type: 'image',
    tokenStyle: {
      borderRadius: '$token.borders.radiusMd',
    },
    style: {
      width: '80%',
      maxWidth: '320px',
    },
    props: {
      src: '{{photos.main}}',
      aspectRatio: '3:4',
      objectFit: 'cover',
    },
  }
}

function buildCircularImage(): SkeletonNode {
  return {
    id: 'intro-frame',
    type: 'container',
    tokenStyle: {
      borderRadius: '$token.borders.radiusFull',
      boxShadow: '$token.shadows.lg',
    },
    style: {
      overflow: 'hidden',
      width: '200px',
      height: '200px',
    },
    children: [
      {
        id: 'intro-image',
        type: 'image',
        style: {
          width: '100%',
          height: '100%',
        },
        props: {
          src: '{{photos.main}}',
          objectFit: 'cover',
        },
      },
    ],
  }
}

function buildPolaroidImage(): SkeletonNode {
  return {
    id: 'intro-polaroid-frame',
    type: 'container',
    style: {
      backgroundColor: '#FFFFFF',
      padding: '12px 12px 48px 12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
      transform: 'rotate(-2deg)',
    },
    children: [
      {
        id: 'intro-image',
        type: 'image',
        style: {
          width: '260px',
          height: '260px',
        },
        props: {
          src: '{{photos.main}}',
          objectFit: 'cover',
        },
      },
    ],
  }
}

function buildSplitLeftImage(): SkeletonNode {
  return {
    id: 'intro-image-half',
    type: 'container',
    style: {
      width: '50%',
      height: '100%',
    },
    children: [
      {
        id: 'intro-image',
        type: 'image',
        style: {
          width: '100%',
          height: '100%',
        },
        props: {
          src: '{{photos.main}}',
          objectFit: 'cover',
        },
      },
    ],
  }
}

function buildCardImage(): SkeletonNode {
  return {
    id: 'intro-image-wrapper',
    type: 'container',
    tokenStyle: {
      borderRadius: '$token.borders.radiusMd',
      boxShadow: '$token.shadows.md',
    },
    style: {
      overflow: 'hidden',
      width: '100%',
    },
    children: [
      {
        id: 'intro-image',
        type: 'image',
        style: {
          width: '100%',
          aspectRatio: '1/1',
        },
        props: {
          src: '{{photos.main}}',
          objectFit: 'cover',
        },
      },
    ],
  }
}

// ============================================
// Text Layout Builders
// ============================================

function buildNamesText(
  style: TextStyleBlock,
  theme: ColorThemeBlock,
  stacked: boolean = false
): SkeletonNode | SkeletonNode[] {
  const textStyles = TEXT_STYLE_TOKENS[style]
  const colorStyles = COLOR_THEME_STYLES[theme]

  if (stacked) {
    return [
      {
        id: 'intro-groom-name',
        type: 'text',
        style: {
          fontFamily: textStyles.fontFamily,
          fontSize: textStyles.nameSize,
          fontWeight: '600',
          color: colorStyles.textPrimary,
          textAlign: 'center',
          letterSpacing: '0.1em',
        },
        props: {
          content: '{{couple.groom.name}}',
          as: 'h1',
        },
      },
      {
        id: 'intro-ampersand',
        type: 'text',
        style: {
          color: colorStyles.textSecondary,
          fontSize: '24px',
          margin: '16px 0',
        },
        props: {
          content: '&',
          as: 'span',
        },
      },
      {
        id: 'intro-bride-name',
        type: 'text',
        style: {
          fontFamily: textStyles.fontFamily,
          fontSize: textStyles.nameSize,
          fontWeight: '600',
          color: colorStyles.textPrimary,
          textAlign: 'center',
          letterSpacing: '0.1em',
        },
        props: {
          content: '{{couple.bride.name}}',
          as: 'h1',
        },
      },
    ]
  }

  return {
    id: 'intro-names',
    type: 'text',
    style: {
      fontFamily: textStyles.fontFamily,
      fontSize: textStyles.nameSize,
      fontWeight: '600',
      color: colorStyles.textPrimary,
      textAlign: 'center',
      whiteSpace: 'nowrap',
    },
    props: {
      content: '{{couple.groom.name}} & {{couple.bride.name}}',
      as: 'h1',
    },
  }
}

function buildDateText(style: TextStyleBlock, theme: ColorThemeBlock): SkeletonNode {
  const textStyles = TEXT_STYLE_TOKENS[style]
  const colorStyles = COLOR_THEME_STYLES[theme]

  return {
    id: 'intro-date',
    type: 'text',
    style: {
      fontFamily: textStyles.fontFamily,
      fontSize: textStyles.dateSize,
      color: colorStyles.textSecondary,
      textAlign: 'center',
    },
    props: {
      content: '{{wedding.date}}',
      as: 'p',
    },
  }
}

// ============================================
// Decoration Builders
// ============================================

function buildLabelText(theme: ColorThemeBlock): SkeletonNode {
  const colorStyles = COLOR_THEME_STYLES[theme]

  return {
    id: 'intro-label',
    type: 'text',
    style: {
      color: colorStyles.textSecondary,
      fontSize: '12px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
    },
    props: {
      content: 'Wedding Invitation',
      as: 'span',
    },
  }
}

function buildDividerLine(theme: ColorThemeBlock): SkeletonNode {
  const colorStyles = COLOR_THEME_STYLES[theme]

  return {
    id: 'intro-divider',
    type: 'divider',
    style: {
      width: '60px',
      backgroundColor: colorStyles.textSecondary,
      opacity: 0.6,
    },
    props: {
      thickness: 1,
    },
  }
}

function buildScrollHint(theme: ColorThemeBlock): SkeletonNode {
  const colorStyles = COLOR_THEME_STYLES[theme]

  return {
    id: 'intro-scroll-hint',
    type: 'text',
    style: {
      color: colorStyles.textSecondary,
      fontSize: '12px',
      marginTop: '32px',
      opacity: 0.6,
    },
    props: {
      content: 'Scroll down ↓',
      as: 'span',
    },
  }
}

// ============================================
// Main Builder
// ============================================

export interface IntroBuilderResult {
  structure: SkeletonNode
  slots: DataSlot[]
  animations: AnimationOption[]
}

/**
 * 블록 조합으로 인트로 SkeletonNode 생성
 */
export function buildIntroFromBlocks(composition: IntroBlockComposition): IntroBuilderResult {
  const { imageLayout, textLayout, textStyle: _textStyle, decoration: _decoration, colorTheme } = composition
  const _colorStyles = COLOR_THEME_STYLES[colorTheme]

  // 기본 슬롯
  const slots: DataSlot[] = [
    {
      id: 'main-photo',
      path: 'photos.main',
      type: 'image',
      required: true,
      description: '메인 사진',
    },
    {
      id: 'groom-name',
      path: 'couple.groom.name',
      type: 'text',
      required: true,
      description: '신랑 이름',
    },
    {
      id: 'bride-name',
      path: 'couple.bride.name',
      type: 'text',
      required: true,
      description: '신부 이름',
    },
    {
      id: 'wedding-date',
      path: 'wedding.date',
      type: 'date',
      required: true,
      description: '결혼 날짜',
    },
  ]

  // 기본 애니메이션 옵션
  const animations: AnimationOption[] = [
    { id: 'none', name: '없음', preset: 'none', trigger: 'mount' },
    { id: 'fade', name: '페이드 인', preset: 'fade-in', trigger: 'mount', duration: 800 },
  ]

  // 레이아웃별 추가 애니메이션
  if (imageLayout === 'fullscreen-bg') {
    animations.push({ id: 'blur', name: '블러 인', preset: 'blur-in', trigger: 'mount', duration: 800 })
  }
  if (textLayout === 'stacked-vertical') {
    animations.push({ id: 'stagger', name: '순차 등장', preset: 'stagger', trigger: 'mount', duration: 1500 })
  }

  // 구조 빌드
  let structure: SkeletonNode

  // Split 레이아웃은 특별 처리
  if (imageLayout === 'split-left') {
    structure = buildSplitLayout(composition)
  }
  // Fullscreen 배경 레이아웃
  else if (imageLayout === 'fullscreen-bg') {
    structure = buildFullscreenLayout(composition)
  }
  // 카드 레이아웃
  else if (imageLayout === 'card') {
    structure = buildCardLayout(composition)
  }
  // 기본 중앙 레이아웃 (centered, circular, polaroid)
  else {
    structure = buildCenteredLayout(composition)
  }

  return { structure, slots, animations }
}

// ============================================
// Layout-specific Builders
// ============================================

function buildCenteredLayout(composition: IntroBlockComposition): SkeletonNode {
  const { imageLayout, textStyle, decoration, colorTheme } = composition
  const colorStyles = COLOR_THEME_STYLES[colorTheme]

  const children: SkeletonNode[] = []

  // 라벨 텍스트
  if (decoration.includes('label-text')) {
    children.push(buildLabelText(colorTheme))
  }

  // 이미지
  if (imageLayout === 'centered') {
    children.push(buildCenteredImage())
  } else if (imageLayout === 'circular') {
    children.push(buildCircularImage())
  } else if (imageLayout === 'polaroid') {
    children.push(buildPolaroidImage())
  }

  // 이름
  const namesNode = buildNamesText(textStyle, colorTheme)
  if (Array.isArray(namesNode)) {
    children.push(...namesNode)
  } else {
    children.push(namesNode)
  }

  // 구분선
  if (decoration.includes('divider-line')) {
    children.push(buildDividerLine(colorTheme))
  }

  // 날짜
  children.push(buildDateText(textStyle, colorTheme))

  // 스크롤 힌트
  if (decoration.includes('scroll-hint')) {
    children.push(buildScrollHint(colorTheme))
  }

  return {
    id: 'intro-root',
    type: 'fullscreen',
    style: {
      backgroundColor: colorStyles.bg,
    },
    children: [
      {
        id: 'intro-container',
        type: 'column',
        tokenStyle: {
          padding: '$token.spacing.section',
          gap: '$token.spacing.lg',
        },
        style: {
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        },
        children,
      },
    ],
  }
}

function buildFullscreenLayout(composition: IntroBlockComposition): SkeletonNode {
  const { textLayout, textStyle, decoration, colorTheme } = composition
  const colorStyles = COLOR_THEME_STYLES[colorTheme]

  const textChildren: SkeletonNode[] = []

  // 라벨 텍스트
  if (decoration.includes('label-text')) {
    textChildren.push(buildLabelText(colorTheme))
  }

  // 이름 (stacked 여부에 따라)
  const isStacked = textLayout === 'stacked-vertical'
  const namesNode = buildNamesText(textStyle, colorTheme, isStacked)
  if (Array.isArray(namesNode)) {
    textChildren.push(...namesNode)
  } else {
    textChildren.push(namesNode)
  }

  // 구분선
  if (decoration.includes('divider-line')) {
    textChildren.push(buildDividerLine(colorTheme))
  }

  // 날짜
  textChildren.push(buildDateText(textStyle, colorTheme))

  // 오버레이 여부
  const hasOverlay = colorTheme === 'overlay'

  const contentNode: SkeletonNode = {
    id: 'intro-content',
    type: 'column',
    tokenStyle: {
      padding: '$token.spacing.section',
      gap: '$token.spacing.md',
    },
    style: {
      alignItems: 'center',
      justifyContent: textLayout === 'bottom-overlay' ? 'flex-end' : 'center',
      height: '100%',
      ...(textLayout === 'bottom-overlay' && { paddingBottom: '60px' }),
      position: 'relative',
      zIndex: 1,
    },
    children: textChildren,
  }

  const rootChildren: SkeletonNode[] = [buildFullscreenBgImage()]

  if (hasOverlay) {
    rootChildren.push({
      id: 'intro-overlay',
      type: 'overlay',
      style: {
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
      },
      children: [contentNode],
    })
  } else {
    rootChildren.push(contentNode)
  }

  return {
    id: 'intro-root',
    type: 'fullscreen',
    style: {
      backgroundColor: colorStyles.bg,
    },
    children: rootChildren,
  }
}

function buildSplitLayout(composition: IntroBlockComposition): SkeletonNode {
  const { textStyle, decoration, colorTheme } = composition

  const textChildren: SkeletonNode[] = []

  // 라벨 텍스트
  if (decoration.includes('label-text')) {
    textChildren.push(buildLabelText(colorTheme))
  }

  // 이름 (분리)
  textChildren.push({
    id: 'intro-names',
    type: 'column',
    tokenStyle: {
      gap: '$token.spacing.xs',
    },
    children: [
      {
        id: 'intro-groom',
        type: 'text',
        tokenStyle: {
          fontFamily: '$token.typography.displayMd.fontFamily',
          fontSize: '$token.typography.displayMd.fontSize',
          fontWeight: '$token.typography.displayMd.fontWeight',
          color: '$token.colors.text.primary',
        },
        props: {
          content: '{{couple.groom.name}}',
          as: 'h1',
        },
      },
      {
        id: 'intro-bride',
        type: 'text',
        tokenStyle: {
          fontFamily: '$token.typography.displayMd.fontFamily',
          fontSize: '$token.typography.displayMd.fontSize',
          fontWeight: '$token.typography.displayMd.fontWeight',
          color: '$token.colors.text.primary',
        },
        props: {
          content: '{{couple.bride.name}}',
          as: 'h1',
        },
      },
    ],
  })

  // 구분선
  if (decoration.includes('divider-line')) {
    textChildren.push(buildDividerLine(colorTheme))
  }

  // 날짜
  textChildren.push(buildDateText(textStyle, colorTheme))

  return {
    id: 'intro-root',
    type: 'fullscreen',
    tokenStyle: {
      backgroundColor: '$token.colors.background',
    },
    children: [
      {
        id: 'intro-split-container',
        type: 'row',
        style: {
          height: '100%',
        },
        children: [
          buildSplitLeftImage(),
          {
            id: 'intro-text-half',
            type: 'column',
            tokenStyle: {
              backgroundColor: '$token.colors.surface',
              padding: '$token.spacing.lg',
            },
            style: {
              width: '50%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            },
            children: [
              {
                id: 'intro-text-group',
                type: 'column',
                tokenStyle: {
                  gap: '$token.spacing.md',
                },
                style: {
                  alignItems: 'flex-start',
                },
                children: textChildren,
              },
            ],
          },
        ],
      },
    ],
  }
}

function buildCardLayout(composition: IntroBlockComposition): SkeletonNode {
  const { textStyle, decoration, colorTheme } = composition
  const colorStyles = COLOR_THEME_STYLES[colorTheme]

  const cardChildren: SkeletonNode[] = []

  // 라벨
  if (decoration.includes('label-text')) {
    cardChildren.push(buildLabelText(colorTheme))
  }

  // 이미지
  cardChildren.push(buildCardImage())

  // 이름
  const namesNode = buildNamesText(textStyle, colorTheme)
  if (Array.isArray(namesNode)) {
    cardChildren.push(...namesNode)
  } else {
    cardChildren.push(namesNode)
  }

  // 구분선
  if (decoration.includes('divider-line')) {
    cardChildren.push(buildDividerLine(colorTheme))
  }

  // 날짜
  cardChildren.push(buildDateText(textStyle, colorTheme))

  const outerChildren: SkeletonNode[] = [
    {
      id: 'intro-floating-card',
      type: 'container',
      tokenStyle: {
        backgroundColor: '$token.colors.surface',
        borderRadius: '$token.borders.radiusLg',
        boxShadow: '$token.shadows.lg',
      },
      style: {
        padding: '32px 24px',
        maxWidth: '300px',
        width: '100%',
      },
      children: [
        {
          id: 'intro-card-content',
          type: 'column',
          tokenStyle: {
            gap: '$token.spacing.lg',
          },
          style: {
            alignItems: 'center',
          },
          children: cardChildren,
        },
      ],
    },
  ]

  // 스크롤 힌트
  if (decoration.includes('scroll-hint')) {
    outerChildren.push(buildScrollHint(colorTheme))
  }

  return {
    id: 'intro-root',
    type: 'fullscreen',
    style: {
      backgroundColor: colorStyles.bg,
    },
    children: [
      {
        id: 'intro-container',
        type: 'column',
        style: {
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '60px 24px',
        },
        children: outerChildren,
      },
    ],
  }
}
