import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">청첩장을 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-6">
          요청하신 청첩장이 존재하지 않거나 아직 공개되지 않았습니다.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
