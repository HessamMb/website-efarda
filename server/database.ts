import { closeSync, mkdirSync, openSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { newsPosts } from "@/data/news";
import { postLocales, type PostContent } from "@/data/post-content";
import { bootstrapPasswordHash, isUsername, validPassword } from "./credentials";

import { seedNewsArchive } from "./seed-news-archive";

let database: DatabaseSync | undefined;

export function transaction<T>(db: DatabaseSync, run: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const value = run();
    db.exec("COMMIT");
    return value;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

const proposalSchema = `
  CREATE TABLE IF NOT EXISTS proposals (
    id INTEGER PRIMARY KEY,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    slug TEXT NOT NULL,
    locale TEXT NOT NULL CHECK (locale IN ('fa', 'en')),
    base_revision INTEGER NOT NULL,
    new_post INTEGER NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at INTEGER NOT NULL
  );
`;

function initialize(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'writer', 'reader'))
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL,
      attempted_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS recent_login_attempts ON login_attempts(attempted_at);
    CREATE TABLE IF NOT EXISTS posts (
      slug TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS translations (
      slug TEXT NOT NULL REFERENCES posts(slug) ON DELETE CASCADE,
      locale TEXT NOT NULL CHECK (locale IN ('fa', 'en')),
      draft TEXT NOT NULL,
      published TEXT,
      published_at INTEGER,
      revision INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (slug, locale)
    );
    ${proposalSchema}
    CREATE INDEX IF NOT EXISTS published_by_locale
      ON translations(locale, published_at) WHERE published IS NOT NULL;
    CREATE TABLE IF NOT EXISTS post_images (
      id TEXT PRIMARY KEY,
      bytes BLOB NOT NULL
    );
    CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY);
  `);

  if (!db.prepare("SELECT 1 FROM migrations WHERE name = ?").get("account-recovery")) {
    db.exec(`
      ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 1;
      ALTER TABLE users ADD COLUMN recovery_email TEXT;
      ALTER TABLE users ADD COLUMN pending_email TEXT;
      CREATE TABLE account_tokens (
        token_hash TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        purpose TEXT NOT NULL CHECK (purpose IN ('verify', 'reset')),
        expires_at INTEGER NOT NULL,
        UNIQUE (user_id, purpose)
      );
      CREATE TABLE account_mail_attempts (
        purpose TEXT NOT NULL,
        account TEXT NOT NULL,
        attempted_at INTEGER NOT NULL
      );
      CREATE INDEX account_mail_by_time ON account_mail_attempts(attempted_at);
    `);
    db.prepare("INSERT INTO migrations (name) VALUES (?)").run("account-recovery");
  }

  if (!db.prepare("SELECT 1 FROM migrations WHERE name = ?").get("retain-proposals-after-user-deletion")) {
    const author = db.prepare("PRAGMA table_info(proposals)").all().find((column) => column.name === "author_id");
    if (author?.notnull) {
      db.exec(`
        ALTER TABLE proposals RENAME TO previous_proposals;
        ${proposalSchema}
        INSERT INTO proposals (id, author_id, slug, locale, base_revision, new_post, content, status, created_at)
        SELECT id, author_id, slug, locale, base_revision, new_post, content, status, created_at
        FROM previous_proposals;
        DROP TABLE previous_proposals;
      `);
    }
    db.exec("CREATE INDEX IF NOT EXISTS proposals_by_author ON proposals(author_id)");
    db.prepare("INSERT INTO migrations (name) VALUES (?)").run("retain-proposals-after-user-deletion");
  }

  if (!db.prepare("SELECT 1 FROM migrations WHERE name = ?").get("initial-news")) {
    const insertPost = db.prepare("INSERT INTO posts (slug, created_at) VALUES (?, ?)");
    const insertContent = db.prepare(`
      INSERT INTO translations (slug, locale, draft, published) VALUES (?, ?, ?, ?)
    `);
    for (const post of newsPosts) {
      insertPost.run(post.id, 0);
      for (const locale of postLocales) {
        const content: PostContent = {
          title: post.title[locale],
          excerpt: post.excerpt[locale],
          categoryKey: post.categoryKey,
          blocks: post.paragraphs[locale].map((text) => ({ kind: "paragraph", text })),
          images: post.images.map((image) => ({ ...image, alt: image.alt[locale] })),
          sourceUrl: post.sourceUrl,
          sourceIsProfile: post.sourceIsProfile,
          imageNote: post.imageNote?.[locale],
          isSummary: post.isSummary,
        };
        const json = JSON.stringify(content);
        insertContent.run(post.id, locale, json, json);
      }
    }
    db.prepare("INSERT INTO migrations (name) VALUES (?)").run("initial-news");
  }

  seedNewsArchive(db);

  const username = process.env.EFARDA_ADMIN_USERNAME?.trim().toLowerCase();
  const passwordFile = process.env.EFARDA_ADMIN_PASSWORD_FILE;
  const bootstrapPassword = process.env.EFARDA_ADMIN_PASSWORD;
  if (!db.prepare("SELECT 1 FROM users LIMIT 1").get() && (username || passwordFile || bootstrapPassword)) {
    const password = passwordFile
      ? readFileSync(/*turbopackIgnore: true*/ passwordFile, "utf8").replace(/\r?\n$/, "")
      : bootstrapPassword;
    if (!username || !isUsername(username) || !password || !validPassword(password)) {
      throw new Error("Set a valid EFARDA_ADMIN_USERNAME and a 12–128 character EFARDA_ADMIN_PASSWORD.");
    }
    db.prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'admin')")
      .run(username, bootstrapPasswordHash(password));
  }
}

export function getDb() {
  if (database) return database;
  // The database lives on runtime storage, outside the build's file trace.
  const path = resolve(/*turbopackIgnore: true*/ process.env.EFARDA_DB_PATH || ".efarda/site.sqlite");
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  closeSync(openSync(/*turbopackIgnore: true*/ path, "a", 0o600));
  const db = new DatabaseSync(path);
  try {
    db.exec("PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
    transaction(db, () => initialize(db));
    database = db;
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}
