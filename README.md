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

Start the server with `npm run dev` and open `http://localhost:3000/admin/login`. The dashboard initializes the account once, when there are no users. At first sign-in, the initial password must be replaced and a recovery email must be entered. The account page sends a confirmation link. Recovery becomes available after confirmation. This setup also applies once to existing accounts after the upgrade. After creating the initial account, remove the bootstrap password from the runtime environment. Use **کاربران** in the dashboard to create writer and reader accounts.

Three existing news posts are imported once into SQLite, preserving both languages, their links, and galleries. The default database is `.efarda/site.sqlite`. You can set `EFARDA_DB_PATH` to an absolute path to use an isolated review database. Account data, posts, sessions, and uploaded images are stored there.

## Account email

`.env.local` is ignored by Git. Provision secrets in the server environment or as mounted secret files. For the bootstrap password, `EFARDA_ADMIN_PASSWORD_FILE` can point to a file outside the checkout containing a random temporary password. It takes precedence over `EFARDA_ADMIN_PASSWORD`, and is only read when there are no users. Remove the bootstrap secret after the account is created.

Configure the public origin and SMTP in the runtime environment to deliver recovery links and notify the site admin of successful panel sign-ins:

```dotenv
EFARDA_SITE_URL=https://your-public-domain.example
EFARDA_SMTP_HOST=smtp.example
EFARDA_SMTP_PORT=587
EFARDA_SMTP_USER=your-smtp-user
EFARDA_SMTP_PASSWORD=your-smtp-secret
EFARDA_MAIL_FROM=website@example.com
EFARDA_LOGIN_ALERT_EMAIL=site-admin@example.com
```

Use full sender and recipient addresses on real domains. Port 587 requires STARTTLS. Port 465 uses implicit TLS. For a local SMTP capture server, set the host to `127.0.0.1`, set `EFARDA_SMTP_LOCAL_CAPTURE=true`, and omit SMTP credentials. This exception only applies to an unauthenticated loopback transport.

Reset links expire after 30 minutes and are single-use. Resetting a password revokes that account's sessions. The login alert records the username and timestamp in the Tehran time zone and UTC. Alerts are attempted after successful sign-in. SMTP failures are logged on the server and do not prevent sign-in. Recovery only works after an account's email is verified and SMTP is configured.

## Editorial workflow

| Role | Access |
| --- | --- |
| Admin | Manages posts and proposals, creates and deletes accounts, and changes roles. |
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

For container deployment, see the [Docker and Nginx handoff](deploy/README.md).
