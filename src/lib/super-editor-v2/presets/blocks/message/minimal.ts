/**
 * Message Block Preset: Minimal
 *
 * 영문 라벨과 테두리 버튼이 포함된 깔끔한 방명록 블록
 * - Auto Layout 기반
 * - 비밀번호 없는 방명록 모달
 */

import type { BlockPreset, ModalPreset } from '../types'
import { MESSAGE_COMMON_BINDINGS, MESSAGE_COMMON_TAGS } from './_shared'
import { FONT_SIZE } from '../tokens'

// ============================================
// Modal Configuration
// ============================================

const MINIMAL_MODAL: ModalPreset = {
  style: {
    background: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },

  header: {
    title: '방명록 남기기',
    subtitle: '직접 축하의 마음을 전해보세요.',
    showCloseButton: true,
    style: {
      text: {
        fontFamily: 'var(--font-heading)',
        fontSize: FONT_SIZE.xl,
        fontWeight: 600,
        color: 'var(--fg-default)',
      },
      subtitleText: {
        fontFamily: 'var(--font-body)',
        fontSize: FONT_SIZE.base,
        fontWeight: 400,
        color: 'var(--fg-muted)',
      },
    },
  },

  sections: [
    {
      id: 'name',
      type: 'text-input',
      label: '성함을 입력해 주세요.',
      placeholder: '성함',
      required: true,
      style: {
        labelColor: 'var(--fg-default)',
        inputBorderColor: 'var(--border-default)',
        placeholderColor: 'var(--fg-muted)',
      },
    },
    {
      id: 'message',
      type: 'textarea',
      label: '방명록을 작성해 주세요.',
      placeholder: '방명록 (최대 200자)',
      required: true,
      maxLength: 200,
      style: {
        labelColor: 'var(--fg-default)',
        inputBorderColor: 'var(--border-default)',
        placeholderColor: 'var(--fg-muted)',
      },
    },
  ],

  submitButton: {
    label: '방명록 남기기',
    style: {
      background: 'var(--fg-default)',
      color: '#FFFFFF',
      fontFamily: 'var(--font-body)',
      fontSize: FONT_SIZE.md,
      fontWeight: 500,
      borderRadius: 8,
      padding: '16px 24px',
    },
  },
}

// ============================================
// Block Preset
// ============================================

export const MESSAGE_MINIMAL: BlockPreset = {
  id: 'message-minimal',
  blockType: 'message',
  variant: 'minimal',
  name: 'Minimal',
  nameKo: '미니멀',
  description: '영문 라벨과 테두리 버튼이 포함된 깔끔한 방명록 블록',

  tags: [...MESSAGE_COMMON_TAGS, 'minimal', 'clean', 'simple', '깔끔한'],
  complexity: 'low',
  bindings: MESSAGE_COMMON_BINDINGS,

  // ─── Layout (Auto Layout First!) ───
  layout: {
    mode: 'auto',
    direction: 'vertical',
    gap: 16,
    padding: {
      top: 60,
      right: 24,
      bottom: 60,
      left: 24,
    },
    alignItems: 'center',
  },
  defaultHeight: { type: 'hug' },

  // ─── Elements ───
  defaultElements: [
    // 1. 영문 라벨
    {
      id: 'en-label',
      type: 'text',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fill' },
        height: { type: 'hug' },
      },
      zIndex: 1,
      value: 'GUESTBOOK',
      props: { type: 'text' },
      style: {
        text: {
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--fg-muted)',
          textAlign: 'center',
          letterSpacing: 2,
        },
      },
    },

    // 2. 한글 제목
    {
      id: 'title',
      type: 'text',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fill' },
        height: { type: 'hug' },
      },
      zIndex: 1,
      binding: 'guestbook.title',
      value: '방명록',
      props: { type: 'text' },
      style: {
        text: {
          fontFamily: 'var(--font-heading)',
          fontSize: 24,
          fontWeight: 600,
          color: 'var(--fg-default)',
          textAlign: 'center',
          lineHeight: 1.4,
        },
      },
    },

    // 3. 설명 텍스트
    {
      id: 'description',
      type: 'text',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fill' },
        height: { type: 'hug' },
      },
      zIndex: 1,
      value: '저희에게 따뜻한\n방명록을 남겨주세요.',
      props: { type: 'text' },
      style: {
        text: {
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          fontWeight: 400,
          color: 'var(--fg-muted)',
          textAlign: 'center',
          lineHeight: 1.6,
        },
      },
    },

    // 4. 방명록 남기기 버튼
    {
      id: 'write-button',
      type: 'button',
      layoutMode: 'auto',
      sizing: {
        width: { type: 'fill' },
        height: { type: 'hug' },
      },
      zIndex: 1,
      props: {
        type: 'button',
        label: '방명록 남기기',
        action: 'show-block',
        targetBlockType: 'message',
      },
      style: {
        text: {
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          fontWeight: 500,
          color: 'var(--fg-default)',
          textAlign: 'center',
        },
        background: 'transparent',
        border: {
          width: 1,
          color: 'var(--border-default)',
          style: 'solid',
          radius: 0,
        },
        padding: {
          top: 8,
          right: 16,
          bottom: 8,
          left: 16,
        },
      },
    },
  ],

  // ─── AI Hints ───
  aiHints: {
    mood: ['minimal', 'clean', 'simple'],
    style: ['modern', 'understated'],
    useCase: ['guestbook', 'message', 'comment'],
  },

  recommendedThemes: ['minimal-light', 'modern-mono'],
  recommendedAnimations: ['fade-in', 'slide-up'],

  // ─── Modal ───
  modal: MINIMAL_MODAL,
}
