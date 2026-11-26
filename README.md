# Bilal Subhani — Portfolio

Personal portfolio site for Bilal Subhani, Full-Stack Software Engineer and Team Lead.
Live at [bilalsubhani.com](https://bilalsubhani.com).

## Stack

- React 19 + TypeScript
- Vite
- SCSS
- Netlify (hosting + Netlify Forms for the contact form)

## Getting started

```bash
npm install
npm run dev       # dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

## Editing content

All site content lives in `src/data/`:

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, headline, summary, hero stats, contact details, social links, resume link |
| `skills.ts` | Skill categories shown in the Skills section |
| `experience.ts` | Work history and education. Wrap text in `**double asterisks**` to bold it |
| `projects.ts` | Open-source packages and frontend/backend projects |

## Contact form

The contact form posts to Netlify Forms. The hidden `<form name="contact">` in `index.html`
lets Netlify detect the form at deploy time; keep its fields in sync with
`src/components/Contact/Contact.tsx`. Submissions only work on the deployed site, not on the local dev server.
