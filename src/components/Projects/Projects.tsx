import { useState } from 'react';
import { projects, projectTypes } from '../../data/projects';
import type { ProjectType } from '../../data/projects';
import './Projects.scss';

export default function Projects() {
  const [activeType, setActiveType] = useState<ProjectType>('open-source');
  const visible = projects.filter((p) => p.type === activeType);
  const activeIcon = projectTypes.find((t) => t.type === activeType)?.icon;

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <h2 className="section-title">Featured Projects</h2>

        {activeType === 'open-source' && (
          <p className="projects-intro">
            4+ npm packages I designed and built from scratch, published under the Clear Wave GitHub organization.
          </p>
        )}

        <div className="project-categories" role="tablist">
          {projectTypes.map((t) => (
            <button
              key={t.type}
              role="tab"
              aria-selected={activeType === t.type}
              className={activeType === t.type ? 'active' : ''}
              onClick={() => setActiveType(t.type)}
            >
              <i className={t.icon} /> {t.label}
            </button>
          ))}
        </div>

        <div className="projects-container" key={activeType}>
          {visible.map((project) => (
            <div className="project-card" key={project.title} tabIndex={0}>
              <div className="project-card-inner">
                <div className="project-card-front">
                  <div className="project-image">
                    <i className={activeIcon} />
                  </div>
                  <h3>{project.title}</h3>
                  <div className="project-tech">
                    {project.technologies.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="project-card-back">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-links">
                    {project.npm && (
                      <a href={project.npm} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        <i className="fab fa-npm" /> View on npm
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        <i className="fab fa-github" /> View Code
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                        <i className="fas fa-external-link-alt" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
