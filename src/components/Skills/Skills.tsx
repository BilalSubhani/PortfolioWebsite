import type { CSSProperties } from 'react';
import { skillCategories } from '../../data/skills';
import type { Skill } from '../../data/skills';
import './Skills.scss';

const MIN_ITEMS_PER_LOOP = 10;
const SECONDS_PER_ITEM = 3;

// Repeat short lists so one copy is wider than the viewport, then render two
// copies and slide by -50% for a seamless loop.
function loopItems(skills: Skill[]) {
  const times = Math.max(1, Math.ceil(MIN_ITEMS_PER_LOOP / skills.length));
  return Array.from({ length: times }, () => skills).flat();
}

export default function Skills() {
  return (
    <section id="skills" className="skills-section">
      <div className="container">
        <h2 className="section-title">My Skills</h2>
      </div>

      {skillCategories.map((category, index) => {
        const items = loopItems(category.skills);
        const style = { animationDuration: `${items.length * SECONDS_PER_ITEM}s` } as CSSProperties;
        return (
          <div className="skills-category" key={category.title}>
            <h3 className="category-title">{category.title}</h3>
            <div className="skills-slider" aria-label={`${category.title}: ${category.skills.map((s) => s.name).join(', ')}`}>
              <div className={`skills-track ${index % 2 === 0 ? 'to-right' : 'to-left'}`} style={style} aria-hidden="true">
                {[...items, ...items].map((skill, i) => (
                  <div className={`skill-card${i >= category.skills.length ? ' is-copy' : ''}`} key={i}>
                    <span className="skill-icon">
                      <i className={skill.icon} />
                    </span>
                    <span className="skill-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
