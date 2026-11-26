import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

// Shared Open Graph card in the site's warm matte style.
export function ogCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'radial-gradient(circle at 85% 15%, rgba(193,139,96,0.28), transparent 55%), #171613',
          color: '#E8E0D2',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: '#C18B60', textTransform: 'uppercase' }}>{eyebrow}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: title.length > 28 ? 72 : 92, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>{title}</div>
          <div style={{ marginTop: 28, fontSize: 32, color: '#A89B88', lineHeight: 1.3, maxWidth: 980 }}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#A89B88' }}>
          <span>Bilal Subhani</span>
          <span style={{ color: '#C18B60' }}>bilalsubhani.com</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
