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
import { PlanInfo } from "./Plan";
import { GoPremium } from "./GoPremium";
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

interface AccountProps {
  className?: string;
}

export const Account = ({ className }: AccountProps) => {
  const authPersistStore = useAuthPersistStore();
  const { newCount, resetCount } = useNotificationContext();

  const queryClient = useQueryClient();

  const signout = async () => {
    authPersistStore.logout();
    queryClient.clear();
    router.navigate("/main", {});
  };

  const menus = {
    "app-settings": {
      title: "App Settings",
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
    "account-actions": {
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
        title="Menu"
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

      <PlanInfo className="my-2" />
      <GoPremium className="my-3" />

      <StableScrollView className="flex flex-col gap-5">
        {Object.values(menus).map((section) => (
          <View key={section.title}>
            <Text variant={"h3"}>{section.title}</Text>
            <View className="flex flex-col mt-2">
              {section.submenus.map((item, index) => (
                <View key={item.title}>
                  <MenuItem
                    title={item.title}
                    icon={item.icon}
                    onPress={item.onPress}
                  />
                  {index < section.submenus.length - 1 && <Separator />}
                </View>
              ))}
            </View>
          </View>
        ))}
      </StableScrollView>
    </StableSafeAreaView>
  );
};
