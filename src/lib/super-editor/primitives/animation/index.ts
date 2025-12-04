/**
 * Super Editor - Animation Primitives
 */

export { Animated, animatedRenderer } from './Animated'
export { Sequence, sequenceRenderer } from './Sequence'
export { Parallel, parallelRenderer } from './Parallel'
export { ScrollTrigger, scrollTriggerRenderer } from './ScrollTrigger'
export { Transition, transitionRenderer } from './Transition'

import { animatedRenderer } from './Animated'
import { sequenceRenderer } from './Sequence'
import { parallelRenderer } from './Parallel'
import { scrollTriggerRenderer } from './ScrollTrigger'
import { transitionRenderer } from './Transition'

export const animationRenderers = {
  animated: animatedRenderer,
  sequence: sequenceRenderer,
  parallel: parallelRenderer,
  'scroll-trigger': scrollTriggerRenderer,
  transition: transitionRenderer,
}
