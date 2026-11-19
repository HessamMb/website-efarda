import type { Locale } from "@/i18n/provider";

export const postLocales = ["fa", "en"] as const;
export const blockKinds = ["paragraph", "heading", "quote", "list", "image", "divider"] as const;
export type BlockKind = (typeof blockKinds)[number];

export type CoverImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type PostBlock =
  | { kind: "image"; image: CoverImage }
  | { kind: "divider" }
  | { kind: "paragraph" | "heading" | "quote" | "list"; text: string };

export type PostContent = {
  title: string;
  excerpt: string;
  categoryKey: string;
  images: CoverImage[];
  blocks: PostBlock[];
  sourceUrl?: string;
  sourceIsProfile?: boolean;
  imageNote?: string;
  isSummary?: boolean;
};

export const postCategories = [
  "news.category.general",
  "news.category.exhibition",
  "news.category.leadership",
  "news.category.organization",
] as const;

export function isPostLocale(value: unknown): value is Locale {
  return value === "fa" || value === "en";
}

export function isPostSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 80;
}

export type NewsCard = {
  slug: string;
  content: Pick<PostContent, "title" | "excerpt" | "categoryKey" | "images">;
};

export type PublishedPost = {
  slug: string;
  content: PostContent;
  hasTranslation: boolean;
  publishedAt: number | null;
};

export function newsHref(slug: string, locale: Locale) {
  return `${locale === "en" ? "/en" : ""}/news/${slug}/`;
}
