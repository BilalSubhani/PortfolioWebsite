'use client';

import { useRef, useState } from 'react';
import { LuArrowRight, LuCheck, LuLoaderCircle } from 'react-icons/lu';
import { contactSchema, PURPOSES } from '@/lib/contact';
import { cn } from '@/lib/cn';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

type Field = 'name' | 'email' | 'purpose' | 'company' | 'budget' | 'message';
type Values = Record<Field, string>;
const EMPTY: Values = { name: '', email: '', purpose: '', company: '', budget: '', message: '' };

// Submits to Netlify Forms via the static form definition in /public/__forms.html.
export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const root = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const showBudget = values.purpose === 'Freelance';

  useGSAP(
    () => {
      const el = budgetRef.current;
      if (!el) return;
      const d = prefersReducedMotion() ? 0 : 0.45;
      if (showBudget) gsap.fromTo(el, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: d, ease: 'power3.out' });
      else gsap.to(el, { height: 0, autoAlpha: 0, duration: d * 0.7, ease: 'power2.in' });
    },
    { scope: root, dependencies: [showBudget] },
  );

  useGSAP(
    () => {
      if (status !== 'sent' || prefersReducedMotion()) return;
      gsap
        .timeline()
        .from('[data-success-icon]', { scale: 0, rotate: -90, duration: 0.6, ease: 'back.out(2.5)' })
        .from('[data-success-text]', { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.5 }, '-=0.2');
    },
    { scope: root, dependencies: [status] },
  );

  const set = (k: Field, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const shake = () => {
    if (prefersReducedMotion()) return;
    gsap.fromTo('[data-form-card]', { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get('bot-field')) return; // honeypot

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as Field] ??= issue.message;
      setErrors(errs);
      shake();
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const body = new URLSearchParams({ 'form-name': 'contact', ...parsed.data, company: parsed.data.company ?? '', budget: showBudget ? (parsed.data.budget ?? '') : '' });
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setValues(EMPTY);
    } catch {
      setStatus('error');
      shake();
    }
  };

  const input =
    'w-full rounded-xl border border-line bg-bg px-4 py-3 text-base text-fg placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none sm:text-sm';

  return (
    <div ref={root}>
      <div data-form-card data-glow className="card p-5 sm:p-8">
        {status === 'sent' ? (
          <div className="py-10 text-center" role="status">
            <span data-success-icon className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-fg">
              <LuCheck className="h-8 w-8" />
            </span>
            <h3 data-success-text className="mt-6 text-2xl font-semibold">
              Message sent.
            </h3>
            <p data-success-text className="mx-auto mt-2 max-w-sm text-muted">
              Thanks for reaching out — I’ll get back to you soon.
            </p>
            <button data-success-text type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-8">
              Send another
            </button>
          </div>
        ) : (
          <form name="contact" onSubmit={onSubmit} noValidate className="space-y-6">
            <p className="hidden">
              <label>
                Don’t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <fieldset>
              <legend className="mb-3 text-sm font-medium">What’s this about?</legend>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-describedby={errors.purpose ? 'e-purpose' : undefined}>
                {PURPOSES.map((p, i) => (
                  <label key={p} className="cursor-pointer">
                    <input
                      id={i === 0 ? 'f-purpose' : undefined}
                      type="radio"
                      name="purpose"
                      value={p}
                      checked={values.purpose === p}
                      onChange={() => set('purpose', p)}
                      className="peer sr-only"
                    />
                    <span className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm text-muted transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-accent">
                      {p}
                    </span>
                  </label>
                ))}
              </div>
              {errors.purpose && <ErrorText id="e-purpose" text={errors.purpose} />}
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldWrap id="name" label="Name" error={errors.name}>
                <input id="f-name" name="name" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} className={cn(input, errors.name && 'border-err')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} maxLength={100} />
              </FieldWrap>
              <FieldWrap id="email" label="Email" error={errors.email}>
                <input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(e) => set('email', e.target.value)} className={cn(input, errors.email && 'border-err')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} maxLength={200} />
              </FieldWrap>
              <FieldWrap id="company" label="Company" optional>
                <input id="f-company" name="company" autoComplete="organization" value={values.company} onChange={(e) => set('company', e.target.value)} className={input} maxLength={120} />
              </FieldWrap>
              <div ref={budgetRef} className="overflow-hidden" style={{ height: 0, visibility: 'hidden' }}>
                <FieldWrap id="budget" label="Budget" optional>
                  <input id="f-budget" name="budget" placeholder="e.g. $2–5k" value={values.budget} onChange={(e) => set('budget', e.target.value)} className={input} maxLength={60} tabIndex={showBudget ? 0 : -1} />
                </FieldWrap>
              </div>
            </div>

            <FieldWrap id="message" label="Message" error={errors.message}>
              <textarea id="f-message" name="message" rows={5} value={values.message} onChange={(e) => set('message', e.target.value)} className={cn(input, 'resize-y', errors.message && 'border-err')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-message' : undefined} maxLength={4000} />
            </FieldWrap>

            {status === 'error' && (
              <p role="alert" className="rounded-xl border border-err/40 bg-err/10 px-4 py-3 text-sm text-err">
                Something went wrong sending that. Please try again, or email me directly.
              </p>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full sm:w-auto disabled:opacity-70">
              {status === 'sending' ? (
                <>
                  <LuLoaderCircle className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send message <LuArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function FieldWrap({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="mb-2 flex items-baseline justify-between text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-muted">optional</span>}
      </label>
      {children}
      {error && <ErrorText id={`e-${id}`} text={error} />}
    </div>
  );
}

const ErrorText = ({ id, text }: { id: string; text: string }) => (
  <p id={id} className="mt-2 text-xs text-err">
    {text}
  </p>
);
