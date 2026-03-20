import React from "react";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Clock3, Compass, Plus } from "lucide-react-native";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { api } from "~/api";
import { StableSafeAreaView } from "~/components/shared/StableSafeAreaView";
import { StableScrollView } from "~/components/shared/StableScrollView";
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StatCard } from "./StatCard";
import { useScrollableElement } from "~/hooks/useScrollableElement";

interface HomeProps {
  className?: string;
}

export const Home = ({ className }: HomeProps) => {
  const { currentUser, isCurrentUserPending } = useCurrentUser();
  const { newCount, resetCount } = useNotificationContext();

  const { data: jobsResp, isPending: isJobsPending } = useQuery({
    queryKey: ["home-jobs"],
    queryFn: () =>
      api.job.findPaginated({
        page: "1",
        limit: "20",
        sort: "createdAt,DESC",
      }),
  });

  const { data: incomingResp, isPending: isIncomingPending } = useQuery({
    queryKey: ["home-job-requests", "incoming"],
    queryFn: () =>
      api.jobRequest.findPaginatedIncoming({
        page: "1",
        limit: "20",
        sort: "createdAt,DESC",
      }),
  });

  const { data: outgoingResp, isPending: isOutgoingPending } = useQuery({
    queryKey: ["home-job-requests", "outgoing"],
    queryFn: () =>
      api.jobRequest.findPaginated({
        page: "1",
        limit: "20",
        sort: "createdAt,DESC",
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
      title: request.job?.title ?? "Untitled job",
      createdAt: new Date(request.createdAt).getTime(),
    }));

    const outgoing = (outgoingResp?.data ?? []).map((request) => ({
      id: `out-${request.id}`,
      type: "Outgoing" as const,
      status: request.status,
      title: request.job?.title ?? "Untitled job",
      createdAt: new Date(request.createdAt).getTime(),
    }));

    return [...incoming, ...outgoing]
      .sort((first, second) => second.createdAt - first.createdAt)
      .slice(0, 4);
  }, [incomingResp?.data, outgoingResp?.data]);

  const activityLoading = isIncomingPending || isOutgoingPending;
  const statsLoading = isJobsPending || isIncomingPending || isOutgoingPending;

  const getStatusStyles = (status: ResponseJobRequestDto["status"]) => {
    if (status === JobRequestStatus.Approved) {
      return "bg-primary/10 text-primary";
    }
    if (status === JobRequestStatus.Rejected) {
      return "bg-destructive/10 text-destructive";
    }
    return "bg-secondary text-secondary-foreground";
  };

  const { animatedHeaderStyle, handleScroll } = useScrollableElement({
    duration: 250,
    deltaThreshold: 40,
  });

  return (
    <StableSafeAreaView className={cn("flex-1 mx-2", className)}>
      <Animated.View style={animatedHeaderStyle}>
        <ApplicationHeader
          title="Home"
          shortcuts={[
            {
              icon: Bell,
              onPress: () => {
                router.push("/main/notifications");
                resetCount();
              },
              badgeText: newCount > 0 ? `${newCount}` : undefined,
            },
          ]}
        />
      </Animated.View>
      <View
        className="flex flex-row flex-1 border-b border-border"
        style={{ minHeight: 500 }}
      >
        <StableScrollView
          className="flex-1 px-2"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View className="rounded-2xl border border-border bg-card p-4 mt-3">
            <Text className="text-sm text-muted-foreground">Welcome back</Text>
            {isCurrentUserPending ? (
              <Skeleton className="h-7 w-56 mt-1" />
            ) : (
              <Text className="text-2xl font-semibold">
                {identifyUser(currentUser)}
              </Text>
            )}
            <Text className="text-sm text-muted-foreground mt-2">
              Keep your momentum today with new opportunities and responses.
            </Text>

            <View className="flex-row gap-2 mt-4">
              <Button
                className="flex-1"
                size="sm"
                onPress={() => router.push("/main/explore/new-job")}
              >
                <Icon as={Plus} size={16} className="text-primary-foreground" />
                <Text>Post Job</Text>
              </Button>
              <Button
                className="flex-1"
                size="sm"
                variant="outline"
                onPress={() => router.push("/main/explore/job-search")}
              >
                <Icon as={Compass} size={16} className="text-foreground" />
                <Text>Explore</Text>
              </Button>
            </View>
          </View>

          <View className="flex-row gap-2 mt-3">
            <StatCard
              title="My Jobs"
              value={myJobsCount}
              subtitle="Active posts"
              loading={statsLoading}
            />
            <StatCard
              title="Incoming"
              value={incomingCount}
              subtitle="Requests received"
              loading={statsLoading}
            />
            <StatCard
              title="Pending"
              value={outgoingPendingCount}
              subtitle="Awaiting approval"
              loading={statsLoading}
            />
          </View>

          <View className="rounded-2xl border border-border bg-card p-4 mt-3">
            <View>
              <Text className="text-lg font-semibold">Quick actions</Text>
            </View>
            <QuickActions />
          </View>

          <View className="rounded-2xl border border-border bg-card p-4 mt-3 mb-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold">Recent activity</Text>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push("/main/my-space/requests")}
              >
                <Text className="text-muted-foreground">View all</Text>
              </Button>
            </View>

            <View className="mt-2">
              {activityLoading ? (
                <View className="gap-3 mt-2">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </View>
              ) : recentActivity.length ? (
                recentActivity.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <View className="py-3">
                      <View className="flex-row items-center justify-between gap-2">
                        <Text className="font-medium flex-1" numberOfLines={1}>
                          {item.title}
                        </Text>
                        <View
                          className={cn(
                            "rounded-full px-2 py-0.5",
                            getStatusStyles(item.status),
                          )}
                        >
                          <Text className="text-xs font-medium capitalize">
                            {item.status}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-1 mt-1">
                        <Icon
                          as={Clock3}
                          size={12}
                          className="text-muted-foreground"
                        />
                        <Text className="text-xs text-muted-foreground">
                          {item.type} request
                        </Text>
                      </View>
                    </View>
                    {index < recentActivity.length - 1 ? <Separator /> : null}
                  </React.Fragment>
                ))
              ) : (
                <View className="items-center py-6">
                  <Text className="text-sm text-muted-foreground">
                    No recent request activity yet.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </StableScrollView>
      </View>
    </StableSafeAreaView>
  );
};
