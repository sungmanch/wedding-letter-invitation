'use client'

import { S1Transition } from './sections/S1Transition'
import { S2ThemeShowcase } from './sections/S2ThemeShowcase'
import { S3FeaturesBento } from './sections/S3FeaturesBento'
import { S4AIDemo } from './sections/S4AIDemo'
import { S5Pricing } from './sections/S5Pricing'
import { S6FloatingCTA } from './sections/S6FloatingCTA'
import { AudioController } from './AudioController'

export function ScrollytellingLanding() {
  return (
    <div className="relative bg-[#0A0806]">
      {/* Stage 1: Hero Video + Dim + Question */}
      <S1Transition />

      {/* Stage 2: Sticky Theme Showcase */}
      <S2ThemeShowcase />

      {/* Stage 3: Features Bento Grid */}
      <S3FeaturesBento />

      {/* Stage 4: AI Demo */}
      <S4AIDemo />

      {/* Stage 5: Pricing */}
      <S5Pricing />

      {/* Stage 6: Floating CTA (fixed position) */}
      <S6FloatingCTA />

      {/* Background Music Controller */}
      <AudioController />
    </div>
  )
}
