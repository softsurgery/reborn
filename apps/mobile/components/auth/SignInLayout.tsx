import React from "react";
import { cn } from "~/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Image, Platform, View } from "react-native";
import { api } from "~/api";
import { useAuthStore } from "~/hooks/stores/useAuthStore";
import { Text } from "../ui/text";
import { FormBuilder } from "../shared/form-builder/FormBuilder";
import { useSignInFormStructure } from "./useSignInFormStructure";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react-native";
import DividerWithText from "../ui/divider-with-text";
import { requestSignInDtoSchema } from "~/types/validations/auth.validation";
import { showToastable } from "react-native-toastable";
import { ServerErrorResponse } from "~/types";
import { StableKeyboardAwareScrollView } from "../shared/StableKeyboardAwareScrollView";
import { Icon } from "../ui/icon";
import { router } from "expo-router";
import { SSOButtons } from "./SSOButtons";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { useTranslation } from "react-i18next";

interface SignInLayoutProps {
  className?: string;
}

export const SignInLayout = ({ className }: SignInLayoutProps) => {
  const { t } = useTranslation("common");
  const authStore = useAuthStore();

  const { mutate: SignIn, isPending: isSignInPending } = useMutation({
    mutationFn: async () => api.auth.signIn(authStore.signInRequest),
    onSuccess: () => {
      router.replace("/");
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

  const onSignInPress = () => {
    authStore.resetErrors();
    const result = requestSignInDtoSchema.safeParse(authStore.signInRequest);
    if (!result.success) {
      authStore.set("signInRequestErrors", result.error.flatten().fieldErrors);
    } else SignIn();
  };

  return (
    <StableSafeAreaView>
      <StableKeyboardAwareScrollView>
        <View
          className={cn("flex flex-col justify-center gap-5 p-4", className)}
        >
          <View className="my-5">
            <Text className="text-2xl font-extrabold text-center">
              {t("auth.welcome")}
            </Text>
            <Text className="text-2xl font-thin text-center">
              Glad to see you again
            </Text>
          </View>

          <View className="flex flex-col gap-2 px-2 w-fit">
            <FormBuilder structure={signInFormStructure} />

            <Text className="text-md font-bold ml-auto my-1">
              Forget Password ?
            </Text>

            <Button
              disabled={isSignInPending}
              className="flex flex-row justify-center gap-2 my-1"
              onPress={onSignInPress}
            >
              <Text className="font-bold">Continue with E-mail</Text>
              <Icon as={ArrowRight} size={24} className="text-white" />
            </Button>

            <DividerWithText text="OR" />

            <SSOButtons className="my-1" isSignInPending={isSignInPending} />
          </View>

          <View className="flex flex-row gap-1 items-center justify-center my-auto">
            <Text>Don't have an account?</Text>
            <Text
              className="font-bold"
              onPress={() => router.push("/auth/sign-up")}
            >
              Create an account
            </Text>
          </View>
        </View>
      </StableKeyboardAwareScrollView>
    </StableSafeAreaView>
  );
};
