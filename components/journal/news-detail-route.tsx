import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { newsHref } from "@/data/post-content";
import { LocaleProvider, type Locale } from "@/i18n/provider";
import { getNewsCards, getPublishedPost } from "@/data/published-news";
import NewsDetail from "./news-detail";

export type NewsRouteProps = { params: Promise<{ id: string }> };

function loadPost(locale: Locale, id: string) {
  const post = getPublishedPost(locale, id);
  if (!post) notFound();
  return post;
}

export async function newsMetadata(
  { params }: NewsRouteProps,
  locale: Locale,
): Promise<Metadata> {
  const { id } = await params;
  const post = loadPost(locale, id);
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const canonical = base + newsHref(post.slug, locale);
  const english = locale === "en" || post.hasTranslation ? base + newsHref(post.slug, "en") : undefined;
  const persian = locale === "fa" || post.hasTranslation ? base + newsHref(post.slug, "fa") : undefined;
  return {
    title: post.content.title,
    description: post.content.excerpt,
    alternates: { canonical, languages: { fa: persian, en: english, "x-default": persian ?? english } },
  };
}

export async function NewsDetailRoute({
  params,
  locale,
}: NewsRouteProps & { locale: Locale }) {
  const { id } = await params;
  const post = loadPost(locale, id);
  const related = getNewsCards(locale, post.slug);
  return (
    <LocaleProvider locale={locale}>
      <NewsDetail key={post.slug} post={post} related={related} />
    </LocaleProvider>
  );
}
