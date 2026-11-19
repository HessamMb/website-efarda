import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { newsHref } from "@/data/post-content";
import { LocaleProvider, type Locale } from "@/i18n/provider";
import { getNewsCards, getPublishedPost } from "@/server/posts";
import NewsDetail from "./news-detail";

export type NewsRouteProps = { params: Promise<{ id: string }> };

const loadPost = cache(async (locale: Locale, id: string) => {
  const post = await getPublishedPost(locale, id);
  if (!post) notFound();
  return post;
});

export async function newsMetadata(
  { params }: NewsRouteProps,
  locale: Locale,
): Promise<Metadata> {
  const { id } = await params;
  const post = await loadPost(locale, id);
  const canonical = newsHref(post.slug, locale);
  const english = locale === "en" || post.hasTranslation ? newsHref(post.slug, "en") : undefined;
  const persian = locale === "fa" || post.hasTranslation ? newsHref(post.slug, "fa") : undefined;
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
  const post = await loadPost(locale, id);
  const related = await getNewsCards(locale, post.slug);
  return (
    <LocaleProvider locale={locale}>
      <NewsDetail key={post.slug} post={post} related={related} />
    </LocaleProvider>
  );
}
