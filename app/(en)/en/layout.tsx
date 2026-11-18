import RootDocument, { pageMetadata } from "@/app/root-document";
export const metadata = pageMetadata("en");
export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
