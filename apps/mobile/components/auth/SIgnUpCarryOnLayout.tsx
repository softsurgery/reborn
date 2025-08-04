import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text } from "../ui/text";
import { FormBuilder } from "../shared/form-builder/FormBuilder";
import { useSignUpFormStructure } from "./useSignUpFormStructure";
import { useAuthStore } from "~/hooks/stores/useAuthStore";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  SignUpWithEmail,
  VerifySignUpWithEmailAndPassword,
} from "~/firebase/authentification";
import { useNavigation } from "expo-router";
import { NavigationProps } from "~/types/app.routes";
import Icon from "~/lib/Icon";
import { Mail } from "lucide-react-native";
import React from "react";

export const SignUpCarryOnLayout = () => {
  const authStore = useAuthStore();
  const navigation = useNavigation<NavigationProps>();
  const { signUpCarryOnFormStructure } = useSignUpFormStructure({
    store: authStore,
  });

  // const { mutate: SignUpMutator, isPending: isSignUpPending } = useMutation({
  //   mutationFn: async () => SignUpWithEmail(),
  //   onSuccess: (data: Result) => {
  //     if (data.success) {
  //       navigation.navigate("auth/sign-in");
  //     } else {
  //       Toast.show("oops! " + data.message, {
  //         style: { backgroundColor: "red" },
  //       });
  //     }
  //   },
  // });

  React.useEffect(() => {
    return () => {
      authStore.reset();
    };
  }, []);

  const onSignUpPress = () => {
    // authManager.resetErrors();
    // const errors = VerifySignUpWithEmailAndPassword(
    //   authManager.name,
    //   authManager.surname,
    //   authManager.email,
    //   authManager.password,
    //   authManager.confirmPassword
    // );
    // if (errors.length > 0) {
    //   //@ts-ignore
    //   errors.forEach((error) => authManager.set(error.field, error.message));
    // } else {
    //   SignUpMutator();
    // }
  };

  return (
    <KeyboardAwareScrollView className="">
      <View className="flex flex-col justify-center gap-5 p-4">
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
        <View className="flex flex-col gap-2 px-2 my-5 w-fit">
          <FormBuilder structure={signUpCarryOnFormStructure} />

          {/* Email Button */}
          <Button
            className="flex flex-row justify-center gap-2 my-1"
            onPress={() => {
              onSignUpPress();
            }}
          >
            <Text className="font-bold">Create Account</Text>
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
