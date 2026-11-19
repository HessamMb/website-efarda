"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { notifyAdminOfLogin } from "@/server/account-mail";
import { isPostLocale, isPostSlug, newsHref, postLocales, type PostContent } from "@/data/post-content";
import { getDb, transaction } from "@/server/database";
import { isRole, isUsername, passwordHash, validPassword } from "@/server/credentials";
import { field, parseContent } from "@/server/editor-input";
import { getTranslation, proposalById, saveDraft, storeImages } from "@/server/posts";
import { editorialRoles, requireUser, signIn, signOut } from "@/server/session";

export type FormResult = { error: string };

function invalidatePost(slug: string) {
  revalidatePath("/");
  revalidatePath("/en");
  for (const locale of postLocales) revalidatePath(newsHref(slug, locale).slice(0, -1));
}

export async function login(_state: FormResult, form: FormData): Promise<FormResult> {
  const username = field(form, "username").trim().toLowerCase();
  const session = await signIn(username, field(form, "password"));
  if (!session) {
    return { error: "نام کاربری یا رمز عبور درست نیست، یا تعداد تلاش‌ها از حد مجاز گذشته است." };
  }
  after(() => notifyAdminOfLogin(username, session.signedInAt));
  redirect(session.mustChangePassword ? "/admin/account" : "/admin");
}

export async function logout() {
  await signOut();
  redirect("/admin/login");
}

export async function submitPost(
  target: { slug?: string; locale: string; revision: number },
  _state: FormResult,
  form: FormData,
): Promise<FormResult> {
  const user = await requireUser();
  const { locale, revision } = target;
  const slug = target.slug ?? field(form, "slug").trim();
  const intent = field(form, "intent");
  const proposing = intent === "propose";
  if (!isPostLocale(locale) || !isPostSlug(slug) ||
      !["draft", "publish", "propose"].includes(intent)) {
    return { error: "زبان یا نشانی مطلب معتبر نیست. نشانی باید با حروف کوچک انگلیسی و خط تیره نوشته شود." };
  }
  if ((user.role === "reader") !== proposing) {
    return { error: "سطح دسترسی شما برای این عملیات کافی نیست." };
  }

  const db = getDb();
  const postExists = () => !!db.prepare("SELECT 1 FROM posts WHERE slug = ?").get(slug);
  const current = getTranslation(slug, locale);
  const matches = (existingRevision?: number) =>
    postExists() === !!target.slug && (existingRevision ?? 0) === revision;
  const conflict = { error: "این نشانی قبلاً ثبت شده یا مطلب تغییر کرده است. صفحه را دوباره باز کنید." };
  if (!matches(current?.revision)) return conflict;

  let input: Awaited<ReturnType<typeof parseContent>>;
  try {
    input = await parseContent(form, current && JSON.parse(current.draft) as PostContent);
  } catch {
    return { error: "عنوان و تصویر اصلی الزامی‌اند. اندازه، قالب تصاویر و فیلدهای متن یا نشانی منبع را بررسی کنید." };
  }

  const active = await requireUser(proposing ? ["reader"] : editorialRoles);
  if (active.id !== user.id) return { error: "لطفاً دوباره وارد شوید." };
  const saved = transaction(db, () => {
    const translation = getTranslation(slug, locale);
    if (!matches(translation?.revision)) return false;
    storeImages(input.uploads);
    const json = JSON.stringify(input.content);
    if (proposing) {
      db.prepare(`
        INSERT INTO proposals
          (author_id, slug, locale, base_revision, new_post, content, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(user.id, slug, locale, revision, target.slug ? 0 : 1, json, Date.now());
    } else {
      if (!target.slug) db.prepare("INSERT INTO posts (slug, created_at) VALUES (?, ?)").run(slug, Date.now());
      saveDraft(slug, locale, json, intent === "publish", !!translation?.published);
    }
    return true;
  });
  if (!saved) return conflict;
  if (proposing) redirect("/admin/proposals?done=proposed");
  if (intent === "publish") invalidatePost(slug);
  redirect(`/admin/posts/${slug}/${locale}?done=${intent === "publish" ? "published" : "saved"}`);
}

export async function unpublish(slug: string, locale: string, revision: number) {
  await requireUser(editorialRoles);
  if (!isPostSlug(slug) || !isPostLocale(locale)) redirect("/admin?error=invalid");
  const result = getDb().prepare(`
    UPDATE translations SET published = NULL, published_at = NULL, revision = revision + 1
    WHERE slug = ? AND locale = ? AND revision = ? AND published IS NOT NULL
  `).run(slug, locale, revision);
  if (!result.changes) redirect(`/admin/posts/${slug}/${locale}?error=conflict`);
  invalidatePost(slug);
  redirect(`/admin/posts/${slug}/${locale}?done=unpublished`);
}

export async function removePost(slug: string, form: FormData) {
  await requireUser(editorialRoles);
  if (!isPostSlug(slug) || !form.has("confirm")) redirect("/admin?error=invalid");
  const db = getDb();
  transaction(db, () => {
    db.prepare("DELETE FROM posts WHERE slug = ?").run(slug);
    db.prepare("UPDATE proposals SET status = 'rejected' WHERE slug = ? AND status = 'pending'").run(slug);
  });
  invalidatePost(slug);
  redirect("/admin?done=removed");
}

export async function reviewProposal(id: number, form: FormData) {
  await requireUser(editorialRoles);
  const decision = field(form, "decision");
  if (decision !== "accept" && decision !== "reject") redirect("/admin/proposals?error=invalid");
  const db = getDb();
  const result = transaction(db, () => {
    const proposal = proposalById(id);
    if (!proposal || proposal.status !== "pending") return null;
    if (decision === "reject") {
      db.prepare("UPDATE proposals SET status = 'rejected' WHERE id = ?").run(id);
      return proposal;
    }
    const exists = !!db.prepare("SELECT 1 FROM posts WHERE slug = ?").get(proposal.slug);
    const current = getTranslation(proposal.slug, proposal.locale);
    if (exists === !!proposal.new_post || (current?.revision ?? 0) !== proposal.base_revision) {
      return null;
    }
    if (proposal.new_post) {
      db.prepare("INSERT INTO posts (slug, created_at) VALUES (?, ?)").run(proposal.slug, Date.now());
    }
    saveDraft(proposal.slug, proposal.locale, proposal.content, false, !!current?.published);
    db.prepare("UPDATE proposals SET status = 'accepted' WHERE id = ?").run(id);
    return proposal;
  });
  if (!result) redirect(`/admin/proposals/${id}?error=conflict`);
  if (decision === "accept") redirect(`/admin/posts/${result.slug}/${result.locale}?done=accepted`);
  redirect("/admin/proposals?done=rejected");
}

export async function createUser(form: FormData) {
  await requireUser(["admin"]);
  const username = field(form, "username").trim().toLowerCase();
  const password = field(form, "password");
  const role = field(form, "role");
  if (!isUsername(username) || !validPassword(password) || !isRole(role)) {
    redirect("/admin/users?error=invalidUser");
  }
  const hash = await passwordHash(password);
  await requireUser(["admin"]);
  const result = getDb().prepare(`
    INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)
    ON CONFLICT (username) DO NOTHING
  `).run(username, hash, role);
  if (!result.changes) redirect("/admin/users?error=usernameExists");
  redirect("/admin/users?done=userCreated");
}

export async function changeRole(id: number, form: FormData) {
  await requireUser(["admin"]);
  const role = field(form, "role");
  if (!isRole(role)) redirect("/admin/users?error=invalidUser");
  const db = getDb();
  const result = db.prepare(`
    UPDATE users SET role = ? WHERE id = ? AND
      (role <> 'admin' OR ? = 'admin' OR EXISTS (SELECT 1 FROM users WHERE role = 'admin' AND id <> ?))
  `).run(role, id, role, id);
  if (!result.changes) redirect("/admin/users?error=lastAdmin");
  redirect("/admin/users?done=roleChanged");
}

export async function deleteUser(id: number, username: string, form: FormData) {
  const admin = await requireUser(["admin"]);
  if (form.get("confirm") !== "on") redirect("/admin/users?error=invalid");
  const db = getDb();
  const error = transaction(db, () => {
    const user = db.prepare("SELECT role FROM users WHERE id = ? AND username = ?").get(id, username);
    if (!user) return "userMissing";
    if (user.role === "admin" && !db.prepare("SELECT 1 FROM users WHERE role = 'admin' AND id <> ?").get(id)) {
      return "lastAdminDelete";
    }
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    db.prepare("DELETE FROM login_attempts WHERE username = ?").run(username);
  });
  if (error) redirect(`/admin/users?error=${error}`);
  if (id === admin.id) {
    await signOut();
    redirect("/admin/login");
  }
  redirect("/admin/users?done=userDeleted");
}
