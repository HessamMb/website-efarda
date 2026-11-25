"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContactSection, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { newsHref, type NewsCard, type PublishedPost } from "@/data/post-content";
import type { Locale } from "@/i18n/provider";
import NewsGallery from "./news-gallery";
import PostBlocks from "./post-blocks";

function ShareNews() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState("");

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setManualUrl(url);
    }
  }

  return (
    <div className="news-detail-share">
      <h2>{t("news.share")}</h2>
      <button type="button" className="arrow-link" onClick={copyLink}>
        {t("news.copyLink")}
        <Copy size={20} />
      </button>
      {copied && <p role="status">{t("news.linkCopied")}</p>}
      {manualUrl && (
        <input
          aria-label={t("news.copyLink")}
          readOnly
          value={manualUrl}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </div>
  );
}

export default function NewsDetail({ post, related }: { post: PublishedPost; related: NewsCard[] }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const home = locale === "en" ? "/en/" : "/";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const { content, slug, hasTranslation, publishedAt } = post;
  const category = t(content.categoryKey);
  const headings = content.blocks.flatMap((block, index) =>
    block.kind === "heading" ? [{ id: `section-${index + 1}`, text: block.text }] : [],
  );

  return (
    <>
      <SiteHeader homeHref={base + home} languagePath={hasTranslation ? newsHref(slug, "fa") : "/#journal"} />
      <main>
        <article className="news-detail container">
          <nav className="news-breadcrumb" aria-label={t("news.breadcrumb")}>
            <Link href={home}>{t("nav.home")}</Link>
            <span aria-hidden="true">/</span>
            <Link href={home + "#journal"}>{t("nav.journal")}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{category}</span>
          </nav>
          <header className="news-detail-heading">
            <span className="eyebrow">{category}</span>
            <h1>{content.title}</h1>
            {content.excerpt && <p>{content.excerpt}</p>}
            {publishedAt !== null && (
              <time dateTime={new Date(publishedAt).toISOString()}>
                {new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Asia/Tehran" }).format(publishedAt)}
              </time>
            )}
          </header>
          <figure className="news-detail-hero">
            <NewsGallery images={content.images} />
            {content.imageNote && <figcaption className="news-image-note">{content.imageNote}</figcaption>}
          </figure>
          <div className="news-detail-body">
            <div className="news-detail-copy">
              <PostBlocks blocks={content.blocks} />
              {content.isSummary && <p className="article-summary-note">{t("news.summaryNote")}</p>}
              {content.sourceUrl && (
                <a className="arrow-link article-source" href={content.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {t(content.sourceIsProfile ? "news.companySource" : "news.originalSource")}
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
            <aside className="news-detail-aside">
              {headings.length > 0 && (
                <nav className="news-detail-toc" aria-label={t("news.contents")}>
                  <h2>{t("news.contents")}</h2>
                  <ul>{headings.map(({ id, text }) => <li key={id}><a href={`#${id}`}>{text}</a></li>)}</ul>
                </nav>
              )}
              <ShareNews />
              {related[0] && (
                <div className="news-detail-more">
                  <h2>{t("news.otherNews")}</h2>
                  <Link href={newsHref(related[0].slug, locale)}>{related[0].content.title}</Link>
                </div>
              )}
            </aside>
          </div>
        </article>
        {related.length > 0 && (
          <section className="news-related" aria-labelledby="news-related-title">
            <div className="container">
              <h2 id="news-related-title">{t("news.related")}</h2>
              <div className="news-related-grid">
                {related.map((item) => {
                  const cover = item.content.images[0];
                  return (
                    <article key={item.slug}>
                      <Link href={newsHref(item.slug, locale)}>
                        <Image
                          src={base + cover.src}
                          alt=""
                          width={cover.width}
                          height={cover.height}

                          sizes="(max-width: 599px) 90vw, (max-width: 1000px) 45vw, 380px"
                        />
                        <span className="eyebrow">{t(item.content.categoryKey)}</span>
                        <h3>{item.content.title}</h3>
                        <span className="arrow-link">{t("news.read")} <ArrowLeft size={16} /></span>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}
        <ContactSection />
      </main>
      <SiteFooter homeHref={base + home} />
    </>
  );
}
