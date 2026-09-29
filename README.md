# Almonzir Ali · Digital Solutions

Personal portfolio of Almonzir Ali: websites, mobile apps, cloud platforms and the systems behind them. Available in English (`/`) and Arabic (`/ar`).

Built from scratch with **Next.js 15**, **TypeScript** and **Motion**, exported as a fully static site.

## Highlights

- **Exploded product stack** hero: interface, API, data and cloud layers in CSS 3D, driven by pointer and scroll.
- **Live project chapters**: real Shifa, TEE and Omdurman Industries sites scroll inside a browser frame as you scroll.
- **Trace a request**: an interactive walk through Shifa's architecture, where every step mirrors real code.
- **Bilingual**: English and Arabic share one layout; Arabic sentences read right to left.
- Accessible (reduced motion, no-JS fallbacks, keyboard focus) and fast (static HTML, no animation-heavy first paint).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # static site in out/
npm start          # serve out/ on http://localhost:3000
npm run typecheck
```

## Project structure

```
src/
  app/
    (en)/          English routes, served at /
    ar/            Arabic routes, served at /ar
    globals.css    design tokens, typography, Arabic text rules
  views/           page compositions shared by both languages
  components/      hero, services, work, capabilities, process, site chrome
  content/         projects, services, system trace (English) + ar.ts (Arabic)
  i18n/            locale config, UI dictionary, useLocale()
public/work/       optimised project screenshots
```

## Editing content

- Projects: `src/content/projects.ts` (English) and `src/content/ar.ts` (Arabic overrides by id).
- Services, process, principles: `src/content/services.ts` and `src/content/ar.ts`.
- Interface text: `src/i18n/dictionary.ts`. Both languages share one type, so a missing translation fails the typecheck.
- Contact details: `src/content/brand.ts`.

## Deploy

The site is static. `netlify.toml` is included: build command `npm run build`, publish directory `out`.
