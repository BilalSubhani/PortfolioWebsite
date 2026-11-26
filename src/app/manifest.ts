import type { MetadataRoute } from 'next';
import { profile } from '@/content/profile';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.name,
    description: profile.intro,
    start_url: '/',
    display: 'standalone',
    background_color: '#171613',
    theme_color: '#171613',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  };
}
