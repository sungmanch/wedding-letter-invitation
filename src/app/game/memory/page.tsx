import { Metadata } from 'next'
import { MemoryGame } from '@/components/game/MemoryGame'

export const metadata: Metadata = {
  title: '웨딩 카드 짝 맞추기 | Maison de Letter',
  description: '청첩장 섹션 카드를 맞추고 할인 쿠폰을 받으세요! 14가지 섹션의 짝을 맞춰 나만의 청첩장을 완성해보세요.',
  openGraph: {
    title: '웨딩 카드 짝 맞추기 게임',
    description: '청첩장 섹션 카드를 맞추고 할인 쿠폰을 받으세요!',
    type: 'website',
  },
}

export default function MemoryGamePage() {
  return <MemoryGame />
}
