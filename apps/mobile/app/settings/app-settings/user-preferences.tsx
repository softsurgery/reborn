import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { Separator } from "~/components/ui/separator";
import { languages } from "~/constants/languages";
import { DarkModePreferenceCard } from "~/components/user-preferences/DarkModePreferenceCard";
import { LanguagePreferenceCard } from "~/components/user-preferences/LanguagePreferenceCard";
import { StatusPreferenceCard } from "~/components/user-preferences/StatusPreferenceCard";
import { StoragePreferenceCard } from "~/components/user-preferences/StoragePreferenceCard";
import { SecurityPreferenceCard } from "~/components/user-preferences/SecurityPreferenceCard";
import { PrivacyPreferenceCard } from "~/components/user-preferences/PrivecyPreferenceCard";

export default function Screen() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [autoDownload, setAutoDownload] = useState<boolean>(true);
  const [statusPreference, setStatusPreference] = useState<boolean>(true);

  const handleClearCache = () => {
    // TODO: Implement cache clearing logic
    alert("Cache cleared!");
  };

  useEffect(() => {
    const loadLanguagePreference = async () => {
      const storedLanguage = await AsyncStorage.getItem("language");
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
      } else {
        setSelectedLanguage(languages[0].value);
      }
    };
    loadLanguagePreference();
  }, []);

  const toggleTheme = async () => {
    const newTheme = isDarkColorScheme ? "light" : "dark";
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const handleLanguageSelect = async (value: string) => {
    setSelectedLanguage(value);
    await AsyncStorage.setItem("language", value);
  };
  return (
    <ScrollView className="flex-1 px-4 py-4 mb-2">
      <DarkModePreferenceCard
        onPress={toggleTheme}
        switchState={isDarkColorScheme}
        title="Dark Mode"
        subtitle="Enable or disable dark mode for the app"
        className="my-2"
      />
      <Separator className="rounded-full" />
      <LanguagePreferenceCard
        className="my-2"
        onSelect={handleLanguageSelect}
        options={languages.map((language) => ({
          label: language.label,
          value: language.value,
        }))}
        value={selectedLanguage}
      />
      <Separator className="rounded-full" />
      <StatusPreferenceCard
        title="Online Status"
        subtitle="Toggle your online visibility"
        className="my-2"
        switchState={statusPreference}
        onPress={() => setStatusPreference(!statusPreference)}
      />
      <Separator className="rounded-full" />
      <StoragePreferenceCard
        autoDownload={autoDownload}
        onToggleAutoDownload={() => setAutoDownload(!autoDownload)}
        onClearCache={handleClearCache}
        className="my-2"
      />
      <Separator className="rounded-full" />
      <SecurityPreferenceCard className="my-2" />
      <Separator className="rounded-full" />
      <PrivacyPreferenceCard className="my-2" />
    </ScrollView>
  );
}
