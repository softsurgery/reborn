import * as React from "react";
import { Platform, View } from "react-native";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithIcon,
} from "~/components/ui/tabs";
import {
  Home,
  MessageSquareText,
  Plus,
  User,
  Wallet,
} from "lucide-react-native";
import { MenuItem } from "~/components/menu/MenuItem";
import { Account } from "./account/Account";
import { Chat } from "./chat/Chat";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import Icon from "~/lib/Icon";
import { useNavigation } from "expo-router";

export default function Application() {
  const navigation = useNavigation<any>();
  const [title, setTitle] = React.useState("account");

  React.useEffect(() => {
    navigation.setOptions({
      title: tabs.filter((tab) => tab.value === title)[0].title,
    });
    return () => {
      navigation.setOptions({
        headerShown: false,
      });
       navigation.reset({
        routes: [{ name: "index" }],
      });
    };
  }, []);

  const tabs = [
    { value: "home", icon: Home, title: "Home", component: <></> },
    {
      value: "chat",
      icon: MessageSquareText,
      title: "Chat",
      component: <Chat />,
    },
    { value: "balance", icon: Wallet, title: "Balance", component: <></> },
    { value: "account", icon: User, title: "Account", component: <Account /> },
  ];

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  const onValueChange = (value: string) => {
    setTitle(value);
    navigation.setOptions({
      title: tabs.filter((tab) => tab.value === value)[0].title,
    });
  };

  return (
    <View className="flex-1">
      <Tabs
        value={title}
        onValueChange={onValueChange}
        className="w-full flex-1"
      >
        {/* Main Content - Only Show Active Tab */}
        {tabs.map(
          (tab) =>
            title === tab.value && (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className={cn("flex-1")}
              >
                {tab.component}
              </TabsContent>
            )
        )}

        {/* Bottom Navigation */}
        <TabsList
          className="flex flex-row items-center justify-between w-full"
          style={{
            height: Platform.OS === "ios" ? 80 : 70,
            paddingBlock: Platform.OS === "ios" ? 10 : 0,
          }}
        >
          {/* Left Side Tabs */}
          {leftTabs.map((tab) => (
            <TabsTriggerWithIcon
              key={tab.value}
              value={tab.value}
              className="flex-1 items-center"
              onPress={() => setTitle(tab.value)}
            >
              <MenuItem
                icon={tab.icon}
                title={tab.title}
                active={title === tab.value}
              />
            </TabsTriggerWithIcon>
          ))}
          {/* Plus Button in the middle */}
          <Button
            variant="default"
            className="w-20 h-20 -top-4 rounded-full aspect-square flex items-center justify-center border border-border"
          >
            <Icon name={Plus} size={32} className="text-white" />
          </Button>

          {/* Right Side Tabs */}
          {rightTabs.map((tab) => (
            <TabsTriggerWithIcon
              key={tab.value}
              value={tab.value}
              className="flex-1 items-center"
              onPress={() => setTitle(tab.value)}
            >
              <MenuItem
                icon={tab.icon}
                title={tab.title}
                active={title === tab.value}
              />
            </TabsTriggerWithIcon>
          ))}
        </TabsList>
      </Tabs>
    </View>
  );
}
