import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Text } from "~/components/ui/text";
import Icon from "~/lib/Icon";
import { RequestsList } from "./RequestList";

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
    [onTabChange]
  );

  // Memoized tab button renderer
  const renderTabButton = React.useCallback(
    (tabKey: TabType, label: string, icon: LucideIcon) => (
      <StablePressable
        key={tabKey}
        onPress={() => handleTabChange(tabKey)}
        className={cn(
          "h-12 flex-1 flex items-center justify-center",
          tab === tabKey ? "border-b-2 border-b-primary" : ""
        )}
      >
        <View className="flex flex-row items-center gap-2">
          <Text
            className={cn(
              "font-medium",
              tab === tabKey ? "text-primary" : "text-muted-foreground"
            )}
          >
            {label}
          </Text>
          <Icon
            name={icon}
            size={20}
            className={cn(
              "font-medium",
              tab === tabKey ? "text-primary" : "text-muted-foreground"
            )}
          />
        </View>
      </StablePressable>
    ),
    [tab, handleTabChange]
  );
  return (
    <View className={cn("flex flex-1", className)}>
      <View className="flex flex-row border-b border-border">
        {renderTabButton("incoming", "Incoming", ArrowDown)}
        {renderTabButton("outgoing", "Outgoing", ArrowUp)}
      </View>
      <View className="flex-1 p-4">
        <RequestsList
          search=""
          searching={false}
          variant={tab as "incoming" | "ongoing"}
        />
      </View>
    </View>
  );
};
