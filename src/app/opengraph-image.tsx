import { profile } from '@/content/profile';
import { OG_SIZE, ogCard } from '@/lib/og';

export const dynamic = 'force-static';
export const alt = `${profile.name} — ${profile.role}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({
    eyebrow: 'Full-Stack Software Engineer · Team Lead',
    title: profile.tagline,
    subtitle: 'High-load backends, AI voice agents and web apps. Lahore, Pakistan · open to remote.',
  });
}
