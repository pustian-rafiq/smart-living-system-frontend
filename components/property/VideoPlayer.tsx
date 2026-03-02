'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface VideoPlayerProps {
  videoUrl: string
  thumbnail?: string
  propertyName: string
  autoplay?: boolean
}

export function VideoPlayer({
  videoUrl,
  thumbnail,
  propertyName,
  autoplay = false,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showThumbnail, setShowThumbnail] = useState(!!thumbnail && !autoplay)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.play().catch(() => {
        setIsPlaying(false)
      })
    } else {
      video.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = isMuted
  }, [isMuted])

  const handlePlayPause = () => {
    if (showThumbnail) {
      setShowThumbnail(false)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const handleFullscreen = () => {
    setIsFullscreen(true)
  }

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.preventDefault()
    handlePlayPause()
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
    if (thumbnail) {
      setShowThumbnail(true)
    }
  }

  const handleTimeUpdate = () => {
    // Video is playing
    if (videoRef.current && !videoRef.current.paused) {
      setIsPlaying(true)
      setShowThumbnail(false)
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative h-64 w-full overflow-hidden rounded-lg bg-black sm:h-80"
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-cover cursor-pointer"
          loop
          onEnded={handleVideoEnd}
          onClick={handleVideoClick}
          onTimeUpdate={handleTimeUpdate}
          playsInline
        />

        {/* Thumbnail Overlay */}
        {showThumbnail && thumbnail && (
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={handlePlayPause}
          >
            <Image
              src={thumbnail}
              alt={`${propertyName} video thumbnail`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="rounded-full bg-white/90 p-4 transition-transform hover:scale-110">
                <Play className="h-8 w-8 text-primary" fill="currentColor" />
              </div>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        {!showThumbnail && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors">
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" fill="currentColor" />
              ) : (
                <Play className="h-8 w-8" fill="currentColor" />
              )}
            </Button>
          </div>
        )}

        {/* Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleFullscreen}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Fullscreen Video Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
          <div className="relative h-[95vh] w-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-50 text-white hover:bg-white/20"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            <video
              src={videoUrl}
              className="h-full w-full object-contain"
              autoPlay={isPlaying}
              muted={isMuted}
              loop
              controls
              playsInline
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
