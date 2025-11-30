# Themes

정적 JSON 템플릿 + AI 동적 생성을 모두 지원하는 테마 시스템.

## 사용법

```typescript
import { recommendTemplates, createInvitationThemeData } from '@/lib/themes'

// 프롬프트 기반 추천
const themes = recommendTemplates("영화 같은 감성", 5)

// 선택한 템플릿으로 데이터 생성
const data = createInvitationThemeData("cinematic", { images: {...} })
```

## 구조

- `schema.ts`: 타입 정의
- `templates.json`: 10개 정적 템플릿
- `index.ts`: 로더 + 유틸리티
