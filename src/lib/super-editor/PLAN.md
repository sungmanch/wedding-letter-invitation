# Super Editor - React 전환 설계 문서

## 결정된 사항

| 항목 | 결정 |
|------|------|
| 섹션 구조 | LayoutSchema.screens에 sectionType 필드 추가 |
| 섹션 관리 | 인트로(1번) 고정, 나머지 순서 변경 가능, 토글 활성화 |
| AI 호출 | StyleSchema 먼저 생성 → 섹션들 병렬 생성 |
| 음악 저장 | DB 테이블 (super_editor_presets, category='music') |
| 라우트 | /se/[id] 별도 라우트 |
| 렌더링 | JSON → React (HTML 빌드 호환) |

---

## 현재 상태

### DB 테이블 관계
```
super_editor_templates (디자인 템플릿)
├── layoutSchema: LayoutSchema    # screens 배열 (sectionType 추가)
├── styleSchema: StyleSchema      # 테마/색상
├── editorSchema: EditorSchema    # 편집 필드 정의
└── is_paid: ❌ 없음 (템플릿은 재사용 가능)

super_editor_invitations (사용자 청첩장)
├── templateId: FK → templates
├── userData: UserData            # 사용자 입력 데이터
├── buildResult: HTML/CSS/JS      # 빌드 결과
├── sectionOrder: string[]        # 섹션 순서 (intro 제외)
├── sectionEnabled: Record<string, boolean>  # 섹션 활성화 상태
└── is_paid: ✅ 추가 필요

super_editor_presets (프리셋)
├── category: 'music' | 'animation' | ...
├── presetData: { url, title, artist, duration, ... }
└── ...
```

---

## 설계 항목

### 1. Screen 타입 확장

**수정 필요**: `src/lib/super-editor/schema/layout.ts`

```typescript
interface Screen {
  id: string
  name?: string
  type: ScreenType           // 기존: 'intro' | 'content' | ...
  sectionType: SectionType   // 추가: 'intro' | 'venue' | 'date' | ...
  root: PrimitiveNode
  // ...
}

type SectionType =
  | 'intro'      // 인트로 (순서 고정: 1번)
  | 'venue'      // 예식장 위치
  | 'date'       // 예식 날짜
  | 'gallery'    // 갤러리
  | 'parents'    // 부모님 정보
  | 'accounts'   // 계좌 정보
  | 'guestbook'  // 축하 메시지
  | 'music'      // 배경음악 (FAB 형태)
```

---

### 2. 8가지 섹션 Primitive 구조

각 섹션별로 정의 필요:
- 기본 PrimitiveNode 트리 구조
- 사용하는 데이터 바인딩 경로
- EditorSchema 필드 목록

| 섹션 | 주요 Primitive | 데이터 바인딩 |
|------|---------------|--------------|
| intro | fullscreen, image/video, text, animated | photos.main, couple.*, wedding.date |
| venue | map-embed, column, text, button | venue.* |
| date | container, text, conditional | wedding.date, wedding.time |
| gallery | gallery/carousel/collage | photos.gallery |
| parents | row, column, text, conditional | parents.groom.*, parents.bride.* |
| accounts | container, repeat, button | accounts.groom, accounts.bride |
| guestbook | input, button, repeat | guestbook.* |
| music | conditional, button (FAB) | bgm.presetId, bgm.enabled |

---

### 3. AI 빌드 파이프라인

```
[사용자 요청]
     │
     ▼
[1] StyleSchema 생성 (AI 호출 #1)
     │ 색상, 폰트, 애니메이션 설정
     ▼
[2] 섹션별 Screen 병렬 생성 (AI 호출 #2~9)
     │ StyleSchema를 컨텍스트로 전달
     │ 각 섹션 프롬프트 + 폴백 템플릿
     ▼
[3] EditorSchema 자동 생성
     │ 섹션별 필드 매핑
     ▼
[4] Template 저장
     │ layoutSchema.screens = [intro, venue, ...]
     ▼
[5] Invitation 생성
     │ sectionOrder, sectionEnabled 초기화
     ▼
[6] React 렌더링 / HTML 빌드
```

---

### 4. 섹션 순서/활성화 관리

**저장 위치**: `super_editor_invitations`

```typescript
// DB 컬럼 추가
sectionOrder: jsonb('section_order').$type<string[]>()
  // 예: ['venue', 'date', 'gallery', 'parents', 'accounts', 'guestbook']
  // intro, music은 제외 (intro는 항상 1번, music은 FAB)

sectionEnabled: jsonb('section_enabled').$type<Record<string, boolean>>()
  // 예: { venue: true, date: true, gallery: true, ... }
```

**렌더링 로직**:
```typescript
function getSortedSections(template, invitation) {
  const { screens } = template.layoutSchema
  const { sectionOrder, sectionEnabled } = invitation

  // 1. intro 항상 첫번째
  const intro = screens.find(s => s.sectionType === 'intro')

  // 2. 나머지 섹션 순서대로 + 활성화된 것만
  const ordered = sectionOrder
    .filter(type => sectionEnabled[type])
    .map(type => screens.find(s => s.sectionType === type))
    .filter(Boolean)

  // 3. music은 FAB로 별도 렌더링
  const music = screens.find(s => s.sectionType === 'music')

  return { intro, sections: ordered, musicFab: music }
}
```

---

### 5. 음악 프리셋 테이블

**기존 테이블 활용**: `super_editor_presets`

```typescript
// presetData 구조 (category='music')
interface MusicPresetData {
  url: string           // S3/CDN URL
  title: string         // 곡 제목
  artist: string        // 아티스트
  duration: number      // 초
  mood: string          // 'romantic' | 'classic' | 'modern' | 'acoustic'
}
```

---

### 6. 파일 구조 계획

```
src/lib/super-editor/
├── schema/
│   ├── layout.ts          # Screen에 sectionType 추가
│   └── section-types.ts   # SectionType 정의 (신규)
├── sections/
│   ├── index.ts           # 섹션 타입 export
│   ├── templates/         # 각 섹션 기본 JSON 템플릿
│   │   ├── intro.ts
│   │   ├── venue.ts
│   │   └── ...
│   └── editor-schemas/    # 각 섹션 EditorSchema
│       ├── intro.ts
│       ├── venue.ts
│       └── ...
├── prompts/
│   └── section-prompts/   # 섹션별 AI 프롬프트
│       ├── index.ts
│       ├── style-prompt.ts
│       ├── intro-prompt.ts
│       └── ...
├── utils/
│   ├── ai-response-parser.ts   # Zod 검증
│   └── section-manager.ts      # 순서/활성화 관리
└── renderers/
    ├── SectionRenderer.tsx     # 섹션 단위 렌더러
    └── InvitationBuilder.tsx   # 전체 오케스트레이터
```

---

## 다음 단계

### Phase 2: 섹션 구조 정의 (상세 설계 필요)
1. [ ] SectionType 타입 정의
2. [ ] Screen 타입에 sectionType 추가
3. [ ] 8가지 섹션별 기본 JSON 템플릿 작성
4. [ ] 8가지 섹션별 EditorSchema 작성
5. [ ] DB 스키마 수정 (sectionOrder, sectionEnabled, isPaid)

### Phase 3: AI 빌드 시스템 (상세 설계 필요)
1. [ ] StyleSchema 생성 프롬프트
2. [ ] 섹션별 생성 프롬프트
3. [ ] Zod 검증 스키마
4. [ ] 폴백 템플릿
5. [ ] 병렬 호출 로직

### Phase 4: React 렌더러 (상세 설계 필요)
1. [ ] SectionRenderer 구현
2. [ ] InvitationBuilder 구현
3. [ ] MusicPlayer 컴포넌트
4. [ ] 편집 UI 통합
