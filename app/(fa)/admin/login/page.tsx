import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/server/session";
import LoginForm from "@/components/admin/login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  const { reset } = await searchParams;
  const user = await currentUser();
  if (user) redirect(user.mustChangePassword ? "/admin/account" : "/admin");

  return (
    <main className="admin-login admin-card">
      <Link href="/">ارتباط فردا</Link>
      <h1>ورود به پنل مدیریت</h1>
      {reset === "1" && <p className="admin-message" role="status">رمز جدید ذخیره شد. دوباره وارد شوید.</p>}
      <LoginForm />
      <div className="admin-review"><Link href="/admin/forgot-password">رمز عبور را فراموش کرده‌ام</Link></div>
    </main>
  );
}
