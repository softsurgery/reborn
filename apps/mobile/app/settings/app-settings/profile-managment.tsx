import * as React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text } from "~/components/ui/text";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useRouter } from "expo-router";
import { View } from "react-native";
const GITHUB_AVATAR_URI = "https://github.com/mrzachnugent.png";

export default function ProfileManagment() {
  const router = useRouter();
  return (
    <KeyboardAwareScrollView className="flex flex-col gap-5 my-5 px-4">
      <Card className="w-full items-center justify-center">
        <CardHeader>
          <Avatar
            className="items-center justify-center"
            alt="Zach Nugent's Avatar"
          >
            <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
            <AvatarFallback>
              <Text>ZN</Text>
            </AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
            <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }} >
          <View
            style={{
              borderRightWidth: 1,
              borderRightColor: "white",
            }}
          >
            <Text>Card Content</Text>
          </View>
          <View
            style={{
              borderRightWidth: 1,
              borderRightColor: "white",
            }}
          >
            <Text>Card Content</Text>
          </View>
          <View
            style={{
              borderRightWidth: 1,
              borderRightColor: "white",
            }}
          >
            <Text>Card Content</Text>
          </View>
          </View>
        </CardContent>
        <CardFooter>
          <Button
            onPress={() =>
              router.push("/settings/app-settings/profile/update-profile")
            }
            variant="ghost"
            className="w-full pr-1 pl-1"
          >
            <Text>Update Your Profile</Text>
          </Button>
        </CardFooter>
      </Card>
    </KeyboardAwareScrollView>
  );
}
