import React from "react";
import { useMutation } from "@tanstack/react-query";
import { BugIcon } from "lucide-react-native";
import { api } from "~/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useReportBugStore } from "~/hooks/stores/useReportBugStore";
import Icon from "~/lib/Icon";
import { View } from "react-native";
import { useBugReportFormStructure } from "./useBugReportFormStructure";
import { FormBuilder } from "~/components/shared/form-builder/FormBuilder";
import { createBugSchema } from "~/types/validations/system-reports.validation";
import { cn } from "~/lib/utils";
import { showToastable } from "react-native-toastable";
import { useNavigation } from "~/hooks/useNavigation";
import { StableKeyboardAwareScrollView } from "~/components/shared/KeyboardAwareScrollView";

interface BugReportPortalProps {
  className?: string;
}

export const BugReportPortal = ({ className }: BugReportPortalProps) => {
  const navigation = useNavigation();
  React.useEffect(() => {
    return () => {
      bugStore.reset();
    };
  }, []);

  const bugStore = useReportBugStore();
  const { bugFormStructure } = useBugReportFormStructure({ store: bugStore });

  const { mutate: reportBug, isPending: isReportBugPending } = useMutation({
    mutationFn: async () => api.bug.create(bugStore.createDto),
    onSuccess: () => {
      showToastable({
        message: "Bug reported successfully",
        status: "success",
      });
      navigation.goBack();
      bugStore.reset();
    },
    onError: (error) => {
      showToastable({
        message: "oops! Failed to submit bug report",
        status: "danger",
      });
    },
  });

  const handleSubmit = () => {
    const result = createBugSchema.safeParse(bugStore.createDto);
    if (!result.success) {
      bugStore.set("errors", result.error.flatten().fieldErrors);
    } else {
      reportBug();
    }
  };

  return (
    <StableKeyboardAwareScrollView>
      <View className={cn("flex flex-col mx-4 my-4 gap-2", className)}>
        {/* Header Section */}
        <View className="mx-auto">
          <Icon name={BugIcon} />
        </View>
        <View>
          <Text className="font-extrabold">
            Help us improve by reporting any issues you encounter.
          </Text>
          <Text className="font-thin mt-2">
            Please provide as much detail as possible
          </Text>
        </View>
        <FormBuilder structure={bugFormStructure} />
        <Button
          disabled={isReportBugPending}
          className="w-full"
          onPress={handleSubmit}
        >
          <Text>{isReportBugPending ? "Submitting..." : "Submit Bug"}</Text>
        </Button>
      </View>
    </StableKeyboardAwareScrollView>
  );
};
