import Image from "next/image";
import CompanyLeadership from "@/components/company-leadership";
import NewsCardsGrid from "@/components/journal/news-cards-grid";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { boardMembers, boardRoles } from "@/data/company-board";
import { companies, companyAssets, companyDirectoryPath, companyHref } from "@/data/companies";
import { getCompanyNewsCards } from "@/data/published-news";
import { LocaleProvider, type Locale } from "@/i18n/provider";
import "./company-group-page.css";

export type CompanyRouteProps = { params: Promise<{ slug: string }> };

export function companyStaticParams() {
  return companies.map(({ slug }) => ({ slug }));
}

async function getCompany({ params }: CompanyRouteProps) {
  const { slug } = await params;
  const company = companies.find((entry) => entry.slug === slug);
  if (!company) notFound();
  return company;
}

export async function companyMetadata(props: CompanyRouteProps, locale: Locale) {
  const company = await getCompany(props);
  return { title: company.name[locale], description: company.description[locale] };
}

// Portrait numbers match the left-to-right positions in the source PDF.
const portraitsByPage: Record<number, number[]> = {
  3: [1, 2, 3, 4, 5],
  4: [1, 2, 3],
  5: [1, 2, 3, 4],
  6: [2, 3],
  7: [],
  8: [1, 2, 4],
  9: [],
};

export async function CompanyProfile({ locale, params }: CompanyRouteProps & { locale: Locale }) {
  const company = await getCompany({ params });
  const english = locale === "en";
  const homeHref = (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + (english ? "/en/" : "/");
  const logoMask = { maskImage: `url("${companyAssets}/${company.logo}.webp")` };
  const members = boardMembers[company.page]
    .map(([fa, en, role], index) => ({ name: english ? en : fa, role, portrait: index + 1 }))
    .reverse();
  const ceo = members.find((member) => member.role === "ceo");
  const directors = members.filter((member) => member.role !== "ceo");
  const news = getCompanyNewsCards(locale, company.slug);

  function portrait(member: (typeof members)[number], featured = false) {
    const hasPhoto = portraitsByPage[company.page].includes(member.portrait);
    return (
      <div className="company-profile-portrait" data-portrait={hasPhoto} aria-hidden="true">
        {hasPhoto ? (
          <Image
            src={`${companyAssets}/portraits/${company.page}-${member.portrait}.webp`}
            alt=""
            fill
            sizes={featured ? "(max-width: 599px) 58vw, 240px" : "(max-width: 599px) 45vw, 160px"}
            unoptimized
          />
        ) : <span className="company-profile-logo" style={logoMask} />}
      </div>
    );
  }

  return (
    <LocaleProvider locale={locale}>
      <SiteHeader
        homeHref={homeHref}
        languagePath={companyDirectoryPath + company.slug + "/"}
        companyGroup
        companySlug={company.slug}
      />
      <main className="container company-profile">
        <header className="company-profile-intro">
          <a className="company-profile-back" href={companyHref(locale)}>
            {english ? "Our Companies" : "شرکت‌های ما"}
          </a>
          <span className="company-directory-logo" style={logoMask} aria-hidden="true" />
          <h1>{company.name[locale]}</h1>
          <p>{company.description[locale]}</p>
        </header>

        <CompanyLeadership>
          {ceo && (
            <section className="company-profile-executive" aria-labelledby="company-ceo">
              {portrait(ceo, true)}
              <div>
                <h2 id="company-ceo">{boardRoles.ceo[locale]}</h2>
                <p>{ceo.name}</p>
              </div>
            </section>
          )}

          <section className="company-profile-board" aria-labelledby="company-board">
            <h2 id="company-board">{english ? "Board of Directors" : "اعضای هیئت‌مدیره"}</h2>
            <ul role="list">
              {directors.map((member) => (
                <li key={member.portrait}>
                  {portrait(member)}
                  <h3>{member.name}</h3>
                  <p>{boardRoles[member.role][locale]}</p>
                </li>
              ))}
            </ul>
          </section>
        </CompanyLeadership>
        {news.length > 0 && (
          <section className="company-profile-news" aria-labelledby="company-news">
            <h2 id="company-news">{english ? "Company News" : "اخبار شرکت"}</h2>
            <NewsCardsGrid items={news} locale={locale} />
          </section>
        )}
      </main>
      <SiteFooter homeHref={homeHref} />
    </LocaleProvider>
  );
}
