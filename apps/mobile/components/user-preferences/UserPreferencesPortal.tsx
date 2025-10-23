import React from "react";
import { StableScrollView } from "../shared/StableScrollView";
import { DarkModePreferenceCard } from "./DarkModePreferenceCard";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Separator } from "../ui/separator";

const UserPreferencesPortal: React.FC = () => {
  const { t, i18n } = useTranslation("common");
  return (
    <StableScrollView className="p-4">
      <DarkModePreferenceCard className="my-2" />
      <Separator />
      <LanguageSwitcher className="my-2" />
    </StableScrollView>
  );
};

export default UserPreferencesPortal;
