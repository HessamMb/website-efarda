"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContactSection, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { newsHref, type NewsPost } from "@/data/news";
import type { Locale } from "@/i18n/provider";
import NewsGallery from "./news-gallery";

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

export default function NewsDetail({ post, related }: { post: NewsPost; related: NewsPost[] }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const home = locale === "en" ? "/en/" : "/";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const category = t(post.categoryKey);

  return (
    <>
      <SiteHeader homeHref={base + home} languagePath={newsHref(post.id, "fa")} />
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
            <h1>{post.title[locale]}</h1>
            <p>{post.excerpt[locale]}</p>
          </header>
          <figure className="news-detail-hero">
            <NewsGallery images={post.images} />
            {post.imageNote && <figcaption className="news-image-note">{post.imageNote[locale]}</figcaption>}
          </figure>
          <div className="news-detail-body">
            <div className="news-detail-copy">
              {post.paragraphs[locale].map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {post.isSummary && <p className="article-summary-note">{t("news.summaryNote")}</p>}
              <a className="arrow-link article-source" href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
                {t(post.sourceIsProfile ? "news.companySource" : "news.originalSource")}
                <ExternalLink size={16} />
              </a>
            </div>
            <aside className="news-detail-aside">
              <ShareNews />
              {related[0] && (
                <div className="news-detail-more">
                  <h2>{t("news.otherNews")}</h2>
                  <Link href={newsHref(related[0].id, locale)}>{related[0].title[locale]}</Link>
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
                  const cover = item.images[0];
                  return (
                    <article key={item.id}>
                      <Link href={newsHref(item.id, locale)}>
                        <Image
                          src={base + cover.src}
                          alt=""
                          width={cover.width}
                          height={cover.height}
                          sizes="(max-width: 599px) 90vw, (max-width: 1000px) 45vw, 380px"
                        />
                        <span className="eyebrow">{t(item.categoryKey)}</span>
                        <h3>{item.title[locale]}</h3>
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
