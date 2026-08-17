import { Tabs, useSegments } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Home,
  LucideIcon,
  MessageCircle,
  Telescope,
  User,
  Wallet,
} from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { useRTL } from "~/hooks/useRTL";
import { useColorPalette } from "@/hooks/useColorPalette";
import { Icon } from "@/components/ui/icon";
import { VibratingTabButton } from "@/components/shared/VibratingTabButton";

export default function TabLayout() {
  const { palette } = useColorPalette();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1];

  const isRTL = useRTL();
  const { t } = useTranslation("common");

  const withHaptic = (onPress: Function) => {
    return async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    };
  };

  const tabsConfig = [
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
      customButton: (props: any) => {
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
      name: "balance",
      title: t("screens.balance"),
      icon: Wallet,
      iconSize: 34,
    },
    {
      name: "menu",
      title: t("screens.menu"),
      icon: User,
      iconSize: 34,
    },
  ];

  const orderedTabs = isRTL ? [...tabsConfig].reverse() : tabsConfig;

  return (
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
                  <VibratingTabButton
                    {...props}
                    indicatorColor={palette.primary}
                  />
                ),
            tabBarIcon: tab.icon
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
  );
}
