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
import { HomePage } from "./Home/HomePage";
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
    { value: "home", icon: Home, title: "Home", component: <HomePage /> },
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
          {/* Left Tabs */}
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

          {/* Right Tabs */}
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

      {/* <Modal
        isVisible={isDrawerVisible}
        onBackdropPress={() => setIsDrawerVisible(false)}
        style={{ justifyContent: "flex-end", margin: 0 }}
        swipeDirection="down"
        onSwipeComplete={() => setIsDrawerVisible(false)}
        useNativeDriverForBackdrop
        useNativeDriver
      >
        <View className="bg-background p-6 rounded-t-2xl border border-border shadow-xl h-5/6">
          <Text className="text-lg font-bold mb-4 text-foreground">
            Bottom Drawer (5/6 Screen)
          </Text>
          <Button onPress={() => setIsDrawerVisible(false)}>
            <Text className="text-white">Close</Text>
          </Button>
        </View>
      </Modal> */}
    </View>
  );
}
