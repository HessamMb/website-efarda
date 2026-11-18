import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import homeImages from "@/public/images/home/manifest.json";
const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export function Photo({
  name,
  alt,
  className = "",
  eager = false,
}: {
  name: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const image = homeImages[name as keyof typeof homeImages];
  const sizes = name.startsWith("portrait")
    ? "(max-width: 599px) 45vw, 164px"
    : "(max-width: 599px) calc(100vw - 40px), (max-width: 1099px) 55vw, 400px";
  return (
    <Image
      src={assetPath(`/images/home/${name}.webp`)}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      quality={90}
      loading={eager ? "eager" : "lazy"}
      className={`photo ${className}`}
    />
  );
}
export function LinkArrow({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a className={`arrow-link ${className}`} href={href}>
      {children}
      <ArrowLeft size={19} />
    </a>
  );
}
