import Image from "next/image";
import { companies, companyAssets as assetPath, companyDirectoryPath, companyHref } from "@/data/companies";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { LocaleProvider, type Locale } from "@/i18n/provider";
import "./company-group-page.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const orbits = [
  {
    name: "inner",
    companies: [
      "behin-farda", "finnotech", "pipa", "segal", "infono",
      "bamdad-roshan", "damavand", "finnova", "matn-dar", "cash-management",
    ],
  },
  {
    name: "outer",
    companies: [
      "iran-card", "hamrah-card", "uniti", "ghesta", "otaghak", "shoroo",
      "baghdasht", "nedaye-pardakht", "gateway", "pos", "bank-cards", "atm",
      "paydar", "tavanak",
    ],
  },
] as const;

function CompanyOrbits() {
  return (
    <div className="company-group-animation" aria-hidden="true">
      <div className="company-group-system">
        {orbits.map(({ name, companies }) => (
          <div className={`company-group-track company-group-track-${name}`} key={name}>
            {companies.map((company, index) => (
              <div
                className="company-group-position"
                key={company}
                style={{ rotate: `${index / companies.length}turn` }}
              >
                <div
                  className="company-group-planet"
                  style={{ rotate: `${-index / companies.length}turn` }}
                >
                  <Image
                    className="company-group-mark"
                    src={`${assetPath}/planet-${company}.webp`}
                    alt=""
                    fill
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
        <Image
          className="company-group-center"
          src={assetPath + "/orbit-center.webp"}
          width={560}
          height={191}
          alt=""
          unoptimized
        />
      </div>
    </div>
  );
}

export const companyGroupTitles = {
  fa: "شرکت‌های ما",
  en: "Our Companies",
};

export default function CompanyGroupPage({ locale }: { locale: Locale }) {
  const english = locale === "en";
  const homeHref = basePath + (english ? "/en/" : "/");

  return (
    <LocaleProvider locale={locale}>
      <SiteHeader homeHref={homeHref} languagePath={companyDirectoryPath} companyGroup />
      <main className="container company-group-document">
        <h1>{companyGroupTitles[locale]}</h1>
        <ul className="company-directory" role="list">
          {companies.map((company) => (
            <li key={company.slug}>
              <a href={companyHref(locale, company.slug)}>
                <span
                  className="company-directory-logo"
                  style={{ maskImage: `url("${assetPath}/${company.logo}.webp")` }}
                  aria-hidden="true"
                />
                <span>{company.name[locale]}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="company-group-diagram">
          <label className="company-group-control">
            <input type="checkbox" />
            {english ? "Show the diagram without motion" : "نمایش ثابت نمودار"}
          </label>
          <div className="company-group-scene">
            <Image
              className="company-group-slide"
              src={assetPath + "/page-2.webp"}
              width={2400}
              height={1350}
              alt={english ? "Ertebat Farda group companies and businesses diagram" : "نمودار شرکت‌ها و کسب‌وکارهای گروه ارتباط فردا"}
              unoptimized
            />
            <CompanyOrbits />
          </div>
        </div>
      </main>
      <SiteFooter homeHref={homeHref} />
    </LocaleProvider>
  );
}
