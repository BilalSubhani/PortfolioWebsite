import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaGithub, FaNpm } from 'react-icons/fa6';
import { LuArrowLeft, LuArrowRight, LuArrowUpRight, LuGlobe } from 'react-icons/lu';
import JsonLd from '@/components/ui/JsonLd';
import Lens from '@/components/ui/Lens';
import SplitHeading from '@/components/ui/SplitHeading';
import { profile } from '@/content/profile';
import { getProject, projects } from '@/content/projects';
import { projectJsonLd } from '@/lib/seo';

// Every case study is pre-rendered at build time (SSG); unknown slugs 404.
export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — case study`,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { type: 'article', url: `/projects/${p.slug}`, title: `${p.title} · ${profile.name}`, description: p.summary },
    twitter: { card: 'summary_large_image', title: p.title, description: p.summary },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.indexOf(p);
  const next = projects[(idx + 1) % projects.length];
  const cs = p.caseStudy;

  const links = [
    p.links.npm && { href: p.links.npm, label: 'View on npm', icon: <FaNpm className="h-5 w-5" /> },
    p.links.github && { href: p.links.github, label: 'Source on GitHub', icon: <FaGithub className="h-4 w-4" /> },
    p.links.live && { href: p.links.live, label: 'Visit site', icon: <LuGlobe className="h-4 w-4" /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <article className="pt-32 sm:pt-40">
      <JsonLd data={projectJsonLd(p)} />
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted" data-reveal="fade">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-accent">
                home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/projects" className="hover:text-accent">
                projects
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">
              {p.slug}
            </li>
          </ol>
        </nav>

        <header className="mt-10 grid gap-10 border-b border-line pb-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2" data-reveal="fade">
              <span className="chip">{p.category}</span>
              <span className="chip border-ok/40 text-ok">{p.status}</span>
            </div>
            <SplitHeading as="h1" immediate text={p.title} className="mt-6 text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.98] font-semibold break-words" />
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted" data-reveal>
              <Lens dev={p.summary} plain={p.summaryPlain} />
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end" data-reveal>
            {links.map((l, i) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={i === 0 ? 'btn-primary' : 'btn-ghost'}>
                {l.icon} {l.label} <LuArrowUpRight className="h-4 w-4" />
              </a>
            ))}
          </div>
        </header>

        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start" data-reveal="left">
            <div>
              <p className="eyebrow mb-3">Stack</p>
              <ul className="flex flex-wrap gap-2">
                {p.stack.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-3">My role</p>
              <p className="text-sm leading-relaxed text-muted">{cs.role}</p>
            </div>
          </aside>

          <div className="space-y-14">
            <Block n="01" title="The problem">
              <p>{cs.problem}</p>
            </Block>
            <Block n="02" title="The approach">
              <p>{cs.approach}</p>
            </Block>
            <Block n="03" title="What it does">
              <ul className="space-y-3">
                {cs.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </Block>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-12 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/projects" className="btn-ghost w-fit">
            <LuArrowLeft className="h-4 w-4" /> All projects
          </Link>
          <Link href={`/projects/${next.slug}`} className="group flex items-center gap-4 text-right sm:justify-end">
            <span>
              <span className="block font-mono text-xs text-muted">Next project</span>
              <span className="block font-display text-xl font-semibold group-hover:text-accent sm:text-2xl">{next.title}</span>
            </span>
            <LuArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section data-reveal>
      <p className="font-mono text-xs text-accent">{n}</p>
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
      <div className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{children}</div>
    </section>
  );
}
