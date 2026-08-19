import { ImageResponse } from 'next/og'

export const size = {
  width: 512,
  height: 512,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '22%',
        background:
          'radial-gradient(circle at 15% 15%, #67e8f9 0%, #0f766e 50%, #0f172a 100%)',
        color: '#ffffff',
        fontSize: 140,
        fontWeight: 700,
        letterSpacing: 2,
      }}
    >
      SL
    </div>,
    {
      ...size,
    }
  )
}
