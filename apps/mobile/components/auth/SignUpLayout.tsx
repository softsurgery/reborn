import React from "react";
import { Image, View } from "react-native";
import { Text } from "~/components/ui/text";
import { ArrowRight } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/hooks/stores/useAuthStore";
import DividerWithText from "~/components/ui/divider-with-text";
import { useSignUpFormStructure } from "./useSignUpFormStructure";
import { FormBuilder } from "../shared/form-builder/FormBuilder";
import { isEmail } from "~/lib/validators/isEmail";
import { StableKeyboardAwareScrollView } from "../shared/StableKeyboardAwareScrollView";
import { cn } from "~/lib/utils";
import { Icon } from "../ui/icon";
import { router } from "expo-router";

interface SignUpLayoutProps {
  className?: string;
}

export const SignUpLayout = ({ className }: SignUpLayoutProps) => {
  const authStore = useAuthStore();

  const { signUpFormStructure } = useSignUpFormStructure({
    store: authStore,
  });

  return (
    <StableKeyboardAwareScrollView>
      <View className={cn("flex flex-col justify-center gap-5 p-4", className)}>
        {/* Greetings */}
        <View className="my-5">
          <Text className="text-2xl font-extrabold text-center">
            Are you new here ?
          </Text>
          <Text className="text-2xl font-thin text-center">
            We are delighted to have you here
          </Text>
        </View>

        {/* Form */}
        <View className="flex flex-col gap-2 px-2 w-fit">
          <FormBuilder structure={signUpFormStructure} />

          {/* Email Button */}
          <Button
            className="flex flex-row justify-center gap-2 my-1"
            onPress={() => {
              router.push("/auth/sign-up-carry-on");
            }}
            disabled={!isEmail(authStore.signUpRequest.email)}
          >
            <Text className="font-bold text-white">Continue with E-mail</Text>
            <Icon as={ArrowRight} size={24} className="text-white" />
          </Button>

          {/* Divider */}
          <DividerWithText text="OR" />

          {/* Social Auth Options */}
          <View className="flex flex-col justify-center gap-2 my-1">
            {/* Google */}
            <Button className="flex flex-row w-fit gap-2 bg-red-600">
              <Image
                className="w-5 h-5 shadow-md"
                source={require("~/assets/images/google.png")}
              />
              <Text className="text-lg font-bold text-white">
                Continue with Google
              </Text>
            </Button>

            {/* Facebook */}
            <Button className="flex flex-row w-fit gap-2 bg-blue-600">
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

        {/* Navigate to sign-in */}
        <View className="flex flex-row gap-1 items-center justify-center my-auto">
          <Text className="text-lg">Already have an account?</Text>
          <Text
            className="font-bold text-lg"
            onPress={() => router.push("/auth/sign-in")}
          >
            Sign-in
          </Text>
        </View>
      </View>
    </StableKeyboardAwareScrollView>
  );
};
