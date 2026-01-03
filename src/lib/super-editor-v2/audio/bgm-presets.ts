/**
 * Super Editor - BGM Presets
 * 배경음악 프리셋 라이브러리
 */

// ============================================
// BGM Preset Types
// ============================================

export type BgmCategory = 'romantic' | 'elegant' | 'playful' | 'emotional' | 'classical' | 'modern'

export interface BgmPreset {
  id: string
  name: string
  category: BgmCategory
  duration: number // seconds
  mood: string[]
  description: string
  // URL은 실제 서비스에서 CDN 경로로 대체
  url: string
  previewUrl?: string
}

// ============================================
// BGM Presets Library
// ============================================

export const bgmPresets: BgmPreset[] = [
  // Romantic (4개)
  {
    id: 'romantic-piano-01',
    name: 'Gentle Love',
    category: 'romantic',
    duration: 180,
    mood: ['romantic', 'soft', 'tender'],
    description: '부드러운 피아노 선율의 로맨틱한 곡',
    url: '/audio/bgm/romantic-piano-01.mp3',
  },
  {
    id: 'romantic-acoustic-01',
    name: 'First Dance',
    category: 'romantic',
    duration: 210,
    mood: ['romantic', 'warm', 'intimate'],
    description: '어쿠스틱 기타의 따뜻한 멜로디',
    url: '/audio/bgm/romantic-acoustic-01.mp3',
  },
  {
    id: 'romantic-string-01',
    name: 'Forever Yours',
    category: 'romantic',
    duration: 240,
    mood: ['romantic', 'emotional', 'beautiful'],
    description: '현악 4중주의 아름다운 선율',
    url: '/audio/bgm/romantic-string-01.mp3',
  },
  {
    id: 'romantic-waltz-01',
    name: 'Wedding Waltz',
    category: 'romantic',
    duration: 195,
    mood: ['romantic', 'classic', 'elegant'],
    description: '클래식 왈츠 스타일의 웨딩 음악',
    url: '/audio/bgm/romantic-waltz-01.mp3',
  },

  // Elegant (3개)
  {
    id: 'elegant-orchestra-01',
    name: 'Elegant Moment',
    category: 'elegant',
    duration: 225,
    mood: ['elegant', 'sophisticated', 'grand'],
    description: '웅장한 오케스트라 사운드',
    url: '/audio/bgm/elegant-orchestra-01.mp3',
  },
  {
    id: 'elegant-harp-01',
    name: 'Golden Hour',
    category: 'elegant',
    duration: 180,
    mood: ['elegant', 'dreamy', 'soft'],
    description: '하프의 우아한 아르페지오',
    url: '/audio/bgm/elegant-harp-01.mp3',
  },
  {
    id: 'elegant-chamber-01',
    name: 'Royal Garden',
    category: 'elegant',
    duration: 200,
    mood: ['elegant', 'refined', 'classic'],
    description: '실내악 스타일의 고급스러운 곡',
    url: '/audio/bgm/elegant-chamber-01.mp3',
  },

  // Playful (2개)
  {
    id: 'playful-jazz-01',
    name: 'Happy Together',
    category: 'playful',
    duration: 165,
    mood: ['playful', 'happy', 'upbeat'],
    description: '경쾌한 재즈 피아노',
    url: '/audio/bgm/playful-jazz-01.mp3',
  },
  {
    id: 'playful-ukulele-01',
    name: 'Sunny Day',
    category: 'playful',
    duration: 150,
    mood: ['playful', 'cheerful', 'light'],
    description: '밝고 경쾌한 우쿨렐레',
    url: '/audio/bgm/playful-ukulele-01.mp3',
  },

  // Emotional (3개)
  {
    id: 'emotional-piano-01',
    name: 'Tears of Joy',
    category: 'emotional',
    duration: 240,
    mood: ['emotional', 'touching', 'deep'],
    description: '감동적인 피아노 발라드',
    url: '/audio/bgm/emotional-piano-01.mp3',
  },
  {
    id: 'emotional-violin-01',
    name: 'Promise',
    category: 'emotional',
    duration: 210,
    mood: ['emotional', 'sincere', 'heartfelt'],
    description: '진심을 담은 바이올린 선율',
    url: '/audio/bgm/emotional-violin-01.mp3',
  },
  {
    id: 'emotional-cinematic-01',
    name: 'Our Story',
    category: 'emotional',
    duration: 255,
    mood: ['emotional', 'cinematic', 'epic'],
    description: '영화같은 감동의 시네마틱 사운드',
    url: '/audio/bgm/emotional-cinematic-01.mp3',
  },

  // Classical (2개)
  {
    id: 'classical-canon-01',
    name: 'Canon in D',
    category: 'classical',
    duration: 300,
    mood: ['classical', 'timeless', 'elegant'],
    description: '파헬벨의 캐논 편곡',
    url: '/audio/bgm/classical-canon-01.mp3',
  },
  {
    id: 'classical-moonlight-01',
    name: 'Moonlight Sonata',
    category: 'classical',
    duration: 330,
    mood: ['classical', 'romantic', 'dreamy'],
    description: '베토벤 월광 소나타 편곡',
    url: '/audio/bgm/classical-moonlight-01.mp3',
  },

  // Modern (2개)
  {
    id: 'modern-electronic-01',
    name: 'Digital Love',
    category: 'modern',
    duration: 180,
    mood: ['modern', 'trendy', 'fresh'],
    description: '모던한 일렉트로닉 사운드',
    url: '/audio/bgm/modern-electronic-01.mp3',
  },
  {
    id: 'modern-lofi-01',
    name: 'Cozy Afternoon',
    category: 'modern',
    duration: 195,
    mood: ['modern', 'chill', 'relaxing'],
    description: '편안한 로파이 비트',
    url: '/audio/bgm/modern-lofi-01.mp3',
  },
]

// ============================================
// Helper Functions
// ============================================

export function getBgmById(id: string): BgmPreset | undefined {
  return bgmPresets.find((bgm) => bgm.id === id)
}

export function getBgmByCategory(category: BgmCategory): BgmPreset[] {
  return bgmPresets.filter((bgm) => bgm.category === category)
}

export function getBgmByMood(mood: string): BgmPreset[] {
  return bgmPresets.filter((bgm) => bgm.mood.includes(mood))
}

export function getAllBgmPresets(): BgmPreset[] {
  return bgmPresets
}

export function getBgmCategories(): { value: BgmCategory; label: string }[] {
  return [
    { value: 'romantic', label: '로맨틱' },
    { value: 'elegant', label: '우아한' },
    { value: 'playful', label: '경쾌한' },
    { value: 'emotional', label: '감동적인' },
    { value: 'classical', label: '클래식' },
    { value: 'modern', label: '모던' },
  ]
}
