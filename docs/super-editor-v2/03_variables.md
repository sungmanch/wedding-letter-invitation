# Super Editor v2 - 변수 시스템

> **목표**: AI가 확장 가능하고, 에디터 UI가 자동 생성되는 유연한 변수 시스템
> **핵심 원칙**: 타입 정의 기반 에디터 렌더링 + Computed Field 분리

---

## 1. 설계 원칙

### 1.1 핵심 결정사항

| 항목 | 결정 |
|------|------|
| **타입 시스템** | Primitive + Compound + Computed 3계층 |
| **에디터 UI** | 변수 정의에서 타입을 찾아 자동 렌더링 |
| **AI 확장** | 기본 타입 조합으로 새 변수 정의 가능 |
| **입력 방식** | `inputMethod`로 특수 에디터 지정 (주소 검색, 은행 선택 등) |
| **계산 필드** | 입력 불가, 의존 변수 변경 시 자동 재계산 |

### 1.2 에디터 렌더링 흐름

```
블록에서 binding 발견
    ↓
AVAILABLE_VARIABLES에서 타입 정의 조회
    ↓
타입에 맞는 에디터 컴포넌트 렌더링
    ↓
inputMethod 있으면 특수 에디터 사용
```

---

## 2. 타입 시스템

### 2.1 Primitive Types (기본 타입)

단일 값을 저장하는 원자적 타입.

```typescript
type PrimitiveType =
  | 'text'      // 단일 문자열
  | 'longtext'  // 여러 줄 텍스트
  | 'number'    // 숫자
  | 'boolean'   // 참/거짓
  | 'phone'     // 전화번호
  | 'date'      // 날짜 (ISO 8601: 2025-03-15)
  | 'time'      // 시간 (HH:mm: 14:00)
  | 'image'     // 이미지 URL
  | 'url'       // 일반 URL
```

**에디터 컴포넌트 매핑:**

| 타입 | 에디터 컴포넌트 | 예시 |
|-----|----------------|------|
| `text` | `<TextInput />` | 신랑 이름 |
| `longtext` | `<Textarea />` | 인사말 내용 |
| `number` | `<NumberInput />` | 지도 줌 레벨 |
| `boolean` | `<Toggle />` | 자동 재생 여부 |
| `phone` | `<PhoneInput />` | 010-1234-5678 |
| `date` | `<DatePicker />` | 2025-03-15 |
| `time` | `<TimePicker />` | 14:00 |
| `image` | `<ImageUploader />` | 메인 사진 |
| `url` | `<UrlInput />` | 음악 URL |

### 2.2 Compound Types (복합 타입)

여러 필드를 가진 구조화된 타입.

```typescript
interface CompoundTypeDefinition {
  type: 'compound'
  label: string
  inputMethod?: InputMethod
  fields: Record<string, FieldDefinition>
}

type InputMethod =
  | 'default'         // 필드별 개별 입력
  | 'address-search'  // 주소 검색 → address, coordinates 자동
  | 'bank-select'     // 은행 선택 드롭다운
  | 'image-upload'    // 이미지 업로드 → url, width, height 자동

interface FieldDefinition {
  type: PrimitiveType | 'compound'
  label: string
  input?: 'manual' | 'auto'  // auto면 에디터에서 숨김
  fields?: Record<string, FieldDefinition>  // nested compound
}
```

**특수 입력 방식:**

| inputMethod | 동작 | 자동 채워지는 필드 |
|-------------|------|-------------------|
| `address-search` | 카카오/네이버 주소 API | address, coordinates.lat, coordinates.lng |
| `bank-select` | 은행 선택 드롭다운 | bank |
| `image-upload` | 이미지 업로드 후 처리 | url, thumbnailUrl, width, height |

### 2.3 Array Types (배열 타입)

같은 타입의 항목을 여러 개 저장.

```typescript
interface ArrayTypeDefinition {
  type: 'array'
  label: string
  itemType: CompoundTypeDefinition | PrimitiveType
  maxItems?: number
}
```

### 2.4 Record Types (레코드 타입)

동적 키-값 저장. AI 확장용.

```typescript
interface RecordTypeDefinition {
  type: 'record'
  label: string
  keyType: 'text'
  valueTypes: PrimitiveType[]
  aiExtensible: boolean
}
```

### 2.5 Computed Types (계산 타입)

다른 변수에서 자동 계산. 에디터 UI 없음.

```typescript
interface ComputedFieldDefinition {
  type: 'computed'
  label: string
  returnType: PrimitiveType
  dependsOn: string[]  // 의존 변수 경로
  compute: (data: WeddingData) => unknown
}
```

---

## 3. AVAILABLE_VARIABLES

### 3.1 신랑 정보 (groom)

```typescript
groom: {
  type: 'compound',
  label: '신랑 정보',
  fields: {
    name: { type: 'text', label: '이름' },
    nameEn: { type: 'text', label: '영문명' },
    fatherName: { type: 'text', label: '아버지 성함' },
    motherName: { type: 'text', label: '어머니 성함' },
    fatherPhone: { type: 'phone', label: '아버지 연락처' },
    motherPhone: { type: 'phone', label: '어머니 연락처' },
    phone: { type: 'phone', label: '연락처' },
    account: {
      type: 'compound',
      label: '계좌',
      inputMethod: 'bank-select',
      fields: {
        bank: { type: 'text', label: '은행' },
        number: { type: 'text', label: '계좌번호' },
        holder: { type: 'text', label: '예금주' },
      }
    },
  }
}
```

### 3.2 신부 정보 (bride)

```typescript
bride: {
  type: 'compound',
  label: '신부 정보',
  fields: {
    name: { type: 'text', label: '이름' },
    nameEn: { type: 'text', label: '영문명' },
    fatherName: { type: 'text', label: '아버지 성함' },
    motherName: { type: 'text', label: '어머니 성함' },
    fatherPhone: { type: 'phone', label: '아버지 연락처' },
    motherPhone: { type: 'phone', label: '어머니 연락처' },
    phone: { type: 'phone', label: '연락처' },
    account: {
      type: 'compound',
      label: '계좌',
      inputMethod: 'bank-select',
      fields: {
        bank: { type: 'text', label: '은행' },
        number: { type: 'text', label: '계좌번호' },
        holder: { type: 'text', label: '예금주' },
      }
    },
  }
}
```

### 3.3 예식 정보 (wedding)

```typescript
wedding: {
  type: 'compound',
  label: '예식 정보',
  fields: {
    date: { type: 'date', label: '예식 날짜' },
    time: { type: 'time', label: '예식 시간' },
  }
}
```

### 3.4 예식장 정보 (venue)

```typescript
venue: {
  type: 'compound',
  label: '예식장 정보',
  inputMethod: 'address-search',
  fields: {
    name: { type: 'text', label: '예식장명', input: 'manual' },
    hall: { type: 'text', label: '홀', input: 'manual' },
    floor: { type: 'text', label: '층', input: 'manual' },
    address: { type: 'text', label: '주소', input: 'auto' },
    addressDetail: { type: 'text', label: '상세 주소', input: 'manual' },
    coordinates: {
      type: 'compound',
      label: '좌표',
      input: 'auto',
      fields: {
        lat: { type: 'number', label: '위도' },
        lng: { type: 'number', label: '경도' },
      }
    },
    phone: { type: 'phone', label: '예식장 연락처', input: 'manual' },
    parkingInfo: { type: 'longtext', label: '주차 안내', input: 'manual' },
    transportInfo: { type: 'longtext', label: '교통 안내', input: 'manual' },
  }
}
```

### 3.5 사진 (photos)

```typescript
photos: {
  type: 'compound',
  label: '사진',
  fields: {
    main: {
      type: 'compound',
      label: '메인 사진',
      inputMethod: 'image-upload',
      fields: {
        url: { type: 'url', label: 'URL', input: 'auto' },
        thumbnailUrl: { type: 'url', label: '썸네일', input: 'auto' },
        alt: { type: 'text', label: '설명' },
        width: { type: 'number', label: '너비', input: 'auto' },
        height: { type: 'number', label: '높이', input: 'auto' },
      }
    },
    gallery: {
      type: 'array',
      label: '갤러리',
      itemType: {
        type: 'compound',
        inputMethod: 'image-upload',
        fields: {
          url: { type: 'url', label: 'URL', input: 'auto' },
          thumbnailUrl: { type: 'url', label: '썸네일', input: 'auto' },
          alt: { type: 'text', label: '설명' },
          width: { type: 'number', label: '너비', input: 'auto' },
          height: { type: 'number', label: '높이', input: 'auto' },
        }
      },
      maxItems: 60,
    }
  }
}
```

### 3.6 인사말 (greeting)

```typescript
greeting: {
  type: 'compound',
  label: '인사말',
  fields: {
    title: { type: 'text', label: '제목' },
    content: { type: 'longtext', label: '내용' },
  }
}
```

### 3.7 추가 계좌 (additionalAccounts)

```typescript
additionalAccounts: {
  type: 'array',
  label: '추가 계좌',
  itemType: {
    type: 'compound',
    inputMethod: 'bank-select',
    fields: {
      side: { type: 'text', label: '신랑/신부측' },  // 'groom' | 'bride'
      relation: { type: 'text', label: '관계' },
      bank: { type: 'text', label: '은행' },
      number: { type: 'text', label: '계좌번호' },
      holder: { type: 'text', label: '예금주' },
    }
  },
  maxItems: 10,
}
```

### 3.8 음악 (music)

```typescript
music: {
  type: 'compound',
  label: '배경 음악',
  fields: {
    url: { type: 'url', label: '음악 URL' },
    title: { type: 'text', label: '곡 제목' },
    artist: { type: 'text', label: '아티스트' },
    autoPlay: { type: 'boolean', label: '자동 재생' },
  }
}
```

### 3.9 방명록 (guestbook)

```typescript
guestbook: {
  type: 'compound',
  label: '방명록',
  fields: {
    enabled: { type: 'boolean', label: '사용 여부' },
    requirePassword: { type: 'boolean', label: '비밀번호 필요' },
  }
}
```

### 3.10 커스텀 확장 (custom)

AI가 자유롭게 확장할 수 있는 영역.

```typescript
custom: {
  type: 'record',
  label: '커스텀 데이터',
  keyType: 'text',
  valueTypes: ['text', 'longtext', 'image', 'url', 'number'],
  aiExtensible: true,
}
```

**AI 확장 예시:**
```typescript
// 사용자: "반려견 소개 섹션 추가해줘"
// AI가 custom에 추가:
custom: {
  petName: "콩이",
  petPhoto: "https://...",
  petDescription: "우리의 첫째 아이입니다"
}
```

---

## 4. COMPUTED_FIELDS

에디터 UI 없이 자동 계산되는 필드.

### 4.1 D-day

```typescript
'wedding.dday': {
  type: 'computed',
  label: 'D-day',
  returnType: 'number',
  dependsOn: ['wedding.date'],
  compute: (data: WeddingData) => {
    if (!data.wedding?.date) return null
    const weddingDate = new Date(data.wedding.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }
}
```

### 4.2 날짜 표시 (한글)

```typescript
'wedding.dateDisplay': {
  type: 'computed',
  label: '날짜 (한글)',
  returnType: 'text',
  dependsOn: ['wedding.date'],
  compute: (data: WeddingData) => {
    if (!data.wedding?.date) return ''
    const d = new Date(data.wedding.date)
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`
  }
}
// 출력: "2025년 3월 15일 토요일"
```

### 4.3 시간 표시 (한글)

```typescript
'wedding.timeDisplay': {
  type: 'computed',
  label: '시간 (한글)',
  returnType: 'text',
  dependsOn: ['wedding.time'],
  compute: (data: WeddingData) => {
    if (!data.wedding?.time) return ''
    const [h, m] = data.wedding.time.split(':').map(Number)
    const period = h < 12 ? '오전' : '오후'
    const hour = h > 12 ? h - 12 : h
    return m === 0 ? `${period} ${hour}시` : `${period} ${hour}시 ${m}분`
  }
}
// 출력: "오후 2시"
```

### 4.4 날짜+시간 표시 (한글)

```typescript
'wedding.dateTimeDisplay': {
  type: 'computed',
  label: '날짜+시간 (한글)',
  returnType: 'text',
  dependsOn: ['wedding.date', 'wedding.time'],
  compute: (data: WeddingData) => {
    const dateDisplay = COMPUTED_FIELDS['wedding.dateDisplay'].compute(data)
    const timeDisplay = COMPUTED_FIELDS['wedding.timeDisplay'].compute(data)
    if (!dateDisplay) return ''
    return timeDisplay ? `${dateDisplay} ${timeDisplay}` : dateDisplay
  }
}
// 출력: "2025년 3월 15일 토요일 오후 2시"
```

---

## 5. 변수 바인딩 해석

### 5.1 단순 바인딩

```typescript
// 블록 요소
{ type: 'text', binding: 'groom.name' }

// 해석
const value = getValueByPath(data, 'groom.name')
// → "김철수"
```

### 5.2 복합 포맷

```typescript
// 블록 요소
{
  type: 'text',
  props: {
    format: '{groom.name} ♥ {bride.name}'
  }
}

// 해석
const value = interpolate(format, data)
// → "김철수 ♥ 이영희"
```

### 5.3 Computed 바인딩

```typescript
// 블록 요소
{ type: 'text', binding: 'wedding.dday' }

// 해석
1. AVAILABLE_VARIABLES에서 찾기 → 없음
2. COMPUTED_FIELDS에서 찾기 → 있음
3. compute 함수 실행
// → 30 (D-30)
```

### 5.4 배열 인덱스 바인딩

```typescript
// 블록 요소
{ type: 'image', binding: 'photos.gallery[0].url' }

// 해석
const value = getValueByPath(data, 'photos.gallery[0].url')
// → "https://..."
```

---

## 6. AI 변수 생성 규칙

### 6.1 허용되는 작업

| 작업 | 허용 | 예시 |
|-----|------|------|
| 기존 변수 값 수정 | ✅ | groom.name = "홍길동" |
| 배열에 항목 추가 | ✅ | additionalAccounts.push({...}) |
| custom 영역 확장 | ✅ | custom.petName = "콩이" |
| 기본 타입 조합으로 새 변수 | ✅ | compound + primitive 조합 |

### 6.2 제한되는 작업

| 작업 | 제한 | 이유 |
|-----|------|------|
| 새 primitive 타입 정의 | ❌ | 에디터 컴포넌트 없음 |
| 기존 변수 타입 변경 | ❌ | 스키마 불일치 |
| 고정 변수 삭제 | ❌ | 필수 데이터 손실 |

### 6.3 AI 확장 변수 스키마

AI가 새 변수를 추가할 때는 **타입 정의와 값을 함께 제출**해야 합니다.

```typescript
interface AIVariableExtension {
  // 변수 경로 (custom. 접두사 필수)
  path: `custom.${string}`

  // 타입 정의 (에디터 UI 자동 생성용)
  definition: VariableDefinition

  // 초기값
  value: unknown
}

// AI 출력 형식 (JSON Patch 확장)
interface AIOutputWithVariables {
  analysis: { intent: string, affectedProperties: string[], approach: string }
  patches: JsonPatch[]

  // 신규: 변수 확장
  variableExtensions?: AIVariableExtension[]

  explanation: string
}
```

**AI 확장 검증 로직:**

```typescript
function validateVariableExtension(ext: AIVariableExtension): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // 1. 경로 검증 (custom. 접두사 필수)
  if (!ext.path.startsWith('custom.')) {
    errors.push(`확장 변수는 custom. 접두사 필요: ${ext.path}`)
  }

  // 2. 타입 정의 검증
  if (!isValidVariableDefinition(ext.definition)) {
    errors.push(`유효하지 않은 타입 정의: ${ext.path}`)
  }

  // 3. 허용된 기본 타입만 사용 가능
  const allowedPrimitives = ['text', 'longtext', 'number', 'boolean', 'phone', 'date', 'time', 'image', 'url']
  const usedTypes = extractAllTypes(ext.definition)
  for (const t of usedTypes) {
    if (!allowedPrimitives.includes(t) && t !== 'compound' && t !== 'array') {
      errors.push(`허용되지 않은 타입: ${t}`)
    }
  }

  // 4. 값과 타입 일치 검증
  if (!validateValueMatchesDefinition(ext.value, ext.definition)) {
    errors.push(`값이 타입 정의와 불일치: ${ext.path}`)
  }

  // 5. 중첩 깊이 제한 (최대 3단계)
  const depth = calculateDefinitionDepth(ext.definition)
  if (depth > 3) {
    warnings.push(`중첩 깊이 ${depth} - 단순화 권장`)
  }

  // 6. 필드 개수 제한 (compound당 최대 10개)
  if (ext.definition.type === 'compound') {
    const fieldCount = Object.keys(ext.definition.fields || {}).length
    if (fieldCount > 10) {
      warnings.push(`필드 개수 ${fieldCount} - 분리 권장`)
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}

function isValidVariableDefinition(def: unknown): def is VariableDefinition {
  if (!def || typeof def !== 'object') return false
  const d = def as Record<string, unknown>

  // 필수: type, label
  if (typeof d.type !== 'string' || typeof d.label !== 'string') return false

  // compound면 fields 필수
  if (d.type === 'compound') {
    if (!d.fields || typeof d.fields !== 'object') return false
    // 재귀 검증
    for (const field of Object.values(d.fields)) {
      if (!isValidVariableDefinition(field)) return false
    }
  }

  // array면 itemType 필수
  if (d.type === 'array') {
    if (!d.itemType) return false
  }

  return true
}
```

### 6.4 AI 확장 예시

```json
// 사용자: "반려동물 소개 섹션 추가해줘"

// AI 응답
{
  "analysis": {
    "intent": "반려동물 소개 섹션 추가",
    "affectedProperties": ["custom", "blocks"],
    "approach": "custom 변수에 pet 정의 추가 후 custom 블록 생성"
  },
  "patches": [
    {
      "op": "add",
      "path": "/blocks/-",
      "value": {
        "id": "block-pet",
        "type": "custom",
        "enabled": true,
        "height": 50,
        "elements": [
          { "id": "pet-photo", "type": "image", "binding": "custom.pet.photo", "x": 50, "y": 20, "width": 40, "height": 30 },
          { "id": "pet-name", "type": "text", "binding": "custom.pet.name", "x": 50, "y": 55, "width": 80, "height": 10 },
          { "id": "pet-desc", "type": "text", "binding": "custom.pet.description", "x": 50, "y": 70, "width": 80, "height": 20 }
        ]
      }
    }
  ],
  "variableExtensions": [
    {
      "path": "custom.pet",
      "definition": {
        "type": "compound",
        "label": "반려동물",
        "aiGenerated": true,
        "fields": {
          "name": { "type": "text", "label": "이름" },
          "photo": { "type": "image", "label": "사진", "inputMethod": "image-upload" },
          "description": { "type": "longtext", "label": "소개" }
        }
      },
      "value": {
        "name": "",
        "photo": null,
        "description": ""
      }
    }
  ],
  "explanation": "반려동물 소개 섹션을 추가했습니다. 편집 패널에서 이름, 사진, 소개를 입력할 수 있습니다."
}
```

→ 에디터가 `variableExtensions`의 definition을 보고 입력 UI 자동 생성

---

## 7. 에디터 렌더링 로직

### 7.1 메인 로직

```typescript
function renderVariableEditor(path: string) {
  // 1. Computed 필드 체크 → 렌더링 안 함
  if (COMPUTED_FIELDS[path]) {
    return null  // 읽기 전용
  }

  // 2. 변수 정의 조회
  const definition = getDefinitionByPath(AVAILABLE_VARIABLES, path)

  // 3. 타입별 렌더링
  switch (definition.type) {
    case 'compound':
      return <CompoundEditor
        definition={definition}
        inputMethod={definition.inputMethod}
      />
    case 'array':
      return <ArrayEditor
        definition={definition}
        maxItems={definition.maxItems}
      />
    case 'record':
      return <RecordEditor definition={definition} />
    default:
      return <PrimitiveEditor type={definition.type} />
  }
}
```

### 7.2 Compound 에디터

```typescript
function CompoundEditor({ definition, inputMethod }) {
  // 특수 입력 방식
  if (inputMethod === 'address-search') {
    return <AddressSearchEditor definition={definition} />
  }
  if (inputMethod === 'bank-select') {
    return <BankSelectEditor definition={definition} />
  }
  if (inputMethod === 'image-upload') {
    return <ImageUploadEditor definition={definition} />
  }

  // 기본: 필드별 재귀 렌더링
  return (
    <fieldset>
      <legend>{definition.label}</legend>
      {Object.entries(definition.fields)
        .filter(([_, field]) => field.input !== 'auto')
        .map(([key, field]) => (
          <Field key={key} label={field.label}>
            {renderVariableEditor(`${path}.${key}`)}
          </Field>
        ))}
    </fieldset>
  )
}
```

---

## 8. 다음 단계

- [x] `01_data_schema.md` - 블록/요소 구조
- [x] `02_animation_system.md` - 애니메이션 시스템
- [x] `03_variables.md` - 변수 시스템 (현재 문서)
- [ ] `04_editor_ui.md` - 에디터 UI 컴포넌트 설계
- [ ] `05_renderer.md` - 렌더링 시스템 + 변수 해석 런타임
- [ ] `06_ai_prompts.md` - AI 프롬프트 템플릿 + 변수 생성 가이드
