import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ArrowRightCircleIcon, KeyRound } from "lucide-react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuthManager } from "~/lib/stores/use-auth-form";
import { Label } from "~/components/ui/label";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { Credentials, Result } from "~/types";
import { SignInWithEmail } from "~/firebase/authentification";
import { useMutation } from "@tanstack/react-query";

export default function Screen() {
  const authManager = useAuthManager();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigation = useNavigation<NavigationProps>();

  const { mutate: SignInMutator, isPending: isLoginPending } = useMutation({
    mutationFn: async () =>
      SignInWithEmail({
        email: authManager.email,
        password: authManager.password,
      }),
    onSuccess: (data: Result) => {
      if (data.success) {
        setIsAuthenticated(true);
        navigation.navigate("success");
        setErrorMessage("");
      } else {
        setErrorMessage(data.message);
      }
    },
  });

  const onLoginPress = () => {
    SignInMutator();
  };

  return (
    <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
      <KeyboardAwareScrollView className="w-full">
        <Avatar alt="Reborn" className="self-center w-36 h-36">
          <AvatarImage source={{ uri: "../assets/images/adaptive-icon" }} />
          <AvatarFallback>
            <Text>RX</Text>
          </AvatarFallback>
        </Avatar>
        {errorMessage && (
          <Label className="text-lg font-normal mx-1 text-red-600">
            Error Message : {errorMessage}
          </Label>
        )}
        {isLoginPending && (
          <Text className="text-lg font-normal mx-1 text-gray-400">
            Loading...
          </Text>
        )}
        <View className="flex flex-col gap-5 px-2 my-5">
          <Input
            editable={!isLoginPending}
            placeholder="E-mail..."
            value={authManager.email}
            onChangeText={(text) => authManager.set("email", text)}
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
          />
          <Input
            editable={!isLoginPending}
            secureTextEntry={true}
            placeholder="Password..."
            value={authManager.password}
            onChangeText={(text) => authManager.set("password", text)}
            aria-labelledby="inputLabel"
            aria-errormessage="inputError"
          />
          {/* Email Button */}
          <Button
            disabled={isLoginPending}
            className="flex flex-row justify-center items-center gap-2"
            onPress={() => {
              setErrorMessage("");
              onLoginPress();
            }}
          >
            <IconWithTheme icon={ArrowRightCircleIcon} size={24} />
          </Button>
          <Text className="text-lg font-bold text-center underline">OR</Text>
          {/* SAO */}
          <View className="flex flex-row justify-center gap-10">
            {/* Google */}
            <Button className="w-fit">
              <Text className="text-lg font-normal">Google</Text>
            </Button>
            {/* Facebook */}
            <Button className="w-fit">
              <Text className="text-lg font-normal">Facebook</Text>
            </Button>
          </View>
        </View>

        <View className="flex flex-row gap-1 items-center justify-center my-10">
          <Label className="text-lg">Don't have an account?</Label>
          <Label
            className="font-bold underline"
            onPress={() => navigation.navigate("auth/sign-up-screen")}
          >
            Sign up
          </Label>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
