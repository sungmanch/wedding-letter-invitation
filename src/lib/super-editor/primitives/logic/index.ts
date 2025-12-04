/**
 * Super Editor - Logic Primitives
 */

export { Conditional, conditionalRenderer } from './Conditional'
export { Repeat, repeatRenderer } from './Repeat'

import { conditionalRenderer } from './Conditional'
import { repeatRenderer } from './Repeat'

export const logicRenderers = {
  conditional: conditionalRenderer,
  repeat: repeatRenderer,
}
