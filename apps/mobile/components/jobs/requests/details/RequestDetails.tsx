import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { type ActionSheetRef } from "react-native-actions-sheet";
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
  Clock,
  Sparkles,
  BadgeDollarSign,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
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
import { useColorPalette } from "@/hooks/useColorPalette";
import { ApproveJobRequestActionSheet } from "./ApproveJobRequestActionSheet";
import { DeclineJobRequestActionSheet } from "./DeclineJobRequestActionSheet";
import { WithdrawJobRequestActionSheet } from "./WithdrawJobRequestActionSheet";

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
    size: { width: 120, height: 120 },
    className: "rounded-2xl w-full h-full",
  });

  if (isPending) {
    return (
      <StableSafeAreaView className="flex-1 bg-background">
        <ApplicationHeader
          classNames={{
            wrapper: "border-b border-border/60 pb-2.5 bg-background",
          }}
          title={`Request #${id}`}
          titleVariant="large"
          reverse
          shortcuts={[
            { key: "back", icon: ChevronLeft, onPress: () => router.back() },
          ]}
        />
        <View className="p-4 gap-4">
          <Skeleton className="h-28 w-full rounded-3xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-3xl" />
        </View>
      </StableSafeAreaView>
    );
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

  const statusConfig = {
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
  const priceDisplay = formatPrice(request.job);

  const navigateToJobDetails = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (counterpartyUser?.id) {
      router.push({
        pathname: "/main/explore/inspect-profile",
        params: { id: counterpartyUser.id },
      });
    }
  };

  return (
    <StableSafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <ApplicationHeader
        classNames={{
          wrapper: "border-b border-border/50 pb-2.5 bg-background",
        }}
        title={`Request #${request.id}`}
        titleVariant="large"
        reverse
        shortcuts={[
          {
            key: "back",
            icon: ChevronLeft,
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            },
          },
        ]}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Status Card Banner */}
        <View
          className={cn(
            "p-4 flex flex-col gap-3 mb-5 shadow-xs",
            currentStatus.cardBg,
          )}
        >
          <View className="flex flex-row items-center justify-between gap-2">
            <View className="flex flex-row items-center gap-2 flex-1 min-w-0">
              <View
                className={cn(
                  "w-8 h-8 rounded-full items-center justify-center shrink-0",
                  currentStatus.iconBg,
                )}
              >
                <Icon
                  as={currentStatus.icon}
                  size={18}
                  className="currentColor"
                />
              </View>
              <Text
                className="text-sm font-extrabold text-foreground flex-1"
                numberOfLines={1}
              >
                {currentStatus.label}
              </Text>
            </View>

            <Badge
              variant="outline"
              className={cn("px-2.5 py-0.5 shrink-0", currentStatus.badgeStyle)}
            >
              <Text className="text-[11px] font-extrabold currentColor">
                {request.createdAt ? timeAgo(request.createdAt) : "Recently"}
              </Text>
            </Badge>
          </View>

          <Text className="text-xs text-muted-foreground leading-relaxed">
            {currentStatus.description}
          </Text>

          {request.createdAt && (
            <View className="flex flex-row items-center gap-1.5 pt-2 border-t border-border/20">
              <Icon
                as={Clock}
                size={12}
                color={palette?.mutedForeground || "#9CA3AF"}
              />
              <Text className="text-[11px] font-medium text-muted-foreground">
                Submitted:{" "}
                {format(
                  new Date(request.createdAt),
                  "MMM dd, yyyy 'at' hh:mm a",
                )}
              </Text>
            </View>
          )}
        </View>

        {/* Counterparty Profile Banner */}
        <View className="mb-5">
          <Text className="text-sm ml-2 font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-2 px-1">
            {isIncoming ? "Applicant Candidate" : "Job Client"}
          </Text>

          <StablePressable
            className="flex flex-row ml-2 items-center justify-between p-3.5 active:bg-muted/40 gap-3"
            onPress={navigateToCounterpartyProfile}
          >
            <View className="flex flex-row items-center gap-3.5 flex-1">
              <Avatar
                alt={identifyUser(counterpartyUser)}
                style={{ width: 48, height: 48 }}
                className="border-2 border-primary/20 shadow-xs shrink-0"
              >
                <AvatarImage source={counterpartyPicture as ImageSource} />
                <AvatarFallback className="bg-primary/10">
                  <Text className="font-extrabold text-sm text-primary">
                    {identifyUserAvatar(counterpartyUser)}
                  </Text>
                </AvatarFallback>
              </Avatar>

              <View className="flex-1 min-w-0 justify-center gap-1">
                <View className="flex flex-row items-center gap-2">
                  <Text
                    className="text-sm font-extrabold text-foreground flex-1 shrink min-w-0"
                    numberOfLines={1}
                  >
                    {identifyUser(counterpartyUser)}
                  </Text>

                  <Badge
                    variant="secondary"
                    className="px-2 py-0.5 bg-primary/10 border-primary/20 shrink-0"
                  >
                    <Text className="text-[10px] font-extrabold text-primary uppercase">
                      {isIncoming ? "Candidate" : "Client"}
                    </Text>
                  </Badge>
                </View>

                {counterpartyUser?.email ? (
                  <Text
                    className="text-xs text-muted-foreground font-medium"
                    numberOfLines={1}
                  >
                    {counterpartyUser.email}
                  </Text>
                ) : (
                  <Text className="text-xs text-muted-foreground font-medium">
                    Tap to inspect profile
                  </Text>
                )}
              </View>
            </View>

            <View className="w-8 h-8 items-center justify-center shrink-0">
              <Icon as={ChevronRight} size={20} />
            </View>
          </StablePressable>
        </View>

        {/* Job Specifications Card */}
        <View className="mb-6">
          <Text className="text-sm ml-2 font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-2 px-1">
            Job Specifications
          </Text>

          <View className="p-4 bg-card flex flex-col gap-4">
            {/* Top Row: Thumbnail + Title & Price */}
            <View className="flex flex-row gap-3.5">
              {coverUploadId ? (
                <View className="w-20 h-20 rounded-2xl overflow-hidden bg-muted border border-border/50 shrink-0 items-center justify-center shadow-xs">
                  {coverJsx}
                </View>
              ) : (
                <View className="w-20 h-20 rounded-2xl bg-primary/10 items-center justify-center border border-primary/20 shrink-0 shadow-xs">
                  <Icon as={Briefcase} size={30} className="text-primary" />
                </View>
              )}

              <View className="flex-1 justify-between py-0.5">
                <Text className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                  {request.job?.category?.label ?? "Uncategorised"}
                </Text>

                <Text
                  className="text-base font-extrabold leading-snug tracking-tight text-foreground"
                  numberOfLines={2}
                >
                  {request.job?.title || "Untitled Job"}
                </Text>

                {priceDisplay && (
                  <View className="flex flex-row items-center gap-1.5 mt-1">
                    <Icon
                      as={BadgeDollarSign}
                      size={16}
                      className="text-primary"
                    />
                    <Text className="text-base font-extrabold text-primary">
                      {priceDisplay}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Badges / Quick Specs Row */}
            <View className="flex flex-row items-center flex-wrap gap-2 pt-3 border-t border-border/40">
              {request.job?.style && (
                <Badge
                  variant="outline"
                  className="gap-1.5 px-3 py-1 border-border/60 bg-muted/20"
                >
                  <Icon
                    as={Briefcase}
                    size={12}
                    className="text-muted-foreground"
                  />
                  <Text className="text-xs font-semibold text-foreground">
                    {request.job.style}
                  </Text>
                </Badge>
              )}

              {request.job?.difficulty && (
                <Badge
                  variant="outline"
                  className="gap-1.5 px-3 py-1 border-border/60 bg-muted/20"
                >
                  <Icon as={Sparkles} size={12} className="text-amber-500" />
                  <Text className="text-xs font-semibold text-foreground">
                    {request.job.difficulty}
                  </Text>
                </Badge>
              )}

              {request.job?.pricingType && (
                <Badge
                  variant="outline"
                  className="gap-1.5 px-3 py-1 border-border/60 bg-muted/20"
                >
                  <Text className="text-xs font-semibold text-muted-foreground uppercase">
                    {request.job.pricingType}
                  </Text>
                </Badge>
              )}
            </View>

            {/* Description */}
            {request.job?.description ? (
              <View className="pt-3 border-t border-border/40 gap-1.5">
                <Text className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                  Job Description
                </Text>
                <Text className="text-xs text-muted-foreground leading-relaxed font-normal">
                  {request.job.description}
                </Text>
              </View>
            ) : null}

            {/* View Full Job Button */}
            <Button
              size="sm"
              variant="outline"
              className="flex flex-row items-center justify-center gap-2 rounded-2xl mt-1 border-border/70 active:bg-muted/40"
              onPress={navigateToJobDetails}
            >
              <Icon as={ExternalLink} size={14} className="text-foreground" />
              <Text className="text-xs font-bold">View Full Job Listing</Text>
            </Button>
          </View>
        </View>

        {/* Application Details */}
        {(request.message || request.proposedPrice) && (
          <View className="mb-6">
            <Text className="text-sm ml-2 font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-2 px-1">
              Application Details
            </Text>
            <View className="p-4 bg-card flex flex-col gap-4">
              {request.proposedPrice && (
                <View className="flex flex-col gap-1.5">
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
              <ActivityIndicator size="small" color="#ffffff" />
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
