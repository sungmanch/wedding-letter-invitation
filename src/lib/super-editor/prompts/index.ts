/**
 * Super Editor Prompts
 */

export {
  SUPER_EDITOR_SYSTEM_PROMPT,
  createGenerationContext,
  getFullSystemPrompt,
  type GenerateTemplateRequest,
} from './system-prompt'

export {
  MOOD_VARIANT_HINTS,
  COLOR_PRESETS,
  COLOR_PRESET_LABELS,
  KEYWORD_STYLE_HINTS,
  getMoodVariantHints,
  getKeywordStyleHint,
  buildEnhancedPrompt,
  type ColorPreset,
  type KeywordStyleHint,
  type EnhancedPromptInput,
} from './prompt-hints'
