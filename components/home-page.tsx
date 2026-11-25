"use client";
import type { NewsCard } from "@/data/post-content";
import Image from "next/image";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { LocaleProvider, type Locale } from "@/i18n/provider";
import { LinkArrow } from "@/components/home-ui";
import { ContactSection, QuickLinks, SiteFooter, SiteHeader } from "@/components/site-chrome";
import NewsHero from "@/components/journal/news-hero";
import JournalSection from "@/components/journal/journal-section";
import {
  Sprout,
  Users,
  Sparkles,
  MessagesSquare,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import hamrahCard from "@/public/images/products/hamrah-card.webp";
import iranCard from "@/public/images/products/iran-card.webp";
import finnotech from "@/public/images/products/finnotech.webp";
import hamrahCardInHand from "@/public/images/products/hamrah-card-in-hand.webp";
import hamrahCardTransfer from "@/public/images/products/hamrah-card-transfer.webp";
import iranCardPlatinum from "@/public/images/products/iran-card-platinum.webp";
import finnotechOpenBanking from "@/public/images/products/finnotech-open-banking.webp";
import photoSizes from "@/public/images/news/manifest.json";

const companyPhotos = (["ceo-appointment-team", "finex-meetings", "finex-roundtable", "finex-booth"] as const)
  .map((name) => ({
    src: `/images/news/${name}.webp`,
    ...photoSizes[name],
  }));

function getContent(translate: TFunction) {
  const products = [
    {
      image: hamrahCard,
      label: translate("brand.hamrah"),
      title: translate("products.hamrah.title"),
      text: translate("products.hamrah.description"),
      href: "#hamrah",
    },
    {
      image: iranCard,
      label: translate("brand.iran"),
      title: translate("products.iran.title"),
      text: translate("products.iran.description"),
      href: "#iran",
    },
    {
      image: finnotech,
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
  const { t: translate } = useTranslation();
  const { products } = getContent(translate);
  return (
    <>
      <SiteHeader />
      <main>
        <NewsHero posts={news} />
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
              <article key={p.href}>
                <Image
                  className="photo"
                  src={p.image}
                  alt=""
                  sizes="(max-width: 599px) 92vw, (max-width: 1248px) 31vw, 378px"
                  quality={90}
                />
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
              <Image
                className="photo"
                src={hamrahCardTransfer}
                alt={translate("images.everyday")}
                sizes="(max-width: 599px) 92vw, (max-width: 1099px) 44vw, 310px"
                quality={90}
              />
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
              <Image
                className="photo"
                src={iranCardPlatinum}
                alt={translate("images.flowers")}
                sizes="(max-width: 599px) 92vw, (max-width: 1099px) 44vw, 310px"
                quality={90}
              />
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
              <Image
                className="photo"
                src={finnotechOpenBanking}
                alt={translate("images.solutions")}
                sizes="(max-width: 599px) 92vw, (max-width: 1099px) 44vw, 310px"
                quality={90}
              />
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
          <div className="promo-media">
            <Image
              src={hamrahCardInHand}
              alt={translate("images.app")}
              fill
              sizes="(max-width: 599px) 92vw, (max-width: 1248px) 37vw, 438px"
              quality={90}
            />
          </div>
          <div className="promo-copy">
            <span className="eyebrow">{translate("app.eyebrow")}</span>
            <h2>{translate("app.title")}</h2>
            <p>{translate("app.description")}</p>
            <LinkArrow href="#faq" className="button light">
              {translate("app.cta")}
            </LinkArrow>
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
              {companyPhotos.map(({ src, width, height }) => (
                <Image key={src} className="photo" src={src} width={width} height={height} alt="" sizes="(max-width: 599px) 45vw, 164px" />
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
