// Structured data (JSON-LD) builders for search and answer engines.
import { faq } from '@/content/misc';
import { profile, SITE_URL, socials } from '@/content/profile';
import type { Project } from '@/content/projects';
import { allSkills } from '@/content/skills';

const personId = `${SITE_URL}/#person`;
const websiteId = `${SITE_URL}/#website`;

export const person = {
  '@type': 'Person',
  '@id': personId,
  name: profile.name,
  url: SITE_URL,
  jobTitle: profile.role,
  description: profile.intro,
  email: `mailto:${profile.email}`,
  worksFor: { '@type': 'Organization', name: profile.currentCompany },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'FAST National University of Computer and Emerging Sciences (FAST NUCES)' },
  address: { '@type': 'PostalAddress', addressLocality: 'Lahore', addressCountry: 'PK' },
  knowsAbout: allSkills.map((s) => s.name),
  knowsLanguage: ['English', 'Urdu'],
  sameAs: socials.filter((s) => s.key !== 'email').map((s) => s.href),
};

export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': websiteId, url: SITE_URL, name: profile.name, inLanguage: 'en', publisher: { '@id': personId } },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: `${profile.name} — ${profile.role}`,
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': personId },
      },
      person,
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  };
}

export function projectJsonLd(p: Project) {
  const url = `${SITE_URL}/projects/${p.slug}`;
  const node =
    p.category === 'Open source'
      ? {
          '@type': 'SoftwareSourceCode',
          name: p.title,
          description: p.summary,
          url,
          programmingLanguage: p.stack,
          ...(p.links.npm && { downloadUrl: p.links.npm, codeRepository: p.links.github ?? p.links.npm }),
          author: { '@id': personId },
        }
      : {
          '@type': 'WebSite',
          name: p.title,
          description: p.summary,
          url: p.links.live ?? url,
          author: { '@id': personId },
        };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      node,
      breadcrumbs([
        { name: 'Home', path: '' },
        { name: 'Projects', path: '/projects' },
        { name: p.title, path: `/projects/${p.slug}` },
      ]),
    ],
  };
}

// Serialise safely for a <script type="application/ld+json"> tag.
export const toJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
