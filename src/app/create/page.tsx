import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'
import { EventForm } from '@/components/forms/event-form'

export const metadata = {
  title: '청모장 만들기',
  description: '새로운 청모장을 만들고 친구들에게 설문을 공유하세요',
}

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-purple-100 bg-white">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center text-charcoal/60 hover:text-charcoal"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 text-center font-semibold text-charcoal">
            청모장 만들기
          </h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Gradient Hero Section */}
      <div className="bg-gradient-to-b from-primary-purple/30 via-primary-purple/10 to-transparent px-4 pb-6 pt-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-purple/20">
          <Users className="h-8 w-8 text-primary-purple" />
        </div>
        <h2 className="text-xl font-bold text-charcoal">
          청모 기본 정보를 알려주세요
        </h2>
        <p className="mt-2 text-sm text-charcoal/60">
          친구들과의 특별한 모임을 위한 첫 번째 단계예요
        </p>
      </div>

      {/* Form Content */}
      <div className="px-4 pb-8">
        <EventForm />
      </div>
    </main>
  )
}
