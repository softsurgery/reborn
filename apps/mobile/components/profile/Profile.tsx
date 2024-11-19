import React from "react";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { LogOut } from "lucide-react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeToggle } from "../ThemeToggle";
import { firebaseFns } from "~/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlanInfo } from "./Plan";
import { GoPremium } from "./GoPremium";

export const Profile = () => {
  const { handleSignOut } = useAuthFunctions();
  const navigation = useNavigation<NavigationProps>();

  const { mutate: SignOutMutator, isPending: isSignOutPending } = useMutation({
    mutationFn: async () => handleSignOut(),
    onSuccess: () => {
      navigation.navigate("index");
    },
  });

  const { data: userData, isPending: isUserDataPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const uid = await AsyncStorage.getItem("uid");
      return uid && firebaseFns.user.fetch(uid);
    },
  });

  return (
    <View className="flex flex-col pt-4 px-2">
      <Text className="text-4xl font-bold pb-1">Account</Text>
      <View className="border-t border-gray-100 dark:border-gray-900 mx-1">
        <PlanInfo className="mt-4"/>
        <GoPremium className="mt-6" />

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
         <Text className="text-2xl font-bold mt-5">App Settings</Text>
         
         <Text className="text-2xl font-bold mt-5">Support</Text>
        <Button
          variant="outline"
          onPress={() => SignOutMutator()}
          className="flex flex-row gap-2 m-10"
        >
          <IconWithTheme icon={LogOut} size={20} />
          <Text>Disconnect</Text>
        </Button>
        {/* <ThemeToggle className="mx-auto my-10 w-fit h-12 bg-red-500" /> */}
      </View>
    </View>
  );
};
