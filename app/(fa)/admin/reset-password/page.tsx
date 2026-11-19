import Link from "next/link";
import AccountForm from "@/components/admin/account-form";
import { validAccountToken } from "@/server/account-tokens";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <main className="admin-login admin-card">
      <Link href="/admin/forgot-password">درخواست پیوند جدید</Link>
      <h1>انتخاب رمز عبور جدید</h1>
      {typeof token === "string" && validAccountToken(token)
        ? <AccountForm mode="reset" token={token} />
        : <p role="alert">پیوند بازیابی معتبر نیست.</p>}
    </main>
  );
}
