import Link from "next/link";
import AccountForm from "@/components/admin/account-form";

export default function ForgotPasswordPage() {
  return (
    <main className="admin-login admin-card">
      <Link href="/admin/login">بازگشت به ورود</Link>
      <h1>بازیابی رمز عبور</h1>
      <AccountForm mode="forgot" />
    </main>
  );
}
