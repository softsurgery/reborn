import React from "react";
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
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
  AlertCircle,
  CheckCircle2,
  CopyX,
  Mail,
  XCircle,
  ImageOff,
  FileText,
  User,
  Briefcase,
} from "lucide-react-native";
import { cn } from "@/lib/utils";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { useServerImages } from "@/hooks/content/useServerImages";
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
import { ImageSource } from "expo-image";

interface OutgoingRequestEntryProps {
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

export const OutgoingRequestEntry = ({
  className,
  request,
  refetchRequests,
}: OutgoingRequestEntryProps) => {
  const { palette } = useColorPalette();
  const [openCancelModal, setOpenCancelModal] = React.useState(false);
  const clientUser = request.job?.postedBy;

  // Client picture URL
  const {
    uploads: [clientPicture],
  } = useServerImages({
    ids: [clientUser?.pictureId],
    enabled: !!clientUser?.pictureId,
  });

  // Job cover upload image
  const orderedUploads = React.useMemo(
    () => request.job?.uploads?.slice().sort((a, b) => a.order - b.order),
    [request.job?.uploads],
  );
  const coverUploadId = orderedUploads?.[0]?.uploadId;
  const {
    jsxArray: [coverJsx],
  } = useServerImages({
    ids: [coverUploadId],
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

  const navigateToClientProfile = (e?: any) => {
    e?.stopPropagation?.();
    if (clientUser?.id) {
      router.push({
        pathname: "/main/explore/inspect-profile",
        params: { id: clientUser.id },
      });
    }
  };

  const threeDotsOptions = React.useMemo(() => {
    const opts = [];

    if (request.status === JobRequestStatus.Pending) {
      opts.push({
        label: "Withdraw Application",
        icon: CopyX,
        variant: "destructive" as const,
        onPress: () => setOpenCancelModal(true),
      });
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
        label: "Inspect Client Profile",
        icon: User,
        onPress: () => {
          if (clientUser?.id) {
            router.push({
              pathname: "/main/explore/inspect-profile",
              params: { id: clientUser.id },
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
  }, [request, clientUser]);

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
              color={palette?.mutedForeground}
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

      {/* Bottom Footer Row: Counterparty Client Info & Quick Action Button */}
      <View className="flex flex-row items-center justify-between pt-1 mt-0.5">
        {/* Counterparty Client Info */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={navigateToClientProfile}
          className="flex flex-row items-center gap-2 flex-1 pr-2"
        >
          <Avatar
            alt={identifyUser(clientUser)}
            style={{ width: 22, height: 22 }}
          >
            <AvatarImage source={clientPicture as ImageSource} />
            <AvatarFallback>
              <Text style={{ fontSize: 9 }} className="font-semibold">
                {identifyUserAvatar(clientUser)}
              </Text>
            </AvatarFallback>
          </Avatar>

          <Text
            numberOfLines={1}
            className="text-xs font-semibold text-foreground flex-shrink"
          >
            {identifyUser(clientUser)}
          </Text>

          <Badge variant="secondary" className="px-1 py-0 bg-muted">
            <Text className="text-[9px] font-medium text-muted-foreground">
              Client
            </Text>
          </Badge>

          <Text className="text-xs text-muted-foreground">
            · {request.createdAt ? timeAgo(request.createdAt) : "Recently"}
          </Text>
        </TouchableOpacity>

        {/* Action Button */}
        {request.status === JobRequestStatus.Pending ? (
          <PendingActionBlock
            request={request}
            refetchRequests={refetchRequests}
            openCancelModal={openCancelModal}
            setOpenCancelModal={setOpenCancelModal}
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

interface PendingActionBlockProps extends OutgoingRequestEntryProps {
  openCancelModal?: boolean;
  setOpenCancelModal?: (open: boolean) => void;
}

export const PendingActionBlock = ({
  request,
  refetchRequests,
  openCancelModal,
  setOpenCancelModal,
}: PendingActionBlockProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = openCancelModal !== undefined ? openCancelModal : internalOpen;
  const setOpen = setOpenCancelModal || setInternalOpen;

  const { cancelJobRequest, isCancelPending } = useJobRequestActions({
    onSuccess: () => {
      refetchRequests?.();
      setOpen(false);
    },
  });

  return (
    <React.Fragment>
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2.5 rounded-lg border-destructive/40 text-destructive"
        onPress={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        disabled={isCancelPending}
      >
        {isCancelPending ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text className="text-xs font-semibold text-destructive">Cancel</Text>
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
