# Karthik Kumar Bogadi - Portfolio

React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion portfolio, built on the same stack and structure as the reference portfolio (arjunpolenwar.me).

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build and preview

```bash
npm run build
npm run preview
npm run lint
```

## Optional configuration

Copy `.env.example` to `.env`.

- `VITE_EMAILJS_*` - enables direct sending from the contact form. Without it, the form opens the visitor's email client (mailto:).
- `VITE_GA_TRACKING_ID` - enables Google Analytics. Leave empty to disable.

## Where to edit content

| What | File |
| --- | --- |
| Name, headline, typed lines, social links | `src/components/HeroSection.tsx` |
| About text, skills, orbit planets, highlights | `src/components/AboutSection.tsx` |
| "Most days, I..." section | `src/components/HobbiesSection.tsx` |
| Projects (titles, links, tech) | `src/components/ProjectsSection.tsx` (`projectData`) |
| Achievements, LeetCode numbers | `src/components/BlogSection.tsx` |
| Contact details, form | `src/components/ContactSection.tsx`, `src/config/emailjs.ts` |
| Resume | `public/Karthik_Kumar_Bogadi_Resume.pdf` |
| Profile photo | `public/profile-photo.jpg`, `public/profile-photo-about.jpg` |

## Deploy

**Netlify:** connect the repo; `netlify.toml` already sets `npm run build`, publish `dist`, and SPA redirects. Add the env vars above in Site settings if you use them.

**Vercel:** import the repo, framework preset Vite, build `npm run build`, output `dist`.
