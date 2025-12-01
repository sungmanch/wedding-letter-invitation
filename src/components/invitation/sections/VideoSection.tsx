'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import type { ColorPalette, FontSet } from '@/lib/themes/schema'
import type { VideoSettings } from '@/lib/types/invitation-design'

interface VideoSectionProps {
  settings: VideoSettings
  colors: ColorPalette
  fonts: FontSet
  className?: string
}

export function VideoSection({
  settings,
  colors,
  fonts,
  className,
}: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = React.useState(settings.autoPlay)
  const [isMuted, setIsMuted] = React.useState(settings.muted)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const getAspectRatioClass = () => {
    switch (settings.aspectRatio) {
      case '4:3': return 'aspect-[4/3]'
      case '1:1': return 'aspect-square'
      case '9:16': return 'aspect-[9/16]'
      case '16:9':
      default: return 'aspect-video'
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // YouTube embed URL 변환
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/)
    if (videoIdMatch) {
      const videoId = videoIdMatch[1]
      const params = new URLSearchParams({
        autoplay: settings.autoPlay ? '1' : '0',
        mute: settings.muted ? '1' : '0',
        loop: settings.loop ? '1' : '0',
        controls: settings.showControls ? '1' : '0',
        playlist: settings.loop ? videoId : '',
      })
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
    }
    return url
  }

  // Vimeo embed URL 변환
  const getVimeoEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/vimeo\.com\/(\d+)/)
    if (videoIdMatch) {
      const videoId = videoIdMatch[1]
      const params = new URLSearchParams({
        autoplay: settings.autoPlay ? '1' : '0',
        muted: settings.muted ? '1' : '0',
        loop: settings.loop ? '1' : '0',
        controls: settings.showControls ? '1' : '0',
      })
      return `https://player.vimeo.com/video/${videoId}?${params.toString()}`
    }
    return url
  }

  const renderVideo = () => {
    const url = settings.url

    if (!url) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          <Play className="h-12 w-12" />
        </div>
      )
    }

    // YouTube
    if (settings.source === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      return (
        <iframe
          ref={iframeRef}
          src={getYouTubeEmbedUrl(url)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }

    // Vimeo
    if (settings.source === 'vimeo' || url.includes('vimeo.com')) {
      return (
        <iframe
          ref={iframeRef}
          src={getVimeoEmbedUrl(url)}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )
    }

    // Direct video file
    return (
      <div className="relative w-full h-full group">
        <video
          ref={videoRef}
          src={url}
          className="w-full h-full object-cover"
          autoPlay={settings.autoPlay}
          muted={settings.muted}
          loop={settings.loop}
          controls={settings.showControls}
          playsInline
        />
        {!settings.showControls && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <section
      className={cn('py-8 px-6', className)}
      style={{ backgroundColor: colors.background }}
    >
      {settings.title && (
        <h2
          className="text-lg font-medium mb-6 text-center"
          style={{ fontFamily: fonts.title.family, color: colors.text }}
        >
          {settings.title}
        </h2>
      )}
      <div className={cn('w-full overflow-hidden rounded-2xl', getAspectRatioClass())}>
        {renderVideo()}
      </div>
      {settings.caption && (
        <p
          className="text-sm text-center mt-4"
          style={{ color: colors.textMuted || colors.text }}
        >
          {settings.caption}
        </p>
      )}
    </section>
  )
}
