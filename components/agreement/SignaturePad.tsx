'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignaturePad({
  onSave,
  saving,
  roleLabel,
}: {
  onSave: (dataUrl: string, signedName: string) => Promise<void>
  saving?: boolean
  roleLabel: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
  }, [])

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const submit = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!name.trim()) {
      setError('Enter your full name')
      return
    }
    const data = canvas.toDataURL('image/png')
    // blank check: mostly white
    if (data.length < 2000) {
      setError('Please draw your signature')
      return
    }
    setError(null)
    await onSave(data, name.trim())
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <p className="text-sm font-semibold">Sign as {roleLabel}</p>
      <div>
        <Label htmlFor="sign-name">Full name</Label>
        <Input
          id="sign-name"
          className="mt-1.5"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={180}
        className="w-full touch-none rounded-md border bg-white"
        onPointerDown={e => {
          drawing.current = true
          const ctx = canvasRef.current?.getContext('2d')
          if (!ctx) return
          const p = pos(e)
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
        }}
        onPointerMove={e => {
          if (!drawing.current) return
          const ctx = canvasRef.current?.getContext('2d')
          if (!ctx) return
          const p = pos(e)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        }}
        onPointerUp={() => {
          drawing.current = false
        }}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={clear}>
          Clear
        </Button>
        <Button type="button" onClick={submit} disabled={saving}>
          {saving ? 'Saving…' : 'Save signature'}
        </Button>
      </div>
    </div>
  )
}
