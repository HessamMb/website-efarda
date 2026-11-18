import imageSizes from "@/public/images/news/manifest.json";
import type { Locale } from "@/i18n/provider";

type Localized<T> = Record<Locale, T>;
export type NewsImage = {
  src: string;
  width: number;
  height: number;
  alt: Localized<string>;
};
export type NewsPost = {
  id: string;
  categoryKey: string;
  title: Localized<string>;
  excerpt: Localized<string>;
  paragraphs: Localized<string[]>;
  images: NewsImage[];
  sourceUrl: string;
  sourceIsProfile?: boolean;
  imageNote?: Localized<string>;
  isSummary?: boolean;
};
function photo(
  name: keyof typeof imageSizes,
  fa: string,
  en: string,
): NewsImage {
  return {
    src: `/images/news/${name}.webp`,
    ...imageSizes[name],
    alt: { fa, en },
  };
}

// Curated company posts. Add a post here with its own source and matching photos.
// Dates are omitted unless an exact publication date has been verified.
export const newsPosts: NewsPost[] = [
  {
    id: "finex-exhibition",
    categoryKey: "news.category.exhibition",
    title: {
      fa: "حضور پرقدرت هلدینگ ارتباط فردا در نمایشگاه بین‌المللی صنعت مالی با معرفی محصولات و خدمات جدید",
      en: "Ertebat Farda Holding showcases new products and services at the international financial industry exhibition",
    },
    excerpt: {
      fa: "هلدینگ ارتباط فردا با همراهی شرکت‌های زیرمجموعه و مجموعه‌ای از محصولات، خدمات و راهکارهای جدید در هجدهمین نمایشگاه فینکس حضور یافته است.",
      en: "Ertebat Farda Holding and its subsidiaries are presenting new products, services and financial solutions at the 18th FINEX exhibition.",
    },
    paragraphs: {
      fa: [
        "هلدینگ ارتباط فردا در هجدهمین نمایشگاه بین‌المللی بورس، بانک و بیمه (فینکس)، با همراهی شرکت‌های زیرمجموعه و مجموعه‌ای از محصولات، خدمات و راهکارهای جدید در صنعت مالی حضور یافته است.",
        "این حضور با هدف معرفی تازه‌ترین دستاوردها، نمایش ظرفیت‌ها و توانمندی‌های شرکت‌های گروه و توسعه تعاملات و همکاری‌های راهبردی با فعالان صنعت مالی شکل گرفته است.",
        "ارتباط فردا در این دوره از نمایشگاه، با ارائه مجموعه‌ای از راهکارها و محصولات در حوزه‌های فناوری مالی، خدمات بانکی و پرداخت، بانکداری باز، مدیریت ارتباط با مشتریان و سایر خدمات نوین مالی، تلاش دارد تصویری جامع از ظرفیت‌های متنوع خود و شرکت‌های زیرمجموعه در توسعه زیست‌بوم خدمات مالی ارائه کند.",
        "حضور هم‌زمان شرکت‌های زیرمجموعه در کنار هلدینگ ارتباط فردا، فرصتی برای معرفی توانمندی‌های تخصصی، هم‌افزایی میان کسب‌وکارها و شناسایی زمینه‌های جدید همکاری با بانک‌ها، نهادهای مالی و سایر فعالان این صنعت فراهم کرده است.",
        "هلدینگ ارتباط فردا در این رویداد، ضمن معرفی محصولات و خدمات جدید، آماده گفت‌وگو با فعالان و متخصصان صنعت مالی و بررسی فرصت‌های همکاری و مشارکت‌های راهبردی است.",
        "از فعالان، متخصصان و علاقه‌مندان صنعت مالی دعوت می‌کنیم با حضور در غرفه ارتباط فردا، از نزدیک با محصولات، خدمات و ظرفیت‌های جدید این مجموعه و شرکت‌های زیرمجموعه آشنا شوند.",
      ],
      en: [
        "Ertebat Farda Holding is participating in the 18th International Stock Exchange, Banking and Insurance Exhibition (FINEX), alongside its subsidiaries, with a range of new financial industry products, services and solutions.",
        "The participation aims to introduce the group's latest achievements, showcase its companies' capabilities and develop strategic relationships with financial industry participants.",
        "Through solutions spanning financial technology, banking and payments, open banking, customer relationship management and other modern financial services, the holding is presenting the breadth of its contribution to the financial services ecosystem.",
        "Bringing the subsidiaries together creates opportunities to demonstrate their specialist capabilities, strengthen collaboration across businesses and identify new partnerships with banks, financial institutions and other industry participants.",
        "Alongside presenting new products and services, Ertebat Farda Holding welcomes conversations with financial industry professionals about cooperation and strategic partnerships.",
        "Industry professionals and visitors are invited to the Ertebat Farda booth to explore the group's new products, services and capabilities in person.",
      ],
    },
    images: [
      photo(
        "finex-booth",
        "غرفه هلدینگ ارتباط فردا در نمایشگاه صنعت مالی",
        "Ertebat Farda Holding's booth at the financial industry exhibition",
      ),
      photo(
        "finex-meetings",
        "نشست کاری در غرفه ارتباط فردا",
        "A business meeting at the Ertebat Farda booth",
      ),
      photo(
        "finex-visit",
        "بازدید از غرفه هلدینگ ارتباط فردا",
        "Visitors at the Ertebat Farda Holding booth",
      ),
      photo(
        "finex-discussion",
        "گفت‌وگو درباره محصولات و همکاری‌های مالی",
        "A discussion about financial products and partnerships",
      ),
      photo(
        "finex-lending",
        "فضای معرفی راهکارهای اعتباری در غرفه",
        "The booth's credit solutions presentation area",
      ),
      photo(
        "finex-roundtable",
        "گفت‌وگوی جمعی در غرفه ارتباط فردا",
        "A roundtable discussion at the Ertebat Farda booth",
      ),
      photo(
        "finex-partnerships",
        "نشست بررسی فرصت‌های همکاری در نمایشگاه",
        "A meeting to explore partnership opportunities at the exhibition",
      ),
      photo(
        "finex-attendees",
        "حضور در برنامه‌های نمایشگاه صنعت مالی",
        "Attending a financial industry exhibition session",
      ),
    ],
    sourceUrl: "https://www.linkedin.com/company/efarda-company/",
    sourceIsProfile: true,
  },
  {
    id: "co-banking",
    imageNote: {
      fa: "عکس سخنرانی ارسالی؛ تصویر آرشیوی",
      en: "Supplied archive photograph of a financial-industry talk",
    },
    categoryKey: "news.category.leadership",
    title: {
      fa: "هم‌بانکی؛ نگاه مدیرعامل هلدینگ ارتباط فردا به همکاری‌های راهبردی",
      en: "Co-banking: Ertebat Farda Holding's CEO on strategic collaboration",
    },
    excerpt: {
      fa: "مهدی باستان، مدیرعامل هلدینگ ارتباط فردا، در نشست هم‌بانکیِ رویداد تراکنش ایران، به بررسی اتحادهای راهبردی در صنعت بانکداری پرداخت.",
      en: "Mahdi Bastan, CEO of Ertebat Farda Holding, discussed strategic banking alliances at the Iran Transaction event's co-banking session.",
    },
    paragraphs: {
      fa: [
        "این نشست با حمایت هلدینگ ارتباط فردا برگزار شد. مهدی باستان و دیگر سخنرانان درباره همکاری بانک‌ها بر پایه توانمندی‌های مکمل و بازتعریف مرزهای بانکداری تبادل نظر کردند.",
        "این خبر، رویکرد مدیرعامل هلدینگ ارتباط فردا به گسترش همکاری‌های راهبردی در زیست‌بوم مالی را بازتاب می‌دهد.",
      ],
      en: [
        "Supported by Ertebat Farda Holding, the session explored collaboration built on complementary capabilities and the changing boundaries of banking.",
        "Bastan and fellow speakers discussed opportunities for strategic alliances across the financial ecosystem.",
      ],
    },
    images: [
      photo(
        "financial-event-speaker",
        "سخنرانی در یک رویداد صنعت مالی؛ تصویر ارسالی",
        "Speaking at a financial industry event; supplied photograph",
      ),
    ],
    sourceUrl: "https://ir.linkedin.com/company/efarda-company/",
    sourceIsProfile: true,
    isSummary: true,
  },
  {
    id: "ceo-appointment",
    categoryKey: "news.category.organization",
    title: {
      fa: "مهدی باستان، مدیرعامل هلدینگ ارتباط فردا شد",
      en: "Mahdi Bastan appointed CEO of Ertebat Farda Holding",
    },
    excerpt: {
      fa: "با حکم هیئت‌مدیره، مهدی باستان مسئولیت مدیرعاملی ارتباط فردا را بر عهده گرفت؛ مدیری با سابقه فعالیت در بانکداری و فناوری مالی.",
      en: "The board appointed Mahdi Bastan to lead Ertebat Farda, bringing experience in banking and financial technology.",
    },
    paragraphs: {
      fa: [
        "در اطلاع‌رسانی رسمی شرکت، سوابق مدیریتی باستان در شبکه بانکی و حوزه تحول دیجیتال معرفی شده است.",
        "توسعه راهکارهای نوآورانه و تقویت نقش ارتباط فردا در زیست‌بوم فناوری مالی، از محورهای مطرح‌شده در خبر این انتصاب است.",
      ],
      en: [
        "The company's announcement highlights his management background across banking and digital transformation.",
        "It identifies innovative financial solutions and a stronger role for Ertebat Farda in the financial technology ecosystem as priorities for the new leadership.",
      ],
    },
    images: [
      photo(
        "ceo-appointment",
        "تصویر منتشرشده همراه خبر رسمی انتصاب مدیرعامل ارتباط فردا",
        "Photograph published with the official Ertebat Farda CEO appointment announcement",
      ),
      photo(
        "ceo-appointment-team",
        "تصویر جمعی منتشرشده همراه خبر انتصاب",
        "Group photograph published with the appointment announcement",
      ),
    ],
    sourceUrl:
      "https://www.linkedin.com/posts/efarda-company_مهدی-باستان-به-عنوان-مدیرعامل-ارتباط-فردا-activity-7478342260904951809-e0a0",
    isSummary: true,
  },
];
