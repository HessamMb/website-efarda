# ارتباط فردا — Website

Responsive Persian / English homepage built with Next.js, React, TypeScript, Tailwind CSS, and the local Peyda font. Layouts follow the supplied desktop, 768px tablet, and 390px mobile design references.

- Live demo: https://hessammb.github.io/website-efarda/
- English demo: https://hessammb.github.io/website-efarda/en/
- Repository: https://github.com/HessamMb/website-efarda

## Local development

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run build
npm start
```

## GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and deploys every push to `main`. To generate the same static output locally:

```sh
GITHUB_PAGES=true npm run build
```

This produces `out/` with `/website-efarda` as the base path. Images are served as static files; no Next.js server is required by the demo.

The homepage includes a responsive navigation menu, image slider, reading tabs, and FAQ accordions. Search and product links are presentation/demo navigation, not integrations with production services.

Original photographs come from the supplied Figma file; see `public/images/home/README.md`. This repository does not grant additional rights to the brand, font, or artwork.

## Languages

The EN / فا link switches between Persian (`/`) and English (`/en/`). Both pages are prerendered with the correct `lang`, `dir`, title, description and alternate-language links; the selected language remains in the URL on refresh and can be shared directly.

Translations live in `i18n/locales/fa.json` and `i18n/locales/en.json`. Keep the same keys and interpolation placeholders in both files. Each page uses its own i18next instance through `i18n/provider.tsx`, with the shared UI in `components/home-page.tsx`. Route-group layouts reuse `app/root-document.tsx` so each language has the correct document direction before JavaScript runs. No middleware or translation service is needed for the static GitHub Pages deployment.

## Company news demo

The reading section keeps its original three tabs and adds a Company news tab. News navigation, an independent photo gallery, and a native dialog let visitors read the supplied FINEX article and sourced leadership-news summaries without leaving the homepage. Both languages are supported.

To add a post, append a `NewsPost` in `data/news.ts` with Persian and English text, matching local images, an accurate category and a source URL. The sidebar, pagination and galleries derive their counts from the data. Use `isSummary` for edited summaries and `sourceIsProfile` when the source is a company feed rather than an individual post. Add image dimensions to `public/images/news/manifest.json`. Source notes are in `public/images/news/README.md`.
