import * as React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithIcon,
} from "~/components/ui/tabs";
import {
  Home,
  MessageCircleHeart,
  MessageCircleIcon,
  MessageSquareText,
  Plus,
  User,
  Wallet,
} from "lucide-react-native";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { MenuItem } from "~/components/menu/MenuItem";
import { Profile } from "~/components/profile/Profile";


export default function Application() {
    const [value, setValue] = React.useState("home");
  
    const tabs = [
      { value: "home", icon: Home, title: "Home", component: <></> },
      { value: "chat", icon: MessageSquareText, title: "Chat",component: <></> },
      { value: "balance", icon: Wallet, title: "Balance",component: <></> },
      { value: "profile", icon: User, title: "Profile",component: <Profile/> },
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
              {tab.component}
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