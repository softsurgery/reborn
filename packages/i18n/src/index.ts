import landingEn from "./locales/en/landing.json";
import landingFr from "./locales/fr/landing.json";
import landingAr from "./locales/ar/landing.json";

export * from "react-i18next";
export { default as i18next } from "i18next";

export const supportedLngs = ["en", "fr", "ar"] as const;
export type SupportedLng = (typeof supportedLngs)[number];

export const resolveSupportedLng = (lng: string): SupportedLng =>
  supportedLngs.includes(lng as SupportedLng) ? (lng as SupportedLng) : "en";

export const i18nConfig = {
  supportedLngs,
  fallbackLng: "en" as SupportedLng,
};

export const resources = {
  en: {
    landing: landingEn,
  },
  fr: {
    landing: landingFr,
  },
  ar: {
    landing: landingAr,
  },
};

