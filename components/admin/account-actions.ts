"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";
import { accountLink, recoveryEmailEnabled, sendAccountMail, validEmail } from "@/server/account-mail";
import { allowAccountMail, getAccountToken, issueAccountToken } from "@/server/account-tokens";
import { checkPassword, isUsername, passwordHash, validPassword } from "@/server/credentials";
import { getDb, transaction } from "@/server/database";
import { field } from "@/server/editor-input";
import { currentSession, signOut } from "@/server/session";

export type AccountResult = { error: string; message?: string };

const invalidLink = { error: "این پیوند معتبر نیست یا مهلت استفاده از آن گذشته است." };

export async function updateAccount(_state: AccountResult, form: FormData): Promise<AccountResult> {
  const session = await currentSession();
  if (!session) redirect("/admin/login");
  const { user, hash: sessionHash } = session;
  const current = field(form, "currentPassword");
  const password = field(form, "password");
  const emailEnabled = recoveryEmailEnabled();
  const email = emailEnabled ? field(form, "email").trim() : "";
  if (emailEnabled && !validEmail(email)) return { error: "ایمیل بازیابی را بررسی کنید." };
  if ((user.mustChangePassword || !emailEnabled || password) && (!validPassword(password) ||
      password !== field(form, "confirmation") || password === current)) {
    return { error: "رمز جدید باید متفاوت باشد، ۱۲ تا ۱۲۸ نویسه داشته باشد و با تکرار آن یکسان باشد." };
  }
  const db = getDb();
  const existing = db.prepare("SELECT password_hash FROM users WHERE id = ?")
    .get(user.id) as { password_hash: string } | undefined;
  if (!existing || !current || current.length > 128 || !await checkPassword(current, existing.password_hash)) {
    return { error: "رمز عبور فعلی درست نیست." };
  }

  const nextHash = password ? await passwordHash(password) : existing.password_hash;
  const result = transaction(db, () => {
    const account = db.prepare(`
      SELECT recovery_email, pending_email FROM users WHERE id = ? AND password_hash = ?
      AND EXISTS (SELECT 1 FROM sessions WHERE user_id = users.id AND token_hash = ? AND expires_at > ?)
    `).get(user.id, existing.password_hash, sessionHash, Date.now()) as
      { recovery_email: string | null; pending_email: string | null } | undefined;
    if (!account) return null;
    const pending = emailEnabled
      ? email === account.recovery_email ? null : email
      : account.pending_email;
    db.prepare(`
      UPDATE users SET password_hash = ?, must_change_password = 0, pending_email = ? WHERE id = ?
    `).run(nextHash, pending, user.id);
    if (password) {
      db.prepare("DELETE FROM sessions WHERE user_id = ? AND token_hash <> ?").run(user.id, sessionHash);
      db.prepare("DELETE FROM account_tokens WHERE user_id = ? AND purpose = 'reset'").run(user.id);
    }
    if (pending !== account.pending_email || password) {
      db.prepare("DELETE FROM account_tokens WHERE user_id = ? AND purpose = 'verify'").run(user.id);
    }
    const token = emailEnabled && pending && allowAccountMail("verify", user.username) ? issueAccountToken(user.id, "verify") : undefined;
    return { token, pending: emailEnabled && pending };
  });
  if (!result) return { error: "نشست یا رمز عبور تغییر کرده است. دوباره وارد شوید." };

  if (result.token) {
    const link = accountLink("/admin/verify-email", result.token);
    const sent = !!link && await sendAccountMail({
      to: email,
      subject: "تأیید ایمیل بازیابی ارتباط فردا",
      text: `برای تأیید ایمیل بازیابی، این پیوند را تا یک ساعت باز کنید:\n${link}`,
    });
    redirect(sent ? "/admin/account?status=sent" : "/admin/account?status=mailUnavailable");
  }
  redirect(result.pending ? "/admin/account?status=wait" : "/admin/account?status=saved");
}

export async function verifyEmail(_state: AccountResult, form: FormData): Promise<AccountResult> {
  const token = field(form, "token");
  const db = getDb();
  const verified = transaction(db, () => {
    const match = getAccountToken(token, "verify");
    if (!match) return false;
    const result = db.prepare(`
      UPDATE users SET recovery_email = pending_email, pending_email = NULL
      WHERE id = ? AND pending_email IS NOT NULL
    `).run(match.user_id);
    db.prepare("DELETE FROM account_tokens WHERE user_id = ?").run(match.user_id);
    return !!result.changes;
  });
  return verified
    ? { error: "", message: "ایمیل بازیابی تأیید شد." }
    : invalidLink;
}

export async function requestReset(_state: AccountResult, form: FormData): Promise<AccountResult> {
  const username = field(form, "username").trim().toLowerCase();
  if (isUsername(username)) {
    after(async () => {
      const db = getDb();
      const reset = transaction(db, () => {
        if (!allowAccountMail("reset", username)) return;
        const user = db.prepare("SELECT id, recovery_email FROM users WHERE username = ? AND recovery_email IS NOT NULL")
          .get(username) as { id: number; recovery_email: string } | undefined;
        if (user) return { email: user.recovery_email, token: issueAccountToken(user.id, "reset") };
      });
      if (!reset) return;
      const link = accountLink("/admin/reset-password", reset.token);
      if (!link || !await sendAccountMail({
        to: reset.email,
        subject: "بازیابی رمز عبور ارتباط فردا",
        text: `برای انتخاب رمز جدید، این پیوند یک‌بارمصرف را تا ۳۰ دقیقه باز کنید:\n${link}\nاگر این درخواست را ثبت نکرده‌اید، این پیام را نادیده بگیرید.`,
      })) console.error("Password reset email was not accepted by SMTP.");
    });
  }
  return { error: "", message: "اگر برای این حساب ایمیل بازیابی تأییدشده‌ای ثبت شده باشد، پیوند بازیابی ارسال می‌شود." };
}

export async function resetPassword(_state: AccountResult, form: FormData): Promise<AccountResult> {
  const token = field(form, "token");
  const password = field(form, "password");
  if (!validPassword(password) || password !== field(form, "confirmation")) {
    return { error: "رمز جدید باید ۱۲ تا ۱۲۸ نویسه داشته باشد و با تکرار آن یکسان باشد." };
  }
  if (!getAccountToken(token, "reset")) return invalidLink;
  const hash = await passwordHash(password);
  const db = getDb();
  const changed = transaction(db, () => {
    const match = getAccountToken(token, "reset");
    if (!match) return false;
    db.prepare(`
      UPDATE users SET password_hash = ?, must_change_password = 0, pending_email = NULL WHERE id = ?
    `).run(hash, match.user_id);
    db.prepare("DELETE FROM account_tokens WHERE user_id = ?").run(match.user_id);
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(match.user_id);
    db.prepare("DELETE FROM login_attempts WHERE username = (SELECT username FROM users WHERE id = ?)").run(match.user_id);
    return true;
  });
  if (!changed) return invalidLink;
  await signOut();
  redirect("/admin/login?reset=1");
}
