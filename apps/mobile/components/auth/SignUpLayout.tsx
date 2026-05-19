import { cn } from "@/lib/utils";
import { router } from "expo-router";
import { View } from "react-native";
import { FormBuilder } from "../shared/form-builder/FormBuilder";
import { StableSafeAreaView } from "../shared/StableSafeAreaView";
import { ApplicationHeader } from "../shared/AppHeader";
import { ArrowLeft } from "lucide-react-native";
import { Stepper } from "../shared/Stepper";
import React from "react";
import { ServerErrorResponse, Upload } from "@/types";
import { toast } from "sonner-native";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { useUploadMutation } from "@/hooks/content/useUploadMutation";
import { useAuthStore } from "@/hooks/stores/useAuthStore";
import { useSignUpFormStructure } from "./useSignUpFormStructure";
import { useAuthValidation } from "@/hooks/useAuthValidation";

interface SignupLayoutProps {
  className?: string;
}

export const SignupLayout = ({ className }: SignupLayoutProps) => {
  const authStore = useAuthStore();

  const {
    uploadFiles: uploadProfilePicture,
    isUploadPending: isProfilePictureUploadPending,
  } = useUploadMutation({
    onSuccess: (response: Upload[]) => {
      authStore.setNested("signUpRequest.pictureId", response?.[0]?.id);
    },
    onError: (error: ServerErrorResponse) => {
      toast.error(
        error.response?.data?.message || "Failed to upload image",
        {},
      );
    },
  });

  const { usernameValidation, emailValidation } = useAuthValidation();

  const { signUpFormStructure } = useSignUpFormStructure({
    store: authStore,
    usernameValidation,
    emailValidation,
    uploadPicture: uploadProfilePicture,
    isProfilePictureUploadPending,
  });

  React.useEffect(() => {
    return () => {
      authStore.reset();
    };
  }, []);

  const { mutate: signUp, isPending: isSignUpPending } = useMutation({
    mutationFn: async () => api.auth.signUp(authStore.signUpRequest),
    onSuccess: () => {
      toast.success("Account created successfully! Please sign in.");
      router.push("/auth/sign-in");
    },
    onError: (error: ServerErrorResponse) => {
      const message =
        error.response?.data?.message || "Failed to create account";
      toast.error(message);
    },
  });

  const step1Validation =
    !usernameValidation.isCheckingUsername &&
    !emailValidation.isCheckingEmail &&
    !usernameValidation.isUsernameTaken &&
    !emailValidation.isEmailTaken &&
    !!authStore.signUpRequest.username &&
    !!authStore.signUpRequest.email &&
    !!authStore.signUpRequest.firstName &&
    !!authStore.signUpRequest.lastName &&
    !!authStore.signUpRequest.password &&
    authStore.signUpRequest.password.length >= 8 &&
    authStore.signUpRequest.password === authStore.utilities.confirmPassword;

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{ wrapper: "border-b border-border pb-2" }}
        titleVariant="large"
        shortcuts={[
          {
            key: "back",
            icon: ArrowLeft,
            onPress: () => {
              router.back();
            },
          },
        ]}
      />
      <View className="flex-1 bg-background">
        <View className={cn("flex-1 px-2 bg-background", className)}>
          <Stepper
            classNames={{
              controlsWrapper: "pb-8",
            }}
            steps={[
              {
                title: "Introduce Yourself",
                description:
                  "Start by providing the basic details about yourself.",
                component: <FormBuilder structure={signUpFormStructure} />,
                validation: step1Validation,
              },
              // {
              //   title: "Show us your face",
              //   description:
              //     "Upload a profile picture to personalize your account.",
              //   component: <FormBuilder structure={profilePictureFieldset} />,
              //   validation: !!authStore.signUpRequest.pictureId,
              // },
            ]}
            closingActions={[
              {
                id: "create-account",
                label: "Create My Account",
                onPress: () => signUp(),
                disabled: isSignUpPending,
              },
            ]}
          />
        </View>
      </View>
    </StableSafeAreaView>
  );
};
