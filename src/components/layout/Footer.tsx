import Link from 'next/link';
import { quotes } from '@/content/misc';
import { navItems, profile, socials } from '@/content/profile';
import SocialIcon from '../ui/SocialIcon';
import QuoteRotator from './QuoteRotator';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x py-16 sm:py-20">
        <QuoteRotator quotes={quotes} />

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="font-display text-2xl font-semibold">
              {profile.name}
              <span className="text-accent">.</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted">{profile.tagline} Explore the work. Understand the thinking. Start a conversation.</p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-4">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-1">
              {navItems.map((n) => (
                <li key={n.id}>
                  <Link href={`/#${n.id}`} className="text-muted transition-colors hover:text-accent">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/projects" className="text-muted transition-colors hover:text-accent">
                  All projects
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-4">Connect</p>
            <ul className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    {...(s.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <SocialIcon name={s.key} className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {profile.name}. Built with Next.js & GSAP.
          </p>
          <a href="/llms.txt" className="text-muted transition-colors hover:text-accent">
            llms.txt
          </a>
        </div>
      </div>
    </footer>
  );
}
