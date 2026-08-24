import React from "react";
import { View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { RequestsList } from "./RequestList";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { router } from "expo-router";
import { ApplicationHeader } from "@/components/shared/AppHeader";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useColorPalette } from "@/hooks/useColorPalette";

type TabType = "incoming" | "outgoing";

interface RequestsProps {
  className?: string;
  initialTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}
const Tab = createMaterialTopTabNavigator();

export const Requests = ({
  className,
  initialTab = "incoming",
  onTabChange,
}: RequestsProps) => {
  const { palette } = useColorPalette();

  return (
    <StableSafeAreaView className={cn("flex-1 bg-background", className)}>
      <ApplicationHeader
        classNames={{
          wrapper: "border-b border-border/50 pb-2.5 bg-background",
        }}
        title="Job Requests"
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ChevronLeft,
            onPress: () => router.back(),
          },
        ]}
      />

      <View className="flex-1 bg-background px-3">
        <Tab.Navigator
          initialRouteName={initialTab}
          screenOptions={{
            tabBarScrollEnabled: false,
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: "700",
              textTransform: "none",
              letterSpacing: -0.1,
            },
            tabBarActiveTintColor: palette?.primary,
            tabBarInactiveTintColor: palette?.mutedForeground,
            tabBarIndicatorStyle: {
              backgroundColor: palette?.primary,
              height: 3,
              borderRadius: 3,
            },
            tabBarStyle: {
              backgroundColor: "transparent",
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: palette?.border
                ? `${palette.border}40`
                : "rgba(0,0,0,0.05)",
            },
          }}
          commonOptions={{
            sceneStyle: {
              backgroundColor: "transparent",
              flex: 1,
            },
          }}
        >
          <Tab.Screen
            name="incoming"
            options={{
              tabBarLabel: "Incoming Candidates",
            }}
            listeners={{
              tabPress: () => onTabChange?.("incoming"),
            }}
          >
            {() => <RequestsList variant="incoming" />}
          </Tab.Screen>

          <Tab.Screen
            name="outgoing"
            options={{
              tabBarLabel: "Sent Applications",
            }}
            listeners={{
              tabPress: () => onTabChange?.("outgoing"),
            }}
          >
          {() => <RequestsList variant="outgoing" />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </StableSafeAreaView>
  );
};
