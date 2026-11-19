import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/server/session";
import LoginForm from "@/components/admin/login-form";

export default async function LoginPage() {
  if (await currentUser()) redirect("/admin");

  return (
    <main className="admin-login admin-card">
      <Link href="/">ارتباط فردا</Link>
      <h1>ورود به پنل مدیریت</h1>
      <LoginForm />
    </main>
  );
}
