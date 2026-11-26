import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';
import { reasons } from '@/content/profile';
import Lens from '../ui/Lens';
import SectionHeading from '../ui/SectionHeading';
import SpotlightCard from '../ui/SpotlightCard';

export default function Reasons() {
  return (
    <section id="reasons" className="section-y" aria-labelledby="reasons-title">
      <div className="container-x">
        <SectionHeading
          id="reasons-title"
          eyebrow="02 — Why reach out"
          title="Reasons people get in touch."
          intro="If one of these sounds like your situation, we should talk."
        />
        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {reasons.map((r, i) => (
            <li key={r.title} data-reveal="scale">
              <SpotlightCard className="flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  <div className="text-right">
                    <p className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-none font-semibold text-accent">{r.metric}</p>
                    <p className="mt-1 text-xs text-muted">{r.metricLabel}</p>
                  </div>
                </div>
                <h3 className="mt-8 text-xl leading-snug font-semibold sm:text-2xl">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base"><Lens dev={r.body} plain={r.bodyPlain} /></p>
              </SpotlightCard>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center" data-reveal>
          <Link href="/#contact" className="btn-primary">
            Start a conversation <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
