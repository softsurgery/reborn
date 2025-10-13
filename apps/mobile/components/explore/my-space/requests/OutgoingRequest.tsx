import React from "react";
import { format } from "date-fns";
import { useNavigation } from "expo-router";
import { View } from "react-native";
import { StablePressable } from "~/components/shared/StablePressable";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { identifyUser, identifyUserAvatar } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { JobRequestStatus, ResponseJobRequestDto } from "~/types";
import { NavigationProps } from "~/types/app.routes";
import { useServerImage } from "~/hooks/content/useServerImage";
import Icon from "~/lib/Icon";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CopyX,
  Mail,
  Search,
  User,
  XCircle,
} from "lucide-react-native";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useJobRequestActions } from "~/hooks/content/job/useJobRequestActions";

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
        "flex flex-col bg-card border border-border rounded-xl overflow-hidden shadow-sm",
        className
      )}
    >
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
              currentStatus.bgColor
            )}
          >
            <Icon
              name={currentStatus.icon}
              size={14}
              className={currentStatus.color}
            />
            <Text className={cn("text-xs font-medium", currentStatus.color)}>
              {currentStatus.label}
            </Text>
          </View>
        </View>
        <StablePressable
          className="w-16 h-16 rounded-full overflow-hidden border-2 border-border"
          onPressClassname="opacity-70"
          onPress={() => {
            navigation.navigate("explore/user-profile", {
              id: request.job?.postedBy.id,
            });
          }}
        >
          {profilePictureBlock}
        </StablePressable>
      </View>

      <View className="flex flex-col gap-2.5 p-4 bg-muted/30">
        {/* Client info */}
        <View className="flex flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
            <Icon name={User} size={14} className="text-primary" />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted-foreground mb-0.5">Client</Text>
            <Text className="text-sm font-medium">
              {identifyUser(request.job?.postedBy)}
            </Text>
          </View>
        </View>

        {/* Requested at */}
        <View className="flex flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
            <Icon name={Clock} size={14} className="text-primary" />
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
        <View className="p-4" />
      )}
    </View>
  );
};

export const PendingActionBlock = ({
  className,
  request,
  refetchRequests,
}: OutgoingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();
  const [open, setOpen] = React.useState(false);
  const { cancelJobRequest, isCancelPending } = useJobRequestActions({
    onSuccess: () => {
      refetchRequests();
      setOpen(false);
    },
  });

  return (
    <React.Fragment>
      <View
        className={cn(
          "flex flex-row items-center justify-center mb-4 px-3 gap-2",
          className
        )}
      >
        <Button
          size={"sm"}
          className="flex flex-row flex-1 items-center gap-2"
          onPress={() => {
            navigation.navigate("explore/job-details", {
              id: request.job?.id,
              uploads:
                request.job?.uploads?.map((upload) => upload.uploadId) ?? [],
            });
          }}
        >
          <Icon name={Search} size={14} className="text-primary-foreground" />
          <Text>View Details</Text>
        </Button>
        <Button
          size={"sm"}
          variant={"secondary"}
          className="flex flex-row flex-1 items-center gap-2"
          onPress={() => setOpen(true)}
        >
          <Text>Cancel Request</Text>
        </Button>
      </View>
      <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
        <DialogContent className="">
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
                    onPress={() => cancelJobRequest(request.id)}
                    className="flex flex-row flex-1 items-center gap-2"
                    size="sm"
                    disabled={isCancelPending}
                  >
                    <Text className="text-base font-semibold">Confirm</Text>
                  </Button>
                  <Button
                    className="flex flex-row flex-1 items-center gap-2"
                    size="sm"
                    variant={"outline"}
                    onPress={() => setOpen(false)}
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

const ApprovedActionBlock = ({
  className,
  request,
  refetchRequests,
}: OutgoingRequestEntryProps) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <React.Fragment>
      <View
        className={cn(
          "flex flex-row items-center justify-center mb-4 px-3 gap-2",
          className
        )}
      >
        <Button
          size={"sm"}
          className="flex flex-row flex-1 items-center gap-2"
          onPress={() => {
            navigation.navigate("explore/job-details", {
              id: request.job?.id,
              uploads:
                request.job?.uploads?.map((upload) => upload.uploadId) ?? [],
            });
          }}
        >
          <Icon name={Search} size={14} className="text-primary-foreground" />
          <Text>View Details</Text>
        </Button>
        <Button
          size={"sm"}
          className="flex flex-row flex-1 items-center gap-2"
          variant={"outline"}
          onPress={() =>
            navigation.navigate("index", {
              defaultTab: "messages",
              reset: true,
            })
          }
        >
          <Icon name={Mail} size={14} className="text-primary-foreground" />
          <Text>Send Message</Text>
        </Button>
      </View>
    </React.Fragment>
  );
};
