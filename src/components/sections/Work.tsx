import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';
import { projects } from '@/content/projects';
import ProjectCard from '../projects/ProjectCard';
import SectionHeading from '../ui/SectionHeading';

export default function Work() {
  const featured = projects.filter((p) => p.featured);
  return (
    <section id="work" className="section-y" aria-labelledby="work-title">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="work-title"
            eyebrow="05 — Selected work"
            title="Open source, and the site you’re on."
            intro="Packages I designed and published from scratch, plus this portfolio. Client and company work is covered in the resume."
          />
        </div>
        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <li key={p.slug} data-reveal="up" className={i === 0 ? 'md:col-span-2' : ''}>
              <ProjectCard project={p} index={i} large={i === 0} />
            </li>
          ))}
        </ul>
        <div className="mt-10" data-reveal>
          <Link href="/projects" className="btn-ghost">
            All projects <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
