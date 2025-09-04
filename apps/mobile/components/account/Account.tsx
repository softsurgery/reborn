import React from "react";
import { Text } from "../ui/text";
import {
  Bell,
  Bug,
  FlaskConical,
  HelpCircle,
  LogOut,
  MailCheck,
  Settings,
  User2,
} from "lucide-react-native";
import { View } from "react-native";
import { PlanInfo } from "./Plan";
import { GoPremium } from "./GoPremium";
import { Separator } from "../ui/separator";
import { MenuItem } from "./MenuItem";
import { useAuthPersistStore } from "~/hooks/stores/useAuthPersistStore";
import { useNavigation } from "~/hooks/useNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";

export const Account = () => {
  const navigation = useNavigation();
  const authPersistStore = useAuthPersistStore();
  const queryClient = useQueryClient();

  const signout = async () => {
    authPersistStore.logout();
    queryClient.clear();
    navigation.navigate("index", { reset: true });
  };

  return (
    <SafeAreaView className="flex-1 px-5">
      <PlanInfo className="my-2" />
      <GoPremium className="my-3" />

      <View className="flex flex-col gap-2 my-5">
        {/* App Settings */}
        <Text className="text-xl font-semibold">App Settings</Text>
        <View className="flex flex-col mt-2">
          <MenuItem
            title="My Profile"
            icon={User2}
            link={"account/managment"}
          />
          <Separator />
          <MenuItem
            title="User Preferences"
            icon={Settings}
            link={"account/user-preferences"}
          />
          <Separator />
          <MenuItem title="Notifications" icon={Bell} />
        </View>
        {/* Support */}
        <View>
          <Text className="text-xl font-semibold">Support</Text>
          <View className="flex flex-col mt-2">
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
          <Text className="text-xl font-semibold">Account Actions</Text>
          <View className="flex flex-col mt-2">
            <MenuItem title="Switch Account" icon={LogOut} onPress={signout} />
            <Separator />
            <MenuItem title="Try Anything" icon={FlaskConical} link={"test"} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
