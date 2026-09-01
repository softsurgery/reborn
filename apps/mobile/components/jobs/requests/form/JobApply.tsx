import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { ApplicationHeader } from "@/components/shared/AppHeader";
import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/shared/lotties/Loader";
import { toast } from "sonner-native";
import * as Haptics from "expo-haptics";
import { BottomButtonWrapper } from "@/components/shared/BottomButtonBlockWrapper";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useJobApplyFormStructure } from "./useJobApplyFormStructure";
import { useJobApplyStore } from "@/hooks/stores/useJobApplyStore";
import { StableKeyboardAwareScrollView } from "@/components/shared/stables/StableKeyboardAwareScrollView";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { cn } from "@/lib/utils";
import { RequestJobEntry } from "../details/RequestJobEntry";

interface JobApplyProps {
  className?: string;
  id: string;
}

export const JobApply = ({ className, id }: JobApplyProps) => {
  const store = useJobApplyStore();
  const isKeyboardVisible = useKeyboardVisible();

  React.useEffect(() => {
    return () => {
      store.reset();
    };
  }, []);

  const { data: job, isPending: isJobPending } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.job.findById(id, ["currency"].join(",")),
    enabled: !!id,
  });

  React.useEffect(() => {
    if (
      job?.price !== undefined &&
      store.createDto.proposedPrice === undefined
    ) {
      store.setNested("createDto.proposedPrice", job.price);
    }
  }, [job?.price]);

  const { structure } = useJobApplyFormStructure({
    store,
    job: job,
  });

  const { mutate: sendRequest, isPending: isSendRequestPending } = useMutation({
    mutationFn: () =>
      api.jobRequest.create({
        jobId: id,
        message: store.createDto.message?.trim() || undefined,
        proposedPrice: store.createDto.proposedPrice,
      }),
    onSuccess: () => {
      toast.success("Application sent successfully");
      router.back();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send request");
    },
  });

  if (isJobPending) {
    return <Loader className="flex-1 justify-center items-center" />;
  }

  if (!job) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Job not found</Text>
        <Button onPress={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      <ApplicationHeader
        classNames={{
          wrapper: "border-b border-border pb-2",
        }}
        title="Apply for Job"
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />
      <StableKeyboardAwareScrollView className="flex-1 bg-background">
        <RequestJobEntry job={job} className="px-4" />
        <FormBuilder structure={structure} className="px-2" />
      </StableKeyboardAwareScrollView>
      {!isKeyboardVisible && (
        <BottomButtonWrapper>
          <Button
            size="lg"
            variant="default"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              sendRequest();
            }}
            disabled={isSendRequestPending}
            className="w-full flex flex-row items-center justify-center gap-2 rounded-xl h-12"
          >
            <Text className="text-md font-bold text-primary-foreground">
              {isSendRequestPending ? "Sending..." : "Send Application"}
            </Text>
          </Button>
        </BottomButtonWrapper>
      )}
    </StableSafeAreaView>
  );
};
