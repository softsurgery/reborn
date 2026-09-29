import React from "react";
import StableScrollView from "@reborn/mobile-components";
import { DarkModePreferenceCard } from "./DarkModePreferenceCard";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Separator } from "@reborn/mobile-ui";
import { ChevronLeft, View } from "lucide-react-native";
import { ApplicationHeader } from "../shared/AppHeader";
import { router } from "expo-router";
import { StableSafeAreaView } from "@reborn/mobile-components";
import { cn } from "@reborn/lib";

interface UserPreferencesPortalProps {
  className?: string;
}

const UserPreferencesPortal = ({ className }: UserPreferencesPortalProps) => {
  const { t } = useTranslation("common");
  return (
    <StableSafeAreaView className={cn("flex flex-1", className)}>
      <ApplicationHeader
        title={t("screens.userPreferences")}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "user-preferences",
            icon: ChevronLeft,
            onPress: () => router.back(),
          },
        ]}
      />
      <StableScrollView className="p-4">
        <DarkModePreferenceCard className="my-2" />
        <Separator />
        <LanguageSwitcher />
      </StableScrollView>
    </StableSafeAreaView>
  );
};

export default UserPreferencesPortal;
