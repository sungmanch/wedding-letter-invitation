/**
 * Intro Builders Index
 * PrimitiveNode 기반 인트로 빌더 모음
 */

export * from './types'
export * from './to-screen'

// Individual builders
export { buildCinematicIntro } from './cinematic'
export { buildKeynoteIntro } from './keynote'
export { buildExhibitionIntro } from './exhibition'
export { buildMagazineIntro } from './magazine'
export { buildVinylIntro } from './vinyl'
export { buildChatIntro } from './chat'
export { buildGlassmorphismIntro } from './glassmorphism'
export { buildPassportIntro } from './passport'
export { buildPixelIntro } from './pixel'
export { buildTypographyIntro } from './typography'

import type { IntroBuilder, IntroBuilderContext, IntroBuilderResult, IntroBuilderData } from './types'
import type { LegacyIntroType } from '../types'
import { resetIdCounter } from './types'

import { buildCinematicIntro } from './cinematic'
import { buildKeynoteIntro } from './keynote'
import { buildExhibitionIntro } from './exhibition'
import { buildMagazineIntro } from './magazine'
import { buildVinylIntro } from './vinyl'
import { buildChatIntro } from './chat'
import { buildGlassmorphismIntro } from './glassmorphism'
import { buildPassportIntro } from './passport'
import { buildPixelIntro } from './pixel'
import { buildTypographyIntro } from './typography'

// ============================================
// Builder Registry
// ============================================

export const introBuilders: Record<LegacyIntroType, IntroBuilder> = {
  cinematic: buildCinematicIntro,
  keynote: buildKeynoteIntro,
  exhibition: buildExhibitionIntro,
  magazine: buildMagazineIntro,
  vinyl: buildVinylIntro,
  chat: buildChatIntro,
  glassmorphism: buildGlassmorphismIntro,
  passport: buildPassportIntro,
  pixel: buildPixelIntro,
  typography: buildTypographyIntro,
}

// ============================================
// Main Build Function
// ============================================

/**
 * 인트로 타입에 따라 PrimitiveNode 트리 생성
 */
export function buildIntro(ctx: IntroBuilderContext): IntroBuilderResult {
  const introType = ctx.preset.intro.type as LegacyIntroType
  const builder = introBuilders[introType]

  if (!builder) {
    console.warn(`Unknown intro type: ${introType}, falling back to keynote`)
    return buildKeynoteIntro(ctx)
  }

  // ID 카운터 리셋 (빌드마다 깨끗한 상태로 시작)
  resetIdCounter()

  return builder(ctx)
}

/**
 * 프리셋과 데이터로 인트로 빌드
 */
export function buildIntroFromPreset(
  preset: IntroBuilderContext['preset'],
  data: IntroBuilderData
): IntroBuilderResult {
  return buildIntro({ preset, data })
}

// ============================================
// Collect All Additional Styles
// ============================================

/**
 * 모든 인트로 타입의 추가 스타일 수집
 * CSS 애니메이션을 페이지에 주입하기 위해 사용
 */
export function collectAllIntroStyles(): string {
  return `
/* ========================================== */
/* Cinematic Intro Styles */
/* ========================================== */
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

/* ========================================== */
/* Vinyl Intro Styles */
/* ========================================== */
@keyframes vinylSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.vinyl-spinning {
  animation: vinylSpin 3s linear infinite;
}

/* ========================================== */
/* Glassmorphism Intro Styles */
/* ========================================== */
@keyframes glassFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.glass-float {
  animation: glassFloat 3s ease-in-out infinite;
}

.glass-float-delayed {
  animation: glassFloat 3s ease-in-out infinite;
  animation-delay: 1.5s;
}

/* ========================================== */
/* Pixel Intro Styles */
/* ========================================== */
@keyframes pixelBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.pixel-blink {
  animation: pixelBlink 1s steps(1) infinite;
}
`
}
