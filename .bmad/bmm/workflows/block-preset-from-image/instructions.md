# Block Preset from Image - Instructions

이 워크플로우는 이미지를 분석하여 super-editor-v2 block preset을 생성합니다.
대화형으로 진행되며, 개발자와 함께 구조를 완성해 나갑니다.

---

## ⚠️ 핵심 원칙: Auto Layout First

**Hero 블록을 제외한 모든 블록은 Auto Layout을 기본으로 사용합니다.**

| 블록 타입 | 레이아웃 모드 | 이유 |
|----------|--------------|------|
| `hero` | **absolute** | 배경 이미지 중심, 정밀 배치 필요 |
| 그 외 모든 블록 | **auto** | 텍스트 오버플로우 방지, 콘텐츠 가변 대응 |

---

## 참조 문서

필요 시 아래 문서를 `Read` 도구로 로드하세요:

| 문서 | 경로 | 용도 |
|------|------|------|
| Auto Layout | `references/auto-layout.md` | SizeMode, 블록별 권장 설정 |
| 컬러 시스템 | `references/color-system.md` | P-S-T 컬러, 시맨틱 토큰 |
| 타이포그래피 | `references/typography.md` | 3-Family 폰트, 타입 스케일 |
| VariablePath | `references/variable-paths.md` | 바인딩 경로 전체 목록 |
| Auto 요소 템플릿 | `references/element-templates/auto-element.md` | text, image, button 등 |
| Absolute 요소 템플릿 | `references/element-templates/absolute-element.md` | 장식, Hero 요소 |
| Group 요소 템플릿 | `references/element-templates/group-element.md` | 중첩 레이아웃 |
| 코드 템플릿 | `references/preset-code-template.md` | 최종 TypeScript 코드 |

---

## 워크플로우 단계

### Step 1: 이미지 수집

<ask>
**Block Preset 이미지 분석**

청첩장 디자인 이미지를 붙여넣어 주세요.

**팁:**
- 하나의 블록(섹션)만 포함된 이미지가 분석에 가장 좋습니다
- 여러 섹션이 포함된 경우, 가장 분석하고 싶은 섹션을 알려주세요
</ask>

---

### Step 2: 이미지 분석

이미지를 분석하여 다음을 추출합니다:

**1. 블록 타입 식별**
```
BlockType: hero | greeting-parents | profile | calendar | gallery | rsvp | location | notice | account | message | ending
```

**2. 레이아웃 모드 결정**
- `hero` → `layout.mode: 'absolute'`
- 그 외 → `layout.mode: 'auto'` (Auto Layout First!)

**3. 요소 분석**
- Auto Layout 요소: sizing, constraints, 바인딩
- Absolute 요소 (장식): x, y, width, height, zIndex

**4. 스타일 분석**
- 컬러: P-S-T 시스템 (Primary, Secondary, Tertiary)
- 폰트: 3-Family (display, heading, body)

<action>
상세 분석이 필요하면 관련 참조 문서를 로드하세요:
- `Read references/auto-layout.md` (레이아웃 상세)
- `Read references/color-system.md` (컬러 토큰)
- `Read references/typography.md` (폰트 설정)
</action>

---

### Step 3: 분석 결과 제시

```markdown
## 이미지 분석 결과

### 블록 타입 & 레이아웃
- **타입**: {{blockType}}
- **모드**: {{layoutMode}} (auto/absolute)

### 감지된 요소들 ({{count}}개)
1. {{type}} - {{binding}} - {{role}}
2. ...

### 컬러 시스템
- Primary: {{color}}
- 추천 테마: {{themePreset}}

### 타이포그래피
- 추천 프리셋: {{typographyPreset}}
```

<ask>
[c] 계속 진행
[e] 요소 수정
[t] 블록 타입 변경
[r] 이미지 재분석
</ask>

---

### Step 4: 구조 상세 조정

요소 수정이 필요한 경우:

<action>
요소 템플릿이 필요하면 로드하세요:
- `Read references/element-templates/auto-element.md`
- `Read references/element-templates/absolute-element.md`
- `Read references/element-templates/group-element.md`

바인딩 경로 확인이 필요하면:
- `Read references/variable-paths.md`
</action>

---

### Step 5: 프리셋 메타데이터

<ask>
**프리셋 Variant 이름** (kebab-case)
예: minimal, elegant, card-style, split-photo

**한글 이름**
예: "스플릿 포토", "중앙 정렬"

**설명**
예: "사진을 좌우로 분할하여 배치하는 모던한 레이아웃"
</ask>

---

### Step 6: 코드 생성

<action>
코드 템플릿을 로드하세요:
- `Read references/preset-code-template.md`
</action>

최종 TypeScript 코드를 생성하고 파일에 저장합니다.

**파일 위치:**
```
src/lib/super-editor-v2/presets/blocks/{{blockType}}/{{variant}}.ts
```

<ask>
[g] 코드 생성 및 파일에 추가
[e] 수정하기
[c] 복사만 (파일 수정 없음)
</ask>

---

### Step 7: 검증

```bash
npx tsc --noEmit src/lib/super-editor-v2/presets/blocks/{{blockType}}/{{variant}}.ts
```

---

## 완료

```markdown
## Block Preset 생성 완료

**프리셋 ID:** {{blockType}}-{{variant}}
**파일:** src/lib/super-editor-v2/presets/blocks/{{blockType}}/{{variant}}.ts

### 다음 단계
1. 프리뷰에서 렌더링 테스트
2. 필요시 스타일 미세 조정
```

<ask>
[n] 새 이미지 분석
[q] 워크플로우 종료
</ask>
