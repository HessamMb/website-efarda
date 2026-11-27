"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { newsHref, type NewsCard } from "@/data/post-content";
import type { Locale } from "@/i18n/provider";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function NewsCardsGrid({ items, locale }: { items: NewsCard[]; locale: Locale }) {
  const { t } = useTranslation();

  return (
    <div className="news-related-grid">
      {items.map(({ slug, content }) => {
        const cover = content.images[0];
        return (
          <article key={slug}>
            <Link href={newsHref(slug, locale)}>
              {cover && (
                <Image
                  src={basePath + cover.src}
                  alt=""
                  width={cover.width}
                  height={cover.height}
                  sizes="(max-width: 599px) 90vw, (max-width: 1000px) 45vw, 380px"
                />
              )}
              <span className="eyebrow">{t(content.categoryKey)}</span>
              <h3>{content.title}</h3>
              <span className="arrow-link">{t("news.read")} <ArrowLeft size={16} /></span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
