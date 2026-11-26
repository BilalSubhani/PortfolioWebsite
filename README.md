# Bilal Subhani — Portfolio

Personal portfolio for Bilal Subhani, Full-Stack Software Engineer and Team Lead.
Live at [bilalsubhani.com](https://bilalsubhani.com).

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind CSS v4** with warm matte dark / ivory light design tokens
- **GSAP** + ScrollTrigger for all motion, **Lenis** for smooth scrolling
- **Zod** for contact-form validation, **Netlify Forms** for submissions
- Hosted on **Netlify** (Next.js runtime is detected automatically)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes are statically generated)
npm run start      # serve the production build
npm run typecheck
```

Requires Node.js 20.9+.

## Editing content

Everything the site says lives in `src/content/` — components only render it:

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, intro, hero lines, stats, socials, resume link, "Why reach out" reasons |
| `experience.ts` | Jobs (kept short; detail is in the resume) and Sidequests |
| `skills.ts` | Skills IDE files. Evidence labels are derived from `usedIn` — only reference real work |
| `projects.ts` | Projects and their case studies |
| `misc.ts` | Footer quotes and the FAQ (shown on the page *and* emitted as FAQPage JSON-LD) |

The terminal, `llms.txt`, structured data and metadata all read from these files, so they never drift.

## Rendering

| Route | Strategy |
| --- | --- |
| `/`, `/projects`, `/contact` | Static (prerendered at build) |
| `/projects/[slug]` | SSG via `generateStaticParams`; unknown slugs 404 |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/llms.txt`, OG images | Static |

Interactive pieces (terminal, skills IDE, hero canvas, animations) are client components that hydrate on top of the static HTML. The hero canvas is loaded dynamically.

## SEO / AEO

- Per-page metadata, canonical URLs, Open Graph + Twitter cards, generated OG images
- JSON-LD: `Person`, `WebSite`, `ProfilePage`, `FAQPage`, `SoftwareSourceCode`, `ItemList`, `BreadcrumbList`
- `sitemap.xml`, `robots.txt`, web manifest, Google site verification
- `/llms.txt` — plain-text profile for AI assistants and answer engines

## Terminal

`src/lib/terminal.ts` is a pure command parser over the content files. It never runs shell
commands, never fetches URLs and never evaluates input. Open it with **Ctrl/⌘ K**, the **`** key,
or the floating button. Natural-language questions are answered offline by keyword matching
against approved content; an AI provider can be plugged in later behind a rate-limited route handler.

## Contact form

Posts to Netlify Forms through the static form definition in `public/__forms.html`. Keep that file's
fields in sync with `src/components/contact/ContactForm.tsx`. Submissions only work on the deployed site.

## Security

Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP) are set in
`next.config.ts`. There are no API routes, so there is no server-side attack surface yet.
