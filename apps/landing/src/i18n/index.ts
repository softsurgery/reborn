"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources } from "@softsurgery/i18n";
import { i18nConfig, resolveSupportedLng } from "./config";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...i18nConfig,
      resources,
      lng: resolveSupportedLng(
        typeof window !== "undefined" ? window.navigator.language : undefined,
      ),
    });
}

export default i18n;
export { i18nConfig, resolveSupportedLng, supportedLngs } from "./config";
export type { SupportedLng } from "./config";
