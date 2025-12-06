'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { MessageCircle, Images, Calendar, Users, Heart } from 'lucide-react'

const GALLERY_IMAGES = [
  '/examples/images/example_wedding_image9.png',
  '/examples/images/example_wedding_image5.png',
  '/examples/images/example_wedding_image6.png',
  '/examples/images/example_wedding_image7.png',
]

const FEATURES = [
  {
    id: 'gallery',
    title: '포토 갤러리',
    desc: '아름다운 순간들을 담아',
    icon: Images,
    span: 'col-span-1',
    preview: 'gallery',
  },
  {
    id: 'messages',
    title: '축하 메시지',
    desc: '하객들의 진심 어린 축하',
    icon: MessageCircle,
    span: 'col-span-1',
    preview: 'messages',
  },
  {
    id: 'calendar',
    title: '캘린더',
    desc: 'D-day 카운트다운',
    icon: Calendar,
    span: 'col-span-1',
    preview: 'calendar',
  },
  {
    id: 'rsvp',
    title: '참석 여부',
    desc: '간편한 참석 확인',
    icon: Users,
    span: 'col-span-1',
    preview: 'rsvp',
  },
]

// Mini message bubble component
function MessageBubble({ delay, children }: { delay: number; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`px-3 py-1.5 bg-[#C9A962]/20 rounded-xl text-xs text-[#F5E6D3] transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
      }`}
    >
      {children}
    </div>
  )
}

export function S3FeaturesBento() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="min-h-[70vh] bg-[#0A0806] py-20 px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[#C9A962] text-sm tracking-widest uppercase mb-2">
            Features
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-[#F5E6D3] mb-4">
            청첩장에 담을 수 있는 것들
          </h2>
          <p className="text-[#F5E6D3]/60 text-sm max-w-md mx-auto">
            기능이 부족해서 불편할 일은 없습니다
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                className={`${feature.span} rounded-2xl bg-white/5 backdrop-blur border border-white/5 p-6
                  transition-all duration-500 hover:bg-white/10 hover:border-[#C9A962]/30
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  transitionDelay: isVisible ? `${i * 100}ms` : '0ms',
                }}
              >
                <Icon className="w-6 h-6 text-[#C9A962] mb-3" />
                <h3 className="text-lg text-[#F5E6D3] font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-[#F5E6D3]/50">{feature.desc}</p>

                {/* Feature-specific preview */}
                {feature.preview === 'messages' && isVisible && (
                  <div className="mt-4 space-y-2">
                    <MessageBubble delay={300}>축하해요! 행복하세요 💕</MessageBubble>
                    <MessageBubble delay={600}>결혼 축하합니다!</MessageBubble>
                    <MessageBubble delay={900}>두 분 너무 예뻐요 🎉</MessageBubble>
                  </div>
                )}

                {feature.preview === 'gallery' && (
                  <div className="mt-4 grid grid-cols-2 gap-1.5">
                    {GALLERY_IMAGES.map((src, idx) => (
                      <div
                        key={src}
                        className="relative aspect-square rounded-md overflow-hidden"
                      >
                        <Image
                          src={src}
                          alt={`Wedding photo ${idx + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                          sizes="80px"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {feature.preview === 'calendar' && (
                  <div className="mt-4 text-center">
                    <div className="text-3xl font-bold text-[#C9A962]">D-128</div>
                    <div className="text-xs text-[#F5E6D3]/50 mt-1">2025.05.24</div>
                  </div>
                )}

                {feature.preview === 'rsvp' && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className="w-6 h-6 rounded-full bg-[#C9A962]/30 border-2 border-[#0A0806] flex items-center justify-center"
                        >
                          <Heart className="w-3 h-3 text-[#C9A962]" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-[#F5E6D3]/50">+42명 참석</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
