import React from "react";
import { View, TouchableOpacity, Pressable } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
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
  ArrowUpRight,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { ActionSheetRef } from "react-native-actions-sheet";
import { cn } from "@/lib/utils";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { useServerImages } from "@/hooks/content/useServerImages";
import { JobRequestStatus, ResponseJobRequestDto } from "@/types";
import { timeAgo } from "@/lib/dates.utils";
import { useColorPalette } from "@/hooks/useColorPalette";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/stables/StableAvatar";
import { ThreeDotsActionSheet } from "@/components/shared/ThreeDotsActionSheet";

interface OutgoingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
}

export const OutgoingRequestEntry = ({
  className,
  request,
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
    size: { width: 60, height: 60 },
    className: "rounded-full w-full h-full",
  });

  const statusConfig = {
    [JobRequestStatus.Pending]: {
      icon: AlertCircle,
      dotColor: "bg-amber-500",
      badgeBg: "bg-amber-500",
      label: "Pending",
    },
    [JobRequestStatus.Approved]: {
      icon: CheckCircle2,
      dotColor: "bg-emerald-500",
      badgeBg: "bg-emerald-500",
      label: "Accepted",
    },
    [JobRequestStatus.Rejected]: {
      icon: XCircle,
      dotColor: "bg-rose-500",
      badgeBg: "bg-rose-500",
      label: "Declined",
    },
  };

  const currentStatus =
    statusConfig[request.status] || statusConfig[JobRequestStatus.Pending];

  const navigateToRequestDetails = () => {
    if (request.id) {
      router.push({
        pathname: "/main/my-space/request-details",
        params: { id: request.id },
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
    <Pressable
      onPress={navigateToRequestDetails}
      onLongPress={handleLongPress}
      className={cn(
        "w-full p-2 py-2 flex flex-col active:opacity-50",
        className,
      )}
    >
      <ThreeDotsActionSheet
        ref={actionSheetRef}
        renderTrigger={false}
        options={threeDotsOptions}
      />
      {/* Main Section: Job Cover Thumbnail (76x76 Big Circle) + 2 Bigger Indicators at Bottom Right (Client Avatar + Outgoing Status Badge) */}
      <View className="flex flex-row items-center gap-5">
        {/* Left Thumbnail Container with 2 Floating Circles at Bottom Right */}
        <View className="relative shrink-0" style={{ width: 60, height: 60 }}>
          {/* Big Circle: Job First Picture */}
          <View 
            className="rounded-full overflow-hidden bg-muted/70 items-center justify-center border border-border/40 shadow-xs"
            style={{ width: 60, height: 60 }}
          >
            {coverUploadId ? (
              coverJsx
            ) : (
              <View className="w-full h-full items-center justify-center bg-muted/60">
                <Icon as={Briefcase} size={28} color={palette?.foreground} />
              </View>
            )}
          </View>

          {/* Bottom Right Cluster: Client Avatar & Status Indicator side-by-side with overlap */}
          <View
            style={{
              position: "absolute",
              bottom: -8,
              right: -8,
              zIndex: 10,
              flexDirection: "row",
            }}
          >
            {/* Circle 1: Client Profile Picture */}
            <TouchableOpacity
              onPress={() => {
                if (clientUser?.id) {
                  router.push({
                    pathname: "/main/explore/inspect-profile",
                    params: { id: clientUser.id },
                  });
                }
              }}
            >
              <Avatar
                alt={identifyUser(clientUser)}
                style={{ width: 36, height: 36 }}
                className="border-2 border-background shadow-md"
              >
                <AvatarImage source={clientPicture} />
                <AvatarFallback className="bg-muted">
                  <Text
                    style={{ fontSize: 11 }}
                    className="font-extrabold text-foreground"
                  >
                    {identifyUserAvatar(clientUser)}
                  </Text>
                </AvatarFallback>
              </Avatar>
            </TouchableOpacity>

            {/* Circle 2: Status & Direction Indicator */}
            <View
              className={cn(
                "rounded-full border-2 border-background shadow-md items-center justify-center",
                currentStatus.badgeBg,
              )}
              style={{ width: 36, height: 36, marginLeft: -12, zIndex: 20 }}
            >
              <Icon as={ArrowUpRight} size={18} color={palette?.foreground} />
            </View>
          </View>
        </View>

        {/* Right Info Column */}
        <View className="flex-1 justify-center gap-2">
          {/* Client Name */}
          <Text
            numberOfLines={1}
            className="text-base font-extrabold text-foreground tracking-tight"
          >
            {identifyUser(clientUser)}
          </Text>

          {/* Job Title */}
          <Text
            numberOfLines={1}
            className="text-[13px] font-semibold text-muted-foreground/80 leading-tight"
          >
            {request.job?.title || "Unknown Job"}
          </Text>

          {/* Time Sent & Status */}
          <View className="flex flex-row items-center gap-2 mt-1">
            <Text className="text-xs font-medium text-muted-foreground">
              {request.createdAt ? timeAgo(request.createdAt) : "Recently"}
            </Text>
          </View>
        </View>

        {/* Right Arrow Chevron (Centered Vertically) */}
        <Icon as={ChevronRight} size={18} color={palette?.foreground} />
      </View>
    </Pressable>
  );
};
