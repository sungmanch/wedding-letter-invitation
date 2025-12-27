# 템플릿 선택 테스트 프롬프트

AI 템플릿 선택 시스템을 테스트하기 위한 프롬프트 모음입니다.

각 프롬프트는 해당 템플릿의 고유한 특징(색상, mood, keywords)을 반영하여 작성되었습니다.

---

## unique1 - 클래식 엘레강스

**고유 특징**:
- 색상: 흰색/검정 (#1A1A1A, #FFFFFF)
- mood: elegant, classic, simple, timeless
- keywords: white-bg, black-text, minimalist, outdoor

### 테스트 프롬프트

```
흰 배경에 검정 스크립트 폰트로 클래식하고 심플한 청첩장을 만들고 싶어요
```

```
미니멀하고 우아한 흰색 배경 청첩장이 필요해요
```

```
검정 텍스트만 사용한 클래식한 디자인을 원해요
```

---

## unique2 - 캐주얼 플레이풀

**고유 특징**:
- 색상: 그레이 톤 (#1A1A1A, #CCCCCC, #FFFFFF)
- mood: casual, playful, joyful, friendly
- keywords: studio, portrait, vertical-photo, playful-pose

### 테스트 프롬프트

```
스튜디오에서 찍은 즐거운 포즈 사진으로 세로형 카드 레이아웃 청첩장을 만들고 싶어요
```

```
친구들에게 보낼 캐주얼하고 즐거운 느낌의 청첩장이 필요해요
```

```
포트레이트 사진을 중심으로 한 플레이풀한 디자인을 원해요
```

---

## unique3 - 미니멀 모던

**고유 특징**:
- 색상: 하늘 블루 배경 (#87CEEB, #B0E0E6)
- mood: minimal, modern, clean, simple
- keywords: outdoor, sky, fullscreen-bg, white-card-overlay

### 테스트 프롬프트

```
야외 전체 배경 사진 위에 흰색 카드를 올린 미니멀하고 깔끔한 청첩장을 만들고 싶어요
```

```
하늘 배경에 심플한 텍스트 카드가 있는 모던한 디자인이 좋아요
```

```
전체 배경 이미지 위에 깔끔한 오버레이를 사용한 미니멀 청첩장을 원해요
```

---

## unique4 - 다크 로맨틱

**고유 특징**:
- 색상: 산호/연어 핑크 (#FF7F7F, #FF9999, #FFB3B3)
- mood: romantic, dramatic, emotional, cinematic
- keywords: dark-bg, dark-overlay, coral-pink, salmon-pink

### 테스트 프롬프트

```
어두운 배경에 산호색이나 연어 핑크 텍스트로 드라마틱하고 감성적인 청첩장을 만들고 싶어요
```

```
영화 같은 분위기의 다크톤 배경에 핑크 강조색이 있는 청첩장이 필요해요
```

```
감성적이고 로맨틱한 어두운 배경 청첩장을 원해요
```

---

## unique5 - 브라이트 캐주얼

**고유 특징**:
- 색상: 로열블루 (#4169E1, #1E90FF, #6495ED)
- mood: bright, casual, modern, fun, youthful
- keywords: blue-theme, sky-bg, bangers-font, big-number, white-number

### 테스트 프롬프트

```
하늘 배경에 흰색 큰 숫자와 블루 톤 텍스트로 밝고 젊은 느낌의 청첩장을 만들고 싶어요
```

```
블루 컬러를 사용한 밝고 즐거운 느낌의 청첩장이 필요해요
```

```
하늘색 테마로 큰 숫자가 들어간 캐주얼한 디자인을 원해요
```

---

## unique6 - 모노크롬 볼드

**고유 특징**:
- 색상: 딥핑크/마젠타 (#FF1493, #FF69B4)
- mood: bold, minimal, modern, striking, edgy
- keywords: monochrome, black-white, grayscale-filter, hot-pink, deep-pink

### 테스트 프롬프트

```
흑백 사진에 딥핑크 강조색으로 볼드하고 세련된 청첩장을 만들고 싶어요
```

```
모노크롬 필터에 핫핑크 텍스트가 있는 현대적인 디자인이 필요해요
```

```
흑백 사진과 강렬한 핑크 컬러를 조합한 볼드한 청첩장을 원해요
```

---

## 템플릿 차별화 요약

| 템플릿 | 핵심 키워드 | 색상 특징 | 분위기 |
|--------|-------------|-----------|--------|
| unique1 | 흰 배경, 검정 텍스트, 미니멀 | 흰색/검정만 | 클래식하고 심플 |
| unique2 | 스튜디오, 세로 카드, 즐거운 포즈 | 그레이 톤 | 캐주얼하고 즐거움 |
| unique3 | 야외 배경, 흰 카드 오버레이 | 하늘 블루 (배경) | 미니멀하고 깔끔 |
| unique4 | 어두운 배경, 산호/연어 핑크 | 산호핑크 (#FF7F7F) | 드라마틱하고 감성적 |
| unique5 | 하늘 배경, 큰 숫자, 블루 | 로열블루 (#4169E1) | 밝고 젊음 |
| unique6 | 흑백 필터, 딥핑크 | 딥핑크 (#FF1493) | 볼드하고 세련됨 |

---

## 테스트 방법

1. 랜딩 페이지(`/`) 접속
2. 각 프롬프트를 입력 필드에 입력
3. AI 생성 버튼 클릭
4. 개발자 도구 콘솔에서 선택된 템플릿 확인:
   ```
   [AI Template Selection] ✅ Success: {
     templateId: 'unique5',
     confidence: 0.85,
     reasoning: { ... }
   }
   ```
5. 생성된 청첩장에서 템플릿이 올바르게 적용되었는지 확인

---

## AI 선택 기준

AI는 다음 순서로 템플릿을 선택합니다:

1. **분위기 일치 (mood match)**: 사용자가 요청한 느낌과 템플릿 mood 비교
2. **색상 조화 (color match)**: 프롬프트의 색상 키워드와 템플릿 colors 비교
3. **키워드 매칭**: 프롬프트의 핵심 키워드와 템플릿 keywords 일치도
4. **신뢰도 (confidence)**: 0.0 ~ 1.0 (0.7 이상이면 높은 확신)

---

## 참고 파일

- 템플릿 메타데이터: `src/lib/super-editor-v2/config/template-catalog.ts`
- 템플릿 구현: `src/lib/super-editor-v2/config/template-catalog-v2.ts`
- AI 선택 로직: `src/app/api/landing/generate/route.ts`
