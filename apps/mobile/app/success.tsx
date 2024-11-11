import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import { Button } from "~/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithIcon,
} from "~/components/ui/tabs";
import {
  Home,
  LogOut,
  MessageCircleHeart,
  Plus,
  User,
  Wallet,
} from "lucide-react-native";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { MenuItem } from "~/components/menu/MenuItem";

export default function Screen() {
  const { handleSignOut } = useAuthFunctions();
  const [value, setValue] = React.useState("home");

  const tabs = [
    { value: "home", icon: Home, title: "Home" },
    { value: "chat", icon: MessageCircleHeart, title: "Chat" },
    { value: "balance", icon: Wallet, title: "Balance" },
    { value: "profile", icon: User, title: "Profile" },
  ];

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  return (
    <View className="flex-1 w-full py-5">
      <Tabs
        value={value}
        onValueChange={setValue}
        className="flex-1 w-full flex-col justify-between gap-1.5"
      >
        <View className="flex-grow">
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <Text className="p-10">{tab.title}</Text>
              {tab.value === "profile" && (
                <Button
                  variant="outline"
                  onPress={handleSignOut}
                  className="flex flex-row gap-2 mx-10"
                >
                  <IconWithTheme icon={LogOut} size={20} />
                  <Text>Disconnect</Text>
                </Button>
              )}
            </TabsContent>
          ))}
        </View>

        <TabsList className="flex-row w-full items-center justify-between">
          {/* Left side tabs */}
          {leftTabs.map((tab) => (
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
