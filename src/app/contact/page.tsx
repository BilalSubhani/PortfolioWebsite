import type { Metadata } from 'next';
import Contact from '@/components/sections/Contact';
import JsonLd from '@/components/ui/JsonLd';
import { profile } from '@/content/profile';
import { breadcrumbs, person } from '@/lib/seo';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contact ${profile.name} about full-time roles, freelance projects or collaborations. Based in ${profile.location}, open to remote work.`,
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact', title: `Contact ${profile.name}` },
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'ContactPage', name: `Contact ${profile.name}`, mainEntity: person },
            breadcrumbs([
              { name: 'Home', path: '' },
              { name: 'Contact', path: '/contact' },
            ]),
          ],
        }}
      />
      <Contact headingLevel="page" />
    </div>
  );
}
