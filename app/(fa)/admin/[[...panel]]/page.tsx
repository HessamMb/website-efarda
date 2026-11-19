import Link from "next/link";
import { notFound } from "next/navigation";
import { isPostLocale } from "@/data/post-content";
import { logout } from "@/components/admin/actions";
import { EditPostPanel, PostsPanel, ProposalPanel, ProposalsPanel, roleLabels, UsersPanel } from "@/components/admin/panels";
import { requireUser } from "@/server/session";

const successes: Record<string, string> = {
  saved: "پیش‌نویس ذخیره شد.",
  published: "این نسخه منتشر شد.",
  unpublished: "این نسخه از انتشار خارج شد.",
  removed: "مطلب حذف شد.",
  proposed: "پیشنهاد برای بررسی ارسال شد.",
  accepted: "پیشنهاد به‌عنوان پیش‌نویس ذخیره شد.",
  rejected: "پیشنهاد رد شد.",
  userCreated: "حساب کاربر ایجاد شد.",
  userDeleted: "حساب کاربر حذف شد.",
  roleChanged: "نقش کاربر به‌روزرسانی شد.",
};

const errors: Record<string, string> = {
  forbidden: "سطح دسترسی شما برای این بخش کافی نیست.",
  invalid: "اطلاعات درخواست معتبر نیست.",
  conflict: "نسخه مطلب تغییر کرده یا پیشنهاد قبلاً بررسی شده است.",
  invalidUser: "نام کاربری، نقش یا رمز عبور معتبر نیست. رمز عبور باید حداقل ۱۲ نویسه باشد.",
  usernameExists: "این نام کاربری از قبل ثبت شده است.",
  lastAdminDelete: "حذف آخرین مدیر امکان‌پذیر نیست.",
  userMissing: "این حساب دیگر وجود ندارد.",
  lastAdmin: "نقش آخرین مدیر قابل تغییر نیست.",
};

export default async function AdminPage({
  params, searchParams,
}: {
  params: Promise<{ panel?: string[] }>;
  searchParams: Promise<{ done?: string | string[]; error?: string | string[] }>;
}) {
  const user = await requireUser();
  const { panel = [] } = await params;
  const { done, error } = await searchParams;
  const [section, first, second] = panel;
  const reviewing = section === "proposals";
  let content: React.ReactNode;

  if (!panel.length) {
    content = <PostsPanel user={user} />;
  } else if (section === "new" && panel.length === 2 && isPostLocale(first)) {
    content = <EditPostPanel user={user} locale={first} />;
  } else if (section === "posts" && panel.length === 3 && isPostLocale(second)) {
    content = <EditPostPanel user={user} slug={first} locale={second} />;
  } else if (reviewing && panel.length === 1) {
    content = <ProposalsPanel user={user} />;
  } else if (reviewing && panel.length === 2 && /^\d{1,12}$/.test(first)) {
    content = <ProposalPanel user={user} id={Number(first)} />;
  } else if (section === "users" && panel.length === 1) {
    if (user.role !== "admin") await requireUser(["admin"]);
    content = <UsersPanel />;
  } else {
    notFound();
  }

  const successMessage = typeof done === "string" && Object.hasOwn(successes, done) ? successes[done] : undefined;
  const errorMessage = typeof error === "string" && Object.hasOwn(errors, error) ? errors[error] : undefined;
  return (
    <>
      <header className="admin-header">
        <Link href="/admin" className="admin-brand">مدیریت ارتباط فردا</Link>
        <nav aria-label="پنل مدیریت">
          <Link href="/admin" aria-current={!reviewing && section !== "users" ? "page" : undefined}>مطالب</Link>
          <Link href="/admin/proposals" aria-current={reviewing ? "page" : undefined}>
            {user.role === "reader" ? "پیشنهادهای من" : "پیشنهادها"}
          </Link>
          {user.role === "admin" && <Link href="/admin/users" aria-current={section === "users" ? "page" : undefined}>کاربران</Link>}
        </nav>
        <div className="admin-toolbar">
          <span><bdi>{user.username}</bdi> · {roleLabels[user.role]}</span>
          <form action={logout}><button className="admin-button secondary">خروج</button></form>
        </div>
      </header>
      <main className="admin-main">
        {successMessage && <p role="status" className="admin-message">{successMessage}</p>}
        {errorMessage && <p role="alert" className="admin-message admin-error">{errorMessage}</p>}
        {content}
      </main>
    </>
  );
}
