'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LuCodeXml, LuMenu, LuMoon, LuScroll, LuSun, LuTerminal, LuX } from 'react-icons/lu';
import { navItems, profile } from '@/content/profile';
import { cn } from '@/lib/cn';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { openRolePicker, ROLES, useRole } from '@/lib/role';
import { scrollToId } from '@/lib/scroll';
import { setTheme, useTheme } from '@/lib/theme';
import { useTerminal } from '../terminal/TerminalContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { setOpen } = useTerminal();
  const role = useRole();
  const theme = useTheme();
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef(false);
  menuOpenRef.current = menuOpen;

  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  // Scroll progress, hide-on-scroll-down, and active-section tracking.
  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      gsap.to(progress.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: reduce ? true : 0.3 },
      });

      // One reusable tween: hide on scroll down, show on scroll up. Only touched when the
      // direction actually flips, never on every scroll event.
      const hide = gsap.to(header.current, { yPercent: -110, duration: reduce ? 0 : 0.4, ease: 'power3.out', paused: true });
      let hidden = false;
      const setHidden = (h: boolean) => {
        if (h === hidden) return;
        hidden = h;
        if (h) hide.play();
        else hide.reverse();
      };
      ScrollTrigger.create({
        start: 120,
        end: 'max',
        onUpdate: (self) => !menuOpenRef.current && setHidden(self.direction === 1),
        onLeaveBack: () => setHidden(false),
      });
      // Reaching for the top of the window brings the nav back.
      const reveal = (e: PointerEvent) => e.clientY < 90 && setHidden(false);
      window.addEventListener('pointermove', reveal, { passive: true });

      if (isHome) {
        // Active section from layout positions (offsetTop ignores the merge transforms,
        // which would otherwise stretch a section's range while it's being covered).
        const sections = navItems
          .map(({ id }) => document.getElementById(id))
          .filter((el): el is HTMLElement => !!el);
        const pageTop = (el: HTMLElement) => {
          let y = 0;
          for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
          return y;
        };
        let last: string | null = 'init';
        const update = () => {
          const line = window.scrollY + window.innerHeight * 0.45;
          let current: string | null = null;
          for (const s of sections) if (pageTop(s) <= line) current = s.id;
          if (current !== last) {
            last = current;
            setActive(current);
          }
        };
        ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: update });
        update();
      }
      return () => window.removeEventListener('pointermove', reveal);
    },
    { dependencies: [isHome] },
  );

  // Slide the indicator pill under the active link. Measured against the whole row: each
  // link sits in its own positioned <li>, so link.offsetLeft would be 0 for every link.
  const activeRef = useRef<string | null>(null);
  const alignPill = (duration: number) => {
    const p = pill.current;
    const row = linksRef.current;
    const id = activeRef.current;
    const link = id ? row?.querySelector<HTMLElement>(`[data-id="${id}"]`) : null;
    if (!p || !row) return;
    if (!link) return void gsap.to(p, { autoAlpha: 0, duration: 0.25, overwrite: true });
    const r = link.getBoundingClientRect();
    const base = row.getBoundingClientRect();
    gsap.to(p, { x: r.left - base.left, width: r.width, autoAlpha: 1, duration, ease: 'power3.out', overwrite: true });
  };
  // Re-align if the layout shifts (window resize, web fonts finishing loading).
  useEffect(() => {
    const realign = () => alignPill(0);
    window.addEventListener('resize', realign);
    document.fonts?.ready.then(realign);
    return () => window.removeEventListener('resize', realign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useGSAP(
    () => {
      activeRef.current = active;
      alignPill(prefersReducedMotion() ? 0 : 0.5);
    },
    { dependencies: [active] },
  );

  // Mobile menu open/close timeline.
  useGSAP(
    () => {
      const m = menu.current;
      if (!m) return;
      const items = m.querySelectorAll('[data-menu-item]');
      if (menuOpen) {
        document.documentElement.style.overflow = 'hidden';
        gsap.set(m, { display: 'flex' });
        gsap.fromTo(m, { clipPath: 'circle(0% at calc(100% - 2.5rem) 2rem)' }, { clipPath: 'circle(150% at calc(100% - 2.5rem) 2rem)', duration: 0.7, ease: 'power3.inOut' });
        gsap.fromTo(items, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, delay: 0.25, duration: 0.6 });
      } else if (m.style.display === 'flex') {
        document.documentElement.style.overflow = '';
        gsap.to(m, {
          clipPath: 'circle(0% at calc(100% - 2.5rem) 2rem)',
          duration: 0.5,
          ease: 'power3.inOut',
          onComplete: () => void gsap.set(m, { display: 'none' }),
        });
      }
    },
    { dependencies: [menuOpen] },
  );

  const go = (e: React.MouseEvent, id: string) => {
    setMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      scrollToId(id);
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <>
      <a href="#main" className="sr-only z-[80] rounded-md bg-accent px-4 py-2 text-accent-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <header ref={header} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <div
          ref={progress}
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-accent"
        />
        <nav
          aria-label="Main"
          className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-3 rounded-full border border-line bg-bg/95 pr-2 pl-5 shadow-lg shadow-black/10 3xl:max-w-[1400px]"
        >
          <Link href="/" className="font-display text-base font-semibold tracking-tight" aria-label={`${profile.name}, home`}>
            {profile.name}
            <span className="text-accent">.</span>
          </Link>

          <ul ref={linksRef} className="relative hidden items-center lg:flex">
            <span ref={pill} aria-hidden="true" className="absolute top-0 left-0 h-full rounded-full bg-accent-soft opacity-0" />
            {navItems.map((item) => (
              <li key={item.id} className="relative">
                <Link
                  href={`/#${item.id}`}
                  data-id={item.id}
                  onClick={(e) => go(e, item.id)}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={cn(
                    'block rounded-full px-4 py-2 text-sm transition-colors',
                    active === item.id ? 'text-accent' : 'text-muted hover:text-fg',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openRolePicker}
              className="flex h-10 items-center gap-2 rounded-full border border-line px-3 text-xs text-muted transition-colors hover:border-accent hover:text-accent max-sm:hidden"
              aria-label={`Viewing as ${ROLES[role].name}. Change path`}
              title={ROLES[role].name}
            >
              {role === 'dev' ? <LuCodeXml className="h-4 w-4" /> : <LuScroll className="h-4 w-4" />}
              <span className="hidden xl:inline">{ROLES[role].short}</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full border border-line px-3 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
              aria-label="Open terminal"
            >
              <LuTerminal className="h-4 w-4" />
              <kbd className="hidden font-mono sm:inline">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <ThemeToggle className="max-sm:hidden" />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="relative z-[60] grid h-10 w-10 place-items-center rounded-full border border-line lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <LuX className="h-4 w-4" /> : <LuMenu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-surface px-6 pt-28 pb-10 lg:hidden"
        aria-hidden={!menuOpen}
        {...(!menuOpen && { inert: true })}
      >
        <ul className="space-y-2">
          {navItems.map((item, i) => (
            <li key={item.id} data-menu-item>
              <Link
                href={`/#${item.id}`}
                onClick={(e) => go(e, item.id)}
                className="flex items-baseline gap-4 py-2 font-display text-[clamp(2rem,9vw,3.25rem)] leading-tight font-semibold"
              >
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="space-y-6">
          <div data-menu-item className="grid grid-cols-2 gap-3 sm:hidden">
            <button
              type="button"
              onClick={() => setTheme('toggle')}
              className="flex items-center gap-3 rounded-2xl border border-line bg-bg px-4 py-3 text-left"
            >
              {theme === 'dark' ? <LuSun className="h-5 w-5 shrink-0 text-accent" /> : <LuMoon className="h-5 w-5 shrink-0 text-accent" />}
              <span className="min-w-0">
                <span className="block text-xs text-muted">Theme</span>
                <span className="block truncate text-sm font-medium">{theme === 'dark' ? 'Switch to light' : 'Switch to dark'}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setTimeout(openRolePicker, 400);
              }}
              className="flex items-center gap-3 rounded-2xl border border-line bg-bg px-4 py-3 text-left"
            >
              {role === 'dev' ? <LuCodeXml className="h-5 w-5 shrink-0 text-accent" /> : <LuScroll className="h-5 w-5 shrink-0 text-accent" />}
              <span className="min-w-0">
                <span className="block text-xs text-muted">Path</span>
                <span className="block truncate text-sm font-medium">{ROLES[role].short}</span>
              </span>
            </button>
          </div>
        <div data-menu-item className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <span>{profile.availability}</span>
          <a href={`mailto:${profile.email}`} className="text-accent">
            {profile.email}
          </a>
        </div>
        </div>
      </div>
    </>
  );
}
