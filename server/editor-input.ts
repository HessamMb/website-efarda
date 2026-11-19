import { createHash } from "node:crypto";
import sharp from "sharp";
import { blockKinds, postCategories, type PostBlock, type PostContent } from "@/data/post-content";
import { imagePath, type PendingImage } from "./posts";

export function field(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

async function upload(file: FormDataEntryValue | null, alt: string, uploads: PendingImage[]) {
  if (!(file instanceof File) || file.size === 0) return;
  if (file.size > 5_000_000 || uploads.length >= 6) throw new Error("image");
  const input = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 25_000_000 });
  const { format } = await input.metadata();
  if (format !== "jpeg" && format !== "png" && format !== "webp") throw new Error("image");

  const { data, info } = await input.rotate().resize({
    width: 2000, height: 2000, fit: "inside", withoutEnlargement: true,
  }).webp({ quality: 86 }).toBuffer({ resolveWithObject: true });

  const id = createHash("sha256").update(data).digest("hex");
  const image = { src: imagePath(id), width: info.width, height: info.height, alt };
  uploads.push({ id, bytes: data, image });
  return image;
}

export async function parseContent(form: FormData, current?: PostContent) {
  const title = field(form, "title").trim();
  const excerpt = field(form, "excerpt").trim();
  const categoryKey = postCategories.find((key) => key === field(form, "category"));
  const sourceUrl = field(form, "sourceUrl").trim();
  const imageNote = field(form, "imageNote").trim();
  const alt = field(form, "coverAlt").trim();
  if (!title || title.length > 240 || excerpt.length > 1000 || !categoryKey || alt.length > 240 ||
      imageNote.length > 500 || sourceUrl.length > 2000) throw new Error("fields");
  if (sourceUrl && !["https:", "http:"].includes(new URL(sourceUrl).protocol)) throw new Error("fields");

  const uploads: PendingImage[] = [];
  const previous = current?.images[0];
  const cover = await upload(form.get("cover"), alt || title, uploads) ?? (previous && {
    ...previous, alt: alt || title,
  });
  if (!cover) throw new Error("cover");

  const blocks: PostBlock[] = [];
  const keys = form.getAll("block");
  if (keys.length > 40 || new Set(keys).size !== keys.length) throw new Error("blocks");
  for (const id of keys) {
    if (typeof id !== "string" || !/^\d{1,8}$/.test(id)) throw new Error("blocks");
    const kind = blockKinds.find((key) => key === field(form, "kind-" + id));
    if (!kind) throw new Error("blocks");
    if (kind === "divider") {
      blocks.push({ kind });
    } else if (kind === "image") {
      const alt = field(form, "text-" + id).trim();
      if (alt.length > 240) throw new Error("blocks");
      const source = field(form, "source-" + id);
      const existing = /^\d{1,2}$/.test(source) ? current?.blocks[Number(source)] : undefined;
      const image = await upload(form.get("file-" + id), alt, uploads) ??
        (existing?.kind === "image" && { ...existing.image, alt });
      if (!image) throw new Error("image");
      blocks.push({ kind, image });
    } else {
      const text = field(form, "text-" + id).trim();
      if (text.length > 10_000) throw new Error("blocks");
      if (text) blocks.push({ kind, text });
    }
  }

  const retained = new Set(form.getAll("retainedPhoto"));
  const images = [cover, ...(current?.images.slice(1).filter(
    (_, index) => retained.has(String(index + 1)),
  ) ?? [])];
  for (const file of form.getAll("gallery")) {
    const image = await upload(file, title, uploads);
    if (image) images.push(image);
  }
  if (images.length > 20) throw new Error("image");

  const content: PostContent = {
    title, excerpt, categoryKey, blocks, images,
    sourceUrl: sourceUrl || undefined,
    sourceIsProfile: !!sourceUrl && form.has("sourceIsProfile"),
    imageNote: imageNote || undefined,
    isSummary: form.has("isSummary"),
  };
  return { content, uploads };
}
