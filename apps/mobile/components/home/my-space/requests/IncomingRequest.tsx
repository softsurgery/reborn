import React from "react";
import { ActivityIndicator, View, TouchableOpacity, Pressable } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  CopyX,
  Check,
  X,
  ImageOff,
  UserCheck,
  FileText,
  User,
  Briefcase,
} from "lucide-react-native";
import { cn } from "@/lib/utils";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { useServerImage } from "@/hooks/content/useServerImage";
import { useJobRequestActions } from "@/hooks/content/job/useJobRequestActions";
import {
  JobPricingType,
  JobRequestStatus,
  ResponseJobRequestDto,
  ResponseJobDto,
} from "@/types";
import { timeAgo } from "@/lib/dates.utils";
import { useColorPalette } from "@/hooks/useColorPalette";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/stables/StableAvatar";
import { ThreeDotsActionSheet } from "@/components/shared/ThreeDotsActionSheet";

interface IncomingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
  refetchRequests?: () => void;
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

export const IncomingRequestEntry = ({
  className,
  request,
  refetchRequests,
}: IncomingRequestEntryProps) => {
  const { palette } = useColorPalette();
  const [openApproveModal, setOpenApproveModal] = React.useState(false);
  const [openRejectModal, setOpenRejectModal] = React.useState(false);

  // Candidate picture URL
  const { upload: candidatePicture } = useServerImage({
    id: request.user?.pictureId,
    enabled: !!request.user?.pictureId,
  });

  // Job cover upload image
  const orderedUploads = React.useMemo(
    () => request.job?.uploads?.slice().sort((a, b) => a.order - b.order),
    [request.job?.uploads],
  );
  const coverUploadId = orderedUploads?.[0]?.uploadId;
  const { jsx: coverJsx } = useServerImage({
    id: coverUploadId,
    enabled: !!coverUploadId,
    size: { width: 72, height: 72 },
    className: "rounded-xl",
  });

  const statusConfig = {
    [JobRequestStatus.Pending]: {
      icon: AlertCircle,
      badgeStyle:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
      label: "Pending",
    },
    [JobRequestStatus.Approved]: {
      icon: CheckCircle2,
      badgeStyle:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
      label: "Accepted",
    },
    [JobRequestStatus.Rejected]: {
      icon: XCircle,
      badgeStyle:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
      label: "Declined",
    },
  };

  const currentStatus =
    statusConfig[request.status] || statusConfig[JobRequestStatus.Pending];
  const priceDisplay = formatPrice(request.job);

  const navigateToRequestDetails = () => {
    if (request.id) {
      router.push({
        pathname: "/main/my-space/request-details",
        params: { id: request.id },
      });
    }
  };

  const navigateToCandidateProfile = (e?: any) => {
    e?.stopPropagation?.();
    if (request.userId) {
      router.push({
        pathname: "/main/explore/inspect-profile",
        params: { id: request.userId },
      });
    }
  };

  const threeDotsOptions = React.useMemo(() => {
    const opts = [];

    if (request.status === JobRequestStatus.Pending) {
      opts.push(
        {
          label: "Approve Candidate",
          icon: CheckCircle2,
          onPress: () => setOpenApproveModal(true),
        },
        {
          label: "Decline Application",
          icon: XCircle,
          variant: "destructive" as const,
          onPress: () => setOpenRejectModal(true),
        },
      );
    } else if (request.status === JobRequestStatus.Approved) {
      opts.push({
        label: "Send Message",
        icon: Mail,
        onPress: () => router.push("/main/(tabs)/chat"),
      });
    }

    opts.push(
      {
        label: "Request Specifications",
        icon: FileText,
        onPress: navigateToRequestDetails,
      },
      {
        label: "Inspect Candidate Profile",
        icon: User,
        onPress: () => {
          if (request.userId) {
            router.push({
              pathname: "/main/explore/inspect-profile",
              params: { id: request.userId },
            });
          }
        },
      },
      {
        label: "View Full Job Listing",
        icon: Briefcase,
        onPress: () => {
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
        },
      },
    );

    return opts;
  }, [request]);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={navigateToRequestDetails}
      className={cn(
        "w-full py-3 px-1 border-b border-border/40 flex flex-col gap-2",
        className,
      )}
    >
      {/* Top Section: Cover Thumbnail + Job Details Column */}
      <View className="flex flex-row gap-3">
        {/* Left Thumbnail (matching JobCard 72x72) */}
        <View className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-muted items-center justify-center shrink-0">
          {coverUploadId ? (
            coverJsx
          ) : (
            <ImageOff
              size={18}
              color={palette?.mutedForeground || "#9CA3AF"}
              opacity={0.4}
            />
          )}
        </View>

        {/* Right Info Column */}
        <View className="flex-1 justify-between">
          {/* Category & Status Header + Action Menu */}
          <View className="flex flex-row items-center justify-between gap-2">
            <Text
              numberOfLines={1}
              className="text-[10px] font-bold uppercase tracking-widest text-primary flex-1"
            >
              {request.job?.category?.label ?? "Uncategorised"}
            </Text>

            <View className="flex flex-row items-center gap-1.5">
              <Badge
                variant="outline"
                className={cn(
                  "gap-1 px-2 py-0.5 border-0",
                  currentStatus.badgeStyle,
                )}
              >
                <Icon
                  as={currentStatus.icon}
                  size={10}
                  className="currentColor"
                />
                <Text className="text-[10px] font-semibold currentColor">
                  {currentStatus.label}
                </Text>
              </Badge>

              <Pressable onPress={(e: any) => e?.stopPropagation?.()}>
                <ThreeDotsActionSheet options={threeDotsOptions} size={16} />
              </Pressable>
            </View>
          </View>

          {/* Job Title */}
          <Text
            numberOfLines={2}
            className="text-sm font-semibold leading-4 tracking-tight text-foreground"
          >
            {request.job?.title || "Untitled Job"}
          </Text>

          {/* Price & Job Style */}
          <View className="flex flex-row items-center gap-2 mt-1">
            {priceDisplay && (
              <Text className="text-sm font-bold text-foreground">
                {priceDisplay}
              </Text>
            )}

            {request.job?.style && (
              <Badge variant="secondary" className="px-1.5 py-0 bg-muted">
                <Text className="text-[10px] font-medium text-muted-foreground">
                  {request.job.style}
                </Text>
              </Badge>
            )}
          </View>
        </View>
      </View>

      {/* Bottom Footer Row: Counterparty Candidate Info & Quick Action Button */}
      <View className="flex flex-row items-center justify-between pt-1 mt-0.5">
        {/* Counterparty Candidate Info */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={navigateToCandidateProfile}
          className="flex flex-row items-center gap-2 flex-1 pr-2"
        >
          <Avatar
            alt={identifyUser(request.user)}
            style={{ width: 22, height: 22 }}
          >
            <AvatarImage source={{ uri: candidatePicture ?? "" }} />
            <AvatarFallback>
              <Text style={{ fontSize: 9 }} className="font-semibold">
                {identifyUserAvatar(request.user)}
              </Text>
            </AvatarFallback>
          </Avatar>

          <Text
            numberOfLines={1}
            className="text-xs font-semibold text-foreground flex-shrink"
          >
            {identifyUser(request.user)}
          </Text>

          <Badge variant="secondary" className="px-1 py-0 bg-primary/10">
            <Text className="text-[9px] font-semibold text-primary">
              Candidate
            </Text>
          </Badge>

          <Text className="text-xs text-muted-foreground">
            · {request.createdAt ? timeAgo(request.createdAt) : "Recently"}
          </Text>
        </TouchableOpacity>

        {/* Action Button */}
        {request.status === JobRequestStatus.Pending ? (
          <IncomingPendingActionBlock
            request={request}
            refetchRequests={refetchRequests}
            openApproveModal={openApproveModal}
            setOpenApproveModal={setOpenApproveModal}
            openRejectModal={openRejectModal}
            setOpenRejectModal={setOpenRejectModal}
          />
        ) : request.status === JobRequestStatus.Approved ? (
          <Button
            size="sm"
            className="h-7 px-3 rounded-lg flex flex-row items-center gap-1.5"
            onPress={(e) => {
              e.stopPropagation();
              router.push("/main/(tabs)/chat");
            }}
          >
            <Icon as={Mail} size={12} className="text-primary-foreground" />
            <Text className="text-xs font-semibold">Message</Text>
          </Button>
        ) : (
          <Text className="text-[11px] font-medium text-muted-foreground">
            Declined
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

/* ------------------------------ ACTION BLOCKS ------------------------------ */

interface IncomingPendingActionBlockProps extends IncomingRequestEntryProps {
  openApproveModal?: boolean;
  setOpenApproveModal?: (open: boolean) => void;
  openRejectModal?: boolean;
  setOpenRejectModal?: (open: boolean) => void;
}

const IncomingPendingActionBlock = ({
  request,
  refetchRequests,
  openApproveModal,
  setOpenApproveModal,
  openRejectModal,
  setOpenRejectModal,
}: IncomingPendingActionBlockProps) => {
  const [internalApprove, setInternalApprove] = React.useState(false);
  const [internalReject, setInternalReject] = React.useState(false);

  const openApprove = openApproveModal !== undefined ? openApproveModal : internalApprove;
  const setOpenApprove = setOpenApproveModal || setInternalApprove;

  const openReject = openRejectModal !== undefined ? openRejectModal : internalReject;
  const setOpenReject = setOpenRejectModal || setInternalReject;

  const {
    approveJobRequest,
    isApprovePending,
    rejectJobRequest,
    isRejectPending,
  } = useJobRequestActions({
    onSuccess: () => {
      refetchRequests?.();
      setOpenApprove(false);
      setOpenReject(false);
    },
  });

  return (
    <React.Fragment>
      <View className="flex flex-row items-center gap-1.5">
        <Button
          size="sm"
          className="h-7 px-2.5 rounded-lg flex flex-row items-center gap-1"
          onPress={(e) => {
            e.stopPropagation();
            setOpenApprove(true);
          }}
          disabled={isApprovePending || isRejectPending}
        >
          {isApprovePending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Icon as={Check} size={12} className="text-primary-foreground" />
          )}
          <Text className="text-xs font-semibold">Approve</Text>
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 rounded-lg border-destructive/40"
          onPress={(e) => {
            e.stopPropagation();
            setOpenReject(true);
          }}
          disabled={isApprovePending || isRejectPending}
        >
          {isRejectPending ? (
            <ActivityIndicator size="small" />
          ) : (
            <Icon as={X} size={12} className="text-destructive" />
          )}
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
                  Are you sure you want to decline this application?
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
