import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { ArrowLeft, LucideIcon } from "lucide-react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { RequestsList } from "./RequestList";
import { Icon } from "~/components/ui/icon";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { router } from "expo-router";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

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
  const [tab, setTab] = React.useState<TabType>(initialTab);

  // Memoized tab change handler
  const handleTabChange = React.useCallback(
    (newTab: TabType) => {
      setTab(newTab);
      onTabChange?.(newTab);
    },
    [onTabChange],
  );

  // Memoized tab button renderer
  const renderTabButton = React.useCallback(
    (tabKey: TabType, label: string, icon: LucideIcon) => (
      <StablePressable
        key={tabKey}
        onPress={() => handleTabChange(tabKey)}
        className={cn(
          "h-12 flex-1 flex items-center justify-center",
          tab === tabKey ? "border-b-2 border-b-primary" : "",
        )}
      >
        <View className="flex flex-row items-center gap-2">
          <Text
            className={cn(
              "font-medium",
              tab === tabKey ? "text-primary" : "text-muted-foreground",
            )}
          >
            {label}
          </Text>
          <Icon
            as={icon}
            size={20}
            className={cn(
              "font-medium",
              tab === tabKey ? "text-primary" : "text-muted-foreground",
            )}
          />
        </View>
      </StablePressable>
    ),
    [tab, handleTabChange],
  );
  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        className="border-b border-border pb-2"
        title={"Requests"}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            icon: ArrowLeft,
            onPress: () => router.back(),
          },
        ]}
      />
      <View className="flex flex-1" style={{ minHeight: 400 }}>
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: false,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarIndicatorStyle: { backgroundColor: "#9B2C2C" },
            tabBarStyle: { backgroundColor: "transparent" },
          }}
          commonOptions={{
            sceneStyle: {
              flex: 1,
            },
          }}
        >
          <Tab.Screen
            name="incoming"
            options={{
              tabBarLabel: "Incoming",
            }}
            component={() => (
              <RequestsList search="" searching={false} variant={"incoming"} />
            )}
          />
          <Tab.Screen
            name="outgoing"
            options={{
              tabBarLabel: "Outgoing",
            }}
            component={() => (
              <RequestsList search="" searching={false} variant={"outgoing"} />
            )}
          />
        </Tab.Navigator>
      </View>
    </StableSafeAreaView>
  );
};
