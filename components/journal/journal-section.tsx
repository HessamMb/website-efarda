"use client";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Photo, LinkArrow } from "@/components/home-ui";
import NewsCarousel from "./news-carousel";
export default function JournalSection() {
  const { t: translate, i18n } = useTranslation();
  const [tab, setTab] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  return (
    <section id="journal" className="journal container section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{translate("journal.eyebrow")}</span>
          <h2>{translate("journal.title")}</h2>
        </div>
        <button
          className="arrow-link"
          onClick={() => {
            setTab(0);
            document
              .getElementById("reading")
              ?.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "auto"
                  : "smooth",
                block: "nearest",
              });
          }}
        >
          {translate("journal.all")}
          <ArrowLeft size={19} />
        </button>
      </div>
      <div
        className="tabs"
        role="tablist"
        aria-label={translate("a11y.articleCategories")}
      >
        {[
          translate("news.tab"),
          translate("journal.tabs.recommended"),
          translate("nav.productGuide"),
          translate("journal.tabs.digital"),
        ].map((t, i) => (
          <button
            key={t}
            role="tab"
            ref={(element) => {
              tabRefs.current[i] = element;
            }}
            tabIndex={tab === i ? 0 : -1}
            onKeyDown={(event) => {
              let next = i;
              const forward = i18n.dir() === "rtl" ? -1 : 1;
              if (event.key === "ArrowRight") next = (i + forward + 4) % 4;
              else if (event.key === "ArrowLeft") next = (i - forward + 4) % 4;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = 3;
              else return;
              event.preventDefault();
              setTab(next);
              tabRefs.current[next]?.focus();
            }}
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
        id="reading"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
      >
        {tab === 0 ? (
          <NewsCarousel />
        ) : (
          <div className="reading-panel">
            <Photo name="journal" alt={translate("images.journal")} />
            <div className="reading-feature">
              <span className="eyebrow">
                {
                  [
                    translate("journal.feature.labels.recommended"),
                    translate("journal.feature.labels.guide"),
                    translate("journal.feature.labels.digital"),
                  ][tab - 1]
                }
              </span>
              <h3>
                {
                  [
                    translate("journal.feature.titles.recommended"),
                    translate("journal.feature.titles.guide"),
                    translate("journal.feature.titles.digital"),
                  ][tab - 1]
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
        )}
      </div>
    </section>
  );
}
