import { useEffect, useState } from 'react';
import { profile, socials } from '../../data/profile';
import { scrollToSection } from '../../utils/scroll';
import './Hero.scss';

const TYPE_SPEED = 90;
const DELETE_SPEED = 45;
const HOLD_MS = 1800;

function useTypewriter(words: string[]) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    let delay = deleting ? DELETE_SPEED : TYPE_SPEED;

    if (!deleting && text === word) delay = HOLD_MS;

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === '') {
        setDeleting(false);
        setWordIndex((i) => i + 1);
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, wordIndex, words]);

  return text;
}

export default function Hero() {
  const typed = useTypewriter(profile.roles);

  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="animate-in">{profile.name}</h1>
            <h2 className="typewriter" aria-label={profile.headline}>
              <span aria-hidden="true">{typed}</span>
              <span className="cursor" aria-hidden="true" />
            </h2>
            <p className="animate-in">{profile.summary}</p>

            <div className="hero-buttons animate-in">
              <button className="btn-primary" onClick={() => scrollToSection('contact')}>
                Hire Me
              </button>
              <a
                className="btn-secondary"
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Resume
              </a>
            </div>

            <div className="social-links animate-in">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="hero-image animate-in">
            <div className="image-container">
              <div className="shape-blob" />
              <div className="shape-blob-2" />
              <div className="dev-illustration">
                <i className="fas fa-laptop-code" />
              </div>
            </div>
          </div>
        </div>

        <ul className="hero-stats animate-in">
          {profile.stats.map((s) => (
            <li key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
