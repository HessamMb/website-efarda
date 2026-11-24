import Link from "next/link";
import { redirect } from "next/navigation";
import AccountForm from "@/components/admin/account-form";
import { logout } from "@/components/admin/actions";
import { recoveryEmailEnabled } from "@/server/account-mail";
import { currentUser } from "@/server/session";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  const { status } = await searchParams;
  const firstLogin = !!user.mustChangePassword;
  const emailEnabled = recoveryEmailEnabled();

  return (
    <main className="admin-login admin-card">
      <h1>{firstLogin ? "راه‌اندازی حساب" : "امنیت حساب"}</h1>
      {firstLogin && (
        <p role="alert" className="admin-message">
          {emailEnabled
            ? "با رمز اولیه وارد شده‌اید. پیش از ورود به داشبورد، رمز جدید و ایمیل بازیابی‌تان را ثبت کنید."
            : "با رمز اولیه وارد شده‌اید. پیش از ورود به داشبورد، رمز جدیدتان را ثبت کنید."}
        </p>
      )}
      {emailEnabled && status === "sent" && <p className="admin-message" role="status">تنظیمات ذخیره شد و پیوند تأیید ایمیل برای ارسال پذیرفته شد.</p>}
      {status === "saved" && <p className="admin-message" role="status">تنظیمات حساب ذخیره شد.</p>}
      {emailEnabled && status === "wait" && <p className="admin-message" role="status">تنظیمات ذخیره شد. برای درخواست دوباره کمی صبر کنید یا پیوند قبلی را بررسی کنید.</p>}
      {emailEnabled && status === "mailUnavailable" && (
        <p className="admin-message admin-error" role="alert">
          تنظیمات ذخیره شد، اما ارسال ایمیل ممکن نبود. پس از بررسی تنظیمات ایمیل، دوباره تلاش کنید.
        </p>
      )}
      {emailEnabled && !firstLogin && user.pendingEmail && (
        <p className="admin-message">
          ایمیل جدید در انتظار تأیید است. برای درخواست دوبارهٔ پیوند، رمز فعلی را وارد کنید و فرم را دوباره ذخیره کنید.
        </p>
      )}
      {emailEnabled && !firstLogin && user.recoveryEmail && (
        <p className="admin-message">ایمیل تأییدشدهٔ حساب <bdi>{user.recoveryEmail}</bdi></p>
      )}
      <AccountForm mode="account" firstLogin={firstLogin} initialEmail={emailEnabled ? user.pendingEmail ?? user.recoveryEmail ?? "" : undefined} />
      <div className="admin-toolbar admin-review">
        {!firstLogin && <Link href="/admin" className="admin-button secondary">بازگشت به پنل</Link>}
        <form action={logout}><button className="admin-button secondary">خروج</button></form>
      </div>
    </main>
  );
}
