import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'DesAInR - AI Designer Assistant';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

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
          background: 'linear-gradient(to bottom right, #101929, #0A1022)',
          color: 'white',
          fontSize: 48,
          fontWeight: 'bold',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 300,
            height: 300,
            marginBottom: 40,
            borderRadius: '50%',
            background: '#101929',
            border: '8px solid #0062E3',
            boxShadow: '0 0 40px rgba(0, 98, 227, 0.6)',
          }}
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="256" cy="256" r="240" fill="#101929" stroke="#0062E3" strokeWidth="16" />
            <path d="M94 256 L164 256 L164 360" stroke="#0062E3" strokeWidth="24" strokeLinecap="round" />
            <path d="M190 160 L240 160 L240 360" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" />
            <path d="M266 256 L336 160 Q390 230 336 360 L266 256 Z" fill="#0062E3" />
            <circle cx="360" cy="200" r="16" fill="#0062E3" />
            <path d="M360 256 L430 256 L430 360" stroke="#0062E3" strokeWidth="24" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#0062E3' }}>DES</span>
          <span style={{ color: 'white' }}>A</span>
          <span style={{ color: '#0062E3' }}>INR</span>
        </div>
        <div style={{ fontSize: 28, marginTop: 16, opacity: 0.8 }}>
          AI-powered assistant for graphics designers
        </div>
      </div>
    ),
    { ...size }
  );
} 