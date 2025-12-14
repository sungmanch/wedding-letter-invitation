# Maison de Letter - Product Requirements Document

**Author:** BMad
**Date:** 2025-12-15
**Version:** 4.1

---

## Executive Summary

개인화된 모바일 청첩장 생성 서비스. 기존의 뻔한 템플릿 기반 청첩장 서비스와 달리, AI가 커플의 스토리와 선호도를 바탕으로 유니크한 청첩장 디자인을 생성해준다. 14개 섹션 시스템(필수 5개 + 권장 3개 + 선택 4개 + Post-MVP 2개)과 7개의 인트로 스타일 프리셋으로 완전히 맞춤화된 청첩장을 만들 수 있으며, 게스트들은 RSVP와 방명록을 통해 특별한 순간을 함께 나눌 수 있다.

**캐치프레이즈:** "원하는 분위기를 말하면, AI가 바로 시안을 만들어 드립니다"

**타겟 사용자:** 남들과 다른 특별한 청첩장을 원하는 20-30대 예비 신부

**비즈니스 모델:** 청첩장 건당 결제 (19,900원)

### What Makes This Special

기존 모바일 청첩장 서비스들은 수십 개의 미리 만들어진 템플릿 중에서 선택하는 방식이다. 아무리 예쁜 템플릿이라도 "어디서 본 것 같은" 느낌을 지울 수 없다.

이 서비스는 다르다:
- **2단계 AI 생성**: Stage 1에서 기본 정보 입력, Stage 2에서 Letty AI와 대화하며 분위기/색상 선택
- **Gemini AI 기반**: Google Gemini API로 스타일 + 레이아웃을 자동 생성
- **7개 인트로 프리셋 + custom**: Cinematic, Magazine, Exhibition 등 7개 프리셋 + AI 커스텀 생성
- **10개 핵심 섹션**: 인트로, 인사말, 일시, 오시는 길, 갤러리, 혼주, 계좌, 연락처, 방명록, 배경음악
- **3탭 실시간 편집**: 콘텐츠 / 디자인 / 공유 탭으로 구분된 편집 시스템
- **게스트 방명록**: 청첩장을 받은 게스트가 축하 메시지를 남기고, Host만 열람 가능

---

## Project Classification

**Technical Type:** web_app
**Domain:** general
**Complexity:** medium

모바일 우선 웹 애플리케이션으로, 복잡한 규제나 도메인 특화 요구사항이 없는 일반 소비자 대상 서비스이다. 핵심 기술 챌린지는 AI 기반 디자인 생성, 확장 가능한 섹션 시스템, 실시간 편집 경험에 있다.

---

## Success Criteria

### MVP 성공 정의

**MVP 성공 = 20명 결제 완료**

| 지표 | 목표 | 기간 | 전환율 |
|------|------|------|--------|
| 회원가입 | 100명 | 1개월 | - |
| 결제 완료 | 20명 | 1개월 | 20% |

### 핵심 전환 퍼널

```
방문 → 회원가입 → 이미지 업로드/테마 선택 → AI 프리뷰 생성 → 디자인 선택
→ 2패널 편집 → 미리보기 확인 → 결제 완료 → 공유
```

**핵심 전환 지표:** 결제 완료

### 사용자 획득 전략

**1. SEO (Primary)**
- 타겟 키워드: "모바일 청첩장", "청첩장 만들기", "개인화 청첩장", "AI 청첩장"
- 콘텐츠: 청첩장 작성 가이드, 트렌드 소개

**2. 입소문 / 바이럴 루프 (Secondary)**
- 청첩장을 받은 게스트가 서비스 인지
- 본인 결혼 시 자연스럽게 재방문
- 청첩장 하단에 "Made with [서비스명]" 워터마크/링크

---

## Product Scope

### MVP - Minimum Viable Product

AI 기반 개인화 청첩장의 핵심 가치를 검증하기 위한 기능 세트

**1. 2단계 청첩장 생성 플로우**
- **Stage 1**: 기본 정보 입력 폼 (신랑/신부 이름, 결혼 날짜/시간, 장소명)
- **Stage 2**: Letty AI 채팅으로 분위기/색상 선택
- AI가 스타일 + 레이아웃 자동 생성 (Google Gemini)
- 디자인 재생성 가능 (추가 결제 없음)

**2. 청첩장 기본 정보**
- 신랑/신부 이름
- 신랑/신부 혼주 이름 (선택)
- 결혼 일시
- 결혼 장소 (장소명, 주소, 홀, 지도 좌표)
- 오시는 길 (버스, 지하철, 셔틀, 주차 안내)
- 연락처 (신랑측, 신부측)
- 축의금 계좌번호 (신랑측, 신부측 각 최대 3개)

**3. 인트로 스타일 프리셋 (7개 + custom)**
- Cinematic (Wong Kar-wai 영화적, dark/gold)
- Exhibition (갤러리 전시, light/minimal)
- Magazine (Vogue/Kinfolk 에디토리얼, warm/serif)
- Gothic Romance (버건디 & 에메랄드 드라마틱)
- Old Money (레터프레스 Quiet Luxury, cream/gold)
- Monogram (네이비 & 골드 로열)
- Jewel Velvet (딥 주얼 톤, emerald/dark)
- Custom (AI가 생성한 커스텀 스타일)
- None (인트로 스킵 가능)

**4. 섹션 시스템 (14개)**

| 구분 | 개수 | 섹션 목록 |
|------|------|----------|
| ✅ **필수** (비활성화 불가) | 5개 | intro, greeting, date, venue, gallery |
| ⭐ **권장** (기본 활성화) | 3개 | parents, contact, accounts |
| ○ **선택** (기본 비활성화) | 4개 | notice, rsvp, guestbook, music |
| 🔜 **Post-MVP** | 2개 | video, ending |

**5. 확장 섹션 (Post-MVP)**
- Video, Ending 섹션 (컴포넌트 구현 완료, 시스템 미통합)

**6. 3탭 편집 시스템**
- **콘텐츠 탭**: 섹션 아코디언 UI (on/off 토글 + 필드 편집 통합)
- **디자인 탭**: StyleEditor (글꼴, 색상, 배경), 추천 스타일 원클릭 적용
- **공유 탭**: OG 메타데이터 편집 (제목, 설명, 이미지 커스텀)
- 실시간 모바일 프리뷰 (우측 패널)
- 섹션 순서 변경 지원

**7. 디자인 토큰 시스템**
- 60-30-10 컬러 법칙 (Background 60%, Surface 30%, Accent 10%)
- 자동 Surface 색상 계산 (`deriveSurfaceColor`)
- 30+ 폰트 프리셋 (한글 고딕/명조/손글씨 + 영문)
- 15+ 스크롤 모션 프리셋
- 29개 Primitive 타입 (레이아웃, 콘텐츠, 이미지, 애니메이션)

**8. 사진 업로드**
- 메인 사진 + 갤러리 이미지
- Supabase Storage 업로드
- 갤러리 섹션에서 자동 레이아웃 적용

**9. 게스트 방명록**
- 이름 + 메시지 입력
- 쿠키 기반 익명 추적
- Host만 열람 가능 (비공개)
- 방명록 FAB (스크롤 후 표시) + 모달 UI

**10. 미리보기 및 결제**
- 결제 전 전체 미리보기 확인
- 결제 후에도 내용 수정 가능
- Polar.sh 연동 (19,900원)

**11. 청첩장 공유**
- 링크 복사
- OG 메타데이터 커스텀 (카카오톡/문자 미리보기)
- 인트로 화면을 OG 이미지로 캡처 가능

### Growth Features (Post-MVP)

**확장 기능**
- 확장 섹션 시스템 통합 (Video, Ending)
- 영상 청첩장 (전체 페이지 영상)
- 이미지 AI 분석 (웨딩 사진에서 무드/컬러 자동 추출)
- 템플릿 마켓플레이스
- B2B 웨딩 업체 제휴
- 카카오톡 공유 SDK 연동

---

## User Experience Principles

### Visual Identity

- **톤:** 내추럴하고 세련된 웨딩 테마 (Fresh & Elegant)
- **랜딩 페이지 컬러**:
  - Primary Background: Ivory (#FAF6EE)
  - Surface Color: Sand (#F5EFE3)
  - Accent Color: Sage Green (#6B9B6B)
  - Border Color: Sand (#E8DFD0)
  - Text Primary: Dark Sage (#3D4F3D)
  - Text Body: Neutral Dark (#4A4A4A)
- **청첩장 컬러 (동적)**:
  - 60-30-10 법칙 적용 (Background 60% / Surface 30% / Accent 10%)
  - Surface 색상 자동 계산 (`deriveSurfaceColor`)
  - 7개 인트로 프리셋별 다른 컬러 팔레트
- **스타일:** 부드러운 곡선, 자연스러운 톤, 우아한 타이포그래피
- **Typography:**
  - 랜딩: Playfair Display (영문) + Noto Serif KR (한글) + Pretendard (본문)
  - 청첩장: 30+ 폰트 프리셋 (한글 고딕/명조/손글씨 + 영문 세리프/산세리프)

### Intro Style Presets (7개)

| 프리셋 | 설명 | 컬러 |
|--------|------|------|
| Cinematic | Wong Kar-wai 화양연화 | Dark #1A1A1A, Gold #C9A962 |
| Exhibition | 갤러리 전시 스타일 | Light #FAFAFA, Minimal |
| Magazine | Vogue/Kinfolk 에디토리얼 | Warm #F8F6F3, Serif |
| Gothic Romance | 버건디 & 에메랄드 드라마틱 | Dark, Burgundy #722F37 |
| Old Money | 레터프레스 Quiet Luxury | Cream #FFFEF5, Gold #D4AF37 |
| Monogram | 네이비 & 골드 로열 | Navy #1E3A5F, Gold #C9A962 |
| Jewel Velvet | 딥 주얼 톤 | Emerald #2F4538, Dark |

### Interaction Principles

- **모바일 First:** 터치 친화적 UI, 큰 버튼, 스와이프 제스처
- **2단계 AI 생성:** Stage 1 폼 → Stage 2 Letty 채팅
- **실시간 피드백:** 3탭 편집으로 즉각적 프리뷰
- **풍부한 애니메이션:** 40+ 애니메이션 프리셋 (입장, 연속, 루프, 퇴장)

### Key User Flows

**Host Flow (청첩장 생성):**
```
랜딩 (Split Hero + 템플릿 캐러셀 + AI 영상 데모)
→ "지금 바로 시작하기" 클릭
→ 회원가입/로그인
→ /se/create Stage 1: 기본 정보 입력 폼
   - 신랑/신부 이름
   - 결혼 날짜, 시간
   - 장소명
→ /se/create Stage 2: Letty AI 채팅
   - 분위기 선택 (romantic, elegant, minimal, modern, warm, luxury)
   - 색상 선택 (white-gold, blush-pink, deep-navy, natural-green, terracotta, custom)
→ AI 디자인 생성 (Gemini)
→ /se/[id]/edit 3탭 편집
   - 콘텐츠: 섹션별 정보 입력
   - 디자인: 글꼴, 색상, 배경
   - 공유: OG 메타데이터 설정
→ /se/[id]/dashboard 관리
→ 결제 (Polar.sh, 19,900원)
→ 청첩장 공유 (링크 복사)
```

**Guest Flow (청첩장 열람):**
```
링크 클릭 (/se/[id])
→ 인트로 화면 (스킵 가능)
→ 청첩장 섹션 스크롤
→ 방명록 FAB 클릭 (스크롤 후 표시)
→ 모달에서 축하 메시지 작성
→ 제출 완료
```

**Host Flow (방명록 관리):**
```
로그인 → /se → 내 청첩장 선택
→ /se/[id]/dashboard 또는 /se/[id]/guestbook
→ 방명록 목록 열람 (비공개)
```

---

## Functional Requirements

### 사용자 계정 및 인증

- **FR1:** ✅ 사용자는 이메일로 회원가입할 수 있다 (Supabase Auth)
- **FR2:** ✅ 사용자는 소셜 로그인(카카오)으로 회원가입할 수 있다
- **FR3:** ✅ 사용자는 로그인하여 세션을 유지할 수 있다
- **FR4:** 🔜 사용자는 비밀번호를 재설정할 수 있다 (미구현)

### 청첩장 생성 플로우

- **FR5:** ✅ Host는 /se/create에서 새 청첩장을 생성할 수 있다
- **FR5-1:** ✅ Stage 1에서 기본 정보를 폼으로 입력한다 (이름, 날짜, 시간, 장소)
- **FR5-2:** ✅ Stage 2에서 Letty AI와 대화하며 분위기/색상을 선택한다
- **FR6:** ✅ Host는 신랑/신부 이름을 입력할 수 있다
- **FR7:** ✅ Host는 신랑/신부 혼주 이름을 입력할 수 있다 (선택적)
- **FR8:** ✅ Host는 결혼 일시를 입력할 수 있다
- **FR9:** ✅ Host는 결혼 장소 정보를 입력할 수 있다 (장소명, 주소, 홀, 좌표)
- **FR9-1:** ✅ Host는 오시는 길 정보를 입력할 수 있다 (버스, 지하철, 셔틀, 주차)
- **FR10:** ✅ Host는 연락처를 입력할 수 있다 (신랑측, 신부측)
- **FR11:** ✅ Host는 축의금 계좌번호를 입력할 수 있다 (각 측 최대 3개)

### AI 디자인 생성

- **FR12:** ✅ Host는 Letty AI 채팅에서 원하는 분위기/색상을 선택할 수 있다
- **FR13:** ✅ 시스템은 Google Gemini로 스타일 + 레이아웃을 생성한다
- **FR14:** ✅ Host는 생성된 디자인을 확인하고 시작할 수 있다
- **FR15:** ✅ Host는 디자인을 재생성할 수 있다 (무료)
- **FR36:** 🔜 Host는 웨딩 사진을 업로드하여 AI가 분석하게 할 수 있다 (미구현)
- **FR37:** 🔜 시스템은 업로드된 이미지를 분석하여 무드/컬러/스타일을 추출한다 (미구현)

### 인트로 스타일

- **FR38:** ✅ Host는 7개 인트로 프리셋 + custom 중 선택할 수 있다
- **FR39:** ✅ Host는 인트로를 비활성화할 수 있다 (섹션 off)
- **FR40:** ✅ 각 인트로는 스킵 기능을 제공한다

### 섹션 시스템

- **FR41:** ✅ Host는 10개 핵심 섹션 중 원하는 섹션을 on/off 할 수 있다
- **FR42:** ✅ Host는 섹션 순서를 변경할 수 있다 (sectionOrder)
- **FR43:** ✅ Host는 각 섹션의 필드를 편집할 수 있다
- **FR44:** ✅ Host는 섹션을 숨길 수 있다 (sectionEnabled)

### RSVP (참석여부) - MVP

- **FR45:** 🔜 Host는 RSVP 섹션을 활성화할 수 있다 (선택 섹션)
- **FR46:** 🔜 Host는 RSVP 제목/설명을 커스터마이징할 수 있다
- **FR47:** 🔜 Host는 동행인 수, 식사 여부, 메시지 입력 옵션을 설정할 수 있다
- **FR48:** 🔜 Guest는 참석 여부를 제출할 수 있다 (yes/no/maybe)
- **FR48-1:** 🔜 Host는 RSVP 응답 목록을 대시보드에서 확인할 수 있다

### Notice (공지사항) - MVP

- **FR66:** 🔜 Host는 Notice 섹션을 활성화할 수 있다 (선택 섹션)
- **FR67:** 🔜 Host는 공지사항 항목을 추가/삭제할 수 있다 (최대 10개)
- **FR68:** 🔜 각 공지에 제목, 내용, 아이콘을 설정할 수 있다

### 확장 섹션 (Post-MVP)

- **FR69:** 🔜 Host는 Video 섹션에 영상을 추가할 수 있다 (컴포넌트 존재, 미통합)
- **FR70:** 🔜 Host는 Ending 섹션으로 마무리 메시지를 추가할 수 있다 (컴포넌트 존재, 미통합)

### 3탭 편집 시스템

- **FR49:** ✅ 편집 화면은 3탭 구조로 구성된다 (콘텐츠 / 디자인 / 공유)
- **FR49-1:** ✅ 콘텐츠 탭: 섹션 아코디언으로 on/off + 필드 편집 통합
- **FR49-2:** ✅ 디자인 탭: StyleEditor (글꼴, 색상, 배경)
- **FR49-3:** ✅ 공유 탭: OG 메타데이터 편집
- **FR50:** ✅ 편집 시 우측 모바일 프리뷰가 실시간으로 업데이트된다
- **FR51:** ✅ Host는 프리뷰에서 섹션을 클릭하여 해당 아코디언으로 이동할 수 있다

### 사진 업로드

- **FR16:** ✅ Host는 메인 사진 + 갤러리 이미지를 업로드할 수 있다
- **FR17:** ✅ 시스템은 갤러리 섹션에 사진 레이아웃을 적용한다
- **FR18:** ✅ Host는 업로드한 사진을 삭제하거나 교체할 수 있다
- **FR52:** 🔜 Host는 드래그앤드롭으로 사진 순서를 변경할 수 있다 (미구현)

### 미리보기 및 결제

- **FR19:** ✅ Host는 결제 전 청첩장 전체 미리보기를 확인할 수 있다 (/se/[id]/preview)
- **FR20:** ✅ Host는 청첩장 결제(19,900원)를 완료할 수 있다 (Polar.sh)
- **FR21:** ✅ Host는 결제 후에도 청첩장 내용을 수정할 수 있다

### 청첩장 공유

- **FR22:** 🔜 Host는 카카오톡으로 청첩장을 공유할 수 있다 (SDK 미연동)
- **FR23:** ✅ Host는 청첩장 링크를 복사할 수 있다
- **FR24:** 🔜 청첩장에는 서비스 워터마크/링크가 표시된다 (미구현)
- **FR24-1:** ✅ Host는 OG 메타데이터를 커스텀할 수 있다 (제목, 설명, 이미지)
- **FR24-2:** ✅ Host는 인트로 화면을 OG 이미지로 캡처할 수 있다

### 게스트 청첩장 열람

- **FR25:** ✅ Guest는 로그인 없이 청첩장을 열람할 수 있다 (/se/[id])
- **FR26:** ✅ Guest는 청첩장에서 결혼 정보를 확인할 수 있다 (일시, 장소, 지도)
- **FR27:** ✅ Guest는 축의금 계좌번호를 복사할 수 있다
- **FR53:** ✅ Guest는 인트로 화면을 보고 스킵할 수 있다

### 게스트 방명록

- **FR28:** ✅ Guest는 방명록 FAB를 통해 축하 메시지를 작성할 수 있다 (선택)
- **FR29:** ✅ Guest는 이름을 입력해야 한다 (필수)
- **FR30:** ✅ 축하 메시지는 제한된 길이로 작성된다
- **FR31:** ✅ Guest는 메시지 제출 후 수정할 수 없다
- **FR31-1:** ✅ 쿠키 기반으로 익명 게스트를 추적한다

### Host 방명록 관리

- **FR32:** ✅ Host는 받은 방명록 메시지 목록을 열람할 수 있다 (/se/[id]/guestbook)
- **FR33:** ✅ 방명록 메시지는 Host만 볼 수 있다 (비공개)
- **FR54:** 🔜 Host는 메시지 읽음/안읽음 상태를 확인할 수 있다 (미구현)

### 청첩장 관리

- **FR34:** ✅ Host는 자신이 만든 청첩장 목록을 조회할 수 있다 (/se)
- **FR35:** ✅ Host는 청첩장을 관리할 수 있다 (/se/[id]/dashboard)

### AI 채팅 정보 수집 (Stage 2)

- **FR55:** ✅ Stage 1 폼에서 신랑/신부 이름을 입력받는다
- **FR56:** ✅ Stage 1 폼에서 결혼 날짜를 입력받는다
- **FR57:** ✅ Stage 1 폼에서 결혼 시간을 입력받는다
- **FR58:** ✅ Stage 1 폼에서 장소명을 입력받는다
- **FR59:** 🔜 AI 채팅에서 부모님 이름을 수집한다 (미구현, 편집에서 입력)
- **FR60:** 🔜 AI 채팅에서 사진 업로드를 안내한다 (미구현)
- **FR61:** ✅ Stage 1에서 수집된 정보는 편집 페이지에 pre-filled 된다

### 디자인 시스템

- **FR62:** ✅ 60-30-10 컬러 법칙으로 Surface 색상 자동 계산
- **FR63:** ✅ 30+ 폰트 프리셋 지원 (Google Fonts 동적 로드)
- **FR64:** ✅ 40+ 애니메이션 프리셋 지원 (입장, 연속, 루프, 퇴장)
- **FR65:** ✅ 추천 스타일 원클릭 적용 (인트로 타입별)

---

## Non-Functional Requirements

### Performance

| 항목 | 기준 |
|------|------|
| AI 스타일 생성 (Stage 1) | 5초 이내 |
| AI 섹션 생성 (Stage 2) | 10초 이내 (병렬 처리) |
| 페이지 로딩 | 모바일에서 3초 이내 |
| 이미지 업로드 | Supabase Storage |
| LCP | 2.5초 이내 |

### Security

| 항목 | 설명 |
|------|------|
| 인증 | Supabase Auth (이메일 + 카카오 OAuth) |
| 청첩장 URL | 추측 불가능한 UUID 사용 |
| 방명록 메시지 | Host 외 접근 차단 (RLS) |
| 결제 | Polar.sh 연동 (민감 정보 미저장) |
| 개인정보 | 최소 수집 원칙 (이름, 연락처, 계좌) |

### SEO & Open Graph

| 항목 | 설명 |
|------|------|
| 서비스 페이지 | SEO 최적화 (메타 태그, 시맨틱 HTML) |
| 청첩장 페이지 | `noindex` 적용 (검색 노출 방지) |
| Open Graph | 커스텀 OG 메타데이터 (제목, 설명, 이미지) |
| OG 이미지 | 인트로 화면 캡처 → Supabase Storage 업로드 |
| 타겟 키워드 | "모바일 청첩장", "청첩장 만들기", "AI 청첩장" |

### Reliability

| 항목 | 기준 |
|------|------|
| 가용성 | 99% 이상 |
| 데이터 백업 | Supabase DB 자동 백업 |
| 에러 처리 | 사용자 친화적 에러 메시지 |
| AI 폴백 | 기본 스타일 프리셋 적용 |

### Tech Stack

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js 14+, React 18, TypeScript |
| Styling | Tailwind CSS, CSS Variables (Design Tokens) |
| AI | Google Gemini API (gemini-3-pro-preview) |
| Auth | Supabase Auth + Kakao OAuth |
| Database | PostgreSQL (Supabase), Drizzle ORM |
| Storage | Supabase Storage |
| Payment | Polar.sh |
| Hosting | Vercel |

### Super Editor Architecture

| 구성 요소 | 설명 |
|-----------|------|
| Schema | LayoutSchema, StyleSchema, VariablesSchema (JSON) |
| Tokens | SemanticDesignTokens → CSS Variables |
| Primitives | 29개 기본 빌딩 블록 (container, text, image, etc.) |
| Skeletons | 섹션별 구조 정의 (variants 포함) |
| Renderers | PrimitiveNode → React 컴포넌트 변환 |
| Builder | HTML/CSS/JS 정적 빌드 |
| Actions | Server Actions (CRUD, AI 생성, OG 업로드)

---

## PRD Summary

| 항목 | 내용 |
|------|------|
| **제품명** | Maison de Letter |
| **캐치프레이즈** | 원하는 분위기를 말하면, AI가 바로 시안을 만들어 드립니다 |
| **핵심 가치** | 2단계 AI 생성으로 만드는 나만의 개인화 청첩장 |
| **타겟** | 남들과 다른 청첩장을 원하는 20-30대 예비 신부 |
| **비즈니스 모델** | 건당 19,900원 |
| **MVP 성공 기준** | 1개월 내 20명 결제 |
| **구현 상태** | FR 70개 (✅ 49개 구현 / 🔜 21개 미구현) |
| **섹션 시스템** | 14개 (✅필수 5 + ⭐권장 3 + ○선택 4 + 🔜Post-MVP 2) |
| **인트로 프리셋** | 7개 + custom (cinematic, exhibition, magazine, gothic-romance, old-money, monogram, jewel-velvet) |
| **핵심 기술** | Google Gemini AI, Design Token System, 30+ 폰트, 40+ 애니메이션 |
| **디자인 톤** | 60-30-10 컬러 법칙, 인트로별 프리셋 |
| **결제** | Polar.sh |
| **인증** | Supabase Auth + Kakao OAuth |
| **스토리지** | Supabase Storage |

---

## Appendix

### Related Documents
- Architecture: `docs/architecture-invitation.md`
- UX Design Specification: `docs/ux-design-specification.md`
- Epic Breakdown: `docs/epics.md`

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-30 | 1.0 | Initial PRD | BMad |
| 2025-12-05 | 2.0 | v2 섹션 시스템, 인트로, 2패널 편집, FR 확장 | BMad |
| 2025-12-09 | 3.0 | 컬러 팔레트 변경 (Black&Gold → Ivory/Sage), 랜딩 페이지 단일 히어로로 변경, AI 채팅 정보 수집 확장 (FR55-61), User Flow 업데이트 | BMad |
| 2025-12-11 | 4.0 | 코드베이스 분석 기반 전면 업데이트: (1) 섹션 25개→10개 Core로 수정, (2) 인트로 11개→7개 프리셋+custom으로 수정, (3) 2패널→3탭 편집 시스템 반영, (4) Stage 1/2 생성 플로우 명시, (5) FR 구현 상태 표기 (✅/🔜), (6) Tech Stack 추가 (Gemini, Supabase, Polar.sh, Drizzle), (7) Super Editor Architecture 섹션 추가, (8) 라우트 구조 업데이트 (/se/*) | Claude |
| 2025-12-15 | 4.1 | section-data.md 기반 업데이트: (1) 섹션 10개→14개로 확장 (notice, rsvp 추가), (2) 섹션 분류 체계 도입 (필수/권장/선택/Post-MVP), (3) RSVP·Notice FR 추가 (FR45-48, FR66-68), (4) 확장 섹션 정리 (Video, Ending만 Post-MVP) | Claude |

---

_This PRD captures the essence of Maison de Letter - 2단계 AI 생성으로 만드는 나만의 특별한 청첩장_
