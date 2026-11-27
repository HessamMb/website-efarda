"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Pause, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LinkArrow } from "@/components/home-ui";
import { newsHref, type CoverImage, type NewsCard } from "@/data/post-content";
import type { Locale } from "@/i18n/provider";

const rotationDelay = 7_000;
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function newsSlides(posts: NewsCard[]) {
  const slides: { post: NewsCard; cover: CoverImage }[] = [];
  const used = new Set<string>();
  for (const post of posts) {
    const cover = post.content.images.find(({ src }) => !used.has(src));
    if (!cover) continue;
    slides.push({ post, cover });
    used.add(cover.src);
    if (slides.length === 5) break;
  }
  return slides;
}

function HeroPhoto({ cover, secondary = false }: { cover: CoverImage; secondary?: boolean }) {
  return (
    <Image
      src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${cover.src}`}
      width={cover.width}
      height={cover.height}
      alt={cover.alt}
      className="photo"
      sizes={secondary ? "(max-width: 599px) 45vw, 216px" : "(max-width: 599px) 90vw, (max-width: 1099px) 55vw, 400px"}
      quality={90}
      loading={secondary ? "lazy" : "eager"}
    />
  );
}

export default function NewsHero({ posts }: { posts: NewsCard[] }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as Locale;
  const slides = newsSlides(posts);
  const count = slides.length;
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [playPreference, setPlayPreference] = useState<boolean | null>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
  const active = selected % Math.max(1, count);
  const playing = playPreference ?? !reducedMotion;
  const rotating = playing && !hovered && !focused && count > 1;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setSelected((current) => (current + 1) % count);
    }, rotationDelay);
    return () => window.clearInterval(timer);
  }, [active, count, rotating]);

  const featured = slides[active];
  const next = count > 1 ? slides[(active + 1) % count] : undefined;
  const post = featured?.post ?? posts[0];
  if (!post) {
    return (
      <section className="hero hero--text-only container">
        <div className="hero-copy">
          <h1>{t("news.tab")}</h1>
          <p>{t("news.empty")}</p>
        </div>
      </section>
    );
  }

  const href = newsHref(post.slug, locale);
  const number = new Intl.NumberFormat(locale);
  return (
    <section
      className={`hero hero--news container${featured ? "" : " hero--text-only"}`}
      aria-label={t("news.tab")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="hero-copy" aria-live={rotating ? "off" : "polite"}>
        <span className="eyebrow">{t("news.tab")}</span>
        <h1>{post.content.title}</h1>
        <div className="accent-line" />
        <p>{post.content.excerpt}</p>
        <Link className="button arrow-link" href={href}>
          {t("news.read")}
          <ArrowLeft size={19} />
        </Link>
        <LinkArrow href="#journal">{t("journal.all")}</LinkArrow>
      </div>
      {featured && (
        <div className="hero-pictures">
          <Link href={href} className="hero-main-photo" aria-label={post.content.title}>
            <HeroPhoto cover={featured.cover} />
            <div>{t(post.content.categoryKey)} <ArrowUpLeft size={23} /></div>
          </Link>
          {next && (
            <div className="hero-side">
              <Link className="hero-next-story" href={newsHref(next.post.slug, locale)}>
                <HeroPhoto cover={next.cover} secondary />
                <span>{next.post.content.title}</span>
              </Link>
              <div className="slider-controls">
                <button type="button" aria-label={t("news.next")} onClick={() => setSelected((active + 1) % count)}>
                  <ArrowLeft />
                </button>
                <small>{number.format(active + 1)} / {number.format(count)}</small>
                <button type="button" aria-label={t("news.previous")} onClick={() => setSelected((active + count - 1) % count)}>
                  <ArrowLeft />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {count > 1 && (
        <div className="hero-bottom">
          <button
            className="hero-motion-toggle"
            type="button"
            onClick={() => {
              if (!playing) setFocused(false);
              setPlayPreference(!playing);
            }}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {t(playing ? "news.pauseRotation" : "news.playRotation")}
          </button>
          <div className="dots">
            {slides.map(({ post: item }, index) => (
              <button
                type="button"
                key={item.slug}
                aria-label={t("news.showNews", { number: number.format(index + 1) })}
                aria-pressed={active === index}
                className={active === index ? "active" : ""}
                onClick={() => setSelected(index)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
