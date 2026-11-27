'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LuRotateCcw, LuZap } from 'react-icons/lu';
import { unlock } from '@/lib/achievements';
import { cn } from '@/lib/cn';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import Lens from '../ui/Lens';
import Magnetic from '../ui/Magnetic';

type Mode = 'direct' | 'queue';
type State = 'toServer' | 'toQueue' | 'queued' | 'dispatch' | 'processing' | 'done' | 'dropped';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: State;
  t: number; // time in current state
  slot: number;
  a: number; // alpha
}

const CAP = 6; // concurrent requests the server can hold
const PROC = 0.55; // seconds per request → ~11 req/s throughput
const BURST = 140;
const MAX_DOTS = 1200;

const rgb = (hex: string) => {
  const h = hex.trim().replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',');
};

export default function LoadLab() {
  const [mode, setMode] = useState<Mode>('direct');
  const [rate, setRate] = useState(4);
  const [repair, setRepair] = useState(false);
  const [stats, setStats] = useState({ sent: 0, served: 0, dropped: 0, queued: 0, overloaded: false });

  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const sim = useRef({
    dots: [] as Dot[],
    queue: [] as Dot[],
    processing: 0,
    inflight: 0,
    spawnAcc: 0,
    burstLeft: 0,
    burstDroppedAt: -1,
    sent: 0,
    served: 0,
    dropped: 0,
    droppedDirect: 0,
    mode: 'direct' as Mode,
    rate: 4,
    fx: { flash: 0, shake: 0, queueAlpha: 0 },
  });

  useEffect(() => {
    sim.current.rate = rate;
  }, [rate]);

  // Mode switch: slide the toggle thumb and fade the queue in/out (GSAP on the sim state).
  useGSAP(
    () => {
      const s = sim.current;
      s.mode = mode;
      const d = prefersReducedMotion() ? 0 : 0.5;
      gsap.to(thumb.current, { xPercent: mode === 'direct' ? 0 : 100, duration: d, ease: 'power3.out' });
      gsap.to(s.fx, { queueAlpha: mode === 'queue' ? 1 : 0, duration: d * 1.4, ease: 'power2.inOut' });
      gsap.fromTo('[data-lab-queue-label]', { autoAlpha: mode === 'queue' ? 0 : 1 }, { autoAlpha: mode === 'queue' ? 1 : 0, duration: d });
      // Anything waiting in the queue goes straight at the server when the queue is removed.
      if (mode === 'direct') {
        s.queue.forEach((q) => (q.s = 'toServer'));
        s.queue = [];
      }
    },
    { scope: root, dependencies: [mode] },
  );

  const burst = () => {
    const s = sim.current;
    s.burstLeft += BURST;
    s.burstDroppedAt = s.dropped;
    window.dispatchEvent(new Event('lab:burst'));
    if (!prefersReducedMotion()) gsap.fromTo('[data-burst-btn]', { scale: 0.92 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' });
  };

  const reset = useCallback(() => {
    const s = sim.current;
    s.dots = [];
    s.queue = [];
    s.processing = s.inflight = s.spawnAcc = s.burstLeft = 0;
    s.sent = s.served = s.dropped = s.droppedDirect = 0;
    s.burstDroppedAt = -1;
    setStats({ sent: 0, served: 0, dropped: 0, queued: 0, overloaded: false });
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const s = sim.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let colors = { fg: '232,224,210', muted: '168,155,136', accent: '193,139,96', ok: '156,179,128', err: '217,139,122', line: '232,224,210' };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = {
        fg: rgb(cs.getPropertyValue('--fg')),
        muted: rgb(cs.getPropertyValue('--muted')),
        accent: rgb(cs.getPropertyValue('--accent')),
        ok: rgb(cs.getPropertyValue('--ok')),
        err: rgb(cs.getPropertyValue('--err')),
        line: rgb(cs.getPropertyValue('--fg')),
      };
    };
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    readColors();
    resize();

    const geo = () => {
      const r = Math.max(2.5, Math.min(4, w / 180));
      return {
        r,
        src: { x: w * 0.06 },
        q: { x0: w * 0.34, x1: w * 0.6, y0: h * 0.16, y1: h * 0.84 },
        srv: { x0: w * 0.76, x1: w * 0.94, y0: h * 0.28, y1: h * 0.72 },
        gap: r * 2.6,
      };
    };

    const roundRect = (x: number, y: number, ww: number, hh: number, rr: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, ww, hh, rr);
    };

    const toward = (d: Dot, tx: number, ty: number, speed: number, dt: number) => {
      const dx = tx - d.x;
      const dy = ty - d.y;
      const dist = Math.hypot(dx, dy);
      if (dist < speed * dt) {
        d.x = tx;
        d.y = ty;
        return true;
      }
      d.x += (dx / dist) * speed * dt;
      d.y += (dy / dist) * speed * dt;
      return false;
    };

    let statTimer = 0;
    const step = () => {
      const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 1 / 20);
      const g = geo();
      const speed = Math.max(220, w * 0.55);
      const srvCy = (g.srv.y0 + g.srv.y1) / 2;

      // Spawn steady traffic + bursts.
      s.spawnAcc += s.rate * dt;
      let spawn = Math.floor(s.spawnAcc);
      s.spawnAcc -= spawn;
      const fromBurst = Math.min(s.burstLeft, Math.ceil(260 * dt));
      s.burstLeft -= fromBurst;
      spawn += fromBurst;
      for (let i = 0; i < spawn && s.dots.length < MAX_DOTS; i++) {
        s.sent++;
        s.dots.push({ x: g.src.x, y: h * (0.2 + Math.random() * 0.6), vx: 0, vy: 0, s: s.mode === 'queue' ? 'toQueue' : 'toServer', t: 0, slot: 0, a: 1 });
      }

      // Queue → server dispatch, never above capacity.
      while (s.mode === 'queue' && s.queue.length && s.processing + s.inflight < CAP) {
        const d = s.queue.shift()!;
        d.s = 'dispatch';
        s.inflight++;
      }
      const rows = Math.max(4, Math.floor((g.q.y1 - g.q.y0 - g.gap) / g.gap));
      s.queue.forEach((d, i) => (d.slot = i));

      for (const d of s.dots) {
        d.t += dt;
        switch (d.s) {
          case 'toServer':
            if (toward(d, g.srv.x0 + g.r * 2, srvCy + (d.y - srvCy) * 0.3, speed, dt)) {
              if (s.processing < CAP) {
                d.s = 'processing';
                d.t = 0;
                d.slot = s.processing++;
              } else {
                d.s = 'dropped';
                d.vx = -40 - Math.random() * 80;
                d.vy = -60 - Math.random() * 60;
                s.dropped++;
                if (s.mode === 'direct') s.droppedDirect++;
                s.fx.flash = 1;
                s.fx.shake = 1;
              }
            }
            break;
          case 'toQueue':
            if (toward(d, g.q.x0 + g.r * 2, d.y < g.q.y0 ? g.q.y0 + g.r : d.y > g.q.y1 ? g.q.y1 - g.r : d.y, speed, dt)) {
              d.s = 'queued';
              s.queue.push(d);
              d.slot = s.queue.length - 1;
            }
            break;
          case 'queued': {
            const col = Math.floor(d.slot / rows);
            const row = d.slot % rows;
            const tx = Math.max(g.q.x0 + g.gap, g.q.x1 - g.gap - col * g.gap);
            const ty = g.q.y1 - g.gap - row * g.gap;
            d.x += (tx - d.x) * Math.min(1, dt * 12);
            d.y += (ty - d.y) * Math.min(1, dt * 12);
            break;
          }
          case 'dispatch':
            if (toward(d, g.srv.x0 + g.r * 2, srvCy, speed * 1.2, dt)) {
              s.inflight--;
              d.s = 'processing';
              d.t = 0;
              d.slot = s.processing++;
            }
            break;
          case 'processing': {
            const cols = 3;
            const tx = g.srv.x0 + (g.srv.x1 - g.srv.x0) * (0.25 + (d.slot % cols) * 0.25);
            const ty = srvCy + (Math.floor(d.slot / cols) - 0.5) * g.gap * 1.6;
            d.x += (tx - d.x) * Math.min(1, dt * 14);
            d.y += (ty - d.y) * Math.min(1, dt * 14);
            if (d.t >= PROC) {
              d.s = 'done';
              d.t = 0;
              s.processing--;
              s.served++;
            }
            break;
          }
          case 'done':
            d.x += speed * 0.8 * dt;
            d.a = Math.max(0, 1 - d.t * 2.5);
            break;
          case 'dropped':
            d.vy += 520 * dt;
            d.x += d.vx * dt;
            d.y += d.vy * dt;
            d.a = Math.max(0, 1 - d.t * 1.4);
            break;
        }
      }
      // Re-pack processing slots so dots don't overlap.
      let p = 0;
      for (const d of s.dots) if (d.s === 'processing') d.slot = p++;
      s.dots = s.dots.filter((d) => d.a > 0.01 && d.x < w + 20 && d.y < h + 40);
      s.fx.flash = Math.max(0, s.fx.flash - dt * 2.2);
      s.fx.shake = Math.max(0, s.fx.shake - dt * 4);

      // ---- draw ----
      ctx.clearRect(0, 0, w, h);
      // Clients
      ctx.fillStyle = `rgba(${colors.muted},0.5)`;
      for (let i = 0; i < 5; i++) {
        roundRect(g.src.x - 10, h * (0.2 + i * 0.15) - 6, 20, 12, 3);
        ctx.fill();
      }
      // Queue (fades in/out)
      if (s.fx.queueAlpha > 0.01) {
        ctx.globalAlpha = s.fx.queueAlpha;
        roundRect(g.q.x0, g.q.y0, g.q.x1 - g.q.x0, g.q.y1 - g.q.y0, 14);
        ctx.fillStyle = `rgba(${colors.accent},0.06)`;
        ctx.fill();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = `rgba(${colors.accent},0.6)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
      // Server (shakes + flashes when overloaded)
      const sx = (Math.random() - 0.5) * 10 * s.fx.shake;
      const sy = (Math.random() - 0.5) * 6 * s.fx.shake;
      roundRect(g.srv.x0 + sx, g.srv.y0 + sy, g.srv.x1 - g.srv.x0, g.srv.y1 - g.srv.y0, 14);
      ctx.fillStyle = s.fx.flash > 0 ? `rgba(${colors.err},${0.08 + s.fx.flash * 0.3})` : `rgba(${colors.ok},0.07)`;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = s.fx.flash > 0.05 ? `rgba(${colors.err},0.9)` : `rgba(${colors.ok},0.7)`;
      ctx.stroke();
      // Load meter
      const load = Math.min(1, (s.processing + s.inflight) / CAP);
      roundRect(g.srv.x0 + 10, g.srv.y1 - 12, (g.srv.x1 - g.srv.x0 - 20) * load, 4, 2);
      ctx.fillStyle = load >= 1 ? `rgba(${colors.err},0.9)` : `rgba(${colors.accent},0.9)`;
      ctx.fill();

      // Requests
      for (const d of s.dots) {
        const col = d.s === 'dropped' ? colors.err : d.s === 'done' ? colors.ok : d.s === 'processing' ? colors.fg : colors.accent;
        ctx.fillStyle = `rgba(${col},${d.a})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- stats (8×/s, not every frame) + discoveries ----
      statTimer += dt;
      if (statTimer > 0.12) {
        statTimer = 0;
        const overloaded = s.fx.flash > 0.05;
        if (overloaded) window.dispatchEvent(new CustomEvent('lab:overload', { detail: c }));
        else if (s.processing + s.inflight < CAP) window.dispatchEvent(new Event('lab:healthy'));
        setStats({ sent: s.sent, served: s.served, dropped: s.dropped, queued: s.queue.length, overloaded });
        if (s.droppedDirect >= 15) unlock('broke-it');
        // A burst counts as survived once every request in it has been accepted (queued or served) with no drops.
        const absorbed = s.burstLeft === 0 && !s.dots.some((d) => d.s === 'toQueue' || d.s === 'toServer');
        if (s.burstDroppedAt >= 0 && absorbed) {
          if (s.mode === 'queue' && s.dropped === s.burstDroppedAt) unlock('fixed-it');
          s.burstDroppedAt = -1;
        }
      }
    };

    let running = false;
    const start = () => !running && (gsap.ticker.add(step), (running = true));
    const stop = () => running && (gsap.ticker.remove(step), (running = false));
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '100px' });
    io.observe(c);
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (prefersReducedMotion()) setRate(0);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    const on = (e: Event) => setRepair((e as CustomEvent<boolean>).detail);
    window.addEventListener('buddy:repair', on);
    return () => window.removeEventListener('buddy:repair', on);
  }, []);

  const status = repair
    ? { text: 'Under repair: builder on site 🔧', cls: 'text-accent border-accent/40 bg-accent-soft' }
    : stats.overloaded
    ? { text: 'Overloaded — dropping requests', cls: 'text-err border-err/40 bg-err/10' }
    : stats.queued > 0
      ? { text: `${stats.queued} waiting safely in the queue`, cls: 'text-accent border-accent/40 bg-accent-soft' }
      : { text: 'Healthy', cls: 'text-ok border-ok/40 bg-ok/10' };

  return (
    <div ref={root} data-glow className="card overflow-hidden" data-reveal="scale">
      {/* Controls */}
      <div className="flex flex-col gap-4 border-b border-line p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="radiogroup" aria-label="Architecture" className="relative grid w-full grid-cols-2 rounded-full border border-line p-1 text-xs sm:w-auto sm:text-sm">
          <span ref={thumb} aria-hidden="true" className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-accent" />
          {(['direct', 'queue'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={cn('relative z-10 rounded-full px-3 py-2 font-medium whitespace-nowrap transition-colors sm:px-4', mode === m ? 'text-accent-fg' : 'text-muted hover:text-fg')}
            >
              {m === 'direct' ? <Lens dev="Straight to the server" plain="No waiting line" /> : <Lens dev="Queue in front" plain="Add a waiting line" />}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          <label className="flex min-w-0 basis-full items-center gap-3 text-xs text-muted sm:basis-auto sm:text-sm">
            <span className="whitespace-nowrap">
              <Lens dev="Traffic" plain="Visitors" />
            </span>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="min-w-0 flex-1 accent-[var(--accent)] sm:w-36 sm:flex-none"
              aria-valuetext={`${rate} requests per second`}
            />
            <span className="w-14 font-mono text-fg tabular-nums">
              {rate}
              <Lens dev=" req/s" plain="/s" />
            </span>
          </label>
          <Magnetic strength={0.25}>
            <button data-burst-btn type="button" onClick={burst} className="btn-primary">
              <LuZap className="h-4 w-4" /> Send a burst
            </button>
          </Magnetic>
          <button type="button" onClick={reset} className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted hover:border-accent hover:text-accent" aria-label="Reset the simulation">
            <LuRotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scene */}
      <div className="relative">
        <canvas ref={canvasRef} className="block h-[260px] w-full sm:h-[320px] lg:h-[360px]" aria-hidden="true" />
        <span className="pointer-events-none absolute top-3 left-3 font-mono text-[10px] tracking-[0.14em] text-muted uppercase sm:text-[11px]">
          <Lens dev="Clients" plain="Visitors" />
        </span>
        <span data-lab-queue-label className="pointer-events-none invisible absolute top-3 left-[47%] -translate-x-1/2 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-accent uppercase sm:text-[11px]">
          <Lens dev="Queue (RabbitMQ)" plain="Waiting line" />
        </span>
        <span className="pointer-events-none absolute top-3 right-3 font-mono text-[10px] tracking-[0.14em] text-muted uppercase sm:text-[11px]">Server</span>
        <span className={cn('absolute bottom-3 left-1/2 max-w-[90%] -translate-x-1/2 truncate rounded-full border px-3 py-1 text-xs font-medium', status.cls)} role="status">
          {status.text}
        </span>
      </div>

      {/* Stats */}
      <dl className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
        {(
          [
            ['Sent', 'Arrived', stats.sent, 'text-fg'],
            ['Served', 'Helped', stats.served, 'text-ok'],
            ['Dropped', 'Turned away', stats.dropped, stats.dropped ? 'text-err' : 'text-fg'],
            ['Queued', 'Waiting', stats.queued, 'text-accent'],
          ] as const
        ).map(([k, kp, v, c]) => (
          <div key={k} className="flex flex-col-reverse bg-surface px-4 py-3 sm:px-5">
            <dt className="text-xs text-muted">
              <Lens dev={k} plain={kp} />
            </dt>
            <dd className={cn('font-display text-2xl font-semibold tabular-nums', c)}>{v.toLocaleString('en-US')}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
