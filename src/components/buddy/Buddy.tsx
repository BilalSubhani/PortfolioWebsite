'use client';

import { useEffect, useRef, useState } from 'react';
import { LuDice5, LuX } from 'react-icons/lu';
import type { AnimationAction, Material, Mesh, MeshStandardMaterial } from 'three';
import { unlock } from '@/lib/achievements';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/gsap';
import * as L from './lines';

const KEY = 'bs-buddy';
const NEAR = 230; // px: the mouse is "near" inside this radius
const NAV = 96; // keep clear of the fixed nav
const IDLE_STEAL_MS = 5000; // mouse still this long → the buddy steals it
const STEAL_COOLDOWN_MS = 120000;
const RANSOM_KEY = 'bs-ransom'; // a stolen cursor survives a refresh
const PERCH_SELECTOR = '#main [data-glow], #main .card, #main [data-perch], #main h2, #main h3';

const pickRandom = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// el: the element it stands on (null = a fixed screen point, by default the bottom edge).
// offset: x along the element (or screen x). dy: how far below the element's top edge its feet are.
type Perch = { el: HTMLElement | null; offset: number; dy?: number; y?: number };

type Api = { poke: () => void; dodge: () => void; payRansom: (meme: string) => void; cancelRansom: () => void };

// A little builder (Kenney "worker", three.js, loaded lazily) that lives on the page:
// it perches on cards and headings and rides along as you scroll, jumps to stay in view,
// walks edges, sits, inspects things, fixes the Load Lab server when it's overloaded,
// watches the mouse, dodges when hovered, steals an idle cursor (ransom: one meme),
// and talks now and then.
export default function Buddy() {
  const wrap = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const ransomRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [on, setOn] = useState<boolean | null>(null);
  const [line, setLine] = useState<string | null>(null);
  const [ransom, setRansom] = useState(false);
  const [meme, setMeme] = useState('');
  const [ransomMsg, setRansomMsg] = useState(L.ransomNote);
  const api = useRef<Api | null>(null);
  const lineRef = useRef<string | null>(null); // the bubble's current text (readable from the scene loop)

  // On/off: persisted, toggled from the terminal or the × button.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    const start = () => setOn(saved !== 'off');
    let t: ReturnType<typeof setTimeout> | undefined;
    const onRole = () => (t = setTimeout(start, 2500));
    if (document.documentElement.classList.contains('needs-role')) window.addEventListener('role', onRole, { once: true });
    else t = setTimeout(start, 1500);

    const onBuddy = (e: Event) => {
      const next = (e as CustomEvent<string>).detail !== 'off';
      try {
        localStorage.setItem(KEY, next ? 'on' : 'off');
      } catch {
        /* ignore */
      }
      setOn(next);
    };
    window.addEventListener('buddy', onBuddy);
    return () => {
      clearTimeout(t);
      window.removeEventListener('role', onRole);
      window.removeEventListener('buddy', onBuddy);
    };
  }, []);

  // Keep a floating element (bubble / ransom note) inside the screen horizontally.
  const keepOnScreen = (el: HTMLElement) => {
    gsap.set(el, { x: 0 });
    const r = el.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    gsap.set(el, { x: r.left < 8 ? 8 - r.left : r.right > vw - 8 ? vw - 8 - r.right : 0 });
  };

  // Speech bubble: pop in, stay on screen, pop out.
  useEffect(() => {
    lineRef.current = line;
    const b = bubbleRef.current;
    if (!b || !line) return;
    const reduce = prefersReducedMotion();
    keepOnScreen(b);
    const tl = gsap
      .timeline({ onComplete: () => setLine(null) })
      .fromTo(b, { autoAlpha: 0, y: 10, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: reduce ? 0 : 0.4, ease: 'back.out(2)' })
      .to(b, { autoAlpha: 0, y: -6, duration: reduce ? 0 : 0.3 }, `+=${Math.min(6, 2.2 + line.length / 22)}`);
    return () => void tl.kill();
  }, [line]);

  // Ransom note: pop in and focus the input so the visitor can type straight away.
  useEffect(() => {
    const f = ransomRef.current;
    if (!f || !ransom) return;
    keepOnScreen(f);
    // Opacity only (not visibility): a hidden element can't take focus.
    gsap.fromTo(f, { opacity: 0, y: 12, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: prefersReducedMotion() ? 0 : 0.45, ease: 'back.out(2)' });
    inputRef.current?.focus({ preventScroll: true });
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120);
    return () => clearTimeout(t);
  }, [ransom]);

  useEffect(() => {
    if (!on) return;
    const canvas = canvasRef.current;
    const w = wrap.current;
    const bodyEl = body.current;
    if (!canvas || !w || !bodyEl) return;
    let disposed = false;
    const anims = new Set<gsap.core.Animation>();
    const track = <T extends gsap.core.Animation>(a: T) => (anims.add(a), a);
    const cleanups: (() => void)[] = [];

    (async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      if (disposed) return;

      const size = canvas.clientWidth;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(size, size, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, 0.75, 3.6);
      camera.lookAt(0, 0.55, 0);
      scene.add(new THREE.HemisphereLight(0xfff1dd, 0x3a2f25, 2.3));
      const sun = new THREE.DirectionalLight(0xffe2c4, 1.7);
      sun.position.set(2, 4, 3);
      scene.add(sun);

      const gltf = await new GLTFLoader().loadAsync('/buddy/character-worker.glb');
      if (disposed) return;
      const model = gltf.scene;
      const warm = new THREE.Color(1, 0.95, 0.87);
      model.traverse((o) => {
        const mat = (o as Mesh).material as MeshStandardMaterial | undefined;
        if (mat && 'roughness' in mat) {
          mat.color.multiply(warm);
          mat.roughness = 1;
          mat.metalness = 0;
        }
      });
      const box = new THREE.Box3().setFromObject(model);
      const scale = 1.15 / (box.max.y - box.min.y);
      model.scale.setScalar(scale);
      model.position.y = -box.min.y * scale;
      scene.add(model);
      const head = model.getObjectByName('head');

      const mixer = new THREE.AnimationMixer(model);
      const actions = Object.fromEntries(gltf.animations.map((c) => [c.name, mixer.clipAction(c)]));
      let current: AnimationAction | null = null;
      const play = (clip: string, once = false) =>
        new Promise<void>((resolve) => {
          const next = actions[clip] ?? actions.idle;
          if (!next) return resolve();
          next.reset();
          next.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
          next.clampWhenFinished = once;
          next.enabled = true;
          if (current && current !== next) next.crossFadeFrom(current, 0.2, false);
          next.play();
          current = next;
          if (!once) return resolve();
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            mixer.removeEventListener('finished', done);
            clearTimeout(timer);
            resolve();
          };
          const done = (e: { action: AnimationAction }) => e.action === next && finish();
          // If another animation interrupts this one, 'finished' never fires: don't hang.
          const timer = setTimeout(finish, next.getClip().duration * 1000 + 400);
          mixer.addEventListener('finished', done);
        });
      play('idle');

      const reduce = prefersReducedMotion();
      const vw = () => document.documentElement.clientWidth;
      const vh = () => window.innerHeight;

      // ---------- where it stands ----------
      const perch: Perch = { el: null, offset: rand(40, vw() - 140) };
      let airborne = false;
      const foot = (p: Perch) => {
        if (!p.el) return { x: clamp(p.offset, size / 2 + 8, vw() - size / 2 - 8), y: p.y ?? vh() };
        const r = p.el.getBoundingClientRect();
        return { x: r.left + clamp(p.offset, 28, r.width - 28), y: r.top + (p.dy ?? 3) };
      };
      const place = (x: number, y: number) => gsap.set(w, { x: x - size / 2, y: y - size });
      const perchOk = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return (
          el.isConnected &&
          r.width >= 120 &&
          r.height > 0 &&
          r.top >= size + NAV + 12 && // room for the buddy under the nav
          r.top <= vh() - 30 &&
          r.left >= 4 &&
          r.right <= vw() - 4 &&
          !el.closest('dialog') &&
          getComputedStyle(el).visibility !== 'hidden'
        );
      };
      const findPerch = (opts: { avoid?: HTMLElement | null; awayFromX?: number } = {}): Perch => {
        const here = foot(perch);
        const cands = Array.from(document.querySelectorAll<HTMLElement>(PERCH_SELECTOR)).filter((el) => el !== opts.avoid && perchOk(el));
        if (!cands.length) return { el: null, offset: here.x };
        const scored = cands
          .map((el) => {
            const r = el.getBoundingClientRect();
            // Favour the right-hand end: text on this site is left-aligned, so that's where the empty space is.
            const off = r.width - rand(36, Math.max(40, Math.min(220, r.width * 0.4)));
            const x = r.left + off;
            let score = Math.hypot(x - here.x, r.top - here.y) * rand(0.6, 1.4);
            if (opts.awayFromX !== undefined) score -= Math.abs(x - opts.awayFromX) * 2;
            return { el, off, score };
          })
          .sort((a, b) => a.score - b.score);
        const pick = pickRandom(scored.slice(0, 3));
        return { el: pick.el, offset: pick.off };
      };
      const perchVisible = () => {
        if (!perch.el) return true;
        const r = perch.el.getBoundingClientRect();
        const top = r.top + (perch.dy ?? 0);
        return perch.el.isConnected && r.width > 0 && top > size + NAV - 20 && top < vh() - 10;
      };

      // ---------- head look-at (on top of whatever the animation does) ----------
      const look = { x: 0, y: 0, tx: 0, ty: 0 };
      const applied = { x: 0, y: 0 };

      // ---------- shared state ----------
      const ctl = { near: false, busy: false, nearSince: 0, saidNear: false, lastDodge: 0, fixing: false, stolen: false };
      const mouse = { x: -1e4, y: -1e4, lastMove: 0, inside: true };
      let lastRemark = 0;
      let firstScramble = true;
      // Scroll speed (px/s), smoothed; fast scrolls get the signature lines.
      const scrollSpeed = { v: 0, y: window.scrollY, t: performance.now() };
      const onScroll = () => {
        const now = performance.now();
        const dt = Math.max(16, now - scrollSpeed.t);
        const v = (Math.abs(window.scrollY - scrollSpeed.y) / dt) * 1000;
        scrollSpeed.v = scrollSpeed.v * 0.6 + v * 0.4;
        scrollSpeed.y = window.scrollY;
        scrollSpeed.t = now;
        // Standing on the floor during a fast scroll: hop and heckle (nothing to scramble onto).
        if (scrollSpeed.v > 1200 && !perch.el && !airborne && !ctl.stolen && !ctl.busy && now - lastRemark > 2500) {
          lastRemark = now;
          setLine(Math.random() < 0.75 ? pickRandom(['Nice try, buddy.', 'Parkour!']) : pickRandom(L.scrollRemarks));
          void hopInPlace();
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener('scroll', onScroll));
      let scramble: () => void = () => {};

      const tick = (_t: number, dtMs: number) => {
        if (document.hidden) return;
        if (!airborne) {
          if (perch.el && !perchVisible()) scramble();
          else {
            const f = foot(perch);
            place(f.x, f.y);
          }
        }
        if (head) {
          head.rotation.x -= applied.x;
          head.rotation.y -= applied.y;
        }
        mixer.update(Math.min(dtMs, 100) / 1000);
        look.x += (look.tx - look.x) * 0.12;
        look.y += (look.ty - look.y) * 0.12;
        if (head) {
          head.rotation.x += look.x;
          head.rotation.y += look.y;
          applied.x = look.x;
          applied.y = look.y;
        }
        renderer.render(scene, camera);
      };

      const face = (dir: number) =>
        track(gsap.to(model.rotation, { y: dir > 0 ? Math.PI / 2 : dir < 0 ? -Math.PI / 2 : 0, duration: 0.3, ease: 'power2.out', overwrite: true }));
      const sleep = (s: number) => new Promise<void>((r) => track(gsap.delayedCall(s, r)));
      const say = (t: string) => !ctl.stolen && setLine((l) => l ?? t);

      // Jump in an arc to a new perch, tracking the target's live position (it may be scrolling).
      let stopWalk: (() => void) | null = null;
      const jumpTo = (to: Perch) =>
        new Promise<void>((resolve) => {
          stopWalk?.();
          airborne = true;
          const start = { x: (gsap.getProperty(w, 'x') as number) + size / 2, y: (gsap.getProperty(w, 'y') as number) + size };
          const end0 = foot(to);
          const dist = Math.hypot(end0.x - start.x, end0.y - start.y);
          const arc = clamp(70 + dist * 0.18, 70, 200);
          face(Math.sign(end0.x - start.x));
          play('jump', true);
          const proxy = { p: 0 };
          track(
            gsap.to(proxy, {
              p: 1,
              duration: clamp(dist / 900, 0.45, 0.95),
              ease: 'power1.inOut',
              onUpdate: () => {
                const end = foot(to);
                place(lerp(start.x, end.x, proxy.p), lerp(start.y, end.y, proxy.p) - arc * 4 * proxy.p * (1 - proxy.p));
              },
              onComplete: () => {
                Object.assign(perch, { el: to.el, offset: to.offset, dy: to.dy, y: to.y });
                airborne = false;
                face(0);
                play(ctl.stolen ? 'holding-both' : 'idle');
                track(gsap.fromTo(bodyEl, { scaleY: 0.82, scaleX: 1.12 }, { scaleY: 1, scaleX: 1, duration: 0.45, ease: 'elastic.out(1, 0.4)', transformOrigin: '50% 100%' }));
                resolve();
              },
            }),
          );
        });

      scramble = () => {
        if (airborne || reduce) return;
        ctl.fixing = false;
        const now = performance.now();
        const fast = scrollSpeed.v > 1200;
        if (!ctl.stolen && (firstScramble || (now - lastRemark > (fast ? 2500 : 5000) && Math.random() < (fast ? 0.9 : 0.6)))) {
          lastRemark = now;
          const remark = firstScramble
            ? L.scrollRemarks[0]
            : fast && Math.random() < 0.75
              ? pickRandom(['Nice try, buddy.', 'Parkour!'])
              : pickRandom(L.scrollRemarks);
          firstScramble = false;
          if (fast || remark === L.scrollRemarks[0]) setLine(remark); // signature lines interrupt
          else say(remark);
        }
        jumpTo(findPerch({ avoid: perch.el }));
      };

      // Walk along the current perch (or the bottom of the screen). Interruptible.
      const walkTo = (offset: number, speed: number, clip: 'walk' | 'sprint') =>
        new Promise<void>((resolve) => {
          face(Math.sign(offset - perch.offset));
          play(clip);
          const tween = track(gsap.to(perch, { offset, duration: Math.abs(offset - perch.offset) / speed, ease: 'none', onComplete: () => finish() }));
          const finish = () => {
            tween.kill();
            stopWalk = null;
            resolve();
          };
          stopWalk = finish;
        });

      const hopInPlace = async () => {
        play('jump', true);
        await track(gsap.timeline().to(bodyEl, { y: -42, duration: 0.3, ease: 'power2.out' }).to(bodyEl, { y: 0, duration: 0.36, ease: 'bounce.out' }));
        play('idle');
      };

      // ---------- mouse ----------
      const center = () => {
        const r = canvas.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height * 0.4 };
      };
      const updateLook = () => {
        if (!ctl.near || ctl.stolen) {
          look.tx = look.ty = 0;
          return;
        }
        const c = center();
        look.ty = clamp(Math.atan2(mouse.x - c.x, 320), -0.9, 0.9);
        look.tx = clamp((mouse.y - c.y) / 420, -0.55, 0.3);
      };
      const onNear = async () => {
        if (airborne || ctl.busy) return;
        ctl.busy = true;
        stopWalk?.();
        play('idle');
        face(0); // look out at the screen first…
        await sleep(0.45);
        ctl.busy = false;
        updateLook(); // …then at the mouse
      };
      const dodge = async () => {
        const now = performance.now();
        if (ctl.busy || airborne || ctl.stolen || now - ctl.lastDodge < 1200) return;
        if (Math.random() > 0.65) return; // sometimes it stands its ground (so it can be clicked)
        ctl.lastDodge = now;
        ctl.busy = true;
        look.tx = look.ty = 0;
        if (Math.random() < 0.6) say(pickRandom(L.dodges));
        await jumpTo(findPerch({ avoid: perch.el, awayFromX: mouse.x }));
        ctl.busy = false;
        updateLook();
      };
      let raf = 0;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.lastMove = performance.now();
        mouse.inside = true;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const c = center();
          const near = Math.hypot(mouse.x - c.x, mouse.y - c.y) < NEAR;
          if (near && !ctl.near) {
            ctl.near = true;
            ctl.nearSince = performance.now();
            ctl.saidNear = false;
            onNear();
          } else if (!near && ctl.near) {
            ctl.near = false;
            updateLook();
          } else if (near) {
            if (!ctl.busy) updateLook();
            if (!ctl.saidNear && !ctl.stolen && performance.now() - ctl.nearSince > 2500) {
              ctl.saidNear = true;
              say(pickRandom(L.nearby));
            }
          }
        });
      };
      const onLeave = () => (mouse.inside = false);
      const fine = isFinePointer() && !reduce;
      if (fine) {
        window.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
      }

      // ---------- Load Lab: rush in and fix the overloaded server ----------
      let lastHealthy = 0;
      const onOverload = async (e: Event) => {
        const lab = (e as CustomEvent<HTMLElement>).detail;
        if (ctl.fixing || ctl.stolen || airborne || reduce) return;
        const r = lab.getBoundingClientRect();
        if (r.top < size + NAV || r.top > vh() - 120) return; // only if the server is actually on screen
        ctl.fixing = true;
        ctl.busy = true;
        stopWalk?.();
        say(pickRandom(L.fixing));
        // The server box sits at ~76–94% across and from ~28% down the Lab canvas.
        await jumpTo({ el: lab, offset: r.width * 0.85, dy: r.height * 0.28 + 2 });
        window.dispatchEvent(new CustomEvent('buddy:repair', { detail: true }));
        const started = performance.now();
        const minFix = rand(5000, 6500);
        while (ctl.fixing && !disposed) {
          face(Math.random() < 0.5 ? 1 : -1);
          await play(Math.random() < 0.5 ? 'attack-melee-right' : 'interact-right', true);
          track(gsap.fromTo(bodyEl, { x: -2 }, { x: 0, duration: 0.25, ease: 'elastic.out(1, 0.3)' }));
          const elapsed = performance.now() - started;
          if (elapsed > minFix && performance.now() - lastHealthy < 800) break; // done, and it's actually healthy
          if (elapsed > 14000) break; // give up eventually
        }
        window.dispatchEvent(new CustomEvent('buddy:repair', { detail: false }));
        if (!disposed && perch.el === lab) {
          face(0);
          await play('emote-yes', true);
          say(pickRandom(L.fixed));
          play('idle');
        }
        ctl.fixing = false;
        ctl.busy = false;
      };
      const onHealthy = () => {
        lastHealthy = performance.now();
      };
      // Burst spam: three or more bursts inside 6 s earns a remark.
      const bursts: number[] = [];
      let lastSpamRemark = 0;
      const onBurst = () => {
        const now = performance.now();
        bursts.push(now);
        while (bursts.length && now - bursts[0] > 6000) bursts.shift();
        if (bursts.length >= 3 && now - lastSpamRemark > 6000 && !ctl.stolen) {
          lastSpamRemark = now;
          setLine(pickRandom(ctl.fixing ? L.burstSpamFixing : L.burstSpam));
        }
      };
      window.addEventListener('lab:burst', onBurst);
      cleanups.push(() => window.removeEventListener('lab:burst', onBurst));
      window.addEventListener('lab:overload', onOverload);
      window.addEventListener('lab:healthy', onHealthy);

      // ---------- rm -rf: go rogue ----------
      const onRogue = async () => {
        if (ctl.stolen || disposed) return;
        ctl.busy = true;
        ctl.fixing = false;
        stopWalk?.();
        await jumpTo({ el: null, offset: vw() / 2, y: vh() * 0.62 });
        for (let i = 0; i < 4 && !disposed; i++) {
          face(i % 2 ? 1 : -1);
          await play(pickRandom(['attack-kick-right', 'attack-melee-right', 'attack-kick-left', 'attack-melee-left']), true);
        }
        face(0);
        await sleep(2.8);
        await play('emote-yes', true);
        ctl.busy = false;
        play('idle');
      };
      const onForcedLine = (e: Event) => {
        const t = (e as CustomEvent<string>).detail;
        if (ctl.stolen) setRansomMsg(t);
        else setLine(t);
      };
      window.addEventListener('buddy:rogue', onRogue);
      window.addEventListener('buddy:say', onForcedLine);
      cleanups.push(() => {
        window.removeEventListener('buddy:rogue', onRogue);
        window.removeEventListener('buddy:say', onForcedLine);
      });

      // ---------- cursor theft ----------
      let lastSteal = -Infinity;
      let rejected = false; // the meme critic rejects at most once per theft
      const isTyping = () =>
        !!document.activeElement?.closest(
          'input:not([type=range]):not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea, select, [contenteditable="true"]',
        );
      const steal = async () => {
        ctl.stolen = true;
        ctl.busy = true;
        stopWalk?.();
        look.tx = look.ty = 0;
        const target = { x: mouse.x, y: mouse.y };
        // Run over and grab it…
        await jumpTo({ el: null, offset: target.x, y: clamp(target.y + size * 0.35, size + NAV, vh()) });
        const c = center();
        window.dispatchEvent(new CustomEvent('cursor:steal', { detail: c }));
        await play('pick-up', true);
        play('holding-both');
        // …then make off with it.
        await sleep(0.3);
        await jumpTo(findPerch({ awayFromX: target.x }));
        play('holding-both');
        setRansomMsg(L.ransomNote);
        rejected = false;
        document.documentElement.classList.add('cursor-stolen');
        setRansom(true);
        try {
          localStorage.setItem(RANSOM_KEY, '1');
        } catch {
          /* ignore */
        }
      };
      const giveBack = (text: string) => {
        if (!ctl.stolen) return;
        document.documentElement.classList.remove('cursor-stolen');
        try {
          localStorage.removeItem(RANSOM_KEY);
        } catch {
          /* ignore */
        }
        setRansom(false);
        setMeme('');
        setLine(text);
        const c = center();
        window.dispatchEvent(new CustomEvent('cursor:return', { detail: c }));
        ctl.stolen = false;
        ctl.busy = false;
        lastSteal = performance.now();
        play('emote-yes', true).then(() => {
          if (!ctl.stolen) play('idle');
        });
      };
      const idleCheck = setInterval(() => {
        const now = performance.now();
        if (
          !fine ||
          disposed ||
          ctl.stolen ||
          ctl.busy ||
          ctl.fixing ||
          airborne ||
          !mouse.lastMove ||
          !mouse.inside ||
          document.hidden ||
          now - mouse.lastMove < IDLE_STEAL_MS ||
          now - lastSteal < STEAL_COOLDOWN_MS ||
          document.querySelector('dialog[open]') ||
          isTyping() ||
          mouse.y < NAV // hovering the nav
        )
          return;
        steal();
      }, 1000);

      api.current = {
        poke: () => {
          unlock('buddy');
          say(pickRandom(L.pokes));
          if (!ctl.busy && !airborne) hopInPlace();
        },
        dodge,
        payRansom: (text) => {
          if (!text.trim()) return;
          if (!rejected && Math.random() < 0.35) {
            rejected = true;
            setRansomMsg(pickRandom(L.lame));
            setMeme('');
            play('emote-no', true).then(() => {
              if (ctl.stolen) play('holding-both');
            });
            return;
          }
          unlock('ransom');
          giveBack(pickRandom(L.laughs));
        },
        cancelRansom: () => giveBack(pickRandom(L.sulks)),
      };

      // ---------- reactions to what the visitor does ----------
      const themeObs = new MutationObserver(() =>
        say(pickRandom(document.documentElement.dataset.theme === 'light' ? L.reactions.themeLight : L.reactions.themeDark)),
      );
      themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      const onRole = (e: Event) => say(pickRandom((e as CustomEvent<string>).detail === 'plain' ? L.reactions.rolePlain : L.reactions.roleDev));
      const onTrophy = () => Math.random() < 0.6 && say(pickRandom(L.reactions.trophy));
      let lastTab = 0;
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        const now = performance.now();
        if (now - lastTab < 6000) return;
        if (document.activeElement?.closest('dialog, [role=log]')) return; // Tab is autocomplete in the terminal
        lastTab = now;
        if (ctl.stolen) setRansomMsg(pickRandom(L.reactions.tabDuringRansom));
        else say(pickRandom(L.reactions.tab));
      };
      window.addEventListener('role', onRole);
      window.addEventListener('achievement', onTrophy);
      window.addEventListener('keydown', onKey);
      cleanups.push(() => {
        themeObs.disconnect();
        window.removeEventListener('role', onRole);
        window.removeEventListener('achievement', onTrophy);
        window.removeEventListener('keydown', onKey);
      });

      gsap.ticker.add(tick);
      place(foot(perch).x, foot(perch).y);

      // A cursor stolen before a refresh is still stolen.
      let pendingRansom = false;
      try {
        pendingRansom = localStorage.getItem(RANSOM_KEY) === '1';
      } catch {
        /* ignore */
      }
      if (pendingRansom && fine) {
        ctl.stolen = true;
        ctl.busy = true;
        play('holding-both');
        setRansomMsg(`${pickRandom(L.reactions.refreshRansom)} ${L.ransomNote}`);
        document.documentElement.classList.add('cursor-stolen');
        setRansom(true);
        window.dispatchEvent(new Event('cursor:held'));
      } else if (pendingRansom) {
        try {
          localStorage.removeItem(RANSOM_KEY);
        } catch {
          /* ignore */
        }
      }
      track(gsap.fromTo(w, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }));

      const sectionNow = () =>
        perch.el?.closest<HTMLElement>('section[id]')?.id ??
        document.elementFromPoint(vw() / 2, vh() / 2)?.closest<HTMLElement>('section[id]')?.id;
      const talk = () => {
        if (disposed) return;
        const local = L.bySection[sectionNow() ?? ''];
        if (!ctl.stolen && !ctl.fixing) say(pickRandom(local && Math.random() < 0.7 ? local : L.chatter));
        track(gsap.delayedCall(rand(14, 24), talk));
      };
      track(gsap.delayedCall(rand(6, 10), talk));

      // ---------- tips: one every 10 s while the visitor lingers without touching the mouse ----------
      // The section the visitor is looking at (screen centre), not the one the buddy stands on.
      const viewSection = () =>
        document
          .elementsFromPoint(vw() / 2, vh() * 0.45)
          .find((el) => el.closest('#main'))
          ?.closest<HTMLElement>('section[id]')?.id;
      let tipSection = viewSection();
      let tipClock = performance.now();
      let lastTip = '';
      const resetTips = () => (tipClock = performance.now());
      const tipCheck = setInterval(() => {
        if (disposed || document.hidden) return;
        const sec = viewSection();
        if (sec !== tipSection) {
          tipSection = sec;
          resetTips();
          return;
        }
        if (performance.now() - tipClock < 10000) return;
        if (lineRef.current || ctl.stolen || ctl.fixing) return; // wait for the bubble to clear
        resetTips();
        const pool = (sec && L.tips[sec]?.filter((t) => t !== lastTip)) || [];
        if (!pool.length || ctl.stolen || ctl.fixing) return;
        lastTip = pickRandom(pool);
        say(lastTip);
      }, 1000);
      window.addEventListener('pointermove', resetTips, { passive: true });
      window.addEventListener('pointerdown', resetTips);
      window.addEventListener('wheel', resetTips, { passive: true });
      cleanups.push(() => {
        clearInterval(tipCheck);
        window.removeEventListener('pointermove', resetTips);
        window.removeEventListener('pointerdown', resetTips);
        window.removeEventListener('wheel', resetTips);
      });

      cleanups.push(() => {
        clearInterval(idleCheck);
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('lab:overload', onOverload);
        window.removeEventListener('lab:healthy', onHealthy);
        if (ctl.stolen) window.dispatchEvent(new CustomEvent('cursor:return', { detail: center() }));
        document.documentElement.classList.remove('cursor-stolen');
        gsap.ticker.remove(tick);
        mixer.stopAllAction();
        renderer.dispose();
        model.traverse((o) => {
          const m = o as Mesh;
          m.geometry?.dispose?.();
          const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
          mats.forEach((mat: Material) => mat.dispose());
        });
      });

      // ---------- life: hop onto things, walk their edges, sit, inspect ----------
      await sleep(0.8);
      while (!disposed && !reduce) {
        if (ctl.near || ctl.busy || airborne) {
          await sleep(0.3);
          continue;
        }
        // On the floor? Get back up onto something as soon as there's anything to stand on.
        if (!perch.el) {
          const to = findPerch();
          if (to.el) {
            await jumpTo(to);
            if (Math.random() < 0.25) say(pickRandom(L.landings));
            await sleep(rand(0.8, 1.6));
            continue;
          }
        }
        const r = Math.random();
        const width = perch.el ? perch.el.getBoundingClientRect().width : vw();
        if (r < 0.3) {
          const to = findPerch({ avoid: perch.el });
          if (to.el) {
            await jumpTo(to);
            if (Math.random() < 0.25) say(pickRandom(L.landings));
          }
        } else if (r < 0.6) {
          const target = perch.el ? rand(Math.max(28, width * 0.6), width - 28) : rand(size, vw() - size - 90);
          if (Math.abs(target - perch.offset) > 30) {
            const sprint = Math.random() < 0.25;
            await walkTo(target, sprint ? 170 : 70, sprint ? 'sprint' : 'walk');
            if (!ctl.near && !ctl.busy && !airborne) {
              face(0);
              play('idle');
            }
          }
        } else if (r < 0.72) {
          play('sit');
          await sleep(rand(2.5, 4.5));
          if (!ctl.near && !airborne && !ctl.busy) play('idle');
        } else if (r < 0.84) {
          // "Inspecting" the element it's standing on.
          face(Math.random() < 0.5 ? 1 : -1);
          await play(Math.random() < 0.5 ? 'interact-right' : 'pick-up', true);
          if (!ctl.busy) {
            face(0);
            play('idle');
          }
        } else if (r < 0.9) {
          await hopInPlace();
        }
        await sleep(rand(1, 2.6));
      }
    })().catch(() => {
      /* WebGL unavailable or an asset failed: the buddy simply doesn't appear */
    });

    return () => {
      disposed = true;
      anims.forEach((a) => a.kill());
      anims.clear();
      api.current = null;
      cleanups.forEach((f) => f());
      setRansom(false);
    };
  }, [on]);

  if (!on) return null;

  return (
    <div ref={wrap} className="pointer-events-none fixed top-0 left-0 z-[38]" style={{ visibility: 'hidden' }}>
      {/* Speech bubble */}
      <div
        ref={bubbleRef}
        role="status"
        aria-live="polite"
        className="pointer-events-auto absolute bottom-[calc(100%-6px)] left-1/2 w-max max-w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-line bg-surface px-3.5 py-2.5 text-xs leading-snug text-fg shadow-xl shadow-black/30 sm:text-sm"
        style={{ visibility: 'hidden' }}
      >
        {line}
        <span aria-hidden="true" className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-line bg-surface" />
      </div>

      {/* Ransom note while the cursor is stolen */}
      {ransom && (
        <form
          ref={ransomRef}
          onSubmit={(e) => {
            e.preventDefault();
            api.current?.payRansom(meme);
          }}
          onKeyDown={(e) => e.key === 'Escape' && api.current?.cancelRansom()}
          className="pointer-events-auto absolute bottom-[calc(100%-6px)] left-1/2 w-[min(19rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-accent/50 bg-surface p-3.5 text-sm text-fg shadow-2xl shadow-black/40"
          aria-label="Ransom note"
        >
          <p className="font-medium">{ransomMsg}</p>
          <div className="mt-3 flex gap-2">
            <input
              ref={inputRef}
              autoFocus
              value={meme}
              onChange={(e) => setMeme(e.target.value.slice(0, 140))}
              placeholder="Type any meme…"
              aria-label="Your meme"
              className="min-w-0 flex-1 rounded-lg border border-line bg-bg px-3 py-2 text-base text-fg outline-none placeholder:text-muted/60 focus:border-accent sm:text-sm"
            />
            <button type="submit" className="rounded-lg bg-accent px-3 text-sm font-medium text-accent-fg">
              Pay
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted">
            <button type="button" onClick={() => setMeme(pickRandom(L.memes))} className="flex items-center gap-1.5 hover:text-accent">
              <LuDice5 className="h-3.5 w-3.5" /> Random meme
            </button>
            <span>Esc to give up</span>
          </div>
          <span aria-hidden="true" className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-accent/50 bg-surface" />
        </form>
      )}

      <div ref={body} className="group relative">
        <span aria-hidden="true" className="absolute bottom-0.5 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-black/35 blur-[3px] sm:w-16" />
        {/* The stolen cursor, held overhead */}
        {ransom && (
          <span aria-hidden="true" className="absolute -top-2 left-1/2 h-7 w-7 -translate-x-1/2 animate-bounce rounded-full border-[1.5px] border-accent">
            <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
          </span>
        )}
        <canvas
          ref={canvasRef}
          data-cursor="link"
          onClick={() => api.current?.poke()}
          onPointerEnter={(e) => e.pointerType === 'mouse' && api.current?.dodge()}
          className="pointer-events-auto relative block h-[84px] w-[84px] sm:h-[104px] sm:w-[104px]"
          aria-label="Your site buddy. Click to say hi."
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), api.current?.poke())}
        />
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('buddy', { detail: 'off' }))}
          className="pointer-events-auto absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full border border-line bg-surface text-muted opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-fg"
          aria-label="Send the buddy home"
        >
          <LuX className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
