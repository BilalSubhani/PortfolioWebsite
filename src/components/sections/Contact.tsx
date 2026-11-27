import { profile, socials } from '@/content/profile';
import ContactForm from '../contact/ContactForm';
import SectionHeading from '../ui/SectionHeading';
import SocialIcon from '../ui/SocialIcon';

export default function Contact({ headingLevel = 'section' }: { headingLevel?: 'section' | 'page' }) {
  return (
    <section id="contact" className="section-y" aria-labelledby="contact-title">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="contact-title"
              as={headingLevel === 'page' ? 'h1' : 'h2'}
              eyebrow={headingLevel === 'page' ? 'Contact' : '09 — Contact'}
              title="Let’s build something that holds up."
              intro="Hiring, freelance work or a collaboration: pick what it’s about and send a message, or reach me directly."
            />
            <ul className="space-y-2" data-reveal>
              {socials.map((s) => (
                <li key={s.key} data-perch>
                  <a
                    href={s.href}
                    {...(s.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="group flex items-center gap-4 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-line hover:bg-surface"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors group-hover:border-accent group-hover:text-accent">
                      <SocialIcon name={s.key} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs text-muted">{s.label}</span>
                      <span className="block truncate text-sm text-fg">{s.handle}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 px-3 text-sm text-muted" data-reveal>
              {profile.location} · {profile.availability}
            </p>
          </div>
          <div data-reveal>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
