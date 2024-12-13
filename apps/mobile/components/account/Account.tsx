import React from "react";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import { Text } from "../ui/text";
import { IconWithTheme } from "~/lib/IconWithTheme";
import {
  Bell,
  Bug,
  ChevronRight,
  LogOut,
  MailCheck,
  Settings,
  User2,
} from "lucide-react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { NavigationProps, StackParamList } from "~/types/app.routes";
import { Pressable, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { firebaseFns } from "~/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlanInfo } from "./Plan";
import { GoPremium } from "./GoPremium";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export const Account = () => {
  const { handleSignOut } = useAuthFunctions();
  const navigation = useNavigation<NavigationProps>();

  const { data: userData, isPending: isUserDataPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const uid = await AsyncStorage.getItem("uid");
      return uid && firebaseFns.user.fetch(uid);
    },
  });

  return (
    <View className="flex flex-col px-4">
      <Text className="text-4xl font-bold pb-1">Account</Text>
      <View className="border-t border-gray-100 dark:border-gray-900 mx-1">
        <PlanInfo className="my-2" />
        <GoPremium className="my-3" />

        {/* <Avatar
          alt="Zach Nugent's Avatar"
          className="w-52 h-52 mx-auto border-2"
        >
           <AvatarImage source={require("~/assets/images/adaptive-icon.png")} />
          <AvatarFallback>
            <Text>ZN</Text>
          </AvatarFallback>
        </Avatar>

        <Text className="mx-auto my-5 text-xl">Nayssem's Profile</Text> */}
        <View className="flex flex-col gap-4 mt-5">
          {/* App Settings */}
          <View>
            <Text className="text-2xl font-bold mb-2">App Settings</Text>
            <View className="flex flex-col">
              <Item title="Profile Management" icon={User2} />
              <Separator />
              <Item title="User Preferences" icon={Settings} link={"settings/app-settings/user-preferences"} />
              <Separator />
              <Item title="Notifications" icon={Bell} />
            </View>
          </View>
          {/* Support */}
          <View>
            <Text className="text-2xl font-bold mb-2">Support</Text>
            <View className="flex flex-col">
              <Item title="Report a Bug" icon={Bug} link={"settings/support/report-bug"} />
              <Separator />
              <Item title="Send us Feedback" icon={MailCheck} link={"settings/support/send-feedback"} />
            </View>
          </View>

          <View>
            <Text className="text-2xl font-bold mb-2">Account Actions</Text>
            <View className="flex flex-col">
              <Item title="Switch Account" icon={LogOut} onPress={handleSignOut} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

interface ItemProps {
  className?: string;
  title?: string;
  icon?: React.ElementType;
  link?: keyof StackParamList;
  onPress?: () => void;
}

const Item = ({ className, title, icon, link, onPress }: ItemProps) => {
  const [pressed, setPressed] = React.useState(false);
  const navigation = useNavigation<NavigationProps>();

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={cn(
        "rounded-lg",
        pressed && "bg-slate-100 dark:bg-gray-900",
        className
      )}
      onPress={link ? () => { navigation.push(link) } : onPress}
    >
      <View className="flex flex-row justify-between py-4 border-gray-100 dark:border-gray-900 px-2">
        <View className="flex flex-row items-center gap-4">
          <IconWithTheme icon={icon as React.ElementType} size={28} />
          <Text className="text-xl">{title}</Text>
        </View>
        <IconWithTheme icon={ChevronRight} size={24} />
      </View>
    </Pressable>
  );
};
