# ارتباط فردا — Website

Responsive Persian and English website with a shared news template and a Next.js editorial dashboard.

## Local review

Use Node.js 22.13 or newer.

```sh
npm ci
```

Create a local `.env.local` file with the initial administrator's credentials. Use a password of 12–128 characters. The username can contain lowercase Latin letters, digits, dots, underscores and hyphens.

```dotenv
EFARDA_ADMIN_USERNAME=local-admin
EFARDA_ADMIN_PASSWORD="replace-with-your-own-password"
```

Start the server with `npm run dev` and open `http://localhost:3000/admin/login`. The dashboard initializes the account once, when there are no users. After signing in, you can remove the bootstrap credentials from `.env.local`. Use **کاربران** in the dashboard to create writer and reader accounts.

Three existing news posts are imported once into SQLite, preserving both languages, their links, and galleries. The default database is `.efarda/site.sqlite`. You can set `EFARDA_DB_PATH` to an absolute path to use an isolated review database. Account data, posts, sessions, and uploaded images are stored there.

## Editorial workflow

| Role | Access |
| --- | --- |
| Admin | Manages posts and proposals, creates accounts, and changes roles. |
| Writer | Manages posts, publishes or unpublishes either language, and reviews proposals. |
| Reader | Can view posts in the panel and submit proposed additions or changes for review. |

Enter a permanent Latin-script slug on a new post, then choose a language. Each language requires a title and cover image and supports an optional gallery. Compose the article using reorderable paragraph, heading, quote, list, image, and divider blocks. Headings generate the article's table of contents. Use JPG, PNG or WebP images up to 5 MB per image, with at most six new files in one save and a 24 MB request limit.

Saving a draft preserves the current public version. Publishing replaces the public version for the selected language only. The other language has its own editor and publication state. An accepted proposal becomes a draft for the selected language. The public news list and article pages show published content for the selected language.

## Build and runtime

```sh
npm run lint
npm run build
npm start
```

Production requires a running Next.js server, HTTPS, and persistent local storage for SQLite. Set `EFARDA_SITE_URL` to the public HTTPS origin to generate canonical and alternate-language URLs. The existing GitHub Pages workflow and demo are static. Review this branch locally before choosing a server deployment to replace that workflow.

Original photographs come from the supplied Figma file. See `public/images/home/README.md` and `public/images/news/README.md` for sources. Translations of site labels live in `i18n/locales/`.
