import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { ApplicationHeader } from "@reborn/mobile-components";
import { AppHeaderBack } from "@reborn/mobile-components";
import { StableSafeAreaView } from "@reborn/mobile-components";
import { Text } from "@reborn/mobile-ui";
import { Button } from "@reborn/mobile-ui";
import { Loader } from "@reborn/mobile-components";
import * as Haptics from "expo-haptics";
import { BottomButtonWrapper } from "@reborn/mobile-components";
import { FormBuilder } from "@reborn/mobile-form-builder";
import { useJobRequestUpdateFormStructure } from "./useJobRequestUpdateFormStructure";
import { useJobRequestUpdateStore } from "@/hooks/stores/useJobRequestUpdateStore";
import { useKeyboardVisible } from "@reborn/mobile-components";
import { cn } from "@reborn/lib";
import { RequestJobEntry } from "../details/RequestJobEntry";
import { useJobRequestActions } from "@/hooks/content/job/useJobRequestActions";
import { StableKeyboardAwareScrollView } from "@reborn/mobile-components";

interface JobRequestUpdateProps {
  className?: string;
  id: string;
}

export const JobRequestUpdate = ({ className, id }: JobRequestUpdateProps) => {
  const store = useJobRequestUpdateStore();
  const isKeyboardVisible = useKeyboardVisible();
  const [priceType, setPriceType] = React.useState<"less" | "greater">("less");
  const { updateJobRequest, isUpdatePending } = useJobRequestActions({
    onSuccess: () => router.back(),
  });

  const { data: request, isPending: isRequestPending } = useQuery({
    queryKey: ["job-request", id],
    queryFn: () =>
      api.jobRequest.findById(
        Number(id),
        ["job", "job.uploads", "job.category", "job.currency"].join(","),
      ),
    enabled: !!id,
  });

  React.useEffect(() => {
    return () => {
      store.reset();
    };
  }, []);

  React.useEffect(() => {
    if (
      request &&
      store.updateDto.proposedPrice === undefined &&
      store.updateDto.message === undefined
    ) {
      if (request.proposedPrice)
        store.setNested("updateDto.proposedPrice", request.proposedPrice);
      if (request.message)
        store.setNested("updateDto.message", request.message);

      if (
        request.proposedPrice &&
        request.job?.price &&
        Number(request.proposedPrice) > Number(request.job.price)
      ) {
        setPriceType("greater");
      }
    }
  }, [request]);

  const { structure } = useJobRequestUpdateFormStructure({
    store,
    job: request?.job,
    priceType,
    setPriceType,
  });

  if (isRequestPending) {
    return <Loader className="flex-1 justify-center items-center" />;
  }

  if (!request?.job) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Request not found</Text>
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
        title="Update Application"
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
        <RequestJobEntry job={request.job} className="px-4" />
        <FormBuilder structure={structure} className="px-2" />
      </StableKeyboardAwareScrollView>
      {!isKeyboardVisible && (
        <BottomButtonWrapper>
          <Button
            size="lg"
            variant="default"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              updateJobRequest({
                id: Number(id),
                updateDto: {
                  message: store.updateDto.message?.trim() || undefined,
                  proposedPrice: request.job?.negotiablePrice === false ? Number(request.job.price) : store.updateDto.proposedPrice,
                },
              });
            }}
            disabled={isUpdatePending}
            className="w-full flex flex-row items-center justify-center gap-2 rounded-xl h-12"
          >
            <Text className="text-md font-bold text-primary-foreground">
              {isUpdatePending ? "Updating..." : "Update Application"}
            </Text>
          </Button>
        </BottomButtonWrapper>
      )}
    </StableSafeAreaView>
  );
};
