import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import enCommon from "./locales/en/common.json";
import frCommon from "./locales/fr/common.json";
import arCommon from "./locales/ar/common.json";

import enNotifications from "./locales/en/notifications.json";
import frNotifications from "./locales/fr/notifications.json";
import arNotifications from "./locales/ar/notifications.json";

import enSettings from "./locales/en/settings.json";
import frSettings from "./locales/fr/settings.json";
import arSettings from "./locales/ar/settings.json";

import enMenu from "./locales/en/menu.json";
import frMenu from "./locales/fr/menu.json";
import arMenu from "./locales/ar/menu.json";

const resources = {
  en: {
    common: enCommon,
    notifications: enNotifications,
    settings: enSettings,
    menu: enMenu,
  },
  fr: {
    common: frCommon,
    notifications: frNotifications,
    settings: frSettings,
    menu: frMenu,
  },
  ar: {
    common: arCommon,
    notifications: arNotifications,
    settings: arSettings,
    menu: arMenu,
  },
};

const locales = Localization.getLocales();
const languageCode = locales[0]?.languageCode || "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: languageCode,
  fallbackLng: "en",
  ns: ["common", "notifications", "settings", "menu"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
