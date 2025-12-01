/**
 * 디자인 데이터 마이그레이션 유틸리티
 * 기존 형식 → InvitationDesignData v2 변환
 */

import type {
  InvitationDesignData,
  SectionSetting,
  ExtendedSectionType,
  DEFAULT_SECTION_SETTINGS,
  DEFAULT_SECTION_ORDER,
} from '@/lib/types/invitation-design'
import type {
  ColorPalette,
  FontSet,
  InvitationThemeData,
  SectionConfig,
  IntroConfig,
  EffectsConfig,
} from '@/lib/themes/schema'

// ============================================
// 레거시 데이터 타입 (기존 designData)
// ============================================

interface LegacyDesignData {
  theme: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  layout: 'classic' | 'modern' | 'minimal' | 'romantic' | 'traditional'
  fonts: {
    title: string
    body: string
  }
  decorations: string[]
  styleDescription: string
}

// ============================================
// 타입 가드
// ============================================

export function isLegacyFormat(data: unknown): data is LegacyDesignData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'theme' in data &&
    'layout' in data &&
    !('version' in data) &&
    !('templateId' in data)
  )
}

export function isThemeDataFormat(data: unknown): data is InvitationThemeData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'templateId' in data &&
    'templateSource' in data &&
    !('version' in data)
  )
}

export function isV2Format(data: unknown): data is InvitationDesignData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'version' in data &&
    (data as { version: string }).version === '2.0'
  )
}

// ============================================
// 기본값 생성
// ============================================

const DEFAULT_COLORS: ColorPalette = {
  primary: '#D4768A',
  secondary: '#B8A9C9',
  background: '#FFFBFC',
  text: '#1F2937',
  accent: '#D4AF37',
  surface: '#FFFFFF',
  textMuted: '#6B7280',
}

const DEFAULT_FONTS: FontSet = {
  title: {
    family: 'Noto Serif KR',
    weight: 600,
    style: 'normal',
  },
  body: {
    family: 'Pretendard',
    weight: 400,
    style: 'normal',
  },
}

const DEFAULT_INTRO: IntroConfig = {
  type: 'cinematic',
  duration: 3000,
  skipEnabled: true,
  skipDelay: 1000,
}

const DEFAULT_EFFECTS: EffectsConfig = {
  background: {
    type: 'solid',
    value: '#FFFBFC',
  },
  scrollBehavior: {
    smooth: true,
    indicator: true,
    indicatorStyle: 'dot',
  },
}

// ============================================
// SectionConfig → SectionSetting 변환
// ============================================

function convertSectionConfig(config: SectionConfig): SectionSetting {
  return {
    id: config.id,
    type: config.type as ExtendedSectionType,
    enabled: config.enabled,
    order: config.order,
    label: config.content?.customTexts ? {
      title: config.content.customTexts.title,
      subtitle: config.content.customTexts.subtitle,
    } : undefined,
    layout: {
      type: config.layout,
      padding: (config.style?.padding as 'none' | 'small' | 'medium' | 'large') || 'medium',
      alignment: 'center',
    },
    style: config.style ? {
      backgroundColor: config.style.backgroundColor,
      backgroundImage: config.style.backgroundImage,
      textColor: config.style.textColor,
    } : undefined,
    animation: {
      type: config.animation?.type || 'fade',
      trigger: config.animation?.trigger || 'on-enter',
      duration: config.animation?.duration,
      delay: config.animation?.delay,
    },
    settings: config.content?.themeSpecific || {},
  }
}

// ============================================
// 기본 섹션 생성
// ============================================

function createDefaultSections(): SectionSetting[] {
  const defaultSectionSettings = {
    hero: { displayMode: 'fullscreen', showDate: true, showVenue: true, showDday: true, nameOrder: 'groom-first', nameStyle: 'full' },
    greeting: { template: 'default', showSignature: true, signatureStyle: 'names' },
    calendar: { displayMode: 'full', showLunarDate: false, showDday: true, showTime: true, timeFormat: '12h' },
    gallery: { displayMode: 'carousel', columns: 2, aspectRatio: '3:4', showCaption: false, autoPlay: false, autoPlayInterval: 3000, filter: 'none', spacing: 'small' },
    location: { showMap: true, mapProvider: 'kakao', mapStyle: 'default', showDirections: true, directionLinks: ['kakao', 'naver'], showParkingInfo: false, showShuttleInfo: false },
    parents: { displayMode: 'side-by-side', showRelation: true, relationStyle: 'korean', showDeceasedMark: true, deceasedMarkStyle: '故' },
    contact: { displayMode: 'grid', showProfileImage: false, contactMethods: ['call', 'sms'], groupByFamily: true },
    account: { displayMode: 'tabs', showQRCode: false, showCopyButton: true, showKakaoPayButton: false, accounts: [] },
    message: { displayMode: 'cards', showTimestamp: true, allowAnonymous: false, maxLength: 300, moderationEnabled: false },
    closing: { displayMode: 'simple', showWatermark: true, showSocialShare: true, showSaveDate: true },
  }

  const defaultOrder: ExtendedSectionType[] = [
    'hero',
    'greeting',
    'calendar',
    'gallery',
    'location',
    'parents',
    'contact',
    'account',
    'message',
    'closing',
  ]

  return defaultOrder.map((type, index) => ({
    id: `section-${type}`,
    type,
    enabled: true,
    order: index,
    layout: {
      type: 'centered' as const,
      padding: 'medium' as const,
      alignment: 'center' as const,
    },
    animation: {
      type: 'fade' as const,
      trigger: 'on-enter' as const,
    },
    settings: defaultSectionSettings[type as keyof typeof defaultSectionSettings] || {},
  }))
}

// ============================================
// 레거시 → v2 변환
// ============================================

function convertFromLegacy(data: LegacyDesignData): InvitationDesignData {
  const colors: ColorPalette = {
    primary: data.colors.primary,
    secondary: data.colors.secondary,
    background: data.colors.background,
    text: data.colors.text,
    accent: data.colors.secondary,
  }

  const fonts: FontSet = {
    title: {
      family: data.fonts.title || 'Noto Serif KR',
      weight: 600,
      style: 'normal',
    },
    body: {
      family: data.fonts.body || 'Pretendard',
      weight: 400,
      style: 'normal',
    },
  }

  return {
    version: '2.0',
    template: {
      id: data.theme || 'migrated',
      source: 'ai-generated',
      name: data.styleDescription,
    },
    globalStyles: {
      colors,
      fonts,
      background: {
        type: 'solid',
        value: colors.background,
      },
    },
    intro: {
      ...DEFAULT_INTRO,
      type: 'cinematic',
    },
    sections: createDefaultSections(),
    effects: DEFAULT_EFFECTS,
    sharing: {
      kakao: { enabled: true },
      url: {},
      sms: { enabled: true },
    },
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEditedBy: 'ai',
    },
  }
}

// ============================================
// ThemeData → v2 변환
// ============================================

function convertFromThemeData(data: InvitationThemeData): InvitationDesignData {
  return {
    version: '2.0',
    template: {
      id: data.templateId,
      source: data.templateSource,
    },
    globalStyles: {
      colors: data.colors,
      fonts: data.fonts,
      background: {
        type: 'solid',
        value: data.colors.background,
      },
    },
    intro: data.intro,
    sections: data.sections?.map(convertSectionConfig) || createDefaultSections(),
    effects: data.effects || DEFAULT_EFFECTS,
    sharing: {
      kakao: { enabled: true },
      url: {},
      sms: { enabled: true },
    },
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEditedBy: 'user',
    },
  }
}

// ============================================
// 기본 v2 데이터 생성
// ============================================

export function createDefaultDesignData(): InvitationDesignData {
  return {
    version: '2.0',
    template: {
      id: 'default',
      source: 'static',
    },
    globalStyles: {
      colors: DEFAULT_COLORS,
      fonts: DEFAULT_FONTS,
      background: {
        type: 'solid',
        value: DEFAULT_COLORS.background,
      },
    },
    intro: DEFAULT_INTRO,
    sections: createDefaultSections(),
    effects: DEFAULT_EFFECTS,
    sharing: {
      kakao: { enabled: true },
      url: {},
      sms: { enabled: true },
    },
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastEditedBy: 'ai',
    },
  }
}

// ============================================
// 메인 마이그레이션 함수
// ============================================

/**
 * 모든 형식의 디자인 데이터를 v2 형식으로 변환
 */
export function migrateDesignData(data: unknown): InvitationDesignData {
  if (!data) {
    return createDefaultDesignData()
  }

  if (isV2Format(data)) {
    return data
  }

  if (isThemeDataFormat(data)) {
    return convertFromThemeData(data)
  }

  if (isLegacyFormat(data)) {
    return convertFromLegacy(data)
  }

  // 알 수 없는 형식이면 기본값 반환
  return createDefaultDesignData()
}

/**
 * 섹션 설정 업데이트 (기존 설정 유지하면서 특정 필드만 변경)
 */
export function updateSectionSetting(
  sections: SectionSetting[],
  sectionId: string,
  updates: Partial<SectionSetting>
): SectionSetting[] {
  return sections.map(section =>
    section.id === sectionId
      ? { ...section, ...updates }
      : section
  )
}

/**
 * 섹션 순서 변경
 */
export function reorderSections(
  sections: SectionSetting[],
  fromIndex: number,
  toIndex: number
): SectionSetting[] {
  const result = [...sections]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)

  // order 재계산
  return result.map((section, index) => ({
    ...section,
    order: index,
  }))
}

/**
 * 섹션 활성화/비활성화 토글
 */
export function toggleSection(
  sections: SectionSetting[],
  sectionId: string
): SectionSetting[] {
  return sections.map(section =>
    section.id === sectionId
      ? { ...section, enabled: !section.enabled }
      : section
  )
}

/**
 * 신규 섹션 추가
 */
export function addSection(
  sections: SectionSetting[],
  type: ExtendedSectionType,
  afterIndex?: number
): SectionSetting[] {
  const defaultSectionSettings = {
    loading: { duration: 2000, animation: 'fade' },
    quote: { text: '', style: 'simple' },
    profile: { showPhoto: true, showBio: false },
    video: { source: 'youtube', autoPlay: false, muted: true, loop: false, showControls: true, aspectRatio: '16:9' },
    timeline: { displayMode: 'vertical', showConnectors: true, connectorStyle: 'line', events: [] },
    interview: { displayMode: 'card', questions: [], showBothAnswers: true },
    dday: { displayMode: 'countdown', showDays: true, showHours: true, showMinutes: true, showSeconds: false, style: 'digital' },
    transport: { showSubway: true, showBus: true, showCar: true, showShuttle: false, showParking: true },
    notice: { items: [], displayMode: 'list' },
    'guest-snap': { enabled: false, uploadEnabled: true, requireApproval: true, maxPhotos: 50, displayMode: 'grid', allowDownload: true },
  }

  const newSection: SectionSetting = {
    id: `section-${type}-${Date.now()}`,
    type,
    enabled: true,
    order: afterIndex !== undefined ? afterIndex + 1 : sections.length,
    layout: {
      type: 'centered',
      padding: 'medium',
      alignment: 'center',
    },
    animation: {
      type: 'fade',
      trigger: 'on-enter',
    },
    settings: defaultSectionSettings[type as keyof typeof defaultSectionSettings] || {},
  }

  const result = [...sections]
  if (afterIndex !== undefined) {
    result.splice(afterIndex + 1, 0, newSection)
  } else {
    result.push(newSection)
  }

  // order 재계산
  return result.map((section, index) => ({
    ...section,
    order: index,
  }))
}
