import * as React from "react";
import { Image, View } from "react-native";
import { Text } from "~/components/ui/text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ArrowRight } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/hooks/stores/useAuthStore";
import Icon from "~/lib/Icon";
import DividerWithText from "~/components/ui/divider-with-text";
import { useSignUpFormStructure } from "./useSignUpFormStructure";
import { FormBuilder } from "../shared/form-builder/FormBuilder";
import { isEmail } from "~/lib/validators/isEmail";
import { useNavigation } from "~/hooks/useNavigation";
import { showToastable } from "react-native-toastable";

interface SignUpLayoutProps {
  className?: string;
}

export const SignUpLayout = ({ className }: SignUpLayoutProps) => {
  const authStore = useAuthStore();
  const navigation = useNavigation();

  const { signUpFormStructure } = useSignUpFormStructure({
    store: authStore,
  });

  return (
    <KeyboardAwareScrollView className={className} bounces={false}>
      <View className="flex flex-col justify-center gap-5 p-4">
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
        <View className="flex flex-col gap-2 px-2 my-5 w-fit">
          <FormBuilder structure={signUpFormStructure} />

          {/* Email Button */}
          <Button
            className="flex flex-row justify-center gap-2 my-1"
            onPress={() => {
              navigation.navigate("auth/sign-up-carry-on");
            }}
            disabled={!isEmail(authStore.signUpRequest.email)}
          >
            <Text className="font-bold text-white">Continue with E-mail</Text>
            <Icon name={ArrowRight} size={24} className="text-white" />
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
          <Text className="text-xl">Already have an account?</Text>
          <Text
            className="font-bold text-xl"
            onPress={() => navigation.navigate("auth/sign-in", { reset: true })}
          >
            Sign-in
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
