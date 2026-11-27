import Image from "next/image";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { LocaleProvider, type Locale } from "@/i18n/provider";
import "./company-group-page.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = basePath + "/images/company-group";
const pages = [
  ["جلد معرفی مدیران عامل و اعضای هیئت‌مدیره", "CEO and board member introduction cover"],
  ["نمودار شرکت‌ها و کسب‌وکارهای گروه ارتباط فردا", "Ertebat Farda group companies and businesses diagram"],
  ["مدیران ارتباط فردا", "Ertebat Farda leadership"],
  ["مدیران بهین فردا", "Behin Farda leadership"],
  ["مدیران پیپا", "Pipa leadership"],
  ["مدیران فینووا", "Finnova leadership"],
  ["مدیران فینوتک", "Finnotech leadership"],
  ["مدیران بامداد روشن", "Bamdad Roshan leadership"],
  ["مدیران سگال", "Segal leadership"],
] as const;

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
          width={220}
          height={76}
          alt=""
          unoptimized
        />
      </div>
    </div>
  );
}

export const companyGroupTitles = {
  fa: "هیئت‌مدیره و شرکت‌های گروه ارتباط فردا",
  en: "Ertebat Farda Group and Board Members",
};

export default function CompanyGroupPage({ locale }: { locale: Locale }) {
  const english = locale === "en";
  const homeHref = basePath + (english ? "/en/" : "/");

  return (
    <LocaleProvider locale={locale}>
      <SiteHeader homeHref={homeHref} languagePath="/company-group/" companyGroup />
      <main className="container company-group-document">
        <h1>{companyGroupTitles[locale]}</h1>
        {pages.map(([fa, en], index) => {
          const slide = (
            <Image
              className="company-group-slide"
              src={`${assetPath}/page-${index + 1}.webp`}
              width={1600}
              height={900}
              alt={english ? en : fa}
              loading={index === 0 ? "eager" : "lazy"}
              unoptimized
            />
          );

          if (index !== 1) return <div key={fa}>{slide}</div>;

          return (
            <div className="company-group-diagram" key={fa}>
              <label className="company-group-control">
                <input type="checkbox" />
                {english ? "Show the diagram without motion" : "نمایش ثابت نمودار"}
              </label>
              <div className="company-group-scene">
                {slide}
                <CompanyOrbits />
              </div>
            </div>
          );
        })}
      </main>
      <SiteFooter homeHref={homeHref} />
    </LocaleProvider>
  );
}
