import RootDocument, { pageMetadata } from "@/app/root-document";
export const metadata = pageMetadata("fa");
export default function PersianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootDocument locale="fa">{children}</RootDocument>;
}
