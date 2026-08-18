import React from "react";
import { cn } from "~/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { View } from "react-native";
import { api } from "~/api";
import { useAuthStore } from "~/hooks/stores/useAuthStore";
import { Text } from "../ui/text";
import { FormBuilder } from "../shared/form-builder/FormBuilder";
import { useSignInFormStructure } from "./useSignInFormStructure";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react-native";
import DividerWithText from "../ui/divider-with-text";
import { requestSignInDtoSchema } from "~/types/validations/auth.validation";
import { ServerErrorResponse } from "~/types";
import { StableKeyboardAwareScrollView } from "../shared/stables/StableKeyboardAwareScrollView";
import { router } from "expo-router";
import { SSOButtons } from "./SSOButtons";
import { StableSafeAreaView } from "../shared/stables/StableSafeAreaView";
import { useTranslation } from "react-i18next";
import { toast } from "sonner-native";
import { ApplicationHeader } from "../shared/AppHeader";

interface SignInLayoutProps {
  className?: string;
}

export const SignInLayout = ({ className }: SignInLayoutProps) => {
  const { t } = useTranslation("common");
  const authStore = useAuthStore();

  const { mutate: SignIn, isPending: isSignInPending } = useMutation({
    mutationFn: async () => api.auth.signIn(authStore.signInRequest),
    onSuccess: () => {
      toast.success("Welcome back!");
      router.replace("/");
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(error.response?.data.message || "Failed to sign in");
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
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        titleVariant="large"
        shortcuts={[
          {
            key: "back",
            icon: ChevronLeft,
            onPress: () => {
              router.back();
            },
          },
        ]}
      />
      <View className="flex-1 bg-background">
        <StableKeyboardAwareScrollView>
          <View
            className={cn(
              "flex flex-col flex-1 justify-centers gap-5 p-4 bg-background",
              className,
            )}
          >
            <View className="my-5">
              <Text className="text-2xl font-extrabold text-center">
                {t("auth.welcome")}
              </Text>
              <Text className="text-2xl font-thin text-center">
                Glad to see you again
              </Text>
            </View>

            <View className="flex flex-col gap-2 px-2">
              <FormBuilder structure={signInFormStructure} />

              <Text className="font-bold ml-auto my-1">Forget Password ?</Text>

              <Button
                disabled={isSignInPending}
                size="lg"
                className="relative flex flex-row items-center justify-center rounded-xl h-14"
                onPress={onSignInPress}
              >
                <Text className="text-lg font-bold text-primary-foreground">
                  Continue with E-mail
                </Text>
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
      </View>
    </StableSafeAreaView>
  );
};
