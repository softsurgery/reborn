import React from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { useSendFeedbackStore } from "~/hooks/stores/useFeedbackManager";
import { View } from "react-native";
import { ArrowLeft, MailCheck } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { createFeedbackSchema } from "~/types/validations/system-reports.validation";
import { Button } from "~/components/ui/button";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useSendFeedbackFormStructure } from "./useSendFeedbackFormStructure";
import { cn } from "~/lib/utils";
import { showToastable } from "react-native-toastable";
import { StableKeyboardAwareScrollView } from "~/components/shared/StableKeyboardAwareScrollView";
import { Icon } from "~/components/ui/icon";
import { router } from "expo-router";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { useTranslation } from "react-i18next";
import { ApplicationHeader } from "~/components/shared/AppHeader";

interface SendFeedbackPortalProps {
  className?: string;
}

export const SendFeedbackPortal = ({ className }: SendFeedbackPortalProps) => {
  const { t } = useTranslation("common");
  React.useEffect(() => {
    return () => {
      sendFeedbackStore.reset();
    };
  }, []);

  const sendFeedbackStore = useSendFeedbackStore();
  const { feedbackFormStructure } = useSendFeedbackFormStructure({
    store: sendFeedbackStore,
  });

  const { mutate: sendFeedback, isPending: isSendFeedbackPending } =
    useMutation({
      mutationFn: async () => api.feedback.create(sendFeedbackStore.createDto),
      onSuccess: () => {
        showToastable({
          message: "Feedback submitted successfully",
          status: "success",
        });
        router.back();
        sendFeedbackStore.reset();
      },
      onError: (error) => {
        showToastable({
          message: "Oops! Failed to submit feedback",
          status: "danger",
        });
      },
    });

  const handleSubmit = () => {
    const result = createFeedbackSchema.safeParse(sendFeedbackStore.createDto);
    if (!result.success) {
      sendFeedbackStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      sendFeedback();
    }
  };

  return (
    <StableSafeAreaView className={cn("flex flex-1", className)}>
      <ApplicationHeader
        title={t("screens.sendFeedback")}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "user-preferences",
            icon: ArrowLeft,
            onPress: () => router.back(),
          },
        ]}
      />
      <StableKeyboardAwareScrollView>
        <View className={cn("flex flex-col my-4 gap-2 mx-4", className)}>
          {/* Header Section */}
          <View className="mx-auto ">
            <Icon as={MailCheck} size={24} />
          </View>
          <View>
            <Text className="font-extrabold text-base">
              We'd love your feedback!
            </Text>
            <Text className="font-thin mt-2 text-sm">
              Please share your thoughts and help us improve.
            </Text>
          </View>

          <FormBuilder structure={feedbackFormStructure} />

          <Button
            disabled={isSendFeedbackPending}
            className="w-full"
            onPress={handleSubmit}
          >
            <Text>{isSendFeedbackPending ? "Sending..." : "Send"}</Text>
          </Button>
        </View>
      </StableKeyboardAwareScrollView>
    </StableSafeAreaView>
  );
};
