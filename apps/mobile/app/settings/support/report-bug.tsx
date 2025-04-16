import * as React from "react";
import { IconWithTheme } from "~/lib/IconWithTheme";
import { Bug as bugIcon }  from "lucide-react-native";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useReportBugManger } from "./hooks/useReportBugManager";
import { BUG_CATEGORIES } from "~/constants/bug-categories";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "react-native-toast-notifications";
import { DynamicForm } from "~/types/utils/form-builder";
import { FormBuilder } from "~/components/common/form-builder/FormBuilder";
import { api } from "~/api";
import { Bug } from "~/types";
import { splitCamelOrPascal } from "~/lib/string.lib";

export default function Screen() {
  const bugManager = useReportBugManger();

  const { mutate: submitBug, isPending: isBugCreationPending } = 
  useMutation({
    mutationFn: async () => 
      api.bug.postBug(bugManager.getBug() as Bug),
    onSuccess: (data) => {
      Toast.show(data.title, {
        style: { backgroundColor: "green" },
      });
      bugManager.reset();
    },
    onError: (error) => {
      Toast.show("oops! Failed to submit bug report", {
        style: { backgroundColor: "red" },
      });
    },
  });

  const handleSubmit = () => {
    submitBug();
  };

  const form = React.useMemo(
    (): DynamicForm => ({
      name: "Help us improve by reporting any issues you encounter.",
      description: "Please provide as much detail as possible.",
      grids: [
        {
          name: "Bug Report Form",
          gridItems: [
            {
              id: 1,
              fields: [
                {
                  label: "Bug Title",
                  variant: "text",
                  required: true,
                  placeholder: "Brief summary of the issue",
                  description: "Please provide a brief summary of the issue",
                  props: {
                    value: bugManager.title,
                    onChangeText: (value: string) =>
                      bugManager.set("title", value),
                  },
                },
              ],
            },
            {
              id: 2,
              fields: [
                {
                  label: "Description",
                  variant: "textarea",
                  required: true,
                  placeholder: "Detailed description of the bug",
                  description:
                    "Please provide a detailed description of the bug",
                  props: {
                    value: bugManager.description,
                    onChangeText: (value: string) =>
                      bugManager.set("description", value),
                  },
                },
              ],
            },
            {
              id: 3,
              fields: [
                {
                  label: "Category",
                  variant: "select",
                  required: true,
                  placeholder: "Select Bug Category",
                  description:
                    "Select the Bug Category you think you're looking for",
                  props: {
                    selectOptions: BUG_CATEGORIES.map((bug) => ({
                      label: splitCamelOrPascal(bug),
                      value: bug,
                    })),
                    value: bugManager.category,
                    onValueChange: (value: string | number | boolean) =>
                      bugManager.set("category", value as string),
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
    [bugManager]
  );
  return (
    <KeyboardAwareScrollView bounces={false}>
      <View className="flex flex-col mx-4 my-4 gap-2">
        {/* Header Section */}
        <View className="mx-auto">
          <IconWithTheme icon={bugIcon} size={52} />
        </View>
        <View>
          <Text className="font-extrabold">
            Help us improve by reporting any issues you encounter.
          </Text>
          <Text className="font-thin mt-2">
            Please provide as much detail as possible
          </Text>
        </View>

        <FormBuilder form={form} />

        <Button
          disabled={isBugCreationPending}
          className="w-full"
          onPress={handleSubmit}
        >
          <Text className="text-white dark:text-black">{isBugCreationPending ? "Submitting..." : "Submit Bug"}</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
