import Link from 'next/link';
import { FaGithub, FaNpm } from 'react-icons/fa6';
import { LuArrowUpRight, LuGlobe } from 'react-icons/lu';
import type { Project } from '@/content/projects';
import { cn } from '@/lib/cn';
import Lens from '../ui/Lens';
import SpotlightCard from '../ui/SpotlightCard';

export default function ProjectCard({ project, index, large = false }: { project: Project; index: number; large?: boolean }) {
  const { links } = project;
  return (
    <SpotlightCard className={cn('group h-full', large && 'lg:min-h-[340px]')}>
      <article className="flex h-full flex-col p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
          <div className="flex flex-wrap justify-end gap-2">
            <span className="chip">{project.category}</span>
            <span className="chip border-ok/40 text-ok">{project.status}</span>
          </div>
        </div>

        <h3 className={cn('mt-8 font-semibold break-words', large ? 'text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05]' : 'text-2xl')}>
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:outline-none">
            {project.title}
          </Link>
        </h3>
        <p className={cn('mt-3 leading-relaxed text-muted', large ? 'max-w-xl text-base sm:text-lg' : 'text-sm sm:text-base')}><Lens dev={project.summary} plain={project.summaryPlain} /></p>

        <div className="mt-auto pt-8">
          <ul className="flex flex-wrap gap-2" aria-label="Technologies">
            {project.stack.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-5">
            <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              Case study <LuArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <span className="flex-1" />
            {links.npm && <IconLink href={links.npm} label={`${project.title} on npm`} icon={<FaNpm className="h-6 w-6" />} />}
            {links.github && <IconLink href={links.github} label={`${project.title} source on GitHub`} icon={<FaGithub className="h-4 w-4" />} />}
            {links.live && <IconLink href={links.live} label={`Visit ${project.title}`} icon={<LuGlobe className="h-4 w-4" />} />}
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}

function IconLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {icon}
    </a>
  );
}
