import { profile } from '@/content/profile';
import StackMap from '../about/StackMap';
import SectionHeading from '../ui/SectionHeading';

const facts = [
  { k: 'Based in', v: `${profile.location} · open to remote` },
  { k: 'Currently', v: `Team Lead at ${profile.currentCompany}` },
  { k: 'Studied', v: `${profile.education.degree}, ${profile.education.school}` },
  { k: 'English', v: profile.english },
];

export default function About() {
  return (
    <section id="about" className="section-y" aria-labelledby="about-title">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <SectionHeading id="about-title" eyebrow="01 — About" title="Most of my work is making things hold up under real load." />
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted sm:text-lg lg:pt-12">
            <p data-reveal>
              I studied Electrical Engineering at FAST NUCES with a specialisation in computer engineering, then moved into software through the
              MERN stack.
            </p>
            <p data-reveal>
              At Tech Hype I went from intern to junior developer and helped launch the Pakistan Food Portal. At Clear Wave I now lead a team of
              six on a contact centre platform used by 500+ people, and build the company’s AI voice agent from the telephony layer up.
            </p>
            <p data-reveal>
              Along the way I’ve published open-source npm packages, trained 10+ junior developers and sat on 50+ technical interviews.
            </p>
            <dl data-perch className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line pt-0 sm:grid-cols-2" data-reveal>
              {facts.map((f) => (
                <div key={f.k} className="bg-bg p-4">
                  <dt className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">{f.k}</dt>
                  <dd className="mt-1 text-sm text-fg">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className="container-x mt-20 sm:mt-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4" data-reveal>
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">The stack at a glance</h3>
          <p className="font-mono text-xs text-muted">
            <span className="hidden md:inline">hover a category · click to explore</span>
            <span className="md:hidden">tap a category to explore</span>
          </p>
        </div>
        <StackMap />
      </div>
    </section>
  );
}
