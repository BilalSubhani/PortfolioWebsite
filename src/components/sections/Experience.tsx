'use client';

import { useRef } from 'react';
import { LuArrowUpRight, LuCode, LuMegaphone, LuSparkles } from 'react-icons/lu';
import { experiences, sidequests } from '@/content/experience';
import { profile } from '@/content/profile';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import Lens from '../ui/Lens';
import SectionHeading from '../ui/SectionHeading';

const ICON = { code: LuCode, megaphone: LuMegaphone, sparkles: LuSparkles };

export default function Experience() {
  const timeline = useRef<HTMLOListElement>(null);

  // The timeline line draws itself as you scroll; each node lights up as it's reached.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '[data-line-fill]',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: timeline.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 } },
      );
      gsap.utils.toArray<HTMLElement>('[data-node]').forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0.3, autoAlpha: 0.3 },
          { scale: 1, autoAlpha: 1, ease: 'back.out(3)', duration: 0.5, scrollTrigger: { trigger: node, start: 'top 65%', toggleActions: 'play none none reverse' } },
        );
      });
    },
    { scope: timeline },
  );

  return (
    <section id="experience" className="section-y" aria-labelledby="experience-title">
      <div className="container-x">
        <SectionHeading id="experience-title" eyebrow="06 — Experience" title="Where I’ve been building." />

        <ol ref={timeline} className="relative">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line lg:left-[calc(28%+7px)]" />
          <span aria-hidden="true" data-line-fill className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-accent lg:left-[calc(28%+7px)]" />
          {experiences.map((e) => (
            <li key={e.id} className="relative grid gap-4 pb-14 pl-10 last:pb-0 lg:grid-cols-[28%_minmax(0,1fr)] lg:gap-0 lg:pl-0">
              <span
                aria-hidden="true"
                data-node
                className="absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-2 border-accent bg-accent lg:left-[28%]"
              />
              <div className="lg:pr-12" data-reveal="left">
                <p className="font-mono text-xs text-accent">{e.period}</p>
                <p className="mt-1 text-sm text-muted">{e.location}</p>
              </div>
              <div className="lg:pl-12" data-reveal>
                <h3 className="text-2xl font-semibold">{e.company}</h3>
                <p className="mt-1 text-accent">{e.role}</p>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                  <Lens dev={e.summary} plain={e.summaryPlain} />
                </p>
                {(['dev', 'plain'] as const).map((lens) => (
                  <ul key={lens} className={`lens-${lens} mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3`}>
                    {(lens === 'dev' ? e.wins : e.winsPlain).map((w) => (
                      <li key={w} className="rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-snug">
                        {w}
                      </li>
                    ))}
                  </ul>
                ))}
                <ul className="lens-dev mt-4 flex flex-wrap gap-2" aria-label="Technologies">
                  {e.stack.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-line p-5 sm:p-6" data-reveal>
          <p className="flex-1 text-sm text-muted sm:text-base">
            This is the short version. Dates, projects and every number are in the resume.
          </p>
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Read the full resume <LuArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Side Quests */}
        <div id="side-quests" className="mt-24 scroll-mt-24">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-2xl font-semibold sm:text-3xl" data-reveal>
              Side Quests
            </h3>
            <p className="font-mono text-xs text-muted" data-reveal="fade">
              before full-time engineering
            </p>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {sidequests.map((s) => {
              const Icon = ICON[s.icon];
              return (
                <li key={s.id} data-glow className="card flex flex-col p-6" data-reveal="scale">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[11px] text-muted">{s.period}</span>
                  </div>
                  <h4 className="mt-6 font-display text-lg font-semibold">{s.org}</h4>
                  <p className="text-sm text-accent">{s.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{s.note}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
