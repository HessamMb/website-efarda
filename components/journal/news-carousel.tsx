"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { newsHref, type NewsCard } from "@/data/post-content";
import type { Locale } from "@/i18n/provider";
import NewsGallery from "./news-gallery";

export default function NewsCarousel({ posts }: { posts: NewsCard[] }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const [active, setActive] = useState(0);
  if (!posts.length) return <p>{t("news.empty")}</p>;
  const index = active % posts.length;
  const post = posts[index];
  const firstVisible = Math.floor(index / 5) * 5;
  const visible = posts.slice(firstVisible, firstVisible + 5);
  const href = newsHref(post.slug, locale);
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const rtl = i18n.dir() === "rtl";
  const PreviousIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;
  const changePost = (next: number) =>
    setActive((next + posts.length) % posts.length);
  return (
    <div
      className="news-carousel"
      role="region"
      aria-roledescription={t("news.carousel")}
      aria-label={t("news.tab")}
    >
      <div className="reading-panel news-panel">
        <NewsGallery key={post.slug} images={post.content.images} href={href} />
        <div className="reading-feature news-feature">
          <span className="eyebrow">{t(post.content.categoryKey)}</span>
          <h3><Link href={href}>{post.content.title}</Link></h3>
          <p>{post.content.excerpt}</p>
          <Link className="arrow-link" href={href}>
            {t("news.read")}
            <ArrowLeft size={19} />
          </Link>
        </div>
        <div
          className="reading-list news-list"
          aria-label={t("news.otherNews")}
        >
          {visible.map((item, i) => (
            <Link
              className={index === firstVisible + i ? "is-current" : ""}
              aria-current={index === firstVisible + i ? "true" : undefined}
              href={newsHref(item.slug, locale)}
              key={item.slug}
            >
              <strong>{item.content.title}</strong>
              <small>{t(item.content.categoryKey)}</small>
            </Link>
          ))}
        </div>
      </div>
      {posts.length > 5 && (
        <label className="news-archive-select">
          {t("news.chooseArchivePost")}
          <select value={index} onChange={(event) => changePost(Number(event.target.value))}>
            {posts.map((item, i) => (
              <option key={item.slug} value={i}>{item.content.title}</option>
            ))}
          </select>
        </label>
      )}
      {posts.length > 1 && (
        <div
          className="news-pagination"
          role="group"
          aria-label={t("news.navigation")}
        >
          <div className="news-pagination-arrows">
            <button
              onClick={() => changePost(index - 1)}
              aria-label={t("news.previous")}
            >
              <PreviousIcon size={18} />
            </button>
            <span aria-live="polite">
              {t("news.position", {
                current: number(index + 1),
                total: number(posts.length),
              })}
            </span>
            <button
              onClick={() => changePost(index + 1)}
              aria-label={t("news.next")}
            >
              <NextIcon size={18} />
            </button>
          </div>
          <div className="news-pagination-dots">
            {visible.map((item, i) => (
              <button
                key={item.slug}
                onClick={() => changePost(firstVisible + i)}
                aria-label={t("news.showNews", { number: number(firstVisible + i + 1) })}
                aria-pressed={index === firstVisible + i}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
