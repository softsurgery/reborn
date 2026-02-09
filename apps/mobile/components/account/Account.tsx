import React from "react";
import { View } from "react-native";
import {
  Bell,
  Bug,
  FlaskConical,
  HelpCircle,
  LogOut,
  MailCheck,
  Settings,
  User,
} from "lucide-react-native";
import { Separator } from "../ui/separator";
import { MenuItem } from "./MenuItem";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import { useQueryClient } from "@tanstack/react-query";
import { ApplicationHeader } from "../shared/AppHeader";
import { router } from "expo-router";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { Text } from "../ui/text";
import { StableScrollView } from "../shared/StableScrollView";
import { cn } from "~/lib/utils";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { useTranslation } from "react-i18next";

interface AccountProps {
  className?: string;
}

export const Account = ({ className }: AccountProps) => {
  const { t } = useTranslation("common");
  const authPersistStore = useAuthPersistStore();
  const { newCount, resetCount } = useNotificationContext();

  const queryClient = useQueryClient();

  const signout = () => {
    authPersistStore.logout();
    queryClient.clear();
    router.replace("/");
  };

  const menus = {
    appSettings: {
      key: "app-settings",
      title: undefined,
      submenus: [
        {
          title: "Account",
          icon: User,
          onPress: () => router.navigate("/main/account/managment", {}),
        },
        {
          title: "User Preferences",
          icon: Settings,
          onPress: () => router.navigate("/main/account/user-preferences", {}),
        },
        { title: "Notifications", icon: Bell, onPress: () => {} },
      ],
    },
    support: {
      key: "support",
      title: "Support",
      submenus: [
        {
          title: "Report a Bug",
          icon: Bug,
          onPress: () =>
            router.navigate("/main/account/support/report-bug", {}),
        },
        {
          title: "Send us Feedback",
          icon: MailCheck,
          onPress: () =>
            router.navigate("/main/account/support/send-feedback", {}),
        },
        {
          title: "FAQs",
          icon: HelpCircle,
          onPress: () => router.navigate("/main/account/support/faqs", {}),
        },
      ],
    },
    accountActions: {
      key: "account-actions",
      title: "Account Actions",
      submenus: [
        { title: "Switch Account", icon: LogOut, onPress: signout },
        {
          title: "Try Anything",
          icon: FlaskConical,
          onPress: () => router.navigate("/", {}),
        },
      ],
    },
  };

  return (
    <StableSafeAreaView className={cn("flex flex-1 mx-2", className)}>
      <ApplicationHeader
        title={t("screens.menu")}
        shortcuts={[
          {
            icon: User,
            onPress: () => router.navigate("/main/my-space", {}),
          },
          {
            icon: Bell,
            onPress: () => {
              router.navigate("/main/notifications", {});
              resetCount();
            },
            badgeText: newCount > 0 ? `${newCount}` : undefined,
          },
        ]}
      />

      <StableScrollView className="flex flex-col gap-6 px-2 py-4">
        {Object.values(menus).map((section) => (
          <View key={section.key}>
            {section.title ? (
              <Text variant={"h3"} className="mb-5 px-1">
                {section.title}
              </Text>
            ) : null}
            <View className="flex flex-col bg-card rounded-xl overflow-hidden border border-border/50 mb-4">
              {section.submenus.map((item, index) => (
                <React.Fragment key={item.title}>
                  <MenuItem
                    title={item.title}
                    icon={item.icon}
                    onPress={item.onPress}
                  />
                  {index < section.submenus.length - 1 && (
                    <Separator className="mx-4" />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}
      </StableScrollView>
    </StableSafeAreaView>
  );
};
