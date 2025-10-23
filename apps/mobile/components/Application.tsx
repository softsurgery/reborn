import React from "react";
import { View, Pressable } from "react-native";
import {
  Menu,
  MessageCircle,
  Plus,
  Telescope,
  Wallet,
} from "lucide-react-native";
import { MenuItem } from "~/components/menu/MenuItem";
import { Account } from "./account/Account";
import { Chat } from "./chat/Chat";
import { Button } from "./ui/button";
import Icon from "~/lib/Icon";
import { useNavigation } from "expo-router";
import * as Haptics from "expo-haptics";
import { Balance } from "./balance/Balance";
import { Explore } from "./explore/Explore";
import { cn } from "~/lib/utils";

interface ApplicationProps {
  className?: string;
  defaultTab?: "explore" | "messages" | "balance" | "menu";
}

export default function Application({
  className,
  defaultTab,
}: ApplicationProps) {
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = React.useState(
    (defaultTab as string) ?? "explore"
  );
  const [tabKey, setTabKey] = React.useState(0);

  const tabs = React.useMemo(
    () => [
      {
        value: "explore",
        icon: Telescope,
        title: "explore",
        component: <Explore />,
      },
      {
        value: "chat",
        icon: MessageCircle,
        title: "chat",
        component: <Chat />,
      },
      {
        value: "balance",
        icon: Wallet,
        title: "balance",
        component: <Balance />,
      },
      {
        value: "menu",
        icon: Menu,
        title: "menu",
        component: <Account />,
      },
    ],
    []
  );

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  const handleTabPress = (value: string) => {
    if (activeTab === value) {
      // Reload the tab by updating the key
      setTabKey((prev) => prev + 1);
    } else {
      setActiveTab(value);
    }
    navigation.setOptions({
      title: tabs.find((tab) => tab.value === value)?.title,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View className={cn("flex flex-col flex-1 justify-between", className)}>
      <View className="flex-1">
        {tabs.find((tab) => tab.value === activeTab)?.component && (
          <View key={tabKey} className="flex-1">
            {tabs.find((tab) => tab.value === activeTab)?.component}
          </View>
        )}
      </View>
      <View className="flex flex-row items-center justify-between mb-2 bg-card border-2 border-primary/20">
        {leftTabs.map((tab) => (
          <Pressable
            key={tab.value}
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => handleTabPress(tab.value)}
          >
            <MenuItem
              icon={tab.icon}
              title={tab.title}
              active={activeTab === tab.value}
            />
          </Pressable>
        ))}

        <Button
          variant="default"
          className="w-16 h-16 -top-4 rounded-full aspect-square flex items-center justify-center shadow-lg"
          onPress={() => navigation.push("explore/new-job")}
        >
          <Icon name={Plus} size={32} className="text-white" />
        </Button>

        {rightTabs.map((tab) => (
          <Pressable
            key={tab.value}
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => handleTabPress(tab.value)}
          >
            <MenuItem
              icon={tab.icon}
              title={tab.title}
              active={activeTab === tab.value}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
