"use client";

import { useActionState } from "react";
import { requestReset, resetPassword, updateAccount, verifyEmail } from "./account-actions";

type Flow =
  | { mode: "account"; initialEmail: string; firstLogin: boolean }
  | { mode: "forgot" }
  | { mode: "reset" | "verify"; token: string };

const actions = { account: updateAccount, forgot: requestReset, reset: resetPassword, verify: verifyEmail };
const labels = { account: "ذخیره تنظیمات حساب", forgot: "ارسال پیوند بازیابی", reset: "ذخیره رمز جدید", verify: "تأیید ایمیل" };

export default function AccountForm(props: Flow) {
  const { mode } = props;
  const [state, action, pending] = useActionState(actions[mode], { error: "" });
  const passwordRequired = mode === "reset" || (mode === "account" && props.firstLogin);

  if (state.message) return <p className="admin-message" role="status">{state.message}</p>;

  return (
    <form action={action} className="admin-fields">
      {state.error && <p className="admin-message admin-error" role="alert">{state.error}</p>}
      {"token" in props && <input name="token" type="hidden" value={props.token} />}
      {mode === "forgot" && (
        <label>نام کاربری
          <input name="username" dir="ltr" autoComplete="username" required minLength={3} maxLength={40} />
        </label>
      )}
      {mode === "account" && (
        <>
          <label>رمز عبور فعلی
            <input name="currentPassword" type="password" dir="ltr" autoComplete="current-password" required maxLength={128} />
          </label>
          <label>ایمیل بازیابی
            <input name="email" type="email" dir="ltr" autoComplete="email" defaultValue={props.initialEmail} required maxLength={254} />
          </label>
        </>
      )}
      {(mode === "account" || mode === "reset") && (
        <>
          <label>{passwordRequired ? "رمز عبور جدید" : "رمز عبور جدید (اختیاری)"}
            <input name="password" type="password" dir="ltr" autoComplete="new-password" required={passwordRequired} minLength={12} maxLength={128} />
          </label>
          <label>تکرار رمز عبور جدید
            <input name="confirmation" type="password" dir="ltr" autoComplete="new-password" required={passwordRequired} minLength={12} maxLength={128} />
          </label>
        </>
      )}
      <button className="admin-button" disabled={pending}>{labels[mode]}</button>
    </form>
  );
}
