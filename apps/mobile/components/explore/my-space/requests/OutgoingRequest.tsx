import React from "react";
import { format } from "date-fns";
import { useNavigation } from "expo-router";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import {
  JobRequestStatus,
  ResponseJobRequestDto,
  ServerErrorResponse,
} from "~/types";
import { NavigationProps } from "~/types/app.routes";
import { useServerImage } from "~/hooks/content/useServerImage";
import Icon from "~/lib/Icon";
import { CopyX, Search } from "lucide-react-native";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { showToastable } from "react-native-toastable";
import { api } from "~/api";

interface OutgoingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
  refetchRequests: () => void;
}

export const OutgoingRequestEntry = ({
  className,
  request,
  refetchRequests,
}: OutgoingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();
  const { jsx: profilePictureBlock } = useServerImage({
    id: request.job?.postedBy?.profile?.pictureId!,
    fallback: identifyUserAvatar(request.job?.postedBy),
    size: { width: 80, height: 80 },
  });

  return (
    <View
      className={cn(
        "flex flex-row items-center justify-between p-4 m border border-border rounded-lg",
        className
      )}
    >
      <View className="flex flex-1 w-full">
        <Text variant={"lead"} className="my-1">
          {request.job?.title}
        </Text>
        {/* Client */}
        <View className="flex flex-row items-center gap-1">
          <Text>Client:</Text>
          <Text className="font-thin">
            {identifyUser(request.job?.postedBy)}
          </Text>
        </View>
        {/* Requested At */}
        <View className="flex flex-row items-center gap-1">
          <Text>Requested at:</Text>
          <Text className="text-muted-foreground font-thin">
            {request.createdAt
              ? format(request.createdAt, "hh:mm dd MMMM yyyy")
              : ""}
          </Text>
        </View>
        {/* Status */}
        <View className="flex flex-row items-center gap-1">
          <Text>Status:</Text>
          <Text
            className={cn(
              "text-sm font-medium",
              request.status === JobRequestStatus.Approved
                ? "text-green-500"
                : request.status === JobRequestStatus.Rejected
                ? "text-red-500"
                : request.status === JobRequestStatus.Pending
                ? "text-secondary-foreground"
                : ""
            )}
          >
            {request.status === JobRequestStatus.Pending
              ? "Pending"
              : request.status === JobRequestStatus.Approved
              ? "Approved"
              : "Rejected"}
          </Text>
        </View>
        {/* Actions */}
        {request.status === JobRequestStatus.Pending && (
          <PendingActionBlock
            request={request}
            refetchRequests={refetchRequests}
          />
        )}
      </View>
      {/* Client Profile */}
      <StablePressable
        className="w-1/4"
        onPressClassname="opacity-50"
        onPress={() => {
          navigation.navigate("explore/user-profile", {
            id: request.job?.postedById,
          });
        }}
      >
        {profilePictureBlock}
      </StablePressable>
    </View>
  );
};

export const PendingActionBlock = ({
  className,
  request,
  refetchRequests,
}: OutgoingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const { mutate: cancelRequest, isPending: isCancelRequestPending } =
    useMutation({
      mutationFn: () => api.jobRequest.cancel(request.id),
      onSuccess: () => {
        refetchRequests();
        setCancelDialogOpen(false);
      },
      onError: (error: ServerErrorResponse) => {
        showToastable({
          message: error.response?.data.message,
          status: "danger",
        });
      },
    });
  return (
    <View className={cn("flex flex-row items-center gap-2 mt-4", className)}>
      <Button
        size={"sm"}
        variant={"secondary"}
        className="flex-row items-center gap-2"
        onPress={() => {
          navigation.navigate("explore/job-details", {
            id: request.job?.id,
            uploads:
              request.job?.uploads?.map((upload) => upload.uploadId) ?? [],
          });
        }}
      >
        <Icon name={Search} size={14} className="text-secondary-foreground" />
        <Text>View Details</Text>
      </Button>
      <Dialog
        open={cancelDialogOpen}
        onOpenChange={(value) => setCancelDialogOpen(value)}
      >
        <DialogTrigger asChild>
          <Button size={"sm"} variant={"outline"}>
            <Text>Cancel Request</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw]">
          <DialogHeader>
            <DialogTitle>
              <View className="flex flex-row items-center gap-2">
                <Icon name={CopyX} size={24} />
                <Text variant={"large"}>Cancel Application</Text>
              </View>
            </DialogTitle>
            <DialogDescription>
              <View>
                <Text>
                  Are you sure you want to cancel your application? The client
                  will no longer see you as a candidate.
                </Text>
                <View className="flex flex-row items-center gap-2 mt-4">
                  <Button
                    onPress={() => cancelRequest()}
                    className="w-1/2"
                    size="sm"
                    disabled={isCancelRequestPending}
                  >
                    <Text className="text-base font-semibold">Confirm</Text>
                  </Button>
                  <Button
                    className="w-1/2"
                    size="sm"
                    variant={"outline"}
                    onPress={() => setCancelDialogOpen(false)}
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </View>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </View>
  );
};
