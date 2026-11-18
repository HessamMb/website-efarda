import type { Metadata } from "next";
import type { Locale } from "@/i18n/provider";
import fa from "@/i18n/locales/fa.json";
import en from "@/i18n/locales/en.json";
import localFont from "next/font/local";
import "./globals.css";

const peyda = localFont({
  src: [
    { path: "./fonts/Peyda-Thin.ttf", weight: "100" },
    { path: "./fonts/peyda-extralight.ttf", weight: "200" },
    { path: "./fonts/peyda-light.ttf", weight: "300" },
    { path: "./fonts/Peyda-Regular.ttf", weight: "400" },
    { path: "./fonts/Peyda-Medium.ttf", weight: "500" },
    { path: "./fonts/Peyda-SemiBold.ttf", weight: "600" },
    { path: "./fonts/Peyda-Bold.ttf", weight: "700" },
    { path: "./fonts/Peyda-ExtraBold.ttf", weight: "800" },
    { path: "./fonts/Peyda-Black.ttf", weight: "900" },
  ],
  variable: "--font-peyda",
  display: "swap",
});

export function pageMetadata(locale: Locale): Metadata {
  const messages = locale === "en" ? en : fa;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    metadataBase: new URL("https://hessammb.github.io"),
    title: messages["metadata.title"],
    description: messages["metadata.description"],
    alternates: {
      canonical: `${base}${locale === "en" ? "/en/" : "/"}`,
      languages: { fa: `${base}/`, en: `${base}/en/`, "x-default": `${base}/` },
    },
  };
}

export default function RootDocument({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={`${peyda.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
