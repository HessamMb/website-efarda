import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { newsHref, newsPosts } from "@/data/news";
import { LocaleProvider, type Locale } from "@/i18n/provider";
import NewsDetail from "./news-detail";

export type NewsRouteProps = { params: Promise<{ id: string }> };

export function newsStaticParams() {
  return newsPosts.map(({ id }) => ({ id }));
}

async function getNewsPost(params: NewsRouteProps["params"]) {
  const { id } = await params;
  const post = newsPosts.find((item) => item.id === id);
  if (!post) notFound();
  return post;
}

export async function newsMetadata(
  { params }: NewsRouteProps,
  locale: Locale,
): Promise<Metadata> {
  const post = await getNewsPost(params);
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const fa = base + newsHref(post.id, "fa");
  const en = base + newsHref(post.id, "en");

  return {
    title: post.title[locale],
    description: post.excerpt[locale],
    alternates: {
      canonical: locale === "fa" ? fa : en,
      languages: { fa, en, "x-default": fa },
    },
  };
}

export async function NewsDetailRoute({
  params,
  locale,
}: NewsRouteProps & { locale: Locale }) {
  const post = await getNewsPost(params);
  return (
    <LocaleProvider locale={locale}>
      <NewsDetail
        key={post.id}
        post={post}
        related={newsPosts.filter((item) => item.id !== post.id)}
      />
    </LocaleProvider>
  );
}
