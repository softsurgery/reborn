import * as React from "react";
import { Text } from "~/components/ui/text";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";

interface ProfileManagmentCardProps {
  className?: string;
}

export const ProfileManagmentCard = ({
  className,
}: ProfileManagmentCardProps) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <Card className={cn("w-full items-center justify-center", className)}>
      <CardHeader>
        <Avatar
          alt="Zach Nugent's Avatar"
          className="w-40 h-40 mx-auto border-2"
        >
          <AvatarImage source={require("~/assets/images/adaptive-icon.png")} />
          <AvatarFallback>
            <Text>ZN</Text>
          </AvatarFallback>
        </Avatar>

        <Text className="mx-auto mt-5 text-xl">@Nayssem</Text>
      </CardHeader>
      <CardContent>
        <View className="flex flex-row w-full">
          <View className="flex items-center w-1/3 border-r-2">
            <Text className="text-2xl">50</Text>
            <Text className="font-light">Services</Text>
          </View>
          <View className="flex items-center w-1/3 border-r-2">
            <Text className="text-2xl">120</Text>
            <Text className="font-light">Following</Text>
          </View>
          <View className="flex items-center w-1/3">
            <Text className="text-2xl">400</Text>
            <Text className="font-light">Followers</Text>
          </View>
        </View>
      </CardContent>
      <CardFooter>
        <Button
          onPress={() => navigation.navigate("account/update-profile")}
          className="w-full"
        >
          <Text className="bold">Update Your Profile</Text>
        </Button>
      </CardFooter>
    </Card>
  );
};
