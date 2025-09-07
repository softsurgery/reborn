import * as React from "react";
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
import { Connect } from "./connect/Connect";
import { Button } from "./ui/button";
import Icon from "~/lib/Icon";
import { useNavigation } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Text } from "./ui/text";
import { Balance } from "./balance/Balance";
import { Explore } from "./explore/Explore";
import { JobCreateForm } from "./explore/jobs/JobCreateForm";

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
        component: <Connect />,
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
    <View className="flex-1">
      <View className="flex-1">
        {tabs.map((tab) => (
          <View
            key={tab.value + (tab.value === activeTab ? `-${tabKey}` : "")}
            style={{
              display: activeTab === tab.value ? "flex" : "none",
              flex: 1,
            }}
          >
            {tab.component}
          </View>
        ))}
      </View>

      <View className="flex flex-row items-center justify-between w-full pb-4">
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

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="w-20 h-20 -top-4 rounded-full aspect-square flex items-center justify-center border border-border shadow-lg"
            >
              <Icon name={Plus} size={32} className="text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent className="h-[85vh] w-[95vw] rounded-lg">
            <DialogHeader>
              <DialogTitle>New Job</DialogTitle>
              <DialogDescription>
                <Text>Add a new job</Text>
              </DialogDescription>
            </DialogHeader>
            <JobCreateForm />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  <Text>Cancel</Text>
                </Button>
              </DialogClose>
              <Button>
                <Text>Save changes</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
