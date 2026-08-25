import { Tabs } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Home,
  LucideIcon,
  MessageCircle,
  Telescope,
  Wallet,
} from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { useRTL } from "~/hooks/useRTL";
import { ColorValue, GestureResponderEvent } from "react-native";
import { useColorPalette } from "@/hooks/useColorPalette";
import { Icon } from "@/components/ui/icon";
import { ActionSheetRef } from "react-native-actions-sheet";
import { ProfileQuickMenuActionSheet } from "~/components/profile/ProfileQuickMenuActionSheet";
import { MenuTabAvatar } from "~/components/shared/MenuTabAvatar";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import React from "react";
import TabButton, { TabButtonProps } from "@/components/shared/TabButton";

export default function TabLayout() {
  const { palette } = useColorPalette();

  const isRTL = useRTL();
  const { t } = useTranslation("common");

  const actionSheetRef = React.useRef<ActionSheetRef>(null);

  const withHaptic = (onPress?: BottomTabBarButtonProps["onPress"]) => {
    return async (e: GestureResponderEvent) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.(
        e as unknown as React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      );
    };
  };

  const tabsConfig: TabButtonProps[] = [
    {
      name: "explore",
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
      name: "index",
      customButton: (props: BottomTabBarButtonProps) => {
        const { onPress } = props;
        return (
          <Button
            variant="default"
            className="w-16 h-16 -top-4 rounded-full flex items-center justify-center shadow-lg mx-auto"
            onPress={withHaptic(onPress)}
          >
            <Icon as={Home} size={32} color="white" />
          </Button>
        );
      },
      hideLabel: true,
    },
    {
      name: "finance",
      title: t("screens.finance"),
      icon: Wallet,
      iconSize: 34,
    },
    {
      name: "menu",
      title: t("screens.menu"),
      customIcon: ({
        color,
        focused,
      }: {
        color: ColorValue;
        focused: boolean;
      }) => <MenuTabAvatar color={color} focused={focused} />,
      onLongPress: () => actionSheetRef.current?.show(),
    },
  ];

  const orderedTabs = isRTL ? [...tabsConfig].reverse() : tabsConfig;

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            flex: 1,
            backgroundColor: "transparent",
          },
          tabBarShowLabel: true,
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: palette.foreground,
          tabBarStyle: {
            borderTopEndRadius: 28,
            borderTopStartRadius: 28,
            paddingTop: 10,
            paddingInline: 10,
            backgroundColor: palette.card,
            borderColor: palette.border,
            borderTopWidth: 0,
            height: "9%",
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
          },
        }}
      >
        {orderedTabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarButton: tab.customButton
                ? tab.customButton
                : (props) => (
                    <TabButton
                      {...props}
                      name={tab.name}
                      onLongPress={tab.onLongPress}
                    />
                  ),
              tabBarIcon: tab.customIcon
                ? ({ color, focused }) =>
                    tab.customIcon!({ color, focused, size: 28 })
                : tab.icon
                  ? ({ color, focused }) => (
                      <Icon
                        as={tab.icon as LucideIcon}
                        size={focused ? 28 : 24}
                        color={color}
                      />
                    )
                  : undefined,
              ...(tab.hideLabel ? { tabBarLabel: () => null } : {}),
            }}
          />
        ))}
      </Tabs>
      <ProfileQuickMenuActionSheet ref={actionSheetRef} />
    </>
  );
}
