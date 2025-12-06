import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0A0806]">
      {/* Dark Theme Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0A0806]/80 backdrop-blur">
        <div className="flex h-14 items-center px-4">
          <Link
            href="/"
            className="flex items-center text-[#F5E6D3]/60 hover:text-[#F5E6D3] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 flex justify-center">
            <Image
              src="/logo.png"
              alt="Maison de Letter"
              width={120}
              height={28}
              className="h-7 w-auto brightness-0 invert opacity-90"
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
