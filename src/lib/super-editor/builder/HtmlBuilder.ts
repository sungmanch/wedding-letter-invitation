/**
 * Super Editor - HTML Builder
 * Primitives → 정적 HTML 빌드
 */

import type { PrimitiveNode, CSSProperties } from '../schema/primitives'
import type { LayoutSchema } from '../schema/layout'
import type { StyleSchema } from '../schema/style'
import type { UserData } from '../schema/user-data'
import { getAnimationPreset } from '../animations/presets'
import { getTransitionPreset } from '../animations/transitions'
import { getScrollPreset, type ScrollKeyframe } from '../animations/scroll-presets'
import { getBgmById } from '../audio/bgm-presets'
import { resolveTokens } from '../tokens/resolver'
import { generateCssVariables } from '../tokens/css-generator'

// ============================================
// Build Context
// ============================================

interface ScrollTriggerConfig {
  elementId: string
  keyframes: ScrollKeyframe[]
  scrub: boolean
}

interface BgmConfig {
  elementId: string
  src: string
  volume: number
  fadeIn: number
  loop: boolean
  syncWithScroll?: {
    enabled: boolean
    startVolume: number
    endVolume: number
  }
}

interface BuildContext {
  data: Record<string, unknown>
  styles: Map<string, string>
  animations: Set<string>
  assets: Map<string, string>
  idCounter: number
  scrollTriggers: ScrollTriggerConfig[]
  bgmConfigs: BgmConfig[]
}

function createBuildContext(data: Record<string, unknown>): BuildContext {
  return {
    data,
    styles: new Map(),
    animations: new Set(),
    assets: new Map(),
    idCounter: 0,
    scrollTriggers: [],
    bgmConfigs: [],
  }
}

// ============================================
// Data Binding
// ============================================

function resolveBinding(value: string, data: Record<string, unknown>): string {
  if (!value.includes('{{')) return value

  return value.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const trimmedPath = path.trim()
    const resolved = getByPath(data, trimmedPath)
    return resolved !== undefined ? String(resolved) : ''
  })
}

function getByPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }

  return current
}

// ============================================
// CSS Helpers
// ============================================

function toCssString(styles: CSSProperties | undefined): string {
  if (!styles) return ''

  const unitlessProps = [
    'opacity',
    'z-index',
    'flex',
    'flex-grow',
    'flex-shrink',
    'order',
    'line-height',
    'font-weight',
    'columns',
    'column-count',
    'fill-opacity',
    'stroke-opacity',
    'stroke-width',
  ]

  return Object.entries(styles)
    .map(([key, value]) => {
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      const cssValue =
        typeof value === 'number' && !unitlessProps.includes(kebabKey)
          ? `${value}px`
          : value
      return `${kebabKey}: ${cssValue}`
    })
    .join('; ')
}

function generateClassName(ctx: BuildContext): string {
  return `se-${++ctx.idCounter}`
}

// ============================================
// Node Builders
// ============================================

function buildNode(node: PrimitiveNode, ctx: BuildContext): string {
  switch (node.type) {
    // Layout
    case 'container':
      return buildContainer(node, ctx)
    case 'row':
      return buildRow(node, ctx)
    case 'column':
      return buildColumn(node, ctx)
    case 'scroll-container':
      return buildScrollContainer(node, ctx)
    case 'overlay':
      return buildOverlay(node, ctx)
    case 'fullscreen':
      return buildFullscreen(node, ctx)

    // Content
    case 'text':
      return buildText(node, ctx)
    case 'image':
      return buildImage(node, ctx)
    case 'video':
      return buildVideo(node, ctx)
    case 'avatar':
      return buildAvatar(node, ctx)
    case 'button':
      return buildButton(node, ctx)
    case 'spacer':
      return buildSpacer(node, ctx)
    case 'divider':
      return buildDivider(node, ctx)
    case 'map-embed':
      return buildMapEmbed(node, ctx)

    // Image Collection
    case 'gallery':
    case 'carousel':
    case 'grid':
    case 'collage':
    case 'masonry':
    case 'vinyl-selector':
      return buildImageCollection(node, ctx)

    // Animation
    case 'animated':
      return buildAnimated(node, ctx)
    case 'sequence':
    case 'parallel':
      return buildAnimationWrapper(node, ctx)
    case 'scroll-trigger':
      return buildScrollTrigger(node, ctx)

    // Audio
    case 'bgm-player':
      return buildBgmPlayer(node, ctx)

    // Logic
    case 'conditional':
      return buildConditional(node, ctx)
    case 'repeat':
      return buildRepeat(node, ctx)

    default:
      return buildChildren(node, ctx)
  }
}

function buildChildren(node: PrimitiveNode, ctx: BuildContext): string {
  if (!node.children) return ''
  return node.children.map((child) => buildNode(child, ctx)).join('')
}

// Layout Builders
function buildContainer(node: PrimitiveNode, ctx: BuildContext): string {
  const style = toCssString(node.style)
  const children = buildChildren(node, ctx)
  return `<div style="${style}">${children}</div>`
}

function buildRow(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const baseStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: props.gap as string,
    alignItems: props.align === 'start' ? 'flex-start' : props.align === 'end' ? 'flex-end' : props.align,
    justifyContent: props.justify === 'start' ? 'flex-start' : props.justify === 'end' ? 'flex-end' : props.justify === 'between' ? 'space-between' : props.justify,
    flexWrap: props.wrap ? 'wrap' : undefined,
    ...node.style,
  }
  const style = toCssString(baseStyle as CSSProperties)
  return `<div style="${style}">${buildChildren(node, ctx)}</div>`
}

function buildColumn(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: props.gap as string,
    alignItems: props.align === 'start' ? 'flex-start' : props.align === 'end' ? 'flex-end' : props.align,
    justifyContent: props.justify === 'start' ? 'flex-start' : props.justify === 'end' ? 'flex-end' : props.justify === 'between' ? 'space-between' : props.justify,
    ...node.style,
  }
  const style = toCssString(baseStyle as CSSProperties)
  return `<div style="${style}">${buildChildren(node, ctx)}</div>`
}

function buildScrollContainer(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const direction = props.direction || 'vertical'
  const baseStyle = {
    overflowX: direction === 'horizontal' || direction === 'both' ? 'auto' : 'hidden',
    overflowY: direction === 'vertical' || direction === 'both' ? 'auto' : 'hidden',
    WebkitOverflowScrolling: 'touch',
    ...node.style,
  }
  const style = toCssString(baseStyle as CSSProperties)
  return `<div style="${style}">${buildChildren(node, ctx)}</div>`
}

function buildOverlay(node: PrimitiveNode, ctx: BuildContext): string {
  const baseStyle = {
    position: 'absolute',
    zIndex: 10,
    ...node.style,
  }
  const style = toCssString(baseStyle as CSSProperties)
  return `<div style="${style}">${buildChildren(node, ctx)}</div>`
}

function buildFullscreen(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const minHeight = typeof props.minHeight === 'string' || typeof props.minHeight === 'number'
    ? props.minHeight
    : '100vh'
  const baseStyle = {
    width: '100%',
    minHeight,
    position: 'relative' as const,
    ...node.style,
  }
  const style = toCssString(baseStyle as CSSProperties)
  return `<div style="${style}">${buildChildren(node, ctx)}</div>`
}

// Content Builders
function buildText(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const tag = (props.as as string) || 'p'
  const content = resolveBinding((props.content as string) || '', ctx.data)
  const style = toCssString(node.style)

  if (props.html) {
    return `<${tag} style="${style}">${content}</${tag}>`
  }
  return `<${tag} style="${style}">${escapeHtml(content)}</${tag}>`
}

function buildImage(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const src = resolveBinding((props.src as string) || '', ctx.data)
  const alt = resolveBinding((props.alt as string) || '', ctx.data)
  const style = toCssString({
    width: '100%',
    objectFit: (props.objectFit as string) || 'cover',
    ...node.style,
  } as CSSProperties)

  return `<img src="${src}" alt="${escapeHtml(alt)}" style="${style}" loading="lazy" />`
}

function buildVideo(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const src = resolveBinding((props.src as string) || '', ctx.data)
  const attrs = [
    props.autoplay ? 'autoplay' : '',
    props.muted || props.autoplay ? 'muted' : '',
    props.loop ? 'loop' : '',
    props.controls ? 'controls' : '',
    'playsinline',
  ].filter(Boolean).join(' ')

  const style = toCssString({
    width: '100%',
    objectFit: (props.objectFit as string) || 'cover',
    ...node.style,
  } as CSSProperties)

  return `<video src="${src}" ${attrs} style="${style}"></video>`
}

function buildAvatar(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const src = resolveBinding((props.src as string) || '', ctx.data)
  const alt = resolveBinding((props.alt as string) || '', ctx.data)
  const size = typeof props.size === 'number' ? props.size : { sm: 32, md: 48, lg: 64, xl: 96 }[(props.size as string) || 'md']
  const shape = props.shape || 'circle'

  const style = toCssString({
    width: size,
    height: size,
    borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '8px' : '0',
    objectFit: 'cover',
    ...node.style,
  } as CSSProperties)

  return `<img src="${src}" alt="${escapeHtml(alt)}" style="${style}" />`
}

function buildButton(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const label = resolveBinding((props.label as string) || '', ctx.data)
  const action = props.action as Record<string, unknown> | undefined

  let onclick = ''
  if (action) {
    switch (action.type) {
      case 'link':
        onclick = `window.open('${action.url}', '${action.target || '_self'}')`
        break
      case 'call':
        onclick = `window.location.href='tel:${action.phone}'`
        break
      case 'copy':
        onclick = `navigator.clipboard.writeText('${action.value}');alert('${action.toast || '복사되었습니다'}')`
        break
      case 'scroll':
        onclick = `document.getElementById('${action.target}')?.scrollIntoView({behavior:'smooth'})`
        break
    }
  }

  const style = toCssString({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    border: 'none',
    ...node.style,
  } as CSSProperties)

  return `<button style="${style}" onclick="${onclick}">${escapeHtml(label)}</button>`
}

function buildSpacer(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const height = typeof props.height === 'number' || typeof props.height === 'string' ? props.height : 16
  const width = typeof props.width === 'number' || typeof props.width === 'string' ? props.width : undefined
  const style = toCssString({
    height,
    ...(width !== undefined ? { width } : {}),
    flexShrink: 0,
    ...node.style,
  } as CSSProperties)

  return `<div style="${style}"></div>`
}

function buildDivider(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const isHorizontal = props.orientation !== 'vertical'
  const thickness = (props.thickness as number) || 1
  const variant = (props.variant as string) || 'solid'
  const color = (props.color as string) || '#e5e7eb'

  const style = toCssString({
    ...(isHorizontal
      ? { width: '100%', height: 0, borderTop: `${thickness}px ${variant} ${color}` }
      : { height: '100%', width: 0, borderLeft: `${thickness}px ${variant} ${color}` }),
    ...node.style,
  } as CSSProperties)

  return `<div role="separator" style="${style}"></div>`
}

function buildMapEmbed(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const name = resolveBinding((props.name as string) || '', ctx.data)
  const address = resolveBinding((props.address as string) || '', ctx.data)
  const lat = props.lat as number
  const lng = props.lng as number
  const height = typeof props.height === 'number' || typeof props.height === 'string' ? props.height : 300

  const style = toCssString({
    width: '100%',
    height,
    borderRadius: '8px',
    overflow: 'hidden',
    ...node.style,
  } as CSSProperties)

  // 정적 지도 이미지 또는 플레이스홀더
  return `
    <div style="${style}">
      <div style="width:100%;height:calc(100% - 50px);background:#f3f4f6;display:flex;align-items:center;justify-content:center;flex-direction:column;">
        <p style="font-size:14px;color:#374151;">${escapeHtml(name)}</p>
        <p style="font-size:12px;color:#9ca3af;">${escapeHtml(address)}</p>
      </div>
      <div style="height:50px;display:flex;align-items:center;justify-content:center;gap:8px;background:#fff;border-top:1px solid #e5e7eb;">
        <a href="https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}" target="_blank" style="padding:8px 16px;font-size:13px;background:#f3f4f6;border-radius:6px;text-decoration:none;color:#374151;">카카오맵</a>
        <a href="https://map.naver.com/v5/directions/-/-/-/transit?c=${lng},${lat}" target="_blank" style="padding:8px 16px;font-size:13px;background:#f3f4f6;border-radius:6px;text-decoration:none;color:#374151;">네이버지도</a>
      </div>
    </div>
  `
}

// Image Collection Builder (간소화)
function buildImageCollection(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  let images: string[] = []

  const imagesValue = props.images
  if (typeof imagesValue === 'string') {
    if (imagesValue.startsWith('{{')) {
      const path = imagesValue.replace(/^\{\{|\}\}$/g, '').trim()
      const resolved = getByPath(ctx.data, path)
      if (Array.isArray(resolved)) {
        images = resolved as string[]
      }
    } else {
      images = [imagesValue]
    }
  } else if (Array.isArray(imagesValue)) {
    images = imagesValue as string[]
  }

  const style = toCssString({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '4px',
    ...node.style,
  } as CSSProperties)

  const imagesHtml = images.map((src) =>
    `<img src="${src}" alt="" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:4px;" loading="lazy" />`
  ).join('')

  return `<div style="${style}">${imagesHtml}</div>`
}

// Animation Builder
function buildAnimated(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const animation = props.animation as Record<string, unknown> | undefined
  const presetName = animation?.preset as string

  if (presetName) {
    const preset = getAnimationPreset(presetName as Parameters<typeof getAnimationPreset>[0])
    if (preset) {
      const animName = `anim-${presetName}`
      ctx.animations.add(animName)

      const className = generateClassName(ctx)
      ctx.styles.set(className, `animation: ${animName} ${animation?.duration || preset.defaultDuration}ms ${preset.defaultEasing} forwards;`)

      return `<div class="${className}">${buildChildren(node, ctx)}</div>`
    }
  }

  return `<div>${buildChildren(node, ctx)}</div>`
}

function buildAnimationWrapper(node: PrimitiveNode, ctx: BuildContext): string {
  return `<div>${buildChildren(node, ctx)}</div>`
}

function buildScrollTrigger(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const animation = props.animation as Record<string, unknown> | undefined
  const presetName = animation?.preset as string
  const scrub = props.scrub !== false

  const elementId = `scroll-${++ctx.idCounter}`

  // 스크롤 프리셋 또는 일반 프리셋에서 keyframes 가져오기
  let keyframes: ScrollKeyframe[] = []

  const scrollPreset = presetName
    ? getScrollPreset(presetName as Parameters<typeof getScrollPreset>[0])
    : null

  if (scrollPreset) {
    keyframes = scrollPreset.keyframes
  } else if (presetName) {
    const animPreset = getAnimationPreset(presetName as Parameters<typeof getAnimationPreset>[0])
    if (animPreset) {
      keyframes = animPreset.keyframes.map((kf) => ({
        offset: (kf as { offset?: number }).offset ?? 0,
        opacity: kf.opacity as number | undefined,
        transform: kf.transform as string | undefined,
        filter: kf.filter as string | undefined,
        clipPath: kf.clipPath as string | undefined,
      }))
    }
  }

  // 초기 스타일 (keyframes[0])
  let initialStyles = ''
  if (keyframes.length > 0) {
    const firstFrame = keyframes[0]
    const styleProps: string[] = []
    if (firstFrame.opacity !== undefined) styleProps.push(`opacity: ${firstFrame.opacity}`)
    if (firstFrame.transform) styleProps.push(`transform: ${firstFrame.transform}`)
    if (firstFrame.filter) styleProps.push(`filter: ${firstFrame.filter}`)
    if (firstFrame.clipPath) {
      styleProps.push(`clip-path: ${firstFrame.clipPath}`)
      styleProps.push(`-webkit-clip-path: ${firstFrame.clipPath}`)
    }
    initialStyles = styleProps.join('; ')
  }

  // 컨텍스트에 스크롤 트리거 설정 추가
  if (keyframes.length > 0) {
    ctx.scrollTriggers.push({
      elementId,
      keyframes,
      scrub,
    })
  }

  const style = toCssString(node.style)
  const combinedStyle = [style, initialStyles].filter(Boolean).join('; ')

  return `<div id="${elementId}" data-scroll-trigger style="${combinedStyle}">${buildChildren(node, ctx)}</div>`
}

function buildBgmPlayer(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}

  // 오디오 소스 결정
  let audioSrc = ''
  if (props.trackId) {
    const preset = getBgmById(props.trackId as string)
    audioSrc = preset?.url || ''
  } else if (props.src) {
    audioSrc = resolveBinding(props.src as string, ctx.data)
  }

  if (!audioSrc) return ''

  const elementId = `bgm-${++ctx.idCounter}`
  const volume = (props.volume as number) ?? 0.5
  const fadeIn = (props.fadeIn as number) ?? 1000
  const loop = props.loop !== false
  const showControls = props.showControls !== false
  const controlsPosition = (props.controlsPosition as string) || 'bottom-right'
  const controlsStyle = (props.controlsStyle as string) || 'minimal'

  // 스크롤 연동 설정
  const syncWithScroll = props.syncWithScroll as Record<string, unknown> | undefined

  // 컨텍스트에 BGM 설정 추가
  ctx.bgmConfigs.push({
    elementId,
    src: audioSrc,
    volume,
    fadeIn,
    loop,
    syncWithScroll: syncWithScroll?.enabled
      ? {
          enabled: true,
          startVolume: (syncWithScroll.startVolume as number) ?? 1,
          endVolume: (syncWithScroll.endVolume as number) ?? 0.3,
        }
      : undefined,
  })

  // 컨트롤 위치 스타일
  const positionStyles: Record<string, string> = {
    'top-right': 'top:16px;right:16px',
    'top-left': 'top:16px;left:16px',
    'bottom-right': 'bottom:16px;right:16px',
    'bottom-left': 'bottom:16px;left:16px',
  }

  // 바이닐 스타일 여부
  const isVinyl = controlsStyle === 'vinyl'

  const buttonStyle = isVinyl
    ? `position:fixed;${positionStyles[controlsPosition]};z-index:9999;width:56px;height:56px;border-radius:50%;border:2px solid rgba(255,255,255,0.3);background:linear-gradient(145deg,#1a1a1a,#2d2d2d);color:#fff;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;`
    : `position:fixed;${positionStyles[controlsPosition]};z-index:9999;width:44px;height:44px;border-radius:50%;border:none;background:rgba(0,0,0,0.5);color:#fff;font-size:18px;cursor:pointer;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;`

  const buttonContent = isVinyl
    ? `<div style="width:20px;height:20px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;"><div style="width:6px;height:6px;border-radius:50%;background:#1a1a1a;"></div></div>`
    : '🔇'

  return `
    <div id="${elementId}" data-bgm-player>
      <audio id="${elementId}-audio" src="${audioSrc}" ${loop ? 'loop' : ''} preload="metadata"></audio>
      ${showControls ? `<button id="${elementId}-btn" style="${buttonStyle}" aria-label="음악 재생">${buttonContent}</button>` : ''}
    </div>
  `
}

// Logic Builders
function buildConditional(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const condition = props.condition as string
  const operator = (props.operator as string) || 'exists'
  const compareValue = props.value

  let path = condition
  if (condition.startsWith('{{') && condition.endsWith('}}')) {
    path = condition.slice(2, -2).trim()
  }

  const value = getByPath(ctx.data, path)
  let shouldRender = false

  switch (operator) {
    case 'exists':
      shouldRender = value !== undefined && value !== null && value !== ''
      break
    case 'equals':
      shouldRender = value === compareValue
      break
    case 'notEquals':
      shouldRender = value !== compareValue
      break
    default:
      shouldRender = !!value
  }

  return shouldRender ? buildChildren(node, ctx) : ''
}

function buildRepeat(node: PrimitiveNode, ctx: BuildContext): string {
  const props = node.props as Record<string, unknown> || {}
  const dataPath = props.dataPath as string
  const as = (props.as as string) || 'item'

  let path = dataPath
  if (dataPath.startsWith('{{') && dataPath.endsWith('}}')) {
    path = dataPath.slice(2, -2).trim()
  }

  const items = getByPath(ctx.data, path) as unknown[]
  if (!Array.isArray(items)) return ''

  const offset = (props.offset as number) || 0
  const limit = (props.limit as number) || items.length

  return items.slice(offset, offset + limit).map((item, index) => {
    const itemCtx: BuildContext = {
      ...ctx,
      data: {
        ...ctx.data,
        [as]: item,
        [`${as}Index`]: index,
      },
    }
    return buildChildren(node, itemCtx)
  }).join('')
}

// ============================================
// HTML Escape
// ============================================

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// ============================================
// Main Build Function
// ============================================

export interface BuildResult {
  html: string
  css: string
  js: string
  buildTime: number
  version: string
  hash: string
}

export function buildHtml(
  layout: LayoutSchema,
  style: StyleSchema,
  userData: UserData
): BuildResult {
  const startTime = Date.now()
  const ctx = createBuildContext(userData.data as Record<string, unknown>)

  // Design Tokens 해석 및 CSS Variables 생성
  const tokens = resolveTokens(style)
  const cssVariables = generateCssVariables(tokens)

  // 모든 화면 빌드
  const screensHtml = layout.screens
    .map((screen) => {
      const content = buildNode(screen.root, ctx)
      // intro 타입이면 전체화면 섹션 클래스 추가
      const sectionClass = screen.type === 'intro' ? 'fullscreen-section' : ''
      return `<section id="${screen.id}" class="${sectionClass}" data-screen-type="${screen.type}">${content}</section>`
    })
    .join('\n')

  // CSS 생성
  const customStyles = Array.from(ctx.styles.entries())
    .map(([className, style]) => `.${className} { ${style} }`)
    .join('\n')

  // 기본 CSS (모바일 최적화)
  const baseCss = `
/* Design Tokens (CSS Variables) */
${cssVariables}

/* Reset & Base */
* { box-sizing: border-box; margin: 0; padding: 0; }
html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}
body {
  font-family: var(--typo-body-font-family, "Pretendard", "Apple SD Gothic Neo", sans-serif);
  font-size: var(--typo-body-font-size, 16px);
  line-height: var(--typo-body-line-height, 1.5);
  color: var(--color-text-primary, #1F2937);
  background-color: var(--color-background, #FFFBFC);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* 모바일 컨테이너 - 최대 너비 제한 */
.mobile-container {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  overflow-x: hidden;
}

/* 전체 화면 섹션 (인트로용) */
.fullscreen-section {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 이미지 */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* 버튼 */
button {
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* 스크롤바 숨김 */
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* 텍스트 줄바꿈 */
.preserve-whitespace { white-space: pre-wrap; }

${customStyles}
  `.trim()

  // 스크롤 모션 런타임 JS
  const scrollMotionJs = ctx.scrollTriggers.length > 0 ? `
// Scroll Motion Runtime
(function() {
  var triggers = ${JSON.stringify(ctx.scrollTriggers)};

  function lerp(a, b, t) { return a + (b - a) * t; }

  function parseTransform(str) {
    if (!str) return {};
    var result = {};
    var patterns = [
      ['translateX', /translateX\\(([\\-\\d.]+)(px|%)?\\)/],
      ['translateY', /translateY\\(([\\-\\d.]+)(px|%)?\\)/],
      ['scale', /scale\\(([\\d.]+)\\)/],
      ['rotate', /rotate\\(([\\-\\d.]+)(deg)?\\)/],
      ['rotateX', /rotateX\\(([\\-\\d.]+)(deg)?\\)/],
      ['perspective', /perspective\\(([\\d.]+)(px)?\\)/]
    ];
    patterns.forEach(function(p) {
      var m = str.match(p[1]);
      if (m) result[p[0]] = { value: parseFloat(m[1]), unit: m[2] || '' };
    });
    return result;
  }

  function interpolateTransform(from, to, t) {
    var fromT = parseTransform(from);
    var toT = parseTransform(to);
    var result = [];
    var keys = Object.keys(Object.assign({}, fromT, toT));
    keys.forEach(function(k) {
      var f = fromT[k] || { value: k === 'scale' ? 1 : 0, unit: '' };
      var e = toT[k] || { value: k === 'scale' ? 1 : 0, unit: '' };
      var v = lerp(f.value, e.value, t);
      if (k === 'scale') result.push(k + '(' + v + ')');
      else result.push(k + '(' + v + (f.unit || e.unit || 'px') + ')');
    });
    return result.join(' ');
  }

  function parseFilter(str) {
    if (!str) return {};
    var result = {};
    var m = str.match(/blur\\(([\\d.]+)(px)?\\)/);
    if (m) result.blur = { value: parseFloat(m[1]), unit: m[2] || 'px' };
    return result;
  }

  function interpolateFilter(from, to, t) {
    var fromF = parseFilter(from);
    var toF = parseFilter(to);
    if (fromF.blur || toF.blur) {
      var f = (fromF.blur || { value: 0 }).value;
      var e = (toF.blur || { value: 0 }).value;
      return 'blur(' + lerp(f, e, t) + 'px)';
    }
    return '';
  }

  function parseClipPath(str) {
    if (!str) return null;
    var inset = str.match(/inset\\(([\\d.]+)%?\\s+([\\d.]+)%?\\s+([\\d.]+)%?\\s+([\\d.]+)%?\\)/);
    if (inset) return { type: 'inset', values: [parseFloat(inset[1]), parseFloat(inset[2]), parseFloat(inset[3]), parseFloat(inset[4])] };
    var circle = str.match(/circle\\(([\\d.]+)%\\s+at\\s+([\\d.]+)%\\s+([\\d.]+)%\\)/);
    if (circle) return { type: 'circle', values: [parseFloat(circle[1]), parseFloat(circle[2]), parseFloat(circle[3])] };
    return null;
  }

  function interpolateClipPath(from, to, t) {
    var fromC = parseClipPath(from);
    var toC = parseClipPath(to);
    if (!fromC || !toC || fromC.type !== toC.type) return t > 0.5 ? to : from;
    if (fromC.type === 'inset') {
      var vals = fromC.values.map(function(v, i) { return lerp(v, toC.values[i], t); });
      return 'inset(' + vals.join('% ') + '%)';
    }
    if (fromC.type === 'circle') {
      return 'circle(' + lerp(fromC.values[0], toC.values[0], t) + '% at ' + lerp(fromC.values[1], toC.values[1], t) + '% ' + lerp(fromC.values[2], toC.values[2], t) + '%)';
    }
    return from;
  }

  function applyStyle(el, from, to, t) {
    if (from.opacity !== undefined || to.opacity !== undefined) {
      el.style.opacity = lerp(from.opacity !== undefined ? from.opacity : 1, to.opacity !== undefined ? to.opacity : 1, t);
    }
    if (from.transform || to.transform) {
      el.style.transform = interpolateTransform(from.transform, to.transform, t);
    }
    if (from.filter || to.filter) {
      el.style.filter = interpolateFilter(from.filter, to.filter, t);
    }
    if (from.clipPath || to.clipPath) {
      var cp = interpolateClipPath(from.clipPath, to.clipPath, t);
      el.style.clipPath = cp;
      el.style.webkitClipPath = cp;
    }
  }

  function initScrollTriggers() {
    triggers.forEach(function(cfg) {
      var el = document.getElementById(cfg.elementId);
      if (!el || cfg.keyframes.length < 2) return;

      var from = cfg.keyframes[0];
      var to = cfg.keyframes[cfg.keyframes.length - 1];

      if (cfg.scrub) {
        // Scrub 모드: 스크롤 연동
        var ticking = false;
        window.addEventListener('scroll', function() {
          if (!ticking) {
            requestAnimationFrame(function() {
              var rect = el.getBoundingClientRect();
              var wh = window.innerHeight;
              var progress = Math.max(0, Math.min(1, (wh - rect.top) / (wh + rect.height)));
              applyStyle(el, from, to, progress);
              ticking = false;
            });
            ticking = true;
          }
        }, { passive: true });
        // 초기 상태
        applyStyle(el, from, to, 0);
      } else {
        // 일반 모드: IntersectionObserver
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              el.style.transition = 'all 0.6s ease-out';
              applyStyle(el, to, to, 1);
              observer.unobserve(el);
            }
          });
        }, { threshold: 0.1 });
        observer.observe(el);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initScrollTriggers);
})();
  ` : ''

  // BGM 런타임 JS
  const bgmJs = ctx.bgmConfigs.length > 0 ? `
// BGM Runtime
(function() {
  var configs = ${JSON.stringify(ctx.bgmConfigs)};
  var hasInteracted = false;

  function fadeVolume(audio, target, duration, onComplete) {
    var start = audio.volume;
    var startTime = performance.now();
    function animate(time) {
      var elapsed = time - startTime;
      var progress = Math.min(elapsed / duration, 1);
      audio.volume = start + (target - start) * progress;
      if (progress < 1) requestAnimationFrame(animate);
      else if (onComplete) onComplete();
    }
    requestAnimationFrame(animate);
  }

  function initBgm() {
    configs.forEach(function(cfg) {
      var audio = document.getElementById(cfg.elementId + '-audio');
      var btn = document.getElementById(cfg.elementId + '-btn');
      if (!audio) return;

      var isPlaying = false;

      function play() {
        audio.volume = 0;
        audio.play().then(function() {
          isPlaying = true;
          fadeVolume(audio, cfg.volume, cfg.fadeIn);
          if (btn) btn.innerHTML = '🔊';
        }).catch(function() {});
      }

      function pause() {
        fadeVolume(audio, 0, 300, function() {
          audio.pause();
          isPlaying = false;
          if (btn) btn.innerHTML = '🔇';
        });
      }

      // 첫 인터랙션 후 자동 재생
      function onInteraction() {
        if (hasInteracted) return;
        hasInteracted = true;
        play();
      }
      document.addEventListener('touchstart', onInteraction, { once: true });
      document.addEventListener('click', onInteraction, { once: true });

      // 컨트롤 버튼
      if (btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (isPlaying) pause();
          else play();
        });
      }

      // 스크롤 연동 볼륨
      if (cfg.syncWithScroll && cfg.syncWithScroll.enabled) {
        window.addEventListener('scroll', function() {
          if (!isPlaying) return;
          var scrollH = document.documentElement.scrollHeight - window.innerHeight;
          var progress = scrollH > 0 ? window.scrollY / scrollH : 0;
          var vol = cfg.syncWithScroll.startVolume + (cfg.syncWithScroll.endVolume - cfg.syncWithScroll.startVolume) * progress;
          audio.volume = Math.max(0, Math.min(1, vol * cfg.volume));
        }, { passive: true });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initBgm);
})();
  ` : ''

  // 기본 JS
  const baseJs = `
document.addEventListener('DOMContentLoaded', function() {
  // 이미지 지연 로딩
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  }
});
${scrollMotionJs}
${bgmJs}
  `.trim()

  // 최종 HTML (모바일 최적화)
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="format-detection" content="telephone=no">
  <meta name="theme-color" content="${style.theme?.colors?.background?.default || '#FFFBFC'}">
  <title>${layout.meta?.name || '청첩장'}</title>
  <link rel="preconnect" href="https://cdn.jsdelivr.net">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet">
  <style>${baseCss}</style>
</head>
<body>
  <div class="mobile-container">
${screensHtml}
  </div>
<script>${baseJs}</script>
</body>
</html>
  `.trim()

  const buildTime = Date.now() - startTime
  const hash = simpleHash(html)

  return {
    html,
    css: baseCss,
    js: baseJs,
    buildTime,
    version: '1.0',
    hash,
  }
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}
