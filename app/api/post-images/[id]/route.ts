import { canReaderViewImage, getImage, imagePath, isPublicImage } from "@/server/posts";
import { currentUser } from "@/server/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{64}$/.test(id)) return new Response(null, { status: 404 });
  const src = imagePath(id);
  if (!isPublicImage(src)) {
    const user = await currentUser();
    if (!user || user.mustChangePassword || (user.role === "reader" && !canReaderViewImage(src, user.id))) {
      return new Response(null, { status: 404 });
    }
  }
  const image = getImage(id);
  if (!image) return new Response(null, { status: 404 });
  return new Response(Buffer.from(image.bytes), {
    headers: {
      "Content-Type": "image/webp",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
