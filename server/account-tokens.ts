import { createHash, randomBytes } from "node:crypto";
import { getDb } from "./database";

export type TokenPurpose = "verify" | "reset";
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export function allowAccountMail(purpose: TokenPurpose, account: string) {
  const db = getDb();
  const now = Date.now();
  db.prepare("DELETE FROM account_mail_attempts WHERE attempted_at <= ?").run(now - 30 * 60_000);
  const attempts = db.prepare(`
    SELECT COUNT(*) AS total,
      COUNT(CASE WHEN account = ? THEN 1 END) AS individual,
      MAX(CASE WHEN account = ? THEN attempted_at END) AS latest
    FROM account_mail_attempts WHERE purpose = ?
  `).get(account, account, purpose) as { total: number; individual: number; latest: number | null };
  if (attempts.total >= 120 || attempts.individual >= 5 || (attempts.latest ?? 0) > now - 60_000) return false;
  db.prepare("INSERT INTO account_mail_attempts VALUES (?, ?, ?)").run(purpose, account, now);
  return true;
}

export function issueAccountToken(userId: number, purpose: TokenPurpose) {
  const token = randomBytes(32).toString("hex");
  const db = getDb();
  const now = Date.now();
  db.prepare("DELETE FROM account_tokens WHERE expires_at <= ?").run(now);
  db.prepare(`
    INSERT INTO account_tokens (token_hash, user_id, purpose, expires_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, purpose) DO UPDATE SET token_hash = excluded.token_hash, expires_at = excluded.expires_at
  `).run(hashToken(token), userId, purpose, now + (purpose === "verify" ? 60 : 30) * 60_000);
  return token;
}

export function validAccountToken(token: string) {
  return /^[a-f0-9]{64}$/.test(token);
}

export function getAccountToken(token: string, purpose: TokenPurpose) {
  if (!validAccountToken(token)) return undefined;
  return getDb().prepare(`
    SELECT user_id FROM account_tokens WHERE token_hash = ? AND purpose = ? AND expires_at > ?
  `).get(hashToken(token), purpose, Date.now()) as { user_id: number } | undefined;
}
