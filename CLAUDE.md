# Maison de Letter

AI 기반 개인화 청첩장 서비스입니다.
사용자가 본인의 웨딩 이미지를 업로드하면 해당 이미지를 바탕으로 꾸며진 청첩장 프리뷰를 보여주고 사용자에게 선택을 유도합니다.

- **도메인**: maisondeletter.com
- **브랜드 톤**: Ivory/Sage 내추럴, Fresh & Elegant
- **캐치프레이즈**: "원하는 분위기를 말하면, AI가 바로 시안을 만들어 드립니다"

## 중요 규칙
1. 모든 작업은 마이크로 단위로 작업에 대한 commit을 합니다.
2, 모든 작업 후에 왜 기능이 추가되었는 지에 대한 메모를 CLAUDE.md 파일에 기록한다. 단 CLAUDE.md 파일은 200줄을 넘기면 안되고 필요한 파일들은 참조를 통해서 관리한다.

## 라우트 구조

- `/` - 청첩장 서비스 (메인)
  - `/create` - 청첩장 생성
  - `/[id]` - 게스트용 청첩장 뷰어 (모바일 전용)
  - `/[id]/edit` - 2패널 편집 페이지 (정보 입력 + 실시간 프리뷰)
  - `/[id]/photos`, `/preview`, `/payment`, `/share`, `/messages` - 편집/관리 페이지 (데스크탑 지원)
- `/party` - 청모장 서비스 (서브)
  - `/party/create`, `/party/[eventId]/*` - 청모장 관련 페이지

## 참고 문서

- [테마 시스템](./src/lib/themes/CLAUDE.md) - 청첩장 테마 템플릿

## Super Editor 아키텍처 주의사항

**⚠️ 핵심 혼란 원인**:
1. **스켈레톤 slots ≠ EditorPanel**: slots.defaultValue 수정해도 EditorPanel에 반영 안 됨
2. **wedding.date ≠ wedding.dateDisplay**: ISO 형식(`2025-03-15`) vs 한글 형식(`2025년 3월 15일 토요일`)

**EditorPanel과 PhonePreview는 완전히 분리된 데이터 플로우**:

| 파일 | 역할 | EditorPanel 영향 | Preview 영향 |
|------|------|------------------|--------------|
| `schema/variables.ts` | 표준 변수 정의 (라벨, 타입, defaultValue) | ✅ 직접 | ❌ |
| `skeletons/sections/*.ts` | 섹션 렌더링 구조 + slots | ❌ | ✅ 직접 |
| `components/fields/*.tsx` | EditorField UI 컴포넌트 | ✅ 직접 | ❌ |

- **EditorPanel 라벨/기본값 수정**: `STANDARD_VARIABLE_PATHS` (variables.ts)
- **스켈레톤 slots.defaultValue는 EditorPanel에 영향 없음**
- **`__HIDDEN__` description**: 자동 계산 필드를 에디터에서 숨김

## 변경 이력

### 2025-12-15: Super Editor v2 커스텀 변수 시스템
- **이유**: AI가 새 텍스트 요소 추가 시 편집기에서 수정 불가 ("텍스트를 입력하세요" 표시)
- **변경**:
  - `VariablePath` 타입에 `custom.${string}` 패턴 허용
  - `WeddingData.custom` 필드 추가 (Record<string, string>)
  - AI 프롬프트에 커스텀 변수 생성 가이드 추가
  - ContentTab에서 바인딩 기준 dedupe (중복 필드 제거)
- **파일**: `types.ts`, `binding-resolver.ts`, `content-tab.tsx`, `ai/route.ts`

### 2025-12-09: 랜딩 페이지 Split Hero 리디자인
- **이유**: Black & Gold 테마가 20-30대 여성에게 올드하게 느껴짐, 전환율 개선 필요
- **변경**:
  - 컬러 팔레트: Black & Gold → Ivory/Sand + Sage Green
  - 레이아웃: Split Hero (왼쪽 텍스트/CTA + 오른쪽 템플릿 캐러셀)
  - 폰트: Playfair Display(영문) + Noto Serif KR(한글) + Pretendard(본문)
  - 템플릿 3종: 매거진, 올드 머니, 미니멀 (자동 4초 슬라이드)
  - CTA: Above-the-fold + 모바일 플로팅 (스크롤 300px 후 표시)
- **파일**: `src/components/landing/NaturalHeroLanding.tsx`

### 2025-12-08: 다양한 폰트 지원을 위한 폰트 시스템 구축
- **이유**: 9개 고정 폰트만 사용 가능했고, 새 폰트 추가 시 여러 파일 수동 수정 필요
- **변경**:
  - `fonts/presets.ts`: 30+ 폰트 프리셋 (한글 고딕/명조/손글씨, 영문 세리프/산세리프/디스플레이)
  - `fonts/loader.ts`: Google Fonts URL 동적 생성, CDN 링크 자동 로드
  - StyleEditor: 카테고리별 그룹화된 폰트 선택기 (폰트 선택 시 실시간 로드)
  - HtmlBuilder: 사용된 폰트만 동적으로 CDN 링크 생성
  - TokenStyleContext: 스타일 변경 시 자동 폰트 로드
- **파일**: `src/lib/super-editor/fonts/` (presets.ts, loader.ts, index.ts)
- **새 폰트 추가 방법**: `fonts/presets.ts`의 `FONT_PRESETS` 배열에 추가

### 2025-12-08: Color System 60-30-10 법칙 적용
- **이유**: Surface(카드) 색상이 배경 변경에 반응하지 않고, 예술적 감성 부족
- **변경**:
  - 60-30-10 법칙 적용 (Background 60%, Surface 30%, Accent 10%)
  - `deriveSurfaceColor(bg, accent?)` - Alpha Blend로 Surface 자동 계산
  - 따뜻한 중립 톤: 크림/웜브라운 블렌딩 (기본)
  - 테마 통일 모드: accent 색상으로 블렌딩 (테마 적용 시)
  - 제목/본문 스타일 섹션 분리 (각각 상세설정 가능)
- **파일**:
  - `src/lib/super-editor/presets/intro-style-presets.ts` - `isDark()`, `deriveSurfaceColor()` 추가
  - `src/lib/super-editor/components/StyleEditor.tsx` - 제목/본문 분리, surface 자동 계산
- **문서**: [Color System 상세](./src/lib/super-editor/CLAUDE.md#4-color-system-60-30-10-법칙)

### 2025-12-07: StyleEditor UX 개선 - 탭 제거 및 섹션 기반 구조
- **이유**: 프리셋이 인트로 스타일과 불일치, 색상/글꼴 탭 분리가 비전문가에게 복잡
- **변경**:
  - 3개 탭(프리셋/색상/글꼴) 제거 → 단일 스크롤 뷰
  - "추천 스타일 적용" 버튼 최상단 배치 (인트로 타입별 색상/폰트 원클릭 적용)
  - 글 스타일 섹션: 제목/본문 글꼴 분리, ColorChipSelector (6개 프리셋 + 직접 선택)
  - 배경 스타일 섹션: 배경 색상 ColorChipSelector
  - 고급 옵션 접기/펼치기 (DisclosurePanel)
- **파일**:
  - `src/lib/super-editor/presets/intro-style-presets.ts` - 신규: 7개 인트로별 스타일 프리셋
  - `src/lib/super-editor/components/StyleEditor.tsx` - 전면 리팩토링
  - `src/app/se/[id]/edit/page.tsx` - introType props 전달
- **계획**: [StyleEditor UX 계획](./.claude/plans/starry-twirling-popcorn.md)

### 2025-12-07: 편집 패널 UX 리디자인 - Section-First 패턴
- **이유**: "내용"과 "섹션" 탭이 분리되어 사용자 인지 부하 발생, 점진적 공개 UX 개선
- **변경**:
  - 탭 구조 변경: `[내용] [스타일] [섹션] [공유]` → `[콘텐츠] [디자인] [공유]`
  - 콘텐츠 탭에 섹션 아코디언 통합 (섹션 on/off + 내용 입력을 한 곳에서)
  - 프리뷰 ↔ 에디터 양방향 연동 (섹션 클릭 → 해당 아코디언 펼침, 하이라이트)
- **파일**:
  - `src/lib/super-editor/components/SectionAccordion.tsx` - 신규: 개별 섹션 아코디언
  - `src/lib/super-editor/components/ContentTab.tsx` - 신규: 섹션 목록 + 필드 편집 통합
  - `src/app/se/[id]/edit/page.tsx` - 탭 구조 변경
  - `src/lib/super-editor/renderers/SectionRenderer.tsx` - 섹션 클릭/하이라이트 추가
- **계획**: [UX 리디자인 계획](./.claude/plans/tidy-weaving-sundae.md)

### 2025-12-07: OG 메타데이터 커스터마이징 기능
- **이유**: 카카오톡/문자 공유 시 청첩장 인트로를 OG 이미지로 표시하고 제목/설명 수정 가능
- **변경**:
  - `superEditorInvitations` 테이블에 `ogTitle`, `ogDescription`, `ogImageUrl` 필드 추가
  - html2canvas로 인트로 화면을 1200x630 JPG 이미지로 캡처 후 Supabase Storage 업로드
  - 편집 페이지에 "공유" 탭 추가 (OgMetadataEditor 컴포넌트)
  - 뷰어 페이지 generateMetadata에서 커스텀 OG 데이터 우선 사용
- **파일**:
  - `src/lib/db/super-editor-schema.ts` - OG 필드 추가
  - `src/lib/super-editor/actions/index.ts` - uploadOgImage, updateOgMetadata, getOgMetadata 액션
  - `src/lib/super-editor/components/OgMetadataEditor.tsx` - OG 편집 UI
  - `src/app/se/[id]/page.tsx` - 동적 OG 메타데이터 적용
  - `src/app/se/[id]/edit/page.tsx` - 공유 탭 추가

### 2025-12-06: 스크롤텔링 랜딩 페이지 리디자인
- **이유**: 영화적 스토리텔링으로 전환율 극대화, Wong Kar-wai 화양연화 톤앤매너
- **변경**:
  - 6단계 스크롤텔링 구현 (Transition → Theme → Features → AI Demo → Pricing → CTA)
  - 다크 테마 헤더 (골드/크림 텍스트, 투명 배경)
  - S1: 영상 배경 + 딤 오버레이 + 도발적 질문
  - S2: Sticky 아이폰 목업에서 Cinematic/Exhibition 테마 전환
  - S3: 벤토 그리드 기능 쇼케이스 (인터뷰 영상 제거 → 포토 갤러리 메인 피처로 승격, 실제 웨딩 이미지 4장 적용)
  - S4: 채팅 → AI 생성 시퀀스 데모
  - S5: 프리미엄 가격 카드 (~~100,000원~~ → 50,000원)
  - S6: 플로팅 CTA 바
- **파일**:
  - `src/components/landing/ScrollytellingLanding.tsx` - 메인 컨테이너
  - `src/components/landing/sections/S1-S6*.tsx` - 6개 섹션 컴포넌트
  - `src/components/landing/hooks/useScrollProgress.ts` - 스크롤 훅
  - `src/app/globals.css` - Wong Kar-wai 색상 변수 + 애니메이션 keyframes
  - `src/app/page.tsx` - 다크 테마 헤더 + 새 랜딩 통합
- **계획**: [스크롤텔링 랜딩 계획](./.claude/plans/valiant-roaming-coral.md)

### 2025-12-05: 랜딩페이지 리디자인 - 라이브 프리뷰 히어로 (이전 버전)
- **파일**: `src/components/landing/HeroWithLivePreview.tsx` (deprecated)

### 2025-12-02: AI 템플릿 시스템 + 확장 섹션 컴포넌트
- **이유**: Salon de Letter 수준의 30+ 섹션 지원, AI 동적 템플릿 저장, S3 정적 배포
- **변경**:
  - Sprint 0: `design_templates` 테이블 추가, 큐레이션/강화학습 데이터 구조
  - Sprint 1: `InvitationDesignData` v2 타입, 25개 ExtendedSectionType, 마이그레이션 유틸
  - Sprint 2: 신규 섹션 컴포넌트 (VideoSection, InterviewSection, TimelineSection, DdaySection)
  - Sprint 3: 편집 UI - 섹션 관리, 스타일 설정, 템플릿 재사용
- **파일**:
  - `src/lib/db/template-schema.ts` - 템플릿 DB 스키마
  - `src/lib/types/invitation-design.ts` - v2 데이터 타입
  - `src/lib/utils/design-migration.ts` - 레거시 → v2 마이그레이션
  - `src/components/invitation/sections/` - 신규 섹션 컴포넌트
  - `src/app/[id]/edit/components/` - 편집 UI 컴포넌트 (SectionEditor, StyleEditor, TemplateSelector)
- **계획**: [AI 디자인 플랫폼 설계](./.claude/plans/streamed-percolating-wave.md)

### 2025-12-02: 마이그레이션 구조 재정비
- **이유**: `updated_at` 컬럼 누락 에러 해결, 스키마와 DB 동기화
- **변경**:
  - `drizzle-kit introspect`로 현재 DB 상태를 기준선으로 설정
  - `foreignKey()` 헬퍼로 FK 명시적 이름 지정 (`_fkey` 컨벤션)
  - 인덱스, RLS 정책을 스키마에 명시하여 불필요한 DROP 방지
- **파일**: `src/lib/db/invitation-schema.ts`, `drizzle/migrations/`

### 2025-12-01: 인트로를 인라인 섹션으로 변경
- **이유**: Intro → Content 순서로 스크롤 가능한 단일 페이지 UX 요구
- **변경**:
  - IntroRenderer 오버레이 방식 제거, IntroPreview를 인라인 섹션으로 사용
  - 모든 인트로 컴포넌트 fixed → absolute 변경 (모바일 퍼스트)
- **파일**: `src/components/invitation/InvitationViewer.tsx`, `src/components/invitation/intros/*.tsx`

## 마이그레이션 규칙
- 절대로 마이그레이션 파일을 직접 생성하지 말것 `drizzle-kit generate`를 활용한 생성만 할것
- 스키마 변경 시 `drizzle-kit generate` → `drizzle-kit migrate` 순서로 진행