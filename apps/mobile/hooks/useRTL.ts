import React from "react";
import { I18nManager } from "react-native";
import * as Localization from "expo-localization";
import i18n from "@/i18n";
import { usePreferencePersistStore } from "./stores/usePreferencePersistStore";

/**
 * This app applies RTL in JS (flex-row-reverse, text-right, etc.).
 * Native I18nManager RTL would mirror Yoga and cancel those flips on cold start.
 */
I18nManager.allowRTL(false);
I18nManager.swapLeftAndRightInRTL(false);
if (I18nManager.isRTL) {
  I18nManager.forceRTL(false);
}

export const getDeviceLanguageCode = () => {
  const locale = Localization.getLocales()[0];
  return (
    locale?.languageCode ||
    locale?.languageTag?.split("-")[0] ||
    "en"
  );
};

export const resolveAppLanguage = (language?: string | null) => {
  if (language && language !== "system") {
    return language.split("-")[0];
  }

  const i18nCode = i18n.language?.split("-")[0];
  if (i18nCode && i18nCode !== "system" && i18nCode !== "dev") {
    return i18nCode;
  }

  return getDeviceLanguageCode().split("-")[0];
};

export const isRtlLanguage = (language?: string | null) => {
  if (!language) return false;
  return language.toLowerCase().split("-")[0] === "ar";
};

export const getIsRTL = (language?: string | null) => {
  if (language && language !== "system") {
    return isRtlLanguage(language);
  }

  if (isRtlLanguage(i18n.language)) return true;

  const locale = Localization.getLocales()[0];
  if (locale?.textDirection === "rtl") return true;

  return isRtlLanguage(getDeviceLanguageCode());
};

export const useRTL = () => {
  const language = usePreferencePersistStore((state) => state.language);
  const [i18nLanguage, setI18nLanguage] = React.useState(i18n.language);

  React.useEffect(() => {
    const onLanguageChanged = (lng: string) => setI18nLanguage(lng);
    i18n.on("languageChanged", onLanguageChanged);
    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, []);

  if (language && language !== "system") {
    return isRtlLanguage(language);
  }

  return getIsRTL(language) || isRtlLanguage(i18nLanguage);
};
