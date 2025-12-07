# 청첩장 생성 온보딩 UX 개선 계획

## 목표
사용자가 좋은 AI 프롬프트를 쉽게 입력할 수 있도록 단계별 선택 UI 구현

---

## Part 1: 프론트엔드 위저드 UI

### 플로우 (4단계)
```
[분위기 선택] → [색상 선택] → [키워드 입력] → [추가 요청] → AI 생성
```

### 각 단계
1. **분위기** - a,b,c 다중 선택 + "Letty에게 맡기기"
2. **색상** - 단일 선택 + 직접 입력 + "Letty에게 맡기기"
3. **키워드** - "한 단어로 표현한다면?" (예: 뉴욕, 박물관, 바다, 물의교회)
4. **추가 요청** - 자유 텍스트 (선택사항)

> **Letty** = Maison de Letter의 AI 디자인 어시스턴트 캐릭터

### 선택 옵션

**분위기 (다중 선택):**
| 키 | 값 | 라벨 |
|----|-----|------|
| a | romantic | 로맨틱 |
| b | elegant | 우아한 |
| c | minimal | 미니멀 |
| d | modern | 모던 |
| e | warm | 따뜻한 |
| f | luxury | 럭셔리 |

**색상 (단일 선택):**
| 키 | 값 | 라벨 |
|----|-----|------|
| a | white-gold | 화이트 & 골드 |
| b | blush-pink | 블러쉬 핑크 |
| c | deep-navy | 딥 네이비 |
| d | natural-green | 내추럴 그린 |
| e | terracotta | 테라코타 |
| f | custom | 직접 입력 |

### 메시지 플로우

**Step 1: 분위기 선택**
```
안녕하세요! 청첩장 디자인을 도와드릴게요.

어떤 분위기를 원하시나요? (여러 개 선택 가능)

  a. 로맨틱
  b. 우아한
  c. 미니멀
  d. 모던
  e. 따뜻한
  f. 럭셔리

원하는 옵션을 입력해주세요 (예: a, c)

                          [Letty에게 맡기기]
```

**Step 2: 색상 선택**
```
좋아요! 이제 메인 색상을 골라주세요.

  a. 화이트 & 골드
  b. 블러쉬 핑크
  c. 딥 네이비
  d. 내추럴 그린
  e. 테라코타
  f. 직접 입력

원하는 옵션을 입력해주세요 (예: a)

                          [Letty에게 맡기기]
```

**Step 2-1: 직접 입력 (f 선택 시)**
```
어떤 색상을 원하시나요?

색상 이름을 자유롭게 입력해주세요.
(예: 연보라, 민트, 코랄, 샴페인 골드...)

[________________]  [확인]
```

**Step 3: 키워드 입력**
```
한 단어로 표현한다면?

두 분의 결혼식을 떠올리게 하는 단어를 알려주세요.
(예: 뉴욕, 박물관, 바다, 물의교회...)

[________________]  [다음]

                   [Letty에게 맡기기]
```

**Step 4: 추가 요청**
```
마지막이에요!

추가로 원하는 스타일이 있다면 자유롭게 입력해주세요.
(예: 벚꽃 느낌, 캘리그라피 폰트, 심플한 레이아웃...)

[________________]  [생성하기]

                   [바로 생성하기]
```

---

## Part 2: AI 생성 아키텍처 개선

### 현재 아키텍처 (2회 AI 호출)
```
사용자 입력 → generateStyle() → selectVariants() → IntroGenerationResult
```

### 개선 아키텍처 (Hybrid 방식)
```
사용자 입력 (Step 1-4)
       │
       ├─ moods: ['romantic', 'elegant']
       ├─ color: 'blush-pink'
       ├─ keyword: '박물관'
       └─ text: '캘리그라피'
       │
       ▼
┌─────────────────────────────────────────────┐
│ buildEnhancedPrompt()                       │
│ → "로맨틱, 우아한 분위기, 블러쉬 핑크 색상, │
│    "박물관" 느낌, 캘리그라피의 청첩장"       │
└─────────────────────────────────────────────┘
       │
       ├─────────────────────────────────────┐
       ▼                                     ▼
┌─────────────────────┐         ┌─────────────────────┐
│ getMoodVariantHints │         │ generateStyle()     │
│ (룩업 테이블)        │         │ + variantHints      │
│ → ['romantic',      │         │ → StyleSchema       │
│    'elegant',       │         │                     │
│    'floating']      │         └─────────────────────┘
└─────────────────────┘                   │
       │                                  │
       ▼                                  ▼
┌─────────────────────────────────────────────┐
│ selectVariant()                             │
│ 입력: prompt + style + variantHints         │
│ → "elegant" (style과 조화로운 선택)         │
└─────────────────────────────────────────────┘
       │
       ▼
   IntroGenerationResult
```

### 매핑 테이블

**Mood → Variant 힌트:**

> **총 14개 Intro Variant:**
> - 기존 7개: `minimal`, `elegant`, `romantic`, `polaroid`, `split`, `typewriter`, `floating`
> - 교체 2개: `cinematic` (화양연화 스타일), `magazine` (MAISON 마스트헤드)
> - 신규 5개: `exhibition` (갤러리), `gothic` (빅토리안), `oldmoney` (아이보리), `monogram` (네이비+골드), `jewel` (오페라 커튼)

```typescript
const MOOD_VARIANT_HINTS = {
  romantic: ['romantic', 'floating', 'polaroid', 'gothic', 'jewel'],
  elegant: ['elegant', 'cinematic', 'magazine', 'oldmoney', 'monogram'],
  minimal: ['minimal', 'split', 'exhibition'],
  modern: ['minimal', 'split', 'magazine', 'exhibition'],
  warm: ['romantic', 'polaroid', 'typewriter', 'oldmoney'],
  luxury: ['elegant', 'cinematic', 'jewel', 'gothic', 'monogram'],
  playful: ['polaroid', 'magazine', 'floating'],
  natural: ['romantic', 'typewriter', 'minimal', 'oldmoney'],
}
```

**색상 프리셋 (12개):**
```typescript
const COLOR_PRESETS = {
  // 기존 5개
  'white-gold': { primary: '#D4AF37', background: '#FFFEF5', text: '#1F2937' },
  'blush-pink': { primary: '#EC4899', background: '#FDF2F8', text: '#1F2937' },
  'deep-navy': { primary: '#1E3A8A', background: '#F8FAFC', text: '#1E293B' },
  'natural-green': { primary: '#16A34A', background: '#F0FDF4', text: '#14532D' },
  'terracotta': { primary: '#C2410C', background: '#FFF7ED', text: '#7C2D12' },
  // 신규 7개
  'burgundy': { primary: '#800020', background: '#FFF5F5', text: '#450A0A' },
  'lavender': { primary: '#9F7AEA', background: '#FAF5FF', text: '#4C1D95' },
  'charcoal': { primary: '#374151', background: '#F9FAFB', text: '#111827' },
  'sage': { primary: '#6B8E23', background: '#F7FDF4', text: '#365314' },
  'dusty-rose': { primary: '#C08081', background: '#FFF0F1', text: '#4A1E1F' },
  'champagne': { primary: '#D4A574', background: '#FFFDF5', text: '#78350F' },
  'midnight': { primary: '#191970', background: '#F0F4FF', text: '#1E3A8A' },
}
```

---

## 수정 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/app/se/create/page.tsx` | 위저드 상태 + UI 컴포넌트 |
| `src/lib/super-editor/prompts/prompt-hints.ts` | 신규: 매핑 테이블들 |
| `src/lib/super-editor/services/generation-service.ts` | buildEnhancedPrompt 함수 |
| `src/lib/super-editor/services/gemini-provider.ts` | variantHints 파라미터 추가 |

---

## 구현 순서

### Phase 1: 프론트엔드 위저드 UI
- [ ] 1. WizardState 타입 + 상태 관리
- [ ] 2. Step 1-4 UI 컴포넌트
- [ ] 3. buildFinalPrompt 함수

### Phase 2: 프롬프트 강화
- [ ] 4. prompt-hints.ts 신규 생성 (매핑 테이블)
- [ ] 5. buildEnhancedPrompt 함수 (구조화된 입력 → 프롬프트)
- [ ] 6. generateStyle 프롬프트 개선 (variantHints 포함)

### Phase 3: AI 호출 최적화
- [ ] 7. getMoodVariantHints 함수
- [ ] 8. selectVariant에 style 참조 추가
- [ ] 9. (선택) 캐싱 레이어

---

## 예상 결과

**Before:**
- 열린 질문 → 사용자 막막함
- mood 배열 미사용 → AI 힌트 부족

**After:**
- 단계별 선택 → 쉬운 입력
- mood + 색상 + 키워드 → AI가 더 정확한 스타일 생성
- "한 단어로 표현한다면?" → 개인적 연상 이미지 반영
- Mood → Variant 힌트로 Style-Variant 일관성 향상
