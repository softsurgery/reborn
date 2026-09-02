import React from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useDebounce } from "~/hooks/useDebounce";
import { ExploreCommon } from "./ExploreCommon";
import { ExploreFollowing } from "./ExploreFollowing";
import { cn } from "~/lib/utils";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { ArrowDownNarrowWide, Bell, Search } from "lucide-react-native";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { useScrollableElement } from "~/hooks/useScrollableElement";
import { useColorPalette } from "@/hooks/useColorPalette";
import { hslToHex } from "@/lib/theme";
import { ResponseJobDto } from "~/types";
import { JobPreviewModal } from "../jobs/JobPreviewModal";

interface ExploreProps {
  className?: string;
}

// Built once — recreating the navigator on every render remounts both tabs.
const Tab = createMaterialTopTabNavigator();

export const Explore = ({ className }: ExploreProps) => {
  const { palette } = useColorPalette();
  const { t } = useTranslation("common");
  const [search] = React.useState("");
  const [previewJob, setPreviewJob] = React.useState<ResponseJobDto | null>(
    null,
  );

  const isPreviewing = !!previewJob;

  const animatedExploreBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isPreviewing ? 0.35 : 1, {
        duration: 250,
      }),
    };
  }, [isPreviewing]);

  const { count } = useNotificationContext();

  const { value: debouncedSearchTerm, loading: searching } =
    useDebounce<string>(search, 1000);

  const { animatedHeaderStyle, contentAnimatedStyle, handleScroll } =
    useScrollableElement({
      duration: 250,
      deltaThreshold: 40,
      checkScrollable: true,
    });

  return (
    <StableSafeAreaView className={cn("flex flex-1 flex-col", className)}>
      <Animated.View
        pointerEvents={isPreviewing ? "none" : "auto"}
        style={[animatedHeaderStyle, animatedExploreBlurStyle]}
      >
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
              },
              badgeText: count > 0 ? `${count}` : undefined,
            },
          ]}
        />
      </Animated.View>

      <Animated.View
        pointerEvents={isPreviewing ? "none" : "auto"}
        className="flex-1"
        style={[contentAnimatedStyle, animatedExploreBlurStyle]}
      >
        <Tab.Navigator
          screenOptions={{
            swipeEnabled: !isPreviewing,
            tabBarScrollEnabled: false,
            tabBarActiveTintColor: palette.foreground,
            tabBarInactiveTintColor: palette.mutedForeground,
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarIndicatorStyle: {
              backgroundColor: hslToHex(palette.primary),
              height: 2,
              borderRadius: 2,
            },
            tabBarStyle: {
              backgroundColor: "transparent",
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: palette.border,
            },
          }}
        >
          <Tab.Screen name="Recent" options={{ tabBarLabel: "Recent" }}>
            {() => (
              <ExploreCommon
                className="px-3"
                search={debouncedSearchTerm}
                searching={searching}
                handleScroll={handleScroll}
                onPreviewJobChange={setPreviewJob}
                isPreviewing={isPreviewing}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Following" options={{ tabBarLabel: "Following" }}>
            {() => (
              <ExploreFollowing
                className="px-3"
                search={debouncedSearchTerm}
                searching={searching}
                handleScroll={handleScroll}
                onPreviewJobChange={setPreviewJob}
                isPreviewing={isPreviewing}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </Animated.View>

      <JobPreviewModal
        visible={!!previewJob}
        job={previewJob}
        onClose={() => setPreviewJob(null)}
      />
    </StableSafeAreaView>
  );
};
