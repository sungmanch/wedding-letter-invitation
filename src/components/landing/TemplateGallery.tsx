'use client'

import Image from 'next/image'

const TEMPLATES = [
  { id: 'unique1', src: '/examples/unique1.png', label: 'Classic Elegance' },
  { id: 'unique2', src: '/examples/unique2.png', label: 'Romantic Script' },
  { id: 'unique3', src: '/examples/unique3.png', label: 'Minimal Modern' },
  { id: 'unique4', src: '/examples/unique4.png', label: 'Dark Mood' },
  { id: 'unique5', src: '/examples/unique5.png', label: 'Pop Art' },
  { id: 'unique6', src: '/examples/unique6.png', label: 'Bold Typography' },
]

export function TemplateGallery() {
  return (
    <section className="py-16 sm:py-24 bg-[var(--ivory-100)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'Noto Serif KR, serif' }}
          >
            AI가 제안하는 <span className="text-[var(--sage-600)] italic">무한한 스타일</span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto">
            클래식한 디자인부터 트렌디한 감성까지,<br className="sm:hidden"/> 
            당신의 취향을 완벽하게 저격하는 디자인을 만나보세요
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {TEMPLATES.map((template, index) => (
            <div 
              key={template.id}
              className="group relative w-full mx-auto max-w-[320px] sm:max-w-none perspective-1000"
            >
              <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden shadow-lg transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:-translate-y-2">
                <Image
                  src={template.src}
                  alt={template.label}
                  fill
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Label on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-medium text-[var(--text-primary)] shadow-sm">
                    {template.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA or Badge */}
        <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--sage-100)] text-[var(--sage-700)] text-sm font-medium">
                ✨ 매주 새로운 스타일이 추가됩니다
            </div>
        </div>
      </div>
    </section>
  )
}
