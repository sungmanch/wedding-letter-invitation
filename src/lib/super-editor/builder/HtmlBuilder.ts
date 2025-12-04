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

// ============================================
// Build Context
// ============================================

interface BuildContext {
  data: Record<string, unknown>
  styles: Map<string, string>
  animations: Set<string>
  assets: Map<string, string>
  idCounter: number
}

function createBuildContext(data: Record<string, unknown>): BuildContext {
  return {
    data,
    styles: new Map(),
    animations: new Set(),
    assets: new Map(),
    idCounter: 0,
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
/* Reset & Base */
* { box-sizing: border-box; margin: 0; padding: 0; }
html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}
body {
  font-family: ${style.theme?.typography?.fonts?.body?.family || '"Pretendard", "Apple SD Gothic Neo", sans-serif'};
  line-height: 1.5;
  color: ${style.theme?.colors?.text?.primary || '#1F2937'};
  background-color: ${style.theme?.colors?.background?.default || '#FFFBFC'};
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
