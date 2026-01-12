# Memory Game Hooks

메모리 카드 게임을 위한 React 훅들입니다.

## useGameTimer

게임 경과 시간을 측정하는 타이머 훅입니다.

### Usage

```typescript
import { useGameTimer } from '@/components/game/hooks'

function MyGame() {
  const timer = useGameTimer()

  return (
    <div>
      <p>시간: {Math.floor(timer.elapsedTime / 1000)}초</p>
      <button onClick={timer.start}>시작</button>
      <button onClick={timer.stop}>정지</button>
      <button onClick={timer.reset}>리셋</button>
    </div>
  )
}
```

### API

```typescript
interface UseGameTimerReturn {
  elapsedTime: number  // 밀리초 단위 경과 시간
  isRunning: boolean   // 타이머 실행 중 여부
  start: () => void    // 타이머 시작
  stop: () => number   // 타이머 정지 (최종 시간 반환)
  reset: () => void    // 타이머 초기화
}
```

## useMemoryGame

메모리 카드 게임의 전체 상태와 로직을 관리하는 훅입니다.

### Usage

```typescript
import { useMemoryGame } from '@/components/game/hooks'

function MemoryGame() {
  const game = useMemoryGame()

  return (
    <div>
      {game.phase === 'idle' && (
        <button onClick={game.startGame}>게임 시작</button>
      )}

      {game.phase === 'preview' && (
        <p>5초 동안 카드를 기억하세요!</p>
      )}

      {game.phase === 'playing' && (
        <div>
          <p>시간: {Math.floor(game.elapsedTime / 1000)}초</p>
          <p>실수: {game.mistakes}회</p>
          <p>진행: {game.matchedPairs} / {game.totalPairs}</p>

          <div className="grid grid-cols-7 gap-4">
            {game.cards.map((cardState) => (
              <button
                key={cardState.card.id}
                onClick={() => game.selectCard(cardState.card.id)}
                disabled={cardState.status !== 'hidden'}
              >
                {cardState.status === 'hidden' ? '?' : cardState.card.gamePreset.sectionName}
              </button>
            ))}
          </div>
        </div>
      )}

      {game.phase === 'finished' && game.scoreResult && (
        <div>
          <h2>게임 완료!</h2>
          <p>점수: {game.scoreResult.score}</p>
          <p>등급: {game.scoreResult.grade}</p>
          <p>할인율: {game.scoreResult.discountPercent}%</p>
          <button onClick={game.resetGame}>다시 하기</button>
        </div>
      )}
    </div>
  )
}
```

### API

```typescript
interface CardState {
  card: GameCard
  status: 'hidden' | 'revealed' | 'matched'
  isWrong: boolean  // 틀렸을 때 흔들림 애니메이션용
}

type GamePhase = 'idle' | 'preview' | 'playing' | 'finished'

interface UseMemoryGameReturn {
  // 상태
  cards: CardState[]              // 카드 배열
  phase: GamePhase                // 게임 페이즈
  mistakes: number                // 실수 횟수
  matchedPairs: number            // 매칭된 쌍 개수
  totalPairs: number              // 전체 쌍 개수
  elapsedTime: number             // 경과 시간 (밀리초)
  scoreResult: ScoreResult | null // 점수 결과 (게임 종료 시)

  // 액션
  startGame: () => void           // 게임 시작
  selectCard: (cardId: number) => void  // 카드 선택
  resetGame: () => void           // 게임 리셋
}
```

## Game Flow

```
idle
  ↓ startGame()
preview (5초)
  ↓ 자동
playing
  ↓ 모든 쌍 매칭 완료
finished
  ↓ resetGame()
idle
```

### Phase 설명

1. **idle**: 게임 시작 전
2. **preview**: 5초 동안 모든 카드 공개 (미리보기)
3. **playing**: 게임 진행 중 (타이머 작동)
4. **finished**: 게임 종료 (점수 표시)

### Card Selection Logic

1. 카드 클릭 시 `selectCard(cardId)` 호출
2. 카드 상태가 `hidden`인 경우에만 선택 가능
3. 한 번에 최대 2장까지 선택 가능
4. 2장 선택 시 자동으로 매칭 판정:
   - **매칭 성공**: 두 카드의 `pairId`가 같으면 `matched` 상태로 변경
   - **매칭 실패**: `isWrong: true`로 설정 (흔들림 애니메이션), 1초 후 다시 `hidden`으로 변경

## Dependencies

- `@/lib/game/preset-selector`: 프리셋 선택 및 카드 생성
- `@/lib/game/score-calculator`: 점수 계산

## Example: Complete Game Component

```typescript
'use client'

import { useMemoryGame } from '@/components/game/hooks'
import { formatTime, getGradeColor, getGradeMessage } from '@/lib/game/score-calculator'

export function MemoryGamePage() {
  const game = useMemoryGame()

  if (game.phase === 'idle') {
    return (
      <div className="flex h-screen items-center justify-center">
        <button
          onClick={game.startGame}
          className="px-8 py-4 bg-blue-500 text-white rounded-lg text-xl"
        >
          게임 시작
        </button>
      </div>
    )
  }

  if (game.phase === 'finished' && game.scoreResult) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">게임 완료!</h1>
          <div className="space-y-2">
            <p className="text-6xl font-bold" style={{ color: getGradeColor(game.scoreResult.grade) }}>
              {game.scoreResult.grade} 등급
            </p>
            <p className="text-2xl">{getGradeMessage(game.scoreResult.grade)}</p>
            <p className="text-xl">점수: {game.scoreResult.score}</p>
            <p className="text-xl">시간: {formatTime(game.elapsedTime)}</p>
            <p className="text-xl">실수: {game.mistakes}회</p>
            <p className="text-3xl font-bold text-red-500">
              {game.scoreResult.discountPercent}% 할인!
            </p>
          </div>
          <button
            onClick={game.resetGame}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg"
          >
            다시 하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-x-4">
          <span className="text-xl">시간: {formatTime(game.elapsedTime)}</span>
          <span className="text-xl">실수: {game.mistakes}회</span>
          <span className="text-xl">진행: {game.matchedPairs} / {game.totalPairs}</span>
        </div>
        {game.phase === 'preview' && (
          <span className="text-2xl font-bold text-blue-500">
            카드를 기억하세요!
          </span>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-7 gap-4">
        {game.cards.map((cardState) => (
          <button
            key={cardState.card.id}
            onClick={() => game.selectCard(cardState.card.id)}
            disabled={cardState.status !== 'hidden' || game.phase !== 'playing'}
            className={`
              aspect-square rounded-lg border-2 transition-all
              ${cardState.status === 'hidden' ? 'bg-gray-300' : 'bg-white'}
              ${cardState.status === 'matched' ? 'opacity-50' : ''}
              ${cardState.isWrong ? 'animate-shake border-red-500' : ''}
            `}
          >
            {cardState.status !== 'hidden' && (
              <span className="text-sm">
                {cardState.card.gamePreset.sectionName}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
```

## Notes

- 게임 시작 시 14개 섹션에서 랜덤 프리셋을 선택합니다 (총 28장 카드)
- 프리뷰 단계는 자동으로 5초 후 플레이 단계로 전환됩니다
- 매칭 실패 시 `isWrong` 플래그를 활용해 흔들림 애니메이션을 구현할 수 있습니다
- 모든 쌍을 매칭하면 자동으로 게임이 종료되고 점수가 계산됩니다
