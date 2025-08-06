import React from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "~/api";
import { useSendFeedbackStore } from "~/hooks/stores/useFeedbackManager";
import { View } from "react-native";
import { MailCheck } from "lucide-react-native";
import Icon from "~/lib/Icon";
import { Text } from "~/components/ui/text";
import { createFeedbackSchema } from "~/types/validations/system-reports.validation";
import { Button } from "~/components/ui/button";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { useSendFeedbackFormStructure } from "./useSendFeedbackFormStructure";
import { cn } from "~/lib/utils";
import { showToastable } from "react-native-toastable";
import { useNavigation } from "~/hooks/useNavigation";
import { StableKeyboardAwareScrollView } from "~/components/shared/KeyboardAwareScrollView";

interface SendFeedbackPortalProps {
  className?: string;
}

export const SendFeedbackPortal = ({ className }: SendFeedbackPortalProps) => {
  const navigation = useNavigation();
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
        navigation.goBack();
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

  const [rating, setRating] = React.useState(0);

  return (
    <StableKeyboardAwareScrollView>
      <View className={cn("flex flex-col my-4 gap-2 mx-4", className)}>
        {/* Header Section */}
        <View className="mx-auto ">
          <Icon name={MailCheck} />
        </View>
        <View>
          <Text className="font-extrabold text-lg">
            We'd love your feedback!
          </Text>
          <Text className="font-thin mt-1 text-sm">
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
  );
};
