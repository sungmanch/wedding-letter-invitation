/**
 * Super Editor v2 - Animation Module
 *
 * GSAP + Lenis 기반 애니메이션 시스템
 */

// Animation Runtime
export {
  // Lenis 관리
  initLenis,
  destroyLenis,
  getLenis,
  scrollTo,
  LENIS_EASING_PRESETS,
  type LenisConfig,

  // GSAP 유틸
  convertToGsapVars,
  resolveTargets,
  applyAction,
  playAction,
  killAnimations,
  killAllScrollTriggers,

  // Mood 설정
  getSpeedMultiplier,
  getDefaultEasing,
  getDefaultDuration,

  // Reduced Motion
  checkReducedMotion,
  getReducedMotionLenisConfig,

  type ResolveContext,
} from './animation-runtime'

// Trigger Handler
export {
  setupInteraction,
  setupTrigger,
  emitStateTransition,
  matchesTrigger,
  type TriggerCleanup,
  type TriggerSetupOptions,
} from './trigger-handler'

// Action Executor
export {
  useBlockAnimationController,
  useElementAnimationController,
  optimizeForAnimation,
  cleanupAllBlockAnimations,
  cleanupBlockAnimations,
  type BlockAnimationControllerProps,
  type ElementAnimationControllerProps,
  type AnimationControllerOptions,
  type AnimationControllerResult,
} from './action-executor'

// State Machine
export {
  createStateMachine,
  validateStateMachine,
  STATE_MACHINE_CONSTRAINTS,
  createGalleryLightboxMachine,
  createMenuToggleMachine,
  type AnimationStateMachine,
  type StateMachineInstance,
  type ValidationResult,
} from './state-machine'

// Scroll Manager
export {
  useScrollManager,
  useHorizontalScroll,
  useParallax,
  useBlockVisibility,
  setupViewportOptimization,
  optimizeElement,
  cleanupAllScrollTriggers,
  refreshScrollTriggers,
  type HorizontalScrollConfig,
  type ParallaxConfig,
  type ScrollManagerResult,
  type HorizontalScrollControllerProps,
  type ParallaxControllerProps,
  type BlockVisibilityOptions,
} from './scroll-manager'
