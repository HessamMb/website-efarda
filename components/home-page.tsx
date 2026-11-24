"use client";
import { newsHref, type NewsCard } from "@/data/post-content";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { LocaleProvider, type Locale } from "@/i18n/provider";
import { Photo, LinkArrow } from "@/components/home-ui";
import { ContactSection, QuickLinks, SiteFooter, SiteHeader } from "@/components/site-chrome";
import JournalSection from "@/components/journal/journal-section";
import {
  ArrowLeft,
  ArrowUpLeft,
  Smartphone,
  Sprout,
  Users,
  Sparkles,
  MessagesSquare,
  Wallet,
  ScanLine,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

function getContent(translate: TFunction) {
  const products = [
    {
      image: "payment",
      label: translate("brand.hamrah"),
      title: translate("products.hamrah.title"),
      text: translate("products.hamrah.description"),
      href: "#hamrah",
    },
    {
      image: "shopping",
      label: translate("brand.iran"),
      title: translate("products.iran.title"),
      text: translate("products.iran.description"),
      href: "#iran",
    },
    {
      image: "business",
      label: translate("brand.fintech"),
      title: translate("products.fintech.title"),
      text: translate("products.fintech.description"),
      href: "#solutions",
    },
  ];
  return { products };
}
export default function HomePage({ locale, news }: { locale: Locale; news: NewsCard[] }) {
  return (
    <LocaleProvider locale={locale}>
      <Home news={news} />
    </LocaleProvider>
  );
}
function Home({ news }: { news: NewsCard[] }) {
  const { t: translate, i18n } = useTranslation();
  const { products } = getContent(translate);
  const formatNumber = (number: number) =>
    new Intl.NumberFormat(i18n.language, { minimumIntegerDigits: 2 }).format(
      number,
    );
  const [slide, setSlide] = useState(0);
  const slides = news.slice(0, 5);
  const slideCount = Math.max(slides.length, 1);
  const activeSlide = slide % slideCount;
  const featured = slides[activeSlide];
  const cover = featured?.content.images[0];
  const href = featured ? newsHref(featured.slug, i18n.language as Locale) : "#about";
  return (
    <>
      <SiteHeader />
      <main>
        <section className={`hero container${featured ? " hero--news" : ""}`}>
          <div className="hero-copy">
            <span className="eyebrow">{translate(featured ? "news.tab" : "hero.eyebrow")}</span>
            <h1 aria-live="polite">
              {featured ? featured.content.title : (
                <>{translate("hero.titleFirst")}<br />{translate("hero.titleSecond")}</>
              )}
            </h1>
            <div className="accent-line" />
            <p>{featured ? featured.content.excerpt : translate("hero.description")}</p>
            <Link className="button arrow-link" href={href}>
              {translate(featured ? "news.read" : "hero.cta")}
              <ArrowLeft size={19} />
            </Link>
            {featured && <LinkArrow href="#journal">{translate("journal.all")}</LinkArrow>}
          </div>
          <div className="hero-pictures">
            <Link href={href} className="hero-main-photo">
              {cover ? (
                <Image
                  className="photo"
                  src={cover.src}
                  alt={cover.alt}
                  width={cover.width}
                  height={cover.height}
                  sizes="(max-width: 599px) 90vw, (max-width: 1099px) 55vw, 366px"
                  loading="eager"
                  quality={90}
                  unoptimized={cover.src.startsWith("/api/post-images/")}
                />
              ) : <Photo eager name="hero" alt={translate("images.hero")} />}
              <div>
                {translate(featured ? featured.content.categoryKey : "hero.caption")}
                <ArrowUpLeft size={23} />
              </div>
            </Link>
            <div className="anniversary">
              <div className="building">
                <Photo name="building" alt={translate("images.building")} />
                <div className="anniversary-label">
                  <b>{translate("hero.years")}</b>
                  <strong>
                    {translate("hero.yearsCaptionFirst")}
                    <br />
                    {translate("hero.yearsCaptionSecond")}
                  </strong>
                </div>
              </div>
              {slides.length > 1 && (
                <div className="slider-controls">
                  <button
                    aria-label={translate("news.next")}
                    onClick={() => setSlide((activeSlide + 1) % slideCount)}
                  >
                    <ArrowLeft />
                  </button>
                  <small>{formatNumber(activeSlide + 1)} / {formatNumber(slideCount)}</small>
                  <button
                    aria-label={translate("news.previous")}
                    onClick={() => setSlide((activeSlide + slideCount - 1) % slideCount)}
                  >
                    <ArrowLeft />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="hero-bottom">
            <small>{translate("brand.tagline")}</small>
            <div className="dots">
              {slides.length > 1 && slides.map((item, i) => (
                <button
                  key={item.slug}
                  aria-label={translate("news.showNews", {
                    number: formatNumber(i + 1),
                  })}
                  aria-pressed={activeSlide === i}
                  className={activeSlide === i ? "active" : ""}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="quick-band">
          <div className="container">
            <QuickLinks />
          </div>
        </section>
        <section id="products" className="products container section">
          <div className="section-heading">
            <h2>{translate("products.title")}</h2>
            <LinkArrow href="#solutions">{translate("products.all")}</LinkArrow>
          </div>
          <div className="product-grid">
            {products.map((p) => (
              <article key={p.image}>
                <Photo name={p.image} alt={p.title} />
                <span className="eyebrow">{p.label}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <LinkArrow href={p.href}>
                  {translate("common.learnMore")}
                </LinkArrow>
              </article>
            ))}
          </div>
        </section>
        <section id="solutions" className="solutions">
          <div className="container solutions-layout">
            <div className="solutions-intro">
              <span className="eyebrow">{translate("solutions.eyebrow")}</span>
              <h2>{translate("solutions.title")}</h2>
              <div className="accent-line" />
              <p>{translate("solutions.description")}</p>
            </div>
            <article id="hamrah" className="solution solution-one">
              <Photo name="everyday" alt={translate("images.everyday")} />
              <div>
                <span className="eyebrow">
                  {translate("solutions.hamrah.label")}
                </span>
                <h3>{translate("solutions.hamrah.title")}</h3>
                <p>{translate("solutions.hamrah.description")}</p>
                <LinkArrow href="#app" className="button light">
                  {translate("solutions.hamrah.cta")}
                </LinkArrow>
              </div>
            </article>
            <article id="iran" className="solution solution-two">
              <Photo name="flowers" alt={translate("images.flowers")} />
              <div>
                <span className="eyebrow">
                  {translate("solutions.iran.label")}
                </span>
                <h3>{translate("solutions.iran.title")}</h3>
                <p>{translate("solutions.iran.description")}</p>
                <LinkArrow href="#journal" className="button light">
                  {translate("solutions.iran.cta")}
                </LinkArrow>
              </div>
            </article>
            <article className="solution solution-three">
              <Photo name="solutions" alt={translate("images.solutions")} />
              <div>
                <span className="eyebrow">
                  {translate("solutions.fintech.label")}
                </span>
                <h3>{translate("solutions.fintech.title")}</h3>
                <p>{translate("solutions.fintech.description")}</p>
                <LinkArrow href="#contact" className="button light">
                  {translate("solutions.fintech.cta")}
                </LinkArrow>
              </div>
            </article>
            <div className="solutions-end">
              <h4>{translate("solutions.closing")}</h4>
              <LinkArrow href="#contact">
                {translate("solutions.all")}
              </LinkArrow>
            </div>
          </div>
        </section>
        <JournalSection news={news} />
        <section id="app" className="app-promo container">
          <Photo name="app" alt={translate("images.app")} />
          <div className="promo-copy">
            <span className="eyebrow">{translate("app.eyebrow")}</span>
            <h2>{translate("app.title")}</h2>
            <p>{translate("app.description")}</p>
            <LinkArrow href="#faq" className="button light">
              {translate("app.cta")}
            </LinkArrow>
          </div>
          <div className="phone-wrap">
            <div className="phone">
              <div className="phone-speaker" />
              <h3>{translate("brand.hamrah")}</h3>
              <div className="phone-card">
                <Smartphone />
                <span>{translate("app.phoneCard")}</span>
              </div>
              <div className="phone-tools">
                <Wallet />
                <ScanLine />
              </div>
              <small>{translate("app.phoneDisclaimer")}</small>
            </div>
          </div>
        </section>
        <section id="about" className="about">
          <div className="container about-inner">
            <div className="about-copy">
              <span className="eyebrow">{translate("about.eyebrow")}</span>
              <h2>{translate("about.title")}</h2>
              <p>{translate("about.description")}</p>
              <div className="values">
                {[
                  [Sprout, translate("about.values.future")],
                  [Users, translate("about.values.people")],
                  [Sparkles, translate("about.values.simplicity")],
                ].map(([Icon, t]) => {
                  const I = Icon as LucideIcon;
                  return (
                    <div key={String(t)}>
                      <I size={28} strokeWidth={1.4} />
                      <strong>{String(t)}</strong>
                    </div>
                  );
                })}
              </div>
              <LinkArrow href="#contact">{translate("about.cta")}</LinkArrow>
            </div>
            <div className="portraits">
              {[1, 2, 3, 4].map((i) => (
                <Photo
                  key={i}
                  name={`portrait${i}`}
                  alt={translate("images.portraits")}
                />
              ))}
            </div>
            <div className="about-motto">{translate("about.motto")}</div>
          </div>
        </section>
        <section id="faq" className="faq container section">
          <div className="faq-intro">
            <MessagesSquare size={30} strokeWidth={1.3} />
            <h2>{translate("faq.title")}</h2>
            <p>{translate("faq.description")}</p>
            <LinkArrow href="#products">
              {translate("nav.productGuide")}
            </LinkArrow>
          </div>
          <div className="questions">
            {[
              [
                translate("faq.hamrah.question"),
                translate("faq.hamrah.answer"),
              ],
              [translate("faq.iran.question"), translate("faq.iran.answer")],
              [
                translate("faq.solutions.question"),
                translate("faq.solutions.answer"),
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  <Plus size={27} />
                  {q}
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
