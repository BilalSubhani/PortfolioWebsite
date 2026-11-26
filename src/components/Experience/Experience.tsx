import { education, experiences } from '../../data/experience';
import RichText from '../RichText';
import './Experience.scss';

function Highlights({ items }: { items: string[] }) {
  return (
    <ul className="highlights">
      {items.map((item) => (
        <li key={item}>
          <RichText text={item} />
        </li>
      ))}
    </ul>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <h2 className="section-title">Professional Experience</h2>

        <ol className="timeline">
          {experiences.map((exp) => (
            <li className="timeline-item" key={exp.company}>
              <article className="timeline-content">
                <header className="timeline-header">
                  <div>
                    <h3 className="company">{exp.company}</h3>
                    <p className="job-title">{exp.title}</p>
                    <p className="location">
                      <i className="fas fa-map-marker-alt" /> {exp.location}
                    </p>
                  </div>
                  <span className="date-badge">{exp.period}</span>
                </header>

                {exp.highlights && <Highlights items={exp.highlights} />}

                {exp.projects?.map((project) => (
                  <div className="sub-project" key={project.name}>
                    <h4>{project.name}</h4>
                    {project.description && <p className="sub-project-desc">{project.description}</p>}
                    {project.stack && (
                      <div className="stack">
                        {project.stack.split(', ').map((tech) => (
                          <span key={tech}>{tech}</span>
                        ))}
                      </div>
                    )}
                    <Highlights items={project.highlights} />
                  </div>
                ))}
              </article>
            </li>
          ))}
        </ol>

        <div className="education">
          <h3 className="education-heading">
            <i className="fas fa-graduation-cap" /> Education
          </h3>
          <article className="timeline-content">
            <header className="timeline-header">
              <div>
                <h3 className="company">{education.degree}</h3>
                <p className="job-title">{education.school}</p>
                <p className="location">{education.detail}</p>
              </div>
              <span className="date-badge">{education.period}</span>
            </header>
            <p className="education-extra">{education.extra}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
