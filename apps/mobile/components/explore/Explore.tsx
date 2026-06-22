import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useDebounce } from "~/hooks/useDebounce";
import { ExploreCommon } from "./ExploreCommon";
import { ExploreFollowing } from "./ExploreFollowing";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { ArrowDownNarrowWide, Bell, Search } from "lucide-react-native";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useScrollableElement } from "~/hooks/useScrollableElement";
import { useColorPalette } from "@/hooks/useColorPalette";

interface ExploreProps {
  className?: string;
}

export const Explore = ({ className }: ExploreProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("common");
  const [search] = React.useState("");

  const { newCount, resetCount } = useNotificationContext();

  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(search, 1000);

  const { animatedHeaderStyle, handleScroll } = useScrollableElement({
    duration: 250,
    deltaThreshold: 40,
  });

  const Tab = createMaterialTopTabNavigator();

  return (
    <StableSafeAreaView className={cn("flex flex-1 flex-col mx-2", className)}>
      {/* Animated Header */}
      <Animated.View style={animatedHeaderStyle}>
        <ApplicationHeader
          title={t("screens.explore")}
          shortcuts={[
            {
              key: "search",
              icon: Search,
              onPress: () => router.push("/main/explore/job-search"),
            },
            {
              key: "filters",
              icon: ArrowDownNarrowWide,
              onPress: () => router.push("/main/explore/job-filters"),
            },
            {
              key: "notifications",
              icon: Bell,
              onPress: () => {
                router.push("/main/notifications");
                resetCount();
              },
              badgeText: newCount > 0 ? `${newCount}` : undefined,
            },
          ]}
        />
      </Animated.View>
      {/* Search Header */}
      {/* Content */}
      <View
        className="flex flex-row flex-1 border-b border-border"
        style={{ minHeight: 500 }}
      >
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarIndicatorStyle: {
              backgroundColor: palette.primary,
            },
            tabBarStyle: { backgroundColor: "transparent" },
          }}
        >
          <Tab.Screen name="Recent" options={{ tabBarLabel: "Recent" }}>
            {() => (
              <ExploreCommon
                className="p-2"
                search={debouncedSearchTerm}
                searching={searching}
                handleScroll={handleScroll}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Followings" options={{ tabBarLabel: "Followings" }}>
            {() => (
              <ExploreFollowing
                className="p-2"
                search={debouncedSearchTerm}
                searching={searching}
                handleScroll={handleScroll}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </StableSafeAreaView>
  );
};
