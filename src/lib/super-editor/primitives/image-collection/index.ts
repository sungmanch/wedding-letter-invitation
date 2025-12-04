/**
 * Super Editor - Image Collection Primitives
 */

export { Gallery, galleryRenderer } from './Gallery'
export { Carousel, carouselRenderer } from './Carousel'
export { Grid, gridRenderer } from './Grid'
export { Collage, collageRenderer } from './Collage'
export { Masonry, masonryRenderer } from './Masonry'
export { VinylSelector, vinylSelectorRenderer } from './VinylSelector'

import { galleryRenderer } from './Gallery'
import { carouselRenderer } from './Carousel'
import { gridRenderer } from './Grid'
import { collageRenderer } from './Collage'
import { masonryRenderer } from './Masonry'
import { vinylSelectorRenderer } from './VinylSelector'

export const imageCollectionRenderers = {
  gallery: galleryRenderer,
  carousel: carouselRenderer,
  grid: gridRenderer,
  collage: collageRenderer,
  masonry: masonryRenderer,
  'vinyl-selector': vinylSelectorRenderer,
}
