# Anchal Sharma — Portfolio

A production-oriented, editorial portfolio foundation for an AI engineer, full-stack developer, and product builder. The frontend includes the complete home experience, a cinematic `/work` archive, reusable case studies, an editorial `/about` portrait, an interactive `/lab`, and a frontend-only `/contact` inquiry experience; it intentionally has no backend, authentication, database, API, or CMS.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use `npm run lint`, `npx tsc --noEmit`, and `npm run build` for validation.

## Architecture

- `src/app` — App Router entry, global design tokens, metadata, and robots foundation.
- `src/components/navigation` — responsive fixed navigation.
- `src/components/home` — the curated Home trailer: identity-led hero, portrait-ready frame, lazy intelligence sculpture, selected proof, capabilities, philosophy, and concise page teasers.
- `src/components/hero` — original shared hero composition retained for compatible legacy use.
- `src/components/three` — procedural React Three Fiber intelligence sculpture.
- `src/components/work` — filterable project archive and its single shared, project-reactive 3D scene.
- `src/components/case-study` — reusable editorial renderer, accessible architecture interaction, and project-aware hero scene.
- `src/components/about` — About narrative, image-ready portrait, scroll index, and a single lightweight evolution scene.
- `src/components/lab` — filterable experiment renderer, accessible AI/system interactions, procedural controls, and one viewport-activated WebGL scene.
- `src/components/contact` — contact conversion narrative, clipboard feedback, mailto inquiry composer, and a lightweight connection scene.
- `src/components/sections` — reusable narrative sections and scroll choreography retained for existing experiences.
- `src/components/ui` — small reusable primitives.
- `src/components/motion` — smooth scrolling lifecycle.
- `src/data` — projects, technology, and site/contact content separated from presentation.

## Design system

The palette, spacing, radii, easing, responsive type, surfaces, and focus styles are CSS custom properties in `src/app/globals.css`. Geist drives interface typography; Instrument Serif supplies the editorial voice. Reusable primitives include `Container`, `SectionLabel`, `ButtonLink`, and `Tag`.

## Motion system

CSS handles micro-interactions, Motion handles component entry and hover states, GSAP + ScrollTrigger choreographs the philosophy sequence, and Lenis provides restrained smooth scrolling. `prefers-reduced-motion` disables nonessential motion.

## 3D system

The hero sculpture uses procedural React Three Fiber geometry, capped device pixel ratio, limited lighting, no post-processing, subtle pointer response, and slow idle movement. It is client-only and lazy-loaded. A lightweight fallback remains visible while loading or without WebGL.

## Adding content later

Edit `src/data/projects.ts`, `src/data/technologies.ts`, and `src/data/site.ts`. Home-specific capabilities and teaser content live in `src/data/home.ts`; featured project proof continues to come from the shared project records. Public email, social destinations, location, role, and availability are centralized in `site.ts`; replace the explicitly unconfigured GitHub and LinkedIn base URLs there when personal public profiles are ready. About identity, principles, capabilities, exploration areas, and future direction live in `src/data/about.ts`; a future real portrait can be passed to the Home or About `ProfilePortrait` without changing its layout. Lab experiments live in `src/data/lab.ts`; each record selects a reusable interaction mode and filter categories without duplicating the archive presentation. Project records include stable IDs, filters, visual modes, status, and case-study hrefs. Full case-study content lives in `src/data/case-studies`; adding a record there automatically feeds the reusable `src/app/work/[slug]` route, static generation, metadata, section renderer, and previous/next navigation.

### Resume

Place the real document at `public/resume/Anchal-Sharma-Resume.pdf`, then set `resumeAvailable` to `true` in `src/data/site.ts`. The navbar, mobile menu, and Home hero all use the same `resumeUrl`; until the file exists they show an accessible “PDF pending” state instead of linking to a missing or fabricated document.
