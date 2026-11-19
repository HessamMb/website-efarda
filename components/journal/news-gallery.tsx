"use client";

import { useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { CoverImage } from "@/data/post-content";
import type { Locale } from "@/i18n/provider";

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export default function NewsGallery({
  images,
  href,
}: {
  images: CoverImage[];
  href?: string;
}) {
  const compact = href !== undefined;
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const [index, setIndex] = useState(0);
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
      alt={current.alt}
      width={current.width}
      height={current.height}
      sizes={
        compact
          ? "(max-width: 599px) 90vw, 240px"
          : "(max-width: 1248px) 95vw, 1184px"
      }
      quality={90}
      unoptimized={current.src.startsWith("/api/post-images/")}
      loading={compact ? "lazy" : "eager"}
    />
  );
  return (
    <div
      className={`news-gallery ${compact ? "news-gallery--compact" : "news-gallery--detail"}`}
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
          <Link href={href} className="news-cover-open" aria-label={t("news.read")}>
            {image}
            <span className="news-photo-badge">
              <Images size={14} />
              {t("news.photoCount", {
                count: images.length,
                number: number(images.length),
              })}
            </span>
          </Link>
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
                unoptimized={photo.src.startsWith("/api/post-images/")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
