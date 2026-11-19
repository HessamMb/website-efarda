import nodemailer from "nodemailer";

type Mail = { to: string; subject: string; text: string };

export function validEmail(value: string) {
  return value.length <= 254 && /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+$/i.test(value);
}

function localOnly(host: string) {
  return host === "127.0.0.1" || host === "localhost" || host === "[::1]";
}

export function accountLink(path: string, token: string) {
  try {
    const origin = new URL(process.env.EFARDA_SITE_URL || "http://localhost:3000");
    if (origin.protocol !== "https:" && !(origin.protocol === "http:" && localOnly(origin.hostname))) return;
    const url = new URL(path, origin.origin);
    url.searchParams.set("token", token);
    return url.href;
  } catch {
    return undefined;
  }
}

export async function sendAccountMail(message: Mail) {
  const { EFARDA_SMTP_HOST: host, EFARDA_MAIL_FROM: from, EFARDA_SMTP_USER: user, EFARDA_SMTP_PASSWORD: pass } = process.env;
  if (!host || !from || !validEmail(from) || !validEmail(message.to) || !!user !== !!pass) return false;
  const port = Number(process.env.EFARDA_SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) return false;
  const localCapture = process.env.EFARDA_SMTP_LOCAL_CAPTURE === "true" && localOnly(host) && !user;
  const secure = port === 465;
  const transport = nodemailer.createTransport({
    host, port, secure,
    requireTLS: !secure && !localCapture,
    ignoreTLS: localCapture,
    auth: user && pass ? { user, pass } : undefined,
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 10_000,
  });
  try {
    const result = await transport.sendMail({ from, ...message });
    return result.accepted.length > 0;
  } catch {
    return false;
  }
}

export async function notifyAdminOfLogin(username: string, signedInAt: number) {
  const to = process.env.EFARDA_LOGIN_ALERT_EMAIL;
  if (!to) return;
  const time = new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "full", timeStyle: "long", timeZone: "Asia/Tehran",
  }).format(signedInAt);
  if (!await sendAccountMail({
    to,
    subject: "ورود به پنل ارتباط فردا",
    text: `نام کاربری: ${username}\nزمان ورود (تهران): ${time}\nزمان UTC: ${new Date(signedInAt).toISOString()}`,
  })) console.error("Login notification was not accepted by SMTP.");
}
