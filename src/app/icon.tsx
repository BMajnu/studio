import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export const contentType = 'image/png';

export default async function Icon({ params, searchParams }: { params: {}; searchParams: { [key: string]: string | string[] | undefined } }) {
  // Extract size from query params (e.g., /icon?size=64x64)
  const sizeParam = searchParams.size ? String(searchParams.size).split('x') : null;
  const width = sizeParam && sizeParam[0] ? parseInt(sizeParam[0], 10) : 32;
  const height = sizeParam && sizeParam[1] ? parseInt(sizeParam[1], 10) : width;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: Math.max(width / 12, 1),
          background: '#0A1022',
          borderRadius: '50%',
          border: `${Math.max(width / 16, 1)}px solid #0062E3`,
        }}
      >
        <svg
          width={Math.round(width * 0.9)}
          height={Math.round(height * 0.9)}
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="256" cy="256" r="240" fill="#0A1022" stroke="#0062E3" strokeWidth="16" />
          <path d="M94 256 L164 256 L164 360" stroke="#0062E3" strokeWidth="24" strokeLinecap="round" />
          <path d="M190 160 L240 160 L240 360" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" />
          <path d="M266 256 L336 160 Q390 230 336 360 L266 256 Z" fill="#0062E3" />
          <circle cx="360" cy="200" r="16" fill="#0062E3" />
          <path d="M360 256 L430 256 L430 360" stroke="#0062E3" strokeWidth="24" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      width,
      height,
    }
  );
} 