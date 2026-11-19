import Link from "next/link";
import { notFound } from "next/navigation";
import { isPostSlug, newsHref, postLocales, type PostContent } from "@/data/post-content";
import type { Locale } from "@/i18n/provider";
import { roles, type Role } from "@/server/credentials";
import { getDb } from "@/server/database";
import { getTranslation, listPosts, listProposals, proposalById, type Translation } from "@/server/posts";
import type { User } from "@/server/session";
import PostBlocks from "@/components/journal/post-blocks";
import { changeRole, createUser, deleteUser, removePost, reviewProposal, unpublish } from "./actions";
import Editor, { ImagePreview } from "./editor";

export const roleLabels: Record<Role, string> = { admin: "مدیر", writer: "نویسنده", reader: "خواننده" };
const localeLabels: Record<Locale, string> = { fa: "فارسی", en: "انگلیسی" };
const proposalLabels = { pending: "در انتظار بررسی", accepted: "تأیید شده", rejected: "رد شده" };

function LanguageLinks({ prefix, selected }: { prefix: string; selected: Locale }) {
  return (
    <nav className="admin-tabs" aria-label="زبان محتوا">
      {postLocales.map((locale) => (
        <Link key={locale} href={`${prefix}/${locale}`} aria-current={selected === locale ? "page" : undefined}>
          {localeLabels[locale]}
        </Link>
      ))}
    </nav>
  );
}

function Status({ translation }: { translation?: Partial<Translation> }) {
  if (!translation?.draft) return <span>ایجاد نشده</span>;
  if (!translation.published) return <span>پیش‌نویس</span>;
  return <span>{translation.draft === translation.published ? "منتشرشده" : "منتشرشده، با تغییرات در پیش‌نویس"}</span>;
}

export function PostsPanel({ user }: { user: User }) {
  const posts = new Map<string, Partial<Record<Locale, Partial<Translation>>>>();
  for (const { post_slug: slug, ...item } of listPosts()) {
    const translations = posts.get(slug) ?? {};
    if (item.locale) translations[item.locale] = item;
    posts.set(slug, translations);
  }
  return (
    <>
      <div className="admin-title">
        <div><h1>مطالب</h1><p>وضعیت انتشار هر زبان را جداگانه ببینید.</p></div>
        <Link className="admin-button" href="/admin/new/fa">
          {user.role === "reader" ? "پیشنهاد مطلب جدید" : "مطلب جدید"}
        </Link>
      </div>
      {posts.size === 0 && <p className="admin-card">هنوز مطلبی ثبت نشده است.</p>}
      <div className="admin-list">
        {Array.from(posts, ([slug, translations]) => {
          const draft = translations.fa?.draft ?? translations.en?.draft;
          const title = draft ? (JSON.parse(draft) as PostContent).title : slug;
          return (
            <article key={slug} className="admin-card admin-post">
              <div><h2 dir="auto">{title}</h2><small dir="ltr">{slug}</small></div>
              <div className="admin-post-languages">
                {postLocales.map((locale) => (
                  <Link key={locale} href={`/admin/posts/${slug}/${locale}`}>
                    <strong>{localeLabels[locale]}</strong>
                    <Status translation={translations[locale]} />
                  </Link>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

export function EditPostPanel({ user, slug, locale }: { user: User; slug?: string; locale: Locale }) {
  if (slug && (!isPostSlug(slug) || !getDb().prepare("SELECT 1 FROM posts WHERE slug = ?").get(slug))) notFound();
  const translation = slug ? getTranslation(slug, locale) : undefined;
  const initial = translation && JSON.parse(translation.draft) as PostContent;
  const reader = user.role === "reader";
  return (
    <>
      <Link className="admin-back" href="/admin">بازگشت به مطالب</Link>
      <div className="admin-title">
        <div>
          <h1>{reader ? (slug ? "پیشنهاد تغییر" : "پیشنهاد مطلب جدید") : (slug ? "ویرایش مطلب" : "مطلب جدید")}</h1>
          {slug && <p dir="auto">{initial?.title ?? slug}</p>}
        </div>
        {translation?.published && slug && <Link className="admin-button secondary" href={newsHref(slug, locale)}>دیدن نسخه منتشرشده</Link>}
      </div>
      <LanguageLinks prefix={slug ? `/admin/posts/${slug}` : "/admin/new"} selected={locale} />
      <div className="admin-current">وضعیت {localeLabels[locale]} <Status translation={translation} /></div>
      <Editor key={`${slug}-${locale}-${translation?.revision ?? 0}`} slug={slug} locale={locale} revision={translation?.revision ?? 0} initial={initial} reader={reader} />
      {!reader && slug && (
        <section className="admin-card admin-danger">
          <h2>مدیریت انتشار و حذف</h2>
          {translation?.published && (
            <form action={unpublish.bind(null, slug, locale, translation.revision)}>
              <button className="admin-button secondary">خروج نسخه {localeLabels[locale]} از انتشار</button>
            </form>
          )}
          <form action={removePost.bind(null, slug)} className="admin-toolbar">
            <label className="admin-check"><input type="checkbox" name="confirm" required /> حذف هر دو زبان و پیش‌نویس‌ها را تأیید می‌کنم</label>
            <button className="admin-button destructive">حذف مطلب</button>
          </form>
        </section>
      )}
    </>
  );
}

export function ProposalsPanel({ user }: { user: User }) {
  const proposals = listProposals(user.role === "reader" ? user.id : undefined);
  return (
    <>
      <div className="admin-title"><div><h1>{user.role === "reader" ? "پیشنهادهای من" : "پیشنهادها"}</h1></div></div>
      {proposals.length === 0 && <p className="admin-card">هنوز پیشنهادی ثبت نشده است.</p>}
      <div className="admin-list">
        {proposals.map((proposal) => {
          const content = JSON.parse(proposal.content) as PostContent;
          return (
            <Link className="admin-card admin-post" key={proposal.id} href={`/admin/proposals/${proposal.id}`}>
              <div><h2 dir="auto">{content.title}</h2><small>{localeLabels[proposal.locale]} · <bdi>{proposal.username ?? "کاربر حذف‌شده"}</bdi></small></div>
              <span>{proposalLabels[proposal.status]}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function ProposalPanel({ user, id }: { user: User; id: number }) {
  const proposal = proposalById(id);
  if (!proposal || (user.role === "reader" &&
      !getDb().prepare("SELECT 1 FROM proposals WHERE id = ? AND author_id = ?").get(id, user.id))) notFound();
  const content = JSON.parse(proposal.content) as PostContent;
  return (
    <>
      <Link className="admin-back" href="/admin/proposals">بازگشت به پیشنهادها</Link>
      <div className="admin-title">
        <div><h1>بررسی پیشنهاد</h1><p>{localeLabels[proposal.locale]} · <bdi>{proposal.username ?? "کاربر حذف‌شده"}</bdi> · {proposalLabels[proposal.status]}</p></div>
      </div>
      <div className="admin-card" dir={proposal.locale === "fa" ? "rtl" : "ltr"} lang={proposal.locale}>
        <h2>{content.title}</h2>
        {content.excerpt && <p>{content.excerpt}</p>}
        <ImagePreview image={content.images[0]} />
        <div className="news-detail-copy"><PostBlocks blocks={content.blocks} /></div>
      </div>
      {user.role !== "reader" && proposal.status === "pending" && (
        <form action={reviewProposal.bind(null, id)} className="admin-toolbar admin-review">
          <button className="admin-button" name="decision" value="accept">پذیرش به‌عنوان پیش‌نویس</button>
          <button className="admin-button secondary" name="decision" value="reject">رد پیشنهاد</button>
        </form>
      )}
    </>
  );
}

function RoleSelect({ role = "reader" }: { role?: Role }) {
  return <select name="role" defaultValue={role}>{roles.map((key) => <option key={key} value={key}>{roleLabels[key]}</option>)}</select>;
}

export function UsersPanel() {
  const users = getDb().prepare("SELECT id, username, role FROM users ORDER BY username").all() as User[];
  const adminCount = users.filter((user) => user.role === "admin").length;
  return (
    <>
      <div className="admin-title"><div><h1>کاربران</h1><p>مدیریت حساب‌ها و سطح دسترسی پنل.</p></div></div>
      <section className="admin-card">
        <h2>افزودن کاربر</h2>
        <form action={createUser} className="admin-form-grid">
          <label>نام کاربری<input name="username" dir="ltr" autoComplete="off" required pattern="[a-z0-9_.\\-]{3,40}" minLength={3} maxLength={40} /></label>
          <label>رمز عبور اولیه<input name="password" dir="ltr" type="password" autoComplete="new-password" required minLength={12} maxLength={128} /></label>
          <label>نقش<RoleSelect /></label>
          <button className="admin-button">افزودن کاربر</button>
        </form>
      </section>
      <div className="admin-list">
        {users.map((user) => (
          <article className="admin-card admin-post" key={user.id}>
            <strong dir="ltr">{user.username}</strong>
            <form className="admin-toolbar" action={changeRole.bind(null, user.id)}>
              <label>نقش<RoleSelect role={user.role} /></label>
              <button className="admin-button secondary">ذخیره نقش</button>
            </form>
            {user.role !== "admin" || adminCount > 1 ? (
              <form className="admin-toolbar" action={deleteUser.bind(null, user.id, user.username)}>
                <label className="admin-check">
                  <input type="checkbox" name="confirm" required />
                  حذف این حساب را تأیید می‌کنم
                </label>
                <button className="admin-button destructive">حذف کاربر</button>
              </form>
            ) : null}
          </article>
        ))}
      </div>
    </>
  );
}
