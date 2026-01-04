import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Maison de Letter - 당신만의 이야기를 담은 청첩장'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFB6C1',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://maisondeletter.com/logo.png"
          alt="Maison de Letter"
          width={400}
          height={160}
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
