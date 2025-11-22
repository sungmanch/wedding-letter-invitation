# 청모장 - Epic Breakdown

**Author:** BMad
**Date:** 2025-11-22
**Project Level:** Level 3 (Product)
**Target Scale:** MVP → Growth

---

## Overview

이 문서는 청모장 PRD의 요구사항을 구현 가능한 에픽과 스토리로 분해합니다.

### Epic Summary

| Epic | 제목 | 스토리 수 | 핵심 가치 |
|------|------|----------|----------|
| 1 | 프로젝트 기반 구축 | 4 | 배포 가능한 기본 인프라 |
| 2 | 청모장 생성 및 설문 시스템 | 5 | Host가 청모장을 만들고 설문 링크 공유 |
| 3 | 설문 응답 및 편지 작성 | 4 | Guest가 설문 응답하고 편지 작성 |
| 4 | 식당 추천 및 알림 시스템 | 5 | AI 기반 식당 추천과 알림 |
| 5 | 편지 열람 (2주 대기 / 즉시 결제) | 4 | 무료 대기 또는 결제 즉시 열람 |
| 6 | 최종 청모장 공유 | 3 | 선택한 식당과 일정을 공유 |

---

## Functional Requirements Inventory

### MVP 범위 FR

| FR ID | 설명 | 범위 |
|-------|------|------|
| FR-1.1 | 고유한 청모장 생성 | MVP |
| FR-1.2 | 그룹 이름 설정 | MVP |
| FR-1.3 | 선호 옵션 미리 설정 | MVP |
| FR-1.4 | 청모장 목록 조회 | MVP |
| FR-1.5 | 청모장 수정/삭제 | MVP |
| FR-2.1 | 고유한 설문 URL 생성 | MVP |
| FR-2.2 | 링크 복사 | MVP |
| FR-2.3 | 카카오톡 공유 | MVP |
| FR-3.1 | 실시간 응답 현황 확인 | MVP |
| FR-3.2 | 응답자/미응답자 구분 표시 | MVP |
| FR-3.3 | 설문 완료 시 운영자 알람 | MVP |
| FR-4.1 | 회원가입 없이 설문 응답 | MVP |
| FR-4.2 | 필수 질문 응답 검증 | MVP |
| FR-4.3 | 이름 입력 (필수) | MVP |
| FR-4.4 | 제출 후 수정 불가 | MVP |
| FR-5.1 | 설문과 함께 편지 작성 (선택) | MVP |
| FR-5.2 | 300자 제한 텍스트 | MVP |
| FR-5.3 | 이모지/스티커 추가 | MVP |
| FR-6.1 | 응답 종합 매칭 점수 산출 | MVP |
| FR-6.2 | Top 3-5개 식당 추천 | MVP |
| FR-6.3 | 매칭 이유 설명 | MVP |
| FR-6.4 | 식당 추천 완료 시 이메일 발송 | MVP |
| FR-7.1 | 2주 대기 후 무료 편지 열람 | MVP |
| FR-7.2 | 카드뷰 형태 편지 열람 | MVP |
| FR-7.3 | 결제(계좌이체) 후 즉시 편지 열람 | MVP |
| FR-7.4 | 운영자 수동 열람 권한 부여 | MVP |
| FR-7.5 | 영구 열람 가능 | MVP |
| FR-8.1 | 식당과 일정 입력 | MVP |
| FR-8.2 | 1종 디자인 템플릿 | MVP |
| FR-8.3 | 미리보기 기능 | MVP |
| FR-8.4 | 카카오톡/링크 공유 | MVP |
| FR-8.5 | 모바일 first 웹 표시 | MVP |

---

## FR Coverage Map

```
FR-1 (청모장 생성/관리) → Epic 2
FR-2 (설문 링크 공유)   → Epic 2
FR-3 (응답 현황)        → Epic 4
FR-4 (설문 응답)        → Epic 3
FR-5 (편지 작성)        → Epic 3
FR-6 (식당 추천)        → Epic 4
FR-7 (편지 열람)        → Epic 5
FR-8 (청모장 공유)      → Epic 6
```

---

## Epic 1: 프로젝트 기반 구축

**목표:** 배포 가능한 기본 인프라와 공통 컴포넌트를 구축하여 이후 에픽의 기반을 마련한다.

### Story 1.1: 프로젝트 초기 설정 및 개발 환경 구성

As a 개발자,
I want 프로젝트 구조와 개발 환경이 설정된 상태,
So that 팀이 일관된 환경에서 개발을 시작할 수 있다.

**Acceptance Criteria:**

- **Given** 빈 프로젝트 저장소
- **When** 초기 설정을 완료하면
- **Then** Next.js 프로젝트가 생성되고, ESLint/Prettier 설정이 적용된다
- **And** Tailwind CSS가 설정되고, 기본 레이아웃 컴포넌트가 존재한다
- **And** 로컬 개발 서버가 정상 실행된다

**Prerequisites:** 없음

**Technical Notes:** Next.js 14+, TypeScript, Tailwind CSS

---

### Story 1.2: 데이터베이스 스키마 및 연결 설정

As a 개발자,
I want 데이터베이스가 설계되고 연결된 상태,
So that 데이터를 안전하게 저장하고 조회할 수 있다.

**Acceptance Criteria:**

- **Given** 프로젝트 초기 설정이 완료된 상태
- **When** 데이터베이스 설정을 완료하면
- **Then** Supabase (PostgreSQL) 연결이 설정된다
- **And** Events, Survey_Responses, Letters, Restaurant_Recommendations 테이블이 생성된다
- **And** 마이그레이션 스크립트가 동작한다
- **And** Supabase Realtime이 활성화된다 (FR-3.1 실시간 응답 현황 지원)

**Prerequisites:** Story 1.1

**Technical Notes:** Drizzle ORM, Supabase (PostgreSQL), drizzle-kit migrate 사용, Supabase Realtime 활용

---

### Story 1.3: 공통 UI 컴포넌트 라이브러리 구축

As a 개발자,
I want 재사용 가능한 UI 컴포넌트가 준비된 상태,
So that 일관된 디자인으로 빠르게 화면을 구성할 수 있다.

**Acceptance Criteria:**

- **Given** 프로젝트 초기 설정이 완료된 상태
- **When** 공통 컴포넌트를 구현하면
- **Then** Button, Input, Card, Modal 컴포넌트가 존재한다
- **And** 웨딩 테마 컬러(Blush Pink, Soft Gold)가 적용된다
- **And** 모바일 퍼스트 반응형 스타일이 적용된다

**Prerequisites:** Story 1.1

**Technical Notes:** Tailwind CSS 커스텀 테마

---

### Story 1.4: 배포 파이프라인 구축

As a 개발자,
I want 자동화된 배포 환경,
So that 코드 변경이 신속하게 프로덕션에 반영된다.

**Acceptance Criteria:**

- **Given** 프로젝트가 Git 저장소에 연결된 상태
- **When** main 브랜치에 푸시하면
- **Then** Vercel에 자동 배포된다
- **And** Supabase 환경 변수가 안전하게 관리된다
- **And** 배포 URL이 생성된다

**Prerequisites:** Story 1.1, Story 1.2

**Technical Notes:** Vercel (Next.js 호스팅), Supabase (DB + Realtime), GitHub 연동 자동 배포

---

## Epic 2: 청모장 생성 및 설문 시스템

**목표:** Host가 청모장을 생성하고 설문 링크를 공유할 수 있는 핵심 기능을 구현한다.

**관련 FR:** FR-1.1, FR-1.2, FR-1.3, FR-1.4, FR-1.5, FR-2.1, FR-2.2, FR-2.3

### Story 2.1: 랜딩 페이지 및 서비스 소개

As a 방문자,
I want 서비스의 가치를 한눈에 이해할 수 있는 랜딩 페이지,
So that 서비스 사용 여부를 결정할 수 있다.

**Acceptance Criteria:**

- **Given** 사용자가 메인 URL에 접속하면
- **When** 랜딩 페이지가 로드되면
- **Then** 서비스 소개와 핵심 가치가 표시된다
- **And** "청모장 만들기" CTA 버튼이 눈에 띄게 배치된다
- **And** 3-step 프로세스 안내가 표시된다
- **And** 모바일에서 2초 이내 로딩된다

**Prerequisites:** Story 1.3, Story 1.4

**Technical Notes:** SEO 최적화, OG 태그 설정

---

### Story 2.2: 청모장 기본 정보 입력 (Step 1)

As a Host(예비 신부),
I want 청모장의 기본 정보를 입력,
So that 나만의 청모장을 생성할 수 있다.

**Acceptance Criteria:**

- **Given** 사용자가 "청모장 만들기"를 클릭하면
- **When** 기본 정보 입력 폼이 표시되면
- **Then** 그룹 이름(필수)을 입력할 수 있다
- **And** 예상 인원, 선호 지역, 예산 범위를 선택할 수 있다 (선택)
- **And** "다음" 버튼 클릭 시 청모장이 생성되고 고유 ID가 부여된다
- **And** 생성된 청모장이 데이터베이스에 저장된다

**Prerequisites:** Story 1.2, Story 2.1

**Technical Notes:** FR-1.1, FR-1.2, FR-1.3 구현

---

### Story 2.3: 설문 링크 생성 및 공유 (Step 2)

As a Host,
I want 설문 링크를 생성하고 친구들에게 공유,
So that 친구들이 설문에 참여할 수 있다.

**Acceptance Criteria:**

- **Given** 청모장이 생성된 상태
- **When** 설문 링크 공유 화면이 표시되면
- **Then** 고유한 설문 URL이 자동 생성된다
- **And** "링크 복사" 버튼 클릭 시 클립보드에 복사된다
- **And** 카카오톡 공유 버튼 클릭 시 카카오톡 공유 팝업이 열린다
- **And** 공유 시 청모장 이름과 초대 메시지가 포함된다

**Prerequisites:** Story 2.2

**Technical Notes:** FR-2.1, FR-2.2, FR-2.3 구현, Kakao SDK 연동

---

### Story 2.4: 내 청모장 목록 관리

As a Host,
I want 내가 만든 청모장 목록을 확인하고 관리,
So that 여러 청모장을 효율적으로 관리할 수 있다.

**Acceptance Criteria:**

- **Given** 사용자가 청모장을 1개 이상 생성한 상태
- **When** "내 청모장" 페이지에 접속하면
- **Then** 생성한 청모장 목록이 표시된다
- **And** 각 청모장의 상태(수집중/완료)가 표시된다
- **And** 청모장을 클릭하면 상세 페이지로 이동한다

**Prerequisites:** Story 2.2

**Technical Notes:** FR-1.4 구현, 로컬스토리지 또는 선택적 로그인으로 식별

---

### Story 2.5: 청모장 수정 및 삭제

As a Host,
I want 청모장 정보를 수정하거나 삭제,
So that 잘못 입력한 정보를 수정할 수 있다.

**Acceptance Criteria:**

- **Given** 청모장 상세 페이지에서
- **When** 수정 버튼을 클릭하면
- **Then** 그룹 이름, 선호 옵션을 수정할 수 있다
- **And** 저장 시 변경사항이 반영된다
- **When** 삭제 버튼을 클릭하면
- **Then** 확인 모달이 표시되고, 확인 시 청모장이 삭제된다

**Prerequisites:** Story 2.4

**Technical Notes:** FR-1.5 구현

---

## Epic 3: 설문 응답 및 편지 작성

**목표:** Guest가 설문에 응답하고 축하 편지를 작성할 수 있는 기능을 구현한다.

**관련 FR:** FR-4.1, FR-4.2, FR-4.3, FR-4.4, FR-5.1, FR-5.2, FR-5.3

### Story 3.1: 설문 응답 페이지 접근

As a Guest(참석자),
I want 공유받은 링크로 설문 페이지에 접근,
So that 회원가입 없이 바로 설문에 참여할 수 있다.

**Acceptance Criteria:**

- **Given** Guest가 공유받은 설문 링크를 클릭하면
- **When** 설문 페이지가 로드되면
- **Then** Host의 이름과 청모장 제목이 표시된다
- **And** 회원가입/로그인 없이 바로 설문 시작 가능하다
- **And** 이름 입력란(필수)이 표시된다
- **And** 페이지가 2초 이내 로딩된다

**Prerequisites:** Story 2.3

**Technical Notes:** FR-4.1, FR-4.3 구현 (이름 필수 입력)

---

### Story 3.2: 설문 질문 응답

As a Guest,
I want 취향에 대한 질문에 쉽게 응답,
So that 내 선호도가 식당 선택에 반영된다.

**Acceptance Criteria:**

- **Given** 설문 페이지에 접근한 상태
- **When** 설문 질문이 표시되면
- **Then** 음식 종류(복수선택), 가격대, 분위기(복수선택) 필수 질문이 표시된다
- **And** 식이 제한, 선호 위치 선택 질문이 표시된다
- **And** 필수 질문 미응답 시 제출 버튼이 비활성화된다
- **And** 3분 이내 완료 가능한 분량이다

**Prerequisites:** Story 3.1

**Technical Notes:** FR-4.2 구현, 프로그레스 바 표시

---

### Story 3.3: 편지 작성

As a Guest,
I want Host에게 축하 편지를 작성,
So that 진심 어린 축하 메시지를 전달할 수 있다.

**Acceptance Criteria:**

- **Given** 설문 응답을 완료한 상태
- **When** 편지 작성 화면이 표시되면
- **Then** 300자 제한의 텍스트를 입력할 수 있다
- **And** 글자 수 카운터가 실시간 표시된다
- **And** 이모지/스티커를 추가할 수 있다
- **And** 편지 작성은 선택사항이며 건너뛸 수 있다

**Prerequisites:** Story 3.2

**Technical Notes:** FR-5.1, FR-5.2, FR-5.3 구현

---

### Story 3.4: 설문 제출 및 완료

As a Guest,
I want 설문과 편지를 제출,
So that 내 응답이 Host에게 전달된다.

**Acceptance Criteria:**

- **Given** 설문과 편지(선택)를 작성한 상태
- **When** 제출 버튼을 클릭하면
- **Then** 응답이 데이터베이스에 저장된다
- **And** 완료 페이지가 표시된다 ("소중한 의견 감사합니다 💕")
- **And** 동일 링크로 재접속 시 이미 응답 완료 메시지가 표시된다
- **And** 제출 후 수정은 불가하다

**Prerequisites:** Story 3.3

**Technical Notes:** FR-4.4 구현, 중복 제출 방지

---

## Epic 4: 식당 추천 및 알림 시스템

**목표:** 수집된 설문 응답을 분석하여 최적의 식당을 추천하고, 완료 시 알림을 발송한다.

**관련 FR:** FR-3.1, FR-3.2, FR-3.3, FR-6.1, FR-6.2, FR-6.3, FR-6.4

### Story 4.1: 응답 현황 대시보드

As a Host,
I want 실시간 응답 현황을 확인,
So that 얼마나 많은 친구가 응답했는지 알 수 있다.

**Acceptance Criteria:**

- **Given** 청모장을 생성하고 링크를 공유한 상태
- **When** 청모장 상세 페이지에 접속하면
- **Then** 총 응답자 수가 실시간으로 표시된다
- **And** 응답 완료자 목록(이름)이 표시된다
- **And** 응답 현황이 시각적으로 표시된다 (예: 프로그레스 바)

**Prerequisites:** Story 3.4

**Technical Notes:** FR-3.1, FR-3.2 구현

---

### Story 4.2: 설문 완료 운영자 알람

As a 운영자,
I want 특정 그룹의 설문이 완료되면 알람을 받고 싶다,
So that 적시에 식당 추천을 진행할 수 있다.

**Acceptance Criteria:**

- **Given** 청모장의 설문 수집이 진행 중인 상태
- **When** Host가 설문 수집을 완료 처리하면
- **Then** 운영자에게 알람이 전달된다 (이메일/슬랙 등)
- **And** 알람에 청모장 정보와 응답자 수가 포함된다

**Prerequisites:** Story 4.1

**Technical Notes:** FR-3.3 구현, 이메일 또는 슬랙 웹훅

---

### Story 4.3: 식당 추천 알고리즘 구현

As a 시스템,
I want 설문 응답을 분석하여 최적 식당을 추천,
So that Host가 데이터 기반으로 식당을 선택할 수 있다.

**Acceptance Criteria:**

- **Given** 3명 이상의 설문 응답이 수집된 상태
- **When** 추천 알고리즘이 실행되면
- **Then** 음식 종류, 가격대, 분위기, 식이 제한, 위치를 가중치 기반으로 분석한다
- **And** 각 식당별 매칭 점수(%)가 산출된다
- **And** 결과가 5초 이내 생성된다

**Prerequisites:** Story 4.2, 식당 데이터 시드

**Technical Notes:** FR-6.1 구현, Rule-based 알고리즘

---

### Story 4.4: 추천 식당 리스트 및 이메일 발송

As a Host,
I want 추천 식당 리스트를 확인하고 이메일로 알림 받기,
So that 최적의 식당을 선택할 수 있다.

**Acceptance Criteria:**

- **Given** 추천 알고리즘이 실행된 상태
- **When** 결과 확인 페이지에 접속하면
- **Then** Top 3-5개 식당이 매칭 점수 순으로 표시된다
- **And** 각 식당의 이름, 사진, 위치, 가격대가 표시된다
- **And** 각 식당의 매칭 이유가 설명된다 (예: "80% 친구들이 한식 선호")
- **And** 식당 추천이 완료되면 Host에게 이메일이 발송된다

**Prerequisites:** Story 4.3

**Technical Notes:** FR-6.2, FR-6.3, FR-6.4 구현

---

### Story 4.5: 식당 선택 및 저장

As a Host,
I want 추천 식당 중 하나를 선택,
So that 청모장에 최종 식당을 확정할 수 있다.

**Acceptance Criteria:**

- **Given** 추천 식당 리스트가 표시된 상태
- **When** 식당을 선택하고 확인하면
- **Then** 선택한 식당이 청모장에 저장된다
- **And** 청모장 상태가 "식당 선택 완료"로 변경된다
- **And** 청모장 공유 단계로 이동할 수 있다

**Prerequisites:** Story 4.4

**Technical Notes:** Final_Selection 테이블 저장

---

## Epic 5: 편지 열람 (2주 대기 / 즉시 결제)

**목표:** 2주 대기 후 무료 열람 또는 결제(계좌이체) 후 즉시 열람할 수 있는 기능을 구현한다. 운영자가 수동으로 열람 권한을 부여한다.

**관련 FR:** FR-7.1, FR-7.2, FR-7.3, FR-7.4, FR-7.5

### Story 5.1: 편지 열람 대기 및 결제 안내 화면

As a Host,
I want 편지 열람 옵션을 확인,
So that 2주 기다리거나 결제하여 바로 볼 수 있다.

**Acceptance Criteria:**

- **Given** 청모장이 생성된 후 열람 권한이 없는 상태
- **When** 편지 열람 페이지에 접속하면
- **Then** 편지 개수가 표시된다 (예: "5명의 친구가 편지를 남겼어요")
- **And** 2주 대기 시 무료 열람 가능 안내와 D-day 카운트다운이 표시된다
- **And** 즉시 열람을 원할 경우 결제 안내가 표시된다 (가격, 계좌번호)
- **And** "결제 완료 후 운영자 확인 시 열람 가능" 안내가 표시된다

**Prerequisites:** Story 3.4

**Technical Notes:** FR-7.1, FR-7.3 구현, 청모장 생성일 기준 2주 계산

---

### Story 5.2: 결제 요청 및 운영자 알림

As a Host,
I want 결제 후 즉시 열람을 요청,
So that 운영자가 확인 후 열람 권한을 부여할 수 있다.

**Acceptance Criteria:**

- **Given** 결제 안내 화면에서
- **When** "결제 완료" 버튼을 클릭하면
- **Then** 결제 확인 요청이 운영자에게 전달된다 (이메일/슬랙)
- **And** 알림에 청모장 정보, Host 정보가 포함된다
- **And** Host에게 "운영자 확인 중" 상태가 표시된다

**Prerequisites:** Story 5.1

**Technical Notes:** FR-7.3 구현, 운영자 알림 시스템 연동

---

### Story 5.3: 운영자 열람 권한 부여 (Admin)

As a 운영자,
I want 결제 확인 후 열람 권한을 수동으로 부여,
So that Host가 편지를 즉시 열람할 수 있다.

**Acceptance Criteria:**

- **Given** 결제 확인 요청이 접수된 상태
- **When** 운영자가 관리 페이지에서 열람 권한 부여 버튼을 클릭하면
- **Then** 해당 청모장의 열람 권한이 활성화된다
- **And** Host에게 열람 가능 알림이 전달된다 (이메일)
- **And** 권한 부여 이력이 기록된다

**Prerequisites:** Story 5.2

**Technical Notes:** FR-7.4 구현, 간단한 Admin 페이지 필요

---

### Story 5.4: 편지 카드뷰 열람

As a Host,
I want 친구들의 편지를 카드뷰 형태로 열람,
So that 소중한 축하 메시지를 감상할 수 있다.

**Acceptance Criteria:**

- **Given** 열람 권한이 있는 상태 (2주 경과 또는 결제 승인)
- **When** 편지 열람 페이지에 접속하면
- **Then** 모든 편지가 카드뷰 형태로 표시된다
- **And** 각 편지의 작성자 이름이 표시된다
- **And** 카드를 넘기며 편지를 감상할 수 있다
- **And** 이후 재접속 시에도 편지 열람이 가능하다 (영구 열람)

**Prerequisites:** Story 5.3 또는 2주 경과

**Technical Notes:** FR-7.2, FR-7.5 구현, 카드 스와이프 UI

---

## Epic 6: 최종 청모장 공유

**목표:** 선택한 식당과 일정 정보를 디자인 템플릿으로 친구들에게 공유한다.

**관련 FR:** FR-8.1, FR-8.2, FR-8.3, FR-8.4, FR-8.5

### Story 6.1: 청모장 정보 입력

As a Host,
I want 최종 모임 정보를 입력,
So that 친구들에게 정확한 정보를 공유할 수 있다.

**Acceptance Criteria:**

- **Given** 식당을 선택한 상태
- **When** 청모장 공유 단계에 진입하면
- **Then** 선택한 식당 정보가 자동 표시된다
- **And** 모임 날짜와 시간을 입력할 수 있다
- **And** 추가 메시지를 입력할 수 있다 (선택)

**Prerequisites:** Story 4.5

**Technical Notes:** FR-8.1 구현

---

### Story 6.2: 청모장 디자인 및 미리보기

As a Host,
I want 디자인 템플릿을 확인하고 미리보기,
So that 청모장이 어떻게 보일지 확인할 수 있다.

**Acceptance Criteria:**

- **Given** 모임 정보를 입력한 상태
- **When** 디자인 화면이 표시되면
- **Then** 1종의 기본 청모장 템플릿이 적용된다
- **And** 실시간 미리보기가 표시된다
- **And** 미리보기에 식당, 일정, 메시지가 포함된다

**Prerequisites:** Story 6.1

**Technical Notes:** FR-8.2, FR-8.3 구현

---

### Story 6.3: 청모장 공유

As a Host,
I want 완성된 청모장을 친구들에게 공유,
So that 모임 정보를 알릴 수 있다.

**Acceptance Criteria:**

- **Given** 청모장 미리보기를 확인한 상태
- **When** 공유 버튼을 클릭하면
- **Then** 카카오톡, 링크 복사 옵션이 표시된다
- **And** 카카오톡 공유 시 미리보기 이미지가 포함된다
- **When** 공유된 링크를 클릭하면
- **Then** 모바일 first 웹 페이지로 청모장이 표시된다
- **And** 모바일에서 최적화되어 보인다

**Prerequisites:** Story 6.2

**Technical Notes:** FR-8.4, FR-8.5 구현, Kakao SDK, OG 이미지 생성

---

## FR Coverage Matrix

| FR ID | Epic | Story | 상태 |
|-------|------|-------|------|
| FR-1.1 | Epic 2 | Story 2.2 | ✓ |
| FR-1.2 | Epic 2 | Story 2.2 | ✓ |
| FR-1.3 | Epic 2 | Story 2.2 | ✓ |
| FR-1.4 | Epic 2 | Story 2.4 | ✓ |
| FR-1.5 | Epic 2 | Story 2.5 | ✓ |
| FR-2.1 | Epic 2 | Story 2.3 | ✓ |
| FR-2.2 | Epic 2 | Story 2.3 | ✓ |
| FR-2.3 | Epic 2 | Story 2.3 | ✓ |
| FR-3.1 | Epic 4 | Story 4.1 | ✓ |
| FR-3.2 | Epic 4 | Story 4.1 | ✓ |
| FR-3.3 | Epic 4 | Story 4.2 | ✓ |
| FR-4.1 | Epic 3 | Story 3.1 | ✓ |
| FR-4.2 | Epic 3 | Story 3.2 | ✓ |
| FR-4.3 | Epic 3 | Story 3.1 | ✓ |
| FR-4.4 | Epic 3 | Story 3.4 | ✓ |
| FR-5.1 | Epic 3 | Story 3.3 | ✓ |
| FR-5.2 | Epic 3 | Story 3.3 | ✓ |
| FR-5.3 | Epic 3 | Story 3.3 | ✓ |
| FR-6.1 | Epic 4 | Story 4.3 | ✓ |
| FR-6.2 | Epic 4 | Story 4.4 | ✓ |
| FR-6.3 | Epic 4 | Story 4.4 | ✓ |
| FR-6.4 | Epic 4 | Story 4.4 | ✓ |
| FR-7.1 | Epic 5 | Story 5.1 | ✓ |
| FR-7.2 | Epic 5 | Story 5.4 | ✓ |
| FR-7.3 | Epic 5 | Story 5.1, 5.2 | ✓ |
| FR-7.4 | Epic 5 | Story 5.3 | ✓ |
| FR-7.5 | Epic 5 | Story 5.4 | ✓ |
| FR-8.1 | Epic 6 | Story 6.1 | ✓ |
| FR-8.2 | Epic 6 | Story 6.2 | ✓ |
| FR-8.3 | Epic 6 | Story 6.2 | ✓ |
| FR-8.4 | Epic 6 | Story 6.3 | ✓ |
| FR-8.5 | Epic 6 | Story 6.3 | ✓ |

---

## Summary

- **총 에픽:** 6개
- **총 스토리:** 25개
- **MVP FR 커버리지:** 100% (32/32 FR)
- **예상 구현 기간:** 각 스토리 2-4시간 (AI 에이전트 기준)

### 주요 변경사항 (v3)

1. **FR-3.3**: 리마인더 → 설문 완료 시 운영자 알람 (Story 4.2 신규)
2. **FR-4.3**: 이름 입력 필수로 변경
3. **FR-5.2**: 200자 → 300자 제한
4. **FR-5.3**: 이모지/스티커 MVP로 승격
5. **FR-6.4**: 식당 추천 완료 시 이메일 발송 추가 (Story 4.4에 통합)
6. **FR-7 전면 개편**: 하이브리드 모델
   - FR-7.1: 2주 대기 후 무료 열람
   - FR-7.2: 카드뷰 형태
   - FR-7.3: 결제(계좌이체) 후 즉시 열람 (신규)
   - FR-7.4: 운영자 수동 열람 권한 부여 (신규)
   - FR-7.5: 영구 열람 가능
7. **FR-8.2**: 4-5종 → 1종 템플릿
8. **FR-8.4**: 문자 공유 삭제
9. **FR-8.5**: 반응형 → 모바일 first
10. **Epic 5 확장**: 2 스토리 → 4 스토리 (Admin 기능 추가)

### 에픽 순서 근거

1. **Epic 1 (기반):** 모든 기능의 토대가 되는 인프라 구축
2. **Epic 2 (Host 핵심):** Host의 핵심 여정 - 청모장 생성과 링크 공유
3. **Epic 3 (Guest 핵심):** Guest의 핵심 여정 - 설문 응답과 편지 작성
4. **Epic 4 (가치 전달):** AI 추천 + 알림 시스템
5. **Epic 5 (수익화 + 감성):** 2주 대기(무료) 또는 결제(즉시) + 운영자 Admin
6. **Epic 6 (완결):** 전체 여정의 완결 - 최종 공유

각 에픽은 이전 에픽의 결과물에 의존하며, 순방향 의존성만 존재합니다.

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._
