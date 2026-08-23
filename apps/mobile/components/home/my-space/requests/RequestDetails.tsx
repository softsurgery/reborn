import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useJobRequest } from "@/hooks/content/job/useJobRequest";
import { format } from "date-fns";
import {
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Mail,
  Check,
  X,
  Briefcase,
  UserCheck,
  CopyX,
  ExternalLink,
  ChevronRight,
} from "lucide-react-native";
import { ApplicationHeader } from "@/components/shared/AppHeader";
import { BottomButtonWrapper } from "@/components/shared/BottomButtonBlockWrapper";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { StablePressable } from "@/components/shared/stables/StablePressable";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/stables/StableAvatar";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { useServerImages } from "@/hooks/content/useServerImages";
import { useJobRequestActions } from "@/hooks/content/job/useJobRequestActions";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import {
  JobPricingType,
  JobRequestStatus,
  ResponseJobDto,
  ResponseJobRequestDto,
} from "@/types";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/dates.utils";
import { ImageSource } from "expo-image";

interface RequestDetailsProps {
  id: string;
}

const DEFAULT_CURRENCY = "TND";

const formatPrice = (job?: ResponseJobDto) => {
  if (!job || job.price === undefined || job.price === null) return null;
  const currencyExtras = job.currency?.extras as
    | { code?: string; symbol?: string }
    | undefined;
  const code =
    currencyExtras?.symbol ||
    currencyExtras?.code ||
    job.currency?.label ||
    DEFAULT_CURRENCY;
  const pricingType = job.pricingType === JobPricingType.HOURLY ? "/hr" : "";
  return `${job.price} ${code}${pricingType}`;
};

export const RequestDetails = ({ id }: RequestDetailsProps) => {
  const { currentUser } = useCurrentUser();

  const {
    request,
    isRequestPending: isPending,
    isRequestError: isError,
    refetchRequest: refetch,
  } = useJobRequest({ id });

  const isIncoming = React.useMemo(() => {
    if (!request || !currentUser) return true;
    return request.userId !== currentUser.id;
  }, [request, currentUser]);

  const counterpartyUser = isIncoming ? request?.user : request?.job?.postedBy;

  // Counterparty avatar
  const {
    uploads: [counterpartyPicture],
  } = useServerImages({
    ids: [counterpartyUser?.pictureId],
    enabled: !!counterpartyUser?.pictureId,
  });

  // Job cover image
  const orderedUploads = React.useMemo(
    () => request?.job?.uploads?.slice().sort((a, b) => a.order - b.order),
    [request?.job?.uploads],
  );
  const coverUploadId = orderedUploads?.[0]?.uploadId;
  const {
    jsxArray: [coverJsx],
  } = useServerImages({
    ids: [coverUploadId],
    enabled: !!coverUploadId,
    size: { width: 100, height: 100 },
    className: "rounded-xl",
  });

  if (isPending) {
    return (
      <StableSafeAreaView className="flex-1 bg-background">
        <ApplicationHeader
          classNames={{
            wrapper: "border-b border-border/60 pb-2.5 bg-background",
          }}
          title={`Request #${id}`}
          reverse
          shortcuts={[
            { key: "back", icon: ChevronLeft, onPress: () => router.back() },
          ]}
        />
        <View className="p-4 gap-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </View>
      </StableSafeAreaView>
    );
  }

  if (isError || !request) {
    return (
      <StableSafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <Text className="text-lg font-bold text-foreground mb-2">
          Request Not Found
        </Text>
        <Text className="text-xs text-muted-foreground text-center mb-4">
          The requested job application could not be loaded or was removed.
        </Text>
        <Button onPress={() => router.back()} size="sm">
          Go Back
        </Button>
      </StableSafeAreaView>
    );
  }

  const statusConfig = {
    [JobRequestStatus.Pending]: {
      icon: AlertCircle,
      badgeStyle:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      cardBg: "bg-amber-500/5 border-amber-500/20",
      label: isIncoming
        ? "Pending Candidate Review"
        : "Pending Client Response",
      description: isIncoming
        ? "Review the candidate application below and approve to start working together."
        : "Your application is waiting for the client to review.",
    },
    [JobRequestStatus.Approved]: {
      icon: CheckCircle2,
      badgeStyle:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      cardBg: "bg-emerald-500/5 border-emerald-500/20",
      label: isIncoming
        ? "Application Accepted"
        : "Congratulations! Application Accepted",
      description: "You are now connected and can message each other directly.",
    },
    [JobRequestStatus.Rejected]: {
      icon: XCircle,
      badgeStyle:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
      cardBg: "bg-rose-500/5 border-rose-500/20",
      label: "Application Declined",
      description: "This job application was declined.",
    },
  };

  const currentStatus =
    statusConfig[request.status] || statusConfig[JobRequestStatus.Pending];
  const priceDisplay = formatPrice(request.job);

  const navigateToJobDetails = () => {
    if (request.job?.id) {
      router.push({
        pathname: "/main/explore/job-details",
        params: {
          id: request.job.id,
          uploads: JSON.stringify(
            (request.job.uploads ?? []).map((u) => u.uploadId),
          ),
        },
      });
    }
  };

  const navigateToCounterpartyProfile = () => {
    if (counterpartyUser?.id) {
      router.push({
        pathname: "/main/explore/inspect-profile",
        params: { id: counterpartyUser.id },
      });
    }
  };

  return (
    <StableSafeAreaView className="flex-1 bg-background">
      <ApplicationHeader
        classNames={{
          wrapper: "border-b border-border/60 pb-2.5 bg-background",
        }}
        title={`Request #${request.id}`}
        titleVariant="large"
        reverse
        shortcuts={[
          { key: "back", icon: ChevronLeft, onPress: () => router.back() },
        ]}
      />

      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card Banner */}
        <View
          className={cn(
            "p-4 rounded-2xl border flex flex-col gap-2 mb-4",
            currentStatus.cardBg,
          )}
        >
          <View className="flex flex-row items-center justify-between">
            <Badge
              variant="outline"
              className={cn("gap-1.5 px-3 py-1", currentStatus.badgeStyle)}
            >
              <Icon
                as={currentStatus.icon}
                size={14}
                className="currentColor"
              />
              <Text className="text-xs font-bold currentColor">
                {currentStatus.label}
              </Text>
            </Badge>

            <Text className="text-xs text-muted-foreground font-medium">
              {request.createdAt ? timeAgo(request.createdAt) : "Recently"}
            </Text>
          </View>

          <Text className="text-xs text-muted-foreground leading-relaxed mt-1">
            {currentStatus.description}
          </Text>

          {request.createdAt && (
            <Text className="text-[11px] text-muted-foreground/80 mt-1">
              Submitted:{" "}
              {format(new Date(request.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
            </Text>
          )}
        </View>

        {/* Counterparty Profile Banner */}
        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
          {isIncoming ? "Applicant Candidate" : "Job Client"}
        </Text>

        <StablePressable
          className="flex flex-row items-center justify-between p-3.5 bg-muted/30 rounded-xl border border-border/50 mb-5 active:opacity-80"
          onPress={navigateToCounterpartyProfile}
        >
          <View className="flex flex-row items-center gap-3 flex-1">
            <Avatar
              alt={identifyUser(counterpartyUser)}
              style={{ width: 44, height: 44 }}
            >
              <AvatarImage source={counterpartyPicture as ImageSource} />
              <AvatarFallback>
                <Text className="font-bold text-sm">
                  {identifyUserAvatar(counterpartyUser)}
                </Text>
              </AvatarFallback>
            </Avatar>

            <View className="flex-1">
              <View className="flex flex-row items-center gap-2">
                <Text
                  className="text-sm font-bold text-foreground"
                  numberOfLines={1}
                >
                  {identifyUser(counterpartyUser)}
                </Text>
                <Badge
                  variant="secondary"
                  className="px-1.5 py-0 bg-primary/10"
                >
                  <Text className="text-[10px] font-semibold text-primary">
                    {isIncoming ? "Candidate" : "Client"}
                  </Text>
                </Badge>
              </View>

              {counterpartyUser?.email && (
                <Text
                  className="text-xs text-muted-foreground mt-0.5"
                  numberOfLines={1}
                >
                  {counterpartyUser.email}
                </Text>
              )}
            </View>
          </View>

          <View className="flex flex-row items-center gap-1">
            <Text className="text-xs font-semibold text-primary">
              View Profile
            </Text>
            <Icon as={ChevronRight} size={16} className="text-primary" />
          </View>
        </StablePressable>

        {/* Job Specs Card */}
        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
          Job Specifications
        </Text>

        <View className="p-4 bg-card border border-border/70 rounded-2xl flex flex-col gap-3 mb-6">
          <View className="flex flex-row gap-3">
            {coverUploadId ? (
              <View className="w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border/40 items-center justify-center shrink-0">
                {coverJsx}
              </View>
            ) : (
              <View className="w-20 h-20 rounded-xl bg-primary/10 items-center justify-center border border-primary/20 shrink-0">
                <Icon as={Briefcase} size={28} className="text-primary" />
              </View>
            )}

            <View className="flex-1 justify-between">
              <Text className="text-xs font-bold uppercase tracking-widest text-primary">
                {request.job?.category?.label ?? "Uncategorised"}
              </Text>

              <Text
                className="text-base font-bold leading-tight text-foreground"
                numberOfLines={2}
              >
                {request.job?.title || "Untitled Job"}
              </Text>

              {priceDisplay && (
                <Text className="text-base font-bold text-foreground mt-1">
                  {priceDisplay}
                </Text>
              )}
            </View>
          </View>

          {/* Job Badges Row */}
          <View className="flex flex-row items-center flex-wrap gap-2 pt-2 border-t border-border/40">
            {request.job?.style && (
              <Badge
                variant="outline"
                className="gap-1 px-2.5 py-0.5 border-border/60"
              >
                <Icon
                  as={Briefcase}
                  size={12}
                  className="text-muted-foreground"
                />
                <Text className="text-xs text-muted-foreground">
                  {request.job.style}
                </Text>
              </Badge>
            )}

            {request.job?.difficulty && (
              <Badge
                variant="outline"
                className="gap-1 px-2.5 py-0.5 border-border/60"
              >
                <Text className="text-xs text-muted-foreground">
                  {request.job.difficulty}
                </Text>
              </Badge>
            )}
          </View>

          {/* Full Job Description */}
          {request.job?.description ? (
            <View className="pt-2 border-t border-border/40 gap-1">
              <Text className="text-xs font-bold text-foreground">
                Description
              </Text>
              <Text className="text-xs text-muted-foreground leading-relaxed">
                {request.job.description}
              </Text>
            </View>
          ) : null}

          {/* View Full Job Button */}
          <Button
            size="sm"
            variant="outline"
            className="flex flex-row items-center justify-center gap-2 rounded-xl mt-1"
            onPress={navigateToJobDetails}
          >
            <Icon as={ExternalLink} size={14} className="text-foreground" />
            <Text className="text-xs font-semibold">View Full Job Listing</Text>
          </Button>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Footer */}
      <BottomButtonWrapper>
        {request.status === JobRequestStatus.Pending ? (
          isIncoming ? (
            <IncomingDetailsActionBlock request={request} refetch={refetch} />
          ) : (
            <OutgoingDetailsActionBlock request={request} refetch={refetch} />
          )
        ) : request.status === JobRequestStatus.Approved ? (
          <Button
            size="sm"
            className="flex flex-row flex-1 items-center justify-center gap-2 rounded-xl"
            onPress={() => router.push("/main/(tabs)/chat")}
          >
            <Icon as={Mail} size={16} className="text-primary-foreground" />
            <Text className="font-semibold">Send Direct Message</Text>
          </Button>
        ) : (
          <Text className="text-xs text-muted-foreground text-center w-full py-1">
            This job application has been declined.
          </Text>
        )}
      </BottomButtonWrapper>
    </StableSafeAreaView>
  );
};

/* ------------------------------ ACTION BLOCKS ------------------------------ */

const IncomingDetailsActionBlock = ({
  request,
  refetch,
}: {
  request: ResponseJobRequestDto;
  refetch: () => void;
}) => {
  const [openApprove, setOpenApprove] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);

  const {
    approveJobRequest,
    isApprovePending,
    rejectJobRequest,
    isRejectPending,
  } = useJobRequestActions({
    onSuccess: () => {
      refetch();
      setOpenApprove(false);
      setOpenReject(false);
    },
  });

  return (
    <React.Fragment>
      <View className="flex flex-row items-center justify-between gap-3">
        <Button
          size="sm"
          className="flex flex-row flex-1 items-center justify-center gap-2 rounded-xl"
          onPress={() => setOpenApprove(true)}
          disabled={isApprovePending || isRejectPending}
        >
          {isApprovePending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Icon as={Check} size={16} className="text-primary-foreground" />
          )}
          <Text className="font-semibold">Approve Candidate</Text>
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="flex flex-row flex-1 items-center justify-center gap-2 rounded-xl border-destructive/40"
          onPress={() => setOpenReject(true)}
          disabled={isApprovePending || isRejectPending}
        >
          {isRejectPending ? (
            <ActivityIndicator size="small" />
          ) : (
            <Icon as={X} size={16} className="text-destructive" />
          )}
          <Text className="font-semibold text-destructive">Decline</Text>
        </Button>
      </View>

      {/* Approve Modal */}
      <Dialog open={openApprove} onOpenChange={setOpenApprove}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              <View className="flex flex-row items-center gap-2">
                <Icon as={UserCheck} size={20} className="text-primary" />
                <Text variant="large" className="font-bold">
                  Approve Candidate
                </Text>
              </View>
            </DialogTitle>
            <DialogDescription>
              <View className="pt-2 gap-4">
                <Text className="text-muted-foreground leading-relaxed">
                  Are you sure you want to accept{" "}
                  <Text className="font-semibold text-foreground">
                    {identifyUser(request.user)}
                  </Text>{" "}
                  for{" "}
                  <Text className="font-semibold text-foreground">
                    {request.job?.title}
                  </Text>
                  ?
                </Text>
                <View className="flex flex-row items-center gap-3">
                  <Button
                    size="sm"
                    className="flex flex-1 items-center justify-center rounded-xl"
                    onPress={() => approveJobRequest(request.id)}
                    disabled={isApprovePending}
                  >
                    {isApprovePending ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text className="font-semibold">Confirm Approval</Text>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex flex-1 items-center justify-center rounded-xl"
                    onPress={() => setOpenApprove(false)}
                    disabled={isApprovePending}
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </View>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={openReject} onOpenChange={setOpenReject}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              <View className="flex flex-row items-center gap-2">
                <Icon as={CopyX} size={20} className="text-destructive" />
                <Text variant="large" className="font-bold">
                  Decline Application
                </Text>
              </View>
            </DialogTitle>
            <DialogDescription>
              <View className="pt-2 gap-4">
                <Text className="text-muted-foreground leading-relaxed">
                  Are you sure you want to decline this candidate?
                </Text>
                <View className="flex flex-row items-center gap-3">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex flex-1 items-center justify-center rounded-xl"
                    onPress={() => rejectJobRequest(request.id)}
                    disabled={isRejectPending}
                  >
                    {isRejectPending ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text className="font-semibold text-destructive-foreground">
                        Confirm Decline
                      </Text>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex flex-1 items-center justify-center rounded-xl"
                    onPress={() => setOpenReject(false)}
                    disabled={isRejectPending}
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

const OutgoingDetailsActionBlock = ({
  request,
  refetch,
}: {
  request: ResponseJobRequestDto;
  refetch: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const { cancelJobRequest, isCancelPending } = useJobRequestActions({
    onSuccess: () => {
      refetch();
      setOpen(false);
    },
  });

  return (
    <React.Fragment>
      <Button
        size="sm"
        variant="outline"
        className="w-full flex flex-row items-center justify-center gap-2 rounded-xl border-destructive/40"
        onPress={() => setOpen(true)}
        disabled={isCancelPending}
      >
        {isCancelPending ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text className="font-semibold text-destructive">
            Withdraw Application
          </Text>
        )}
      </Button>

      {/* Cancel Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              <View className="flex flex-row items-center gap-2">
                <Icon as={CopyX} size={20} className="text-destructive" />
                <Text variant="large" className="font-bold">
                  Withdraw Application
                </Text>
              </View>
            </DialogTitle>
            <DialogDescription>
              <View className="pt-2 gap-4">
                <Text className="text-muted-foreground leading-relaxed">
                  Are you sure you want to withdraw your application for{" "}
                  <Text className="font-semibold text-foreground">
                    {request.job?.title}
                  </Text>
                  ?
                </Text>
                <View className="flex flex-row items-center gap-3">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex flex-1 items-center justify-center rounded-xl"
                    onPress={() => cancelJobRequest(request.id)}
                    disabled={isCancelPending}
                  >
                    {isCancelPending ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text className="font-semibold text-destructive-foreground">
                        Confirm Withdraw
                      </Text>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex flex-1 items-center justify-center rounded-xl"
                    onPress={() => setOpen(false)}
                    disabled={isCancelPending}
                  >
                    <Text>Keep Active</Text>
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
