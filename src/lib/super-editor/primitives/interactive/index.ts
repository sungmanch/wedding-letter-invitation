/**
 * Super Editor - Interactive Primitives
 * 사용자 상호작용이 있는 컴포넌트
 */

export { PhotoBooth, photoBoothRenderer } from './PhotoBooth'

import { photoBoothRenderer } from './PhotoBooth'
import type { PrimitiveRenderer } from '../types'

export const interactiveRenderers: Record<string, PrimitiveRenderer<unknown>> = {
  photobooth: photoBoothRenderer,
}
