import Hero from '@/components/hero/Hero';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Experience from '@/components/sections/Experience';
import Faq from '@/components/sections/Faq';
import Lab from '@/components/sections/Lab';
import Reasons from '@/components/sections/Reasons';
import Skills from '@/components/sections/Skills';
import TerminalSection from '@/components/sections/TerminalSection';
import Work from '@/components/sections/Work';
import JsonLd from '@/components/ui/JsonLd';
import SectionHeading from '@/components/ui/SectionHeading';
import MergeController from '@/components/providers/MergeController';
import { homeJsonLd } from '@/lib/seo';

// Statically generated at build time (SSG); interactive parts hydrate on the client.
export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <MergeController />
      <div data-merge-stack>
      <Hero />
      <About />
      <Reasons />
      <Lab />
      <Skills />
      <Work />
      <Experience />
      <TerminalSection />
      <section id="faq" className="section-y" aria-labelledby="faq-title">
        <div className="container-x">
          <SectionHeading id="faq-title" eyebrow="08 — Quick answers" title="The short version." />
          <Faq />
        </div>
      </section>
      <Contact />
      </div>
    </>
  );
}
