import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useDebounce } from "~/hooks/useDebounce";
import { ExploreCommon } from "./ExploreCommon";
import { Text } from "../ui/text";
import { ExploreFollowing } from "./ExploreFollowing";
import { cn } from "~/lib/utils";
import { StablePressable } from "../shared/StablePressable";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { ArrowDownNarrowWide, Bell, Search, User } from "lucide-react-native";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { JobFilters } from "./jobs/JobFilters";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useColorScheme } from "nativewind";
import { THEME } from "~/lib/theme";

interface ExploreProps {
  className: string;
}

export const Explore = ({ className }: ExploreProps) => {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation("common");
  const [search, setSearch] = React.useState("");
  const [openJobFilters, setOpenJobFilters] = React.useState(false);

  const { newCount, resetCount } = useNotificationContext();

  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(search, 1000);

  // Use shared values for better performance
  const showHeader = useSharedValue(true);

  // Memoized header visibility handler
  const handleHeaderVisibility = React.useCallback(
    (visible: boolean) => {
      showHeader.value = visible;
    },
    [showHeader],
  );

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(showHeader.value ? 0 : -40, {
          duration: 250,
        }),
      },
    ],
    opacity: withTiming(showHeader.value ? 1 : 0, { duration: 250 }),
    height: withTiming(showHeader.value ? 40 : 0, {
      duration: 250,
    }),
  }));

  const Tab = createMaterialTopTabNavigator();

  return (
    <StableSafeAreaView className={cn("flex flex-1 flex-col mx-2", className)}>
      {/* Animated Header */}
      <Animated.View style={animatedHeaderStyle}>
        <ApplicationHeader
          title={t("screens.explore")}
          shortcuts={[
            {
              icon: Search,
              onPress: () => router.push("/main/explore/job-search"),
            },
            {
              icon: ArrowDownNarrowWide,
              onPress: () => {
                setOpenJobFilters(true);
              },
            },
            {
              icon: User,
              onPress: () => router.push("/main/my-space"),
            },
            {
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
              backgroundColor:
                colorScheme === "dark"
                  ? THEME.dark.primary
                  : THEME.light.primary,
            },
            tabBarStyle: { backgroundColor: "transparent" },
          }}
        >
          <Tab.Screen
            name="Recent"
            options={{
              tabBarLabel: "Recent",
            }}
            component={() => (
              <ExploreCommon
                className="p-2"
                search={debouncedSearchTerm}
                searching={searching}
                setShowHeader={handleHeaderVisibility}
              />
            )}
          />

          <Tab.Screen
            name="Followings"
            options={{
              tabBarLabel: "Followings",
            }}
            component={() => (
              <ExploreFollowing
                className="p-2"
                search={debouncedSearchTerm}
                searching={searching}
                setShowHeader={handleHeaderVisibility}
              />
            )}
          />
        </Tab.Navigator>
      </View>
      <JobFilters
        className="min-h-[70vh] min-w-[90vw]"
        open={openJobFilters}
        onOpenChange={setOpenJobFilters}
      />
    </StableSafeAreaView>
  );
};
