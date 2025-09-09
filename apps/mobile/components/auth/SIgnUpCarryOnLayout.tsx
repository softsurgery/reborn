import { View } from "react-native";
import { Text } from "../ui/text";
import { FormBuilder } from "../shared/form-builder/FormBuilder";
import { useSignUpFormStructure } from "./useSignUpFormStructure";
import { useAuthStore } from "~/hooks/stores/useAuthStore";
import { Button } from "../ui/button";
import React from "react";
import { cn } from "~/lib/utils";
import { useNavigation } from "~/hooks/useNavigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { showToastable } from "react-native-toastable";
import { requestSignUpDtoSchema } from "~/types/validations/auth.validation";
import { StableKeyboardAwareScrollView } from "../shared/StableKeyboardAwareScrollView";
import { ServerErrorResponse } from "~/types";

interface SignUpCarryOnLayoutProps {
  className?: string;
}

export const SignUpCarryOnLayout = ({
  className,
}: SignUpCarryOnLayoutProps) => {
  const authStore = useAuthStore();
  const navigation = useNavigation();

  const { mutate: SignUp, isPending: isSignUpPending } = useMutation({
    mutationFn: async () => api.auth.signUp(authStore.signUpRequest),
    onSuccess: () => {
      navigation.navigate("auth/sign-in", { reset: true });
      showToastable({
        message: "Now you can sign in with your new account",
        status: "success",
      });
    },
    onError: (error: ServerErrorResponse) => {
      showToastable({
        message: error.response?.data.message,
        status: "danger",
      });
    },
  });

  const { signUpCarryOnFormStructure } = useSignUpFormStructure({
    store: authStore,
    isPending: isSignUpPending,
  });

  React.useEffect(() => {
    return () => {
      authStore.reset();
    };
  }, []);

  const onSignUpPress = () => {
    authStore.resetErrors();
    const result = requestSignUpDtoSchema.safeParse({
      ...authStore.signUpRequest,
      confirmPassword: authStore.utilities.confirmPassword,
    });
    if (!result.success) {
      authStore.set("signUpRequestErrors", result.error.flatten().fieldErrors);
    } else SignUp();
  };

  return (
    <StableKeyboardAwareScrollView>
      <View className={cn("flex flex-col justify-center gap-5 p-4", className)}>
        {/* Greetings */}
        <View className="my-5">
          <Text className="text-2xl font-extrabold text-center">
            Just one more step!
          </Text>
          <Text className="text-2xl font-thin text-center">
            Let’s complete your sign-up by adding a few more details.
          </Text>
        </View>

        {/* Form */}
        <View className="flex flex-col gap-2 px-2 w-fit">
          <FormBuilder structure={signUpCarryOnFormStructure} />

          {/* Email Button */}
          <Button
            className="flex flex-row justify-center gap-2 my-1"
            onPress={() => {
              onSignUpPress();
            }}
            disabled={isSignUpPending}
          >
            <Text className="font-bold">Create Account</Text>
          </Button>
        </View>
      </View>
    </StableKeyboardAwareScrollView>
  );
};
