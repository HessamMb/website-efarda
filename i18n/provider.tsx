"use client";

import { useState } from "react";
import { createInstance } from "i18next";
import {
  I18nextProvider,
  initReactI18next,
  useTranslation,
} from "react-i18next";
import fa from "./locales/fa.json";
import en from "./locales/en.json";

export type Locale = "fa" | "en";

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  // Each rendered locale owns its instance; static prerenders cannot leak language state.
  const [instance] = useState(() => {
    const i18n = createInstance();
    void i18n.use(initReactI18next).init({
      lng: locale,
      fallbackLng: "fa",
      supportedLngs: ["fa", "en"],
      resources: { fa: { translation: fa }, en: { translation: en } },
      keySeparator: false,
      initAsync: false,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
    return i18n;
  });
  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}

export function LanguageSwitch({ path = "/" }: { path?: string }) {
  const { t, i18n } = useTranslation();
  const target = i18n.language === "fa" ? "en" : "fa";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  // Locale-specific root documents ensure lang/dir and metadata are correct before hydration.
  return (
    <a
      className="language-switch"
      href={`${base}${target === "en" ? "/en" : ""}${path}`}
      hrefLang={target}
      lang={target}
      aria-label={t("language.switch")}
    >
      {t("language.label")}
    </a>
  );
}
