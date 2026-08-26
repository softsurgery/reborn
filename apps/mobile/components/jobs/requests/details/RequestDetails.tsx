import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { type ActionSheetRef } from "react-native-actions-sheet";
import { useJobRequest } from "@/hooks/content/job/useJobRequest";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Mail,
  Check,
  X,
  LucideIcon,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { ApplicationHeader } from "@/components/shared/AppHeader";
import { BottomButtonWrapper } from "@/components/shared/BottomButtonBlockWrapper";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useJobRequestActions } from "@/hooks/content/job/useJobRequestActions";
import { useCurrentUser } from "@/hooks/content/user/useCurrentUser";
import {
  JobPricingType,
  JobRequestStatus,
  ResponseJobDto,
  ResponseJobRequestDto,
} from "@/types";
import { cn } from "@/lib/utils";
import { useColorPalette } from "@/hooks/useColorPalette";
import { ApproveJobRequestActionSheet } from "./ApproveJobRequestActionSheet";
import { DeclineJobRequestActionSheet } from "./DeclineJobRequestActionSheet";
import { WithdrawJobRequestActionSheet } from "./WithdrawJobRequestActionSheet";
import { AppHeaderBack } from "@/components/shared/AppHeaderBack";
import { RequestBanner } from "./RequestBanner";
import { RequestUserEntry } from "./RequestUserEntry";
import { RequestJobEntry } from "./RequestJobEntry";

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

const DEFAULT_CURRENCY = "TND";

const formatPrice = (job?: ResponseJobDto) => {
  if (!job || job.price === undefined || job.price === null) return null;
  const currencyExtras = job.currency?.extras;
  const code =
    currencyExtras?.symbol ||
    currencyExtras?.code ||
    job.currency?.label ||
    DEFAULT_CURRENCY;
  const pricingType = job.pricingType === JobPricingType.HOURLY ? "/hr" : "";
  return `${job.price} ${code}${pricingType}`;
};

export const RequestDetails = ({ className, id }: RequestDetailsProps) => {
  const { currentUser } = useCurrentUser();
  const { palette } = useColorPalette();

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
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      cardBg: "bg-amber-500/5 border-amber-500/20 dark:bg-amber-500/10",
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      label: isIncoming
        ? "Pending Candidate Review"
        : "Pending Client Response",
      description: isIncoming
        ? "Review the candidate application details below and accept to start working together."
        : "Your application has been submitted and is awaiting client review.",
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
          wrapper: "border-b border-border/50 pb-2",
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
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
      >
        <RequestBanner status={currentStatus} request={request} />

        <RequestUserEntry
          className="px-4"
          user={counterpartyUser}
          isIncoming={isIncoming}
        />

        <RequestJobEntry className="px-4" job={request.job} />

        {/* Application Details */}
        {(request.message || request.proposedPrice) && (
          <View className="mb-6">
            <Text className="text-sm ml-2 font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-2 px-1">
              Application Details
            </Text>
            <View className="p-4 bg-card flex flex-col gap-4">
              {request.proposedPrice && (
                <View className="flex flex-col gap-1">
                  <Text className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                    Proposed Price
                  </Text>
                  <Text className="text-sm font-semibold text-emerald-600">
                    {request.proposedPrice}
                  </Text>
                </View>
              )}

              {request.message && (
                <View className="flex flex-col gap-1.5 pt-3 border-t border-border/40">
                  <Text className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                    Message
                  </Text>
                  <Text className="text-sm text-muted-foreground leading-relaxed italic">
                    "{request.message}"
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Action Footer */}
      {request.status === JobRequestStatus.Pending ? (
        isIncoming ? (
          <IncomingDetailsActionBlock request={request} refetch={refetch} />
        ) : (
          <OutgoingDetailsActionBlock request={request} refetch={refetch} />
        )
      ) : request.status === JobRequestStatus.Approved ? (
        <BottomButtonWrapper>
          <Button
            size="lg"
            className="w-full flex flex-row items-center justify-center gap-2 rounded-2xl h-12"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/main/(tabs)/chat");
            }}
          >
            <Icon as={Mail} size={18} className="text-primary-foreground" />
            <Text className="font-bold text-sm">Send Direct Message</Text>
          </Button>
        </BottomButtonWrapper>
      ) : (
        <BottomButtonWrapper>
          <View className="w-full py-2.5 items-center justify-center bg-muted/30 rounded-2xl border border-border/40">
            <Text className="text-xs font-bold text-muted-foreground text-center">
              This job application has been declined.
            </Text>
          </View>
        </BottomButtonWrapper>
      )}
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
  const approveSheetRef = React.useRef<ActionSheetRef>(null);
  const rejectSheetRef = React.useRef<ActionSheetRef>(null);

  const {
    approveJobRequest,
    isApprovePending,
    rejectJobRequest,
    isRejectPending,
  } = useJobRequestActions({
    onSuccess: () => {
      refetch();
      approveSheetRef.current?.hide();
      rejectSheetRef.current?.hide();
    },
  });

  return (
    <React.Fragment>
      <BottomButtonWrapper>
        <View className="flex flex-row items-center justify-between gap-3 w-full">
          <Button
            size="lg"
            className="flex flex-row flex-1 items-center justify-center gap-2 rounded-2xl h-12"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              approveSheetRef.current?.show();
            }}
            disabled={isApprovePending || isRejectPending}
          >
            {isApprovePending ? (
              <ActivityIndicator size="small" />
            ) : (
              <Icon as={Check} size={18} className="text-primary-foreground" />
            )}
            <Text className="font-bold text-sm">Approve</Text>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="flex flex-row flex-1 items-center justify-center gap-2 rounded-2xl h-12 border-destructive/40"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              rejectSheetRef.current?.show();
            }}
            disabled={isApprovePending || isRejectPending}
          >
            {isRejectPending ? (
              <ActivityIndicator size="small" />
            ) : (
              <Icon as={X} size={18} className="text-destructive" />
            )}
            <Text className="font-bold text-sm text-destructive">Decline</Text>
          </Button>
        </View>
      </BottomButtonWrapper>

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
  const cancelSheetRef = React.useRef<ActionSheetRef>(null);

  const { cancelJobRequest, isCancelPending } = useJobRequestActions({
    onSuccess: () => {
      refetch();
      cancelSheetRef.current?.hide();
    },
  });

  return (
    <React.Fragment>
      <BottomButtonWrapper>
        <Button
          size="lg"
          variant="outline"
          className="w-full flex flex-row items-center justify-center gap-2 rounded-2xl h-12 border-destructive/40"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            cancelSheetRef.current?.show();
          }}
          disabled={isCancelPending}
        >
          {isCancelPending ? (
            <ActivityIndicator size="small" />
          ) : (
            <Icon as={X} size={18} className="text-destructive" />
          )}
          <Text className="font-bold text-sm text-destructive">
            Withdraw Application
          </Text>
        </Button>
      </BottomButtonWrapper>

      <WithdrawJobRequestActionSheet
        ref={cancelSheetRef}
        request={request}
        onConfirm={() => cancelJobRequest(request.id)}
        onClose={() => cancelSheetRef.current?.hide()}
        isPending={isCancelPending}
      />
    </React.Fragment>
  );
};
