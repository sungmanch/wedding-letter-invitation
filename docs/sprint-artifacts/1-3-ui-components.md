# Story 1.3: 공통 UI 컴포넌트 라이브러리 구축

Status: done

## Story

As a 개발자,
I want 재사용 가능한 UI 컴포넌트가 준비된 상태,
so that 일관된 디자인으로 빠르게 화면을 구성할 수 있다.

## Acceptance Criteria

1. Button, Input, Textarea, Card, Modal 컴포넌트가 존재한다
2. Badge, ProgressBar, Tabs, Select 컴포넌트가 존재한다
3. 웨딩 테마 컬러(Blush Pink, Soft Gold)가 적용된다
4. 모바일 퍼스트 반응형 스타일이 적용된다
5. TypeScript 타입이 완전히 정의되어 있다

## Tasks / Subtasks

- [x] Task 1: Button 컴포넌트 (AC: 1, 3, 4)
  - [x] variant: default, secondary, outline, ghost, link, destructive
  - [x] size: default, sm, lg, icon
  - [x] fullWidth, isLoading 옵션

- [x] Task 2: Input 컴포넌트 (AC: 1, 3)
  - [x] label, error 옵션
  - [x] 웨딩 테마 스타일

- [x] Task 3: Textarea 컴포넌트 (AC: 1, 3)
  - [x] label, error 옵션
  - [x] showCount, maxLength 옵션 (글자 수 표시)

- [x] Task 4: Card 컴포넌트 (AC: 1, 3)
  - [x] Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

- [x] Task 5: Modal 컴포넌트 (AC: 1, 3)
  - [x] Radix UI Dialog 기반
  - [x] Modal, ModalTrigger, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription

- [x] Task 6: Badge 컴포넌트 (AC: 2, 3)
  - [x] variant: default, secondary, success, warning, error, outline

- [x] Task 7: ProgressBar 컴포넌트 (AC: 2, 3)
  - [x] value, max, showLabel 옵션
  - [x] 그라데이션 스타일 (blush-pink → soft-gold)

- [x] Task 8: Tabs 컴포넌트 (AC: 2, 3)
  - [x] Radix UI Tabs 기반
  - [x] Tabs, TabsList, TabsTrigger, TabsContent

- [x] Task 9: Select 컴포넌트 (AC: 2, 3)
  - [x] Radix UI Select 기반
  - [x] Select, SelectTrigger, SelectContent, SelectItem

- [x] Task 10: index.ts export 및 빌드 검증 (AC: 5)
  - [x] 모든 컴포넌트 export
  - [x] 빌드 성공 확인

## Dev Notes

### Architecture Patterns

- **UI Library**: Custom components with Radix UI primitives
- **Styling**: Tailwind CSS + CVA (class-variance-authority)
- **Theme**: Wedding theme (Blush Pink, Soft Gold, Cream, Warm White, Charcoal)

### Source Tree Components

```
src/components/ui/
├── button.tsx
├── input.tsx
├── textarea.tsx
├── card.tsx
├── modal.tsx
├── badge.tsx
├── progress-bar.tsx
├── tabs.tsx
├── select.tsx
└── index.ts
```

### References

- [Source: docs/architecture.md#Components]
- [Source: docs/epics.md#Story 1.3]
- [Source: docs/ux-design-specification.md]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Completion Notes

**Completed:** 2025-11-22
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### Completion Notes List

- 10개 UI 컴포넌트 구현 완료
- Radix UI primitives (Dialog, Select, Tabs) 활용
- CVA를 사용한 variant 시스템 구현
- 웨딩 테마 컬러 적용 (blush-pink, soft-gold)
- 빌드 성공 확인

### File List

**Created:**
- src/components/ui/button.tsx
- src/components/ui/input.tsx
- src/components/ui/textarea.tsx
- src/components/ui/card.tsx
- src/components/ui/modal.tsx
- src/components/ui/badge.tsx
- src/components/ui/progress-bar.tsx
- src/components/ui/tabs.tsx
- src/components/ui/select.tsx
- src/components/ui/index.ts
