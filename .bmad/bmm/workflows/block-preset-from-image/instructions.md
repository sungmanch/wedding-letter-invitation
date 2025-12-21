# Block Preset from Image - Instructions

이 워크플로우는 이미지를 분석하여 super-editor-v2 block preset을 생성합니다.
대화형으로 진행되며, 개발자와 함께 구조를 완성해 나갑니다.

---

<step n="1" goal="이미지 수집" critical="true">

## 1.1 이미지 입력 요청

<ask>
**Block Preset 이미지 분석**

청첩장 디자인 이미지를 붙여넣어 주세요.

**지원하는 이미지:**
- 청첩장 섹션 스크린샷
- 디자인 목업
- 참고 디자인 이미지

**팁:**
- 하나의 블록(섹션)만 포함된 이미지가 분석에 가장 좋습니다
- 여러 섹션이 포함된 경우, 가장 분석하고 싶은 섹션을 알려주세요

이미지를 붙여넣거나 파일 경로를 입력해주세요:
</ask>

<action>사용자가 이미지를 제공할 때까지 대기</action>

</step>

---

<step n="2" goal="이미지 분석 및 구조 파악" critical="true">

## 2.1 레이아웃 구조 분석

<action>이미지를 상세히 분석하여 다음 정보를 추출</action>

### 분석 체크리스트

**1. 블록 타입 식별**
```
추정 BlockType: [hero | greeting | calendar | gallery | location | parents | contact | account | message | rsvp | quote | profile | timeline | video | notice | ending | custom]

판단 근거:
- 주요 콘텐츠: [예: 커플 이름, 날짜, 사진 등]
- 레이아웃 특성: [예: 풀스크린 이미지, 카드형, 리스트형]
- 기능적 목적: [예: 인트로, 정보 전달, 상호작용]
```

**2. 요소 분석**

각 UI 요소에 대해:
```
| # | 요소 타입 | 위치 (x%, y%) | 크기 (w%, h%) | 바인딩 경로 | 기본값/스타일 |
|---|----------|---------------|---------------|-------------|---------------|
| 1 | text     | (50, 10)      | (80, 8)       | couple.groom.name | 폰트: 세리프, 크기: 2xl |
| 2 | image    | (0, 20)       | (100, 60)     | photos.main | cover, overlay: 0.2 |
| 3 | text     | (50, 85)      | (60, 5)       | wedding.dateDisplay | 폰트: 산세리프 |
...
```

**3. 시각 스타일 분석**
```
색상 스킴:
- 배경: [예: #FFFFFF, gradient, 이미지]
- 주요 텍스트: [예: #1A1A1A]
- 강조/포인트: [예: #D4A574]

무드/분위기: [minimal | elegant | romantic | modern | cinematic | playful]

추천 테마 프리셋: [예: classic-ivory, minimal-light]
추천 타이포그래피: [예: classic-elegant, modern-minimal]
```

**4. 애니메이션 힌트**
```
추천 입장 애니메이션: [예: fade-in, slide-up, scale-fade-in]
스크롤 효과: [예: parallax, sticky, reveal]
```

## 2.2 분석 결과 제시

<action>분석 결과를 구조화하여 사용자에게 제시</action>

```markdown
## 이미지 분석 결과

### 블록 타입
**{{blockType}}** ({{blockTypeKo}})

### 감지된 요소들 ({{elementCount}}개)

{{#each elements}}
{{@index + 1}}. **{{type}}** @ ({{position.x}}%, {{position.y}}%)
   - 크기: {{size.width}}% x {{size.height}}%
   - 바인딩: `{{binding}}` {{#if defaultContent}}(기본값: "{{defaultContent}}"){{/if}}
   - 스타일: {{styleDescription}}
{{/each}}

### 시각 스타일
- 무드: {{mood}}
- 색상 스킴: {{colorScheme}}
- 추천 테마: {{recommendedTheme}}
- 추천 타이포그래피: {{recommendedTypography}}

### 데이터 바인딩 요약
**필수:**
{{#each requiredBindings}}
- `{{this}}`
{{/each}}

**선택:**
{{#each optionalBindings}}
- `{{this}}`
{{/each}}
```

<ask>
분석 결과를 검토해주세요.

[c] 계속 진행 (수정 없음)
[e] 요소 수정 (위치, 크기, 바인딩 등)
[t] 블록 타입 변경
[r] 이미지 재분석

선택:
</ask>

</step>

---

<step n="3" goal="구조 상세 조정" repeat="until_confirmed">

## 3.1 요소별 상세 설정

<check if="user_wants_edit">

<ask>
수정할 요소 번호를 선택하거나, 새로운 요소를 추가해주세요.

**현재 요소 목록:**
{{elements_summary}}

**가능한 작업:**
- `1` - 1번 요소 수정
- `add` - 새 요소 추가
- `remove 2` - 2번 요소 제거
- `done` - 수정 완료

입력:
</ask>

### 요소 수정 시 설정 가능한 항목

```yaml
element:
  type: text | image | shape | button | icon | divider | map | calendar
  position:
    x: 0-100  # vw 기준 중심점 X
    y: 0-100  # vh 기준 중심점 Y (블록 내 상대)
  size:
    width: 0-100   # vw 기준
    height: 0-100  # vh 기준
  rotation: 0      # degrees
  zIndex: 1        # 레이어 순서

  # 데이터 바인딩
  binding: couple.groom.name  # VariablePath
  # 또는 직접 값
  value: "정적 텍스트"

  # 타입별 props
  props:
    # text
    format: "{groom.name} ♥ {bride.name}"

    # image
    objectFit: cover | contain | fill
    overlay: "rgba(0,0,0,0.3)"

    # shape
    shape: rectangle | circle | line | heart | custom
    fill: "#FFFFFF"
    stroke: "#000000"
    strokeWidth: 1

    # button
    label: "버튼 텍스트"
    action: link | phone | map | copy | share

  # 스타일
  style:
    text:
      fontFamily: "Noto Serif KR"
      fontSize: 24
      fontWeight: 400
      color: "#1A1A1A"
      textAlign: left | center | right
      lineHeight: 1.6
      letterSpacing: 0.05
    background: "#FFFFFF" | gradient
    opacity: 1
```

</check>

## 3.2 바인딩 경로 확인

<action>사용된 바인딩 경로가 유효한지 확인</action>

유효한 VariablePath 목록 (일부):
```
# 커플 정보
couple.groom.name, couple.groom.phone, couple.groom.photo
couple.bride.name, couple.bride.phone, couple.bride.photo
couple.photo, couple.photos

# 결혼식 정보
wedding.date, wedding.time
wedding.dateDisplay, wedding.timeDisplay, wedding.dday
wedding.month, wedding.day, wedding.weekday

# 혼주
parents.groom.father.name, parents.groom.mother.name
parents.bride.father.name, parents.bride.mother.name

# 장소
venue.name, venue.hall, venue.address, venue.tel
venue.lat, venue.lng

# 사진
photos.main, photos.gallery

# 섹션별
greeting.title, greeting.content
accounts.groom, accounts.bride
rsvp.title, rsvp.description

# 커스텀 (AI 생성용)
custom.{anyKey}
```

<check if="invalid_binding_found">
<ask>
유효하지 않은 바인딩이 감지되었습니다: `{{invalid_binding}}`

**선택:**
1. 다른 경로로 변경 (추천: {{suggested_path}})
2. 커스텀 바인딩으로 전환 (`custom.{{suggested_key}}`)
3. 정적 값으로 변경

선택:
</ask>
</check>

</step>

---

<step n="4" goal="프리셋 메타데이터 설정">

## 4.1 프리셋 식별 정보

<ask>
**프리셋 ID 및 이름 설정**

현재 분석된 블록: `{{blockType}}`

프리셋 Variant 이름을 입력해주세요 (예: minimal, elegant, card-style)

**네이밍 규칙:**
- 소문자 + 하이픈 (kebab-case)
- 디자인 특성을 반영
- 예: `split-photo`, `centered-text`, `overlay-dark`

Variant 이름:
</ask>

<action>입력받은 variant로 preset ID 생성: `${blockType}-${variant}`</action>

<ask>
**한글 이름 입력**

프리셋의 한글 이름을 입력해주세요.
예: "스플릿 포토", "중앙 정렬", "다크 오버레이"

한글 이름:
</ask>

<ask>
**설명 입력**

이 프리셋의 특징을 간단히 설명해주세요.
예: "사진을 좌우로 분할하여 배치하는 모던한 레이아웃"

설명:
</ask>

## 4.2 태그 및 AI 힌트

<action>분석된 스타일에서 자동 태그 추출</action>

```yaml
tags:
  - {{detected_mood}}      # minimal, elegant, romantic, modern 등
  - {{layout_type}}        # centered, split, overlay, card 등
  - {{color_scheme_tag}}   # light, dark, colorful 등

aiHints:
  mood: [{{mood_hints}}]
  style: [{{style_hints}}]
  useCase: [{{useCase_hints}}]
```

<ask>
**자동 추출된 태그 확인**

태그: {{auto_tags}}

수정이 필요하면 입력해주세요. (쉼표로 구분)
그대로 사용하려면 Enter를 누르세요.

태그:
</ask>

</step>

---

<step n="5" goal="최종 확인 및 코드 생성" critical="true">

## 5.1 프리셋 구조 최종 검토

<action>완성된 BlockPreset 객체를 표시</action>

```typescript
// Preview: {{preset_id}}
const {{PRESET_CONST_NAME}}: BlockPreset = {
  id: '{{preset_id}}',
  blockType: '{{blockType}}',
  variant: '{{variant}}',
  name: '{{name}}',
  nameKo: '{{nameKo}}',
  description: '{{description}}',
  tags: [{{tags}}] as const,

  elements: [
    {{#each elements}}
    {
      type: '{{type}}',
      role: '{{role}}',
      position: { x: {{position.x}}, y: {{position.y}} },
      size: { width: {{size.width}}, height: {{size.height}} },
      {{#if binding}}binding: '{{binding}}',{{/if}}
      {{#if defaultContent}}defaultContent: '{{defaultContent}}',{{/if}}
      {{#if tokenStyle}}tokenStyle: {{tokenStyle}},{{/if}}
    },
    {{/each}}
  ],

  bindings: [{{bindings}}] as const,

  {{#if recommendedAnimations}}
  recommendedAnimations: [{{recommendedAnimations}}] as const,
  {{/if}}

  {{#if recommendedThemes}}
  recommendedThemes: [{{recommendedThemes}}] as const,
  {{/if}}

  {{#if layoutOptions}}
  layoutOptions: {{layoutOptions}},
  {{/if}}

  aiHints: {
    mood: [{{aiHints.mood}}],
    style: [{{aiHints.style}}],
    useCase: [{{aiHints.useCase}}],
  },
}
```

<ask>
**최종 확인**

위 프리셋 코드를 검토해주세요.

[g] 코드 생성 및 파일에 추가
[e] 수정하기
[c] 복사만 (파일 수정 없음)
[a] 처음부터 다시

선택:
</ask>

## 5.2 파일 생성/업데이트

<check if="user_selected_generate">

<action>block-presets.ts 파일 존재 여부 확인</action>

<check if="file_exists">
<action>기존 파일에 새 프리셋 추가</action>
<action>적절한 위치 (같은 BlockType 그룹) 에 삽입</action>
<action>PresetId 타입에 새 ID 추가</action>
<action>BLOCK_PRESETS 레지스트리에 추가</action>
</check>

<check if="file_not_exists">
<action>새 block-presets.ts 파일 생성</action>
<action>기본 인터페이스와 함께 첫 프리셋 작성</action>
</check>

### 생성된 코드 위치

```
src/lib/super-editor-v2/presets/block-presets.ts

추가된 항목:
1. {{BLOCK_TYPE}}PresetId에 '{{preset_id}}' 추가
2. {{BLOCK_TYPE}}_PRESETS에 프리셋 객체 추가
3. BLOCK_PRESETS 레지스트리 업데이트
```

</check>

</step>

---

<step n="6" goal="검증 및 완료">

## 6.1 타입 체크

<action>TypeScript 컴파일러로 타입 오류 확인</action>

```bash
npx tsc --noEmit src/lib/super-editor-v2/presets/block-presets.ts
```

<check if="type_errors">
<action>오류 수정 제안</action>
<ask>타입 오류가 발견되었습니다. 자동 수정을 진행할까요? [y/n]</ask>
</check>

## 6.2 완료 요약

```markdown
## Block Preset 생성 완료

**프리셋 ID:** `{{preset_id}}`
**블록 타입:** {{blockType}} ({{blockTypeKo}})
**Variant:** {{variant}}

### 생성된 요소
{{#each elements}}
- {{type}}: {{#if binding}}`{{binding}}`{{else}}"{{defaultContent}}"{{/if}}
{{/each}}

### 데이터 바인딩
- 필수: {{requiredBindingsCount}}개
- 선택: {{optionalBindingsCount}}개

### 파일 업데이트
- `src/lib/super-editor-v2/presets/block-presets.ts` {{#if file_updated}}(수정됨){{else}}(새로 생성){{/if}}

### 다음 단계
1. 프리뷰에서 렌더링 테스트
2. 필요시 스타일 미세 조정
3. AI 프롬프트에서 사용 가능
```

<ask>
추가로 다른 이미지를 분석하시겠습니까?

[n] 새 이미지 분석
[q] 워크플로우 종료

선택:
</ask>

<check if="new_image">
<goto step="1" />
</check>

</step>

---

## 부록: VariablePath 전체 목록

```typescript
type VariablePath =
  // 커플
  | 'couple.groom.name' | 'couple.groom.phone' | 'couple.groom.intro'
  | 'couple.groom.photo' | 'couple.groom.birthDate' | 'couple.groom.mbti' | 'couple.groom.tags'
  | 'couple.bride.name' | 'couple.bride.phone' | 'couple.bride.intro'
  | 'couple.bride.photo' | 'couple.bride.birthDate' | 'couple.bride.mbti' | 'couple.bride.tags'
  | 'couple.photo' | 'couple.photos'

  // 결혼식
  | 'wedding.date' | 'wedding.time'
  | 'wedding.dateDisplay' | 'wedding.timeDisplay' | 'wedding.dday'
  | 'wedding.month' | 'wedding.day' | 'wedding.weekday'
  | 'countdown.days' | 'countdown.hours' | 'countdown.minutes' | 'countdown.seconds'

  // 혼주
  | 'parents.deceasedIcon'
  | 'parents.groom.father.name' | 'parents.groom.father.status' | 'parents.groom.father.phone'
  | 'parents.groom.mother.name' | 'parents.groom.mother.status' | 'parents.groom.mother.phone'
  | 'parents.bride.father.name' | 'parents.bride.father.status' | 'parents.bride.father.phone'
  | 'parents.bride.mother.name' | 'parents.bride.mother.status' | 'parents.bride.mother.phone'

  // 장소
  | 'venue.name' | 'venue.hall' | 'venue.address' | 'venue.tel'
  | 'venue.lat' | 'venue.lng'
  | 'venue.naverUrl' | 'venue.kakaoUrl' | 'venue.tmapUrl'
  | 'venue.transportation.bus' | 'venue.transportation.subway'
  | 'venue.transportation.shuttle' | 'venue.transportation.parking'

  // 사진
  | 'photos.main' | 'photos.gallery'

  // 섹션별
  | 'intro.message'
  | 'greeting.title' | 'greeting.content'
  | 'contact.showParents'
  | 'gallery.effect'
  | 'accounts.groom' | 'accounts.bride' | 'accounts.kakaopay.groom' | 'accounts.kakaopay.bride'
  | 'rsvp.title' | 'rsvp.description' | 'rsvp.deadline'
  | 'notice.items'
  | 'guestbook.title' | 'guestbook.placeholder'
  | 'ending.message' | 'ending.photo'
  | 'bgm.trackId' | 'bgm.title' | 'bgm.artist'
  | 'video.type' | 'video.url' | 'video.title'
  | 'interview.title' | 'interview.subtitle' | 'interview.items'
  | 'timeline.title' | 'timeline.subtitle' | 'timeline.items'

  // 커스텀
  | `custom.${string}`
```
