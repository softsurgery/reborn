import React from "react";
import { format } from "date-fns";
import { router } from "expo-router";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  CopyCheck,
  CopyX,
  Check,
  X,
  User,
  Clock,
} from "lucide-react-native";
import { cn } from "~/lib/utils";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { useServerImage } from "~/hooks/content/useServerImage";
import { useJobRequestActions } from "~/hooks/content/job/useJobRequestActions";
import { JobRequestStatus, ResponseJobRequestDto } from "~/types";
import { Icon } from "~/components/ui/icon";

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
  const { jsx: profilePictureBlock } = useServerImage({
    id: request.user?.profile?.pictureId!,
    fallback: identifyUserAvatar(request.user),
    size: { width: 60, height: 60 },
  });

  const statusConfig = {
    [JobRequestStatus.Pending]: {
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      label: "Pending",
    },
    [JobRequestStatus.Approved]: {
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      label: "Approved",
    },
    [JobRequestStatus.Rejected]: {
      icon: XCircle,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      label: "Rejected",
    },
  };

  const currentStatus =
    statusConfig[request.status] || statusConfig[JobRequestStatus.Pending];

  return (
    <View
      className={cn(
        "flex flex-col bg-background border border-border rounded-xl overflow-hidden shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <View className="flex flex-row items-start justify-between p-4 pb-2 border-b border-border/50">
        <View className="flex-1 pr-3">
          <Text
            variant={"h3"}
            className="text-lg font-semibold leading-tight mb-2"
          >
            {request.job?.title}
          </Text>
          <View
            className={cn(
              "flex flex-row items-center gap-1.5 self-start px-2.5 py-1 rounded-full",
              currentStatus.bgColor,
            )}
          >
            <Icon
              as={currentStatus.icon}
              size={14}
              className={currentStatus.color}
            />
            <Text className={cn("text-xs font-medium", currentStatus.color)}>
              {currentStatus.label}
            </Text>
          </View>
        </View>

        {/* Candidate Profile */}
        <StablePressable
          className="w-16 h-16 rounded-full overflow-hidden border-2 border-border"
          onPressClassname="opacity-70"
          onPress={() => {
            router.push({
              pathname: "/main/explore/inspect-profile",
              params: {
                id: request.userId,
              },
            });
          }}
        >
          {profilePictureBlock}
        </StablePressable>
      </View>

      {/* Details */}
      <View className="flex flex-col gap-2.5 p-4 bg-muted/30">
        {/* Candidate Info */}
        <View className="flex flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
            <Icon as={User} size={14} className="text-primary" />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted-foreground mb-0.5">
              Candidate
            </Text>
            <Text className="text-sm font-medium">
              {identifyUser(request.user)}
            </Text>
          </View>
        </View>

        {/* Requested At */}
        <View className="flex flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
            <Icon as={Clock} size={14} className="text-primary" />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted-foreground mb-0.5">
              Requested
            </Text>
            <Text className="text-sm font-medium">
              {request.createdAt
                ? format(request.createdAt, "MMM dd, yyyy 'at' hh:mm a")
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      {request.status === JobRequestStatus.Pending ? (
        <IncomingPendingActionBlock
          request={request}
          refetchRequests={refetchRequests}
        />
      ) : request.status === JobRequestStatus.Approved ? (
        <IncomingApprovedActionBlock
          request={request}
          refetchRequests={refetchRequests}
        />
      ) : (
        <View />
      )}
    </View>
  );
};

/* ------------------------------ ACTION BLOCKS ------------------------------ */

const IncomingPendingActionBlock = ({
  className,
  request,
  refetchRequests,
}: IncomingRequestEntryProps) => {
  const [openApprove, setOpenApprove] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);
  const { approveJobRequest, rejectJobRequest } = useJobRequestActions({
    onSuccess: () => {
      refetchRequests();
      setOpenApprove(false);
      setOpenReject(false);
    },
  });

  return (
    <React.Fragment>
      <View
        className={cn(
          "flex flex-row items-center justify-center mb-4 px-3 gap-2",
          className,
        )}
      >
        <Button
          size="sm"
          className="flex flex-row flex-1 items-center gap-2"
          onPress={() => setOpenApprove(true)}
        >
          <Icon as={Check} size={24} className="text-primary-foreground" />
          <Text>Approve</Text>
        </Button>
        <Button
          size="sm"
          variant={"secondary"}
          className="flex flex-row flex-1 items-center gap-2"
          onPress={() => setOpenReject(true)}
        >
          <Icon as={X} size={24} className="text-primary-foreground" />
          <Text>Reject</Text>
        </Button>
      </View>

      {/* Approve */}
      <Dialog open={openApprove} onOpenChange={(v) => setOpenApprove(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <View className="flex flex-row items-center gap-2">
                <Icon as={CopyCheck} size={20} />
                <Text variant={"large"}>Approve Application</Text>
              </View>
            </DialogTitle>
            <DialogDescription>
              <View>
                <Text>
                  Are you sure you want to approve this candidate? They’ll be
                  notified and can message you afterwards.
                </Text>
                <View className="flex flex-row items-center gap-2 mt-4">
                  <Button
                    size="sm"
                    className="flex flex-row flex-1 items-center gap-2"
                    onPress={() => approveJobRequest(request.id)}
                  >
                    <Text className="text-base font-semibold">Confirm</Text>
                  </Button>
                  <Button
                    size="sm"
                    className="flex flex-row flex-1 items-center gap-2"
                    variant={"outline"}
                    onPress={() => setOpenApprove(false)}
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </View>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Reject */}
      <Dialog open={openReject} onOpenChange={(v) => setOpenReject(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <View className="flex flex-row items-center gap-2">
                <Icon as={CopyX} size={20} />
                <Text variant={"large"}>Reject Application</Text>
              </View>
            </DialogTitle>
            <DialogDescription>
              <View>
                <Text>
                  Are you sure you want to reject this application? The
                  candidate will be notified and removed from your list.
                </Text>
                <View className="flex flex-row items-center gap-2 mt-4">
                  <Button
                    size="sm"
                    className="flex flex-row flex-1 items-center gap-2"
                    onPress={() => rejectJobRequest(request.id)}
                  >
                    <Text className="text-base font-semibold">Confirm</Text>
                  </Button>
                  <Button
                    size="sm"
                    className="flex flex-row flex-1 items-center gap-2"
                    variant={"outline"}
                    onPress={() => setOpenReject(false)}
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </View>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

const IncomingApprovedActionBlock = ({
  className,
}: IncomingRequestEntryProps) => {
  return (
    <View
      className={cn(
        "flex flex-row items-center justify-center mb-4 px-3 gap-2",
        className,
      )}
    >
      <Button
        size="sm"
        className="flex flex-row flex-1 items-center gap-2"
        variant={"outline"}
        onPress={() => router.push("/main/(tabs)/chat")}
      >
        <Icon as={Mail} size={14} className="text-primary-foreground" />
        <Text>Send Message</Text>
      </Button>
    </View>
  );
};
