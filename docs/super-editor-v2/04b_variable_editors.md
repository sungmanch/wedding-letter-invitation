# Super Editor v2 - 변수 기반 에디터

> **목표**: 변수 타입 정의에서 자동으로 적절한 에디터 UI 렌더링
> **핵심 원칙**: 타입 기반 자동 생성 + 특수 입력 방식 지원

---

## 1. VariableFieldGroup

바운딩된 변수들을 그룹화하여 렌더링.

```typescript
interface VariableFieldGroupProps {
  variables: string[]  // ['groom.name', 'groom.phone', 'bride.name', ...]
  data: WeddingData
  onChange: (path: string, value: unknown) => void
}

function VariableFieldGroup({ variables, data, onChange }: VariableFieldGroupProps) {
  // 변수를 최상위 그룹으로 분류
  const grouped = groupVariablesByRoot(variables)
  // { groom: ['name', 'phone', 'account'], bride: [...], wedding: [...] }

  return (
    <div className="variable-field-group">
      {Object.entries(grouped).map(([root, paths]) => (
        <FieldGroup key={root} label={AVAILABLE_VARIABLES[root]?.label || root}>
          {paths.map(path => {
            const fullPath = `${root}.${path}`
            const definition = getDefinitionByPath(AVAILABLE_VARIABLES, fullPath)

            // Computed 필드는 렌더링 안 함
            if (COMPUTED_FIELDS[fullPath]) return null

            return (
              <VariableField
                key={fullPath}
                path={fullPath}
                definition={definition}
                value={getValueByPath(data, fullPath)}
                onChange={(value) => onChange(fullPath, value)}
              />
            )
          })}
        </FieldGroup>
      ))}
    </div>
  )
}
```

---

## 2. VariableField 컴포넌트

타입 정의에 따라 적절한 에디터 컴포넌트 렌더링.

```typescript
interface VariableFieldProps {
  path: string
  definition: VariableDefinition
  value: unknown
  onChange: (value: unknown) => void
}

function VariableField({ path, definition, value, onChange }: VariableFieldProps) {
  // Computed 필드 체크
  if (COMPUTED_FIELDS[path]) {
    return null  // 렌더링 안 함
  }

  // 타입별 에디터 컴포넌트 선택
  switch (definition.type) {
    case 'text':
      return (
        <TextInput
          label={definition.label}
          value={value as string}
          onChange={onChange}
        />
      )

    case 'longtext':
      return (
        <Textarea
          label={definition.label}
          value={value as string}
          onChange={onChange}
          rows={4}
        />
      )

    case 'number':
      return (
        <NumberInput
          label={definition.label}
          value={value as number}
          onChange={onChange}
        />
      )

    case 'boolean':
      return (
        <Toggle
          label={definition.label}
          checked={value as boolean}
          onChange={onChange}
        />
      )

    case 'phone':
      return (
        <PhoneInput
          label={definition.label}
          value={value as string}
          onChange={onChange}
        />
      )

    case 'date':
      return (
        <DatePicker
          label={definition.label}
          value={value as string}
          onChange={onChange}
        />
      )

    case 'time':
      return (
        <TimePicker
          label={definition.label}
          value={value as string}
          onChange={onChange}
        />
      )

    case 'image':
      return (
        <ImageUploader
          label={definition.label}
          value={value as PhotoData}
          onChange={onChange}
        />
      )

    case 'url':
      return (
        <UrlInput
          label={definition.label}
          value={value as string}
          onChange={onChange}
        />
      )

    case 'compound':
      return (
        <CompoundEditor
          path={path}
          definition={definition as CompoundTypeDefinition}
          value={value as Record<string, unknown>}
          onChange={onChange}
        />
      )

    case 'array':
      return (
        <ArrayEditor
          path={path}
          definition={definition as ArrayTypeDefinition}
          value={value as unknown[]}
          onChange={onChange}
        />
      )

    default:
      return null
  }
}
```

---

## 3. CompoundEditor (특수 입력 방식 지원)

```typescript
interface CompoundEditorProps {
  path: string
  definition: CompoundTypeDefinition
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
}

function CompoundEditor({ path, definition, value, onChange }: CompoundEditorProps) {
  const handleFieldChange = (fieldName: string, fieldValue: unknown) => {
    onChange({ ...value, [fieldName]: fieldValue })
  }

  // 특수 입력 방식
  if (definition.inputMethod === 'address-search') {
    return (
      <AddressSearchEditor
        label={definition.label}
        value={value}
        onChange={onChange}
        fields={definition.fields}
      />
    )
  }

  if (definition.inputMethod === 'bank-select') {
    return (
      <BankSelectEditor
        label={definition.label}
        value={value}
        onChange={onChange}
        fields={definition.fields}
      />
    )
  }

  if (definition.inputMethod === 'image-upload') {
    return (
      <ImageUploadEditor
        label={definition.label}
        value={value}
        onChange={onChange}
      />
    )
  }

  // 기본: 필드별 재귀 렌더링
  return (
    <fieldset className="compound-editor">
      <legend>{definition.label}</legend>
      {Object.entries(definition.fields)
        .filter(([_, field]) => field.input !== 'auto')  // auto 필드 숨김
        .map(([fieldName, field]) => (
          <VariableField
            key={fieldName}
            path={`${path}.${fieldName}`}
            definition={field}
            value={value?.[fieldName]}
            onChange={(v) => handleFieldChange(fieldName, v)}
          />
        ))}
    </fieldset>
  )
}
```

---

## 4. 특수 입력 에디터

### 4.1 AddressSearchEditor

```typescript
function AddressSearchEditor({
  label,
  value,
  onChange,
  fields,
}: {
  label: string
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
  fields: Record<string, FieldDefinition>
}) {
  const handleAddressSearch = async () => {
    // 카카오/네이버 주소 검색 API 호출
    const result = await openAddressSearch()
    if (result) {
      onChange({
        ...value,
        address: result.address,
        coordinates: {
          lat: result.lat,
          lng: result.lng,
        },
      })
    }
  }

  return (
    <div className="address-search-editor">
      <label>{label}</label>

      {/* manual 필드들 */}
      {Object.entries(fields)
        .filter(([_, f]) => f.input === 'manual')
        .map(([name, field]) => (
          <VariableField
            key={name}
            path={name}
            definition={field}
            value={value?.[name]}
            onChange={(v) => onChange({ ...value, [name]: v })}
          />
        ))}

      {/* 주소 검색 버튼 + 결과 */}
      <div className="address-search-row">
        <input
          type="text"
          value={(value?.address as string) || ''}
          readOnly
          placeholder="주소를 검색하세요"
        />
        <Button onClick={handleAddressSearch}>주소 검색</Button>
      </div>

      {/* 좌표 표시 (읽기 전용) */}
      {value?.coordinates && (
        <div className="coordinates-display">
          위도: {(value.coordinates as any).lat}, 경도: {(value.coordinates as any).lng}
        </div>
      )}
    </div>
  )
}
```

### 4.2 BankSelectEditor

```typescript
const BANK_LIST = [
  { code: 'kb', name: '국민은행', logo: '/banks/kb.svg' },
  { code: 'shinhan', name: '신한은행', logo: '/banks/shinhan.svg' },
  { code: 'woori', name: '우리은행', logo: '/banks/woori.svg' },
  { code: 'hana', name: '하나은행', logo: '/banks/hana.svg' },
  { code: 'nh', name: '농협은행', logo: '/banks/nh.svg' },
  { code: 'kakao', name: '카카오뱅크', logo: '/banks/kakao.svg' },
  { code: 'toss', name: '토스뱅크', logo: '/banks/toss.svg' },
  // ...
]

function BankSelectEditor({
  label,
  value,
  onChange,
  fields,
}: {
  label: string
  value: Record<string, unknown>
  onChange: (value: Record<string, unknown>) => void
  fields: Record<string, FieldDefinition>
}) {
  return (
    <div className="bank-select-editor">
      <label>{label}</label>

      {/* 은행 선택 드롭다운 */}
      <Select
        value={value?.bank as string}
        onChange={(bank) => onChange({ ...value, bank })}
        placeholder="은행 선택"
      >
        {BANK_LIST.map(bank => (
          <SelectOption key={bank.code} value={bank.name}>
            <img src={bank.logo} alt={bank.name} className="w-5 h-5" />
            {bank.name}
          </SelectOption>
        ))}
      </Select>

      {/* 계좌번호 */}
      <TextInput
        label="계좌번호"
        value={(value?.number as string) || ''}
        onChange={(v) => onChange({ ...value, number: v })}
        placeholder="계좌번호 입력"
      />

      {/* 예금주 */}
      <TextInput
        label="예금주"
        value={(value?.holder as string) || ''}
        onChange={(v) => onChange({ ...value, holder: v })}
        placeholder="예금주명"
      />
    </div>
  )
}
```

---

## 5. 관련 문서

| 문서 | 내용 |
|------|------|
| [03_variables.md](./03_variables.md) | 변수 타입 정의 |
| [04a_layout_tabs.md](./04a_layout_tabs.md) | 에디터 레이아웃 |
