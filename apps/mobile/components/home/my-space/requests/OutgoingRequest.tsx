import React from "react";
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { StablePressable } from "@/components/shared/stables/StablePressable";
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
  FileText,
  User,
  Briefcase,
  ChevronRight,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { ActionSheetRef } from "react-native-actions-sheet";
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
  const actionSheetRef = React.useRef<ActionSheetRef>(null);
  const [openCancelModal, setOpenCancelModal] = React.useState(false);
  const clientUser = request.job?.postedBy;

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    actionSheetRef.current?.show();
  };

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
    size: { width: 84, height: 84 },
    className: "rounded-2xl w-full h-full",
  });

  const statusConfig = {
    [JobRequestStatus.Pending]: {
      icon: AlertCircle,
      dotColor: "bg-amber-500",
      label: "Pending",
    },
    [JobRequestStatus.Approved]: {
      icon: CheckCircle2,
      dotColor: "bg-emerald-500",
      label: "Accepted",
    },
    [JobRequestStatus.Rejected]: {
      icon: XCircle,
      dotColor: "bg-rose-500",
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
    <StablePressable
      onPress={navigateToRequestDetails}
      onLongPress={handleLongPress}
      className={cn("w-full p-2 py-2 flex flex-col gap-3.5", className)}
    >
      <ThreeDotsActionSheet
        ref={actionSheetRef}
        renderTrigger={false}
        options={threeDotsOptions}
      />
      {/* Main Section: Job Cover Thumbnail (84x84) with Floating Client Avatar + Right Info Column */}
      <View className="flex flex-row gap-3.5">
        {/* Left Thumbnail with Floating Client Avatar */}
        <View className="relative shrink-0">
          <View className="w-[84px] h-[84px] rounded-2xl overflow-hidden bg-muted/70 items-center justify-center border border-border/40 shadow-xs">
            {coverUploadId ? (
              coverJsx
            ) : (
              <View className="w-full h-full items-center justify-center bg-muted/60">
                <Icon
                  as={Briefcase}
                  size={22}
                  color={palette?.mutedForeground || "#9CA3AF"}
                  opacity={0.5}
                />
              </View>
            )}
          </View>

          {/* Floating Client Avatar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={navigateToClientProfile}
            className="absolute -bottom-1.5 -right-1.5 z-10"
          >
            <Avatar
              alt={identifyUser(clientUser)}
              style={{ width: 30, height: 30 }}
              className="border-2 border-background shadow-xs"
            >
              <AvatarImage source={clientPicture} />
              <AvatarFallback className="bg-muted">
                <Text
                  style={{ fontSize: 10 }}
                  className="font-extrabold text-foreground"
                >
                  {identifyUserAvatar(clientUser)}
                </Text>
              </AvatarFallback>
            </Avatar>
          </TouchableOpacity>
        </View>

        {/* Right Info Column */}
        <View className="flex-1 justify-center py-2">
          {/* Category Eyebrow & Status Dot + Chevron Right */}
          <View className="flex flex-row items-center justify-start gap-2">
            <View className="flex flex-row items-center gap-2 flex-1 min-w-0">
              <Text
                numberOfLines={1}
                className="text-[11px] font-extrabold uppercase tracking-wider text-primary shrink min-w-0"
              >
                {request.job?.category?.label ?? "Uncategorised"}
              </Text>

              <View className="flex flex-row items-center gap-1 shrink-0">
                <View
                  className={cn("w-2 h-2 rounded-full", currentStatus.dotColor)}
                />
                <Text className="text-[10px] font-bold text-muted-foreground">
                  {currentStatus.label}
                </Text>
              </View>
            </View>
            <View className="w-6 h-6 items-center justify-center -mr-1">
              <Icon
                as={ChevronRight}
                size={18}
                color={palette?.mutedForeground || "#9CA3AF"}
              />
            </View>
          </View>

          {/* Job Title */}
          <Text
            numberOfLines={2}
            className="text-lg font-extrabold leading-tight tracking-tight text-foreground mt-0.5"
          >
            {request.job?.title || "Untitled Job"}
          </Text>
        </View>
      </View>
    </StablePressable>
  );
};
