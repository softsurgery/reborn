import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { ChevronLeft } from "lucide-react-native";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { cn } from "~/lib/utils";
import { FollowingTab } from "./FollowingTab";
import { FollowersTab } from "./FollowersTab";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useTranslation } from "react-i18next";

const Tab = createMaterialTopTabNavigator();

interface SocialPortalProps {
  className?: string;
}

export const SocialPortal = ({ className }: SocialPortalProps) => {
  const { t } = useTranslation("menu");
  const { palette } = useColorPalette();
  const { id, tab } = useLocalSearchParams();

  const initialTab =
    tab === "followers" || tab === "following" ? tab : "following";

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        title={t("menu.social.title")}
        titleVariant="large"
        reverse
        shortcuts={[
          { key: "back", icon: ChevronLeft, onPress: () => router.back() },
        ]}
      />

      <View className="flex-1 bg-background">
        <Tab.Navigator
          initialRouteName={initialTab}
          screenOptions={{
            tabBarScrollEnabled: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarIndicatorStyle: {
              backgroundColor: palette?.primary,
            },
            tabBarStyle: { backgroundColor: "transparent" },
          }}
        >
          <Tab.Screen
            name="following"
            options={{
              tabBarLabel: t("menu.social.following"),
            }}
          >
            {() => <FollowingTab profileId={id as string} />}
          </Tab.Screen>

          <Tab.Screen
            name="followers"
            options={{
              tabBarLabel: t("menu.social.followers"),
            }}
          >
            {() => <FollowersTab profileId={id as string} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </StableSafeAreaView>
  );
};
