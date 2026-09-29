import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { cn } from "@reborn/lib";
import { ApplicationHeader } from "@reborn/mobile-components";
import { StableSafeAreaView } from "@reborn/mobile-components";
import { SettingRow, SettingRowProps } from "../SettingsRow";
import { Text } from "@reborn/mobile-ui";
import { Separator } from "@reborn/mobile-ui";
import { Badge } from "@reborn/mobile-ui";

import { AppHeaderBack } from "@reborn/mobile-components";
import { StableScrollView } from "@reborn/mobile-components";

interface PrivacySecurityPortalProps {
  className?: string;
}

interface SettingsSection {
  key: string;
  title: string;
  description: string;
  rows: SettingRowProps[];
}

export const PrivacySecurityPortal = ({
  className,
}: PrivacySecurityPortalProps) => {
  const { t } = useTranslation("settings");
  const cardClass = "border-b-border border-t-border bg-background";

  const sections: SettingsSection[] = [
    {
      key: "security",
      title: t(
        "settings.account.screens.privacy-security.screens.account-security.title",
      ),
      description: t(
        "settings.account.screens.privacy-security.screens.account-security.description",
      ),
      rows: [
        {
          title: t(
            "settings.account.screens.privacy-security.screens.account-security.change-email.title",
          ),
          description: t(
            "settings.account.screens.privacy-security.screens.account-security.change-email.description",
          ),
          className: "p-1 px-4",
          onPress: () => router.push("/main/account/change-email"),
        },
        {
          title: t(
            "settings.account.screens.privacy-security.screens.account-security.change-password.title",
          ),
          description: t(
            "settings.account.screens.privacy-security.screens.account-security.change-password.description",
          ),
          className: "p-1 px-4",
          onPress: () => router.push("/main/account/change-password"),
        },
        {
          title: t(
            "settings.account.screens.privacy-security.screens.account-security.two-factor-authentication.title",
          ),
          description: t(
            "settings.account.screens.privacy-security.screens.account-security.two-factor-authentication.description",
          ),
          className: "p-1 px-4",
          rightComponent: (
            <Badge variant="outline">
              <Text className="text-xs font-medium">
                {t("settings.general.soon")}
              </Text>
            </Badge>
          ),
        },
      ],
    },
    {
      key: "privacy",
      title: t(
        "settings.account.screens.privacy-security.screens.privacy.title",
      ),
      description: t(
        "settings.account.screens.privacy-security.screens.privacy.description",
      ),
      rows: [
        {
          title: t(
            "settings.account.screens.privacy-security.screens.privacy.data-visibility.title",
          ),
          description: t(
            "settings.account.screens.privacy-security.screens.privacy.data-visibility.description",
          ),
          className: "p-1 px-4",
          rightComponent: (
            <Badge variant="outline">
              <Text className="text-xs font-medium">
                {t("settings.general.soon")}
              </Text>
            </Badge>
          ),
        },
        {
          title: t(
            "settings.account.screens.privacy-security.screens.privacy.download-data.title",
          ),
          description: t(
            "settings.account.screens.privacy-security.screens.privacy.download-data.description",
          ),
          className: "p-1 px-4",
          rightComponent: (
            <Badge variant="outline">
              <Text className="text-xs font-medium">
                {t("settings.general.soon")}
              </Text>
            </Badge>
          ),
        },
      ],
    },
  ];

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={t("screens.privacySecurity", "Privacy & Security")}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />

      <StableScrollView className="bg-background ">
        <View className="flex flex-col">
          {sections.map((section) => (
            <View key={section.key} className={cardClass}>
              <View className="px-8 py-4 bg-card mb-4">
                <Text className="text-lg font-semibold">{section.title}</Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  {section.description}
                </Text>
              </View>

              <View className="px-4 pb-4 flex flex-col">
                {section.rows.map((row, index) => {
                  const isLast = index === section.rows.length - 1;

                  return (
                    <View key={index} className="flex flex-col gap-2">
                      <SettingRow className="mt-1" {...row} />
                      {!isLast && <Separator className="mb-2" />}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </StableScrollView>
    </StableSafeAreaView>
  );
};
