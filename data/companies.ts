import type { Locale } from "@/i18n/provider";

export const companies = [
  {
    slug: "ertebat-farda", page: 3, logo: "orbit-center",
    name: { fa: "ارتباط فردا", en: "Ertebat Farda" },
    description: {
      fa: "ارتباط فردا در حوزهٔ تجارت الکترونیکی و فناوری مالی فعالیت می‌کند. گروه با توسعهٔ محصولات و زیرساخت‌های پرداخت و بانکداری دیجیتال، به بانک‌ها، کسب‌وکارها و مشتریان خدمات می‌دهد.",
      en: "Ertebat Farda works in electronic commerce and financial technology. The group develops digital banking and payment products and infrastructure for banks, businesses and customers.",
    },
  },
  {
    slug: "behin-farda", page: 4, logo: "planet-behin-farda",
    name: { fa: "بهین فردا", en: "Behin Farda" },
    description: {
      fa: "توسعه فناوران بهین فردا در حوزهٔ خدمات دیجیتال بانکی و وفادارسازی مشتریان فعالیت می‌کند. ایران‌کارت از محصولات این شرکت است.",
      en: "Behin Farda develops digital banking and customer loyalty services. IranCard is one of its products.",
    },
  },
  {
    slug: "pipa", page: 5, logo: "planet-pipa",
    name: { fa: "فناوری همراه پیدا", en: "Pipa" },
    description: {
      fa: "فناوری همراه پیدا شرکت توسعه‌دهندهٔ همراه‌کارت است. همراه‌کارت خدمات پرداخت روزمره، از جمله انتقال وجه و پرداخت قبض را در موبایل ارائه می‌کند.",
      en: "Pipa develops Hamrah Card, a mobile app for everyday payments, including money transfers and bill payments.",
    },
  },
  {
    slug: "finnova", page: 6, logo: "planet-finnova",
    name: { fa: "فینووا", en: "Finnova" },
    description: {
      fa: "فینووا در حوزهٔ نوآوری و سرمایه‌گذاری گروه ارتباط فردا فعالیت می‌کند و از کسب‌وکارهای نوپا و راهکارهای تازه در صنعت مالی حمایت می‌کند.",
      en: "Finnova works on innovation and investment for Ertebat Farda Group, supporting startups and new solutions in financial services.",
    },
  },
  {
    slug: "finnotech", page: 7, logo: "planet-finnotech",
    name: { fa: "فینوتک", en: "Finnotech" },
    description: {
      fa: "فینوتک پلتفرم بانکداری باز گروه ارتباط فرداست. این پلتفرم به کسب‌وکارها امکان می‌دهد خدمات بانکی و مالی را از طریق API در محصولات خود به کار بگیرند.",
      en: "Finnotech is Ertebat Farda Group’s open banking platform. It lets businesses integrate banking and financial services into their products through APIs.",
    },
  },
  {
    slug: "bamdad-roshan", page: 8, logo: "planet-bamdad-roshan",
    name: { fa: "بامداد روشن", en: "Bamdad Roshan" },
    description: {
      fa: "بامداد روشن فردای آینده در تولید، توسعه و پشتیبانی تجهیزات پرداخت الکترونیکی فعالیت می‌کند. دستگاه‌های کارت‌خوان و خدمات پشتیبانی خودپرداز از حوزه‌های فعالیت این شرکت‌اند.",
      en: "Bamdad Roshan develops and supports electronic payment equipment, including payment terminals, and provides ATM support services.",
    },
  },
  {
    slug: "segal", page: 9, logo: "planet-segal",
    name: { fa: "سگال", en: "Segal" },
    description: {
      fa: "پیشگامان فناوری اطلاعات سگال از شرکت‌های گروه ارتباط فرداست و در زمینهٔ راهکارهای نرم‌افزاری بازار سرمایه، از جمله سامانه‌های معاملات آنلاین، فعالیت می‌کند.",
      en: "Segal IT Pioneers is part of Ertebat Farda Group and develops software for capital markets, including online trading systems.",
    },
  },
] as const;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const companyAssets = basePath + "/images/company-group";
export const companyDirectoryPath = "/company-group/";

export function companyHref(locale: Locale, slug?: string) {
  return basePath + (locale === "en" ? "/en" : "") + companyDirectoryPath + (slug ? `${slug}/` : "");
}
