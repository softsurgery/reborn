import React from "react";
import { View, TouchableOpacity, Pressable } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Mail,
  FileText,
  User,
  Briefcase,
  ChevronRight,
  ArrowDownLeft,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { ActionSheetRef } from "react-native-actions-sheet";
import { cn } from "@/lib/utils";
import { identifyUser, identifyUserAvatar } from "@/lib/user.utils";
import { useServerImages } from "@/hooks/content/useServerImages";
import { timeAgo } from "@/lib/dates.utils";
import { JobRequestStatus, ResponseJobRequestDto } from "@/types";
import { useColorPalette } from "@/hooks/useColorPalette";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/stables/StableAvatar";
import { ThreeDotsActionSheet } from "@/components/shared/ThreeDotsActionSheet";
import { useJobRequestActions } from "@/hooks/content/job/useJobRequestActions";
import { ApproveJobRequestActionSheet } from "./details/action-sheets/ApproveJobRequestActionSheet";
import { DeclineJobRequestActionSheet } from "./details/action-sheets/DeclineJobRequestActionSheet";

interface IncomingRequestEntryProps {
  className?: string;
  request: ResponseJobRequestDto;
  embedded: boolean;
}

export const IncomingRequestEntry = ({
  className,
  request,
  embedded,
}: IncomingRequestEntryProps) => {
  const { palette } = useColorPalette();
  const actionSheetRef = React.useRef<ActionSheetRef>(null);
  const approveSheetRef = React.useRef<ActionSheetRef>(null);
  const rejectSheetRef = React.useRef<ActionSheetRef>(null);

  const {
    approveJobRequest,
    isApprovePending,
    rejectJobRequest,
    isRejectPending,
  } = useJobRequestActions({
    onSuccess: () => {
      approveSheetRef.current?.hide();
      rejectSheetRef.current?.hide();
    },
  });

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    actionSheetRef.current?.show();
  };

  // Candidate picture URL
  const {
    uploads: [candidatePicture],
  } = useServerImages({
    ids: [request.user?.pictureId],
    enabled: !!request.user?.pictureId,
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
      badgeBg: "bg-gray-500",
      label: "Pending",
    },
    [JobRequestStatus.Waitlist]: {
      icon: Clock,
      badgeBg: "bg-amber-500",
      label: "Waitlisted",
    },
    [JobRequestStatus.Approved]: {
      icon: CheckCircle2,
      badgeBg: "bg-emerald-500",
      label: "Accepted",
    },
    [JobRequestStatus.Rejected]: {
      icon: XCircle,
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

    if (
      request.status === JobRequestStatus.Pending ||
      request.status === JobRequestStatus.Waitlist
    ) {
      opts.push(
        {
          label: "Approve Candidate",
          icon: CheckCircle2,
          onPress: () => approveSheetRef.current?.show(),
        },
        {
          label: "Decline Application",
          icon: XCircle,
          variant: "destructive" as const,
          onPress: () => rejectSheetRef.current?.show(),
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
    <Pressable
      onPress={navigateToRequestDetails}
      onLongPress={handleLongPress}
      className={cn("w-full flex flex-col active:opacity-50", className)}
    >
      <ThreeDotsActionSheet
        ref={actionSheetRef}
        renderTrigger={false}
        options={threeDotsOptions}
      />
      {/* Main Section: Job Cover Thumbnail (76x76 Big Circle) + 2 Bigger Indicators at Bottom Right (Candidate Avatar + Incoming Status Badge) */}
      <View className="flex flex-row items-center gap-5">
        {/* Left Thumbnail Container */}
        {embedded ? (
          <View className="relative shrink-0" style={{ width: 60, height: 60 }}>
            {/* Big Circle: Candidate Profile Picture */}
            <View
              className="rounded-full overflow-hidden items-center justify-center"
              style={{ width: 60, height: 60 }}
            >
              <Avatar
                alt={identifyUser(request.user)}
                style={{ width: 60, height: 60 }}
                className="w-full h-full"
              >
                <AvatarImage source={candidatePicture} />
                <AvatarFallback className="bg-muted">
                  <Text
                    style={{ fontSize: 14 }}
                    className="font-bold text-xs text-foreground"
                  >
                    {identifyUserAvatar(request.user)}
                  </Text>
                </AvatarFallback>
              </Avatar>
            </View>

            {/* Bottom Right Cluster: Status Indicator Only */}
            <View
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                zIndex: 10,
                flexDirection: "row",
              }}
            >
              <View
                className={cn(
                  "rounded-full items-center justify-center",
                  currentStatus.badgeBg,
                )}
                style={{ width: 28, height: 28, zIndex: 20 }}
              >
                <Icon
                  as={ArrowDownLeft}
                  size={16}
                  color={palette?.primaryForeground}
                />
              </View>
            </View>
          </View>
        ) : (
          <View className="relative shrink-0" style={{ width: 60, height: 60 }}>
            {/* Big Circle: Job Picture */}
            <View
              className="rounded-full overflow-hidden items-center justify-center"
              style={{ width: 60, height: 60 }}
            >
              {coverUploadId ? (
                coverJsx
              ) : (
                <View className="w-full h-full items-center justify-center bg-muted/60">
                  <Icon
                    as={Briefcase}
                    size={20}
                    color={palette?.primaryForeground}
                  />
                </View>
              )}
            </View>

            {/* Bottom Right Cluster: Candidate Avatar & Status Indicator */}
            <View
              style={{
                position: "absolute",
                bottom: -8,
                right: -8,
                zIndex: 10,
                flexDirection: "row",
              }}
            >
              {/* Circle 1: Candidate Profile Picture */}
              <TouchableOpacity
                onPress={() => {
                  if (request.userId) {
                    router.push({
                      pathname: "/main/explore/inspect-profile",
                      params: { id: request.userId },
                    });
                  }
                }}
              >
                <Avatar
                  alt={identifyUser(request.user)}
                  style={{ width: 28, height: 28 }}
                >
                  <AvatarImage source={candidatePicture} />
                  <AvatarFallback className="bg-muted">
                    <Text className="font-bold text-xs text-foreground">
                      {identifyUserAvatar(request.user)}
                    </Text>
                  </AvatarFallback>
                </Avatar>
              </TouchableOpacity>

              {/* Circle 2: Status & Direction Indicator */}
              <View
                className={cn(
                  "rounded-full shadow-md items-center justify-center",
                  currentStatus.badgeBg,
                )}
                style={{ width: 28, height: 28, marginLeft: -8, zIndex: 20 }}
              >
                <Icon
                  as={ArrowDownLeft}
                  size={16}
                  color={palette?.primaryForeground}
                />
              </View>
            </View>
          </View>
        )}

        {/* Right Info Column */}
        <View className="flex-1 justify-center gap-1">
          {/* Candidate Name */}
          <Text
            numberOfLines={1}
            className="text-base font-medium text-foreground tracking-tight"
          >
            {identifyUser(request.user)}
          </Text>

          {/* Job Title */}
          {!embedded && (
            <Text
              numberOfLines={2}
              className="text-sm text-muted-foreground leading-tight"
            >
              {request.job?.title || "Unknown Job"}
            </Text>
          )}

          {/* Time Sent & Status */}
          <View className="flex flex-row items-center gap-2 mt-1">
            <Text className="text-xs font-medium text-muted-foreground">
              {request.createdAt ? timeAgo(request.createdAt) : "Recently"}
            </Text>
          </View>
        </View>

        {/* Right Arrow Chevron (Centered Vertically) */}
        <Icon as={ChevronRight} size={18} color={palette?.primaryForeground} />
      </View>

      <ApproveJobRequestActionSheet
        ref={approveSheetRef}
        request={request}
        onConfirm={() => approveJobRequest(request.id)}
        onClose={() => approveSheetRef.current?.hide()}
        isPending={isApprovePending}
      />

      <DeclineJobRequestActionSheet
        ref={rejectSheetRef}
        request={request}
        onConfirm={() => rejectJobRequest(request.id)}
        onClose={() => rejectSheetRef.current?.hide()}
        isPending={isRejectPending}
      />
    </Pressable>
  );
};
