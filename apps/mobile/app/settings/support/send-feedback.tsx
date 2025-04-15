import * as React from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFeedbackManager } from "./hooks/useFeedbackManager";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "react-native-toast-notifications";
import { FEEDBACK_CATEGORIES } from "~/constants/feedback-categories";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { MailCheck } from "lucide-react-native";
import { FormBuilder } from "~/components/common/form-builder/FormBuilder";
import { DynamicForm } from "~/types/utils/form-builder";
import { View } from "react-native";
import { api } from "~/api";
import { Feedback } from "~/types";
import { splitCamelOrPascal } from "~/lib/string.lib";

export default function FeedbackScreen() {
  const feedbackManager = useFeedbackManager();

  const { mutate: submitFeedback, isPending: isFeedbackSubmitting } =
    useMutation({
      mutationFn: async () =>
        api.feedback.postFeedback(feedbackManager.getFeedback() as Feedback),
      onSuccess: (data) => {
        Toast.show(data.message, {
          style: { backgroundColor: "green" },
        });
        feedbackManager.reset();
      },
      onError: () => {
        Toast.show("Oops! Failed to submit feedback", {
          style: { backgroundColor: "red" },
        });
      },
    });

  const handleSubmit = () => {
    submitFeedback();
  };

  const [rating, setRating] = React.useState(0);

  const form = React.useMemo(
    (): DynamicForm => ({
      name: "We'd love your feedback!",
      description: "Please share your thoughts and help us improve.",
      grids: [
        {
          name: "",
          gridItems: [
            {
              id: 1,
              fields: [
                {
                  label: "Feedback Message(*)",
                  variant: "text",
                  description: "Share your feedback here",
                  required: true,
                  placeholder: "Share your feedback here...",
                  props: {
                    value: feedbackManager.message,
                    onChangeText: (value) =>
                      feedbackManager.set("message", value),
                  },
                },
              ],
            },
            {
              id: 2,
              fields: [
                {
                  label: "Feedback Category",
                  variant: "select",
                  description: "Select Your Feedback Category",
                  required: true,
                  placeholder: "Select Feedback Category",
                  props: {
                    selectOptions: FEEDBACK_CATEGORIES.map((category) => ({
                      label: splitCamelOrPascal(category),
                      value: category,
                    })),

                    value: feedbackManager.category,
                    onValueChange: (value) =>
                      feedbackManager.set("category", value),
                  },
                },
              ],
            },
            {
              id: 3,
              fields: [
                {
                  label: "Rating",
                  variant: "rating",
                  description: "Rate your experience",
                  required: true,
                  props: {
                    rating: feedbackManager.rating || 0,
                    onValueChange: (value) => {
                      feedbackManager.set("rating", value);
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
    [feedbackManager]
  );

  return (
    <KeyboardAwareScrollView bounces={false}>
      <View className="flex flex-col my-4 gap-2 mx-4">
        {/* Header Section */}
        <View className="mx-auto ">
          <IconWithTheme icon={MailCheck} size={52} className="mx-auto" />
        </View>
        <View>
          <Text className="font-extrabold text-lg">
            We'd love your feedback!
          </Text>
          <Text className="font-thin mt-1 text-sm">
            Please share your thoughts and help us improve.
          </Text>
        </View>

        <FormBuilder form={form} />

        <Button
          disabled={isFeedbackSubmitting}
          className="w-full"
          onPress={handleSubmit}
        >
          <Text>
            {isFeedbackSubmitting ? "Submitting..." : "Submit Feedback"}
          </Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
