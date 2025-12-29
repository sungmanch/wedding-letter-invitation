# Skeleton Migration Validation Checklist

마이그레이션 완료 후 다음 항목들을 검증합니다.

---

## 1. File Generation

### 1.1 Required Files Created

- [ ] `src/lib/super-editor-v2/presets/block-presets.ts` 존재
- [ ] `src/lib/super-editor-v2/presets/block-bindings.ts` 존재
- [ ] `src/lib/super-editor-v2/presets/index.ts` 업데이트됨

### 1.2 File Structure

- [ ] block-presets.ts에 `BlockPreset` 인터페이스 정의
- [ ] block-presets.ts에 `BlockPresetId` 타입 정의
- [ ] block-presets.ts에 `BLOCK_PRESETS` 상수 정의
- [ ] block-bindings.ts에 `BlockDataBinding` 인터페이스 정의
- [ ] block-bindings.ts에 `BLOCK_BINDINGS` 상수 정의

---

## 2. Type Safety

### 2.1 TypeScript Compilation

```bash
npx tsc --noEmit
```

- [ ] 컴파일 에러 없음
- [ ] 모든 import/export 정상

### 2.2 Type Definitions

- [ ] `BlockPresetId`가 모든 프리셋 ID를 포함
- [ ] `BlockType`과 호환되는 `blockType` 필드
- [ ] `VariablePath`와 호환되는 `bindings` 필드
- [ ] `AnimationPresetId`와 호환되는 `recommendedAnimations`
- [ ] `ThemePresetId`와 호환되는 `recommendedThemes`

---

## 3. Content Completeness

### 3.1 Block Types Coverage

v1에서 마이그레이션된 섹션:

| v1 Section | v2 BlockType | Presets | Bindings |
|------------|--------------|---------|----------|
| intro | hero | [ ] | [ ] |
| greeting | greeting | [ ] | [ ] |
| date | calendar | [ ] | [ ] |
| gallery | gallery | [ ] | [ ] |
| venue | location | [ ] | [ ] |
| parents | parents | [ ] | [ ] |
| contact | contact | [ ] | [ ] |
| accounts | account | [ ] | [ ] |
| guestbook | message | [ ] | [ ] |
| rsvp | rsvp | [ ] | [ ] |
| notice | notice | [ ] | [ ] |
| music | music | [ ] | [ ] |

### 3.2 Variant Coverage

각 블록 타입별 최소 1개 이상의 프리셋:

- [ ] hero: minimal, elegant, romantic (최소 3개)
- [ ] gallery: grid, carousel, masonry (최소 3개)
- [ ] greeting: simple, elegant (최소 2개)
- [ ] calendar: minimal, elegant (최소 2개)
- [ ] location: minimal, detailed (최소 2개)
- [ ] parents: minimal, elegant (최소 2개)
- [ ] contact: simple (최소 1개)
- [ ] account: simple, tabbed (최소 2개)
- [ ] message: card (최소 1개)
- [ ] rsvp: simple (최소 1개)

### 3.3 Data Bindings

각 블록의 필수 바인딩 정의:

- [ ] hero: photos.main, couple.groom.name, couple.bride.name, wedding.date
- [ ] gallery: photos.gallery
- [ ] greeting: greeting.title, greeting.content
- [ ] calendar: wedding.date, wedding.time
- [ ] location: venue.name, venue.address
- [ ] parents: parents.groom, parents.bride
- [ ] contact: contact.groom, contact.bride
- [ ] account: accounts (배열)
- [ ] message: messages (배열)
- [ ] rsvp: rsvp config

---

## 4. Export Verification

### 4.1 Index Exports

`presets/index.ts`에서 export 확인:

```typescript
import {
  // Block Presets
  type BlockPreset,
  type BlockPresetId,
  type BlockPresetElement,
  BLOCK_PRESETS,
  getBlockPreset,
  getBlockPresetsByType,
  getBlockPresetsByTag,
  getAllBlockPresetIds,

  // Block Bindings
  type BlockDataBinding,
  BLOCK_BINDINGS,
  getBlockBindings,
  getRequiredPaths,
  validateBindings,
} from '@/lib/super-editor-v2/presets'
```

- [ ] 모든 타입 export 가능
- [ ] 모든 상수 export 가능
- [ ] 모든 함수 export 가능

### 4.2 Getter Functions

```typescript
// 테스트 코드
const preset = getBlockPreset('hero-minimal')
console.assert(preset.blockType === 'hero')
console.assert(preset.variant === 'minimal')

const heroPresets = getBlockPresetsByType('hero')
console.assert(heroPresets.length >= 3)

const bindings = getBlockBindings('hero')
console.assert(bindings.some(b => b.path === 'photos.main'))

const result = validateBindings('hero', { photos: { main: 'url' } })
console.assert(result.missing.length > 0) // couple, wedding 누락
```

- [ ] `getBlockPreset()` 정상 동작
- [ ] `getBlockPresetsByType()` 정상 동작
- [ ] `getBlockPresetsByTag()` 정상 동작
- [ ] `getBlockBindings()` 정상 동작
- [ ] `validateBindings()` 정상 동작

---

## 5. Compatibility

### 5.1 Existing Presets Integration

- [ ] theme-presets.ts와 충돌 없음
- [ ] typography-presets.ts와 충돌 없음
- [ ] animation-presets.ts와 충돌 없음

### 5.2 Schema Compatibility

- [ ] schema/types.ts의 `BlockType`과 호환
- [ ] schema/types.ts의 `Element`와 호환
- [ ] schema/types.ts의 `VariablePath`와 호환

---

## 6. Documentation

### 6.1 Code Comments

- [ ] 각 인터페이스에 JSDoc 주석
- [ ] 각 함수에 JSDoc 주석
- [ ] 복잡한 로직에 인라인 주석

### 6.2 AI Reference (Optional)

- [ ] AI 프롬프트용 참조 문서 생성
- [ ] 블록 타입별 프리셋 목록
- [ ] 사용 예시 포함

---

## Validation Commands

```bash
# 1. TypeScript 컴파일 체크
npx tsc --noEmit

# 2. Lint 체크
npm run lint

# 3. Build 체크
npm run build

# 4. 특정 파일 import 테스트
node -e "require('./src/lib/super-editor-v2/presets')"
```

---

## Sign-off

- [ ] 모든 체크리스트 항목 통과
- [ ] 타입 에러 없음
- [ ] 빌드 성공
- [ ] 코드 리뷰 완료

**마이그레이션 완료 일시**: ____________________
**담당자**: ____________________
