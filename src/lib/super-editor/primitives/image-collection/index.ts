/**
 * Super Editor - Image Collection Primitives
 */

export { Gallery, galleryRenderer } from './Gallery'
export { Carousel, carouselRenderer } from './Carousel'
export { Grid, gridRenderer } from './Grid'
export { Collage, collageRenderer } from './Collage'
export { Masonry, masonryRenderer } from './Masonry'
export { VinylSelector, vinylSelectorRenderer } from './VinylSelector'
export { FilmStrip, filmStripRenderer } from './FilmStrip'
export { AccordionStack, accordionStackRenderer } from './AccordionStack'
export { Polaroid, polaroidRenderer } from './Polaroid'
export { Magazine, magazineRenderer } from './Magazine'
export { SplitScroll, splitScrollRenderer } from './SplitScroll'
export { FlipCards, flipCardsRenderer } from './FlipCards'
export { ParallaxStack, parallaxStackRenderer } from './ParallaxStack'

import { galleryRenderer } from './Gallery'
import { carouselRenderer } from './Carousel'
import { gridRenderer } from './Grid'
import { collageRenderer } from './Collage'
import { masonryRenderer } from './Masonry'
import { vinylSelectorRenderer } from './VinylSelector'
import { filmStripRenderer } from './FilmStrip'
import { accordionStackRenderer } from './AccordionStack'
import { polaroidRenderer } from './Polaroid'
import { magazineRenderer } from './Magazine'
import { splitScrollRenderer } from './SplitScroll'
import { flipCardsRenderer } from './FlipCards'
import { parallaxStackRenderer } from './ParallaxStack'

export const imageCollectionRenderers = {
  gallery: galleryRenderer,
  carousel: carouselRenderer,
  grid: gridRenderer,
  collage: collageRenderer,
  masonry: masonryRenderer,
  'vinyl-selector': vinylSelectorRenderer,
  'film-strip': filmStripRenderer,
  'accordion-stack': accordionStackRenderer,
  polaroid: polaroidRenderer,
  magazine: magazineRenderer,
  'split-scroll': splitScrollRenderer,
  'flip-cards': flipCardsRenderer,
  'parallax-stack': parallaxStackRenderer,
}
