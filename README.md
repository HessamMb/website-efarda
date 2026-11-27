# ارتباط فردا — Website

The public Persian and English website on `main` is published as a static site on GitHub Pages. The full-stack version with the editorial dashboard, SQLite and Docker is available on the `feature/posts-admin` branch.

## Development

```sh
npm ci
npm run dev
```

## GitHub Pages

Pushes to `main` run the Pages workflow. To build the same export locally:

```sh
GITHUB_PAGES=true npm run build
```

The resulting `out/` directory contains both homepage languages and every article detail page. The project deploys at `/website-efarda/`.

## News

`data/news.ts` contains curated articles. `data/legacy-news.json` contains the archive imported from the former site, with dates and source references. `data/published-news.ts` combines the two collections for the homepage, the journal, company profiles and article pages. Legacy entries with missing translated body text or an illustrative cover stay in the archive data until the original material is available. Updating the static site's content requires a new build.
