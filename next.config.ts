import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

// Pages are statically generated, so a nonce-based CSP (which forces dynamic rendering)
// is not used. 'unsafe-inline' is required for Next's inline bootstrap + the theme script.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws:' : ''}`,
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    const [cspHeader, ...rest] = securityHeaders;
    return [
      // Everything except PDFs gets the full set, including CSP.
      { source: '/((?!.*\\.pdf$).*)', headers: [cspHeader] },
      { source: '/:path*', headers: rest },
      // The resume opens in the browser's PDF viewer, which a strict CSP can break.
      {
        source: '/:file*.pdf',
        headers: [
          { key: 'Content-Disposition', value: 'inline; filename="Bilal-Subhani-Resume.pdf"' },
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
    ];
  },
};

export default nextConfig;
