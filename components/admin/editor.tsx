"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown, ArrowUp, Heading, ImageIcon, List, Minus, Plus, Quote, Trash2, Type,
} from "lucide-react";
import {
  blockKinds, postCategories, type BlockKind, type CoverImage, type PostContent,
} from "@/data/post-content";
import type { Locale } from "@/i18n/provider";
import { submitPost } from "./actions";

const blockLabels = {
  paragraph: { title: "پاراگراف", icon: Type },
  heading: { title: "تیتر", icon: Heading },
  quote: { title: "نقل‌قول", icon: Quote },
  list: { title: "فهرست", icon: List },
  image: { title: "تصویر", icon: ImageIcon },
  divider: { title: "جداکننده", icon: Minus },
};

const categoryLabels = ["اخبار شرکت", "رویدادها و نمایشگاه", "مدیریت و هم‌بانکی", "اخبار سازمانی"];

type EditorBlock = { id: number; kind: BlockKind; text: string; image?: CoverImage };

export function ImagePreview({ image }: { image: CoverImage }) {
  return (
    <Image
      className="admin-image-preview"
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      unoptimized
    />
  );
}

export default function Editor({
  slug, locale, revision, initial, reader,
}: {
  slug?: string;
  locale: Locale;
  revision: number;
  initial?: PostContent;
  reader: boolean;
}) {
  const action = submitPost.bind(null, { slug, locale, revision });
  const [state, formAction, pending] = useActionState(action, { error: "" });
  const [fields, setFields] = useState({
    slug: "",
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    coverAlt: initial?.images[0]?.alt ?? "",
    imageNote: initial?.imageNote ?? "",
    sourceUrl: initial?.sourceUrl ?? "",
    category: initial?.categoryKey ?? postCategories[0],
  });
  const [flags, setFlags] = useState({
    sourceIsProfile: !!initial?.sourceIsProfile,
    isSummary: !!initial?.isSummary,
  });
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => initial?.blocks.map((block, id) => ({
    id,
    kind: block.kind,
    text: block.kind === "image" ? block.image.alt : "text" in block ? block.text : "",
    image: block.kind === "image" ? block.image : undefined,
  })) ?? [{ id: 0, kind: "paragraph", text: "" }]);
  const nextId = useRef(initial?.blocks.length ?? 1);
  const contentDir = locale === "fa" ? "rtl" : "ltr";
  const cover = initial?.images[0];
  const gallery = initial?.images.slice(1) ?? [];
  const [retainedPhotos, setRetainedPhotos] = useState(() => gallery.map(() => true));
  const textField = (name: keyof typeof fields) => ({
    name,
    value: fields[name],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields((previous) => ({ ...previous, [name]: event.target.value })),
  });

  function addBlock(kind: BlockKind) {
    const id = nextId.current++;
    setBlocks((items) => [...items, { id, kind, text: "" }]);
  }

  function moveBlock(index: number, step: number) {
    setBlocks((items) => {
      const next = items.slice();
      [next[index], next[index + step]] = [next[index + step], next[index]];
      return next;
    });
  }

  return (
    <form action={formAction} className="admin-editor">
      {state.error && <p className="admin-message admin-error" role="alert">{state.error}</p>}
      <fieldset disabled={pending} className="admin-fields">
        <section className="admin-card">
          <h2>اطلاعات مطلب</h2>
          <div className="admin-form-grid">
            {!slug && (
              <label>
                نشانی مطلب
                <input {...textField("slug")} required placeholder="company-news" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" dir="ltr" maxLength={80} />
              </label>
            )}
            <label>
              عنوان
              <input {...textField("title")} dir={contentDir} required maxLength={240} />
            </label>
            <label>
              دسته‌بندی
              <select {...textField("category")}>
                {postCategories.map((key, index) => <option key={key} value={key}>{categoryLabels[index]}</option>)}
              </select>
            </label>
            <label className="admin-span">
              خلاصه
              <textarea {...textField("excerpt")} dir={contentDir} rows={3} maxLength={1000} />
            </label>
          </div>
        </section>
        <section className="admin-card">
          <h2>تصویر اصلی</h2>
          {cover && <ImagePreview image={cover} />}
          <div className="admin-form-grid">
            <label>
              {cover ? "جایگزینی تصویر اصلی" : "بارگذاری تصویر اصلی"}
              <input type="file" name="cover" accept="image/jpeg,image/png,image/webp" required={!cover} />
              <small>JPG، PNG یا WebP تا ۵ مگابایت</small>
            </label>
            <label>
              متن جایگزین تصویر
              <input {...textField("coverAlt")} dir={contentDir} maxLength={240} />
            </label>
            <label className="admin-span">
              توضیح زیر تصویر
              <input {...textField("imageNote")} dir={contentDir} maxLength={500} />
            </label>
          </div>
          <div className="admin-gallery">
            <h3>عکس‌های گالری</h3>
            {gallery.length > 0 && (
              <div className="admin-gallery-list">
                {gallery.map((image, index) => (
                  <div key={`${image.src}-${index}`}>
                    <ImagePreview image={image} />
                    <label className="admin-check">
                      <input
                        type="checkbox"
                        name="retainedPhoto"
                        value={index + 1}
                        checked={retainedPhotos[index]}
                        onChange={(event) => {
                          const keep = event.target.checked;
                          setRetainedPhotos((photos) => photos.map((photo, i) => i === index ? keep : photo));
                        }}
                      />
                      حفظ عکس {new Intl.NumberFormat("fa").format(index + 1)}
                    </label>
                  </div>
                ))}
              </div>
            )}
            <label>
              افزودن عکس به گالری
              <input type="file" name="gallery" multiple accept="image/jpeg,image/png,image/webp" />
            </label>
          </div>
        </section>
        <section className="admin-card">
          <h2>بلوک‌های محتوا</h2>
          <div className="admin-blocks">
            {blocks.map((block, index) => {
              const { title, icon: Icon } = blockLabels[block.kind];
              return (
                <fieldset key={block.id} className="admin-block">
                  <legend><Icon size={16} aria-hidden="true" /> {title}</legend>
                  <input type="hidden" name="block" value={block.id} />
                  <input type="hidden" name={`kind-${block.id}`} value={block.kind} />
                  <div className="admin-block-controls">
                    <button type="button" aria-label="انتقال بلوک به بالا" disabled={index === 0} onClick={() => moveBlock(index, -1)}><ArrowUp size={17} /></button>
                    <button type="button" aria-label="انتقال بلوک به پایین" disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)}><ArrowDown size={17} /></button>
                    <button type="button" aria-label="حذف بلوک" onClick={() => setBlocks((items) => items.filter(({ id }) => id !== block.id))}><Trash2 size={17} /></button>
                  </div>
                  {block.kind === "image" && (
                    <>
                      {block.image && (
                        <>
                          <ImagePreview image={block.image} />
                          <input type="hidden" name={`source-${block.id}`} value={block.id} />
                        </>
                      )}
                      <label>
                        فایل تصویر
                        <input name={`file-${block.id}`} type="file" accept="image/jpeg,image/png,image/webp" required={!block.image} />
                      </label>
                    </>
                  )}
                  {block.kind !== "divider" && (
                    <label>
                      {block.kind === "image" ? "متن جایگزین تصویر" : block.kind === "list" ? "هر گزینه در یک خط" : title}
                      <textarea
                        name={`text-${block.id}`}
                        dir={contentDir}
                        value={block.text}
                        rows={block.kind === "heading" || block.kind === "image" ? 1 : 4}
                        maxLength={block.kind === "image" ? 240 : 10_000}
                        onChange={(event) => {
                          const text = event.target.value;
                          setBlocks((items) => items.map((item) => item.id === block.id ? { ...item, text } : item));
                        }}
                      />
                    </label>
                  )}
                </fieldset>
              );
            })}
          </div>
          <div className="admin-toolbar">
            {blockKinds.map((kind) => (
              <button type="button" className="admin-button secondary" key={kind} disabled={blocks.length >= 40} onClick={() => addBlock(kind)}>
                <Plus size={15} aria-hidden="true" /> {blockLabels[kind].title}
              </button>
            ))}
          </div>
        </section>
        <section className="admin-card">
          <h2>منبع خبر</h2>
          <label>
            نشانی منبع
            <input {...textField("sourceUrl")} type="url" dir="ltr" maxLength={2000} />
          </label>
          <label className="admin-check">
            <input type="checkbox" name="sourceIsProfile" checked={flags.sourceIsProfile} onChange={(event) => setFlags({ ...flags, sourceIsProfile: event.target.checked })} />
            نشانی مربوط به صفحه رسمی شرکت است
          </label>
          <label className="admin-check">
            <input type="checkbox" name="isSummary" checked={flags.isSummary} onChange={(event) => setFlags({ ...flags, isSummary: event.target.checked })} />
            این مطلب خلاصه خبر است
          </label>
        </section>
        <div className="admin-toolbar">
          {reader ? (
            <button className="admin-button" name="intent" value="propose">ارسال پیشنهاد برای بررسی</button>
          ) : (
            <>
              <button className="admin-button secondary" name="intent" value="draft">ذخیره پیش‌نویس</button>
              <button className="admin-button" name="intent" value="publish">انتشار {locale === "fa" ? "فارسی" : "انگلیسی"}</button>
            </>
          )}
          {pending && <span role="status">در حال ذخیره…</span>}
        </div>
      </fieldset>
    </form>
  );
}
