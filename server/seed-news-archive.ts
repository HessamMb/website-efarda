import type { DatabaseSync } from "node:sqlite";
import archive from "@/data/legacy-news.json";
import { newsPosts } from "@/data/news";
import { postLocales, type PostContent } from "@/data/post-content";
import homeImages from "@/public/images/home/manifest.json";
import newsImages from "@/public/images/news/manifest.json";

const illustrations = {
  building: homeImages.building,
  business: homeImages.business,
  everyday: homeImages.everyday,
  journal: homeImages.journal,
  payment: homeImages.payment,
};

export function seedNewsArchive(db: DatabaseSync) {
  const migration = "efarda-news-archive-2026-11";
  if (db.prepare("SELECT 1 FROM migrations WHERE name = ?").get(migration)) return;

  const insertPost = db.prepare("INSERT OR IGNORE INTO posts (slug, created_at) VALUES (?, ?)");
  const insertTranslation = db.prepare(`
    INSERT INTO translations (slug, locale, draft, published, published_at) VALUES (?, ?, ?, ?, ?)
  `);
  const linkOriginal = db.prepare(`
    UPDATE translations SET draft = json_set(draft, '$.sourceUrl', ?, '$.sourceIsProfile', json('false')),
      published = json_set(published, '$.sourceUrl', ?, '$.sourceIsProfile', json('false')),
      published_at = ?, revision = revision + 1
    WHERE slug = ? AND revision = 1 AND published_at IS NULL AND draft = published
      AND json_extract(published, '$.sourceUrl') = ?
  `);

  for (const article of archive) {
    const publishedAt = Date.parse(article.sourceUrl.slice("https://efarda.ir/".length, "https://efarda.ir/".length + 10)
      .replaceAll("/", "-") + "T12:00:00Z");
    const existingSeed = newsPosts.find((post) => post.id === article.slug);
    if (existingSeed) {
      linkOriginal.run(article.sourceUrl, article.sourceUrl, publishedAt, article.slug, existingSeed.sourceUrl);
      continue;
    }
    if (!insertPost.run(article.slug, publishedAt).changes) continue;

    const eventPhoto = article.cover === "finex-booth";
    const cover = eventPhoto ? newsImages["finex-booth"] : illustrations[article.cover as keyof typeof illustrations];
    for (const locale of postLocales) {
      const content: PostContent = {
        title: article.title[locale],
        excerpt: article.excerpt[locale],
        categoryKey: `news.category.${article.category}`,
        blocks: [],
        images: [{
          src: `/images/${eventPhoto ? "news" : "home"}/${article.cover}.webp`,
          width: cover.width,
          height: cover.height,
          alt: eventPhoto
            ? locale === "fa" ? "غرفه ارتباط فردا در فینکس" : "Ertebat Farda’s stand at FINEX"
            : "",
        }],
        imageNote: eventPhoto ? undefined : locale === "fa" ? "تصویر تزیینی" : "Illustrative image",
        sourceUrl: article.sourceUrl,
        isSummary: true,
      };
      const snapshot = JSON.stringify(content);
      insertTranslation.run(article.slug, locale, snapshot, snapshot, publishedAt);
    }
  }

  db.prepare("INSERT INTO migrations (name) VALUES (?)").run(migration);
}
