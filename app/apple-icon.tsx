import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '24%',
        background:
          'radial-gradient(circle at 15% 15%, #99f6e4 0%, #0f766e 55%, #115e59 100%)',
        color: '#ffffff',
        fontSize: 58,
        fontWeight: 700,
        letterSpacing: 1,
      }}
    >
      SL
    </div>,
    {
      ...size,
    }
  )
}
