/**
 * Super Editor - Content Primitives
 */

export { Text, textRenderer } from './Text'
export { Image, imageRenderer } from './Image'
export { Video, videoRenderer } from './Video'
export { Avatar, avatarRenderer } from './Avatar'
export { Button, buttonRenderer } from './Button'
export { Spacer, spacerRenderer } from './Spacer'
export { Divider, dividerRenderer } from './Divider'
export { Input, inputRenderer } from './Input'
export { MapEmbed, mapEmbedRenderer } from './MapEmbed'
export { Calendar, calendarRenderer } from './Calendar'

import { textRenderer } from './Text'
import { imageRenderer } from './Image'
import { videoRenderer } from './Video'
import { avatarRenderer } from './Avatar'
import { buttonRenderer } from './Button'
import { spacerRenderer } from './Spacer'
import { dividerRenderer } from './Divider'
import { inputRenderer } from './Input'
import { mapEmbedRenderer } from './MapEmbed'
import { calendarRenderer } from './Calendar'

export const contentRenderers = {
  text: textRenderer,
  image: imageRenderer,
  video: videoRenderer,
  avatar: avatarRenderer,
  button: buttonRenderer,
  spacer: spacerRenderer,
  divider: dividerRenderer,
  input: inputRenderer,
  'map-embed': mapEmbedRenderer,
  calendar: calendarRenderer,
}
