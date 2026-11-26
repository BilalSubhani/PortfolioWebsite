import type { Metadata } from 'next';
import ProjectCard from '@/components/projects/ProjectCard';
import JsonLd from '@/components/ui/JsonLd';
import SectionHeading from '@/components/ui/SectionHeading';
import { profile, SITE_URL } from '@/content/profile';
import { projects } from '@/content/projects';
import { breadcrumbs } from '@/lib/seo';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Projects',
  description: `Open-source npm packages and projects by ${profile.name}: @live-tabs/next, verlux, envcanary, currency-icon-map and this portfolio.`,
  alternates: { canonical: '/projects' },
  openGraph: { url: '/projects', title: `Projects · ${profile.name}` },
};

export default function ProjectsPage() {
  return (
    <section className="section-y pt-36 sm:pt-40" aria-labelledby="projects-title">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'ItemList',
              name: `Projects by ${profile.name}`,
              itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/projects/${p.slug}`, name: p.title })),
            },
            breadcrumbs([
              { name: 'Home', path: '' },
              { name: 'Projects', path: '/projects' },
            ]),
          ],
        }}
      />
      <div className="container-x">
        <SectionHeading
          as="h1"
          id="projects-title"
          eyebrow="Projects"
          title="Things I’ve built and shipped."
          intro="Open-source packages I designed and published from scratch, and the site you’re on. Company and client work lives in the resume."
        />
        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.slug} data-reveal="up">
              <ProjectCard project={p} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
