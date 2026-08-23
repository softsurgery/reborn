import { Tabs, useSegments } from "expo-router";
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
import { ColorValue, GestureResponderEvent, Pressable, View } from "react-native";
import { useColorPalette } from "@/hooks/useColorPalette";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import React from "react";
import { Icon } from "@/components/ui/icon";
import { ActionSheetRef } from "react-native-actions-sheet";
import { ProfileQuickMenuActionSheet } from "~/components/profile/ProfileQuickMenuActionSheet";
import { MenuTabAvatar } from "~/components/shared/MenuTabAvatar";
import { BottomTabBarButtonProps } from "expo-router/build/react-navigation/bottom-tabs";

interface VibratingTabButtonProps extends BottomTabBarButtonProps {
  onLongPress?: () => void;
}

interface TabConfig {
  name: string;
  title?: string;
  icon?: LucideIcon;
  iconSize?: number;
  customButton?: (props: BottomTabBarButtonProps) => React.ReactNode;
  customIcon?: (props: {
    focused: boolean;
    color: ColorValue;
    size: number;
  }) => React.ReactNode;
  hideLabel?: boolean;
  onLongPress?: () => void;
}

export default function TabLayout() {
  const { palette } = useColorPalette();

  const isRTL = useRTL();
  const { t } = useTranslation("common");

  const actionSheetRef = React.useRef<ActionSheetRef>(null);

  const withHaptic = (onPress?: BottomTabBarButtonProps["onPress"]) => {
    return async (e: GestureResponderEvent) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.(e as unknown as React.MouseEvent<HTMLAnchorElement, MouseEvent>);
    };
  };

  const VibratingTabButton = ({
    accessibilityState,
    children,
    onPress,
    onLongPress,
  }: VibratingTabButtonProps) => {
    const focused = accessibilityState?.selected;
    const scale = useSharedValue(focused ? 1 : 0);

    React.useEffect(() => {
      scale.value = withSpring(focused ? 1 : 0, {
        damping: 15,
        stiffness: 140,
      });
    }, [focused]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(scale.value, [0, 1], [1, 1.08]),
        },
      ],
    }));

    const indicatorStyle = useAnimatedStyle(() => ({
      opacity: scale.value,
      transform: [
        {
          scaleX: withSpring(focused ? 1 : 0.4),
        },
      ],
    }));

    const handlePress = async (e: GestureResponderEvent) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.(e as unknown as React.MouseEvent<HTMLAnchorElement, MouseEvent>);
    };

    const handleLongPress = async () => {
      if (onLongPress) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onLongPress();
      }
    };

    return (
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={300}
        className="mt-2"
      >
        <Animated.View
          style={animatedStyle}
          className="items-center justify-center gap-1"
        >
          {children}

          <Animated.View
            style={indicatorStyle}
            className="mt-1 h-1 w-8 rounded-full"
          >
            <View
              style={{ backgroundColor: palette.primary }}
              className="h-full w-full rounded-full"
            />
          </Animated.View>
        </Animated.View>
      </Pressable>
    );
  };

  const tabsConfig: TabConfig[] = [
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
      name: "balance",
      title: t("screens.balance"),
      icon: Wallet,
      iconSize: 34,
    },
    {
      name: "menu",
      title: t("screens.menu"),
      customIcon: ({ color, focused }: { color: ColorValue; focused: boolean }) => (
        <MenuTabAvatar color={color} focused={focused} />
      ),
      // onLongPress: () => actionSheetRef.current?.show(),
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
                : (props: BottomTabBarButtonProps) => (
                    <VibratingTabButton
                      {...props}
                      onLongPress={tab.onLongPress}
                    />
                  ),
              tabBarIcon: tab.customIcon
                ? (props: { focused: boolean; color: ColorValue; size: number }) =>
                    tab.customIcon!(props)
                : tab.icon
                ? ({ color, focused }: { color: ColorValue; focused: boolean }) => (
                    <Icon
                      as={tab.icon as LucideIcon}
                      size={focused ? 28 : 24}
                      color={color as string}
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
