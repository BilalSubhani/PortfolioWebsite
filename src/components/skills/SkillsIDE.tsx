'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuFileJson, LuFolderOpen } from 'react-icons/lu';
import { projects } from '@/content/projects';
import { evidenceFor, type Skill, skillFiles, usageRefs, type UsageKey } from '@/content/skills';
import { cn } from '@/lib/cn';
import { unlock } from '@/lib/achievements';
import { useRole } from '@/lib/role';
import { switchRole } from '../layout/RolePicker';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

type Mode = 'dev' | 'plain';

const EVIDENCE_STYLE = {
  'Used in production': 'border-ok/40 text-ok bg-ok/10',
  'Open source': 'border-accent/40 text-accent bg-accent-soft',
  'Hands-on': 'border-line text-muted',
} as const;

const hrefFor = (k: UsageKey) => (projects.some((p) => p.slug === k) ? `/projects/${k}` : '/#experience');

export default function SkillsIDE() {
  const [fileIdx, setFileIdx] = useState(2); // backend.json first: what most visitors ask about
  const [skillIdx, setSkillIdx] = useState(0);
  // Same setting as the visitor's path: flipping it here switches the whole site (and persists).
  const role = useRole();
  const [mode, setMode] = useState<Mode>(role);
  useEffect(() => setMode(role), [role]);
  const root = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const tabsRef = useRef<HTMLUListElement>(null);
  const inspected = useRef(new Set<string>());
  const pick = (name: string, i: number) => {
    setSkillIdx(i);
    inspected.current.add(name);
    if (inspected.current.size >= 3) unlock('receipts');
  };

  const file = skillFiles[fileIdx];
  const skill: Skill = file.skills[Math.min(skillIdx, file.skills.length - 1)];
  const evidence = evidenceFor(skill);

  // Keep the active tab in view in the scrollable phone tab row (without scrolling the page).
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector<HTMLElement>(`[data-tab="${fileIdx}"]`);
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return;
    const left = tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2;
    gsap.to(row, { scrollLeft: Math.max(0, left), duration: prefersReducedMotion() ? 0 : 0.4, ease: 'power3.out' });
  }, [fileIdx]);

  // The Stack Map in About can open a category here.
  useEffect(() => {
    const on = (e: Event) => {
      setFileIdx((e as CustomEvent<number>).detail);
      setSkillIdx(0);
    };
    window.addEventListener('skills:open', on);
    return () => window.removeEventListener('skills:open', on);
  }, []);

  // Animate code lines whenever the open file changes.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo('[data-code-line]', { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.025, ease: 'power2.out' });
    },
    { scope: root, dependencies: [fileIdx, mode], revertOnUpdate: true },
  );

  // Cross-fade the details panel when the skill or mode changes.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo('[data-detail]', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' });
    },
    { scope: root, dependencies: [fileIdx, skillIdx, mode], revertOnUpdate: true },
  );

  // Slide the Dev/Plain toggle thumb.
  useGSAP(
    () => {
      gsap.to(thumb.current, { xPercent: mode === 'dev' ? 0 : 100, duration: prefersReducedMotion() ? 0 : 0.4, ease: 'power3.out' });
    },
    { dependencies: [mode] },
  );

  const openFile = (i: number) => {
    setFileIdx(i);
    setSkillIdx(0);
  };

  // JSON lines: { "category": …, "skills": [ { "name": …, "evidence": … }, … ] }
  const lines: React.ReactNode[] = [
    <>{'{'}</>,
    <>
      {'  '}
      <K>&quot;category&quot;</K>: <S>&quot;{file.title}&quot;</S>,
    </>,
    <>
      {'  '}
      <K>&quot;skills&quot;</K>: [
    </>,
    ...file.skills.map((s, i) => (
      <>
        {'    { '}
        <K>&quot;name&quot;</K>:{' '}
        <button
          type="button"
          onClick={() => pick(s.name, i)}
          aria-pressed={i === skillIdx}
          className={cn(
            'rounded px-0.5 text-left transition-colors',
            i === skillIdx ? 'bg-accent-soft text-accent ring-1 ring-accent/40' : 'text-[#b7c88f] hover:bg-accent-soft light:text-[#4f6b33]',
          )}
        >
          &quot;{s.name}&quot;
        </button>
        <span className="hidden sm:inline">
          , <K>&quot;evidence&quot;</K>: <S>&quot;{evidenceFor(s)}&quot;</S>
        </span>
        {' }'}
        {i < file.skills.length - 1 ? ',' : ''}
      </>
    )),
    <>{'  ]'}</>,
    <>{'}'}</>,
  ];

  return (
    <div ref={root} data-glow className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/20" data-reveal="scale">
      {/* Window chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-[#d98b7a]" />
            <span className="h-3 w-3 rounded-full bg-[#d6b46a]" />
            <span className="h-3 w-3 rounded-full bg-[#9cb380]" />
          </div>
          <p className="truncate font-mono text-xs text-muted">{mode === 'dev' ? `skills / ${file.file}` : `Skills — ${file.title}, in plain English`}</p>
        </div>
        <div role="radiogroup" aria-label="Description style" className="relative grid grid-cols-2 rounded-full border border-line p-1 text-xs">
          <span ref={thumb} aria-hidden="true" className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent" />
          {(['dev', 'plain'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => {
                setMode(m);
                switchRole(m);
              }}
              className={cn('relative z-10 rounded-full px-3 py-1.5 font-medium transition-colors', mode === m ? 'text-accent-fg' : 'text-muted hover:text-fg')}
            >
              {m === 'dev' ? 'Developer' : 'Plain English'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)_280px] xl:grid-cols-[220px_minmax(0,1fr)_300px]">
        {/* Explorer */}
        <nav aria-label="Skill categories" className="min-w-0 border-line max-lg:border-b lg:border-r">
          <p className="hidden items-center gap-2 px-4 pt-4 pb-2 font-mono text-[11px] tracking-[0.16em] text-muted uppercase lg:flex">
            <LuChevronDown className="h-3 w-3" /> <LuFolderOpen className="h-3.5 w-3.5 text-accent" /> skills
          </p>
          <ul
            ref={tabsRef}
            role="tablist"
            aria-orientation="horizontal"
            data-lenis-prevent
            className="flex snap-x gap-1 overflow-x-auto overscroll-x-contain p-2 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pl-6 [&::-webkit-scrollbar]:hidden"
          >
            {skillFiles.map((f, i) => (
              <li key={f.file} className="shrink-0 snap-start lg:min-w-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => openFile(i)}
                  role="tab"
                  aria-selected={i === fileIdx}
                  data-tab={i}
                  className={cn(
                    'flex w-full min-w-0 items-center gap-2 rounded-lg px-3 py-2 font-mono text-xs whitespace-nowrap transition-colors lg:whitespace-normal',
                    i === fileIdx ? 'bg-accent-soft text-accent' : 'text-muted hover:bg-surface-2 hover:text-fg',
                  )}
                >
                  <LuFileJson className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{mode === 'dev' ? f.file : f.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Code (developer) or readable list (plain English) */}
        {mode === 'dev' ? (
          <div className="min-w-0 overflow-x-hidden border-line py-4 font-mono text-[12px] leading-[1.9] sm:text-[13px] lg:border-r">
            <ol>
              {lines.map((l, i) => (
                <li key={`${fileIdx}-${i}`} data-code-line className="flex pr-4">
                  <span aria-hidden="true" className="w-10 shrink-0 pr-4 text-right text-muted/50 select-none sm:w-12">
                    {i + 1}
                  </span>
                  <span className="min-w-0 whitespace-pre-wrap text-muted [overflow-wrap:anywhere]">{l}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <ul className="min-w-0 divide-y divide-line border-line lg:border-r">
            {file.skills.map((sk, i) => (
              <li key={`${fileIdx}-${sk.name}`} data-code-line>
                <button
                  type="button"
                  onClick={() => pick(sk.name, i)}
                  aria-pressed={i === skillIdx}
                  className={cn(
                    'flex w-full items-start gap-3 px-5 py-3 text-left transition-colors',
                    i === skillIdx ? 'bg-accent-soft' : 'hover:bg-surface-2',
                  )}
                >
                  <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', i === skillIdx ? 'bg-accent' : 'bg-line')} />
                  <span className="min-w-0 flex-1">
                    <span className={cn('block text-sm font-semibold', i === skillIdx && 'text-accent')}>{sk.name}</span>
                    <span className="block text-sm leading-snug text-muted">{sk.plain}</span>
                  </span>
                  <span className={cn('hidden shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] sm:inline-flex', EVIDENCE_STYLE[evidenceFor(sk)])}>
                    {evidenceFor(sk)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Details */}
        <aside aria-live="polite" className="border-line p-5 max-lg:border-t sm:p-6">
          <p data-detail className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
            {file.title}
          </p>
          <h3 data-detail className="mt-2 text-2xl font-semibold">
            {skill.name}
          </h3>
          <span data-detail className={cn('mt-3 inline-flex rounded-full border px-2.5 py-1 font-mono text-[11px]', EVIDENCE_STYLE[evidence])}>
            {evidence}
          </span>
          <p data-detail className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            {mode === 'dev' ? skill.dev : skill.plain}
          </p>
          {skill.usedIn.length > 0 && (
            <div data-detail className="mt-6">
              <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{mode === 'dev' ? 'Used in' : 'Where I’ve used it'}</p>
              <ul className="mt-3 space-y-2">
                {skill.usedIn.map((k) => (
                  <li key={k}>
                    <Link href={hrefFor(k)} className="group flex items-baseline justify-between gap-3 rounded-lg border border-line px-3 py-2 text-sm transition-colors hover:border-accent">
                      <span className="text-fg group-hover:text-accent">{usageRefs[k].label}</span>
                      <span className="shrink-0 font-mono text-[11px] text-muted">{usageRefs[k].where}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

const K = ({ children }: { children: React.ReactNode }) => <span className="text-accent">{children}</span>;
const S = ({ children }: { children: React.ReactNode }) => <span className="text-fg/80">{children}</span>;
