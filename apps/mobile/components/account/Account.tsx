import React from "react";
import { Text } from "../ui/text";
import {
  Bell,
  Bug,
  HelpCircle,
  LogOut,
  MailCheck,
  Settings,
  User2,
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { View } from "react-native";
import { firebaseFns } from "~/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlanInfo } from "./Plan";
import { GoPremium } from "./GoPremium";
import { Separator } from "../ui/separator";
import { useAuth } from "~/context/AuthContext";
import { StableScrollView } from "../shared/StableScrollView";
import { MenuItem } from "./MenuItem";

export const Account = () => {
  const { disconnect } = useAuth();
  const navigation = useNavigation<NavigationProps>();

  const { data: userData, isPending: isUserDataPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const uid = await AsyncStorage.getItem("uid");
      return uid && firebaseFns.user.fetch(uid);
    },
  });

  return (
    <StableScrollView className="flex-1 px-5">
      <PlanInfo className="my-2" />
      <GoPremium className="my-3" />

      <View className="flex flex-col gap-4 mt-5">
        {/* App Settings */}
        <Text className="text-2xl font-bold mb-2">App Settings</Text>
        <View className="flex flex-col">
          <MenuItem
            title="Profile Management"
            icon={User2}
            link={"settings/app-settings/profile-managment"}
          />
          <Separator />
          <MenuItem
            title="User Preferences"
            icon={Settings}
            link={"settings/app-settings/user-preferences"}
          />
          <Separator />
          <MenuItem title="Notifications" icon={Bell} />
        </View>
        {/* Support */}
        <View>
          <Text className="text-2xl font-bold mb-2">Support</Text>
          <View className="flex flex-col">
            <MenuItem
              title="Report a Bug"
              icon={Bug}
              link={"settings/support/report-bug"}
            />
            <Separator />
            <MenuItem
              title="Send us Feedback"
              icon={MailCheck}
              link={"settings/support/send-feedback"}
            />
            <Separator />
            <MenuItem
              title="FAQs"
              icon={HelpCircle}
              link={"settings/support/faqs"}
            />
          </View>
        </View>

        <View>
          <Text className="text-2xl font-bold mb-2">Account Actions</Text>
          <View className="flex flex-col">
            <MenuItem
              title="Switch Account"
              icon={LogOut}
              onPress={disconnect}
            />
          </View>
        </View>
      </View>
    </StableScrollView>
  );
};
