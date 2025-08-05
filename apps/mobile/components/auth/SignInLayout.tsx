import React from "react";
import { cn } from "~/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Image, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { api } from "~/api";
import { useAuthStore } from "~/hooks/stores/useAuthStore";
import { ServerErrorResponse } from "~/types/server.response";
import { Text } from "../ui/text";
import { FormBuilder } from "../shared/form-builder/FormBuilder";
import { useSignInFormStructure } from "./useSignInFormStructure";
import { Button } from "../ui/button";
import Icon from "~/lib/Icon";
import { ArrowRight } from "lucide-react-native";
import DividerWithText from "../ui/divider-with-text";
import { requestSignInDtoSchema } from "~/types/validations/auth.validation";
import { useNavigation } from "~/hooks/useNavigation";
import { showToastable } from "react-native-toastable";

interface SignInLayoutProps {
  className?: string;
}

export const SignInLayout = ({ className }: SignInLayoutProps) => {
  const authStore = useAuthStore();
  const navigation = useNavigation();

  const { mutate: SignIn, isPending: isSignInPending } = useMutation({
    mutationFn: async () => api.auth.signIn(authStore.signInRequest),
    onSuccess: () => {
      navigation.navigate("application", { reset: true });
    },
    onError: (error: ServerErrorResponse) => {
      showToastable({
        message: error.response?.data.message,
        status: "danger",
      });
    },
  });
  const { signInFormStructure } = useSignInFormStructure({
    store: authStore,
    isPending: isSignInPending,
  });

  React.useEffect(() => {
    return () => {
      authStore.reset();
    };
  }, []);

  const onLoginPress = () => {
    authStore.resetErrors();
    const result = requestSignInDtoSchema.safeParse(authStore.signInRequest);
    if (!result.success) {
      authStore.set("signInRequestErrors", result.error.flatten().fieldErrors);
    } else SignIn();
  };

  return (
    <KeyboardAwareScrollView className="bg-background" bounces={false}>
      <View className={cn("flex flex-col justify-center gap-5 p-4", className)}>
        <View className="my-5">
          <Text className="text-2xl font-extrabold mx-auto">Welecome Back</Text>
          <Text className="text-2xl font-thin mx-auto">
            Glad to see you again
          </Text>
        </View>

        <View className="flex flex-col gap-2 px-2 my-5">
          <FormBuilder structure={signInFormStructure} />

          <Text className="text-md font-bold ml-auto my-1">
            Forget Password ?
          </Text>

          <Button
            disabled={isSignInPending}
            className="flex flex-row justify-center gap-2 my-1"
            onPress={onLoginPress}
          >
            <Text className="font-bold">Continue with E-mail</Text>
            <Icon name={ArrowRight} size={24} className="text-white" />
          </Button>

          <DividerWithText text="OR" />

          <View className="flex flex-col justify-center gap-2 my-1">
            <Button
              disabled={isSignInPending}
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

            <Button
              disabled={isSignInPending}
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

        <View className="flex flex-row gap-1 items-center justify-center my-auto">
          <Text className="text-xl">Don't have an account?</Text>
          <Text
            className="font-bold text-xl"
            onPress={() => navigation.navigate("auth/sign-up", { reset: true })}
          >
            Create an account
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
