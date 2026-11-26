import { useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { profile, socials } from '../../data/profile';
import './Contact.scss';

type Field = 'name' | 'email' | 'message';
type Values = Record<Field, string>;

const EMPTY: Values = { name: '', email: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = 'Name is required';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters';

  if (!email) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email';

  if (!message) errors.message = 'Message is required';
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters';

  return errors;
}

export default function Contact() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  const errors = validate(values);
  const showError = (field: Field) => touched[field] && errors[field];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      setTouched({ name: true, email: true, message: true });
      return;
    }

    setIsSubmitting(true);
    setFormError(false);
    try {
      // Netlify Forms: posts to the hidden "contact" form declared in index.html.
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'contact', ...values }).toString(),
      });
      if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
      setSubmitted(true);
      setValues(EMPTY);
      setTouched({});
    } catch (err) {
      console.error(err);
      setFormError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>

        <div className="contact-container">
          <div className="contact-info">
            <h3>Let's Connect</h3>
            <p>
              I'm open to full-time roles (on-site in Lahore or remote) and freelance work. If you need someone to
              build a product, scale a backend or lead a team, feel free to reach out.
            </p>

            <div className="contact-details">
              <a className="contact-item" href={`mailto:${profile.email}`}>
                <i className="fas fa-envelope" />
                <span>{profile.email}</span>
              </a>
              <a className="contact-item" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
                <i className="fas fa-phone" />
                <span>{profile.phone}</span>
              </a>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt" />
                <span>
                  {profile.location} ({profile.availability.toLowerCase()})
                </span>
              </div>
            </div>

            <div className="social-links">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="contact-form">
            {submitted ? (
              <div className="form-success">
                <i className="fas fa-check-circle" />
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. I'll get back to you as soon as possible.</p>
                <button className="btn-primary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form name="contact" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={showError('name') ? 'invalid' : ''}
                  />
                  {showError('name') && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={showError('email') ? 'invalid' : ''}
                  />
                  {showError('email') && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={showError('message') ? 'invalid' : ''}
                  />
                  {showError('message') && <div className="error-message">{errors.message}</div>}
                </div>

                {formError && (
                  <div className="form-error">
                    <p>There was an error sending your message. Please try again.</p>
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin" /> Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
