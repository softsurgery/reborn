import React from "react";
import { useAuthFunctions } from "~/hooks/useAuthFunctions";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { LogOut } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";

export const Profile = () => {
  const { handleSignOut } = useAuthFunctions();
  const navigation = useNavigation<NavigationProps>();

  const { mutate: SignOutMutator, isPending: isSignOutPending } = useMutation({
    mutationFn: async () => handleSignOut(),
    onSuccess: () => {
      navigation.navigate("index");
    },
  });

  return (
    <>
      <Text className="p-10">Profile</Text>
      <Button
        variant="outline"
        onPress={() => SignOutMutator()}
        className="flex flex-row gap-2 mx-10"
      >
        <IconWithTheme icon={LogOut} size={20} />
        <Text>Disconnect</Text>
      </Button>
    </>
  );
};
