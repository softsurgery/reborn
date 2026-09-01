import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  View,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { useJobRequest } from "@/hooks/content/job/useJobRequest";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  LucideIcon,
} from "lucide-react-native";
import { ApplicationHeader } from "@/components/shared/AppHeader";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import { JobRequestStatus } from "@/types";
import { cn } from "@/lib/utils";
import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { RequestBanner } from "./RequestBanner";
import { RequestUserEntry } from "./RequestUserEntry";
import { RequestJobEntry } from "./RequestJobEntry";
import { RequestApplicationDetails } from "./RequestApplicationDetails";
import { RequestDecisions } from "./RequestDecisions";

export interface RequestStatus {
  icon: LucideIcon;
  badgeStyle: string;
  cardBg: string;
  iconBg: string;
  label: string;
  description: string;
}

interface RequestDetailsProps {
  className?: string;
  id: string;
}

export const RequestDetails = ({ className, id }: RequestDetailsProps) => {
  const { currentUser } = useCurrentUser();

  const {
    request,
    isRequestPending: isPending,
    isRequestError: isError,
    refetchRequest: refetch,
    isRequestRefetching,
  } = useJobRequest({ id });

  const isIncoming = React.useMemo(() => {
    if (!request || !currentUser) return true;
    return request.userId !== currentUser.id;
  }, [request, currentUser]);

  const counterpartyUser = isIncoming ? request?.user : request?.job?.postedBy;

  if (isPending) {
    return <ActivityIndicator className="flex-1" size="large" />;
  }

  if (isError || !request) {
    return (
      <StableSafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <View className="w-16 h-16 rounded-full bg-destructive/10 items-center justify-center mb-4">
          <Icon as={AlertCircle} size={32} className="text-destructive" />
        </View>
        <Text className="text-xl font-extrabold text-foreground mb-2 text-center">
          Request Not Found
        </Text>
        <Text className="text-xs text-muted-foreground text-center mb-6 max-w-[260px] leading-relaxed">
          The requested job application could not be loaded or was removed.
        </Text>
        <Button
          onPress={() => router.back()}
          size="sm"
          className="rounded-xl px-6"
        >
          <Text className="font-semibold">Go Back</Text>
        </Button>
      </StableSafeAreaView>
    );
  }

  const statusConfig: Record<JobRequestStatus, RequestStatus> = {
    [JobRequestStatus.Pending]: {
      icon: AlertCircle,
      badgeStyle:
        "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30",
      cardBg: "bg-gray-500/5 border-gray-500/20 dark:bg-gray-500/10",
      iconBg: "bg-gray-500/15 text-gray-600 dark:text-gray-400",
      label: isIncoming
        ? "Pending Candidate Review"
        : "Pending Client Response",
      description: isIncoming
        ? "Review the candidate application details below and accept to start working together."
        : "Your application has been submitted and is awaiting client review.",
    },
    [JobRequestStatus.Waitlist]: {
      icon: Clock,
      badgeStyle:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      cardBg: "bg-amber-500/5 border-amber-500/20 dark:bg-amber-500/10",
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      label: isIncoming ? "Waitlisted Candidate" : "You're on the Waitlist",
      description: isIncoming
        ? "This candidate has been waitlisted."
        : "Your application has been put on the waitlist.",
    },
    [JobRequestStatus.Approved]: {
      icon: CheckCircle2,
      badgeStyle:
        "bg-emerald-500/10 text-emerald-600 dark:emerald-400 border-emerald-500/30",
      cardBg: "bg-emerald-500/5 border-emerald-500/20 dark:bg-emerald-500/10",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      label: isIncoming ? "Application Accepted" : "Application Accepted! 🎉",
      description:
        "You are connected! You can now send direct messages and coordinate work.",
    },
    [JobRequestStatus.Rejected]: {
      icon: XCircle,
      badgeStyle:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
      cardBg: "bg-rose-500/5 border-rose-500/20 dark:bg-rose-500/10",
      iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
      label: "Application Declined",
      description: "This job application was declined.",
    },
  };

  const currentStatus =
    statusConfig[request.status] || statusConfig[JobRequestStatus.Pending];

  return (
    <StableSafeAreaView className={cn("flex-1 bg-card", className)}>
      {/* Header */}
      <ApplicationHeader
        classNames={{
          wrapper: "border-b border-border pb-2",
        }}
        title={`Request for ${request.job?.title}`}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            render: <AppHeaderBack />,
          },
        ]}
      />

      <ScrollView
        className="flex flex-col flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRequestRefetching}
            onRefresh={refetch}
          />
        }
      >
        <View className="pb-8">
          <RequestBanner
            className="mb-5"
            status={currentStatus}
            request={request}
          />

          <RequestJobEntry className="px-4" job={request.job} />

          <RequestUserEntry
            className="px-4"
            user={counterpartyUser}
            isIncoming={isIncoming}
          />

          {/* Application Details */}
          <RequestApplicationDetails className="px-4" request={request} />

          {/* Decisions Block */}
          <RequestDecisions
            className="px-4 mt-4"
            request={request}
            isIncoming={isIncoming}
            refetch={refetch}
          />
        </View>
      </ScrollView>
    </StableSafeAreaView>
  );
};
