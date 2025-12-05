# Super Editor

LLM 기반 동적 청첩장 에디터 시스템

## 개요

AI(LLM)가 JSON 스키마를 생성하고, 이를 정적 HTML로 빌드하는 렌더링 시스템입니다.

## 핵심 스키마 (3가지 구조)

| 스키마 | 역할 |
|--------|------|
| **LayoutSchema** | UI 트리 구조 (Screen + PrimitiveNode 배열) |
| **StyleSchema** | 테마/색상/타이포그래피 정의 |
| **EditorSchema** | 편집기 폼 필드 정의 |

## 29개 Primitive 타입

- **레이아웃 (6)**: `container`, `row`, `column`, `scroll-container`, `overlay`, `fullscreen`
- **콘텐츠 (9)**: `text`, `image`, `video`, `avatar`, `button`, `spacer`, `divider`, `input`, `map-embed`
- **이미지 컬렉션 (6)**: `gallery`, `carousel`, `grid`, `collage`, `masonry`, `vinyl-selector`
- **애니메이션 (5)**: `animated`, `sequence`, `parallel`, `scroll-trigger`, `transition`
- **로직 (2)**: `conditional`, `repeat`
- **오디오 (1)**: `bgm-player`

## 스크롤 모션 프리셋 (15개)

- **기본 등장 (6)**: `scroll-fade-in`, `scroll-slide-up`, `scroll-slide-down`, `scroll-slide-left`, `scroll-slide-right`, `scroll-scale-in`
- **PPT 스타일 (6)**: `scroll-blur-in`, `scroll-rotate-in`, `scroll-flip-in`, `clip-reveal-up`, `clip-reveal-down`, `clip-reveal-circle`
- **Parallax (3)**: `parallax-slow`, `parallax-fast`, `parallax-zoom`

## BGM 프리셋 카테고리

- **romantic**: 로맨틱한 피아노/어쿠스틱
- **elegant**: 우아한 오케스트라/하프
- **playful**: 경쾌한 재즈/우쿨렐레
- **emotional**: 감동적인 발라드/시네마틱
- **classical**: 클래식 편곡 (캐논, 월광)
- **modern**: 모던 일렉트로닉/로파이

## 데이터 바인딩

`{{path.to.data}}` 형식으로 동적 데이터를 바인딩:
```
{{couple.groom.name}}, {{wedding.date}}, {{photos.gallery}}
```

## 폴더 구조

```
super-editor/
├── schema/          # 타입 정의 (primitives, layout, style, editor, user-data)
├── primitives/      # Primitive 렌더러 (layout, content, animation, logic, audio)
├── builder/         # HtmlBuilder - JSON → 정적 HTML 빌드 (스크롤 모션/BGM 런타임 JS 포함)
├── prompts/         # AI 프롬프트 템플릿
├── animations/      # 30+ 애니메이션 프리셋, 15+ 전환 프리셋, 15개 스크롤 모션 프리셋
├── audio/           # BGM 프리셋 라이브러리 (16개)
├── components/      # 에디터 UI 컴포넌트
├── context/         # 상태 관리
├── hooks/           # useAIChat 등
├── actions/         # 서버 액션
└── templates/       # 예시 정의 템플릿 (카카오톡 등)
```

## 동작 흐름

1. **AI 생성**: 사용자 요청 시 LLM이 Layout/Style/Editor JSON 생성
2. **데이터 바인딩**: Editor를 통해서 UserData를 Layout에 바인딩
3. **HTML 빌드**: `buildHtml()` 함수로 정적 HTML/CSS/JS 생성 (스크롤 모션 + BGM 런타임 포함)
4. **렌더링**: 프리뷰 또는 배포용 출력 생성
