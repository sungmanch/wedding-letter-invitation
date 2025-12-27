# VariablePath 전체 목록

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

  // 커스텀 (AI 생성용)
  | `custom.${string}`
```

## 블록 타입별 주요 바인딩

### hero
- `couple.photo`, `couple.groom.name`, `couple.bride.name`
- `wedding.dateDisplay`, `wedding.dday`

### greeting-parents
- `greeting.title`, `greeting.content`
- `parents.groom.*`, `parents.bride.*`

### profile
- `couple.groom.*`, `couple.bride.*`
- `couple.photo`, `couple.photos`

### calendar
- `wedding.date`, `wedding.month`, `wedding.day`, `wedding.weekday`
- `countdown.days`, `countdown.hours`, `countdown.minutes`

### location
- `venue.name`, `venue.hall`, `venue.address`, `venue.tel`
- `venue.lat`, `venue.lng`
- `venue.naverUrl`, `venue.kakaoUrl`, `venue.tmapUrl`

### account
- `accounts.groom`, `accounts.bride`
- `accounts.kakaopay.groom`, `accounts.kakaopay.bride`

### rsvp
- `rsvp.title`, `rsvp.description`, `rsvp.deadline`

### gallery
- `photos.gallery`, `gallery.effect`

### notice
- `notice.items`

### ending
- `ending.message`, `ending.photo`
