import { format } from "date-fns";
import { useNavigation } from "expo-router";
import { Check, CopyCheck, CopyX, Mail, X } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { useJobRequestActions } from "~/hooks/content/job/useJobRequestActions";
import { useServerImage } from "~/hooks/content/useServerImage";
import Icon from "~/lib/Icon";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { JobRequestStatus, ResponseJobRequestDto } from "~/types";
import { NavigationProps } from "~/types/app.routes";

interface IncomingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
  refetchRequests: () => void;
}

export const IncomingRequestEntry = ({
  className,
  request,
  refetchRequests,
}: IncomingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();

  const { jsx: profilePictureBlock } = useServerImage({
    id: request.user?.profile.pictureId!,
    fallback: identifyUserAvatar(request.user),
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
        {/* Requested by */}
        <View className="flex flex-row items-center gap-1">
          <Text>Candidat</Text>
          <Text className="font-thin">{identifyUser(request.user)}</Text>
        </View>
        {/* Requested At */}
        <View className="flex flex-row items-center gap-1">
          <Text>Requested at</Text>
          <Text className="text-muted-foreground font-thin">
            {request.createdAt
              ? format(request.createdAt, "hh:mm - dd MMMM yyyy")
              : ""}
          </Text>
        </View>
        {/* Status */}
        <View className="flex flex-row items-center gap-1">
          <Text>Status</Text>
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
        {request.status === JobRequestStatus.Pending ? (
          <PendingActionBlock
            request={request}
            refetchRequests={refetchRequests}
          />
        ) : request.status === JobRequestStatus.Approved ? (
          <ApprovedActionBlock
            request={request}
            refetchRequests={refetchRequests}
          />
        ) : (
          // <RejectedActionBlock />
          <View></View>
        )}
      </View>
      {/* Client Profile Picture */}
      <StablePressable
        className="w-1/4"
        onPressClassname="opacity-50"
        onPress={() => {
          navigation.navigate("explore/user-profile", {
            id: request.userId,
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
}: IncomingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();
  const [openApprove, setOpenApprove] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);
  const { approveJobRequest, rejectJobRequest } = useJobRequestActions({
    onSuccess: () => {
      refetchRequests();
      setOpenApprove(false);
    },
  });

  return (
    <View className={cn("flex flex-row items-center gap-2 mt-4", className)}>
      <Dialog
        open={openApprove}
        onOpenChange={(value) => setOpenApprove(value)}
      >
        <DialogTrigger asChild>
          <Button size={"sm"} className="flex-row items-center gap-2">
            <Icon name={Check} size={14} />
            <Text>Approve</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw]">
          <DialogHeader>
            <DialogTitle>
              <View className="flex flex-row items-center gap-2">
                <Icon name={CopyCheck} size={20} />
                <Text variant={"large"}>Approve Application</Text>
              </View>
            </DialogTitle>
            <DialogDescription>
              <View>
                <Text>
                  Are you sure you want to approve your application? The client
                  will be notified, and you'll be able to chat after the
                  application is approved.
                </Text>
                <View className="flex flex-row items-center gap-2 mt-4">
                  <Button
                    className="w-1/2"
                    size="sm"
                    onPress={() => {
                      approveJobRequest(request.id);
                    }}
                  >
                    <Text className="text-base font-semibold">Confirm</Text>
                  </Button>
                  <Button
                    className="w-1/2"
                    size="sm"
                    variant={"outline"}
                    onPress={() => {
                      setOpenApprove(false);
                    }}
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </View>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={openReject} onOpenChange={(value) => setOpenReject(value)}>
        <DialogTrigger asChild>
          <Button
            size={"sm"}
            variant={"outline"}
            className="flex-row items-center gap-2"
          >
            <Icon name={X} size={14} />
            <Text>Reject</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw]">
          <DialogHeader>
            <DialogTitle>
              <View className="flex flex-row items-center gap-2">
                <Icon name={CopyX} size={20} />
                <Text variant={"large"}>Reject Application</Text>
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
                    className="w-1/2"
                    size="sm"
                    onPress={() => {
                      rejectJobRequest(request.id);
                    }}
                  >
                    <Text className="text-base font-semibold">Confirm</Text>
                  </Button>
                  <Button
                    className="w-1/2"
                    size="sm"
                    variant={"outline"}
                    onPress={() => {
                      setOpenReject(false);
                    }}
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

const ApprovedActionBlock = ({
  className,
  request,
  refetchRequests,
}: IncomingRequestEntryProps) => {
  return (
    <View className={cn("flex flex-row items-center gap-2 mt-4", className)}>
      <Button
        size={"sm"}
        className="flex-row items-center gap-2"
        variant={"outline"}
      >
        <Icon name={Mail} size={14} className="text-primary-foreground" />
        <Text>Send Message</Text>
      </Button>
    </View>
  );
};
