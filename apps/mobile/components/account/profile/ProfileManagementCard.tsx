import React from "react";
import { Text } from "~/components/ui/text";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/shared/StableAvatar";

interface ProfileManagmentCardProps {
  className?: string;
  uri?: string;
  identity?: string;
  fallback?: string;
}

export const ProfileManagmentCard = ({
  className,
  uri,
  identity,
  fallback = "?",
}: ProfileManagmentCardProps) => {
  const navigation = useNavigation<NavigationProps>();
  return (
    <Card className={cn("w-full items-center justify-center", className)}>
      <CardHeader>
        <Avatar alt={fallback} className="w-40 h-40 mx-auto border">
          <AvatarImage source={{ uri }} />
          <AvatarFallback>
            <Text>{fallback}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className="mx-auto mt-2 text-xl">{identity}</Text>
      </CardHeader>
      <CardContent>
        <View className="flex flex-row w-full">
          <View className="flex items-center w-1/3 border-r-2">
            <Text className="text-2xl">50</Text>
            <Text className="font-light">Services</Text>
          </View>
          <View className="flex items-center w-1/3 border-r-2">
            <Text className="text-2xl">50</Text>
            <Text className="font-light">Following</Text>
          </View>
          <View className="flex items-center w-1/3">
            <Text className="text-2xl">50</Text>
            <Text className="font-light">Followers</Text>
          </View>
        </View>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
