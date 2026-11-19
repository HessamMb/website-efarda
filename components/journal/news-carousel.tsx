"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { newsHref, newsPosts } from "@/data/news";
import type { Locale } from "@/i18n/provider";
import NewsGallery from "./news-gallery";

export default function NewsCarousel() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const [index, setIndex] = useState(0);
  const post = newsPosts[index];
  const href = newsHref(post.id, locale);
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const rtl = i18n.dir() === "rtl";
  const PreviousIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;
  const changePost = (next: number) =>
    setIndex((next + newsPosts.length) % newsPosts.length);
  return (
    <div
      className="news-carousel"
      role="region"
      aria-roledescription={t("news.carousel")}
      aria-label={t("news.tab")}
    >
      <div className="reading-panel news-panel">
        <NewsGallery key={post.id} images={post.images} href={href} />
        <div className="reading-feature news-feature">
          <span className="eyebrow">{t(post.categoryKey)}</span>
          <h3><Link href={href}>{post.title[locale]}</Link></h3>
          <p>{post.excerpt[locale]}</p>
          <Link className="arrow-link" href={href}>
            {t("news.read")}
            <ArrowLeft size={19} />
          </Link>
        </div>
        <div
          className="reading-list news-list"
          aria-label={t("news.otherNews")}
        >
          {newsPosts.map((item, i) => (
            <Link
              className={index === i ? "is-current" : ""}
              aria-current={index === i ? "true" : undefined}
              href={newsHref(item.id, locale)}
              key={item.id}
            >
              <strong>{item.title[locale]}</strong>
              <small>{t(item.categoryKey)}</small>
            </Link>
          ))}
        </div>
      </div>
      {newsPosts.length > 1 && (
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
                total: number(newsPosts.length),
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
            {newsPosts.map((item, i) => (
              <button
                key={item.id}
                onClick={() => changePost(i)}
                aria-label={t("news.showNews", { number: number(i + 1) })}
                aria-pressed={index === i}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
