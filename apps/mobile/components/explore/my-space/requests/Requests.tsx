import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { ArrowDown, ArrowLeft, ArrowUp, LucideIcon } from "lucide-react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import { RequestsList } from "./RequestList";
import { Icon } from "~/components/ui/icon";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { router } from "expo-router";
import { ApplicationHeader } from "~/components/shared/AppHeader";

type TabType = "incoming" | "outgoing";

interface RequestsProps {
  className?: string;
  initialTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const Requests = ({
  className,
  initialTab = "incoming",
  onTabChange,
}: RequestsProps) => {
  const [tab, setTab] = React.useState<TabType>(initialTab);
  const [search, setSearch] = React.useState("");

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
    <StableSafeAreaView className={cn("flex-1", className)}>
      <ApplicationHeader
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
      <View className="flex flex-row border-b border-border">
        {renderTabButton("incoming", "Incoming", ArrowDown)}
        {renderTabButton("outgoing", "Outgoing", ArrowUp)}
      </View>
      <View className="flex-1 mx-4">
        <RequestsList
          search=""
          searching={false}
          variant={tab as "incoming" | "outgoing"}
        />
      </View>
    </StableSafeAreaView>
  );
};
