import type { IntroConfig, ColorPalette, FontSet } from '@/lib/themes/schema'

export interface IntroProps {
  config: IntroConfig
  colors: ColorPalette
  fonts: FontSet
  groomName: string
  brideName: string
  weddingDate: string
  images?: string[]
  onComplete: () => void
  onSkip: () => void
}

export interface IntroState {
  phase: 'loading' | 'playing' | 'ready' | 'completed'
  canSkip: boolean
  progress: number
}
