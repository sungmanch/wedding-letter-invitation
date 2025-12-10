/**
 * Super Editor - Interactive Primitives
 * 사용자 상호작용이 있는 컴포넌트
 */

export { PhotoBooth, photoBoothRenderer } from './PhotoBooth'
export { Envelope, envelopeRenderer } from './Envelope'

import { photoBoothRenderer } from './PhotoBooth'
import { envelopeRenderer } from './Envelope'
import type { PrimitiveRenderer } from '../types'

export const interactiveRenderers: Record<string, PrimitiveRenderer<unknown>> = {
  photobooth: photoBoothRenderer,
  envelope: envelopeRenderer,
}
