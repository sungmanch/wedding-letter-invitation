/**
 * Super Editor - Layout Primitives
 */

export { Container, containerRenderer } from './Container'
export { Row, rowRenderer } from './Row'
export { Column, columnRenderer } from './Column'
export { ScrollContainer, scrollContainerRenderer } from './ScrollContainer'
export { Overlay, overlayRenderer } from './Overlay'
export { Fullscreen, fullscreenRenderer } from './Fullscreen'

import { containerRenderer } from './Container'
import { rowRenderer } from './Row'
import { columnRenderer } from './Column'
import { scrollContainerRenderer } from './ScrollContainer'
import { overlayRenderer } from './Overlay'
import { fullscreenRenderer } from './Fullscreen'

export const layoutRenderers = {
  container: containerRenderer,
  row: rowRenderer,
  column: columnRenderer,
  'scroll-container': scrollContainerRenderer,
  overlay: overlayRenderer,
  fullscreen: fullscreenRenderer,
}
