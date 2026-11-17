import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "ارتباط فردا | ۱۵ سال ارتباط، رو به فردا",
  description:
    "ارتباط فردا؛ همراه تجربه‌های مالی روزمره. همراه کارت، ایران کارت و راهکارهای فناوری مالی.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${peyda.variable} h-full antialiased`}
    >
      <body dir="rtl" className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
