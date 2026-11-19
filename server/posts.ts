import { connection } from "next/server";
import type { CoverImage, NewsCard, PostContent, PublishedPost } from "@/data/post-content";
import type { Locale } from "@/i18n/provider";
import { getDb } from "./database";

export type Translation = {
  slug: string;
  locale: Locale;
  draft: string;
  published: string | null;
  published_at: number | null;
  revision: number;
};

export type Proposal = {
  id: number;
  slug: string;
  locale: Locale;
  base_revision: number;
  new_post: number;
  content: string;
  username: string | null;
  status: "pending" | "accepted" | "rejected";
};

export function getTranslation(slug: string, locale: Locale) {
  return getDb().prepare("SELECT * FROM translations WHERE slug = ? AND locale = ?")
    .get(slug, locale) as Translation | undefined;
}

export function listPosts() {
  return getDb().prepare(`
    SELECT posts.slug AS post_slug, translations.* FROM posts
    LEFT JOIN translations ON translations.slug = posts.slug
    ORDER BY posts.created_at DESC, posts.rowid ASC
  `).all() as unknown as
    ({ post_slug: string } & Partial<Translation>)[];
}

export function listProposals(authorId?: number) {
  return getDb().prepare(`
    SELECT proposals.*, users.username FROM proposals LEFT JOIN users ON proposals.author_id = users.id
    WHERE (? IS NULL OR author_id = ?) ORDER BY proposals.id DESC
  `).all(authorId ?? null, authorId ?? null) as unknown as Proposal[];
}

export function proposalById(id: number) {
  return getDb().prepare(`
    SELECT proposals.*, users.username FROM proposals LEFT JOIN users ON proposals.author_id = users.id
    WHERE proposals.id = ?
  `).get(id) as Proposal | undefined;
}

export function saveDraft(slug: string, locale: Locale, json: string, publish: boolean, wasPublished: boolean) {
  const snapshot = publish ? json : null;
  const date = publish && !wasPublished ? Date.now() : null;
  getDb().prepare(`
    INSERT INTO translations (slug, locale, draft, published, published_at) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (slug, locale) DO UPDATE SET draft = excluded.draft,
      published = COALESCE(excluded.published, translations.published),
      published_at = COALESCE(excluded.published_at, translations.published_at),
      revision = revision + 1
  `).run(slug, locale, json, snapshot, date);
}

export async function getPublishedPost(locale: Locale, slug: string): Promise<PublishedPost | undefined> {
  await connection();
  const row = getDb().prepare(`
    SELECT t.published AS content, t.published_at,
      EXISTS (SELECT 1 FROM translations other WHERE other.slug = t.slug
        AND other.locale <> t.locale AND other.published IS NOT NULL) AS translated
    FROM translations t
    WHERE t.locale = ? AND t.slug = ? AND t.published IS NOT NULL
  `).get(locale, slug) as { content: string; published_at: number | null; translated: number } | undefined;
  if (!row) return undefined;
  return {
    slug,
    content: JSON.parse(row.content) as PostContent,
    publishedAt: row.published_at,
    hasTranslation: !!row.translated,
  };
}

export async function getNewsCards(locale: Locale, exclude?: string): Promise<NewsCard[]> {
  await connection();
  const rows = getDb().prepare(`
    SELECT t.slug, json_object(
      'title', json_extract(t.published, '$.title'),
      'excerpt', json_extract(t.published, '$.excerpt'),
      'categoryKey', json_extract(t.published, '$.categoryKey'),
      'images', json_extract(t.published, '$.images')
    ) AS card
    FROM translations t JOIN posts ON t.slug = posts.slug
    WHERE t.locale = ? AND t.published IS NOT NULL AND t.slug <> ?
    ORDER BY COALESCE(t.published_at, 0) DESC, posts.rowid ASC
    LIMIT ?
  `).all(locale, exclude ?? "", exclude ? 3 : -1) as { slug: string; card: string }[];
  return rows.map(({ slug, card }) => ({ slug, content: JSON.parse(card) as NewsCard["content"] }));
}

const imageReference = `
  EXISTS (SELECT 1 FROM json_each(content, '$.images') WHERE json_extract(value, '$.src') = ?)
  OR EXISTS (SELECT 1 FROM json_each(content, '$.blocks') WHERE json_extract(value, '$.image.src') = ?)
`;

export function isPublicImage(src: string) {
  return !!getDb().prepare(`
    SELECT 1 FROM (SELECT published AS content FROM translations WHERE published IS NOT NULL)
    WHERE ${imageReference} LIMIT 1
  `).get(src, src);
}

export function canReaderViewImage(src: string, userId: number) {
  return !!getDb().prepare(`
    SELECT 1 FROM (
      SELECT draft AS content FROM translations
      UNION ALL
      SELECT content FROM proposals WHERE author_id = ?
    )
    WHERE ${imageReference} LIMIT 1
  `).get(userId, src, src);
}

export function getImage(id: string) {
  return getDb().prepare("SELECT bytes FROM post_images WHERE id = ?")
    .get(id) as { bytes: Uint8Array } | undefined;
}

export function imagePath(id: string) {
  return "/api/post-images/" + id;
}

export type PendingImage = { id: string; bytes: Buffer; image: CoverImage };

export function storeImages(images: PendingImage[]) {
  const insert = getDb().prepare("INSERT OR IGNORE INTO post_images (id, bytes) VALUES (?, ?)");
  for (const { id, bytes } of images) insert.run(id, bytes);
}
