"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  ArrowUp,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Handshake,
  Headphones,
  Menu,
  Network,
  Search,
  Smartphone,
  X,
  type LucideIcon,
} from "lucide-react";
import { LinkArrow } from "@/components/home-ui";
import { LanguageSwitch } from "@/i18n/provider";

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export function QuickLinks({
  footer = false,
  homeHref = "",
}: {
  footer?: boolean;
  homeHref?: string;
}) {
  const { t: translate } = useTranslation();
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
  return (
    <div className={footer ? "footer-shortcuts" : "quick-grid"}>
      {(footer ? footerQuick : quick).map(([Icon, title, text, href]) => (
        <a href={`${homeHref}${href}`} key={title}>
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
export function SiteHeader({
  homeHref = "",
  languagePath,
}: {
  homeHref?: string;
  languagePath?: string;
}) {
  const { t: translate } = useTranslation();
  const [menu, setMenu] = useState(false);
  return (
    <>
      <div id="top" className="topbar">
        <div className="container">
          <div className="top-links">
            <a href={`${homeHref}#about`}>{translate("nav.about")}</a>
            <a href={`${homeHref}#contact`}>{translate("nav.careers")}</a>
            <a href={`${homeHref}#contact`}>{translate("nav.contact")}</a>
          </div>
          <div className="language">
            <a href="#footer">{translate("nav.quickAccess")}</a>
            <LanguageSwitch path={languagePath} />
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <a href={homeHref || "#top"} aria-label={translate("a11y.home")}>
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
            <form action={`${homeHref}#products`} role="search">
              <input
                aria-label={translate("search.placeholder")}
                placeholder={translate("search.placeholder")}
              />
              <button aria-label={translate("a11y.search")}>
                <Search size={19} />
              </button>
            </form>
            <LinkArrow href={`${homeHref}#products`} className="button">
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
          <a href={homeHref || "#top"}>{translate("nav.home")}</a>
          <a href={`${homeHref}#products`}>
            {translate("nav.products")}
            <ChevronDown size={13} />
          </a>
          <a href={`${homeHref}#solutions`}>
            {translate("nav.solutions")}
            <ChevronDown size={13} />
          </a>
          <a href={`${homeHref}#contact`}>{translate("nav.partnership")}</a>
          <a
            href={`${homeHref}#journal`}
            aria-current={languagePath ? "location" : undefined}
          >
            {translate("nav.journal")}
          </a>
          <a href={`${homeHref}#contact`}>{translate("nav.getInTouch")}</a>
        </nav>
      </header>
    </>
  );
}

export function ContactSection() {
  const { t: translate } = useTranslation();
  return (
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
  );
}

export function SiteFooter({ homeHref = "" }: { homeHref?: string }) {
  const { t: translate } = useTranslation();
  return (
    <footer id="footer">
      <div className="container">
        <QuickLinks footer homeHref={homeHref} />
        <div className="footer-main">
          <div className="footer-brand">
            <a href={homeHref || "#top"}>
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
                    homeHref + (i === 0
                      ? j === 3
                        ? "#journal"
                        : "#about"
                      : i === 1
                        ? "#products"
                        : j === 3
                          ? "#faq"
                          : "#contact")
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
  );
}
