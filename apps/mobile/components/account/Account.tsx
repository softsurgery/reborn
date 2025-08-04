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
import { NavigationProps } from "~/types/app.routes";
import { View } from "react-native";
import { firebaseFns } from "~/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlanInfo } from "./Plan";
import { GoPremium } from "./GoPremium";
import { Separator } from "../ui/separator";
import { StableScrollView } from "../shared/StableScrollView";
import { MenuItem } from "./MenuItem";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import { useNavigation } from "~/hooks/useNavigation";

export const Account = () => {
  const navigation = useNavigation();
  const authPersistStore = useAuthPersistStore();

  const { data: userData, isPending: isUserDataPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const uid = await AsyncStorage.getItem("uid");
      return uid && firebaseFns.user.fetch(uid);
    },
  });

  const signout = async () => {
    authPersistStore.logout();
    navigation.navigate("index", { reset: true });
  };

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
            link={"account/managment"}
          />
          <Separator />
          <MenuItem
            title="User Preferences"
            icon={Settings}
            link={"account/preferences"}
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
              link={"account/support/report-bug"}
            />
            <Separator />
            <MenuItem
              title="Send us Feedback"
              icon={MailCheck}
              link={"account/support/send-feedback"}
            />
            <Separator />
            <MenuItem
              title="FAQs"
              icon={HelpCircle}
              link={"account/support/faqs"}
            />
          </View>
        </View>

        <View>
          <Text className="text-2xl font-bold mb-2">Account Actions</Text>
          <View className="flex flex-col">
            <MenuItem title="Switch Account" icon={LogOut} onPress={signout} />
          </View>
        </View>
      </View>
    </StableScrollView>
  );
};
