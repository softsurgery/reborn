import * as React from "react";
import { Image, View } from "react-native";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MailPlus } from "lucide-react-native";
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
  SignUpWithEmail,
  VerifySignUpWithEmailAndPassword,
} from "~/firebase/authentification";
import { useMutation } from "@tanstack/react-query";
import DividerWithText from "~/components/ui/divider-with-text";
import { useToast } from "react-native-toast-notifications";

export default function Screen() {
  const authManager = useAuthManager();
  const navigation = useNavigation<NavigationProps>();
  const toast = useToast();

  const { mutate: SignUpMutator, isPending: isSignUpPending } = useMutation({
    mutationFn: async () =>
      SignUpWithEmail(
        { name: authManager.name, surname: authManager.surname },
        { email: authManager.email, password: authManager.password }
      ),
    onSuccess: (data: Result) => {
      if (data.success) {
        navigation.navigate("auth/sign-in-screen");
      } else {
        toast.show("oops! " + data.message, {
          style: { backgroundColor: "red" },
        });
      }
    },
  });

  React.useEffect(() => {
    authManager.reset();
  }, []);

  const onSignUpPress = () => {
    authManager.resetErrors();
    console.log(authManager);
    const errors = VerifySignUpWithEmailAndPassword(
      authManager.name,
      authManager.surname,
      authManager.email,
      authManager.password,
      authManager.confirmPassword
    );
    if (errors.length > 0) {
      //@ts-ignore
      errors.forEach((error) => authManager.set(error.field, error.message));
    } else {
      SignUpMutator();
    }
  };

  return (
    <KeyboardAwareScrollView className="">
      <View className="flex flex-col justify-center gap-5 p-4">
        {/* Greetings */}
        <View className="my-5">
          <Text className="text-2xl font-extrabold mx-auto ">
            Are you new here ?
          </Text>
          <Text className="text-2xl font-thin mx-auto">
            We are dilighted to have you here
          </Text>
        </View>

        {/* Form */}
        <View className="flex flex-col gap-2 px-2 my-5 w-fit">
          <View className="flex flex-row gap-2 px-1 justify-center">
            <View className="w-1/2">
              <Input
                editable={!isSignUpPending}
                placeholder="Name"
                value={authManager.name}
                onChangeText={(text) => authManager.set("name", text)}
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
              />
              {authManager.nameError && (
                <Text className="font-bold color-red-600 text-sm">
                  {authManager.nameError}
                </Text>
              )}
            </View>
            <View className="w-1/2">
              <Input
                editable={!isSignUpPending}
                placeholder="Surname"
                value={authManager.surname}
                onChangeText={(text) => authManager.set("surname", text)}
                aria-labelledby="inputLabel"
                aria-errormessage="inputError"
              />
              {authManager.surnameError && (
                <Text className="font-bold  color-red-600 text-sm">
                  {authManager.surnameError}
                </Text>
              )}
            </View>
          </View>

          <View>
            <Input
              keyboardType="email-address"
              editable={!isSignUpPending}
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
              editable={!isSignUpPending}
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
          <View>
            <Input
              editable={!isSignUpPending}
              secureTextEntry={true}
              placeholder="Confirm Password"
              value={authManager.confirmPassword}
              onChangeText={(text) => authManager.set("confirmPassword", text)}
              aria-labelledby="inputLabel"
              aria-errormessage="inputError"
            />
            {authManager.confirmPasswordError && (
              <Text className="font-bold color-red-600 text-sm">
                {authManager.confirmPasswordError}
              </Text>
            )}
          </View>

          {/* Email Button */}
          <Button
            disabled={isSignUpPending}
            className="flex flex-row justify-center gap-2 my-2"
            onPress={() => {
              onSignUpPress();
            }}
          >
            <IconWithTheme
              icon={MailPlus}
              size={24}
              className="mt-1"
              color="white"
            />
            <Text className="font-bold">Create Account</Text>
          </Button>
          {/* Divider */}
          <DividerWithText text="OR" />
          {/* SAO */}
          <View className="flex flex-col justify-center gap-2 my-1">
            {/* Google */}
            <Button
              disabled={isSignUpPending}
              className="flex flex-row w-fit gap-2 bg-red-600"
            >
              <Image
                className="w-5 h-5 shadow-md"
                source={require("~/assets/images/google.png")}
              />
              <Text className="text-lg font-bold text-white">
                Continue with Google
              </Text>
            </Button>
            {/* Facebook */}
            <Button
              disabled={isSignUpPending}
              className="flex flex-row w-fit gap-2 bg-blue-600"
            >
              <Image
                className="w-5 h-5 shadow-md"
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
            onPress={() => navigation.navigate("auth/sign-in-screen")}
          >
            Sign in
          </Label>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
