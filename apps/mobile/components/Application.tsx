import * as React from "react";
import { Platform, View, Pressable } from "react-native";
import {
  Home as HomeIcon,
  MessageSquareText,
  Plus,
  User,
  Wallet,
} from "lucide-react-native";
import { MenuItem } from "~/components/menu/MenuItem";
import { Account } from "./account/Account";
import { Chat } from "./chat/Chat";
import { Home } from "./home/Home";
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

export default function Application() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = React.useState("account");

  React.useEffect(() => {
    navigation.setOptions({
      title: tabs.find((tab) => tab.value === activeTab)?.title,
    });
  }, [activeTab]);

  const tabs = React.useMemo(
    () => [
      { value: "home", icon: HomeIcon, title: "Home", component: <Home /> },
      {
        value: "chat",
        icon: MessageSquareText,
        title: "Chat",
        component: <Chat />,
      },
      { value: "balance", icon: Wallet, title: "Balance", component: <></> },
      {
        value: "account",
        icon: User,
        title: "Account",
        component: <Account />,
      },
    ],
    []
  );

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  const handleTabPress = (value: string) => {
    setActiveTab(value);
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
            key={tab.value}
            style={{
              display: activeTab === tab.value ? "flex" : "none",
              flex: 1,
            }}
          >
            {tab.component}
          </View>
        ))}
      </View>

      <View
        className="flex flex-row items-center justify-between w-full"
        style={{
          height: Platform.OS === "ios" ? 80 : 70,
          paddingBlock: Platform.OS === "ios" ? 10 : 0,
        }}
      >
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
            <View className="grid gap-4"></View>
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
