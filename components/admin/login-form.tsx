"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <form action={action} className="admin-fields">
      {state.error && <p className="admin-message admin-error" role="alert">{state.error}</p>}
      <label>
        نام کاربری
        <input name="username" dir="ltr" autoComplete="username" required minLength={3} maxLength={40} />
      </label>
      <label>
        رمز عبور
        <input name="password" dir="ltr" type="password" autoComplete="current-password" required maxLength={128} />
      </label>
      <button className="admin-button" disabled={pending}>ورود</button>
    </form>
  );
}
