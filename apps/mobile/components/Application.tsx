import * as React from "react";
import { Platform, View, SafeAreaView } from "react-native";
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
import { IconWithTheme } from "~/lib/IconWithTheme";

export default function Application() {
  const [value, setValue] = React.useState("account");

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

  return (
    <View className="flex-1">
      <Tabs value={value} onValueChange={setValue} className="w-full flex-1">
        {/* Main Content - Only Show Active Tab */}
        {tabs.map(
          (tab) =>
            value === tab.value && (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className={cn(
                  "flex-1",
                  Platform.OS === "ios" ? "pt-20" : "pt-10"
                )}
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
              onPress={() => setValue(tab.value)}
            >
              <MenuItem
                icon={tab.icon}
                title={tab.title}
                active={value === tab.value}
                color="#0066b5"
              />
            </TabsTriggerWithIcon>
          ))}
          {/* Plus Button in the middle */}
          <Button
            variant="outline"
            className="w-20 h-20 -top-4 rounded-full aspect-square flex items-center justify-center border-4"
          >
            <IconWithTheme icon={Plus} size={32} />
          </Button>

          {/* Right Side Tabs */}
          {rightTabs.map((tab) => (
            <TabsTriggerWithIcon
              key={tab.value}
              value={tab.value}
              className="flex-1 items-center"
              onPress={() => setValue(tab.value)}
            >
              <MenuItem
                icon={tab.icon}
                title={tab.title}
                active={value === tab.value}
                color="#0066b2"
              />
            </TabsTriggerWithIcon>
          ))}
        </TabsList>
      </Tabs>
    </View>
  );
}
