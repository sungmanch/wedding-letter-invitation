import Link from 'next/link'

export default function ShareNotFound() {
  return (
    <div className="min-h-screen bg-[var(--ivory-100)] flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--sage-500)] mb-4">404</h1>
        <h2 className="text-xl text-[var(--text-primary)] mb-2">청첩장을 찾을 수 없습니다</h2>
        <p className="text-[var(--text-muted)] mb-8">
          삭제되었거나 아직 공개되지 않은 청첩장입니다.
        </p>
        <Link
          href="/"
          className="
            inline-block px-6 py-3 rounded-xl
            bg-[var(--sage-500)] text-white font-medium
            hover:bg-[var(--sage-600)] transition-colors
          "
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
