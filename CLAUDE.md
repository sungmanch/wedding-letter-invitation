# Maison de Letter

AI 기반 개인화 청첩장 서비스입니다.
사용자가 본인의 웨딩 이미지를 업로드하면 해당 이미지를 바탕으로 꾸며진 청첩장 프리뷰를 보여주고 사용자에게 선택을 유도합니다.

- **도메인**: maisondeletter.com
- **브랜드 톤**: Ivory/Sage 내추럴, Fresh & Elegant
- **캐치프레이즈**: "당신만의 이야기를 담은 청첩장"
- **핵심 가치**: 랜딩에서 템플릿+섹션 미리 선택, 에디터에서 상세 편집

## 중요 규칙
1. 모든 작업은 마이크로 단위로 작업에 대한 commit을 합니다.
2, 모든 작업 후에 왜 기능이 추가되었는 지에 대한 메모를 CLAUDE.md 파일에 기록한다. 단 CLAUDE.md 파일은 200줄을 넘기면 안되고 필요한 파일들은 참조를 통해서 관리한다.

## 라우트 구조

### 현재 사용 중 (Active)
- `/` - 랜딩 페이지 (BuilderLanding)
- `/se2/[id]/edit` - 청첩장 편집기 (Super Editor v2) ⭐ 주력 에디터
- `/share/[id]` - 청첩장 공유 페이지
- `/checkout/success` - Polar 결제 완료 콜백 페이지

### 별도 서비스
- `/party/*` - 청모장 서비스

## 참고 문서

- [테마 시스템](./src/lib/themes/CLAUDE.md) - 청첩장 테마 템플릿

## Super Editor v2 아키텍처

**핵심 구조**:
- **Block/Element 기반**: 각 섹션이 Block, 내부 요소가 Element
- **DataBinding**: `{{wedding.date}}` 형태로 데이터 바인딩
- **스타일 시스템**: StyleSystem (typography, colors, spacing)

**주요 파일**:
- `src/lib/super-editor-v2/schema/types.ts` - 타입 정의
- `src/lib/super-editor-v2/actions/` - 서버 액션
- `src/lib/super-editor-v2/components/` - 에디터 UI
- `src/lib/super-editor-v2/renderer/` - 렌더러

## 변경 이력

### 2026-01-07: RSVP 수집 정보 토글 설정
- **이유**: 참석 가능/불가에 따라 다른 정보를 수집할 수 있도록 토글 옵션 제공
- **변경**:
  - RsvpConfig에 showPhone 필드 추가
  - RSVP 모달: guestCount, mealOption, phone 설정 반영, 참석 가능 시에만 추가 옵션 표시
  - 데이터 탭: RSVP 블록에 토글 설정 UI 추가 (연락처, 신랑측/신부측, 동반인원수, 버스탑승, 식사여부)
- **파일**: `types.ts`, `rsvp-modal.tsx`, `data-tab.tsx`
- **API**: 기존 API가 모든 필드 지원 (변경 없음)

### 2026-01-06: 프리셋 요청 기능 추가
- **이유**: 오픈 베타 준비, 사용자가 원하는 프리셋 디자인 요청 기능
- **변경**:
  - DB 테이블: `preset_requests`, `preset_request_images` 추가
  - 서버 액션: `submitPresetRequest()` (로그인 필수)
  - 슬랙 알림: `notifyPresetRequest()` 추가
  - UI: `RequestPresetCard`, `RequestPresetModal` 컴포넌트
  - `SectionAccordion`에 프리셋 요청 카드 통합
- **파일**: `preset-request.ts`, `RequestPresetCard.tsx`, `RequestPresetModal.tsx`
- **TODO**: Supabase Storage `preset-request-images` 버킷 수동 생성 필요
### 2026-01-07: OG 이미지 스타일 선택 기능
- **이유**: 카카오톡 공유 시 OG 이미지를 다양한 방식으로 생성할 수 있도록 옵션 제공
- **변경**:
  - ShareTab에 드롭다운 추가 (auto/default/custom)
  - auto: Hero 이미지 1200x630 크롭 (기본값)
  - default: 텍스트 기반 기본 이미지 (신랑❤️신부 + 흰 배경)
  - custom: 직접 업로드
- **파일**: `utils/og-image-generator.ts`, `share-tab.tsx`, `EditClient.tsx`

### 2026-01-06: 문서 브랜치 시스템 추가
- **이유**: 같은 결혼 정보(data)로 여러 디자인 버전 공유 (신랑측/신부측/친구용 등)
- **변경**:
  - `editor_document_branches_v2` 테이블 추가
  - 브랜치 CRUD 서버 액션 (`actions/branch.ts`)
  - 브랜치 편집 라우트 (`/se2/branch/[id]/edit`)
  - BranchEditClient: data 읽기 전용, blocks/style만 편집 가능
  - BranchManager: ShareTab에서 브랜치 목록/생성/삭제 관리
- **파일**: `schema/db-schema.ts`, `actions/branch.ts`, `app/se2/branch/`, `components/editor/ui/branch-manager.tsx`

### 2026-01-04: SEO/AEO/GEO 최적화 기본 인프라
- **이유**: 검색엔진 최적화 및 AI 검색 엔진(ChatGPT, Claude) 대응
- **변경**:
  - `sitemap.ts`: 동적 사이트맵 생성
  - `robots.ts`: AI 크롤러(GPTBot, ClaudeBot) 허용
  - `manifest.ts`: PWA 메타데이터
  - `layout.tsx`: JSON-LD 구조화 데이터 (Organization, WebSite, FAQPage)
- **TODO**: og-image.png, logo.png, /icons/ 아이콘 파일 추가 필요

### 2026-01-04: HEIC/HEIF 이미지 미리보기 지원
- **이유**: 아이폰에서 촬영한 HEIC 파일이 Chrome/Firefox에서 미리보기 표시 안됨
- **변경**: `heic2any` 라이브러리로 클라이언트에서 HEIC → JPEG 변환
- **파일**: `PaperInvitationModal.tsx`

### 2026-01-04: Polar 결제 시스템 연동
- **이유**: SE2 에디터에서 결제 후 청첩장 발행 기능 필요
- **변경**:
  - `EditClient.tsx`: 결제 버튼 추가 (Polar 체크아웃 링크 연결)
  - `/checkout/success`: 결제 완료 콜백 페이지 (DB 업데이트 및 리다이렉트)
  - `/api/webhooks/polar`: 웹훅 라우트 (결제 완료 시 백업 DB 업데이트)
  - `@polar-sh/sdk` 패키지 설치
- **환경변수**: `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`

### 2026-01-04: SE1 및 레거시 라우트 완전 제거
- **이유**: SE2로 완전 전환, SE1 사용자 없음, 결제 시스템 불필요
- **삭제**:
  - `/src/app/se/` - SE1 라우트 (~15개 파일)
  - `/src/app/[id]/` - 레거시 라우트 (~10개)
  - `/src/app/create/`, `/checkout/`, `/my/`, `/paywall/` - 관련 라우트
  - `/src/lib/super-editor/` - SE1 라이브러리 (~70개)
  - `/src/lib/db/super-editor-schema.ts` - SE1 DB 스키마
  - 결제 관련 코드 (wedding-payment.ts, webhook)
- **수정**:
  - RSVP API를 SE2 스키마(`rsvpResponsesV2`)로 변경
  - `geocodeAddress` 함수를 SE2 actions로 이동
### 2026-01-04: 프리셋 시스템 통합 - template-catalog-v2 경량화
- **이유**: template-catalog-v2.ts와 presets/blocks/hero/ 간 코드 중복 제거
- **변경**:
  - `template-preset-map.ts` 신규: 템플릿 ID ↔ 프리셋 ID 매핑
  - `template-catalog-v2.ts`: 2900줄 인라인 → 256줄 프리셋 참조
  - `MiniHeroRenderer`: 프리셋 기반 렌더링으로 변경
  - `buildBlocksFromTemplate`: 프리셋에서 블록 생성
- **파일**: `config/template-preset-map.ts`, `config/template-catalog-v2.ts`, `services/template-block-builder.ts`

### 2026-01-03: 랜딩 페이지 레거시 코드 정리
- **이유**: AI 채팅 → SubwayBuilder → BuilderLanding 전환 과정에서 발생한 레거시 코드 제거
- **삭제**: 레거시 랜딩 컴포넌트 7개, subway 컴포넌트 5개, API 라우트 2개, 이미지 6개
- **현재 구조**: `BuilderLanding.tsx` + `builder/` (8개) + `subway/` (4개: Context, MiniBlockRenderer, PresetThumbnail, index.ts)

### 2026-01-02: BuilderLanding으로 전환
- **이유**: "AI가 만들어준다"에서 "사용자가 직접 선택한다"로 핵심 가치 전환
- **변경**: 템플릿 선택 → 섹션 프리셋 선택 → 에디터에서 완성 플로우
- **파일**: `src/components/landing/BuilderLanding.tsx`, `src/components/landing/builder/`, `src/components/landing/subway/`

### 2025-12-27: 편집 가능한 템플릿 v2 시스템 구축
- **이유**: 템플릿 이미지를 편집 가능한 Block/Element 구조로 전환
- **변경**: TemplateV2 인터페이스, 6개 템플릿 구현, Google Fonts 통합
- **파일**: `template-catalog-v2.ts`, `template-block-builder.ts`, `template-applier.ts`

### 2025-12-22: 새 문서 생성 시 샘플 데이터 제공
- **이유**: 편집 페이지 이동 시 빈 화면 표시 문제 해결
- **변경**: `SAMPLE_WEDDING_DATA` 상수, `getSampleWeddingDate()` 함수 추가
- **파일**: `schema/index.ts`, `actions/document.ts`

### 2025-12-15: Super Editor v2 블록 높이 기준 요소 위치 계산 수정
- **이유**: 블록 높이 조절 시 요소가 블록 밖으로 넘쳐서 다음 블록과 겹침
- **원인**: element-renderer에서 요소 y/height를 viewport.height 기준으로 계산함 (블록 높이 기준이 아님)
- **변경**:
  - `element-renderer.tsx`: y, height를 블록 높이 기준으로 계산
  - `block-renderer.tsx`: overflow: hidden 추가
  - `editable-canvas.tsx`: overflow: hidden 추가
- **파일**: `renderer/element-renderer.tsx`, `renderer/block-renderer.tsx`, `components/editor/direct/editable-canvas.tsx`

### 2025-12-15: Super Editor v2 커스텀 변수 시스템
- **이유**: AI가 새 텍스트 요소 추가 시 편집기에서 수정 불가 ("텍스트를 입력하세요" 표시)
- **변경**:
  - `VariablePath` 타입에 `custom.${string}` 패턴 허용
  - `WeddingData.custom` 필드 추가 (Record<string, string>)
  - AI 프롬프트에 커스텀 변수 생성 가이드 추가
  - ContentTab에서 바인딩 기준 dedupe (중복 필드 제거)
- **파일**: `types.ts`, `binding-resolver.ts`, `content-tab.tsx`, `ai/route.ts`

### 2025-12-02: 마이그레이션 구조 재정비
- **이유**: `updated_at` 컬럼 누락 에러 해결, 스키마와 DB 동기화
- **변경**: `drizzle-kit introspect`로 현재 DB 상태를 기준선으로 설정, FK 명시적 이름 지정
- **파일**: `src/lib/db/invitation-schema.ts`, `drizzle/migrations/`

## 마이그레이션 규칙
- 절대로 마이그레이션 파일을 직접 생성하지 말것 `drizzle-kit generate`를 활용한 생성만 할것
- 스키마 변경 시 `drizzle-kit generate` → `drizzle-kit migrate` 순서로 진행