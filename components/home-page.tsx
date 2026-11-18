"use client";
import { useState } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { LocaleProvider, LanguageSwitch, type Locale } from "@/i18n/provider";
import Image from "next/image";
import homeImages from "@/public/images/home/manifest.json";
import {
  ArrowLeft,
  ArrowUp,
  ArrowUpLeft,
  ChevronDown,
  Search,
  Menu,
  X,
  Smartphone,
  CreditCard,
  Network,
  CircleHelp,
  Handshake,
  BookOpen,
  Building2,
  BriefcaseBusiness,
  Sprout,
  Users,
  Sparkles,
  MessagesSquare,
  Headphones,
  Wallet,
  ScanLine,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

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
  const quick: [LucideIcon, string, string, string][] = [
    [
      Smartphone,
      translate("brand.hamrah"),
      translate("shortcuts.hamrah.description"),
      "#hamrah",
    ],
    [
      CreditCard,
      translate("brand.iran"),
      translate("shortcuts.iran.description"),
      "#iran",
    ],
    [
      Network,
      translate("shortcuts.solutions.title"),
      translate("shortcuts.solutions.description"),
      "#solutions",
    ],
    [
      CircleHelp,
      translate("nav.productGuide"),
      translate("shortcuts.guide.description"),
      "#faq",
    ],
  ];
  const footerQuick: [LucideIcon, string, string, string][] = [
    quick[0],
    quick[1],
    [
      Handshake,
      translate("nav.partnership"),
      translate("shortcuts.partnership.description"),
      "#contact",
    ],
    [
      BookOpen,
      translate("nav.journal"),
      translate("shortcuts.journal.description"),
      "#journal",
    ],
    [
      Building2,
      translate("nav.about"),
      translate("shortcuts.about.description"),
      "#about",
    ],
    quick[2],
    quick[3],
    [
      BriefcaseBusiness,
      translate("nav.careers"),
      translate("shortcuts.careers.description"),
      "#contact",
    ],
  ];
  return { products, quick, footerQuick };
}
function Photo({
  name,
  alt,
  className = "",
  eager = false,
}: {
  name: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const image = homeImages[name as keyof typeof homeImages];
  const sizes = name.startsWith("portrait")
    ? "(max-width: 599px) 45vw, 164px"
    : "(max-width: 599px) calc(100vw - 40px), (max-width: 1099px) 55vw, 400px";
  return (
    <Image
      src={assetPath(`/images/home/${name}.webp`)}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      quality={90}
      loading={eager ? "eager" : "lazy"}
      className={`photo ${className}`}
    />
  );
}
function LinkArrow({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a className={`arrow-link ${className}`} href={href}>
      {children}
      <ArrowLeft size={19} />
    </a>
  );
}
function QuickLinks({ footer = false }: { footer?: boolean }) {
  const { t: translate } = useTranslation();
  const { quick, footerQuick } = getContent(translate);
  return (
    <div className={footer ? "footer-shortcuts" : "quick-grid"}>
      {(footer ? footerQuick : quick).map(([Icon, title, text, href]) => (
        <a href={href} key={title}>
          <Icon size={28} strokeWidth={1.4} />
          <div>
            <strong>{title}</strong>
            <small>{text}</small>
          </div>
        </a>
      ))}
    </div>
  );
}
export default function HomePage({ locale }: { locale: Locale }) {
  return (
    <LocaleProvider locale={locale}>
      <Home />
    </LocaleProvider>
  );
}
function Home() {
  const { t: translate, i18n } = useTranslation();
  const { products } = getContent(translate);
  const formatNumber = (number: number) =>
    new Intl.NumberFormat(i18n.language, { minimumIntegerDigits: 2 }).format(
      number,
    );
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState(0);
  const [slide, setSlide] = useState(0);
  const slides = ["hero", "everyday", "flowers", "solutions"];
  return (
    <>
      <div id="top" className="topbar">
        <div className="container">
          <div className="top-links">
            <a href="#about">{translate("nav.about")}</a>
            <a href="#contact">{translate("nav.careers")}</a>
            <a href="#contact">{translate("nav.contact")}</a>
          </div>
          <div className="language">
            <a href="#footer">{translate("nav.quickAccess")}</a>
            <LanguageSwitch />
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <a href="#top" aria-label={translate("a11y.home")}>
            <Image
              src={assetPath("/images/header/logo.png")}
              alt={translate("brand.name")}
              width={200}
              height={53}
              className="logo"
              preload
            />
          </a>
          <div className="header-actions">
            <form action="#products" role="search">
              <input
                aria-label={translate("search.placeholder")}
                placeholder={translate("search.placeholder")}
              />
              <button aria-label={translate("a11y.search")}>
                <Search size={19} />
              </button>
            </form>
            <LinkArrow href="#products" className="button">
              {translate("nav.ourProducts")}
            </LinkArrow>
          </div>
          <button
            className="mobile-toggle"
            aria-label={
              menu ? translate("a11y.closeMenu") : translate("a11y.openMenu")
            }
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        <nav
          aria-label={translate("a11y.mainNavigation")}
          className={`container navigation ${menu ? "is-open" : ""}`}
          onClick={() => setMenu(false)}
        >
          <a href="#top">{translate("nav.home")}</a>
          <a href="#products">
            {translate("nav.products")}
            <ChevronDown size={13} />
          </a>
          <a href="#solutions">
            {translate("nav.solutions")}
            <ChevronDown size={13} />
          </a>
          <a href="#contact">{translate("nav.partnership")}</a>
          <a href="#journal">{translate("nav.journal")}</a>
          <a href="#contact">{translate("nav.getInTouch")}</a>
        </nav>
      </header>
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow">{translate("hero.eyebrow")}</span>
            <h1>
              {translate("hero.titleFirst")}
              <br />
              {translate("hero.titleSecond")}
            </h1>
            <div className="accent-line" />
            <p>{translate("hero.description")}</p>
            <LinkArrow href="#about" className="button">
              {translate("hero.cta")}
            </LinkArrow>
          </div>
          <div className="hero-pictures">
            <a href="#about" className="hero-main-photo">
              <Photo
                eager
                name={slides[slide]}
                alt={translate("images.hero")}
              />
              <div>
                {translate("hero.caption")}
                <ArrowUpLeft size={23} />
              </div>
            </a>
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
              <div className="slider-controls">
                <button
                  aria-label={translate("a11y.nextSlide")}
                  onClick={() => setSlide((slide + 1) % 4)}
                >
                  <ArrowLeft />
                </button>
                <small>
                  {formatNumber(slide + 1)} / {formatNumber(4)}
                </small>
                <button
                  aria-label={translate("a11y.previousSlide")}
                  disabled={slide === 0}
                  onClick={() => setSlide((slide + 3) % 4)}
                >
                  <ArrowLeft />
                </button>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <small>{translate("brand.tagline")}</small>
            <div className="dots">
              {slides.map((s, i) => (
                <button
                  key={s}
                  aria-label={translate("a11y.showSlide", {
                    number: formatNumber(i + 1),
                  })}
                  aria-pressed={slide === i}
                  className={slide === i ? "active" : ""}
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
        <section id="journal" className="journal container section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{translate("journal.eyebrow")}</span>
              <h2>{translate("journal.title")}</h2>
            </div>
            <LinkArrow href="#reading">{translate("journal.all")}</LinkArrow>
          </div>
          <div
            className="tabs"
            role="tablist"
            aria-label={translate("a11y.articleCategories")}
          >
            {[
              translate("journal.tabs.recommended"),
              translate("nav.productGuide"),
              translate("journal.tabs.digital"),
            ].map((t, i) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === i}
                aria-controls="reading"
                id={`tab-${i}`}
                onClick={() => setTab(i)}
                className={tab === i ? "active" : ""}
              >
                {t}
              </button>
            ))}
          </div>
          <div
            className="reading-panel"
            id="reading"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
          >
            <Photo name="journal" alt={translate("images.journal")} />
            <div className="reading-feature">
              <span className="eyebrow">
                {
                  [
                    translate("journal.feature.labels.recommended"),
                    translate("journal.feature.labels.guide"),
                    translate("journal.feature.labels.digital"),
                  ][tab]
                }
              </span>
              <h3>
                {
                  [
                    translate("journal.feature.titles.recommended"),
                    translate("journal.feature.titles.guide"),
                    translate("journal.feature.titles.digital"),
                  ][tab]
                }
              </h3>
              <p>{translate("journal.feature.description")}</p>
              <LinkArrow href="#faq">{translate("journal.read")}</LinkArrow>
            </div>
            <div className="reading-list">
              {[
                translate("journal.articles.cashback"),
                translate("journal.articles.payments"),
                translate("journal.articles.literacy"),
              ].map((t, i) => (
                <a href="#faq" key={t}>
                  <strong>{t}</strong>
                  <small>
                    {
                      [
                        translate("journal.categories.iran"),
                        translate("solutions.hamrah.cta"),
                        translate("journal.categories.literacy"),
                      ][i]
                    }
                  </small>
                </a>
              ))}
            </div>
          </div>
        </section>
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
        <section id="contact" className="contact">
          <div className="container">
            <Headphones size={44} strokeWidth={1} />
            <div>
              <h2>{translate("contact.title")}</h2>
              <p>{translate("contact.description")}</p>
            </div>
            <LinkArrow href="mailto:info@efarda.ir" className="button outline">
              {translate("nav.getInTouch")}
            </LinkArrow>
          </div>
        </section>
      </main>
      <footer id="footer">
        <div className="container">
          <QuickLinks footer />
          <div className="footer-main">
            <div className="footer-brand">
              <a href="#top">
                <Image
                  src={assetPath("/images/header/logo.png")}
                  alt={translate("brand.name")}
                  width={208}
                  height={57}
                />
              </a>
              <p>{translate("footer.description")}</p>
              <small>{translate("brand.tagline")}</small>
            </div>
            {[
              [
                translate("footer.about"),
                translate("footer.aboutUs"),
                translate("shortcuts.about.description"),
                translate("about.eyebrow"),
                translate("nav.journal"),
              ],
              [
                translate("footer.products"),
                translate("brand.hamrah"),
                translate("brand.iran"),
                translate("footer.fintech"),
                translate("footer.guide"),
              ],
              [
                translate("footer.contact"),
                translate("nav.contact"),
                translate("footer.partnership"),
                translate("nav.careers"),
                translate("footer.faq"),
              ],
            ].map((group, i) => (
              <div className="footer-column" key={group[0]}>
                <h4>{group[0]}</h4>
                {group.slice(1).map((t, j) => (
                  <a
                    key={t}
                    href={
                      i === 0
                        ? j === 3
                          ? "#journal"
                          : "#about"
                        : i === 1
                          ? "#products"
                          : j === 3
                            ? "#faq"
                            : "#contact"
                    }
                  >
                    {t}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <small>{translate("footer.copyright")}</small>
            <div>
              <a href="#top" aria-label={translate("a11y.backToTop")}>
                <ArrowUp size={18} />
              </a>
              <span>{translate("footer.privacy")}</span>
              <span>{translate("footer.terms")}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
