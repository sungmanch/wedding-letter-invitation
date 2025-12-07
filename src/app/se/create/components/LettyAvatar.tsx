'use client'

/**
 * LettyAvatar - Letty 프로필 아바타
 * Letty 캐릭터 이미지 사용
 */

import Image from 'next/image'

interface LettyAvatarProps {
  size?: 'sm' | 'md' | 'lg'
}

export function LettyAvatar({ size = 'md' }: LettyAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 48,
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0`}>
      <Image
        src="/examples/images/letty.png"
        alt="Letty"
        width={pixelSizes[size]}
        height={pixelSizes[size]}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
