import React from "react";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Clock3, Compass, Plus } from "lucide-react-native";
import { RefreshControl, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { api } from "~/api";
import { StableSafeAreaView } from "@/components/shared/stables/StableSafeAreaView";
import { ApplicationHeader } from "~/components/shared/AppHeader";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { useNotificationContext } from "~/contexts/NotificationContext";
import { useCurrentUser } from "~/hooks/content/user/useCurrentUser";
import { identifyUser } from "~/lib/user.utils";
import { cn } from "~/lib/utils";
import { JobRequestStatus, ResponseJobRequestDto } from "~/types";
import { QuickActions } from "./QuickActions";
import Animated from "react-native-reanimated";
import { StatCard } from "./StatCard";
import { useScrollableElement } from "~/hooks/useScrollableElement";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useRTL } from "~/hooks/useRTL";

interface HomeProps {
  className?: string;
}

export const Home = ({ className }: HomeProps) => {
  const { palette } = useColorPalette();
  const { currentUser, isCurrentUserPending } = useCurrentUser();
  const { count } = useNotificationContext();
  const isRTL = useRTL();
  const { t } = useTranslation("home");

  const {
    data: jobsResp,
    isPending: isJobsPending,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ["home-jobs"],
    queryFn: () =>
      api.job.findPaginated({
        page: "1",
        limit: "20",
        sort: "createdAt,DESC",
      }),
  });

  const {
    data: incomingResp,
    isPending: isIncomingPending,
    refetch: refetchIncoming,
  } = useQuery({
    queryKey: ["home-job-requests", "incoming"],
    queryFn: () =>
      api.jobRequest.findPaginatedIncoming({
        page: "1",
        limit: "20",
        sort: "createdAt,DESC",
        join: "job",
      }),
  });

  const {
    data: outgoingResp,
    isPending: isOutgoingPending,
    refetch: refetchOutgoing,
  } = useQuery({
    queryKey: ["home-job-requests", "outgoing"],
    queryFn: () =>
      api.jobRequest.findPaginated({
        page: "1",
        limit: "20",
        sort: "createdAt,DESC",
        join: "job",
      }),
  });

  const myJobsCount = React.useMemo(() => {
    if (!currentUser?.id) return 0;
    return (jobsResp?.data ?? []).filter(
      (job) => job.postedById === currentUser.id,
    ).length;
  }, [jobsResp?.data, currentUser?.id]);

  const incomingCount = incomingResp?.data?.length ?? 0;

  const outgoingPendingCount = React.useMemo(() => {
    return (outgoingResp?.data ?? []).filter(
      (request) => request.status === JobRequestStatus.Pending,
    ).length;
  }, [outgoingResp?.data]);

  const recentActivity = React.useMemo(() => {
    const incoming = (incomingResp?.data ?? []).map((request) => ({
      id: `in-${request.id}`,
      type: "Incoming" as const,
      status: request.status,
      title: request.job?.title,
      createdAt: new Date(request.createdAt).getTime(),
    }));

    const outgoing = (outgoingResp?.data ?? []).map((request) => ({
      id: `out-${request.id}`,
      type: "Outgoing" as const,
      status: request.status,
      title: request.job?.title,
      createdAt: new Date(request.createdAt).getTime(),
    }));

    return [...incoming, ...outgoing]
      .sort((first, second) => second.createdAt - first.createdAt)
      .slice(0, 4);
  }, [incomingResp?.data, outgoingResp?.data]);

  const getStatusStyles = (status: ResponseJobRequestDto["status"]) => {
    if (status === JobRequestStatus.Approved) {
      return "bg-primary/10 text-primary";
    }
    if (status === JobRequestStatus.Rejected) {
      return "bg-destructive/10 text-destructive";
    }
    if (status === JobRequestStatus.Waitlist) {
      return "bg-blue-500/10 text-blue-500";
    }
    return "bg-secondary text-secondary-foreground";
  };

  const { animatedHeaderStyle, contentAnimatedStyle, handleScroll } =
    useScrollableElement({
      duration: 250,
      deltaThreshold: 40,
      checkScrollable: true,
    });

  const isRefreshing = isJobsPending || isIncomingPending || isOutgoingPending;

  const handleRefresh = () => {
    refetchJobs();
    refetchIncoming();
    refetchOutgoing();
  };

  return (
    <StableSafeAreaView className={cn("flex-1", className)}>
      <Animated.View style={animatedHeaderStyle}>
        <ApplicationHeader
          title={t("title")}
          shortcuts={[
            {
              key: "notifications",
              icon: Bell,
              onPress: () => {
                router.push("/main/notifications");
              },
              badgeText: count > 0 ? `${count}` : undefined,
            },
          ]}
        />
      </Animated.View>
      <Animated.View
        className="flex flex-row flex-1 border-border px-4"
        style={contentAnimatedStyle}
      >
        <ScrollView
          className="flex-1"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          <View className="rounded-2xl border border-border bg-card p-4 mt-3">
            <Text className="text-sm text-muted-foreground">
              {t("welcomeBack")}
            </Text>

            <Text className="text-2xl font-semibold">
              {isCurrentUserPending ? "-" : identifyUser(currentUser)}
            </Text>

            <Text className="text-sm text-muted-foreground mt-2">
              {t("welcomeSubtitle")}
            </Text>

            <View
              className={cn("flex-row gap-2 mt-4", isRTL && "flex-row-reverse")}
            >
              <Button
                className={cn("flex-1", isRTL && "flex-row-reverse")}
                size="sm"
                onPress={() => router.push("/main/my-space/new-job")}
              >
                <Icon as={Plus} size={20} color={palette.primaryForeground} />
                <Text>{t("postJob")}</Text>
              </Button>
              <Button
                className={cn("flex-1", isRTL && "flex-row-reverse")}
                size="sm"
                variant="outline"
                onPress={() => router.push("/main/explore/job-search")}
              >
                <Icon as={Compass} size={20} color={palette.foreground} />
                <Text>{t("explore")}</Text>
              </Button>
            </View>
          </View>

          <View
            className={cn("flex-row gap-2 mt-3", isRTL && "flex-row-reverse")}
          >
            <StatCard
              className="p-3"
              title={t("stats.myJobs.title")}
              value={myJobsCount}
              subtitle={t("stats.myJobs.subtitle")}
              loading={isJobsPending}
            />
            <StatCard
              className="p-3"
              title={t("stats.incoming.title")}
              value={incomingCount}
              subtitle={t("stats.incoming.subtitle")}
              loading={isIncomingPending}
            />
            <StatCard
              className="p-3"
              title={t("stats.pending.title")}
              value={outgoingPendingCount}
              subtitle={t("stats.pending.subtitle")}
              loading={isOutgoingPending}
            />
          </View>

          <View className="rounded-2xl border border-border bg-card p-4 mt-3">
            <View>
              <Text className="text-lg font-semibold">
                {t("quickActions.title")}
              </Text>
            </View>
            <QuickActions />
          </View>

          <View className="rounded-2xl border border-border bg-card p-4 mt-3 mb-6">
            <View
              className={cn(
                "flex-row items-center justify-between",
                isRTL && "flex-row-reverse",
              )}
            >
              <Text className="text-lg font-semibold">
                {t("recentActivity.title")}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push("/main/my-space/requests")}
              >
                <Text className="text-muted-foreground">
                  {t("recentActivity.viewAll")}
                </Text>
              </Button>
            </View>

            <View className="mt-2">
              {isJobsPending || isIncomingPending || isOutgoingPending ? (
                <View className="gap-3 mt-2">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </View>
              ) : recentActivity.length ? (
                recentActivity.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <View className="py-3">
                      <View
                        className={cn(
                          "flex-row items-center justify-between gap-2",
                          isRTL && "flex-row-reverse",
                        )}
                      >
                        <Text className="font-medium flex-1">{item.title}</Text>
                        <View
                          className={cn(
                            "rounded-full px-2 py-0.5",
                            getStatusStyles(item.status),
                          )}
                        >
                          <Text className="text-xs font-medium capitalize">
                            {t(
                              `recentActivity.status.${item.status.toLowerCase()}`,
                              item.status,
                            )}
                          </Text>
                        </View>
                      </View>
                      <View
                        className={cn(
                          "flex-row items-center gap-1 mt-1",
                          isRTL && "flex-row-reverse",
                        )}
                      >
                        <Icon
                          as={Clock3}
                          size={12}
                          className="text-muted-foreground"
                        />
                        <Text className="text-xs text-muted-foreground">
                          {item.type === "Incoming"
                            ? t("recentActivity.incomingRequest")
                            : t("recentActivity.outgoingRequest")}
                        </Text>
                      </View>
                    </View>
                    {index < recentActivity.length - 1 ? <Separator /> : null}
                  </React.Fragment>
                ))
              ) : (
                <View className="items-center py-6">
                  <Text className="text-sm text-muted-foreground">
                    {t("recentActivity.empty")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </StableSafeAreaView>
  );
};
