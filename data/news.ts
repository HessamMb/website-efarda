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

// Initial content imported once when the editorial database is created.
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
        "محل حضور: نمایشگاه بین‌المللی تهران، سالن‌ ۱۰ و ۱۱",
      ],
      en: [
        "Ertebat Farda Holding is participating in the 18th International Stock Exchange, Banking and Insurance Exhibition (FINEX), alongside its subsidiaries, with a range of new financial industry products, services and solutions.",
        "The participation aims to introduce the group's latest achievements, showcase its companies' capabilities and develop strategic relationships with financial industry participants.",
        "Through solutions spanning financial technology, banking and payments, open banking, customer relationship management and other modern financial services, the holding is presenting the breadth of its contribution to the financial services ecosystem.",
        "Bringing the subsidiaries together creates opportunities to demonstrate their specialist capabilities, strengthen collaboration across businesses and identify new partnerships with banks, financial institutions and other industry participants.",
        "Venue: Tehran International Exhibition Center, Halls 10 and 11.",
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
    id: "iran-card-novin",
    categoryKey: "news.category.exhibition",
    title: {
      fa: "ایران‌کارت نوین در نمایشگاه تراکنش رونمایی شد",
      en: "Behin Farda unveils IranCard Novin at Iran Transaction",
    },
    excerpt: {
      fa: "محصول جدید بهین فردا، خدمات وفاداری چندبانکی را به امکانات مدیریت ثروت متصل می‌کند.",
      en: "Behin Farda’s new card connects multibank loyalty services with wealth management.",
    },
    paragraphs: {
      fa: [
        "بهین فردا در دوازدهمین نمایشگاه تراکنش ایران از ایران‌کارت نوین رونمایی کرد. مهدی باستان، مدیرعامل هلدینگ ارتباط فردا، پویان عطاآبادی، مدیرعامل بهین فردا، و جمعی از مدیران شرکت در این مراسم حضور داشتند.",
        "ایران‌کارت نوین برای ارائه خدمات به مشتریان بانک‌های مختلف طراحی شده است. با این مدل، بانک‌های مشارکت‌کننده می‌توانند خدمات وفاداری را در یک بستر مشترک به مشتریانشان ارائه دهند.",
        "اتصال کارت به پلتفرم مدیریت ثروت یکی دیگر از قابلیت‌های معرفی‌شده در مراسم بود. این قابلیت به مشتری امکان می‌دهد مبلغ بازگشتی از خرید را در مسیر پس‌انداز یا سرمایه‌گذاری به کار بگیرد.",
      ],
      en: [
        "Behin Farda introduced IranCard Novin at the 12th Iran Transaction exhibition. Ertebat Farda Holding CEO Mahdi Bastan, Behin Farda CEO Pouyan Ataabadi and other company executives attended the launch.",
        "The card is designed to serve customers from multiple banks. Participating banks can use the shared platform to offer loyalty services to their customers.",
        "The launch also introduced a connection to a wealth management platform. It gives customers a way to put cashback earned on purchases toward savings or investment.",
      ],
    },
    images: [photo("iran-card-novin-launch", "مراسم رونمایی از ایران‌کارت نوین در نمایشگاه تراکنش", "The IranCard Novin unveiling at the Iran Transaction exhibition")],
    sourceUrl: "https://negaheiraniannews.ir/رونمایی-از-ایران‌کارت-نوین-به-عنوان-نخستین-کارت-مولتی‌بانک-در-دوازدهمین-نمایشگاه-تراکنش-ایران",
    isSummary: true,
  },
  {
    id: "finonext-launch",
    categoryKey: "news.category.exhibition",
    title: {
      fa: "فینووا از برنامه سرمایه‌گذاری فینونکست رونمایی کرد",
      en: "Finnova introduces the FinoNext investment programme",
    },
    excerpt: {
      fa: "فینونکست برای شناسایی راهکارهای نوآورانه صنعت مالی و حمایت از توسعه آن‌ها از طریق سرمایه‌گذاری و دسترسی به بازار طراحی شده است.",
      en: "FinoNext is designed to identify financial innovations and help them grow through investment and access to markets.",
    },
    paragraphs: {
      fa: [
        "فینووا با حضور مدیرعامل هلدینگ ارتباط فردا، پوستر فینونکست را در رویداد تراکنش ایران معرفی کرد. این مجموعه رویدادها با هدف یافتن فرصت‌هایی شکل گرفته که توان نوآوری مالی و ظرفیت همکاری در زنجیره خدمات گروه را دارند.",
        "مهدی باستان توضیح داد که راهکارهای قابل استفاده در همکاری‌های هم‌بانکی از اولویت‌های گروه‌اند. فینووا قرار است به توسعه و تجاری‌سازی راهکارهای منتخب در صنعت مالی کمک کند.",
        "یاسر خانی، مدیرعامل فینووا، گفت برنامه حمایت علاوه بر سرمایه، شامل دسترسی به بازار، ابزارها و زیرساخت‌های گروه نیز می‌شود. به این ترتیب کسب‌وکارهای منتخب می‌توانند برای توسعه محصول و ورود به بازار از ظرفیت‌های ارتباط فردا و شبکه مالی استفاده کنند.",
      ],
      en: [
        "Finnova unveiled the FinoNext poster at the Iran Transaction event with the CEO of Ertebat Farda Holding in attendance. The series is intended to identify financial innovations with potential to work across the group’s service chain.",
        "Mahdi Bastan explained that solutions with practical applications in co-banking are a priority for the group. Finnova will help selected teams develop and commercialize those solutions in financial services.",
        "Finnova CEO Yaser Khani said the programme combines investment with access to markets, tools and group infrastructure. Selected businesses will be able to use Ertebat Farda’s capabilities and financial-industry network to develop products and take them to market.",
      ],
    },
    images: [photo("finonext-poster", "پوستر اصلی رویداد سرمایه‌گذاری فینونکست فینووا", "Official poster for Finnova’s FinoNext investment event")],
    sourceUrl: "https://www.parsine.com/fa/tiny/news-997072",
    isSummary: true,
  },
  {
    id: "co-banking",
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
        "نشست هم‌بانکی در روز دوم دوازدهمین رویداد تراکنش ایران با حمایت ارتباط فردا برگزار شد. محمد ربیع‌زاده، مهدی باستان، محمدعلی رستگار و پیام حنفی‌زاده درباره شیوه‌های همکاری میان بانک‌ها و دیگر بازیگران صنعت مالی گفت‌وگو کردند.",
        "مهدی باستان تفاوت برون‌سپاری با اتحاد راهبردی را توضیح داد. در برون‌سپاری، یک سازمان انجام خدمتی را واگذار می‌کند. در اتحاد راهبردی، شرکا توانمندی‌های مکمل خود را برای دستیابی به هدفی مشترک به کار می‌گیرند. او تعیین مسئولیت‌ها، هم‌سویی منافع و سازوکار روشن اداره همکاری را از شرایط پایداری این مدل دانست.",
        "به گفته باستان، همکاری می‌تواند ابتدا میان یک بانک و ارائه‌دهندگان خدمات در زنجیره ارزش آن آغاز شود و سپس به همکاری میان بانک‌ها گسترش یابد. او اجرای مرحله‌ای و شروع از حوزه‌هایی با حساسیت کمتر را پیشنهاد کرد.",
        "محمدعلی رستگار گفت بانک‌ها در عین رقابت می‌توانند در حوزه‌هایی که اشتراک منابع به کاهش هزینه یا بهبود عملیات کمک می‌کند، همکاری کنند. او عملیات و خدمات مالی را از زمینه‌هایی دانست که ظرفیت همکاری در آن‌ها فراتر از کنسرسیوم‌ها و تأمین مالی مشترک است.",
        "پیام حنفی‌زاده بر انتخاب شریک مناسب و مدیریت رابطه میان طرف‌ها تأکید کرد. او توضیح داد که استفاده از زیرساخت‌ها و تخصص مشترک می‌تواند سرمایه‌گذاری تکراری بانک‌ها را کاهش دهد و امکان توسعه خدمات جدید را فراهم کند.",
      ],
      en: [
        "Ertebat Farda supported a co-banking panel on the second day of the 12th Iran Transaction event. Mohammad Rabizadeh, Mahdi Bastan, Mohammadali Rastegar and Payam Hanafizadeh discussed ways for banks and other financial-services organizations to work together.",
        "Bastan distinguished outsourcing, where a service is delegated, from strategic alliances, where partners combine complementary strengths to pursue a shared goal. He identified aligned interests, defined responsibilities and clear governance as conditions for lasting cooperation.",
        "He proposed starting with partnerships between a bank and providers in its service chain, then extending the approach to cooperation between banks. He also recommended a phased rollout that starts in less sensitive areas.",
        "Rastegar explained that banks can continue to compete while sharing resources in areas where cooperation lowers costs or improves operations. He saw opportunities in operational and financial services beyond traditional consortia and joint financing.",
        "Hanafizadeh emphasized partner selection and relationship management. He noted that access to shared infrastructure and specialist expertise could reduce duplicated investment while helping banks develop new services.",
      ],
    },
    images: [photo("co-banking-panel", "سخنرانان نشست هم‌بانکی در رویداد تراکنش ایران", "Speakers at the co-banking panel at Iran Transaction")],
    sourceUrl: "https://mehrnews.com/x3dxwG",
    isSummary: true,
  },
  {
    id: "hamrah-peyda-ceo",
    categoryKey: "news.category.leadership",
    title: {
      fa: "صدرا بابایی مدیرعامل فناوری همراه پیدا شد",
      en: "Sadra Babaei appointed CEO of Pipa",
    },
    excerpt: {
      fa: "صدرا بابایی با حکم مدیرعامل هلدینگ ارتباط فردا، مسئولیت مدیریت شرکت فناوری همراه پیدا، توسعه‌دهنده همراه‌کارت، را بر عهده گرفت.",
      en: "Ertebat Farda Holding appointed Sadra Babaei to lead Pipa, the company behind Hamrah Card.",
    },
    paragraphs: {
      fa: [
        "مهدی باستان، مدیرعامل هلدینگ ارتباط فردا، صدرا بابایی را به مدیرعاملی شرکت فناوری همراه پیدا منصوب کرد. با این انتصاب، بابایی جایگزین محمد رشیدی کوچکی شد.",
        "بابایی پیش از پیوستن به همراه پیدا، مدیریت کارخانه هوشمندسازی و نوآوری امید بانک سپه را بر عهده داشت. او با این سابقه وارد شرکتی شد که محصول اصلی آن همراه‌کارت، اپلیکیشن خدمات پرداخت موبایلی، است.",
      ],
      en: [
        "Mahdi Bastan, CEO of Ertebat Farda Holding, appointed Sadra Babaei chief executive of Pipa. Babaei succeeds Mohammad Rashidi Kouchaki.",
        "Babaei previously led Bank Sepah’s Omid innovation and digital transformation center. His new role puts him in charge of the company that develops Hamrah Card, a mobile payments app.",
      ],
    },
    images: [photo("hamrah-peyda-appointment", "صدرا بابایی در کنار مهدی باستان در مراسم انتصاب", "Sadra Babaei with Mahdi Bastan at the appointment ceremony")],
    sourceUrl: "https://petrochemiha.ir/صدرا-بابایی-مدیرعامل-همراه-کارت-شد؛-تغ/",
    isSummary: true,
  },
  {
    id: "hamrah-peyda-performance-review",
    categoryKey: "news.category.organization",
    title: {
      fa: "مدیران همراه پیدا عملکرد شرکت را بررسی کردند",
      en: "Pipa leadership reviews company performance",
    },
    excerpt: {
      fa: "مدیران ارتباط فردا و همراه پیدا، پروژه‌های جاری همراه‌کارت و برنامه توسعه کسب‌وکار آن را مرور کردند.",
      en: "Ertebat Farda and Pipa leadership reviewed ongoing Hamrah Card projects and plans for business development.",
    },
    paragraphs: {
      fa: [
        "جلسه ارزیابی عملکرد فناوری همراه پیدا با حضور مهدی باستان، مدیرعامل هلدینگ ارتباط فردا، و مدیرعامل، اعضای هیئت‌مدیره و جمعی از مدیران همراه پیدا برگزار شد.",
        "حاضران عملکرد شرکت، برنامه‌های توسعه و وضعیت پروژه‌های در حال اجرای همراه‌کارت را بررسی کردند. مدیران همچنین جهت‌گیری توسعه کسب‌وکار این اپلیکیشن پرداخت را مرور کردند.",
      ],
      en: [
        "Pipa’s performance review brought together Ertebat Farda Holding CEO Mahdi Bastan, Pipa’s CEO and board, and members of the company’s management team.",
        "Participants reviewed company performance, development plans and projects underway for Hamrah Card. They also discussed the direction of business development for the mobile payments app.",
      ],
    },
    images: [
      photo("hamrah-peyda-review-meeting", "جلسه ارزیابی عملکرد شرکت فناوری همراه پیدا", "Pipa’s performance review meeting"),
      photo("hamrah-peyda-review-app", "نمایش همراه‌کارت در جلسه ارزیابی شرکت", "Hamrah Card shown during the company review"),
    ],
    sourceUrl: "https://www.linkedin.com/posts/efarda-company_برگزاری-جلسه-ارزیابی-عملکرد-همراه-پیدا-با-activity-7484882759027613697-P5xt",
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
