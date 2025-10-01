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

export default function Application() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = React.useState("explore");
  const [tabKey, setTabKey] = React.useState(0);

  const tabs = React.useMemo(
    () => [
      {
        value: "explore",
        icon: Telescope,
        title: "Explore",
        component: <Explore />,
      },
      {
        value: "messages",
        icon: MessageCircle,
        title: "Messages",
        component: <Chat />,
      },
      {
        value: "balance",
        icon: Wallet,
        title: "Balance",
        component: <Balance />,
      },
      {
        value: "menu",
        icon: Menu,
        title: "Menu",
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
    <View className="flex flex-col flex-1 justify-between">
      <View className="flex-1">
        {tabs.find((tab) => tab.value === activeTab)?.component && (
          <View key={tabKey} className="flex-1">
            {tabs.find((tab) => tab.value === activeTab)?.component}
          </View>
        )}
      </View>

      <View className="flex flex-row items-center justify-between mb-2">
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
          className="w-20 h-20 -top-4 rounded-full aspect-square flex items-center justify-center border border-border shadow-lg"
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
