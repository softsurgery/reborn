import React from "react";
import { Image, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "~/components/ui/button";
import { useAuthManager } from "~/hooks/stores/use-auth-form";
import { Label } from "~/components/ui/label";
import { useNavigation } from "expo-router";
import { VerifyEmailAndPassword } from "~/firebase/authentification";
import { useMutation } from "@tanstack/react-query";
import DividerWithText from "~/components/ui/divider-with-text";
import { useToast } from "react-native-toast-notifications";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/AuthContext";
import Icon from "~/lib/Icon";
import { Mail } from "lucide-react-native";
import { api } from "~/api";
import { ServerErrorResponse } from "~/types/server.response";
import { SignInPayload } from "~/types/auth.types";
import { SignInForm } from "~/components/auth/SigninForm";

export default function Screen() {
  const { setPayload } = useAuth();
  const authManager = useAuthManager();
  const navigation = useNavigation<any>();
  const toast = useToast();

  const {
    mutate: SignInMutator,
    isPending: isLoginPending,
    reset: resetLoginMutation,
  } = useMutation({
    mutationFn: async () =>
      api.auth.signInWithEmailAndPassword({
        usernameOrEmail: authManager.email,
        password: authManager.password,
      }),
    onSuccess: (result: SignInPayload) => {
      setPayload(result);
      navigation.reset({
        routes: [{ name: "index" }],
      });
    },
    onError: (error: ServerErrorResponse) => {
      toast.show(error.response?.data.error);
    },
  });

  React.useEffect(() => {
    authManager.reset();
    resetLoginMutation();
  }, []);

  const onLoginPress = () => {
    authManager.resetErrors();
    const errors = VerifyEmailAndPassword(
      authManager.email,
      authManager.password
    );
    if (errors.length > 0) {
      //@ts-ignore
      errors.forEach((error) => authManager.set(error.field, error.message));
      return;
    } else SignInMutator();
  };

  return (
    <KeyboardAwareScrollView className="bg-background">
      <View className="flex flex-col justify-center gap-5 p-4 ">
        {/* Greetings */}
        <View className="my-5">
          <Text className="text-2xl font-extrabold mx-auto ">
            Welecome Back
          </Text>
          <Text className="text-2xl font-thin mx-auto ">
            Glad to see you again
          </Text>
        </View>

        {/* Form */}
        <View className="flex flex-col gap-2 px-2 my-5">
          <SignInForm isPending={isLoginPending} />

          <Text className="text-md font-bold ml-auto my-1">
            Forget Password ?
          </Text>

          {/* Email Button */}
          <Button
            disabled={isLoginPending}
            className="flex flex-row justify-center gap-2 my-1"
            onPress={() => {
              onLoginPress();
            }}
          >
            <Icon name={Mail} size={24} className="text-white" />
            <Text className="font-bold text-white">Continue with E-mail</Text>
          </Button>
          {/* Divider */}
          <DividerWithText text="OR" />
          {/* SAO */}
          <View className="flex flex-col justify-center gap-2 my-1">
            {/* Google */}
            <Button
              disabled={isLoginPending}
              className="flex flex-row w-fit gap-2 bg-red-600"
            >
              <Image
                className="w-6 h-6 shadow-md"
                source={require("~/assets/images/google.png")}
              />
              <Text className="text-lg font-bold text-white">
                Continue with Google
              </Text>
            </Button>
            {/* Facebook */}
            <Button
              disabled={isLoginPending}
              className="flex flex-row w-fit gap-2 bg-blue-600"
            >
              <Image
                className="w-6 h-6 shadow-md"
                source={require("~/assets/images/facebook.png")}
              />
              <Text className="text-lg font-bold text-white">
                Continue with Facebook
              </Text>
            </Button>
          </View>
        </View>
        {/* Navigate to sign up */}
        <View className="flex flex-row gap-1 items-center justify-center my-auto">
          <Label className="text-lg">Don't have an account?</Label>
          <Label
            className="font-bold underline"
            onPress={() => navigation.navigate("auth/sign-up-screen")}
          >
            Sign up
          </Label>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
