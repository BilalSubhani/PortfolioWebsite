'use client';

import { useEffect, useRef, useState } from 'react';
import { LuCode, LuDatabase, LuMic, LuMonitor, LuServer, LuWrench } from 'react-icons/lu';
import { skillFiles } from '@/content/skills';
import { cn } from '@/lib/cn';
import { gsap, isFinePointer, prefersReducedMotion, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { scrollToId } from '@/lib/scroll';
import Lens from '../ui/Lens';

const META: Record<string, { icon: typeof LuCode; dev: string; plain: string }> = {
  'languages.json': { icon: LuCode, dev: 'Go for throughput, Python for AI, TypeScript everywhere else.', plain: 'The languages I write software in.' },
  'frontend.json': { icon: LuMonitor, dev: 'App Router apps, server state, accessible UI.', plain: 'The parts of an app you see and click.' },
  'backend.json': { icon: LuServer, dev: 'APIs, workers, microservices and MCP.', plain: 'The engine room behind every app.' },
  'data.json': { icon: LuDatabase, dev: 'Postgres, Redis/Valkey and RabbitMQ under load.', plain: 'Where data lives, and how work waits its turn.' },
  'voice-ai.json': { icon: LuMic, dev: 'SIP telephony, self-hosted TTS, RAG and LLMs.', plain: 'AI that talks on the phone and answers questions.' },
  'devops.json': { icon: LuWrench, dev: 'Containers, tests and observability.', plain: 'Keeping it tested, shipped and healthy.' },
};

// Left column, then right column (hub sits in the middle on desktop).
const LEFT = [0, 1, 2];
const RIGHT = [3, 4, 5];

export default function StackMap() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(2);
  const [paths, setPaths] = useState<string[]>([]);
  const userHover = useRef(false);

  // Beam geometry: a soft curve from the hub's side to each tile's inner edge.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      if (!hub.current || !el.isConnected) return; // can fire once more while unmounting
      const box = el.getBoundingClientRect();
      const h = hub.current.getBoundingClientRect();
      const hx = h.left - box.left;
      const hw = h.width;
      const hy = h.top - box.top + h.height / 2;
      setPaths(
        tiles.current.map((t, i) => {
          if (!t) return '';
          const r = t.getBoundingClientRect();
          const ty = r.top - box.top + r.height / 2;
          const right = RIGHT.includes(i);
          const sx = right ? hx + hw : hx;
          const ex = right ? r.left - box.left : r.right - box.left;
          const mx = (sx + ex) / 2;
          return `M ${sx} ${hy} C ${mx} ${hy}, ${mx} ${ty}, ${ex} ${ty}`;
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Light pulses travel along every beam; the active beam is brighter and faster.
  useGSAP(
    () => {
      if (!paths.length || prefersReducedMotion()) return;
      gsap.utils.toArray<SVGPathElement>('[data-pulse]', svg.current).forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: `60 ${len}`, strokeDashoffset: 60 });
        gsap.to(p, { strokeDashoffset: -len, duration: 2.4, ease: 'none', repeat: -1, delay: i * 0.35 });
      });
      gsap.to('[data-hub-ring]', { scale: 1.6, autoAlpha: 0, duration: 2, repeat: -1, ease: 'power2.out', stagger: 1 });
    },
    { scope: root, dependencies: [paths.length], revertOnUpdate: true },
  );

  // Active tile: highlight + its tools fan out with a stagger.
  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      gsap.to('[data-beam]', { strokeOpacity: (i) => (i === active ? 0.9 : 0.18), duration: reduce ? 0 : 0.4 });
      const chips = root.current?.querySelectorAll(`[data-tile="${active}"] [data-chip]`);
      if (chips?.length && !reduce) gsap.fromTo(chips, { autoAlpha: 0, y: 8, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.03, duration: 0.35, ease: 'back.out(2)' });
    },
    { scope: root, dependencies: [active] },
  );

  // When nobody's interacting, step the highlight through the categories (no rotation).
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      let timer: ReturnType<typeof setInterval> | undefined;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          clearInterval(timer);
          if (self.isActive) timer = setInterval(() => !userHover.current && setActive((a) => (a + 1) % skillFiles.length), 2800);
        },
      });
      return () => {
        clearInterval(timer);
        st.kill();
      };
    },
    { scope: root },
  );

  const open = (i: number) => {
    window.dispatchEvent(new CustomEvent('skills:open', { detail: i }));
    scrollToId('skills');
  };

  const tile = (i: number) => {
    const f = skillFiles[i];
    const m = META[f.file];
    const Icon = m.icon;
    const on = active === i;
    return (
      <button
        key={f.file}
        ref={(el) => void (tiles.current[i] = el)}
        type="button"
        data-tile={i}
        data-glow
        onPointerEnter={() => {
          if (!isFinePointer()) return;
          userHover.current = true;
          setActive(i);
        }}
        onPointerLeave={() => (userHover.current = false)}
        onFocus={() => setActive(i)}
        onClick={() => open(i)}
        className={cn('card relative flex flex-col p-4 text-left transition-colors sm:p-5', on ? 'border-accent/60 bg-surface-2' : 'hover:border-accent/40')}
        aria-label={`${f.title}: ${f.skills.map((s) => s.name).join(', ')}. Open in the skills explorer.`}
      >
        <span className="flex items-center gap-3">
          <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors', on ? 'bg-accent text-accent-fg' : 'bg-accent-soft text-accent')}>
            <Icon className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-base font-semibold">{f.title}</span>
            <span className="block font-mono text-[11px] text-muted">{f.skills.length} tools</span>
          </span>
        </span>
        <span className="mt-3 block text-sm leading-snug text-muted">
          <Lens dev={m.dev} plain={m.plain} />
        </span>
        <span className="lens-dev mt-3 flex flex-wrap gap-1.5" aria-hidden="true">
          {f.skills.map((s, k) => (
            <span key={s.name} data-chip className={cn('chip transition-colors', on && 'border-accent/40 text-fg', k >= 4 && 'max-md:hidden')}>
              {s.name}
            </span>
          ))}
          {f.skills.length > 4 && <span className="chip md:hidden">+{f.skills.length - 4}</span>}
        </span>
      </button>
    );
  };

  return (
    <div ref={root} className="relative">
      <svg ref={svg} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block">
        <defs>
          <linearGradient id="beam-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <g key={i}>
            <path data-beam d={d} fill="none" stroke="var(--accent)" strokeWidth={1.25} strokeOpacity={0.18} />
            <path data-pulse d={d} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" opacity={active === i ? 1 : 0.35} />
          </g>
        ))}
      </svg>

      <div className="relative grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)] md:gap-x-16 md:gap-y-4 lg:gap-x-24">
        <div className="max-md:contents md:grid md:gap-4">{LEFT.map(tile)}</div>
        <div className="flex items-center justify-center py-6 max-md:order-first max-md:col-span-2 md:py-0">
          <div ref={hub} className="relative grid aspect-square w-32 place-items-center sm:w-40">
            <span data-hub-ring className="absolute inset-0 rounded-full border border-accent/50" />
            <span data-hub-ring className="absolute inset-0 rounded-full border border-accent/50" />
            <span className="relative grid h-full w-full place-items-center rounded-full border border-line bg-surface text-center shadow-2xl shadow-black/30">
              <span>
                <span className="block font-display text-3xl font-semibold sm:text-4xl">
                  BS<span className="text-accent">.</span>
                </span>
                <span className="mt-1 block font-mono text-[10px] tracking-[0.16em] text-muted uppercase">full-stack</span>
              </span>
            </span>
          </div>
        </div>
        <div className="max-md:contents md:grid md:gap-4">{RIGHT.map(tile)}</div>
      </div>
    </div>
  );
}
