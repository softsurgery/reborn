import * as React from "react";
import { Image, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Mail } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAuthManager } from "~/lib/stores/use-auth-form";
import { Label } from "~/components/ui/label";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import { Result } from "~/types";
import {
  SignInWithEmail,
  VerifyEmailAndPassword,
} from "~/firebase/authentification";
import { useMutation } from "@tanstack/react-query";
import DividerWithText from "~/components/ui/divider-with-text";
import { useToast } from "react-native-toast-notifications";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/AuthContext";

export default function Screen() {
  const { setUser } = useAuth();
  const authManager = useAuthManager();
  const navigation = useNavigation<NavigationProps>();
  const toast = useToast();

  const { mutate: SignInMutator, isPending: isLoginPending } = useMutation({
    mutationFn: async () =>
      SignInWithEmail({
        email: authManager.email,
        password: authManager.password,
      }),
    onSuccess: (result: Result) => {
      if (result.success) {
        console.log("Success" , result);
        setUser(result.data);
        navigation.navigate("index");
      } else {
        toast.show("oops! " + result.message, {
          style: { backgroundColor: "red" },
        });
      }
    },
  });

  React.useEffect(() => {
    authManager.reset();
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
    <KeyboardAwareScrollView>
      <View className="flex flex-col justify-center gap-5 p-4">
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
          <View>
            <Input
              keyboardType="email-address"
              editable={!isLoginPending}
              placeholder="E-mail"
              value={authManager.email}
              onChangeText={(text) => authManager.set("email", text)}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
            />
            {authManager.emailError && (
              <Text className="font-bold color-red-600 text-sm">
                {authManager.emailError}
              </Text>
            )}
          </View>
          <View>
            <Input
              editable={!isLoginPending}
              secureTextEntry={true}
              placeholder="Password"
              value={authManager.password}
              onChangeText={(text) => authManager.set("password", text)}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
            />
            {authManager.passwordError && (
              <Text className="font-bold color-red-600 text-sm">
                {authManager.passwordError}
              </Text>
            )}
          </View>

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
            <IconWithTheme icon={Mail} size={24} className="mt-1" reverse />
            <Text reversed className="font-bold">
              Continue with E-mail
            </Text>
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
