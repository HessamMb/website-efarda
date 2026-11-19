import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, transaction } from "./database";
import { checkPassword, isUsername, type Role } from "./credentials";

const lifetime = 60 * 60 * 12;
const cookieName = "efarda_session";
const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

export type User = { id: number; username: string; role: Role };

type SessionUser = User & {
  mustChangePassword: number;
  recoveryEmail: string | null;
  pendingEmail: string | null;
};

export async function currentSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return undefined;
  const hash = tokenHash(token);
  const user = getDb().prepare(`
    SELECT users.id, users.username, users.role, must_change_password AS mustChangePassword,
      recovery_email AS recoveryEmail, pending_email AS pendingEmail
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE token_hash = ? AND expires_at > ?
  `).get(hash, Date.now()) as SessionUser | undefined;
  if (user) return { user, hash };
}

export async function currentUser() {
  return (await currentSession())?.user;
}

export async function requireUser(roles?: readonly Role[]) {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  if (user.mustChangePassword) redirect("/admin/account");
  if (roles && !roles.includes(user.role)) redirect("/admin?error=forbidden");
  return user;
}

export const editorialRoles = ["admin", "writer"] as const;

export async function signIn(username: string, password: string) {
  if (!isUsername(username) || !password || password.length > 128) return false;
  const db = getDb();
  const now = Date.now();
  const allowed = transaction(db, () => {
    db.prepare("DELETE FROM login_attempts WHERE attempted_at <= ?").run(now - 15 * 60_000);
    const attempts = db.prepare(`
      SELECT COUNT(*) AS total, COUNT(CASE WHEN username = ? THEN 1 END) AS account
      FROM login_attempts
    `).get(username) as { total: number; account: number };
    if (attempts.total >= 120 || attempts.account >= 8) return false;
    db.prepare("INSERT INTO login_attempts (username, attempted_at) VALUES (?, ?)").run(username, now);
    return true;
  });
  if (!allowed) return false;

  const user = db.prepare("SELECT id, password_hash, must_change_password FROM users WHERE username = ?")
    .get(username) as { id: number; password_hash: string; must_change_password: number } | undefined;
  if (!(await checkPassword(password, user?.password_hash)) || !user) return false;

  const store = await cookies();
  const previous = store.get(cookieName)?.value;
  const token = randomBytes(32).toString("hex");
  const created = transaction(db, () => {
    db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now);
    if (previous) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(previous));
    const result = db.prepare(`
      INSERT INTO sessions (token_hash, user_id, expires_at)
      SELECT ?, id, ? FROM users WHERE id = ? AND password_hash = ?
    `).run(tokenHash(token), now + lifetime * 1000, user.id, user.password_hash);
    if (result.changes) db.prepare("DELETE FROM login_attempts WHERE username = ?").run(username);
    return result.changes;
  });
  if (!created) return false;
  store.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: lifetime,
  });
  return { mustChangePassword: !!user.must_change_password, signedInAt: now };
}

export async function signOut() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(token));
  store.delete(cookieName);
}
