import Link from "next/link";
import AccountForm from "@/components/admin/account-form";
import { validAccountToken } from "@/server/account-tokens";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <main className="admin-login admin-card">
      <Link href="/admin/account">بازگشت به حساب</Link>
      <h1>تأیید ایمیل بازیابی</h1>
      {typeof token === "string" && validAccountToken(token)
        ? <AccountForm mode="verify" token={token} />
        : <p role="alert">پیوند تأیید معتبر نیست.</p>}
    </main>
  );
}
