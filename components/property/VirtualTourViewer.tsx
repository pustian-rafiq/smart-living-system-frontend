'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    pannellum?: {
      viewer: (el: HTMLElement | string, config: Record<string, unknown>) => { destroy: () => void }
    }
  }
}

export function VirtualTourViewer({
  images,
  title,
}: {
  images: string[]
  title?: string
}) {
  const t = useTranslations('living.tour')
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<{ destroy: () => void } | null>(null)
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.pannellum) {
      setReady(true)
      return
    }
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'
    document.head.appendChild(css)
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js'
    script.async = true
    script.onload = () => setReady(true)
    script.onerror = () => setError(t('loadError'))
    document.body.appendChild(script)
  }, [t])

  useEffect(() => {
    if (!ready || !containerRef.current || !images[index] || !window.pannellum) return
    viewerRef.current?.destroy()
    try {
      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        type: 'equirectangular',
        panorama: images[index],
        autoLoad: true,
        showControls: true,
        compass: false,
      })
      setError(null)
    } catch {
      setError(t('loadError'))
    }
    return () => {
      viewerRef.current?.destroy()
      viewerRef.current = null
    }
  }, [ready, images, index, t])

  if (!images.length) return null

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title || t('title')}</h2>
        {images.length > 1 && (
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={index === 0}
              onClick={() => setIndex(i => Math.max(0, i - 1))}
            >
              {t('prev')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={index >= images.length - 1}
              onClick={() => setIndex(i => Math.min(images.length - 1, i + 1))}
            >
              {t('next')}
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div
          ref={containerRef}
          className="h-[320px] w-full overflow-hidden rounded-xl border bg-muted sm:h-[420px]"
        />
      )}
    </section>
  )
}
