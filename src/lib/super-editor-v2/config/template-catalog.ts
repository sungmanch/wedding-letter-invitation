/**
 * Template Catalog (Manually Enhanced)
 *
 * template-catalog-v2.ts의 실제 구현을 기반으로 차별화된 메타데이터를 작성했습니다.
 * 각 템플릿의 고유한 특징(폰트, 색상, 레이아웃)이 AI 선택에 반영됩니다.
 *
 * Updated at: 2025-12-28T00:00:00.000Z
 */

import type { TemplateCatalog } from '../schema/template-metadata'

/**
 * 사전 분석된 템플릿 카탈로그
 *
 * unique1~6.png 이미지를 AI로 분석한 결과를 저장합니다.
 * 사용자 레퍼런스와 매칭하여 가장 유사한 템플릿을 선택하는 데 사용됩니다.
 */
export const TEMPLATE_CATALOG: TemplateCatalog = [
  {
    "id": "unique1",
    "name": "클래식 엘레강스",
    "imagePath": "/examples/unique1.png",
    "mood": [
      "elegant",
      "classic",
      "simple",
      "timeless"
    ],
    "colors": [
      "#1A1A1A",
      "#2A2A2A",
      "#4A4A4A",
      "#FFFFFF",
      "#F8F8F8",
      "#F0F0F0",
      "#E8E8E8",
      "#D0D0D0",
      "#C0C0C0"
    ],
    "typography": "script",
    "layout": "photo-dominant",
    "keywords": [
      "outdoor",
      "nature",
      "classic",
      "white-bg",
      "black-text",
      "simple",
      "great-vibes",
      "centered-photo",
      "minimalist"
    ],
    "summary": "흰 배경에 검정 스크립트 폰트와 야외 사진으로 클래식하고 심플한 분위기를 연출하는 청첩장 디자인입니다.",
    "designPattern": {
      "introType": "elegant",
      "imageLayout": "centered",
      "textLayout": "below-image",
      "colorTheme": "light",
      "stylePreset": "classic-serif",
      "colorPalette": {
        "primary": [
          "#1A1A1A",
          "#2A2A2A",
          "#4A4A4A"
        ],
        "secondary": [
          "#FFFFFF",
          "#F8F8F8",
          "#F0F0F0"
        ],
        "tertiary": [
          "#E8E8E8",
          "#D0D0D0",
          "#C0C0C0"
        ]
      }
    },
    "version": 1,
    "createdAt": "2025-12-27T12:58:47.584Z",
    "updatedAt": "2025-12-28T00:00:00.000Z"
  },
  {
    "id": "unique2",
    "name": "캐주얼 플레이풀",
    "imagePath": "/examples/unique2.png",
    "mood": [
      "casual",
      "playful",
      "joyful",
      "friendly"
    ],
    "colors": [
      "#1A1A1A",
      "#2A2A2A",
      "#4A4A4A",
      "#FFFFFF",
      "#F5F5F5",
      "#EBEBEB",
      "#CCCCCC",
      "#B8B8B8",
      "#A0A0A0"
    ],
    "typography": "script",
    "layout": "card",
    "keywords": [
      "studio",
      "portrait",
      "vertical-photo",
      "photo-card",
      "casual",
      "white-bg",
      "black-white",
      "playful-pose",
      "save-the-date",
      "great-vibes"
    ],
    "summary": "스튜디오 촬영 사진과 세로형 카드 레이아웃으로 캐주얼하고 즐거운 분위기를 연출하는 청첩장 디자인입니다.",
    "designPattern": {
      "introType": "romantic",
      "imageLayout": "card",
      "textLayout": "below-image",
      "colorTheme": "light",
      "stylePreset": "classic-serif",
      "colorPalette": {
        "primary": [
          "#1A1A1A",
          "#2A2A2A",
          "#4A4A4A"
        ],
        "secondary": [
          "#FFFFFF",
          "#F5F5F5",
          "#EBEBEB"
        ],
        "tertiary": [
          "#CCCCCC",
          "#B8B8B8",
          "#A0A0A0"
        ]
      }
    },
    "version": 1,
    "createdAt": "2025-12-27T12:58:51.808Z",
    "updatedAt": "2025-12-28T00:00:00.000Z"
  },
  {
    "id": "unique3",
    "name": "미니멀 모던",
    "imagePath": "/examples/unique3.png",
    "mood": [
      "minimal",
      "modern",
      "clean",
      "simple"
    ],
    "colors": [
      "#1A1A1A",
      "#2A2A2A",
      "#4A4A4A",
      "#FFFFFF",
      "#F8F8F8",
      "#F0F0F0",
      "#87CEEB",
      "#B0E0E6",
      "#ADD8E6"
    ],
    "typography": "sans-serif",
    "layout": "fullscreen-bg",
    "keywords": [
      "outdoor",
      "sky",
      "fullscreen-bg",
      "white-card-overlay",
      "minimal",
      "modern",
      "clean",
      "simple-text",
      "pretendard",
      "noto-serif"
    ],
    "summary": "야외 전체 배경 이미지 위에 흰색 카드 오버레이로 미니멀하고 모던한 느낌을 주는 청첩장 디자인입니다.",
    "designPattern": {
      "introType": "minimal",
      "imageLayout": "fullscreen-bg",
      "textLayout": "center",
      "colorTheme": "light",
      "stylePreset": "minimal-light",
      "colorPalette": {
        "primary": [
          "#1A1A1A",
          "#2A2A2A",
          "#4A4A4A"
        ],
        "secondary": [
          "#FFFFFF",
          "#F8F8F8",
          "#F0F0F0"
        ],
        "tertiary": [
          "#87CEEB",
          "#B0E0E6",
          "#ADD8E6"
        ]
      }
    },
    "version": 1,
    "createdAt": "2025-12-27T12:58:56.276Z",
    "updatedAt": "2025-12-28T00:00:00.000Z"
  },
  {
    "id": "unique4",
    "name": "다크 로맨틱",
    "imagePath": "/examples/unique4.png",
    "mood": [
      "romantic",
      "dramatic",
      "emotional",
      "cinematic"
    ],
    "colors": [
      "#1A1A1A",
      "#0A0A0A",
      "#2A2A2A",
      "#FFFFFF",
      "#F5F5F5",
      "#EBEBEB",
      "#FF7F7F",
      "#FF9999",
      "#FFB3B3"
    ],
    "typography": "script",
    "layout": "fullscreen-bg",
    "keywords": [
      "dark-bg",
      "dark-overlay",
      "dramatic",
      "coral-pink-accent",
      "salmon-pink",
      "fullscreen-bg",
      "romantic",
      "great-vibes",
      "emotional",
      "split-names"
    ],
    "summary": "어두운 배경과 산호/연어 핑크 강조색으로 드라마틱하고 감성적인 분위기를 연출하는 청첩장 디자인입니다.",
    "designPattern": {
      "introType": "cinematic",
      "imageLayout": "fullscreen-bg",
      "textLayout": "center",
      "colorTheme": "dark",
      "stylePreset": "romantic-script",
      "colorPalette": {
        "primary": [
          "#FF7F7F",
          "#FF9999",
          "#FFFFFF"
        ],
        "secondary": [
          "#1A1A1A",
          "#0A0A0A",
          "#2A2A2A"
        ],
        "tertiary": [
          "#FFB3B3",
          "#FFC0CB",
          "#FFD0D0"
        ]
      }
    },
    "version": 1,
    "createdAt": "2025-12-27T12:59:00.770Z",
    "updatedAt": "2025-12-28T00:00:00.000Z"
  },
  {
    "id": "unique5",
    "name": "브라이트 캐주얼",
    "imagePath": "/examples/unique5.png",
    "mood": [
      "bright",
      "casual",
      "modern",
      "fun",
      "youthful"
    ],
    "colors": [
      "#4169E1",
      "#1E90FF",
      "#6495ED",
      "#FFFFFF",
      "#F0F8FF",
      "#E6F2FF",
      "#87CEEB",
      "#B0E0E6",
      "#ADD8E6"
    ],
    "typography": "display",
    "layout": "fullscreen-bg",
    "keywords": [
      "blue-theme",
      "bright",
      "sky-bg",
      "modern",
      "bangers-font",
      "big-number",
      "white-number",
      "casual",
      "fun",
      "youthful"
    ],
    "summary": "하늘 배경에 흰색 큰 숫자와 블루 스크립트로 밝고 즐거운 느낌을 주는 청첩장 디자인입니다.",
    "designPattern": {
      "introType": "polaroid",
      "imageLayout": "fullscreen-bg",
      "textLayout": "center",
      "colorTheme": "light",
      "stylePreset": "modern-sans",
      "colorPalette": {
        "primary": [
          "#4169E1",
          "#1E90FF",
          "#6495ED"
        ],
        "secondary": [
          "#FFFFFF",
          "#F0F8FF",
          "#E6F2FF"
        ],
        "tertiary": [
          "#87CEEB",
          "#B0E0E6",
          "#ADD8E6"
        ]
      }
    },
    "version": 1,
    "createdAt": "2025-12-27T12:59:05.376Z",
    "updatedAt": "2025-12-28T00:00:00.000Z"
  },
  {
    "id": "unique6",
    "name": "모노크롬 볼드",
    "imagePath": "/examples/unique6.png",
    "mood": [
      "bold",
      "minimal",
      "modern",
      "striking",
      "edgy"
    ],
    "colors": [
      "#1A1A1A",
      "#0A0A0A",
      "#2A2A2A",
      "#FFFFFF",
      "#F0F0F0",
      "#E0E0E0",
      "#FF1493",
      "#FF69B4",
      "#FFB6C1"
    ],
    "typography": "display",
    "layout": "fullscreen-bg",
    "keywords": [
      "monochrome",
      "black-white",
      "grayscale-filter",
      "hot-pink-accent",
      "deep-pink",
      "bold",
      "calistoga-font",
      "minimal",
      "modern",
      "striking"
    ],
    "summary": "흑백 필터와 딥핫핑크 강조색으로 볼드하고 세련된 느낌을 주는 청첩장 디자인입니다.",
    "designPattern": {
      "introType": "minimal",
      "imageLayout": "fullscreen-bg",
      "textLayout": "center",
      "colorTheme": "overlay",
      "stylePreset": "minimal-dark",
      "colorPalette": {
        "primary": [
          "#FF1493",
          "#FF69B4",
          "#FFFFFF"
        ],
        "secondary": [
          "#1A1A1A",
          "#0A0A0A",
          "#2A2A2A"
        ],
        "tertiary": [
          "#FFB6C1",
          "#FFC0CB",
          "#E0E0E0"
        ]
      }
    },
    "version": 1,
    "createdAt": "2025-12-27T12:59:09.613Z",
    "updatedAt": "2025-12-28T00:00:00.000Z"
  }
]

/**
 * 템플릿 ID로 템플릿 메타데이터 조회
 */
export function getTemplateById(id: string) {
  return TEMPLATE_CATALOG.find((t) => t.id === id)
}

/**
 * 모든 템플릿 ID 목록
 */
export function getAllTemplateIds(): string[] {
  return TEMPLATE_CATALOG.map((t) => t.id)
}
