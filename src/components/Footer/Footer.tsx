import { navLinks, profile, socials } from '../../data/profile';
import './Footer.scss';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>{profile.name}</h3>
            <p>{profile.headline}</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`}>{link.label.replace(' Me', '')}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-social">
            <h4>Connect</h4>
            <div className="social-icons">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <i className={s.icon} />
                </a>
              ))}
              <a href={`mailto:${profile.email}`} aria-label="Email">
                <i className="fas fa-envelope" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} {profile.name}. All Rights Reserved.</p>
          <button
            className="scroll-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to Top"
          >
            <i className="fas fa-arrow-up" />
          </button>
        </div>
      </div>
    </footer>
  );
}
