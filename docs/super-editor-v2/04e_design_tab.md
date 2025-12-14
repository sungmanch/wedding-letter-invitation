# Super Editor v2 - 디자인 탭 (3-Level 스타일 시스템)

> **목표**: 3-Level 하이브리드 스타일 시스템을 위한 점진적 공개 UI
> **핵심 원칙**: 초보자부터 전문가까지 다양한 수준 지원

---

## 1. 구조 개요

| 레벨 | UI 컴포넌트 | 대상 | 복잡도 |
|------|------------|------|--------|
| **Level 1** | PresetSelector | 초보자 | 프리셋 선택만 |
| **Level 2** | QuickSettings | 중급자 | 주요 값 조정 |
| **Level 3** | AdvancedPanel | AI/전문가 | 팔레트/토큰 직접 제어 |

```
┌─────────────────────────────────────┐
│ 디자인 탭                            │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🎨 테마 프리셋 (Level 1)         │ │
│ │ [미니멀] [클래식] [로맨틱] ...   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ⚡ 빠른 설정 (Level 2)           │ │
│ │ 메인 색상: [■ #FDFBF7]          │ │
│ │ 포인트 색상: [■ #C9A962]        │ │
│ │ 무드: [따뜻함] [차가움] [중립]   │ │
│ │ 대비: ──●────────               │ │
│ │                                 │ │
│ │ 📷 사진에서 색상 추출            │ │
│ │ [메인 사진에서 추출하기]         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔧 고급 설정 (Level 3) [펼치기]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔤 타이포그래피                  │ │
│ │ 제목 폰트: [Playfair Display ▼] │ │
│ │ 본문 폰트: [Pretendard ▼]       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✨ 애니메이션                    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 2. DesignTab 컴포넌트

```typescript
interface DesignTabProps {
  style: StyleSystem
  animation: GlobalAnimation
  mainPhotoUrl?: string  // 사진 팔레트 추출용
  onStyleChange: (style: StyleSystem) => void
  onAnimationChange: (animation: GlobalAnimation) => void
}

function DesignTab({
  style,
  animation,
  mainPhotoUrl,
  onStyleChange,
  onAnimationChange,
}: DesignTabProps) {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(
    style.advanced ? 3 : style.quick ? 2 : 1
  )
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="design-tab">
      {/* Level 1: 테마 프리셋 */}
      <section className="design-section">
        <h3>🎨 테마 프리셋</h3>
        <PresetSelector
          selectedPreset={style.preset}
          onSelect={(presetId) => onStyleChange({
            ...style,
            preset: presetId,
            // 프리셋 변경 시 quick/advanced 초기화 옵션
          })}
        />
      </section>

      {/* Level 2: 빠른 설정 */}
      <section className="design-section">
        <h3>⚡ 빠른 설정</h3>
        <QuickSettings
          quick={style.quick}
          mainPhotoUrl={mainPhotoUrl}
          onChange={(quick) => onStyleChange({ ...style, quick })}
        />
      </section>

      {/* Level 3: 고급 설정 (접기/펼치기) */}
      <Disclosure open={showAdvanced} onOpenChange={setShowAdvanced}>
        <DisclosureTrigger className="design-section-header">
          <h3>🔧 고급 설정</h3>
          <ChevronIcon direction={showAdvanced ? 'up' : 'down'} />
        </DisclosureTrigger>
        <DisclosureContent>
          <AdvancedPanel
            advanced={style.advanced}
            basePreset={style.preset}
            onChange={(advanced) => onStyleChange({ ...style, advanced })}
          />
        </DisclosureContent>
      </Disclosure>

      {/* 타이포그래피 */}
      <section className="design-section">
        <h3>🔤 타이포그래피</h3>
        <TypographySettings
          typography={style.typography}
          onChange={(typography) => onStyleChange({ ...style, typography })}
        />
      </section>

      {/* 이펙트 */}
      <section className="design-section">
        <h3>✨ 이펙트</h3>
        <EffectsSettings
          effects={style.effects}
          onChange={(effects) => onStyleChange({ ...style, effects })}
        />
      </section>

      {/* 애니메이션 */}
      <section className="design-section">
        <h3>🎬 애니메이션</h3>
        <AnimationSettings
          animation={animation}
          onChange={onAnimationChange}
        />
      </section>
    </div>
  )
}
```

---

## 3. Level 1: PresetSelector

```typescript
interface PresetSelectorProps {
  selectedPreset?: ThemePresetId
  onSelect: (presetId: ThemePresetId) => void
}

function PresetSelector({ selectedPreset, onSelect }: PresetSelectorProps) {
  // 카테고리별 그룹화
  const categories = [
    { id: 'basic', label: '기본', presets: ['minimal-light', 'minimal-dark'] },
    { id: 'classic', label: '클래식', presets: ['classic-ivory', 'classic-gold'] },
    { id: 'modern', label: '모던', presets: ['modern-mono', 'modern-contrast'] },
    { id: 'romantic', label: '로맨틱', presets: ['romantic-blush', 'romantic-garden'] },
    { id: 'cinematic', label: '시네마틱', presets: ['cinematic-dark', 'cinematic-warm'] },
    { id: 'special', label: '특수', presets: ['photo-adaptive', 'duotone', 'gradient-hero'] },
  ]

  return (
    <div className="preset-selector">
      {categories.map(category => (
        <div key={category.id} className="preset-category">
          <span className="category-label">{category.label}</span>
          <div className="preset-grid">
            {category.presets.map(presetId => {
              const preset = THEME_PRESETS[presetId as ThemePresetId]
              return (
                <button
                  key={presetId}
                  onClick={() => onSelect(presetId as ThemePresetId)}
                  className={cn(
                    'preset-card',
                    selectedPreset === presetId && 'selected'
                  )}
                >
                  <div
                    className="preset-preview"
                    style={{
                      background: preset.tokens['bg-page'],
                      borderColor: preset.tokens['accent-default'],
                    }}
                  >
                    <div
                      className="preview-accent"
                      style={{ background: preset.tokens['accent-default'] }}
                    />
                  </div>
                  <span className="preset-name">{preset.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## 4. Level 2: QuickSettings

```typescript
interface QuickSettingsProps {
  quick?: QuickStyleConfig
  mainPhotoUrl?: string
  onChange: (quick: QuickStyleConfig) => void
}

function QuickSettings({ quick = {}, mainPhotoUrl, onChange }: QuickSettingsProps) {
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedPalette, setExtractedPalette] = useState<ExtractedPalette | null>(null)

  // 사진에서 팔레트 추출
  const handleExtractFromPhoto = async () => {
    if (!mainPhotoUrl) return

    setIsExtracting(true)
    try {
      const palette = await extractPaletteOptimized(mainPhotoUrl, {
        extraction: {
          algorithm: 'kmeans',
          colorCount: 6,
          optimization: {
            resizeWidth: 100,
            resizeHeight: 100,
            maxIterations: 10,
            convergenceThreshold: 0.01,
          },
        },
        mapping: {
          dominant: quick.photoExtraction?.mapping?.dominant || 'most-common',
          accent: quick.photoExtraction?.mapping?.accent || 'complementary',
          text: 'auto-contrast',
        },
      })

      setExtractedPalette(palette)

      // 추출된 색상으로 quick 설정 업데이트
      onChange({
        ...quick,
        dominantColor: palette.mappedTokens['bg-page'],
        accentColor: palette.mappedTokens['accent-default'],
        photoExtraction: {
          enabled: true,
          source: 'photos.main',
          mapping: {
            dominant: 'most-common',
            accent: 'complementary',
          },
        },
      })
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <div className="quick-settings">
      {/* 색상 설정 */}
      <div className="setting-group">
        <label>메인 색상</label>
        <ColorPicker
          value={quick.dominantColor}
          onChange={(color) => onChange({ ...quick, dominantColor: color })}
          presets={COLOR_PRESETS.dominant}
        />
      </div>

      <div className="setting-group">
        <label>포인트 색상</label>
        <ColorPicker
          value={quick.accentColor}
          onChange={(color) => onChange({ ...quick, accentColor: color })}
          presets={COLOR_PRESETS.accent}
        />
      </div>

      {/* 무드 설정 */}
      <div className="setting-group">
        <label>무드</label>
        <SegmentedControl
          value={quick.mood || 'neutral'}
          options={[
            { value: 'warm', label: '따뜻함' },
            { value: 'neutral', label: '중립' },
            { value: 'cool', label: '차가움' },
          ]}
          onChange={(mood) => onChange({ ...quick, mood: mood as QuickStyleConfig['mood'] })}
        />
      </div>

      {/* 대비 설정 */}
      <div className="setting-group">
        <label>대비</label>
        <SegmentedControl
          value={quick.contrast || 'medium'}
          options={[
            { value: 'low', label: '낮음' },
            { value: 'medium', label: '보통' },
            { value: 'high', label: '높음' },
          ]}
          onChange={(contrast) => onChange({ ...quick, contrast: contrast as QuickStyleConfig['contrast'] })}
        />
      </div>

      {/* 채도 설정 */}
      <div className="setting-group">
        <label>채도</label>
        <SegmentedControl
          value={quick.saturation || 'normal'}
          options={[
            { value: 'muted', label: '차분함' },
            { value: 'normal', label: '보통' },
            { value: 'vivid', label: '선명함' },
          ]}
          onChange={(saturation) => onChange({ ...quick, saturation: saturation as QuickStyleConfig['saturation'] })}
        />
      </div>

      {/* 사진 팔레트 추출 */}
      {mainPhotoUrl && (
        <div className="photo-extraction">
          <div className="extraction-header">
            <label>📷 사진에서 색상 추출</label>
            <Button
              onClick={handleExtractFromPhoto}
              disabled={isExtracting}
              variant="outline"
              size="sm"
            >
              {isExtracting ? '추출 중...' : '추출하기'}
            </Button>
          </div>

          {/* 추출된 팔레트 미리보기 */}
          {extractedPalette && (
            <ExtractedPalettePreview
              palette={extractedPalette}
              onApply={(mappedTokens) => {
                onChange({
                  ...quick,
                  dominantColor: mappedTokens['bg-page'],
                  accentColor: mappedTokens['accent-default'],
                })
              }}
            />
          )}

          {/* 추출 옵션 */}
          {quick.photoExtraction?.enabled && (
            <div className="extraction-options">
              <div className="setting-group">
                <label>메인 색상 선택 기준</label>
                <Select
                  value={quick.photoExtraction.mapping.dominant}
                  onChange={(value) => onChange({
                    ...quick,
                    photoExtraction: {
                      ...quick.photoExtraction!,
                      mapping: {
                        ...quick.photoExtraction!.mapping,
                        dominant: value as any,
                      },
                    },
                  })}
                >
                  <SelectOption value="most-common">가장 많은 색상</SelectOption>
                  <SelectOption value="most-saturated">가장 선명한 색상</SelectOption>
                  <SelectOption value="lightest">가장 밝은 색상</SelectOption>
                  <SelectOption value="darkest">가장 어두운 색상</SelectOption>
                </Select>
              </div>

              {/* 조정 슬라이더 */}
              <div className="adjustment-sliders">
                <SliderField
                  label="채도 조정"
                  value={quick.photoExtraction.adjustments?.saturation || 0}
                  min={-100}
                  max={100}
                  onChange={(value) => onChange({
                    ...quick,
                    photoExtraction: {
                      ...quick.photoExtraction!,
                      adjustments: {
                        ...quick.photoExtraction!.adjustments,
                        saturation: value,
                      },
                    },
                  })}
                />
                <SliderField
                  label="밝기 조정"
                  value={quick.photoExtraction.adjustments?.brightness || 0}
                  min={-100}
                  max={100}
                  onChange={(value) => onChange({
                    ...quick,
                    photoExtraction: {
                      ...quick.photoExtraction!,
                      adjustments: {
                        ...quick.photoExtraction!.adjustments,
                        brightness: value,
                      },
                    },
                  })}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

---

## 5. 추출된 팔레트 미리보기

```typescript
interface ExtractedPalettePreviewProps {
  palette: ExtractedPalette
  onApply: (tokens: Partial<SemanticTokens>) => void
}

function ExtractedPalettePreview({ palette, onApply }: ExtractedPalettePreviewProps) {
  return (
    <div className="extracted-palette-preview">
      {/* 추출된 색상 스와치 */}
      <div className="color-swatches">
        {palette.colors.slice(0, 6).map((color, i) => (
          <div
            key={i}
            className="color-swatch"
            style={{ background: color.hex }}
            title={`${color.hex} (${(color.population * 100).toFixed(1)}%)`}
          >
            <span className="population">{(color.population * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      {/* 대비 검증 결과 */}
      <div className="contrast-validation">
        {palette.contrastValidation.passesAA ? (
          <span className="validation-pass">✓ WCAG AA 충족</span>
        ) : (
          <span className="validation-fail">
            ⚠ 대비 부족
            <Tooltip content={palette.contrastValidation.suggestions?.join('\n')}>
              <InfoIcon />
            </Tooltip>
          </span>
        )}
      </div>

      {/* 미리보기 카드 */}
      <div
        className="preview-card"
        style={{
          background: palette.mappedTokens['bg-page'],
          color: palette.mappedTokens['fg-default'],
        }}
      >
        <h4 style={{ color: palette.mappedTokens['fg-emphasis'] }}>미리보기</h4>
        <p style={{ color: palette.mappedTokens['fg-muted'] }}>
          추출된 색상이 적용된 모습입니다.
        </p>
        <button
          style={{
            background: palette.mappedTokens['accent-default'],
            color: palette.mappedTokens['fg-on-accent'] || '#fff',
          }}
        >
          액션 버튼
        </button>
      </div>

      {/* 적용 버튼 */}
      <Button onClick={() => onApply(palette.mappedTokens)}>
        이 색상 적용하기
      </Button>

      {/* 처리 시간 */}
      <span className="processing-time">
        {palette.meta.processingTime.toFixed(0)}ms
      </span>
    </div>
  )
}
```

---

## 6. Level 3: AdvancedPanel

```typescript
interface AdvancedPanelProps {
  advanced?: AdvancedStyleConfig
  basePreset?: ThemePresetId
  onChange: (advanced: AdvancedStyleConfig) => void
}

function AdvancedPanel({ advanced, basePreset, onChange }: AdvancedPanelProps) {
  // 프리셋 기반 기본값
  const baseTokens = basePreset
    ? THEME_PRESETS[basePreset].tokens
    : DEFAULT_TOKENS

  const currentTokens = advanced?.tokens || baseTokens
  const currentPalette = advanced?.palette || []

  return (
    <div className="advanced-panel">
      {/* 경고 메시지 */}
      <div className="advanced-warning">
        <InfoIcon />
        <span>고급 설정을 변경하면 프리셋과 빠른 설정이 무시됩니다.</span>
      </div>

      {/* 팔레트 편집 */}
      <div className="palette-editor">
        <h4>팔레트</h4>
        <p className="description">원시 색상 정의. 시맨틱 토큰에서 참조됩니다.</p>

        {currentPalette.map((color, i) => (
          <PaletteColorEditor
            key={color.id}
            color={color}
            onChange={(updated) => {
              const newPalette = [...currentPalette]
              newPalette[i] = updated
              onChange({ ...advanced!, palette: newPalette })
            }}
            onRemove={() => {
              const newPalette = currentPalette.filter((_, idx) => idx !== i)
              onChange({ ...advanced!, palette: newPalette })
            }}
          />
        ))}

        <Button
          variant="outline"
          onClick={() => {
            const newColor: PaletteColor = {
              id: `color-${Date.now()}`,
              value: '#888888',
            }
            onChange({
              ...advanced!,
              palette: [...currentPalette, newColor],
            })
          }}
        >
          + 색상 추가
        </Button>
      </div>

      {/* 시맨틱 토큰 편집 */}
      <div className="tokens-editor">
        <h4>시맨틱 토큰</h4>
        <p className="description">역할별 색상 매핑. 컴포넌트가 이 토큰을 참조합니다.</p>

        <Tabs defaultValue="background">
          <TabList>
            <Tab value="background">배경</Tab>
            <Tab value="foreground">전경</Tab>
            <Tab value="accent">강조</Tab>
            <Tab value="border">보더</Tab>
          </TabList>

          <TabContent value="background">
            <TokenGroup
              tokens={['bg-page', 'bg-section', 'bg-section-alt', 'bg-card', 'bg-overlay']}
              values={currentTokens}
              onChange={(key, value) => {
                onChange({
                  ...advanced!,
                  tokens: { ...currentTokens, [key]: value },
                })
              }}
            />
          </TabContent>

          <TabContent value="foreground">
            <TokenGroup
              tokens={['fg-default', 'fg-muted', 'fg-emphasis', 'fg-inverse', 'fg-on-accent']}
              values={currentTokens}
              onChange={(key, value) => {
                onChange({
                  ...advanced!,
                  tokens: { ...currentTokens, [key]: value },
                })
              }}
            />
          </TabContent>

          <TabContent value="accent">
            <TokenGroup
              tokens={['accent-default', 'accent-hover', 'accent-active', 'accent-secondary']}
              values={currentTokens}
              onChange={(key, value) => {
                onChange({
                  ...advanced!,
                  tokens: { ...currentTokens, [key]: value },
                })
              }}
            />
          </TabContent>

          <TabContent value="border">
            <TokenGroup
              tokens={['border-default', 'border-emphasis', 'border-muted']}
              values={currentTokens}
              onChange={(key, value) => {
                onChange({
                  ...advanced!,
                  tokens: { ...currentTokens, [key]: value },
                })
              }}
            />
          </TabContent>
        </Tabs>
      </div>

      {/* 그라데이션 토큰 */}
      <div className="gradient-tokens">
        <h4>그라데이션</h4>
        <GradientEditor
          label="Hero 그라데이션"
          value={currentTokens['gradient-hero']}
          onChange={(gradient) => {
            onChange({
              ...advanced!,
              tokens: { ...currentTokens, 'gradient-hero': gradient },
            })
          }}
        />
        <GradientEditor
          label="Accent 그라데이션"
          value={currentTokens['gradient-accent']}
          onChange={(gradient) => {
            onChange({
              ...advanced!,
              tokens: { ...currentTokens, 'gradient-accent': gradient },
            })
          }}
        />
      </div>

      {/* 블록별 오버라이드 */}
      <div className="block-overrides">
        <h4>블록별 테마</h4>
        <p className="description">특정 블록의 테마를 다르게 설정합니다.</p>

        <BlockOverrideList
          overrides={advanced?.blockOverrides || {}}
          onChange={(blockOverrides) => {
            onChange({ ...advanced!, blockOverrides })
          }}
        />
      </div>

      {/* 초기화 버튼 */}
      <div className="advanced-actions">
        <Button
          variant="outline"
          onClick={() => {
            if (confirm('고급 설정을 초기화하시겠습니까?')) {
              onChange(undefined as any)
            }
          }}
        >
          프리셋으로 초기화
        </Button>
      </div>
    </div>
  )
}
```

---

## 7. TokenGroup 컴포넌트

```typescript
interface TokenGroupProps {
  tokens: string[]
  values: SemanticTokens
  onChange: (key: string, value: string | GradientValue) => void
}

const TOKEN_LABELS: Record<string, string> = {
  'bg-page': '페이지 배경',
  'bg-section': '섹션 배경',
  'bg-section-alt': '대체 섹션 배경',
  'bg-card': '카드 배경',
  'bg-overlay': '오버레이',
  'fg-default': '기본 텍스트',
  'fg-muted': '보조 텍스트',
  'fg-emphasis': '강조 텍스트',
  'fg-inverse': '반전 텍스트',
  'fg-on-accent': '액센트 위 텍스트',
  'accent-default': '기본 액센트',
  'accent-hover': '호버 액센트',
  'accent-active': '활성 액센트',
  'accent-secondary': '보조 액센트',
  'border-default': '기본 보더',
  'border-emphasis': '강조 보더',
  'border-muted': '보조 보더',
}

function TokenGroup({ tokens, values, onChange }: TokenGroupProps) {
  return (
    <div className="token-group">
      {tokens.map(token => (
        <div key={token} className="token-row">
          <label>{TOKEN_LABELS[token] || token}</label>
          <ColorPicker
            value={values[token as keyof SemanticTokens] as string}
            onChange={(color) => onChange(token, color)}
            showGradient={token.includes('gradient')}
          />
        </div>
      ))}
    </div>
  )
}
```

---

## 8. GradientEditor 컴포넌트

```typescript
interface GradientEditorProps {
  label: string
  value?: GradientValue
  onChange: (gradient: GradientValue | undefined) => void
}

function GradientEditor({ label, value, onChange }: GradientEditorProps) {
  const [enabled, setEnabled] = useState(!!value)

  const handleToggle = (checked: boolean) => {
    setEnabled(checked)
    if (!checked) {
      onChange(undefined)
    } else {
      onChange({
        type: 'linear',
        angle: 180,
        stops: [
          { color: '#000000', position: 0 },
          { color: '#ffffff', position: 100 },
        ],
      })
    }
  }

  return (
    <div className="gradient-editor">
      <div className="gradient-header">
        <label>{label}</label>
        <Toggle checked={enabled} onChange={handleToggle} />
      </div>

      {enabled && value && (
        <div className="gradient-controls">
          {/* 타입 선택 */}
          <Select
            value={value.type}
            onChange={(type) => onChange({ ...value, type: type as GradientValue['type'] })}
          >
            <SelectOption value="linear">선형</SelectOption>
            <SelectOption value="radial">방사형</SelectOption>
            <SelectOption value="conic">원뿔형</SelectOption>
          </Select>

          {/* 각도 (linear만) */}
          {value.type === 'linear' && (
            <SliderField
              label="각도"
              value={value.angle || 180}
              min={0}
              max={360}
              onChange={(angle) => onChange({ ...value, angle })}
            />
          )}

          {/* 그라데이션 스톱 */}
          <div className="gradient-stops">
            {value.stops.map((stop, i) => (
              <div key={i} className="stop-row">
                <ColorPicker
                  value={stop.color}
                  onChange={(color) => {
                    const newStops = [...value.stops]
                    newStops[i] = { ...stop, color }
                    onChange({ ...value, stops: newStops })
                  }}
                />
                <SliderField
                  label="위치"
                  value={stop.position}
                  min={0}
                  max={100}
                  onChange={(position) => {
                    const newStops = [...value.stops]
                    newStops[i] = { ...stop, position }
                    onChange({ ...value, stops: newStops })
                  }}
                />
                {value.stops.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newStops = value.stops.filter((_, idx) => idx !== i)
                      onChange({ ...value, stops: newStops })
                    }}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newStops = [
                  ...value.stops,
                  { color: '#888888', position: 50 },
                ]
                onChange({ ...value, stops: newStops })
              }}
            >
              + 스톱 추가
            </Button>
          </div>

          {/* 미리보기 */}
          <div
            className="gradient-preview"
            style={{ background: gradientToCSS(value) }}
          />
        </div>
      )}
    </div>
  )
}
```

---

## 9. TypographySettings

```typescript
interface TypographySettingsProps {
  typography: TypographyConfig
  onChange: (typography: TypographyConfig) => void
}

function TypographySettings({ typography, onChange }: TypographySettingsProps) {
  return (
    <div className="typography-settings">
      {/* 프리셋 선택 */}
      <div className="setting-group">
        <label>폰트 프리셋</label>
        <Select
          value={typography.preset || 'custom'}
          onChange={(preset) => {
            if (preset === 'custom') {
              onChange({ ...typography, preset: undefined })
            } else {
              onChange({ preset: preset as TypographyPresetId })
            }
          }}
        >
          <SelectOption value="elegant-serif">우아한 세리프</SelectOption>
          <SelectOption value="modern-sans">모던 산세리프</SelectOption>
          <SelectOption value="handwritten-romantic">로맨틱 손글씨</SelectOption>
          <SelectOption value="minimal-clean">미니멀 클린</SelectOption>
          <SelectOption value="custom">직접 설정</SelectOption>
        </Select>
      </div>

      {/* 커스텀 설정 */}
      {!typography.preset && (
        <>
          <div className="setting-group">
            <label>제목 폰트</label>
            <FontSelector
              value={typography.custom?.fontStacks?.heading}
              onChange={(fontStack) => onChange({
                ...typography,
                custom: {
                  ...typography.custom!,
                  fontStacks: {
                    ...typography.custom?.fontStacks,
                    heading: fontStack,
                  },
                },
              })}
            />
          </div>

          <div className="setting-group">
            <label>본문 폰트</label>
            <FontSelector
              value={typography.custom?.fontStacks?.body}
              onChange={(fontStack) => onChange({
                ...typography,
                custom: {
                  ...typography.custom!,
                  fontStacks: {
                    ...typography.custom?.fontStacks,
                    body: fontStack,
                  },
                },
              })}
            />
          </div>
        </>
      )}
    </div>
  )
}
```

---

## 10. 색상 프리셋

```typescript
const COLOR_PRESETS = {
  dominant: [
    { value: '#FDFBF7', label: '아이보리' },
    { value: '#FFFFFF', label: '화이트' },
    { value: '#1A1A1A', label: '블랙' },
    { value: '#F5F0E8', label: '크림' },
    { value: '#E8E4DD', label: '베이지' },
    { value: '#2C3E50', label: '네이비' },
  ],
  accent: [
    { value: '#C9A962', label: '골드' },
    { value: '#8B7355', label: '브라운' },
    { value: '#B76E79', label: '로즈' },
    { value: '#6B8E6B', label: '세이지' },
    { value: '#7B9BAB', label: '스틸블루' },
    { value: '#9B8AA3', label: '라벤더' },
  ],
}
```

---

## 11. 관련 문서

| 문서 | 내용 |
|------|------|
| [01b_style_system.md](./01b_style_system.md) | 3-Level 스타일 시스템 |
| [04a_layout_tabs.md](./04a_layout_tabs.md) | 에디터 레이아웃 |
| [07_typography_system.md](./07_typography_system.md) | 타이포그래피 시스템 |
