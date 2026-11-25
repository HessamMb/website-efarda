import archive from "@/data/legacy-news.json";
import { newsPosts } from "@/data/news";
import type { Locale } from "@/i18n/provider";
import type { NewsCard, PostContent, PublishedPost } from "@/data/post-content";
import homeImages from "@/public/images/home/manifest.json";
import newsImages from "@/public/images/news/manifest.json";

const illustrations = {
  building: homeImages.building,
  business: homeImages.business,
  everyday: homeImages.everyday,
  journal: homeImages.journal,
  payment: homeImages.payment,
};

function archiveContent(article: (typeof archive)[number], locale: Locale): PostContent {
  const eventPhoto = Object.hasOwn(newsImages, article.cover);
  const cover = eventPhoto
    ? newsImages[article.cover as keyof typeof newsImages]
    : illustrations[article.cover as keyof typeof illustrations];

  return {
    title: article.title[locale],
    excerpt: article.excerpt[locale],
    categoryKey: `news.category.${article.category}`,
    blocks: article.body?.[locale].map((text) => ({ kind: "paragraph", text })) ?? [],
    images: [{
      src: `/images/${eventPhoto ? "news" : "home"}/${article.cover}.webp`,
      width: cover.width,
      height: cover.height,
      alt: article.imageAlt?.[locale] ?? (eventPhoto
        ? locale === "fa" ? "غرفه ارتباط فردا در فینکس" : "Ertebat Farda’s stand at FINEX"
        : ""),
    }],
    imageNote: eventPhoto ? undefined : locale === "fa" ? "تصویر تزیینی" : "Illustrative image",
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
        sourceUrl: original?.sourceUrl ?? post.sourceUrl,
        sourceIsProfile: original ? undefined : post.sourceIsProfile,
        imageNote: post.imageNote?.[locale],
        isSummary: post.isSummary,
      },
    };
  });
  const curatedSlugs = new Set(curated.map(({ slug }) => slug));
  for (const article of archive) {
    if (curatedSlugs.has(article.slug)) continue;
    curated.push({
      slug: article.slug,
      hasTranslation: true,
      publishedAt: archiveDate(article.sourceUrl),
      content: archiveContent(article, locale),
    });
  }
  return curated.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
}

const posts = { fa: publishedNews("fa"), en: publishedNews("en") };

export function getNewsCards(locale: Locale, exclude?: string): NewsCard[] {
  const items = exclude ? posts[locale].filter(({ slug }) => slug !== exclude).slice(0, 3) : posts[locale];
  return items.map(({ slug, content: { title, excerpt, categoryKey, images } }) => ({
    slug,
    content: { title, excerpt, categoryKey, images },
  }));
}

export function getPublishedPost(locale: Locale, slug: string) {
  return posts[locale].find((post) => post.slug === slug);
}

export function newsStaticParams() {
  return posts.fa.map(({ slug }) => ({ id: slug }));
}
