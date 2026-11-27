import archive from "@/data/legacy-news.json";
import { newsPosts } from "@/data/news";
import type { companies } from "@/data/companies";
import type { Locale } from "@/i18n/provider";
import type { NewsCard, PostContent, PublishedPost } from "@/data/post-content";
import newsImages from "@/public/images/news/manifest.json";

function archiveContent(article: (typeof archive)[number], locale: Locale): PostContent | undefined {
  if (!Object.hasOwn(newsImages, article.cover) || !article.body?.fa.length || !article.body.en.length) return;
  const cover = newsImages[article.cover as keyof typeof newsImages];

  return {
    title: article.title[locale],
    excerpt: article.excerpt[locale],
    categoryKey: `news.category.${article.category}`,
    blocks: article.body[locale].map((text) => ({ kind: "paragraph", text })),
    images: [{
      src: `/images/news/${article.cover}.webp`,
      width: cover.width,
      height: cover.height,
      alt: article.imageAlt?.[locale] ?? "",
    }],
    sourceUrl: article.publishSourceLink === false ? undefined : article.sourceUrl,
    isSummary: article.publishSourceLink !== false,
  };
}


const archiveBySlug = new Map(archive.map((article) => [article.slug, article]));

function archiveDate(sourceUrl: string) {
  const date = new URL(sourceUrl).pathname.slice(1, 11).replaceAll("/", "-");
  return Date.parse(`${date}T12:00:00Z`);
}

function publishedNews(locale: Locale): PublishedPost[] {
  const curated = newsPosts.map((post): PublishedPost => {
    const original = archiveBySlug.get(post.id);
    return {
      slug: post.id,
      hasTranslation: true,
      publishedAt: original ? archiveDate(original.sourceUrl) : null,
      content: {
        title: post.title[locale],
        excerpt: post.excerpt[locale],
        categoryKey: post.categoryKey,
        blocks: post.paragraphs[locale].map((text) => ({ kind: "paragraph", text })),
        images: post.images.map(({ alt, ...image }) => ({ ...image, alt: alt[locale] })),
        sourceUrl: post.sourceUrl,
        sourceIsProfile: post.sourceIsProfile,
        imageNote: post.imageNote?.[locale],
        isSummary: post.isSummary,
      },
    };
  });
  const curatedSlugs = new Set(curated.map(({ slug }) => slug));
  for (const article of archive) {
    if (curatedSlugs.has(article.slug)) continue;
    const content = archiveContent(article, locale);
    if (!content) continue;
    curated.push({
      slug: article.slug,
      hasTranslation: true,
      publishedAt: archiveDate(article.sourceUrl),
      content,
    });
  }
  return curated.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
}

const posts = { fa: publishedNews("fa"), en: publishedNews("en") };

const newsByCompany = {
  "ertebat-farda": [
    "finex-18-announcement", "finex-exhibition", "co-banking", "transaction-product-awards",
    "finance-deputy-appointment", "legal-management-appointment", "elecomp-visit",
    "ceo-office-appointment", "isms-certification", "bank-day-iran-card", "new-holding-board",
    "annual-general-meeting", "moheb-ali-board-appointment", "ice-cream-day", "ceo-appointment", "itweekend-10",
  ],
  "behin-farda": [
    "iran-card-novin", "behin-farda-chair", "bank-day-iran-card", "transaction-product-awards",
    "behin-farda-performance-review",
  ],
  pipa: ["hamrah-peyda-ceo", "hamrah-peyda-performance-review"],
  finnova: ["finonext-launch", "finova-ceo", "finova-knowledge-based", "finova-performance-review"],
  finnotech: ["finotech-performance-review"],
  "bamdad-roshan": ["bamdad-roshan-ceo", "bamdad-roshan-performance-review"],
  segal: [],
} satisfies Record<(typeof companies)[number]["slug"], string[]>;

function toNewsCard({ slug, content: { title, excerpt, categoryKey, images } }: PublishedPost): NewsCard {
  return { slug, content: { title, excerpt, categoryKey, images } };
}

export function getNewsCards(locale: Locale, exclude?: string): NewsCard[] {
  const items = exclude ? posts[locale].filter(({ slug }) => slug !== exclude).slice(0, 3) : posts[locale];
  return items.map(toNewsCard);
}

export function getCompanyNewsCards(locale: Locale, company: keyof typeof newsByCompany): NewsCard[] {
  const slugs: string[] = newsByCompany[company];
  return posts[locale].filter(({ slug }) => slugs.includes(slug)).slice(0, 3).map(toNewsCard);
}

export function getPublishedPost(locale: Locale, slug: string) {
  return posts[locale].find((post) => post.slug === slug);
}

export function newsStaticParams() {
  return posts.fa.map(({ slug }) => ({ id: slug }));
}
