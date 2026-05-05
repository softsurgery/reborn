import React from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useColorScheme } from "nativewind";
import { ArrowLeft } from "lucide-react-native";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { THEME } from "~/lib/theme";
import { cn } from "~/lib/utils";
import { FollowingTab } from "./FollowingTab";
import { FollowersTab } from "./FollowersTab";

const Tab = createMaterialTopTabNavigator();

interface SocialPortalProps {
  className?: string;
  profileId?: string;
}

export const SocialPortal = ({ className, profileId }: SocialPortalProps) => {
  const { colorScheme } = useColorScheme();
  const { id, tab } = useLocalSearchParams();

  const initialTab =
    tab === "followers" || tab === "following" ? tab : "following";

  const indicatorColor =
    colorScheme === "dark" ? THEME.dark.primary : THEME.light.primary;

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        className="border-b border-border pb-2"
        title="Connections"
        titleVariant="large"
        reverse
        shortcuts={[{ icon: ArrowLeft, onPress: () => router.back() }]}
      />

      <View className="flex-1 bg-background" style={{ minHeight: 500 }}>
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
              backgroundColor: indicatorColor,
            },
            tabBarStyle: { backgroundColor: "transparent" },
          }}
        >
          <Tab.Screen
            name="following"
            options={{
              tabBarLabel: "Following",
            }}
          >
            {() => <FollowingTab profileId={id as string} />}
          </Tab.Screen>

          <Tab.Screen
            name="followers"
            options={{
              tabBarLabel: "Followers",
            }}
          >
            {() => <FollowersTab profileId={id as string} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </StableSafeAreaView>
  );
};
