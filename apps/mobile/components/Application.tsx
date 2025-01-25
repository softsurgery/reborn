import * as React from "react";
import { Platform, ScrollView, View } from "react-native";
import { Button } from "~/components/ui/button";
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
import { IconWithTheme } from "~/lib/IconWithTheme";
import { MenuItem } from "~/components/menu/MenuItem";
import { Account } from "./account/Account";
import { StableScrollView } from "./common/StableScrollView";
import { Chat } from "./chat/Chat";

export default function Application() {
  const [value, setValue] = React.useState("account");

  const tabs = [
    {
      value: "home",
      icon: Home,
      title: "Home",
      component: <></>,
      screenShouldScroll: true,
    },
    {
      value: "chat",
      icon: MessageSquareText,
      title: "Chat",
      component: <Chat />,
      screenShouldScroll: false,
    },
    {
      value: "balance",
      icon: Wallet,
      title: "Balance",
      component: <></>,
      screenShouldScroll: true,
    },
    {
      value: "account",
      icon: User,
      title: "Account",
      component: <Account />,
      screenShouldScroll: true,
    },
  ];

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  return (
    <View className="flex-1 w-full">
      <Tabs
        value={value}
        onValueChange={setValue}
        className="flex-1 w-full flex-col justify-between gap-1.5"
      >
        <View className="pt-10">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.screenShouldScroll ? (
                <StableScrollView className="mt-5 mb-24">
                  {tab.component}
                </StableScrollView>
              ) : (
                <View className="mt-5 -mb-24">{tab.component}</View>
              )}
            </TabsContent>
          ))}
        </View>

        <TabsList
          className="flex flex-row justify-center absolute bottom-0 w-full"
          style={{
            height: Platform.OS == "ios" ? 80 : 70,
            paddingBottom: Platform.OS == "ios" ? 15 : 0,
          }}
        >
          {/* Left side tabs */}
          {leftTabs.map((tab) => (
            <TabsTriggerWithIcon
              key={tab.value}
              value={tab.value}
              className="w-auto mx-auto"
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

          {/* Right side tabs */}
          {rightTabs.map((tab) => (
            <TabsTriggerWithIcon
              key={tab.value}
              value={tab.value}
              className="w-1/5"
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
