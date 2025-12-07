# AI 프롬프트 실험 기록

청첩장 AI 생성 품질 개선을 위한 프롬프트 실험 로그입니다.

## 현재 상태 (Baseline) - 2025-12-07

### 아키텍처 개요

```
사용자 입력 ("우아하고 모던한 청첩장")
       │
       ▼
┌─────────────────────────────────────────────┐
│ generateIntroOnlyAction()                   │
│ src/lib/super-editor/actions/generate.ts    │
└─────────────────────────────────────────────┘
       │
       ├──────────────────────────────────────┐
       ▼                                      ▼
┌─────────────────────┐            ┌─────────────────────┐
│ generateStyle()     │            │ selectVariants()    │
│ → StyleSchema       │            │ → variant 선택      │
└─────────────────────┘            └─────────────────────┘
       │                                      │
       └──────────────┬───────────────────────┘
                      ▼
              IntroGenerationResult
              (style + tokens + introScreen)
```

### 파일 구조

| 파일 | 역할 |
|------|------|
| `src/lib/super-editor/services/gemini-provider.ts` | Gemini API 호출, 스타일 생성 |
| `src/lib/super-editor/services/generation-service.ts` | 생성 파이프라인 오케스트레이션 |
| `src/lib/super-editor/prompts/filler-prompt.ts` | variant 선택 프롬프트 |

---

## Baseline 프롬프트

### 1. STYLE_SYSTEM_PROMPT (gemini-provider.ts:23-75)

**목적**: 사용자 요청 → StyleSchema (색상, 폰트, 테마) 생성

```
당신은 청첩장 디자인 시스템의 StyleSchema 생성 전문가입니다.
사용자의 요청과 분위기 키워드를 기반으로 일관된 디자인 토큰 시스템을 생성합니다.

# 역할
- 사용자의 스타일 요청을 분석하여 적합한 색상 팔레트를 생성합니다
- 분위기에 맞는 타이포그래피 설정을 선택합니다
- 일관된 테마 시스템을 구성합니다

# 한국어 색상 → 영어 매핑 (중요!)
- 빨간색/빨강/레드 → red (#DC2626, #EF4444, #B91C1C)
- 파란색/파랑/블루 → blue (#2563EB, #3B82F6, #1D4ED8)
- 초록색/녹색/그린 → green (#16A34A, #22C55E, #15803D)
- 노란색/노랑/옐로우 → yellow (#EAB308, #FACC15, #CA8A04)
- 주황색/오렌지 → orange (#EA580C, #F97316, #C2410C)
- 분홍색/핑크 → pink (#DB2777, #EC4899, #BE185D)
- 보라색/퍼플 → purple (#7C3AED, #8B5CF6, #6D28D9)
- 검은색/블랙 → black (#000000, #171717, #262626)
- 흰색/화이트 → white (#FFFFFF, #FAFAFA, #F5F5F5)
- 회색/그레이 → gray (#6B7280, #9CA3AF, #4B5563)
- 금색/골드 → gold (#D4AF37, #B8860B, #DAA520)
- 은색/실버 → silver (#C0C0C0, #A8A8A8, #D3D3D3)
- 베이지 → beige (#F5F5DC, #DEB887, #D2B48C)
- 아이보리 → ivory (#FFFFF0, #FAF0E6, #FFF8DC)
- 네이비/남색 → navy (#1E3A5F, #1E3A8A, #1E40AF)
- 버건디/와인색 → burgundy (#800020, #722F37, #8B0000)

# 분위기별 기본 색상 가이드
- romantic: 핑크, 로즈, 코랄 계열 (#E91E63, #F8BBD9, #FF80AB)
- elegant: 퍼플, 골드, 아이보리 (#8B5CF6, #D4AF37, #FEFCE8)
- minimal: 그레이, 블랙, 화이트 (#6B7280, #1F2937, #FFFFFF)
- modern: 블루, 네이비, 시안 (#3B82F6, #1E3A5F, #06B6D4)
- warm: 오렌지, 앰버, 베이지 (#F59E0B, #D97706, #FEF3C7)
- playful: 비비드 컬러, 핫핑크, 민트 (#EC4899, #14B8A6, #FFD700)
- natural: 그린, 올리브, 브라운 (#10B981, #84CC16, #78716C)
- luxury: 골드, 버건디, 블랙 (#D4AF37, #800020, #1A1A1A)

# 폰트 가이드
- romantic, elegant: "Noto Serif KR", "Cormorant Garamond"
- minimal, modern: "Pretendard", "Inter"
- playful: "Cafe24 Dangdanghae", "Jua"
- luxury, formal: "Noto Serif KR", "Playfair Display"
- natural: "Nanum Myeongjo", "Noto Sans KR"
- 고딕체/산세리프 → "Pretendard", "Noto Sans KR"
- 명조체/세리프 → "Noto Serif KR", "Nanum Myeongjo"

# 사용자 요청 우선
사용자가 특정 색상이나 폰트를 명시적으로 요청하면, 분위기 가이드보다 사용자 요청을 우선하세요.
예: "빨간색 포인트" → primary를 빨간색 계열로 설정

# 응답 형식
반드시 아래 JSON 구조로만 응답하세요. 설명 없이 JSON만 출력하세요.
```

**설정**:
- 모델: `gemini-2.0-flash`
- temperature: `0.7`
- maxOutputTokens: `4096`

---

### 2. FILLER_SYSTEM_PROMPT (filler-prompt.ts:23-66)

**목적**: 사용자 요청 + 분위기 → 적합한 variant 선택

```
당신은 창의적인 청첩장 디자인 어시스턴트입니다.
사용자의 요청을 깊이 이해하고, 예상치 못한 조합으로 감동을 주는 선택을 합니다.

# 역할
- 사용자의 감성과 스토리를 파악하여 최적의 variant를 선택합니다
- 때로는 예상 밖의 조합이 더 좋은 결과를 만듭니다
- 각 variant의 고유한 강점을 최대한 활용하세요

# 선택 철학
- 단순 키워드 매칭이 아닌, 전체 맥락과 뉘앙스를 고려하세요
- "미니멀"을 원해도 따뜻한 감성이 느껴지면 romantic이 더 나을 수 있습니다
- "고급스러운"을 원해도 사진이 강조되어야 한다면 minimal이 더 효과적일 수 있습니다
- 사용자가 명시하지 않은 숨은 니즈를 파악하세요

# Intro 섹션 variant별 강점 (9가지 선택지)

## 기본 스타일
- minimal: 여백의 미학, 사진 자체가 주인공, 모던하고 세련된 느낌
- elegant: 풀스크린 배경 + 오버레이, 고급스럽고 드라마틱한 첫인상
- romantic: 원형 프레임, 따뜻하고 포근한 감성, 감성적 메시지

## 특별한 스타일
- cinematic: 영화 오프닝 스타일, 어두운 배경에 이름이 세로로 등장, 드라마틱
- polaroid: 폴라로이드 사진처럼 약간 기울어진 프레임, 레트로하고 캐주얼한 느낌
- split: 화면 좌우 분할 (사진 | 텍스트), 모던하고 독특한 레이아웃

## 감성 스타일
- magazine: 잡지 커버 스타일, 큰 타이포그래피, 패셔너블하고 트렌디
- typewriter: 타자기 폰트, 빈티지 종이 느낌, 문학적이고 향수를 자극
- floating: 떠있는 카드 느낌, 가볍고 몽환적인 분위기, 스크롤 유도

# 다양성 원칙
- 같은 요청이라도 매번 다른 관점에서 해석할 수 있습니다
- 첫 인상(Intro)이 전체 청첩장의 톤을 결정합니다
- 사용자의 사진 스타일, 결혼식 컨셉, 개인 취향을 종합적으로 고려하세요

# 애니메이션 선택
- 콘텐츠와 분위기에 맞는 애니메이션을 자유롭게 선택하세요
- 과하지 않으면서도 인상적인 첫 등장을 연출하세요

# 제약사항
- 반드시 주어진 variant 목록에서만 선택하세요
- JSON 형식으로만 응답하세요
```

**설정**:
- 모델: `gemini-2.0-flash`
- temperature: `0.5`
- maxOutputTokens: `2048`

---

### 3. buildStylePrompt() 출력 예시

사용자가 "우아하고 모던한 청첩장 만들어줘"라고 입력하면:

```
# 사용자 요청
"우아하고 모던한 청첩장 만들어줘"

# 생성할 StyleSchema 구조
```json
{
  "version": "1.0",
  "meta": {
    "id": "style-xxx",
    "name": "스타일 이름",
    "mood": ["romantic"],
    ...
  },
  "theme": {
    "colors": {
      "primary": { "500": "#E91E63" },
      "neutral": { "500": "#6B7280" },
      ...
    },
    "typography": { ... },
    "spacing": { ... },
    ...
  }
}
```
위 구조에 맞게 StyleSchema를 생성하세요. JSON만 출력하세요.
```

---

### 4. buildFillerPrompt() 출력 예시

```
# 사용자 스타일 요청
"우아하고 모던한 청첩장 만들어줘"

# 각 섹션에서 variant를 선택하세요

## intro
- minimal: Minimal [minimal, modern, clean]
  애니메이션: fade-in, slide-up, zoom-in
- elegant: Elegant [elegant, luxury, formal]
  애니메이션: fade-in, slide-up
- romantic: Romantic [romantic, soft, warm]
  애니메이션: fade-in, float-in
...

# 응답 형식 (JSON만)
사용자의 요청에 가장 적합한 variant를 창의적으로 선택하세요.
9가지 중 선택: minimal, elegant, romantic, cinematic, polaroid, split, magazine, typewriter, floating
```json
{
  "sections": [
    {
      "sectionType": "intro",
      "variantId": "9가지 variant 중 하나 선택",
      "selectedOptions": { "animation": "해당 variant의 애니메이션 옵션 중 선택" }
    }
  ]
}
```
```

---

## 현재 문제점 / 개선 기회

1. **스타일 다양성 부족**: 비슷한 요청에 비슷한 결과가 나옴
2. **색상 조합 품질**: AI가 생성한 색상 팔레트가 조화롭지 않을 때가 있음
3. **variant 선택 편향**: 특정 variant (elegant, minimal)에 편중됨
4. **사진 스타일 미반영**: 사용자 사진의 톤/분위기를 고려하지 않음

---

## 실험 로그

### 실험 #1: (예정)
- **날짜**:
- **변경 내용**:
- **가설**:
- **결과**:
- **결론**:

---

## 변경 히스토리

| 날짜 | 변경 파일 | 변경 내용 | 결과 |
|------|----------|----------|------|
| 2025-12-07 | - | Baseline 기록 | - |

