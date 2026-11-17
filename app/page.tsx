"use client";
import { useState } from "react";
import Image from "next/image";
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

const products = [
  {
    image: "payment",
    label: "همراه کارت",
    title: "یک همراه، برای پرداخت‌های کوچک",
    text: "همراه کارت؛ اپلیکیشنی برای پرداخت خرد و کارهای کوچک هر روز شما.",
    href: "#hamrah",
  },
  {
    image: "shopping",
    label: "ایران کارت",
    title: "خرید، با حس خوب برگشت پول",
    text: "با مفهوم برگشت پول آشنا شوید؛ نگاهی تازه به تجربه خرید با ایران کارت.",
    href: "#iran",
  },
  {
    image: "business",
    label: "فناوری مالی",
    title: "فردا، از امروز ساخته می‌شود",
    text: "راهکارهایی برای پیوند دادن فناوری، کسب‌وکار و نیازهای مالی روزمره.",
    href: "#solutions",
  },
];
const quick: [LucideIcon, string, string, string][] = [
  [Smartphone, "همراه کارت", "همراه پرداخت‌های خرد", "#hamrah"],
  [CreditCard, "ایران کارت", "تجربه برگشت پول", "#iran"],
  [Network, "راهکارهای مالی", "برای کسب‌وکارها", "#solutions"],
  [CircleHelp, "راهنمای محصولات", "پاسخ به پرسش‌های شما", "#faq"],
];
const footerQuick: [LucideIcon, string, string, string][] = [
  quick[0],
  quick[1],
  [Handshake, "همکاری با ما", "شروع یک گفت‌وگوی تازه", "#contact"],
  [BookOpen, "مجله فردا", "خواندنی‌های فناوری مالی", "#journal"],
  [Building2, "درباره ارتباط فردا", "داستان ۱۵ سال همراهی", "#about"],
  quick[2],
  quick[3],
  [BriefcaseBusiness, "فرصت‌های شغلی", "هم‌مسیر با فردا", "#contact"],
];
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
  return (
    <Image
      src={assetPath(`/images/home/${name}.webp`)}
      alt={alt}
      width={600}
      height={600}
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
export default function Home() {
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState(0);
  const [slide, setSlide] = useState(0);
  const slides = ["hero", "everyday", "flowers", "solutions"];
  return (
    <>
      <div id="top" className="topbar">
        <div className="container">
          <div className="top-links">
            <a href="#about">درباره ارتباط فردا</a>
            <a href="#contact">فرصت‌های شغلی</a>
            <a href="#contact">تماس با ما</a>
          </div>
          <div className="language">
            <a href="#footer">دسترسی آسان</a>
            <span>EN</span>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-main">
          <a href="#top" aria-label="ارتباط فردا، خانه">
            <Image
              src={assetPath("/images/header/logo.png")}
              alt="ارتباط فردا"
              width={200}
              height={53}
              className="logo"
              preload
            />
          </a>
          <div className="header-actions">
            <form action="#products" role="search">
              <input
                aria-label="جستجو در ارتباط فردا"
                placeholder="جستجو در ارتباط فردا"
              />
              <button aria-label="جستجو">
                <Search size={19} />
              </button>
            </form>
            <LinkArrow href="#products" className="button">
              محصولات ما
            </LinkArrow>
          </div>
          <button
            className="mobile-toggle"
            aria-label={menu ? "بستن فهرست" : "باز کردن فهرست"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        <nav
          aria-label="فهرست اصلی"
          className={`container navigation ${menu ? "is-open" : ""}`}
          onClick={() => setMenu(false)}
        >
          <a href="#top">خانه</a>
          <a href="#products">
            محصولات <ChevronDown size={13} />
          </a>
          <a href="#solutions">
            راهکارها <ChevronDown size={13} />
          </a>
          <a href="#contact">همکاری با ما</a>
          <a href="#journal">مجله فردا</a>
          <a href="#contact">ارتباط با ما</a>
        </nav>
      </header>
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow">
              ارتباط فردا؛ همراه تجربه‌های مالی روزمره
            </span>
            <h1>
              ۱۵ سال ارتباط،
              <br />
              رو به فردا
            </h1>
            <div className="accent-line" />
            <p>
              از پرداخت‌های کوچک تا تجربه‌های تازه از خرید؛ با فناوری مالی، راهی
              ساده‌تر به فردا می‌سازیم.
            </p>
            <LinkArrow href="#about" className="button">
              داستان ارتباط فردا
            </LinkArrow>
          </div>
          <div className="hero-pictures">
            <a href="#about" className="hero-main-photo">
              <Photo
                eager
                name={slides[slide]}
                alt="تجربه ساده فناوری در زندگی روزمره"
              />
              <div>
                فناوری، نزدیک‌تر به زندگی
                <ArrowUpLeft size={23} />
              </div>
            </a>
            <div className="anniversary">
              <div className="building">
                <picture>
                  <source
                    media="(max-width: 599px)"
                    srcSet={assetPath("/images/home/building-mobile.webp")}
                  />
                  <source
                    media="(max-width: 1099px)"
                    srcSet={assetPath("/images/home/building-tablet.webp")}
                  />
                  <img
                    src={assetPath("/images/home/building.webp")}
                    alt="۱۵ سال تجربه ارتباط فردا؛ رو به افق‌های تازه"
                    width="216"
                    height="302"
                    className="photo"
                  />
                </picture>
              </div>
              <div className="slider-controls">
                <button
                  aria-label="اسلاید بعدی"
                  onClick={() => setSlide((slide + 1) % 4)}
                >
                  <ArrowLeft />
                </button>
                <small>۰{slide + 1} / ۰۴</small>
                <button
                  aria-label="اسلاید قبلی"
                  disabled={slide === 0}
                  onClick={() => setSlide((slide + 3) % 4)}
                >
                  <ArrowLeft />
                </button>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <small>همراه امروز، در ارتباط با فردا</small>
            <div className="dots">
              {slides.map((s, i) => (
                <button
                  key={s}
                  aria-label={`نمایش اسلاید ${i + 1}`}
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
            <h2>برای لحظه‌های واقعی زندگی</h2>
            <LinkArrow href="#solutions">همه محصولات</LinkArrow>
          </div>
          <div className="product-grid">
            {products.map((p) => (
              <article key={p.image}>
                <Photo name={p.image} alt={p.title} />
                <span className="eyebrow">{p.label}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <LinkArrow href={p.href}>بیشتر آشنا شوید</LinkArrow>
              </article>
            ))}
          </div>
        </section>
        <section id="solutions" className="solutions">
          <div className="container solutions-layout">
            <div className="solutions-intro">
              <span className="eyebrow">دنیای راهکارهای ارتباط فردا</span>
              <h2>فناوری در جریان زندگی</h2>
              <div className="accent-line" />
              <p>
                از نیازهای کوچک هر روز تا مسیر رشد کسب‌وکار؛ راهکارهای ما را از
                دریچه زندگی کشف کنید.
              </p>
            </div>
            <article id="hamrah" className="solution solution-one">
              <Photo name="everyday" alt="پرداخت روزمره با همراه کارت" />
              <div>
                <span className="eyebrow">۰۱ / همراه کارت</span>
                <h3>پرداخت‌های روزمره، نزدیک‌تر از همیشه</h3>
                <p>
                  برای کارهای کوچک هر روز، یک همراه ساده داشته باشید. همراه
                  کارت، اپلیکیشن پرداخت‌های خرد است.
                </p>
                <LinkArrow href="#app" className="button light">
                  آشنایی با همراه کارت
                </LinkArrow>
              </div>
            </article>
            <article id="iran" className="solution solution-two">
              <Photo name="flowers" alt="خرید گل با ایران کارت" />
              <div>
                <span className="eyebrow">۰۲ / ایران کارت</span>
                <h3>از خرید امروز، حس خوب فردا</h3>
                <p>
                  ایران کارت، محصول برگشت پول ارتباط فرداست؛ برای آشنایی با
                  تجربه‌ای متفاوت از خرید، از اینجا شروع کنید.
                </p>
                <LinkArrow href="#journal" className="button light">
                  کشف ایران کارت
                </LinkArrow>
              </div>
            </article>
            <article className="solution solution-three">
              <Photo
                name="solutions"
                alt="گفت‌وگو درباره راهکارهای فناوری مالی"
              />
              <div>
                <span className="eyebrow">۰۳ / فناوری مالی</span>
                <h3>پیوندی میان ایده و تجربه</h3>
                <p>
                  از شناخت نیاز تا طراحی تجربه؛ با راهکارهای فناوری مالی ارتباط
                  فردا و مسیر همکاری با ما آشنا شوید.
                </p>
                <LinkArrow href="#contact" className="button light">
                  مشاهده راهکارها
                </LinkArrow>
              </div>
            </article>
            <div className="solutions-end">
              <h4>برای امروز شما، با نگاه به فردا</h4>
              <LinkArrow href="#contact">همه راهکارهای ارتباط فردا</LinkArrow>
            </div>
          </div>
        </section>
        <section id="journal" className="journal container section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">خواندنی‌های ارتباط فردا</span>
              <h2>برای انتخاب‌های آگاهانه‌تر</h2>
            </div>
            <LinkArrow href="#reading">همه خواندنی‌ها</LinkArrow>
          </div>
          <div
            className="tabs"
            role="tablist"
            aria-label="دسته‌بندی خواندنی‌ها"
          >
            {["پیشنهاد مطالعه", "راهنمای محصولات", "تجربه دیجیتال"].map(
              (t, i) => (
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
              ),
            )}
          </div>
          <div
            className="reading-panel"
            id="reading"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
          >
            <Photo name="journal" alt="فناوری در کنار لحظه‌های زندگی" />
            <div className="reading-feature">
              <span className="eyebrow">
                {
                  [
                    "پرونده ویژه / زندگی و فناوری",
                    "راهنمای استفاده از محصولات",
                    "زندگی روزمره / تجربه دیجیتال",
                  ][tab]
                }
              </span>
              <h3>
                {
                  [
                    "وقتی فناوری، زبان زندگی را می‌فهمد",
                    "همراهی ساده برای پرداخت‌های روزمره",
                    "انتخاب‌های آگاهانه در دنیای دیجیتال",
                  ][tab]
                }
              </h3>
              <p>
                تجربه مالی خوب از شناخت نیازهای واقعی شروع می‌شود؛ نگاهی به نقش
                سادگی در محصولاتی که هر روز استفاده می‌کنیم.
              </p>
              <LinkArrow href="#faq">خواندن این مطلب</LinkArrow>
            </div>
            <div className="reading-list">
              {[
                "برگشت پول چیست و چه تفاوتی با تخفیف دارد؟",
                "پرداخت خرد؛ بخش کوچک اما مهم زندگی روزمره",
                "چند نکته ساده برای استفاده آگاهانه از اپلیکیشن‌های مالی",
              ].map((t, i) => (
                <a href="#faq" key={t}>
                  <strong>{t}</strong>
                  <small>
                    {
                      [
                        "راهنمای ایران کارت",
                        "آشنایی با همراه کارت",
                        "سواد مالی دیجیتال",
                      ][i]
                    }
                  </small>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section id="app" className="app-promo container">
          <Photo name="app" alt="همراه کارت، همراه لحظه‌های ساده" />
          <div className="promo-copy">
            <span className="eyebrow">همراه کارت / پرداخت خرد</span>
            <h2>همراه روزهای شلوغ، نزدیک لحظه‌های ساده</h2>
            <p>
              یک اپلیکیشن برای پرداخت‌های کوچک روزمره؛ با همراه کارت بیشتر آشنا
              شوید.
            </p>
            <LinkArrow href="#faq" className="button light">
              معرفی همراه کارت
            </LinkArrow>
          </div>
          <div className="phone-wrap">
            <div className="phone">
              <div className="phone-speaker" />
              <h3>همراه کارت</h3>
              <div className="phone-card">
                <Smartphone />
                <span>همراه پرداخت‌های کوچک</span>
              </div>
              <div className="phone-tools">
                <Wallet />
                <ScanLine />
              </div>
              <small>تصویر مفهومی محصول</small>
            </div>
          </div>
        </section>
        <section id="about" className="about">
          <div className="container about-inner">
            <div className="about-copy">
              <span className="eyebrow">نگاه ما به فردا</span>
              <h2>فردایی که تجربه‌های مالی، برای همه ساده‌تر باشد</h2>
              <p>
                باور ما این است که فناوری باید به زندگی نزدیک شود؛ با زبان روشن،
                مسیرهای ساده و توجه به نیازهای متفاوت آدم‌ها. این، جهتی است که
                برای فردا انتخاب می‌کنیم.
              </p>
              <div className="values">
                {[
                  [Sprout, "نگاه رو به آینده"],
                  [Users, "توجه به انسان"],
                  [Sparkles, "سادگی در تجربه"],
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
              <LinkArrow href="#contact">با ارتباط فردا آشنا شوید</LinkArrow>
            </div>
            <div className="portraits">
              {[1, 2, 3, 4].map((i) => (
                <Photo
                  key={i}
                  name={`portrait${i}`}
                  alt="فناوری برای همه نسل‌ها"
                />
              ))}
            </div>
            <div className="about-motto">فناوری، برای بهتر شدن تجربه زندگی</div>
          </div>
        </section>
        <section id="faq" className="faq container section">
          <div className="faq-intro">
            <MessagesSquare size={30} strokeWidth={1.3} />
            <h2>از کجا شروع کنم؟</h2>
            <p>
              برای شناخت محصولات و پیدا کردن مسیر مناسب، راهنمای کوتاه ما را
              ببینید.
            </p>
            <LinkArrow href="#products">راهنمای محصولات</LinkArrow>
          </div>
          <div className="questions">
            {[
              [
                "همراه کارت برای چه نوع پرداخت‌هایی است؟",
                "همراه کارت برای پرداخت‌های خرد و کارهای مالی روزمره طراحی شده است.",
              ],
              [
                "ایران کارت چیست و برگشت پول چه معنایی دارد؟",
                "ایران کارت تجربه خرید با برگشت بخشی از مبلغ خرید در فروشگاه‌های طرف قرارداد را فراهم می‌کند.",
              ],
              [
                "از کجا با راهکارهای ارتباط فردا آشنا شوم؟",
                "در بخش راهکارهای مالی، مسیر مناسب کسب‌وکار خود را پیدا کنید یا با ما در ارتباط باشید.",
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
              <h2>گفت‌وگو، آغاز یک ارتباط بهتر است</h2>
              <p>
                برای پرسش درباره محصولات یا گفت‌وگو درباره همکاری، مسیر ارتباط
                مناسب را پیدا کنید.
              </p>
            </div>
            <LinkArrow href="mailto:info@efarda.ir" className="button outline">
              ارتباط با ما
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
                  alt="ارتباط فردا"
                  width={208}
                  height={57}
                />
              </a>
              <p>
                ارتباط فردا؛ ۱۵ سال تجربه در فناوری مالی، با نگاهی به زندگی
                روزمره و فردایی که پیش روست.
              </p>
              <small>همراه امروز، در ارتباط با فردا</small>
            </div>
            {[
              [
                "شناخت ارتباط فردا",
                "درباره ما",
                "داستان ۱۵ سال همراهی",
                "نگاه ما به فردا",
                "مجله فردا",
              ],
              [
                "دنیای محصولات",
                "همراه کارت",
                "ایران کارت",
                "راهکارهای فناوری مالی",
                "راهنمای آشنایی با محصولات",
              ],
              [
                "در ارتباط با ما",
                "تماس با ما",
                "همکاری با ارتباط فردا",
                "فرصت‌های شغلی",
                "پرسش‌های متداول",
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
            <small>تمامی حقوق این وب‌سایت متعلق به ارتباط فرداست.</small>
            <div>
              <a href="#top" aria-label="بازگشت به بالا">
                <ArrowUp size={18} />
              </a>
              <span>حریم خصوصی</span>
              <span>شرایط استفاده</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
