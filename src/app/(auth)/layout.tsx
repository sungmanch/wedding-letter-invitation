import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--ivory-50)]">
      {/* Light Theme Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--sand-200)] bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 flex justify-center">
            <Image
              src="/logo.png"
              alt="Maison de Letter"
              width={120}
              height={28}
              className="h-7 w-auto"
            />
          </div>
          <div className="w-5" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-8">
        <div className="mx-auto max-w-sm">
          {children}
        </div>
      </main>
    </div>
  )
}
