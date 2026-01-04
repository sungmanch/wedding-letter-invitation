/**
 * Greeting Parents Block - Ribbon Preset
 *
 * 리본 포인트와 카드형 혼주 정보를 포함한 클래식 스타일
 * Absolute 레이아웃
 */

import type { BlockPreset, PresetElement } from '../types'
import { FONT_SIZE } from '../tokens'

const ELEMENTS: PresetElement[] = [
  // 1. 핑크 리본 장식 (greeting2.svg)
  {
    type: 'shape',
    x: 10,
    y: 3,
    width: 20,
    height: 5,
    zIndex: 1,
    props: {
      type: 'shape',
      shape: 'custom',
      fill: '#EF90CB',
      svgViewBox: '0 0 76 22',
      svgPath:
        'M75.8957 13.3064C75.1689 8.87589 71.0272 6.32442 67.1343 4.88056C55.2069 0.440209 43.847 4.03996 33.0546 9.53848C26.9913 12.624 20.5398 16.4611 13.5705 16.8567C9.39892 17.094 4.90872 15.7688 2.64869 12.0207C1.23492 9.67694 1.17519 6.85845 2.71838 4.54432C3.36553 3.58505 4.17198 2.85323 5.12776 2.30931C6.49175 2.20053 7.99512 2.14119 8.89116 3.28836C9.41884 3.96085 9.5184 4.80145 9.45866 5.66183C9.30932 6.25519 9.12015 6.9079 8.87125 7.63971C8.20419 7.43203 7.93537 8.45065 8.58252 8.6781C11.5494 9.7066 14.377 7.42215 13.8493 4.27731C13.3316 1.17203 10.0959 -0.311387 7.18867 0.0545216C6.28267 0.173195 5.41649 0.459988 4.62 0.865455C4.45074 0.885234 4.27153 0.905012 4.10228 0.934681C3.78368 0.984128 3.61443 1.23136 3.58456 1.49838C1.45396 3.04113 0.0302388 5.58271 0.000370536 8.23308C-0.0394538 12.357 3.13654 15.8677 6.80039 17.3907C17.5032 21.8508 29.9184 12.4756 39.1677 8.30231C46.2166 5.1278 53.7036 3.52571 61.4096 5.01901C64.8245 5.68161 68.8169 6.809 71.4851 9.1528C74.0936 11.4471 75.4278 15.1062 72.7994 18.0731C72.6301 18.2511 72.4509 18.3994 72.2816 18.5576C70.9774 19.0917 69.8026 19.8136 68.2594 19.4675C67.2339 19.24 66.3578 18.528 65.9396 17.6478C66.1089 16.8468 66.4673 15.8776 67.0049 14.7304C68.0304 15.0172 68.4585 13.4547 67.443 13.1481C64.6055 12.2779 61.6983 14.3546 62.0667 17.4302C62.5047 21.1684 66.6266 22.6024 69.8922 21.7717C73.7054 20.8124 76.5628 17.2621 75.9056 13.2965L75.8957 13.3064Z',
    },
  },
  // 2. 메인 제목 "소중한 분들을 초대합니다."
  {
    type: 'text',
    x: 10,
    y: 10,
    width: 80,
    height: 6,
    zIndex: 1,
    binding: 'greeting.title',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: FONT_SIZE.xl,
        fontWeight: 400,
        color: 'var(--fg-emphasis)',
        textAlign: 'center',
        lineHeight: 1.5,
        letterSpacing: 0.02,
      },
    },
  },
  // 3. 인사말 본문
  {
    type: 'text',
    x: 10,
    y: 18,
    width: 80,
    height: 32,
    zIndex: 1,
    binding: 'greeting.content',
    props: { type: 'text' },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.body,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'left',
        lineHeight: 1.9,
        letterSpacing: 0.01,
      },
    },
  },
  // 4. 혼주 카드 배경
  {
    type: 'shape',
    x: 10,
    y: 54,
    width: 80,
    height: 18,
    zIndex: 0,
    props: {
      type: 'shape',
      shape: 'rectangle',
      fill: 'var(--bg-card)',
    },
    style: {
      border: {
        width: 0,
        color: 'transparent',
        style: 'solid',
        radius: 8,
      },
    },
  },
  // 5. 신랑측 혼주 정보 (카드 안)
  {
    type: 'text',
    x: 12,
    y: 56,
    width: 76,
    height: 6,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.groom.father.name} · {parents.groom.mother.name}의 {parents.groom.birthOrder}  {couple.groom.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.body,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 6. 신부측 혼주 정보 (카드 안)
  {
    type: 'text',
    x: 12,
    y: 64,
    width: 76,
    height: 6,
    zIndex: 1,
    props: {
      type: 'text',
      format:
        '{parents.bride.father.name} · {parents.bride.mother.name}의 {parents.bride.birthOrder}  {couple.bride.name}',
    },
    style: {
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.body,
        fontWeight: 400,
        color: 'var(--fg-default)',
        textAlign: 'center',
        lineHeight: 1.6,
      },
    },
  },
  // 7. 구분선
  {
    type: 'divider',
    x: 10,
    y: 76,
    width: 80,
    height: 0.3,
    zIndex: 1,
    props: { type: 'divider', dividerStyle: 'solid' },
    style: { background: 'var(--border-muted)' },
  },
  // 8. 축하 연락하기 버튼 (contact-modal)
  {
    type: 'button',
    x: 10,
    y: 80,
    width: 80,
    height: 6,
    zIndex: 1,
    props: {
      type: 'button',
      label: '📞  축하 연락하기',
      action: 'contact-modal',
    },
    style: {
      background: 'var(--bg-section)',
      border: {
        width: 1,
        color: 'var(--border-default)',
        style: 'solid',
        radius: 8,
      },
      text: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.base,
        fontWeight: 500,
        color: 'var(--fg-default)',
      },
    },
  },
]

export const GREETING_PARENTS_RIBBON: BlockPreset = {
  id: 'greeting-parents-ribbon',
  blockType: 'greeting-parents',
  variant: 'ribbon',
  name: 'Ribbon',
  nameKo: '리본 장식',
  description: '리본 포인트와 카드형 혼주 정보를 포함한 클래식 스타일',
  tags: ['elegant', 'classic', 'card', 'ribbon', 'pink-accent', 'with-contact'],
  complexity: 'low',
  bindings: [
    'greeting.title',
    'greeting.content',
    'couple.groom.name',
    'couple.groom.phone',
    'couple.bride.name',
    'couple.bride.phone',
    'parents.groom.birthOrder',
    'parents.groom.father.name',
    'parents.groom.father.phone',
    'parents.groom.mother.name',
    'parents.groom.mother.phone',
    'parents.bride.birthOrder',
    'parents.bride.father.name',
    'parents.bride.father.phone',
    'parents.bride.mother.name',
    'parents.bride.mother.phone',
  ],
  defaultHeight: 100,
  defaultElements: ELEMENTS,
  specialComponents: ['contact-modal'],
  recommendedAnimations: ['fade-in', 'slide-up'],
  recommendedThemes: ['hero-classic-elegant', 'hero-minimal-overlay', 'hero-dark-romantic'],
  relatedPresets: ['contact-minimal'],
  aiHints: {
    mood: ['elegant', 'romantic', 'classic'],
    style: ['card-layout', 'ribbon-decoration', 'soft-colors'],
    useCase: ['traditional-wedding', 'elegant-invitation', 'korean-style'],
  },
}
