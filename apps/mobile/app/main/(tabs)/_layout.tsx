import { Tabs } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Menu,
  MessageCircle,
  Plus,
  Telescope,
  Wallet,
} from "lucide-react-native";
import React from "react";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { NAV_THEME } from "~/lib/constants";
import { usePreferencePersistStore } from "~/hooks/stores/usePreferencePersistStore";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "~/lib/useColorScheme";

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const { t } = useTranslation("common");

  const withHaptic = (onPress: Function) => {
    return async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    };
  };

  const VibratingTabButton = (props: any) => {
    const { onPress, children } = props;
    return (
      <Button
        variant="none"
        className="flex-1 items-center justify-center mt-2"
        onPress={withHaptic(onPress)}
      >
        {children}
      </Button>
    );
  };

  const tabsConfig = [
    {
      name: "index",
      title: t("screens.explore"),
      icon: Telescope,
      iconSize: 34,
    },
    {
      name: "chat",
      title: t("screens.chat"),
      icon: MessageCircle,
      iconSize: 34,
    },
    {
      name: "add_job",
      customButton: (props: any) => {
        const { onPress } = props;
        return (
          <Button
            variant="default"
            className="w-16 h-16 -top-4 rounded-full flex items-center justify-center shadow-lg mx-auto"
            onPress={withHaptic(onPress)}
          >
            <Icon as={Plus} size={32} className="text-white" />
          </Button>
        );
      },
      hideLabel: true,
    },
    {
      name: "balance",
      title: t("screens.balance"),
      icon: Wallet,
      iconSize: 34,
    },
    {
      name: "menu",
      title: t("screens.menu"),
      icon: Menu,
      iconSize: 34,
    },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkColorScheme
            ? NAV_THEME.dark.card
            : NAV_THEME.light.card,
          borderColor: "transparent",
        },
        sceneStyle: {
          flex: 1,
          backgroundColor: isDarkColorScheme
            ? NAV_THEME.dark.background
            : NAV_THEME.light.background,
        },
      }}
    >
      {tabsConfig.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: tab.icon
              ? ({ focused }) => (
                  <Icon
                    as={tab.icon}
                    size={tab.iconSize}
                    color={
                      focused
                        ? isDarkColorScheme
                          ? NAV_THEME.dark.primary
                          : NAV_THEME.light.primary
                        : isDarkColorScheme
                        ? NAV_THEME.dark.text
                        : NAV_THEME.light.text
                    }
                  />
                )
              : undefined,
            tabBarButton: tab.customButton || VibratingTabButton,
            tabBarLabel: tab.hideLabel ? () => null : undefined,
            tabBarActiveTintColor: isDarkColorScheme
              ? NAV_THEME.dark.primary
              : NAV_THEME.light.primary,
            tabBarLabelStyle: {
              fontFamily: "Poppins-SemiBold",
              fontSize: 11,
              marginTop: 4,
            },
          }}
        />
      ))}
    </Tabs>
  );
}
