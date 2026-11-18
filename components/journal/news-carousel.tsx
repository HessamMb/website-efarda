"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  X,
} from "lucide-react";
import { newsPosts, type NewsImage, type NewsPost } from "@/data/news";
import type { Locale } from "@/i18n/provider";

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

function Gallery({
  images,
  initialIndex = 0,
  compact = false,
  onExpand,
}: {
  images: NewsImage[];
  initialIndex?: number;
  compact?: boolean;
  onExpand?: (index: number) => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const [index, setIndex] = useState(initialIndex);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const move = (delta: number) =>
    setIndex((current) => (current + delta + images.length) % images.length);
  const rtl = i18n.dir() === "rtl";
  const PreviousIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;
  const current = images[index];
  function endSwipe(event: TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const end = event.changedTouches[0];
    const dx = end.clientX - start.x;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(end.clientY - start.y))
      move(dx > 0 === rtl ? 1 : -1);
  }
  const image = (
    <Image
      src={assetPath(current.src)}
      alt={current.alt[locale]}
      width={current.width}
      height={current.height}
      sizes={
        compact
          ? "(max-width: 599px) 90vw, 240px"
          : "(max-width: 799px) 90vw, 600px"
      }
      quality={90}
      loading={compact ? "lazy" : "eager"}
    />
  );
  return (
    <div
      className={`news-gallery ${compact ? "news-gallery--compact" : "news-gallery--reader"}`}
      role="group"
      aria-label={t("news.gallery")}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          event.stopPropagation();
          move(event.key === "ArrowRight" ? (rtl ? -1 : 1) : rtl ? 1 : -1);
        }
      }}
    >
      <div
        className="news-gallery-image"
        onTouchStart={(event) => {
          touchStart.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchEnd={endSwipe}
      >
        {compact ? (
          <button
            className="news-cover-open"
            onClick={() => onExpand?.(index)}
            aria-label={t("news.openPhoto", { number: number(index + 1) })}
          >
            {image}
            <span className="news-photo-badge">
              <Images size={14} />
              {t("news.photoCount", {
                count: images.length,
                number: number(images.length),
              })}
            </span>
          </button>
        ) : (
          image
        )}
      </div>
      {images.length > 1 && (
        <div className="news-gallery-controls">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={t("news.previousPhoto")}
          >
            <PreviousIcon size={18} />
          </button>
          <span aria-live="polite" dir="ltr">
            {number(index + 1)} / {number(images.length)}
          </span>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={t("news.nextPhoto")}
          >
            <NextIcon size={18} />
          </button>
        </div>
      )}
      {!compact && images.length > 1 && (
        <div className="news-thumbnails" aria-label={t("news.selectPhoto")}>
          {images.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              aria-pressed={i === index}
              aria-label={t("news.showPhoto", { number: number(i + 1) })}
              onClick={() => setIndex(i)}
            >
              <Image
                src={assetPath(photo.src)}
                alt=""
                width={photo.width}
                height={photo.height}
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewsCarousel() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const [index, setIndex] = useState(0);
  const [reader, setReader] = useState<{
    post: NewsPost;
    image: number;
  } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const post = newsPosts[index];
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const rtl = i18n.dir() === "rtl";
  const PreviousIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;
  const changePost = (next: number) =>
    setIndex((next + newsPosts.length) % newsPosts.length);
  function openReader(selected: NewsPost, image = 0) {
    triggerRef.current = document.activeElement as HTMLElement;
    setReader({ post: selected, image });
  }
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!reader || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [reader]);
  return (
    <div
      className="news-carousel"
      role="region"
      aria-roledescription={t("news.carousel")}
      aria-label={t("news.tab")}
    >
      <div className="reading-panel news-panel">
        <Gallery
          key={post.id}
          images={post.images}
          compact
          onExpand={(image) => openReader(post, image)}
        />
        <div className="reading-feature news-feature">
          <span className="eyebrow">{t(post.categoryKey)}</span>
          <h3>{post.title[locale]}</h3>
          <p>{post.excerpt[locale]}</p>
          <button
            className="arrow-link"
            onClick={() => openReader(post)}
            aria-haspopup="dialog"
          >
            {t("news.read")}
            <ArrowLeft size={19} />
          </button>
        </div>
        <div
          className="reading-list news-list"
          aria-label={t("news.otherNews")}
        >
          {newsPosts.map((item, i) => (
            <button
              className={index === i ? "is-current" : ""}
              aria-current={index === i ? "true" : undefined}
              onClick={() => changePost(i)}
              key={item.id}
            >
              <strong>{item.title[locale]}</strong>
              <small>{t(item.categoryKey)}</small>
            </button>
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
      {reader && (
        <dialog
          className="article-reader"
          ref={dialogRef}
          aria-labelledby="article-reader-title"
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const controls = Array.from(
              event.currentTarget.querySelectorAll<HTMLElement>(
                'button:not(:disabled), a[href], [tabindex="0"]',
              ),
            ).filter((element) => element.getClientRects().length > 0);
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (!first || !last) return;
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }}
          onCancel={() => setReader(null)}
          onClose={() => setReader(null)}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            )
              setReader(null);
          }}
        >
          <div className="article-reader-toolbar">
            <span>{t("news.sourceName")}</span>
            <button
              autoFocus
              onClick={() => setReader(null)}
              aria-label={t("news.close")}
            >
              <X size={22} />
            </button>
          </div>
          <article className="article-reader-content">
            <header>
              <span className="eyebrow">{t(reader.post.categoryKey)}</span>
              <h2 id="article-reader-title">{reader.post.title[locale]}</h2>
            </header>
            <div className="article-reader-grid">
              <div className="article-reader-media">
                <Gallery
                  key={`${reader.post.id}-${reader.image}`}
                  images={reader.post.images}
                  initialIndex={reader.image}
                />
                {reader.post.imageNote && (
                  <p className="news-image-note">
                    {reader.post.imageNote[locale]}
                  </p>
                )}
              </div>
              <div className="article-reader-copy">
                {reader.post.isSummary && (
                  <span className="article-summary-note">
                    {t("news.summaryNote")}
                  </span>
                )}
                {reader.post.paragraphs[locale].map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                <a
                  className="arrow-link article-source"
                  href={reader.post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(
                    reader.post.sourceIsProfile
                      ? "news.companySource"
                      : "news.originalSource",
                  )}
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </article>
        </dialog>
      )}
    </div>
  );
}
