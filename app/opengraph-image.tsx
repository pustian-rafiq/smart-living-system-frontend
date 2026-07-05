import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/seo/site'

export const runtime = 'edge'
export const alt = siteConfig.name
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 50%, #042f2e 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            opacity: 0.9,
            marginBottom: 16,
          }}
        >
          Bangladesh
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 900 }}>
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 24,
            opacity: 0.92,
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Find mess, hostels, hotels & apartments — verified listings, bills & payments.
        </div>
      </div>
    ),
    { ...size }
  )
}
