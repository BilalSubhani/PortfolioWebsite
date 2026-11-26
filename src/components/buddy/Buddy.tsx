'use client';

import { useEffect, useRef, useState } from 'react';
import { LuX } from 'react-icons/lu';
import type { AnimationAction, Material, Mesh } from 'three';
import { unlock } from '@/lib/achievements';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/gsap';
import { all, nearby, pokes } from './lines';

export const BUDDIES = ['robot', 'alien', 'knight', 'zombie'] as const;
type BuddyName = (typeof BUDDIES)[number];
const KEY = 'bs-buddy';
const NEAR = 230; // px: the mouse is "near" inside this radius

const pickRandom = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// A small Kenney character (three.js, loaded lazily) that roams along the bottom of the
// screen, reacts to the mouse (stops, looks at you, follows the cursor with its head,
// dodges when you hover it) and says random things. Click it.
export default function Buddy() {
  const wrap = useRef<HTMLDivElement>(null);
  const hop = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState<BuddyName | 'off' | null>(null);
  const [line, setLine] = useState<string | null>(null);
  const api = useRef<{ poke: () => void; dodge: () => void } | null>(null);

  // Which buddy (or none): persisted, and switchable from the terminal.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    const valid = saved === 'off' || BUDDIES.includes(saved as BuddyName);
    const start = () => setName(valid ? (saved as BuddyName | 'off') : 'robot');
    let t: ReturnType<typeof setTimeout> | undefined;
    // Don't show up until the visitor is past the first-visit picker.
    const onRole = () => (t = setTimeout(start, 2500));
    if (document.documentElement.classList.contains('needs-role')) window.addEventListener('role', onRole, { once: true });
    else t = setTimeout(start, 1500);

    const onBuddy = (e: Event) => {
      const v = (e as CustomEvent<string>).detail;
      const next = v === 'on' ? 'robot' : (v as BuddyName | 'off');
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* ignore */
      }
      setName(next);
    };
    window.addEventListener('buddy', onBuddy);
    return () => {
      clearTimeout(t);
      window.removeEventListener('role', onRole);
      window.removeEventListener('buddy', onBuddy);
    };
  }, []);

  // Speech bubble pop-in/out.
  useEffect(() => {
    const b = bubbleRef.current;
    if (!b || !line) return;
    const reduce = prefersReducedMotion();
    // Keep the bubble on screen when the buddy is near an edge.
    gsap.set(b, { x: 0 });
    const r = b.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    gsap.set(b, { x: r.left < 8 ? 8 - r.left : r.right > vw - 8 ? vw - 8 - r.right : 0 });
    const tl = gsap
      .timeline({ onComplete: () => setLine(null) })
      .fromTo(b, { autoAlpha: 0, y: 10, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: reduce ? 0 : 0.4, ease: 'back.out(2)' })
      .to(b, { autoAlpha: 0, y: -6, duration: reduce ? 0 : 0.3 }, `+=${Math.min(7, 2.5 + line.length / 22)}`);
    return () => void tl.kill();
  }, [line]);

  // three.js scene + behaviour.
  useEffect(() => {
    if (!name || name === 'off') return;
    const canvas = canvasRef.current;
    const w = wrap.current;
    const hopEl = hop.current;
    if (!canvas || !w || !hopEl) return;
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
      scene.add(new THREE.HemisphereLight(0xfff4e6, 0x3a2f25, 2.4));
      const sun = new THREE.DirectionalLight(0xffffff, 1.8);
      sun.position.set(2, 4, 3);
      scene.add(sun);

      const gltf = await new GLTFLoader().loadAsync(`/buddy/character-${name}.glb`);
      if (disposed) return;
      const model = gltf.scene;
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
          if (current && current !== next) next.crossFadeFrom(current, 0.25, false);
          next.play();
          current = next;
          if (!once) return resolve();
          const done = (e: { action: AnimationAction }) => {
            if (e.action !== next) return;
            mixer.removeEventListener('finished', done);
            resolve();
          };
          mixer.addEventListener('finished', done);
        });
      play('idle');

      // ---- look-at: head offset applied on top of whatever the animation does ----
      const look = { x: 0, y: 0, tx: 0, ty: 0 };
      const applied = { x: 0, y: 0 };
      const tick = (_t: number, dtMs: number) => {
        if (document.hidden) return;
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
      gsap.ticker.add(tick);
      track(gsap.fromTo(w, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }));

      const reduce = prefersReducedMotion();
      const face = (dir: number) =>
        track(gsap.to(model.rotation, { y: dir > 0 ? Math.PI / 2 : dir < 0 ? -Math.PI / 2 : 0, duration: 0.3, ease: 'power2.out', overwrite: true }));
      const sleep = (s: number) => new Promise<void>((r) => track(gsap.delayedCall(s, r)));
      const maxX = () => window.innerWidth - size - (window.innerWidth < 640 ? 76 : 100);
      const xNow = () => gsap.getProperty(w, 'x') as number;
      gsap.set(w, { x: rand(16, Math.max(16, maxX())) });

      // An interruptible walk: resolves when it arrives OR when the mouse interrupts it.
      let stopWalk: (() => void) | null = null;
      const walkTo = (to: number, speed: number, clip: 'walk' | 'sprint') =>
        new Promise<void>((resolve) => {
          const from = xNow();
          face(Math.sign(to - from));
          play(clip);
          const tween = track(gsap.to(w, { x: to, duration: Math.abs(to - from) / speed, ease: 'none', onComplete: () => finish() }));
          const finish = () => {
            tween.kill();
            stopWalk = null;
            resolve();
          };
          stopWalk = finish;
        });

      const jump = async () => {
        play('jump', true);
        await track(gsap.timeline().to(hopEl, { y: -46, duration: 0.32, ease: 'power2.out' }).to(hopEl, { y: 0, duration: 0.38, ease: 'bounce.out' }));
      };

      // ---- mouse awareness ----
      const ctl = { near: false, busy: false, nearSince: 0, saidNear: false, lastDodge: 0 };
      const mouse = { x: -1e4, y: -1e4 };
      const center = () => {
        const r = canvas.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height * 0.4 };
      };
      const updateLook = () => {
        if (!ctl.near) {
          look.tx = look.ty = 0;
          return;
        }
        const c = center();
        look.ty = clamp(Math.atan2(mouse.x - c.x, 320), -0.9, 0.9); // turn head left/right
        look.tx = clamp((mouse.y - c.y) / 420, -0.55, 0.3); // tilt up/down
      };

      const onNear = async () => {
        ctl.busy = true;
        stopWalk?.();
        play('idle');
        face(0); // look out at the screen first…
        await sleep(0.45);
        if (!ctl.near || disposed) return void (ctl.busy = false);
        updateLook(); // …then at the mouse
        ctl.busy = false;
      };

      const dodge = async () => {
        const now = performance.now();
        if (ctl.busy || now - ctl.lastDodge < 1200) return;
        if (Math.random() > 0.65) return; // sometimes it stands its ground (so it can be clicked)
        ctl.lastDodge = now;
        ctl.busy = true;
        stopWalk?.();
        look.tx = look.ty = 0;
        const c = center();
        const away = mouse.x < c.x ? 1 : -1;
        const to = clamp(xNow() + away * rand(160, 260), 16, Math.max(16, maxX()));
        if (Math.random() < 0.5) setLine(pickRandom(['Whoa! Personal space!', 'Nope nope nope.', 'Too close!', 'Can’t catch me!']));
        await jump();
        await walkTo(to, 230, 'sprint');
        face(0);
        play('idle');
        ctl.busy = false;
        updateLook();
      };

      let raf = 0;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
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
            if (!ctl.saidNear && performance.now() - ctl.nearSince > 2500) {
              ctl.saidNear = true;
              setLine((l) => l ?? pickRandom(nearby));
            }
          }
        });
      };
      if (isFinePointer() && !reduce) window.addEventListener('pointermove', onMove, { passive: true });

      api.current = {
        poke: () => {
          unlock('buddy');
          setLine(pickRandom(pokes));
          if (!ctl.busy) jump().then(() => play('idle'));
        },
        dodge,
      };

      // Talk every so often.
      const talk = () => {
        if (disposed) return;
        setLine((l) => l ?? pickRandom(all));
        track(gsap.delayedCall(rand(10, 18), talk));
      };
      track(gsap.delayedCall(rand(3, 6), talk));

      cleanups.push(() => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
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

      // Wander: walk, sprint, jump, emote, sit, or just stand there. Pauses while the mouse is near.
      while (!disposed && !reduce) {
        if (ctl.near || ctl.busy) {
          await sleep(0.3);
          continue;
        }
        const r = Math.random();
        if (r < 0.45) {
          const to = rand(16, Math.max(16, maxX()));
          if (Math.abs(to - xNow()) > 40) {
            const sprint = Math.random() < 0.3;
            await walkTo(to, sprint ? 190 : 75, sprint ? 'sprint' : 'walk');
            if (!ctl.near && !ctl.busy) {
              face(0);
              play('idle');
            }
          }
        } else if (r < 0.6) {
          await jump();
          play('idle');
        } else if (r < 0.72) {
          await play(Math.random() < 0.5 ? 'emote-yes' : 'emote-no', true);
          play('idle');
        } else if (r < 0.8) {
          play('sit');
          await sleep(rand(2.5, 4.5));
          if (!ctl.near) play('idle');
        }
        await sleep(rand(1.5, 4));
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
    };
  }, [name]);

  if (!name || name === 'off') return null;

  return (
    <div ref={wrap} className="pointer-events-none fixed bottom-0 left-0 z-[38]" style={{ visibility: 'hidden' }}>
      <div
        ref={bubbleRef}
        role="status"
        aria-live="polite"
        className="pointer-events-auto absolute bottom-[calc(100%-6px)] left-1/2 w-max max-w-[min(17rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-line bg-surface px-3.5 py-2.5 text-xs leading-snug text-fg shadow-xl shadow-black/30 sm:text-sm"
        style={{ visibility: 'hidden' }}
      >
        {line}
        <span aria-hidden="true" className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-line bg-surface" />
      </div>
      <div ref={hop} className="group relative">
        <canvas
          ref={canvasRef}
          data-cursor="link"
          onClick={() => api.current?.poke()}
          onPointerEnter={(e) => e.pointerType === 'mouse' && api.current?.dodge()}
          className="pointer-events-auto block h-[84px] w-[84px] sm:h-[120px] sm:w-[120px]"
          aria-label="Your roaming buddy. Click to say hi."
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
