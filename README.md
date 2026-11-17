# ارتباط فردا — Website

Responsive Persian homepage built with Next.js, React, TypeScript, Tailwind CSS, and the local Peyda font. Layouts follow the supplied desktop, 768px tablet, and 390px mobile design references.

- Live demo: https://hessammb.github.io/website-efarda/
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

Image crops come from the supplied design references; see `public/images/home/README.md`. This repository does not grant additional rights to the brand, font, or artwork.
